"use client"; // This is a client component
import React, { createContext, useState } from 'react';

interface ModalContextProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialModalContext: ModalContextProps = {
  isModalOpen: false,
  setIsModalOpen: () => {},
};

interface Props {
    children: React.ReactNode;
}

const ModalContext = createContext<ModalContextProps>(initialModalContext);

export const ModalProvider: React.FC<Props> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;