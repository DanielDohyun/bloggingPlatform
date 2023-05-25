"use client"; // This is a client component
import { createContext, useEffect, useState } from 'react';
import firebase from '../utils/firebase';

interface AuthContextProps {
    user: firebase.User | null;
}

interface Props {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps>({ user: null });

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export default AuthContext;