"use client";

import { useState } from 'react';
import { Upload, FileAudio, Bot, CheckCircle, Loader2 } from 'lucide-react';

export default function TranscribeTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<{ rawText?: string, cleanedText?: string, error?: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus('processing');
      const response = await fetch('/api/studio/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process video');
      }

      setResult(data);
      setStatus('done');
    } catch (error: any) {
      console.error(error);
      setResult({ error: error.message });
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F2EB] p-12 font-sans selection:bg-[#B08D57]/30">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-white">OpenSch Intelligence Engine</h1>
          <p className="text-[#A7A29A] mt-2">Upload a raw MP4 or MP3 file to test the Whisper + GPT-4o-mini automated pipeline.</p>
        </div>

        {/* Upload Interface */}
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-8">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${file ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/10 text-[#A7A29A]'}`}>
               {file ? <FileAudio className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
            </div>
            <div className="flex-1">
               <input 
                 type="file" 
                 accept="video/*,audio/*" 
                 onChange={handleFileChange}
                 className="block w-full text-sm text-[#A7A29A] file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:uppercase file:tracking-[0.1em] file:bg-[#1D1D21] file:text-[#F5F2EB] hover:file:bg-[#252529] file:cursor-pointer cursor-pointer focus:outline-none"
               />
               {file && <p className="text-xs text-[#7F7A73] mt-2">Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</p>}
            </div>
            
            <button 
              onClick={handleUpload}
              disabled={!file || status === 'uploading' || status === 'processing'}
              className="px-6 py-3 rounded-xl bg-[#F5F2EB] text-[#0B0B0C] font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors flex items-center gap-2"
            >
              {status === 'idle' && 'Process Pipeline'}
              {status === 'uploading' && <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>}
              {status === 'processing' && <><Bot className="w-4 h-4 animate-bounce" /> LLM Parsing...</>}
              {status === 'done' && <><CheckCircle className="w-4 h-4 text-emerald-500" /> Done</>}
              {status === 'error' && 'Retry Failed Pipeline'}
            </button>
          </div>

          {/* Status Pipeline Visualizer */}
          {status !== 'idle' && (
             <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-xs tracking-[0.15em] uppercase font-bold text-[#7F7A73]">
                <div className={`flex items-center gap-2 text-blue-400`}>
                   1. Upload
                </div>
                <div className="h-[1px] flex-1 bg-white/5 mx-4"></div>
                <div className={`flex items-center gap-2 ${(status === 'processing' || status === 'done') ? 'text-amber-400' : ''}`}>
                   2. Whisper-1 (Speech-to-Text)
                </div>
                <div className="h-[1px] flex-1 bg-white/5 mx-4"></div>
                <div className={`flex items-center gap-2 ${status === 'done' ? 'text-emerald-400' : ''}`}>
                   3. GPT-4o-mini (Cleanup)
                </div>
             </div>
          )}
        </div>

        {/* Results Areas */}
        {status === 'error' && result?.error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
               Error: {result.error}
            </div>
        )}

        {status === 'done' && result && (
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-[#121214] border border-white/5 rounded-2xl p-6">
               <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#7F7A73] mb-4 flex items-center gap-2">
                  <FileAudio className="w-3.5 h-3.5" />
                  Raw Whisper Output
               </h3>
               <div className="text-sm leading-relaxed text-[#A7A29A] h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10">
                  {result.rawText}
               </div>
            </div>

            <div className="bg-[#121214] border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 to-orange-500/50"></div>
               <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-500/80 mb-4 flex items-center gap-2">
                  <Bot className="w-3.5 h-3.5" />
                  GPT-4o-mini Cleaned Result
               </h3>
               <div className="text-sm leading-relaxed text-[#F5F2EB] h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10 whitespace-pre-wrap">
                  {result.cleanedText}
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
