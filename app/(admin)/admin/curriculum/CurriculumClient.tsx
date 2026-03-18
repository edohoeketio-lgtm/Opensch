"use client";

import { useState, useEffect } from 'react';
import { Plus, GripVertical, ChevronDown, ChevronRight, Video, FileText, Settings, BookOpen, X, UploadCloud, AlignLeft, Loader2, Search, Filter, CheckCircle } from 'lucide-react';
import { createModule, createLesson, updateLessonDetails } from '@/app/actions/curriculum';

export interface UI_Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'sprint';
  duration: string;
  status: string;
  muxPlaybackId: string;
}

export interface UI_Module {
  id: string;
  title: string;
  description: string;
  lessons: UI_Lesson[];
}

export default function CurriculumClient({ initialModules, courseId }: { initialModules: UI_Module[], courseId: string }) {
  const [modules, setModules] = useState<UI_Module[]>(initialModules);
  const [expandedModules, setExpandedModules] = useState<string[]>(initialModules.map(m => m.id));
  const [editingLesson, setEditingLesson] = useState<UI_Lesson | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state with server action revalidation updates
  useEffect(() => {
    setModules(initialModules);
  }, [initialModules]);

  // Heavy-duty Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All Content');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('All Statuses');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Derive filtered modules hierarchy
  const displayModules = modules.map(mod => {
     // If the module title itself matches, we keep all lessons inside that match other filters
     // Otherwise we only keep lessons that exactly match title+filters
     const modTitleMatches = mod.title.toLowerCase().includes(searchQuery.toLowerCase());
     
     const filteredLessons = mod.lessons.filter(l => {
       const lessonSearchMatches = l.title.toLowerCase().includes(searchQuery.toLowerCase());
       const lessonTypeMatches = selectedType === 'All Content' || l.type === selectedType.toLowerCase();
       const lessonStatusMatches = selectedStatus === 'All Statuses' || l.status === selectedStatus.toLowerCase();
       
       return (modTitleMatches || lessonSearchMatches) && lessonTypeMatches && lessonStatusMatches;
     });

     return {
       ...mod,
       lessons: filteredLessons,
       isHidden: !modTitleMatches && filteredLessons.length === 0 && searchQuery.length > 0
     };
  }).filter(mod => !mod.isHidden);

  const toggleModule = (id: string) => {
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

  const handleCreateModule = async () => {
    const newOrder = modules.length;
    const optimisticId = `temp-${Date.now()}`;
    const newTitle = `Module ${newOrder + 1}: Untitled Module`;
    
    // Optimistic UI update
    setModules(prev => [
      ...prev,
      {
        id: optimisticId,
        title: newTitle,
        description: "Click settings to configure module details.",
        lessons: []
      }
    ]);
    setExpandedModules(prev => [...prev, optimisticId]);

    try {
      await createModule(courseId, newTitle, newOrder);
      // Data will refresh via Server Action revalidatePath implicitly, replacing optimistic ID
    } catch (error) {
       console.error(error);
       alert("Failed to create module.");
       // Revert optimistic if needed
    }
  };

  const handleCreateLesson = async (moduleId: string) => {
    const targetModule = modules.find(m => m.id === moduleId);
    if (!targetModule) return;

    const newOrder = targetModule.lessons.length;
    const optimisticTitle = "New Lesson";
    const optimisticId = `temp-lesson-${Date.now()}`;
    
    // Optimistic UI
    setModules(prev => prev.map(m => {
       if (m.id === moduleId) {
          return {
             ...m,
             lessons: [...m.lessons, {
                id: optimisticId,
                title: optimisticTitle,
                description: "Write your lesson content here...",
                type: "article",
                duration: "0 mins",
                status: "draft",
                muxPlaybackId: ""
             }]
          };
       }
       return m;
    }));

    try {
      await createLesson(moduleId, optimisticTitle, newOrder, 'article');
    } catch (error) {
      console.error(error);
      alert("Failed to create lesson.");
      // State will self-correct on next revalidation
    }
  };

  const handleSaveContent = async () => {
    if (!editingLesson) return;
    setIsSaving(true);
    try {
       await updateLessonDetails(
         editingLesson.id,
         editingLesson.title,
         editingLesson.description,
         editingLesson.muxPlaybackId
       );
       setEditingLesson(null);
    } catch (error) {
       console.error(error);
       alert("Failed to save content.");
    } finally {
       setIsSaving(false);
    }
  };

  return (
    <div className="p-8 md:p-14 max-w-[1400px] mx-auto text-surface space-y-8 pb-32">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-[22px] font-semibold tracking-[-0.02em] text-surface">Course Builder</h1>
          <p className="text-gray-300 text-[13px] leading-relaxed">Manage curriculum structure, lessons, and sprint assignments.</p>
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

      {/* Advanced Filtering Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-admin-surface border border-admin-border p-3 rounded-2xl relative z-20">
        <div className="relative w-full flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
            <input 
              type="text"
              placeholder="Search modules or lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-ink border border-white/5 text-surface text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-all placeholder:text-admin-muted-dark"
            />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 relative">
            <button 
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-[13px] font-medium transition-all w-full justify-center lg:w-[150px] ${
                selectedType !== 'All Content' 
                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                  : 'bg-ink border-white/5 text-surface hover:bg-white/5'
              }`}
            >
                <Filter className={`w-3.5 h-3.5 ${selectedType !== 'All Content' ? 'text-blue-400' : 'text-admin-muted'}`} />
                {selectedType}
            </button>
            
            {isTypeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsTypeDropdownOpen(false)}></div>
                <div className="absolute top-full left-0 mt-2 w-48 bg-admin-surface border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                   {['All Content', 'Video', 'Article', 'Sprint'].map(t => (
                     <button
                       key={t}
                       onClick={() => { setSelectedType(t); setIsTypeDropdownOpen(false); }}
                       className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-admin-muted hover:text-surface hover:bg-white/5 transition-colors flex items-center justify-between"
                     >
                       <span className="capitalize">{t}</span>
                       {selectedType === t && <CheckCircle className="w-3.5 h-3.5 text-accent" />}
                     </button>
                   ))}
                </div>
              </>
            )}

            <button 
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-[13px] font-medium transition-all w-full justify-center lg:w-[150px] ${
                selectedStatus !== 'All Statuses' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-ink border-white/5 text-surface hover:bg-white/5'
              }`}
            >
                <Filter className={`w-3.5 h-3.5 ${selectedStatus !== 'All Statuses' ? 'text-emerald-400' : 'text-admin-muted'}`} />
                {selectedStatus}
            </button>
            
            {isStatusDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsStatusDropdownOpen(false)}></div>
                <div className="absolute top-full right-0 mt-2 w-48 bg-admin-surface border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                   {['All Statuses', 'Draft', 'Published'].map(s => (
                     <button
                       key={s}
                       onClick={() => { setSelectedStatus(s); setIsStatusDropdownOpen(false); }}
                       className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-admin-muted hover:text-surface hover:bg-white/5 transition-colors flex items-center justify-between"
                     >
                       <span className="capitalize">{s}</span>
                       {selectedStatus === s && <CheckCircle className="w-3.5 h-3.5 text-accent" />}
                     </button>
                   ))}
                </div>
              </>
            )}
        </div>
      </div>

      {/* Builder Workspace */}
      <div className="space-y-4">
        {displayModules.length === 0 ? (
           <div className="p-10 border border-admin-border border-dashed rounded-2xl flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 rounded-full bg-white/5 mb-4 flex items-center justify-center">
               <Search className="w-5 h-5 text-admin-muted" />
             </div>
             <p className="text-surface font-semibold text-[14px]">No match found.</p>
             <p className="text-admin-muted text-[13px] mt-1">Try adjusting details or clearing filters.</p>
             <button onClick={() => { setSearchQuery(''); setSelectedType('All Content'); setSelectedStatus('All Statuses'); }} className="mt-4 px-4 py-2 rounded-lg bg-ink border border-admin-border text-admin-muted text-[10px] uppercase font-semibold hover:text-white">Clear Filters</button>
           </div>
        ) : displayModules.map((mod) => {
          const isExpanded = expandedModules.includes(mod.id);
          
          return (
            <div key={mod.id} className="bg-admin-surface rounded-2xl border border-admin-border overflow-hidden flex flex-col group">
              
              {/* Module Header */}
              <div 
                className={`p-5 flex items-center gap-4 cursor-pointer hover:bg-admin-surface-hover transition-colors ${isExpanded ? 'border-b border-admin-border bg-admin-surface-hover' : ''}`}
                onClick={() => toggleModule(mod.id)}
              >
                <div className="w-8 flex justify-center text-[#4A4A5C] group-hover:text-admin-muted cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-surface">{mod.title}</span>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-accent px-2 py-0.5 rounded bg-ink border border-admin-border font-bold ml-2">
                      {mod.lessons.length} Items
                    </span>
                  </div>
                  <span className="text-[13px] text-admin-muted mt-0.5">{mod.description}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-admin-muted hover:text-surface hover:bg-white/5 transition-colors" onClick={(e) => e.stopPropagation()}>
                    <Settings className="w-4 h-4" />
                  </button>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-admin-muted">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Lessons List (Expandable) */}
              {isExpanded && (
                <div className="flex flex-col bg-ink p-5 gap-2">
                  {mod.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-admin-surface border border-transparent hover:border-admin-border transition-colors group/item">
                      <div className="w-6 flex justify-center text-[#4A4A5C] group-hover/item:text-admin-muted cursor-grab opacity-0 group-hover/item:opacity-100 transition-opacity">
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
                        <span className="text-[13px] font-medium text-surface">{lesson.title}</span>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-semibold text-admin-muted uppercase tracking-[0.2em]">{lesson.type}</span>
                          <span className="text-[#4A4A5C] text-[10px]">•</span>
                          <span className="text-[11px] font-medium text-admin-muted">{lesson.duration}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={`text-[9px] font-semibold tracking-[0.2em] uppercase px-2 py-0.5 rounded ${
                          lesson.status === 'published' ? 'bg-admin-surface-hover border border-admin-border text-accent' : 'bg-transparent text-admin-muted'
                        }`}>
                          {lesson.status}
                        </span>
                        <button 
                          onClick={() => setEditingLesson(lesson)}
                          className="text-[10px] font-semibold tracking-[0.2em] uppercase text-admin-muted hover:text-surface opacity-0 group-hover/item:opacity-100 transition-all font-sans"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Item Button */}
                  <div className="mt-2 ml-14">
                    <button 
                      onClick={() => handleCreateLesson(mod.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-semibold tracking-[0.2em] uppercase text-admin-muted hover:text-surface hover:bg-admin-surface-hover transition-colors border border-dashed border-admin-border hover:border-admin-border-hover w-fit"
                    >
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
          <div className="bg-ink border border-admin-border rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col h-full max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-admin-border flex items-center justify-between bg-ink">
              <div className="flex flex-col">
                 <h3 className="text-lg font-semibold text-surface">Edit Content</h3>
                 <span className="text-[10px] font-semibold text-accent uppercase tracking-[0.2em]">{editingLesson.title}</span>
              </div>
              <button 
                onClick={() => setEditingLesson(null)} 
                className="w-8 h-8 rounded-full flex items-center justify-center text-admin-muted hover:text-surface hover:bg-admin-surface transition-colors border border-transparent hover:border-admin-border"
               >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              
              {/* General Info */}
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-admin-muted">Lesson Title</label>
                    <input 
                      type="text" 
                      value={editingLesson.title}
                      onChange={(e) => setEditingLesson({...editingLesson, title: e.target.value})}
                      className="w-full bg-admin-surface border border-admin-border rounded-xl px-4 py-3 text-[13px] font-medium text-surface focus:outline-none focus:border-accent/50 transition-colors"
                    />
                 </div>
              </div>

              {/* Media Management (Video) */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-surface" />
                    <h4 className="text-[13px] font-medium text-surface">Video Asset</h4>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-admin-muted">Mux Playback ID</label>
                       <input 
                         type="text" 
                         value={editingLesson.muxPlaybackId || ''}
                         onChange={(e) => setEditingLesson({...editingLesson, muxPlaybackId: e.target.value, type: e.target.value ? 'video' : 'article'})}
                         placeholder="e.g. xyz123abc..."
                         className="w-full bg-ink border border-admin-border rounded-xl px-4 py-3 text-[13px] font-medium text-surface focus:outline-none focus:border-accent/50 transition-colors font-mono"
                       />
                    </div>
                    
                    <div className="flex flex-col gap-1.5 relative">
                       <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-admin-muted">Upload New Media (Generates Transcript)</label>
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
                             ? 'bg-admin-surface border-admin-border text-admin-muted' 
                             : 'border-admin-border bg-ink hover:bg-admin-surface-hover hover:border-admin-border-hover text-admin-muted hover:text-surface'
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
                       <AlignLeft className="w-4 h-4 text-accent" />
                       <h4 className="text-[13px] font-medium text-surface">Markdown Content</h4>
                    </div>
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-admin-muted">Supports GFM</span>
                 </div>
                 
                 <div className="flex flex-col gap-1.5">
                    <textarea 
                      rows={12}
                      value={editingLesson.description || ''}
                      onChange={(e) => setEditingLesson({...editingLesson, description: e.target.value})}
                      placeholder="Write your lesson content here using Markdown..."
                      className="w-full bg-ink border border-admin-border rounded-xl px-4 py-3 text-[13px] text-surface focus:outline-none focus:border-accent/50 transition-colors font-mono resize-y leading-relaxed"
                    />
                 </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-5 border-t border-admin-border flex items-center justify-end gap-3 bg-ink">
               <button 
                 onClick={() => setEditingLesson(null)}
                 disabled={isSaving}
                 className="px-4 py-2.5 rounded-xl text-[10px] font-semibold tracking-[0.2em] uppercase text-admin-muted hover:text-surface transition-colors disabled:opacity-50"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleSaveContent}
                 disabled={isSaving}
                 className="px-6 py-2.5 rounded-xl bg-[#FFFFFF] text-[#0B0B0C] text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-white/90 transition-colors shadow-lg shadow-white/10 flex items-center gap-2 disabled:opacity-50"
               >
                 {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                 Save Content
               </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
