// Modal.tsx

import React, { Suspense } from 'react';
import ModalAnimation from './modal.animation';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}


const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <div className="modal-container z-50 bg-white w-[600px] h-[380px] p-4 rounded shadow-lg">
          <div className="modal-header flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-center">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 text-3xl bg-red-500 rounded-full h-[30px] w-[30px] flex items-center justify-center z-60  text-white cursor-pointer focus:outline-none"
            >
              &times;
            </button>
          </div>
          <Suspense fallback={<ModalAnimation/>}>
            <div className="modal-body w-full">
              {children}
            </div>
          </Suspense>
        </div>
      </div>
  );
};

export default Modal;
