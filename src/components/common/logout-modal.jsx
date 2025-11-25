// jsx runtime

import { createPortal } from "react-dom";

export default function LogoutModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative z-10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500"
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold">Log Out of your account</h3>
        <p className="text-sm text-gray-600 mt-2">
          Are you sure you want to log out?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border bg-gray-100"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-black text-white"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );

  // rendered into document.body so the modal overlays the whole page
  return typeof document !== "undefined"
    ? createPortal(modal, document.body)
    : modal;
}
