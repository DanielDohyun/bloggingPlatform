"use client"; // This is a client component
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import firebase from '../utils/firebase';

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);
      user?.updateProfile({displayName: firstName}).catch(e => console.log(e))
      console.log('User created:', user);
      router.push('/')
      // Handle successful signup
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
      console.error('Error signing up:', error);
      // Handle signup error
    }
  };

  return (
    <div>

    <form className='flex flex-col ' onSubmit={handleSignup}>
      <input className='text-center' type="firstName" placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <input className='text-center' type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        className='text-center'
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign Up</button>
      {error&&
        <p className='text-red-400'>⛔️ {error}</p>
      }
    </form>
    <button type="submit" onClick={(e) => {
      e.preventDefault();
      router.push('/');
    }}>Back to Home</button>
    </div>

  );
};

export default SignupForm;