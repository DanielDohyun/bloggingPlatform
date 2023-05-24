"use client"; // This is a client component
import React, { useState } from 'react';
import firebase from '../../utils/firebase';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log('User logged in');
      // Handle successful login
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle login error
    }
  };

  const onSubmit = () => {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // var token = result.credential.accessToken;
      // The signed-in user info.
      // var user = result.user;
      // ...
    }).catch(function(error) {
     console.error('Error logging in with Google:', error.message);
    });
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <button onClick={onSubmit}>Login with Google</button>
      </form>
    </div>
  );
};

export default LoginPage;