"use client"; // This is a client component
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import firebase from '../../utils/firebase';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log('User logged in');
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
      console.error('Error logging in:', error);
    }
  };

  const onSubmit = () => {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // var token = result.credential.accessToken;
      // The signed-in user info.
      // var user = result.user;
      // ...
      router.push('/');
    }).catch(function (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
      console.error('Error logging in with Google:', error.message);
    });
  }

  return (
    <div className='flex h-[80vh]'>
      <div className='flex-colm text-center w-1/3 md:w-1/2 content-center m-auto'>
        <h1>Sign in to a blog</h1>
        <form className='flex flex-col ' onSubmit={handleLogin}>
          <input
            type="email"
            className='text-center'
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className='text-center'
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className='mr-3' type="submit">Login</button>
        </form>
        <button onClick={onSubmit}>Login with Google</button>
        {error&&
        <p className='text-red-400'>⛔️ {error}</p>
      }
        <button type="submit" onClick={(e) => {
          e.preventDefault();
          router.push('/');
        }}>Back to Home</button>

      </div>
    </div>
  );
};

export default LoginPage;