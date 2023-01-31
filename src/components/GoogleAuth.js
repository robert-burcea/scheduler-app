import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { signInWithGoogle, logout } from '../firebase';
import {useData, useSetData} from '../GlobalContext'

const GoogleAuth = () => {
  const [user, setUser] = useState(null);
  const data = useData();
  const setData = useSetData();
  
  const handleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      setUser(result);
      setData({...data, user: result})
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      logout();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, <img className="rounded-xl" src={user.photoURL} /> {user.displayName}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={handleSignIn}>Sign In with Google</button>
      )}
    </div>
  );
};
export default GoogleAuth;