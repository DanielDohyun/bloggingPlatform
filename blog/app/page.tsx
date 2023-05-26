"use client"; // This is a client component
import Header from '@/components/Header';
import { useContext } from 'react';
import AuthContext from '../context/authContext';

export default function Home() {
  const { user } = useContext(AuthContext);
  console.log(user)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <h1>hi</h1>
    </main>
  )
}
