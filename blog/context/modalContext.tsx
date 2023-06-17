"use client"; // This is a client component
import React, { createContext, useState } from 'react';

interface ModalContextProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  confirmModalOpen: boolean;
  setConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialModalContext: ModalContextProps = {
  isModalOpen: false,
  setIsModalOpen: () => {},
  confirmModalOpen: false,
  setConfirmModalOpen: () => {},
};

interface Props {
    children: React.ReactNode;
}

const ModalContext = createContext<ModalContextProps>(initialModalContext);

export const ModalProvider: React.FC<Props> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);


  return (
    <ModalContext.Provider value={{ isModalOpen, setIsModalOpen, confirmModalOpen, setConfirmModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;