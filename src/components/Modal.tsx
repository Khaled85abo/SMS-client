import React from 'react';

type ModalProps = {
    children: React.ReactNode;
    onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                <button onClick={onClose} className="float-right text-gray-700 hover:text-gray-900">&times;</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;