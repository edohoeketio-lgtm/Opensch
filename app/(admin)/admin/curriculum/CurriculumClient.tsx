"use client";

import { useState, useEffect } from 'react';
import { Plus, GripVertical, ChevronDown, ChevronRight, Video, FileText, Settings, BookOpen, X, UploadCloud, AlignLeft, Loader2, Search, Filter, CheckCircle, Trash2 } from 'lucide-react';
import { createModule, createSection, createLesson, updateLessonDetails, deleteLesson, deleteSection, deleteModule } from '@/app/actions/curriculum';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import QuizBuilder from './QuizBuilder';

export interface UI_Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'sprint';
  duration: string;
  status: string;
  muxPlaybackId: string;
  quizData?: any;
}

export interface UI_Section {
  id: string;
  title: string;
  lessons: UI_Lesson[];
  isHidden?: boolean;
}

export interface UI_Module {
  id: string;
  title: string;
  description: string;
  sections: UI_Section[];
  isHidden?: boolean;
}

export default function CurriculumClient({ initialModules, courseId }: { initialModules: UI_Module[], courseId: string }) {
  const [modules, setModules] = useState<UI_Module[]>(initialModules);
  const [expandedModules, setExpandedModules] = useState<string[]>(initialModules.map(m => m.id));
  const [editingLesson, setEditingLesson] = useState<UI_Lesson | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingLesson, setIsDeletingLesson] = useState<string | null>(null);
  const [isDeletingModule, setIsDeletingModule] = useState<string | null>(null);
  const [isDeletingSection, setIsDeletingSection] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadRequest, setUploadRequest] = useState<XMLHttpRequest | null>(null);

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
     const modTitleMatches = mod.title.toLowerCase().includes(searchQuery.toLowerCase());
     
     const filteredSections = mod.sections.map(sec => {
       const secTitleMatches = sec.title.toLowerCase().includes(searchQuery.toLowerCase());
       const filteredLessons = sec.lessons.filter(l => {
         const lessonSearchMatches = l.title.toLowerCase().includes(searchQuery.toLowerCase());
         const lessonTypeMatches = selectedType === 'All Content' || l.type === selectedType.toLowerCase();
         const lessonStatusMatches = selectedStatus === 'All Statuses' || l.status === selectedStatus.toLowerCase();
         return (modTitleMatches || secTitleMatches || lessonSearchMatches) && lessonTypeMatches && lessonStatusMatches;
       });
       return {
         ...sec,
         lessons: filteredLessons,
         isHidden: !modTitleMatches && !secTitleMatches && filteredLessons.length === 0 && searchQuery.length > 0
       };
     }).filter(sec => !sec.isHidden);

     return {
       ...mod,
       sections: filteredSections,
       isHidden: !modTitleMatches && filteredSections.length === 0 && searchQuery.length > 0
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

    if (!editingLesson?.id || editingLesson.id.startsWith('temp-')) {
      toast.error('Please save your new lesson first before uploading video content.');
      setIsUploading(false);
      setTranscriptionStatus(null);
      return;
    }

    try {
      setTranscriptionStatus("Uploading to Supabase Storage...");
      const supabase = createClient();
      const fileExt = file.name.split('.').pop() || 'mp4';
      const fileName = `lesson-${editingLesson.id}-${Date.now()}.${fileExt}`;
      
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        setUploadRequest(xhr);
        
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error("Supabase Storage Error: " + xhr.statusText));
        });

        xhr.addEventListener("error", () => reject(new Error("Network Error occurred.")));
        xhr.addEventListener("abort", () => reject(new Error("Upload cancelled by user.")));

        xhr.open("POST", `${supabaseUrl}/storage/v1/object/Videos/${fileName}`);
        xhr.setRequestHeader("apikey", anonKey);
        xhr.setRequestHeader("Authorization", `Bearer ${session?.access_token || anonKey}`);
        xhr.setRequestHeader("x-upsert", "true");
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        
        xhr.send(file);
      });
      
      const { data: publicUrlData } = supabase.storage.from('Videos').getPublicUrl(fileName);
      
      // Instantly update the UI state with the shiny new Supabase MP4 URL
      setEditingLesson((prev: any) => ({ ...prev, muxPlaybackId: publicUrlData.publicUrl, type: 'video' }));

      setTranscriptionStatus("Transcribing via Whisper API...");
      
      const encodeName = encodeURIComponent(file.name);
      const url = `/api/admin/transcribe?lessonId=${editingLesson.id}&fileName=${encodeName}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
           'Content-Type': file.type || 'application/octet-stream'
        },
        body: file,
      });

      if (!response.ok) {
        let errMessage = 'Transcription failed';
        try {
           const errData = await response.json();
           errMessage = errData.error || errData.details?.lessonId?.[0] || 'Unknown error occurred.';
        } catch(e) {}
        throw new Error(errMessage);
      }

      setTranscriptionStatus("Cleaning with GPT-4o-mini...");
      const data = await response.json();
      
      setEditingLesson((prev: any) => ({
         ...prev,
         description: data.cleanedText || "Transcription complete. No text returned."
      }));
      
    } catch (error: any) {
      console.error(error);
      if (error.message !== 'Upload cancelled by user.') {
         toast.error(error.message || 'Failed to transcribe media.');
      }
    } finally {
      setIsUploading(false);
      setTranscriptionStatus(null);
      setUploadRequest(null);
      setUploadProgress(0);
      if (event.target) event.target.value = '';
    }
  };

  const cancelUpload = () => {
    if (uploadRequest) {
      uploadRequest.abort();
      setUploadRequest(null);
      setIsUploading(false);
      setTranscriptionStatus(null);
      setUploadProgress(0);
      toast.info('Upload cancelled.');
    }
  };

  const retryTranscription = async () => {
    if (!editingLesson?.id || !editingLesson.muxPlaybackId) return;
    
    setIsUploading(true);
    setTranscriptionStatus("Fetching remote video for transcription...");
    setUploadProgress(0);

    try {
      const url = `/api/admin/transcribe?lessonId=${editingLesson.id}&videoUrl=${encodeURIComponent(editingLesson.muxPlaybackId)}`;
      
      const response = await fetch(url, { method: 'POST' });

      if (!response.ok) {
        let errMessage = 'Transcription failed';
        try {
           const errData = await response.json();
           errMessage = errData.error || errData.details?.lessonId?.[0] || 'Unknown error occurred.';
        } catch(e) {}
        throw new Error(errMessage);
      }

      const data = await response.json();
      
      setEditingLesson((prev: any) => ({
         ...prev,
         description: data.cleanedText || "Transcription complete. No text returned."
      }));

      toast.success('Transcription recovered successfully!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to transcribe media.');
    } finally {
      setIsUploading(false);
      setTranscriptionStatus(null);
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
        sections: []
      }
    ]);
    setExpandedModules(prev => [...prev, optimisticId]);

    try {
      await createModule(courseId, newTitle, newOrder);
      // Data will refresh via Server Action revalidatePath implicitly, replacing optimistic ID
    } catch (error) {
       console.error(error);
       toast.error('Failed to create module.');
       // Revert optimistic if needed
    }
  };

  const handleCreateSection = async (moduleId: string) => {
    const targetModule = modules.find(m => m.id === moduleId);
    if (!targetModule) return;
    const newOrder = targetModule.sections.length;
    const optimisticId = `temp-section-${Date.now()}`;
    const newTitle = `New Section`;
    
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, sections: [...m.sections, { id: optimisticId, title: newTitle, lessons: [] }] } : m));
    if (!expandedModules.includes(moduleId)) {
      setExpandedModules(prev => [...prev, moduleId]);
    }

    try {
      await createSection(moduleId, newTitle, newOrder);
    } catch (error) {
       console.error(error);
       toast.error('Failed to create section.');
    }
  };

  const handleCreateLesson = async (moduleId: string, sectionId: string) => {
    const targetModule = modules.find(m => m.id === moduleId);
    const targetSection = targetModule?.sections.find(s => s.id === sectionId);
    if (!targetSection) return;

    const newOrder = targetSection.lessons.length;
    const optimisticTitle = "New Lesson";
    const optimisticId = `temp-lesson-${Date.now()}`;
    
    // Optimistic UI
    setModules(prev => prev.map(m => m.id === moduleId ? {
      ...m,
      sections: m.sections.map(s => s.id === sectionId ? {
        ...s,
        lessons: [...s.lessons, {
          id: optimisticId,
          title: optimisticTitle,
          description: "Write your lesson content here...",
          type: "article",
          duration: "0 mins",
          status: "draft",
          muxPlaybackId: "",
          quizData: []
        }]
      } : s)
    } : m));

    try {
      await createLesson(sectionId, optimisticTitle, newOrder, 'article');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create lesson.');
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
         editingLesson.muxPlaybackId,
         editingLesson.quizData
       );
       setEditingLesson(null);
    } catch (error) {
       console.error(error);
       toast.error('Failed to save content.');
    } finally {
       setIsSaving(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!window.confirm("Are you sure you want to delete this module and ALL of its lessons? This cannot be undone.")) return;
    setIsDeletingModule(moduleId);
    setModules(prev => prev.filter(m => m.id !== moduleId));
    try {
      await deleteModule(moduleId);
      toast.success('Module deleted successfully.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete module.');
    } finally {
      setIsDeletingModule(null);
    }
  };

  const handleDeleteSection = async (moduleId: string, sectionId: string) => {
    if (!window.confirm("Are you sure you want to delete this section and ALL of its lessons? This cannot be undone.")) return;
    setIsDeletingSection(sectionId);
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, sections: m.sections.filter(s => s.id !== sectionId) } : m));
    try {
      await deleteSection(sectionId);
      toast.success('Section deleted successfully.');
    } catch (error) {
       console.error(error);
       toast.error('Failed to delete section.');
    } finally {
      setIsDeletingSection(null);
    }
  };

  const handleDeleteLesson = async (moduleId: string, sectionId: string, lessonId: string) => {
    if (!window.confirm("Are you sure you want to delete this lesson? This cannot be undone.")) return;
    setIsDeletingLesson(lessonId);
    setModules(prev => prev.map(m => m.id === moduleId ? {
      ...m,
      sections: m.sections.map(s => s.id === sectionId ? {
        ...s,
        lessons: s.lessons.filter(l => l.id !== lessonId)
      } : s)
    } : m));
    try {
      await deleteLesson(lessonId);
      toast.success('Lesson deleted successfully.');
    } catch (error) {
       console.error(error);
       toast.error('Failed to delete lesson.');
    } finally {
      setIsDeletingLesson(null);
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
                      {mod.sections.reduce((acc, sec) => acc + sec.lessons.length, 0)} Items
                    </span>
                  </div>
                  <span className="text-[13px] text-admin-muted mt-0.5">{mod.description}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    disabled={isDeletingModule === mod.id}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50" 
                    onClick={(e) => { e.stopPropagation(); handleDeleteModule(mod.id); }}
                    title="Delete Module"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-admin-muted hover:text-surface hover:bg-white/5 transition-colors" onClick={(e) => e.stopPropagation()}>
                    <Settings className="w-4 h-4" />
                  </button>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-admin-muted">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Sections & Lessons List (Expandable) */}
              {isExpanded && (
                <div className="flex flex-col bg-ink p-5 gap-6">
                  {mod.sections.map(section => (
                     <div key={section.id} className="flex flex-col gap-2">
                        {/* Section Header */}
                        <div className="flex items-center justify-between group/sec mb-1 border-b border-admin-border pb-2">
                           <div className="flex items-center gap-2">
                             <div className="w-6 flex justify-center text-[#4A4A5C] opacity-0 group-hover/sec:opacity-100 cursor-grab transition-opacity">
                               <GripVertical className="w-4 h-4" />
                             </div>
                             <h4 className="text-[12px] font-bold tracking-[0.1em] uppercase text-admin-muted">{section.title}</h4>
                           </div>
                           <div className="flex items-center gap-4 pr-2">
                             <button onClick={(e) => { e.stopPropagation(); handleCreateLesson(mod.id, section.id); }} className="text-[10px] uppercase font-bold tracking-[0.1em] text-accent hover:text-white transition-colors opacity-0 group-hover/sec:opacity-100 flex items-center gap-1">
                               <Plus className="w-3 h-3"/> Content
                             </button>
                             <button disabled={isDeletingSection === section.id} onClick={(e) => { e.stopPropagation(); handleDeleteSection(mod.id, section.id); }} className="text-[10px] uppercase font-bold text-red-500 hover:text-red-400 transition-colors opacity-0 group-hover/sec:opacity-100">
                               Delete
                             </button>
                           </div>
                        </div>

                        {/* Lessons inside Section */}
                        {section.lessons.map(lesson => (
                           <div key={lesson.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-admin-surface border border-transparent hover:border-admin-border transition-colors group/item ml-6">
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
                                   onClick={(e) => { e.stopPropagation(); setEditingLesson(lesson); }}
                                   className="text-[10px] font-semibold tracking-[0.2em] uppercase text-admin-muted hover:text-surface opacity-0 group-hover/item:opacity-100 transition-all font-sans"
                                 >
                                   Edit
                                 </button>
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); handleDeleteLesson(mod.id, section.id, lesson.id); }}
                                   disabled={isDeletingLesson === lesson.id}
                                   className="text-[10px] font-semibold tracking-[0.2em] uppercase text-red-500 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all font-sans disabled:opacity-50"
                                 >
                                   {isDeletingLesson === lesson.id ? 'Deleting...' : 'Delete'}
                                 </button>
                               </div>
                           </div>
                        ))}
                        {section.lessons.length === 0 && (
                           <div className="ml-14 text-[11px] text-admin-muted py-2">No lessons in this section.</div>
                        )}
                     </div>
                  ))}

                  {/* Add New Section Button */}
                  <div className="mt-2 ml-6">
                    <button 
                      onClick={() => handleCreateSection(mod.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-semibold tracking-[0.2em] uppercase text-admin-muted hover:text-surface hover:bg-admin-surface-hover transition-colors border border-dashed border-admin-border hover:border-admin-border-hover w-fit"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Section
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
                       <div className="flex items-center justify-between">
                         <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-admin-muted">Video URL</label>
                         {editingLesson.muxPlaybackId && (
                           <button 
                             type="button"
                             onClick={() => setEditingLesson({...editingLesson, muxPlaybackId: '', type: 'article'})}
                             className="text-[9px] font-bold tracking-[0.2em] uppercase text-red-400 hover:text-red-300 transition-colors"
                           >
                             Remove Video
                           </button>
                         )}
                       </div>
                       <input 
                         type="text" 
                         value={editingLesson.muxPlaybackId || ''}
                         onChange={(e) => setEditingLesson({...editingLesson, muxPlaybackId: e.target.value, type: e.target.value ? 'video' : 'article'})}
                         placeholder="https://..."
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
                         type="button"
                         disabled={isUploading && !uploadRequest}
                         onClick={(e) => {
                           if (isUploading && uploadRequest) {
                             e.preventDefault();
                             cancelUpload();
                           }
                         }}
                          className={`w-full relative h-[46px] border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all overflow-hidden cursor-pointer ${
                           isUploading 
                             ? 'bg-admin-surface border-admin-border text-admin-muted' 
                             : 'border-admin-border bg-ink hover:bg-admin-surface-hover hover:border-admin-border-hover text-admin-muted hover:text-surface'
                         }`}
                       >
                          {isUploading ? (
                            <>
                              <div className="absolute inset-y-0 left-0 bg-accent/20 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                              <div className="relative z-10 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                                  {transcriptionStatus} {uploadProgress > 0 && uploadProgress < 100 && `(${uploadProgress}%)`}
                                </span>
                              </div>
                              {uploadRequest && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-red-500 hover:text-red-400 p-1 bg-red-500/10 hover:bg-red-500/20 rounded z-30 pointer-events-auto">
                                  <X className="w-4 h-4" />
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-4 h-4" />
                              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] pointer-events-none">Select Video File</span>
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

              {/* Quiz Builder */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-[13px] font-medium text-surface">Quiz Gatekeeper</h4>
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-admin-muted ml-auto">Adaptive Timestamps</span>
                 </div>
                 <QuizBuilder 
                    lessonId={editingLesson.id}
                    quizData={editingLesson.quizData || []} 
                    onChange={(newQuizData) => setEditingLesson({ ...editingLesson, quizData: newQuizData })} 
                 />
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
