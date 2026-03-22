import re

with open('app/(admin)/admin/curriculum/CurriculumClient.tsx', 'r') as f:
    code = f.read()

# 1. Imports
code = code.replace(
    "import { createModule, createLesson, updateLessonDetails, deleteLesson, deleteModule } from '@/app/actions/curriculum';",
    "import { createModule, createSection, createLesson, updateLessonDetails, deleteLesson, deleteSection, deleteModule } from '@/app/actions/curriculum';"
)

# 2. Interfaces
old_interfaces = """export interface UI_Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'sprint';
  duration: string;
  status: string;
  muxPlaybackId: string;
  quizData?: any;
}

export interface UI_Module {
  id: string;
  title: string;
  description: string;
  lessons: UI_Lesson[];
}"""

new_interfaces = """export interface UI_Lesson {
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
}"""
code = code.replace(old_interfaces, new_interfaces)

# 3. State
code = code.replace(
    "const [isDeletingModule, setIsDeletingModule] = useState<string | null>(null);",
    "const [isDeletingModule, setIsDeletingModule] = useState<string | null>(null);\n  const [isDeletingSection, setIsDeletingSection] = useState<string | null>(null);"
)

# 4. Filter logic
old_filter = """  // Derive filtered modules hierarchy
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
  }).filter(mod => !mod.isHidden);"""

new_filter = """  // Derive filtered modules hierarchy
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
  }).filter(mod => !mod.isHidden);"""
code = code.replace(old_filter, new_filter)

# 5. Mod creation
code = code.replace("lessons: []", "sections: []")

# 6. Lesson creation & section creation
old_create = """  const handleCreateLesson = async (moduleId: string) => {
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
                muxPlaybackId: "",
                quizData: []
             }]
          };
       }
       return m;
    }));

    try {
      await createLesson(moduleId, optimisticTitle, newOrder, 'article');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create lesson.');
      // State will self-correct on next revalidation
    }
  };"""

new_create = """  const handleCreateSection = async (moduleId: string) => {
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
  };"""
code = code.replace(old_create, new_create)

# 7. Item Deletions
old_delete = """  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!window.confirm("Are you sure you want to delete this lesson? This cannot be undone.")) return;
    setIsDeletingLesson(lessonId);
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) };
      }
      return m;
    }));
    try {
      await deleteLesson(lessonId);
      toast.success('Lesson deleted successfully.');
    } catch (error) {
       console.error(error);
       toast.error('Failed to delete lesson.');
    } finally {
      setIsDeletingLesson(null);
    }
  };"""

new_delete = """  const handleDeleteSection = async (moduleId: string, sectionId: string) => {
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
  };"""
code = code.replace(old_delete, new_delete)

# 8. Render loop updates
old_render = r"""{mod.lessons.length} Items
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
                            onClick={(e) => { e.stopPropagation(); setEditingLesson(lesson); }}
                            className="text-[10px] font-semibold tracking-[0.2em] uppercase text-admin-muted hover:text-surface opacity-0 group-hover/item:opacity-100 transition-all font-sans"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteLesson(mod.id, lesson.id); }}
                            disabled={isDeletingLesson === lesson.id}
                            className="text-[10px] font-semibold tracking-[0.2em] uppercase text-red-500 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all font-sans disabled:opacity-50"
                          >
                            {isDeletingLesson === lesson.id ? 'Deleting...' : 'Delete'}
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
              )}"""


new_render = r"""{mod.sections.reduce((acc, sec) => acc + sec.lessons.length, 0)} Items
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
              )}"""
code = code.replace(old_render, new_render)

# Write out
with open('app/(admin)/admin/curriculum/CurriculumClient.tsx', 'w') as f:
    f.write(code)

