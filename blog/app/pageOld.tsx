"use client"; // This is a client component
import CreateBlogPostForm from '@/components/CreateBlogPostForm';
import Header from '@/components/Header';
import { useContext } from 'react';
import AuthContext from '../context/authContext';

export default function Home() {
  const { user } = useContext(AuthContext);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <div>
        <CreateBlogPostForm />
      </div>
      <h1 className='h-[200vh]'>hi</h1>
    </main>
  )
}
