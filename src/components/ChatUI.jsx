import React, { useEffect, useState } from "react";
import { set, ref, push, get, onValue } from "firebase/database";
import { useUserAuth } from "../context/userContext";
import { database, realtime } from "../configs/firebase";
import { confirmPasswordReset } from "firebase/auth";

const ChatUI = () => {
  const { user, selectedUser } = useUserAuth();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const users = [user.uid, selectedUser.id].sort();
  const messagesRef = ref(database, "messages/" + users[0] + "-" + users[1]);
  const sendMessage = async () => {
    try {
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, {
        sender: user.uid,
        receiver: selectedUser.id,
        message: message,
        timestamp: Date.now(), // Optional: Add a timestamp
      });
      console.log("Message sent successfully!");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  useEffect(() => {
    return onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMessages(Object.values(data));
      }
    });
  }, [selectedUser]);
  return (
    <div className="h-screen flex flex-1 flex-col">
      <div className="bg-gray-200 flex-1 overflow-y-scroll">
        <div className="px-4 py-2">
          {Array.isArray(messages) &&
            messages.map((message) => (
              <>
                {message.sender === selectedUser.id ? (
                  <div className="flex flex-col mt-4 items-start">
                    <div className="flex items-center mb-2">
                      <img
                        className="w-8 h-8 rounded-full mr-2"
                        src={
                          selectedUser.photoURL ||
                          "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=170667a&w=0&k=20&c=EpwfsVjTx8cqJJZzBMp__1qJ_7qSfsMoWRGnVGuS8Ew="
                        }
                        alt="User Avatar"
                      />
                      <div className="font-medium">
                        {selectedUser.displayName}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow inline-block mb-2 ms-6 max-w-sm">
                      {message?.message}
                    </div>
                  </div>
                ) : (
                  <div className="flex mt-4 items-center justify-end">
                    <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
                      {message?.message}
                    </div>
                    <img
                      className="w-8 h-8 rounded-full"
                      src={
                        user.photoURL ||
                        "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=170667a&w=0&k=20&c=EpwfsVjTx8cqJJZzBMp__1qJ_7qSfsMoWRGnVGuS8Ew="
                      }
                      alt="User Avatar"
                    />
                  </div>
                )}
              </>
            ))}
        </div>
      </div>
      <div className="bg-gray-100 px-4 py-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <div className="flex items-center">
            <input
              className="w-full border rounded-full py-2 px-4 mr-2"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatUI;
