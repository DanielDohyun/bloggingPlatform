"use client"; // This is a client component
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useContext } from 'react';
import AuthContext from '../context/authContext';
import ModalContext from '../context/modalContext';
import firebase from '../utils/firebase';
import SigninModal from '@/components/SigninModal';
import Posts from '@/components/Post';

const MainPage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [newPost, setNewPost] = useState<string>('');
  const [curPost, setCurPost] = useState<boolean>(true);
  const { isModalOpen, setIsModalOpen } = useContext(ModalContext);

  let initial: string = '';
  if (user?.displayName) {
    initial = user?.displayName[0].toUpperCase();
  }

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setIsModalOpen(true);
      return;
    }

    if (!newPost) {
      setCurPost(false);
      return;
    }

    try {
      await firebase.firestore().collection('posts').add({
        content: newPost,
        userId: user?.uid,
        useName: user?.displayName,
        createdAt: new Date(),
      });

      setNewPost('');
      setCurPost(true);

    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div>
      <Header />
      {/* modal */}
      {
        isModalOpen && <SigninModal onClose={setIsModalOpen} />
      }

      {/* Creating a post */}
      <div className="w-[80vw] md:w-[60vw] lg:w-fit mx-auto pt-[120px]">
        <section className='  max-w-sm md:max-w-md lg:max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-6'>
          <form className='flex' onSubmit={handlePostSubmit}>
            {/* user icon */}
            {initial ?
              <div className="hidden sm:flex relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-300">{initial}</span>
              </div> :
              <div className="hidden sm:flex relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                <svg className=" absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
              </div>
            }

            <div className='flex-col flex-1 flex sm:mx-3'>
              <input
                className='w-[100%] flex-1 bg-gray-200 rounded-full px-3 py-2'
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Write your post here..."
              ></input>
              {
                !curPost &&
                <p className='text-red-400 text-xs px-3 mt-2'>⛔️ Please write something</p>

              }
            </div>
            <button className='hidden sm:block bg-[#1877F2] text-white p-2 rounded' type="submit">Post</button>
          </form>
        </section>

       <Posts />
      </div>

    </div>
  );
};

export default MainPage;