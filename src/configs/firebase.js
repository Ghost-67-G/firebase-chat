import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getDatabase, ref } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCJaFeKUHVcrTbFEtgOIxbBjPsW1d_Hxfs",
    authDomain: "chat-910b2.firebaseapp.com",
    projectId: "chat-910b2",
    storageBucket: "chat-910b2.appspot.com",
    messagingSenderId: "33412264060",
    appId: "1:33412264060:web:fe27668066ca4b0808d9f9",
    measurementId: "G-JSX82WNDP3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const User = collection(firestore, "users")
export const database = getDatabase(app);
export const realtime = ref(database, "messages");
export const storage = getStorage(app);

export default app