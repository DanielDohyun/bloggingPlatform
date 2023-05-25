"use client"; // This is a client component
import { useContext } from 'react';
import AuthContext from '../context/authContext';

export default function Home() {
  const { user } = useContext(AuthContext);
  console.log(user)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>hi</h1>
    </main>
  )
}
