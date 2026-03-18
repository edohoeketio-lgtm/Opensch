import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const lessons = await prisma.lesson.findMany({
    select: { id: true, title: true }
  });
  return NextResponse.json(lessons);
}
