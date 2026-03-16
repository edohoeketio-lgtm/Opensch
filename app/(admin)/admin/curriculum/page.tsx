"use client";

import { useState } from 'react';
import { Plus, GripVertical, ChevronDown, ChevronRight, Video, FileText, Settings, BookOpen, X, UploadCloud, AlignLeft, Loader2 } from 'lucide-react';

export default function CourseBuilder() {
  const [expandedModules, setExpandedModules] = useState<number[]>([1]);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState<string | null>(null);

  const toggleModule = (id: number) => {
    setExpandedModules(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTranscriptionStatus("Compressing Audio...");

    const formData = new FormData();
    formData.append('file', file);

    try {
      setTranscriptionStatus("Transcribing via Whisper API...");
      const response = await fetch('/api/admin/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      setTranscriptionStatus("Cleaning with GPT-4o-mini...");
      const data = await response.json();
      
      // Update the internal state with the generated GFM markdown
      setEditingLesson((prev: any) => ({
         ...prev,
         description: data.cleanedText || "Transcription complete. No text returned."
      }));
      
    } catch (error) {
      console.error(error);
      alert("Failed to transcribe media.");
    } finally {
      setIsUploading(false);
      setTranscriptionStatus(null);
      if (event.target) event.target.value = '';
    }
  };

  const [modules, setModules] = useState([
    {
      id: 1,
      title: "Module 1: The AI-Native Paradigm",
      description: "Understanding prompt engineering, context windows, and declarative generation.",
      lessons: [
        { id: 101, title: "1.1 Anatomy of a Context Window", type: "video", duration: "12m 4s", status: "published" },
        { id: 102, title: "1.2 Declarative vs Imperative Prompts", type: "video", duration: "18m 22s", status: "published" },
        { id: 103, title: "1.3 Generative UI Boundaries", type: "article", duration: "5m read", status: "published" },
        { id: 104, title: "Sprint 1: Build a Gen-UI Component", type: "sprint", duration: "Due Day 3", status: "published" },
      ]
    },
    {
      id: 2,
      title: "Module 2: Agentic Workflows",
      description: "Chaining prompts and building autonomous data pipelines.",
      lessons: [
        { id: 201, title: "2.1 Tool Calling Fundamentals", type: "video", duration: "24m 10s", status: "draft" },
        { id: 202, title: "2.2 Multi-Agent Orchestration", type: "video", duration: "--", status: "draft" },
      ]
    }
  ]);

  const handleCreateModule = () => {
    const newId = modules.length > 0 ? Math.max(...modules.map(m => m.id)) + 1 : 1;
    setModules(prev => [
      ...prev,
      {
        id: newId,
        title: `Module ${newId}: Untitled Module`,
        description: "Click settings to configure module details.",
        lessons: []
      }
    ]);
    setExpandedModules(prev => [...prev, newId]);
  };

  return (
    <div className="p-8 md:p-14 max-w-[1400px] mx-auto text-[#FFFFFF] space-y-8 pb-32">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-[22px] font-semibold tracking-[-0.02em] text-[#FFFFFF]">Course Builder</h1>
          <p className="text-[#D1D5DB] text-[13px] leading-relaxed">Manage curriculum structure, lessons, and sprint assignments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCreateModule}
            className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] text-[#0B0B0C] text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-white/90 transition-colors shadow-lg shadow-white/10 flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            New Module
          </button>
        </div>
      </div>

      {/* Builder Workspace */}
      <div className="space-y-4">
        {modules.map((mod) => {
          const isExpanded = expandedModules.includes(mod.id);
          
          return (
            <div key={mod.id} className="bg-[#1C1C1E] rounded-2xl border border-[#2D2D2D] overflow-hidden flex flex-col group">
              
              {/* Module Header */}
              <div 
                className={`p-5 flex items-center gap-4 cursor-pointer hover:bg-[#1D1D21] transition-colors ${isExpanded ? 'border-b border-[#2D2D2D] bg-[#1D1D21]' : ''}`}
                onClick={() => toggleModule(mod.id)}
              >
                <div className="w-8 flex justify-center text-[#4A4A5C] group-hover:text-[#888888] cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#FFFFFF]">{mod.title}</span>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#B08D57] px-2 py-0.5 rounded bg-[#111111] border border-[#2D2D2D] font-bold ml-2">
                      {mod.lessons.length} Items
                    </span>
                  </div>
                  <span className="text-[13px] text-[#888888] mt-0.5">{mod.description}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#888888] hover:text-[#FFFFFF] hover:bg-white/5 transition-colors" onClick={(e) => e.stopPropagation()}>
                    <Settings className="w-4 h-4" />
                  </button>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#888888]">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Lessons List (Expandable) */}
              {isExpanded && (
                <div className="flex flex-col bg-[#111111] p-5 gap-2">
                  {mod.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1C1C1E] border border-transparent hover:border-[#2D2D2D] transition-colors group/item">
                      <div className="w-6 flex justify-center text-[#4A4A5C] group-hover/item:text-[#888888] cursor-grab opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        lesson.type === 'video' ? 'bg-blue-500/10 text-blue-400' :
                        lesson.type === 'article' ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {lesson.type === 'video' ? <Video className="w-4 h-4" /> :
                         lesson.type === 'article' ? <FileText className="w-4 h-4" /> :
                         <BookOpen className="w-4 h-4" />}
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <span className="text-[13px] font-medium text-[#FFFFFF]">{lesson.title}</span>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-semibold text-[#888888] uppercase tracking-[0.2em]">{lesson.type}</span>
                          <span className="text-[#4A4A5C] text-[10px]">•</span>
                          <span className="text-[11px] font-medium text-[#888888]">{lesson.duration}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={`text-[9px] font-semibold tracking-[0.2em] uppercase px-2 py-0.5 rounded ${
                          lesson.status === 'published' ? 'bg-[#1D1D21] border border-[#2D2D2D] text-[#B08D57]' : 'bg-transparent text-[#888888]'
                        }`}>
                          {lesson.status}
                        </span>
                        <button 
                          onClick={() => setEditingLesson(lesson)}
                          className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#888888] hover:text-[#FFFFFF] opacity-0 group-hover/item:opacity-100 transition-all font-sans"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Item Button */}
                  <div className="mt-2 ml-14">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-semibold tracking-[0.2em] uppercase text-[#888888] hover:text-[#FFFFFF] hover:bg-[#1D1D21] transition-colors border border-dashed border-[#2D2D2D] hover:border-[#4A4A5C] w-fit">
                      <Plus className="w-3.5 h-3.5" />
                      Add Content
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Media & Content Editor Modal */}
      {editingLesson && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8">
          <div className="bg-[#111111] border border-[#2D2D2D] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col h-full max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#2D2D2D] flex items-center justify-between bg-[#111111]">
              <div className="flex flex-col">
                 <h3 className="text-lg font-semibold text-[#FFFFFF]">Edit Content</h3>
                 <span className="text-[10px] font-semibold text-[#B08D57] uppercase tracking-[0.2em]">{editingLesson.title}</span>
              </div>
              <button 
                onClick={() => setEditingLesson(null)} 
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#888888] hover:text-[#FFFFFF] hover:bg-[#1C1C1E] transition-colors border border-transparent hover:border-[#2D2D2D]"
               >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              
              {/* General Info */}
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#888888]">Lesson Title</label>
                    <input 
                      type="text" 
                      defaultValue={editingLesson.title}
                      className="w-full bg-[#1C1C1E] border border-[#2D2D2D] rounded-xl px-4 py-3 text-[13px] font-medium text-[#FFFFFF] focus:outline-none focus:border-[#B08D57]/50 transition-colors"
                    />
                 </div>
              </div>

              {/* Media Management (Video) */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#FFFFFF]" />
                    <h4 className="text-[13px] font-medium text-[#FFFFFF]">Video Asset</h4>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#888888]">Mux Playback ID</label>
                       <input 
                         type="text" 
                         placeholder="e.g. xyz123abc..."
                         className="w-full bg-[#111111] border border-[#2D2D2D] rounded-xl px-4 py-3 text-[13px] font-medium text-[#FFFFFF] focus:outline-none focus:border-[#B08D57]/50 transition-colors font-mono"
                       />
                    </div>
                    
                    <div className="flex flex-col gap-1.5 relative">
                       <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#888888]">Upload New Media (Generates Transcript)</label>
                       <input 
                         type="file" 
                         accept="video/*,audio/*"
                         onChange={handleFileUpload}
                         disabled={isUploading}
                         className="absolute inset-x-0 bottom-0 h-[46px] opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                       />
                       <button 
                         disabled={isUploading}
                          className={`w-full h-[46px] border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all ${
                           isUploading 
                             ? 'bg-[#1C1C1E] border-[#2D2D2D] text-[#888888]' 
                             : 'border-[#2D2D2D] bg-[#111111] hover:bg-[#1D1D21] hover:border-[#4A4A5C] text-[#888888] hover:text-[#FFFFFF]'
                         }`}
                       >
                          {isUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">{transcriptionStatus}</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-4 h-4" />
                              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Select Video File</span>
                            </>
                          )}
                       </button>
                    </div>
                 </div>
              </div>

              {/* Markdown Content Management */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <AlignLeft className="w-4 h-4 text-[#B08D57]" />
                       <h4 className="text-[13px] font-medium text-[#FFFFFF]">Markdown Content</h4>
                    </div>
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#888888]">Supports GFM</span>
                 </div>
                 
                 <div className="flex flex-col gap-1.5">
                    <textarea 
                      rows={12}
                      defaultValue={editingLesson.description}
                      placeholder="Write your lesson content here using Markdown..."
                      className="w-full bg-[#111111] border border-[#2D2D2D] rounded-xl px-4 py-3 text-[13px] text-[#FFFFFF] focus:outline-none focus:border-[#B08D57]/50 transition-colors font-mono resize-y leading-relaxed"
                    />
                 </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-5 border-t border-[#2D2D2D] flex items-center justify-end gap-3 bg-[#111111]">
               <button 
                 onClick={() => setEditingLesson(null)}
                 className="px-4 py-2.5 rounded-xl text-[10px] font-semibold tracking-[0.2em] uppercase text-[#888888] hover:text-[#FFFFFF] transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={() => setEditingLesson(null)}
                 className="px-6 py-2.5 rounded-xl bg-[#FFFFFF] text-[#0B0B0C] text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-white/90 transition-colors shadow-lg shadow-white/10"
               >
                 Save Content
               </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
