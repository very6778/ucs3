import React from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle: string;
  loading: boolean;
  itemType: string;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemTitle, loading, itemType }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10 overflow-hidden transform transition-all">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
        </div>
        <div className="px-6 py-4">
          <p className="text-gray-700">
            Are you sure you want to delete this {itemType}? This action cannot be undone.
          </p>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}