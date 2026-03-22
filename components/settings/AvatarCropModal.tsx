"use client";

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check } from 'lucide-react';
import { getCroppedImg } from '@/lib/utils/cropImage';
import { toast } from 'sonner';

interface AvatarCropModalProps {
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

export function AvatarCropModal({ imageSrc, onClose, onCropComplete }: AvatarCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedFile) {
        onCropComplete(croppedFile);
      } else {
        throw new Error("Cropping failed to yield an image");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#111111] border border-[#2D2D2D] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D2D2D]">
          <h3 className="text-lg font-bold text-[#FFFFFF]">Adjust Avatar</h3>
          <button 
            disabled={isProcessing}
            onClick={onClose} 
            className="p-1.5 rounded-lg text-[#888888] hover:text-[#FFFFFF] hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative w-full h-[400px] bg-[#050505]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1} // 1:1 aspect ratio for avatars
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
          />
        </div>
        
        {/* Zoom Controls & Actions */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-[#888888] uppercase tracking-[0.1em]">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1 bg-[#2D2D2D] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#FFFFFF] [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#2D2D2D]">
            <button 
              onClick={onClose} 
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl text-[#9CA3AF] text-xs font-bold uppercase tracking-[0.1em] transition-colors hover:text-[#FFFFFF] disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F5F2EB] hover:bg-white text-[#050505] text-xs font-bold uppercase tracking-[0.1em] transition-colors shadow-[0_0_15px_rgba(245,242,235,0.15)] disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : (
                <>
                   <Check className="w-4 h-4" /> Save Avatar
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
