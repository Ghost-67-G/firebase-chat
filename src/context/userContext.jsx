import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { User, auth, realtime } from "../configs/firebase";
import { doc, setDoc } from "firebase/firestore";
import { get } from "firebase/database";
import { createContext, useContext, useEffect, useState } from "react";

const userAuthContext = createContext();

export function useUserAuth() {
  return useContext(userAuthContext);
}

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [linkedUsers, setLinkedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  async function signUp(email, password, displayName) {
    const { user, ...rest } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(user, { displayName });
    await addUserToDB(
      user.uid,
      email,
      displayName,
      user.photoURL,
      rest.providerId
    );
    return user;
  }
  async function addUserToDB(uid, email, displayName, photoURL, providerId) {
    return setDoc(doc(User, uid), {
      email: email,
      displayName: displayName,
      providerId: providerId,
      photoURL: photoURL,
    });
  }
  function logOut() {
    return signOut(auth);
  }
  async function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    const { user, ...rest } = await signInWithPopup(auth, googleAuthProvider);
    await addUserToDB(
      user.uid,
      user.email,
      user.displayName,
      user.photoURL,
      rest.providerId
    );
    return user;
  }

  const getUserMessages = async (uid) => {
    try {
      const allUserMessages = [];
      const snapshot = await get(realtime);
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const messageKey = childSnapshot.key;
          const ids = messageKey.split("-");
          const index = ids.indexOf(uid);

          if (index > -1) {
            if (index == 1) {
              if (!allUserMessages.includes(ids[0])) {
                allUserMessages.push(ids[0]);
              }
            } else {
              if (!allUserMessages.includes(ids[1])) {
                allUserMessages.push(ids[1]);
              }
            }
          }
        });
      }
      setLinkedUsers(allUserMessages);
    } catch (error) {
      console.error("Error fetching user messages:", error);
      return {};
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      if (currentuser?.uid) {
        getUserMessages(currentuser.uid);
      }
      setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{
        user,
        logIn,
        signUp,
        logOut,
        googleSignIn,
        selectedUser,
        setSelectedUser,
        linkedUsers,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}
