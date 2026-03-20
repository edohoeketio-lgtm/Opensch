'use server';

import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { ResourceType } from '@prisma/client';

export interface CreateResourceData {
  title: string;
  description?: string;
  url: string;
  type?: ResourceType;
  moduleId?: string;
}

export interface UpdateResourceData {
  id: string;
  title?: string;
  description?: string;
  url?: string;
  type?: ResourceType;
  moduleId?: string;
}

export async function createResource(data: CreateResourceData) {
  const user = await getAuthenticatedUser();
  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    throw new Error('Unauthorized. Only instructors and admins can create resources.');
  }

  // Auto-detect YouTube links if type is not explicitly provided
  let resourceType = data.type || ResourceType.ARTICLE;
  if (!data.type && data.url) {
    if (data.url.includes('youtube.com') || data.url.includes('youtu.be')) {
      resourceType = ResourceType.VIDEO;
    }
  }

  try {
    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        description: data.description || null,
        url: data.url,
        type: resourceType,
        moduleId: data.moduleId || null,
        authorId: user.id,
      },
    });

    revalidatePath('/admin/resources');
    revalidatePath('/resources');
    if (data.moduleId) {
      revalidatePath('/dashboard'); // If it surfaces on dashboard per module
    }

    return { success: true, resource };
  } catch (error) {
    console.error('Failed to create resource:', error);
    return { success: false, error: 'Failed to create resource.' };
  }
}

export async function getResources(filters?: { type?: ResourceType, moduleId?: string }) {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  try {
    const whereClause: any = {};
    if (filters?.type) whereClause.type = filters.type;
    if (filters?.moduleId) whereClause.moduleId = filters.moduleId;

    const resources = await prisma.resource.findMany({
      where: whereClause,
      include: {
        author: {
          include: {
            profile: true,
          }
        },
        module: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, resources };
  } catch (error) {
    console.error('Failed to fetch resources:', error);
    return { success: false, error: 'Failed to fetch resources.' };
  }
}

export async function updateResource(data: UpdateResourceData) {
  const user = await getAuthenticatedUser();
  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    throw new Error('Unauthorized');
  }

  try {
    const resource = await prisma.resource.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        url: data.url,
        type: data.type,
        moduleId: data.moduleId,
      },
    });

    revalidatePath('/admin/resources');
    revalidatePath('/resources');
    
    return { success: true, resource };
  } catch (error) {
    console.error('Failed to update resource:', error);
    return { success: false, error: 'Failed to update resource.' };
  }
}

export async function deleteResource(id: string) {
  const user = await getAuthenticatedUser();
  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    throw new Error('Unauthorized');
  }

  try {
    await prisma.resource.delete({
      where: { id },
    });

    revalidatePath('/admin/resources');
    revalidatePath('/resources');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete resource:', error);
    return { success: false, error: 'Failed to delete resource.' };
  }
}
