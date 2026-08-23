'use client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Providers({ children }) {
  return (
    <>
      {children}
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  );
}
