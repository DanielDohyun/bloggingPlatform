import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useScrollDirection } from '../utils/useScrollDirection';
import firebase from '../utils/firebase';

const Header: React.FC = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY <= 0) {
        setIsCollapsed(false);
      } else if (scrollDirection === 'down') {
        setIsCollapsed(true);
      } else if (scrollDirection === 'up') {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollDirection]);

  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
      console.log('User signed out');
      // Handle successful sign out
    } catch (error) {
      console.error('Error signing out:', error);
      // Handle sign out error
    }
  };

  return (
    <header
      className={`header ${
        isCollapsed ? 'collapsed' : ''
      } bg-black text-white fixed w-full z-50 transition-all duration-300 ease-in-out`}
    >
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="logo">
          {/* <img src="/apple-logo.png" alt="Apple" className="h-8" /> */}
        </div>
        {/* <ul className="flex items-center space-x-6">
          <li>
            <Link href="/">Home</Link>
          </li>
      
        </ul> */}
        <div className="auth-section flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-400">Welcome, {user.displayName}</span>
              <button
                onClick={handleSignOut}
                className="bg-transparent border border-gray-400 text-sm text-gray-400 py-2 px-4 rounded hover:bg-gray-400 hover:text-white transition-all duration-300 ease-in-out"
              >
                Sign Out
              </button>
            </>
          ) : (
            <ul className='flex'>
                <li className="bg-transparent border border-gray-400 text-sm text-gray-400 py-2 px-4 rounded hover:bg-gray-400 hover:text-white transition-all duration-300 ease-in-out mr-3">
                <Link href="/signin">
                  Sign In
              </Link>
                </li>
                <li className="bg-transparent border border-gray-400 text-sm text-gray-400 py-2 px-4 rounded hover:bg-gray-400 hover:text-white transition-all duration-300 ease-in-out">
                <Link href="/signup">
                  Sign Up
              </Link>
                </li>             
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;