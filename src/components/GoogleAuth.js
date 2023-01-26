import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { signInWithGoogle, logout } from '../firebase';

const GoogleAuth = () => {
  const [user, setUser] = useState(null);
  
  const handleSignIn = () => {
    try {
      const result = signInWithGoogle();
      setUser(result);
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
          <p>Welcome, {user.displayName}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={handleSignIn}>Sign In with Google</button>
      )}
    </div>
  );
};
export default GoogleAuth;