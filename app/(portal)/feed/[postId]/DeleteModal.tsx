import { X, AlertCircle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ isOpen, onClose, onConfirm }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111111] border border-[#2D2D2D] rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#2D2D2D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <AlertCircle className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-[#FFFFFF]">Delete Thread</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#888888] hover:text-[#FFFFFF] transition-colors rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-[#9CA3AF] leading-relaxed">
            Are you sure you want to permanently delete this thread? This action cannot be undone and will remove all replies and media associated with it.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 bg-[#0A0A0A] border-t border-[#2D2D2D] flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#9CA3AF] hover:text-[#FFFFFF] hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white transition-colors"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
