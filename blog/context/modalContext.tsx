"use client"; // This is a client component
import React, { createContext, useState } from 'react';

interface ModalContextProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  confirmModalOpen: boolean;
  setConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isPost: boolean;
  setIsPost: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialModalContext: ModalContextProps = {
  isModalOpen: false,
  setIsModalOpen: () => {},
  confirmModalOpen: false,
  setConfirmModalOpen: () => {},
  isPost: false,
  setIsPost: () => {},
};

interface Props {
    children: React.ReactNode;
}

const ModalContext = createContext<ModalContextProps>(initialModalContext);

export const ModalProvider: React.FC<Props> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isPost, setIsPost] = useState<boolean>(false);

  return (
    <ModalContext.Provider value={{ isModalOpen, setIsModalOpen, confirmModalOpen, setConfirmModalOpen, isPost, setIsPost }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;