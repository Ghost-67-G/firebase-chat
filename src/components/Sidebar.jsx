import { useEffect, useState } from "react";
import { useUserAuth } from "../context/userContext";
import { User } from "../configs/firebase";
import { query, doc, where, getDocs, getDoc } from "firebase/firestore";
import { convertGMTToLocal } from "../utils/functions";
const Sidebar = () => {
  const { user, setSelectedUser, linkedUsers, logOut } = useUserAuth();
  const [userSearch, setUserSearch] = useState();
  const [users, setUsers] = useState([]);
  const [userObjs, setUserObjs] = useState([]);
  async function searchUserByDisplayName() {
    if (!userSearch) return setUsers();
    const q = query(
      User,
      where("displayName", ">=", userSearch),
      where("displayName", "<=", userSearch + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    setUsers(users);
  }

  const getUsersFromIds = async (userIds) => {
    try {
      const users = [];
      for (const userId of userIds) {
        const docSnap = await getDoc(doc(User, userId));

        if (docSnap.exists()) {
          users.push({ id: userId, ...docSnap.data() });
        } else {
          console.log(`User with ID ${userId} not found.`);
        }
      }
      setUserObjs(users); // Return the array of user data
    } catch (error) {
      console.error("Error retrieving users:", error);
      return []; // Return an empty array in case of error
    }
  };

  useEffect(() => {
    setTimeout(() => {
      searchUserByDisplayName();
    }, 1000);
    getUsersFromIds(linkedUsers);
  }, [userSearch, linkedUsers]);

  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-white font-bold uppercase">Chat App </span>
      </div>
      <div className="flex flex-col flex-1 bg-gray-900  overflow-y-auto">
        <div className="max-w-sm mx-auto bg-gray-900 rounded-lg shadow-lg">
          <div className="border-b px-4 pb-6">
            <div className="text-center my-4">
              <img
                className="h-32 w-32 rounded-full border-4 border-gray-800 mx-auto my-4"
                src={
                  user.photoURL ||
                  "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=170667a&w=0&k=20&c=EpwfsVjTx8cqJJZzBMp__1qJ_7qSfsMoWRGnVGuS8Ew="
                }
                alt=""
              />
              <div className="py-2">
                <h3 className="font-bold text-2xl  text-white mb-1">
                  {user.displayName}
                </h3>
                <div className="inline-flex text-gray-300 items-center w-10/12">
                  {convertGMTToLocal(user?.metadata?.lastSignInTime)}
                </div>
              </div>
              <button
                onClick={logOut}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="px-4 py-4">
            <div className="relative">
              <input
                className="appearance-none border-2 border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
                id="username"
                onChange={(e) => setUserSearch(e.target.value)}
                type="text"
                autoComplete="off"
                value={userSearch}
                placeholder="Search..."
              />

              <div className="absolute">
                {users?.map((item) => (
                  <div
                    onClick={() => {
                      setSelectedUser(item);
                      setUsers([]);
                    }}
                    className="flex items-center bg-white mt-3 rounded px-3"
                  >
                    <div className="relative">
                      <img
                        className="h-16 w-16 rounded-full object-cover"
                        src={
                          item?.photoURL ||
                          "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=170667a&w=0&k=20&c=EpwfsVjTx8cqJJZzBMp__1qJ_7qSfsMoWRGnVGuS8Ew="
                        }
                        alt="Avatar"
                      />
                      <div className="absolute inset-0 rounded-full shadow-inner" />
                    </div>
                    <div className="ml-4">
                      <h2 className="font-bold text-gray-800 text-lg">
                        {item?.displayName}
                      </h2>
                      <p className="text-gray-600">{item?.email}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div
                onClick={() => setUserSearch("")}
                className="absolute right-0 inset-y-0 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="-ml-1 mr-3 h-5 w-5 text-gray-400 hover:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="mx-3">
            {userObjs?.map((item) => (
              <div
                onClick={() => setSelectedUser(item)}
                className="flex items-center bg-white mt-3 rounded px-3 cursor-pointer"
              >
                <div className="relative py-2">
                  <img
                    className="h-14 w-14 rounded-full object-cover"
                    src={
                      item?.photoURL ||
                      "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=170667a&w=0&k=20&c=EpwfsVjTx8cqJJZzBMp__1qJ_7qSfsMoWRGnVGuS8Ew="
                    }
                    alt="Avatar"
                  />
                  <div className="absolute inset-0 rounded-full shadow-inner" />
                </div>
                <div className="ml-4">
                  <h2
                    title={item?.displayName}
                    className="font-bold text-gray-800 text-lg"
                  >
                    {item?.displayName}
                  </h2>
                  <p
                    title={item?.email}
                    className="text-gray-600 w-32 overflow-hidden text-ellipsis"
                  >
                    {item?.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
