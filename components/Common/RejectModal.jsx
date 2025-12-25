import React from "react";

const RejectModal = ({ isOpen, onClose, onConfirm, isPending }) => {
  const [reason, setReason] = React.useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl scale-in-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Request</h3>
        <p className="text-sm text-gray-500 mb-4">
          Please provide a reason for rejecting this booking. This will be
          shared with the guest.
        </p>

        <textarea
          className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
          rows="4"
          placeholder="e.g., Room is undergoing maintenance during these dates..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!reason.trim() || isPending}
            onClick={() => onConfirm(reason)}
            className="flex-1 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-red-100"
          >
            {isPending ? "Rejecting..." : "Confirm Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
