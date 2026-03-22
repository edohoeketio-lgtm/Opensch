import re

with open('app/(portal)/curriculum/CurriculumClient.tsx', 'r') as f:
    code = f.read()

# 1. allLessonsInOrder
code = code.replace(
    "const allLessonsInOrder = course.modules.flatMap((m: any) => m.lessons);",
    "const allLessonsInOrder = course.modules.flatMap((m: any) => m.sections ? m.sections.flatMap((s: any) => s.lessons) : []);"
)

# 2. activeModuleIndex
old_idx = """  if (firstIncompleteLessonId) {
     activeModuleIndex = course.modules.findIndex((m: any) => m.lessons.some((l:any) => l.id === firstIncompleteLessonId));
     if (activeModuleIndex === -1) activeModuleIndex = 0;
  }"""
new_idx = """  if (firstIncompleteLessonId) {
     activeModuleIndex = course.modules.findIndex((m: any) => m.sections?.some((s:any) => s.lessons.some((l:any) => l.id === firstIncompleteLessonId)));
     if (activeModuleIndex === -1) activeModuleIndex = 0;
  }"""
code = code.replace(old_idx, new_idx)

# 3. activeModuleTasks
code = code.replace(
    "const activeModuleTasks = course.modules[activeModuleIndex]?.lessons || [];",
    "const activeModuleTasks = course.modules[activeModuleIndex]?.sections?.flatMap((s: any) => s.lessons) || [];"
)

# 4. allSprints
code = code.replace(
    "const allSprints = week.lessons || [];",
    "const allSprints = week.sections ? week.sections.flatMap((s: any) => s.lessons) : [];"
)

# 5. render loop opening
old_render = """                        {allSprints.length === 0 && (
                          <div className="p-4 text-xs text-[#888888] italic">No lessons in this module yet.</div>
                        )}
                        {allSprints.map((sprint: any, idx: number) => {"""

new_render = """                        {week.sections?.length === 0 && (
                          <div className="p-4 text-xs text-[#888888] italic">No content in this module yet.</div>
                        )}
                        {week.sections?.map((section: any, sIdx: number) => (
                           <div key={section.id} className="flex flex-col">
                              {section.title && (
                                <div className="px-5 py-3 border-b border-[#2D2D2D] bg-[#111111]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                                  <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888888]">{section.title}</h4>
                                </div>
                              )}
                              {section.lessons?.map((sprint: any, idx: number) => {"""

code = code.replace(old_render, new_render)

# 6. closing
old_closing = """                           }
                        })}
                     </div>"""

new_closing = """                           }
                              })}
                           </div>
                        ))}
                     </div>"""

code = code.replace(old_closing, new_closing)

with open('app/(portal)/curriculum/CurriculumClient.tsx', 'w') as f:
    f.write(code)

