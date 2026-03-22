"use client";

import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { getMyProfile } from "@/app/actions/settings";

export function FacultyPreviewRibbon() {
  const [isInstructor, setIsInstructor] = useState(false);

  useEffect(() => {
    getMyProfile().then((p) => {
      if (p && (p.role === 'INSTRUCTOR' || p.role === 'ADMIN')) {
        setIsInstructor(true);
      }
    });
  }, []);

  if (!isInstructor) return null;

  return (
    <div className="bg-[#B08D57] text-[#111111] px-4 py-2 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">Faculty Omni-Access Mode</span>
        <span className="hidden md:inline text-xs font-medium opacity-80 border-l border-[#111111]/20 pl-2 ml-1">
          Progression locks are disabled. You are viewing the curriculum with unrestricted access.
        </span>
      </div>
      <button 
        onClick={() => {
            // Future expansion: Impersonation toggle
            alert("Student View Impersonation is coming soon. For now, you have Omni-Access to all content.");
        }}
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-[#111111]/10 hover:bg-[#111111]/20 px-3 py-1 rounded transition-colors"
      >
        <Eye className="w-3.5 h-3.5" />
        Student View
      </button>
    </div>
  );
}
