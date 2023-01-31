import { initializeApp } from "firebase/app";
import {
 GoogleAuthProvider,
 getAuth,
 signInWithPopup,
 signInWithEmailAndPassword,
 createUserWithEmailAndPassword,
 sendPasswordResetEmail,
 signOut,
 } from "firebase/auth";
import { 
    getFirestore, collection, query, getDocs, where, addDoc
  } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAJTald-E-2DXQ54skxD0qNVx4a31uVsfE",
    authDomain: "scheduler-app-v2.firebaseapp.com",
    projectId: "scheduler-app-v2",
    storageBucket: "scheduler-app-v2.appspot.com",
    messagingSenderId: "10763236568",
    appId: "1:10763236568:web:215cbf88c3c0bcca0913ad",
    measurementId: "G-GPPL54CWJC"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    console.log(user)
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
    return user;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  signOut(auth);
};

const updateFirebaseWeekTargets = async (user, weekTargets) => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
const docs = await getDocs(q);
if (docs.docs.length > 0) {
  const docRef = docs.docs[0].ref;
  console.log(docRef)
  await docRef.update({
    name: user.displayName,
    authProvider: "google",
    email: user.email,
    weekTargets: weekTargets
  });
} else {
  await addDoc(collection(db, "users"), {
    uid: user.uid,
    name: user.displayName,
    authProvider: "google",
    email: user.email,
    weekTargets: weekTargets
  });
}
  } catch (err) {
    console.log("Error updating weekTargets", err);
  }
};

export {
  auth,
  db,
  signInWithGoogle,
  logout,
};
export { app }
export {updateFirebaseWeekTargets}
export default db;