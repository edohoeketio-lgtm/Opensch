import { X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const REPORT_REASONS = [
  { id: 'spam', label: 'Spam or malicious content' },
  { id: 'harassment', label: 'Harassment or hate speech' },
  { id: 'inappropriate', label: 'Inappropriate or explicit content' },
  { id: 'off_topic', label: 'Off-topic for this curriculum' },
  { id: 'other', label: 'Other violation of community guidelines' }
];

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason);
      setSelectedReason(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111111] border border-[#2D2D2D] rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#2D2D2D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#B08D57]/10 border border-[#B08D57]/20">
              <AlertTriangle className="w-5 h-5 text-[#B08D57]" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-[#FFFFFF]">Report Post</h3>
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
          <p className="text-sm text-[#9CA3AF] mb-6">
            Help us keep the community safe. Why are you reporting this post?
          </p>
          
          <div className="space-y-3">
            {REPORT_REASONS.map((reason) => (
              <label 
                key={reason.id}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedReason === reason.id 
                    ? 'bg-[#B08D57]/10 border-[#B08D57]/30' 
                    : 'bg-[#1C1C1E] border-[#2D2D2D] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center h-5">
                  <input 
                    type="radio" 
                    name="report_reason" 
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={() => setSelectedReason(reason.id)}
                    className="w-4 h-4 rounded-full border-[#444] bg-[#111111] checked:bg-[#B08D57] checked:border-[#B08D57] focus:ring-[#B08D57] focus:ring-offset-[#111] text-[#B08D57] accent-[#B08D57]"
                  />
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${selectedReason === reason.id ? 'text-[#FFFFFF]' : 'text-[#D1D5DB]'}`}>
                    {reason.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
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
            disabled={!selectedReason}
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#B08D57] hover:bg-[#96763E] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}
