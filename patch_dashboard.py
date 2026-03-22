import re

with open('app/(portal)/dashboard/page.tsx', 'r') as f:
    code = f.read()

# 1. allModules fetching
old_all_modules = """      const allModules = await prisma.module.findMany({
        where: { isPublished: true },
        include: { lessons: { where: { isPublished: true }, select: { id: true } } }
      });
      
      const userProgress = await prisma.progressState.findMany({
        where: { userId: targetUserId, isCompleted: true },
        select: { lessonId: true }
      });
      
      const completedLessonIds = new Set(userProgress.map(p => p.lessonId));
      
      let masteredCount = 0;
      let latestMasteredTitle = "Getting Started";
      for (const mod of allModules) {
        if (mod.lessons.length > 0 && mod.lessons.every(l => completedLessonIds.has(l.id))) {"""

new_all_modules = """      const allModules = await prisma.module.findMany({
        where: { isPublished: true },
        include: { sections: { include: { lessons: { where: { isPublished: true }, select: { id: true } } } } }
      });
      
      const userProgress = await prisma.progressState.findMany({
        where: { userId: targetUserId, isCompleted: true },
        select: { lessonId: true }
      });
      
      const completedLessonIds = new Set(userProgress.map(p => p.lessonId));
      
      let masteredCount = 0;
      let latestMasteredTitle = "Getting Started";
      for (const mod of allModules) {
        const modLessons = mod.sections.flatMap((s: any) => s.lessons);
        if (modLessons.length > 0 && modLessons.every((l: any) => completedLessonIds.has(l.id))) {"""

code = code.replace(old_all_modules, new_all_modules)

# 2. Next assignment fetching
old_next_assignment = """      const nextAssignmentRaw = await prisma.assignment.findFirst({
         orderBy: { createdAt: 'asc' },
         include: { lesson: { include: { module: { include: { course: true } } } } } as any,
         where: {
           submissions: {
              none: { studentId: targetUserId as string, status: 'PASSED' }
           }
         } as any
      });
      
      const nextAssignment = nextAssignmentRaw as any;
      if (nextAssignment && nextAssignment.lesson) {
        const courseSlug = nextAssignment.lesson.module?.course?.slug;
        upcomingAssignment = {
           title: nextAssignment.lesson.title + " Deliverable",
           description: `Submit your work for ${nextAssignment.lesson.title}.`,
           url: `/course/${courseSlug}/module/${nextAssignment.lesson.moduleId}/lesson/${nextAssignment.lesson.id}`,"""

new_next_assignment = """      const nextAssignmentRaw = await prisma.assignment.findFirst({
         orderBy: { createdAt: 'asc' },
         include: { lesson: { include: { section: { include: { module: { include: { course: true } } } } } } } as any,
         where: {
           submissions: {
              none: { studentId: targetUserId as string, status: 'PASSED' }
           }
         } as any
      });
      
      const nextAssignment = nextAssignmentRaw as any;
      if (nextAssignment && nextAssignment.lesson) {
        const courseSlug = nextAssignment.lesson.section?.module?.course?.slug;
        upcomingAssignment = {
           title: nextAssignment.lesson.title + " Deliverable",
           description: `Submit your work for ${nextAssignment.lesson.title}.`,
           url: `/course/${courseSlug}/module/${nextAssignment.lesson.section?.moduleId}/lesson/${nextAssignment.lesson.id}`,"""

code = code.replace(old_next_assignment, new_next_assignment)

# 3. Course fetch for progressMetrics
old_course_fetch_1 = """    const course = await prisma.course.findFirst({
      include: {
        modules: {
          include: {
            lessons: { orderBy: { order: 'asc' } }
          },
          orderBy: { order: 'asc' }
        }
      }
    });"""

new_course_fetch_1 = """    const course = await prisma.course.findFirst({
      include: {
        modules: {
          include: {
            sections: {
              include: { lessons: { orderBy: { order: 'asc' } } },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });"""

code = code.replace(old_course_fetch_1, new_course_fetch_1)

old_mod_progress = """      progressMetrics.moduleProgress = weekDbModules.map(mod => {
        const totalLessons = mod.lessons.length;
        const completedLessons = mod.lessons.filter(l => progressStates.find(p => p.lessonId === l.id && p.isCompleted)).length;
        totalActiveLessons += totalLessons;"""

new_mod_progress = """      progressMetrics.moduleProgress = weekDbModules.map((mod: any) => {
        const modLessons = mod.sections.flatMap((s: any) => s.lessons);
        const totalLessons = modLessons.length;
        const completedLessons = modLessons.filter((l: any) => progressStates.find(p => p.lessonId === l.id && p.isCompleted)).length;
        totalActiveLessons += totalLessons;"""

code = code.replace(old_mod_progress, new_mod_progress)

# 4. Course fetch for resumeUrl
old_course_fetch_2 = """     const course = await prisma.course.findFirst({
         include: {
            modules: { include: { lessons: { orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } }
         }
     });
     
     if (course && targetUserId) {
        const pStates = await prisma.progressState.findMany({ where: { userId: targetUserId }});
        let foundResume = false;
        const studentQuery = params.studentId ? `?studentId=${params.studentId}` : '';
        for (const mod of course.modules) {
           for (const less of mod.lessons) {"""

new_course_fetch_2 = """     const course = await prisma.course.findFirst({
         include: {
            modules: { include: { sections: { include: { lessons: { orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } }
         }
     });
     
     if (course && targetUserId) {
        const pStates = await prisma.progressState.findMany({ where: { userId: targetUserId }});
        let foundResume = false;
        const studentQuery = params.studentId ? `?studentId=${params.studentId}` : '';
        for (const mod of course.modules) {
           for (const sec of mod.sections) {
              for (const less of sec.lessons) {"""

code = code.replace(old_course_fetch_2, new_course_fetch_2)

old_found_resume = """           }
           if (foundResume) break;
        }
        
        if (!foundResume && course.modules.length > 0) {
           const lastMod = course.modules[course.modules.length - 1];
           if (lastMod.lessons.length > 0) {
              const lastLess = lastMod.lessons[lastMod.lessons.length - 1];
              resumeUrl = `/course/${course.slug}/module/${lastMod.id}/lesson/${lastLess.id}${studentQuery}`;
           }
        }"""

new_found_resume = """              }
              if (foundResume) break;
           }
           if (foundResume) break;
        }
        
        if (!foundResume && course.modules.length > 0) {
           const lastMod = course.modules[course.modules.length - 1];
           if (lastMod.sections.length > 0) {
              const lastSec = lastMod.sections[lastMod.sections.length - 1];
              if (lastSec.lessons.length > 0) {
                 const lastLess = lastSec.lessons[lastSec.lessons.length - 1];
                 resumeUrl = `/course/${course.slug}/module/${lastMod.id}/lesson/${lastLess.id}${studentQuery}`;
              }
           }
        }"""

code = code.replace(old_found_resume, new_found_resume)

with open('app/(portal)/dashboard/page.tsx', 'w') as f:
    f.write(code)

