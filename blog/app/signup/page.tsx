// pages/CreatePostPage.tsx
"use client"; // This is a client component
import SignupForm from '../../components/SignupForm';
import { useContext } from 'react';
import AuthContext from '../../context/authContext';

const page: React.FC = () => {
    const { user } = useContext(AuthContext);
    return (
        <div className='flex h-[80vh]'>
            <div className='flex-colm text-center min-w-[195px] w-1/3 md:w-1/2 content-center m-auto'>
                <h1 className='font-bold text-3xl mb-3'>Sign up page</h1>
                <SignupForm />
            </div>
        </div>
    );
};

export default page;