import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 px-4">
      <div className="card w-full max-w-sm p-6 relative">
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
        <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={onCancel}>Batal</button>
          <button className="btn-danger" onClick={onConfirm}>Ya, Hapus</button>
        </div>
      </div>
    </div>
  );
}
