import React, { useEffect } from "react";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  "aria-labelledby": string;
  "aria-describedby": string;
}

/**
 * [cite_start]A basic, accessible modal component built from scratch [cite: 72, 259-268].
 */
export const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  onClose,
  ...props
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        role="dialog"
        aria-modal="true"
        {...props}
        className="bg-white rounded-xl shadow-xl w-11/12 max-w-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {children}
      </div>
    </div>
  );
};
