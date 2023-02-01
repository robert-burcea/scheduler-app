import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { signInWithGoogle, logout } from '../firebase';
import {useData, useSetData} from '../GlobalContext'

const GoogleAuth = ({handleSignIn, handleSignOut}) => {

  const data = useData();
  const setData = useSetData();
  
  return (
    <div>
        <button onClick={handleSignIn}>Sign In with Google</button>
    </div>
  );
};
export default GoogleAuth;