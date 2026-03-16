"use client";

import { useState } from 'react';
import { DeliverableSubmissionModal } from './DeliverableSubmissionModal';

interface DeliverableSubmissionFeatureProps {
  sprintTitle: string;
  isReadOnly?: boolean;
}

export function DeliverableSubmissionFeature({ sprintTitle, isReadOnly = false }: DeliverableSubmissionFeatureProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => !isReadOnly && setIsModalOpen(true)}
        disabled={isReadOnly}
        title={isReadOnly ? "Impersonation Mode: Read-Only" : ""}
        className={`text-[11px] font-semibold tracking-[0.2em] uppercase px-5 py-2.5 rounded backdrop-blur-md border transition-all ${
          isReadOnly 
            ? 'bg-transparent text-[#888888] border-[#2D2D2D]/50 cursor-not-allowed' 
            : 'bg-white/10 hover:bg-white text-white/70 hover:text-[#0B0B0C] border-[#2D2D2D] hover:border-transparent'
        }`}>
        {isReadOnly ? "Submit Disabled (Admin)" : "Submit Deliverable"}
      </button>
      <DeliverableSubmissionModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         sprintTitle={sprintTitle} 
      />
    </>
  );
}
