import React, { useEffect, useRef, useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ModalContext from "../context/modalContext";
import firebase from "../utils/firebase";

interface DeletePostId {
  deletePostId: string;
}

// const ConfirmDeleteModal: React.FC<DeleteProps> = () => {
const ConfirmDeleteModal: React.FC<DeletePostId> = (deletePostId) => {
  const { confirmModalOpen, setConfirmModalOpen } = useContext(ModalContext);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setConfirmModalOpen(false);
      }
    };
    document.addEventListener("click", checkIfClickedOutside);
    return () => {
      document.removeEventListener("click", checkIfClickedOutside);
    };
  }, [setConfirmModalOpen]);

  const handleDeletePost = async (postId: string) => {
    const user = firebase.auth().currentUser;

    const postRef = firebase.firestore().collection("posts").doc(postId);
    const postSnapshot = await postRef.get();

    if (!postSnapshot.exists) {
      // Post doesn't exist, handle accordingly
      return;
    }

    try {
      // Delete the post
      await postRef.delete();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div ref={ref} className="relative w-auto my-6 mx-auto max-w-3xl z-100">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none z-100">
            {/*header*/}
            <div className="flex items-start justify-end p-5  rounded-t">
              <CloseIcon onClick={() => setConfirmModalOpen(false)} />
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto text-center">
              <ErrorOutlineIcon className="text-9xl" />
              <p className="my-4 text-slate-500 text-lg leading-relaxed">
                Are you sure want to delete the post?
              </p>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                onClick={() => {
                  handleDeletePost(deletePostId.deletePostId);
                  setConfirmModalOpen(false);
                }}
              >
                Yes, I'm sure
              </button>
              <button
                data-modal-hide="popup-modal"
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default ConfirmDeleteModal;
