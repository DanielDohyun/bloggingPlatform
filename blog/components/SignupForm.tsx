"use client"; // This is a client component
import { useState } from 'react';
import firebase from '../utils/firebase';

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);
      console.log('User created:', user);
      
      // Handle successful signup
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle signup error
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;