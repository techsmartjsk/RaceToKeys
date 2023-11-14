// Modal.tsx

import React from 'react';

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
      <div className="modal-container z-50 bg-white w-[600px] h-[250px] p-4 rounded shadow-lg">
        <div className="modal-header flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-center">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 text-3xl cursor-pointer hover:text-gray-700 focus:outline-none"
          >
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;