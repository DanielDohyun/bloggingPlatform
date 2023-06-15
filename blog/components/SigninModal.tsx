import React, { useEffect, useRef, useState, Dispatch, SetStateAction, useContext } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Link from 'next/link';

interface Props {
    onClose: Dispatch<SetStateAction<boolean>>;
}

const SigninModal: React.FC<Props> = (Props) => {
    const [showModal, setShowModal] = useState<boolean>(true);
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (ref.current && !ref.current.contains(e.target)) {
                Props.onClose(false)
            }
        }
        document.addEventListener("click", checkIfClickedOutside)
        return () => {
            document.removeEventListener("click", checkIfClickedOutside)
        }
    }, [Props.onClose])

    return (
        <>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div
                    ref={ref}
                    className="relative w-auto my-6 mx-auto max-w-3xl z-100">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none z-100">
                        {/*header*/}
                        <div className="flex items-start justify-end p-5  rounded-t">
                            <CloseIcon onClick={() => Props.onClose(false)} />
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex-auto text-center">
                            <ErrorOutlineIcon className='text-9xl' />
                            <p className="my-4 text-slate-500 text-lg leading-relaxed">
                                Please Sign in to create, comment, and like posts
                            </p>
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                            <Link
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                href="/login"
                            >
                                Sign in
                            </Link>
                            <Link
                                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                href="/signup">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}

export default SigninModal