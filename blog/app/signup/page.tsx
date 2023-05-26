// pages/CreatePostPage.tsx
"use client"; // This is a client component
import SignupForm from '../../components/SignupForm';
import { useContext } from 'react';
import AuthContext from '../../context/authContext';

const page: React.FC = () => {
  const { user } = useContext(AuthContext);
    console.log(user)
  return (
    <div>
      <h1>Signup page</h1>
      <SignupForm />
    </div>
  );
};

export default page;