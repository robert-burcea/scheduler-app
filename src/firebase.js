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
    getFirestore, collection, query, onSnapshot, doc, 
    setDoc, getDocs, where, addDoc, updateDoc
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
    var user = res.user;
    var firebaseUser = {};
    console.log(user)
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      firebaseUser = {
        uid: user.uid,
        displayName: user.displayName,
        authProvider: "google",
        email: user.email,
        photoURL: user.photoURL,
        weekTargets: []
      }
      await addDoc(collection(db, "users"), {
        ...firebaseUser
      });
      return firebaseUser;
    } else {
      firebaseUser = docs.docs[0].data();
      console.log("firebase.js firebaseUser:", firebaseUser)
      return firebaseUser;
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  signOut(auth);
};

const firebaseFetch = (userId) => {
        
  const colRef = collection(db, 'users');
  const queryRef = query(collection(db, "users"), where("uid", "==", userId));

  onSnapshot(queryRef, (snapshot) => {
      let dbCopy = null;
      console.log(snapshot.docs)
      snapshot.docs.forEach((doc) => {
        dbCopy = doc.data();
      })
      console.log('What i get:',dbCopy.weekTargets);
      return dbCopy;
  })
}


const updateFirebaseWeekTargets = async (user, weekTargets) => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    const docRef = docs.docs[0].ref;
    console.log(docRef)
    await updateDoc(docRef, {
     displayName: user.displayName,
     authProvider: "google",
     email: user.email,
     photoURL: user.photoURL,
     weekTargets: weekTargets
   });
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
export {updateFirebaseWeekTargets, firebaseFetch}
export default db;