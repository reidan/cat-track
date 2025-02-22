const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            ✖
          </button>
        </div>

        {/* Modal Content */}
        <div className="mb-4">{children}</div>

        {/* Modal Actions (buttons, etc.) */}
        <div className="flex justify-end gap-2">{actions}</div>
      </div>
    </div>
  );
};

export default Modal;
