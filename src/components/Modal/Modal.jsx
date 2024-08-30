import React from 'react';

const Modal = ({ children, isOpen, onClose, title, contentStyle }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={contentStyle}>
        <div className="modal-header">
            {title && <h1>{title}</h1>}
            <button className="close-button" onClick={onClose}>×</button>
        </div>
        <hr></hr>
        {children}
        </div>
    </div>
  );
};

export default Modal;
