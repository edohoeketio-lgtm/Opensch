import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { CURRICULUM_WEEKS } from '../lib/content';

const connectionString = (process.env.DATABASE_URL || "").replace(/^"|"$/g, '');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  let admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!admin) {
    console.log('No admin found, creating a default one...');
    admin = await prisma.user.create({
      data: {
        email: 'admin@opensch.com',
        role: 'ADMIN',
      }
    });
  }

  let course = await prisma.course.findFirst();
  if (!course) {
    course = await prisma.course.create({
      data: {
        title: "OpenSch Core Curriculum",
        description: "Main cohort curriculum",
        slug: "core-curriculum",
        instructorId: admin.id
      }
    });
  }

  // We will preserve Week 1 if it already exists to avoid breaking relations,
  // simply upsert or create the others.
  
  for (let i = 0; i < CURRICULUM_WEEKS.length; i++) {
    const week = CURRICULUM_WEEKS[i];
    
    // check if module exists
    let module = await prisma.module.findFirst({
      where: { courseId: course.id, order: week.number }
    });

    if (!module) {
      module = await prisma.module.create({
        data: {
          courseId: course.id,
          title: `Week ${week.number}: ${week.title}`,
          description: week.goal,
          order: week.number
        }
      });
      console.log(`Created Module: ${module.title}`);
    } else {
      console.log(`Module already exists: ${module.title}`);
    }

    if (week.modules && week.modules.length > 0) {
      for (let j = 0; j < week.modules.length; j++) {
        const tsModule = week.modules[j];
        
        let section = await prisma.section.findFirst({
           where: { moduleId: module.id, order: j + 1 }
        });
        
        if (!section) {
           section = await prisma.section.create({
             data: {
               moduleId: module.id,
               title: tsModule.title,
               order: j + 1,
               isPublished: true
             }
           });
           console.log(`  Created section: ${section.title}`);
        } else {
           console.log(`  Section already exists: ${section.title}`);
        }

        if (tsModule.lessons && tsModule.lessons.length > 0) {
           for (let k = 0; k < tsModule.lessons.length; k++) {
              const less = tsModule.lessons[k];
              const existingLesson = await prisma.lesson.findFirst({
                 where: { sectionId: section.id, order: k + 1 }
              });
              
              if (!existingLesson) {
                 await prisma.lesson.create({
                   data: {
                     sectionId: section.id,
                     title: less.title,
                     description: "Lesson content goes here.",
                     order: k + 1,
                     isPublished: true
                   }
                 });
                 console.log(`    Created lesson: ${less.title}`);
              } else {
                 console.log(`    Lesson already exists: ${existingLesson.title}`);
              }
           }
        }
      }
    } else {
        // if no sub-modules list in the static data, just create a placeholder
        let section = await prisma.section.findFirst({
           where: { moduleId: module.id, order: 1 }
        });
        
        if (!section) {
           section = await prisma.section.create({
             data: {
               moduleId: module.id,
               title: "Introduction",
               order: 1,
               isPublished: true
             }
           });
           console.log(`  Created placeholder section`);
        }
        
        const existingLesson = await prisma.lesson.findFirst({
           where: { sectionId: section.id, order: 1 }
        });
        
        if (!existingLesson) {
           await prisma.lesson.create({
             data: {
               sectionId: section.id,
               title: "Introduction to " + week.title,
               description: "Lesson content goes here.",
               order: 1,
               isPublished: true
             }
           });
           console.log(`    Created placeholder lesson`);
        } else {
           console.log(`    Placeholder lesson already exists.`);
        }
    }
  }

  console.log("Seeded curriculum successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
