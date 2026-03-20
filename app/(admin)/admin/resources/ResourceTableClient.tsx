"use client";

import { useState } from 'react';
import { Plus, Search, Video, FileText, Wrench, MoreVertical, Trash2, Edit2, PlayCircle } from 'lucide-react';
import { ResourceFormModal } from './ResourceFormModal';
import { deleteResource } from '@/app/actions/resources';
import { useToast } from '@/app/(portal)/components/ToastContext';

export default function ResourceTableClient({ initialResources }: { initialResources: any[] }) {
  const [resources, setResources] = useState(initialResources);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleCreate = () => {
    setEditingResource(null);
    setIsModalOpen(true);
  };

  const handleEdit = (resource: any) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const handleSuccess = (resource: any, isEdit: boolean) => {
    if (isEdit) {
      setResources(prev => prev.map(r => r.id === resource.id ? resource : r));
    } else {
      setResources(prev => [resource, ...prev]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const res = await deleteResource(id);
      if (res.success) {
         setResources(prev => prev.filter(r => r.id !== id));
         toast({ message: 'Resource deleted', type: 'success' });
      } else {
         toast({ message: 'Failed to delete resource', type: 'error' });
      }
    } catch(e) {
      toast({ message: 'An error occurred', type: 'error' });
    }
  };

  const filteredResources = resources.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.url.toLowerCase().includes(searchQuery.toLowerCase()));

  const getIconForType = (type: string) => {
      switch(type) {
          case 'VIDEO': return <Video className="w-4 h-4 text-[#B08D57]" />;
          case 'ARTICLE': return <FileText className="w-4 h-4 text-blue-400" />;
          case 'TOOL': return <Wrench className="w-4 h-4 text-green-400" />;
          default: return <FileText className="w-4 h-4 text-admin-muted" />;
      }
  };

  return (
    <div className="space-y-6">
      {/* Table Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-muted hidden md:block w-full">Managed Resources</h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
          <div className="relative w-full md:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-ink border border-admin-border rounded-xl pl-10 pr-4 py-2.5 text-[13px] font-medium text-surface focus:outline-none focus:border-accent/50 transition-colors placeholder:text-[#4A4A5C]"
            />
          </div>
          <button
            onClick={handleCreate}
            className="md:w-auto px-5 py-2.5 whitespace-nowrap bg-[#FFFFFF] text-[#0B0B0C] text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-white/90 transition-all rounded-xl shadow-lg shadow-white/10 flex items-center justify-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Create
          </button>
        </div>
      </div>

      <div className="bg-admin-surface rounded-2xl border border-admin-border overflow-hidden">
        {filteredResources.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 mb-4 rounded-full bg-white/5 flex items-center justify-center border border-admin-border">
              <PlayCircle className="w-5 h-5 text-admin-muted" />
            </div>
            <h3 className="text-[14px] font-semibold text-surface mb-1">No Resources Found</h3>
            <p className="text-[13px] text-admin-muted max-w-[300px] leading-relaxed">
              You haven't added any resources matching this query.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-admin-border">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-admin-muted bg-ink items-center">
              <div className="col-span-3 lg:col-span-2 pl-2">Format</div>
              <div className="col-span-6 lg:col-span-8">Details</div>
              <div className="col-span-3 lg:col-span-2 text-right pr-4">Actions</div>
            </div>

            {/* Table Rows */}
            {filteredResources.map((resource) => (
              <div key={resource.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-white/[0.02] transition-colors items-center group">
                 <div className="col-span-3 lg:col-span-2 flex items-center gap-2.5 text-[11px] font-bold tracking-wider uppercase text-surface/90 pl-2">
                    {getIconForType(resource.type)}
                    {resource.type}
                 </div>
                 <div className="col-span-6 lg:col-span-8 flex flex-col gap-0.5 pr-4 overflow-hidden">
                    <span className="text-[14px] font-medium text-surface truncate">{resource.title}</span>
                    <a href={resource.url} target="_blank" rel="noreferrer" className="text-[12px] text-admin-muted hover:text-surface transition-colors truncate">
                       {resource.url}
                    </a>
                 </div>
                 <div className="col-span-3 lg:col-span-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                    <button onClick={() => handleEdit(resource)} className="p-2 rounded-lg text-admin-muted hover:text-surface hover:bg-white/10 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(resource.id)} className="p-2 rounded-lg text-admin-muted hover:text-red-400 hover:bg-red-400/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ResourceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingResource={editingResource}
        onSuccess={(resource: any) => handleSuccess(resource, !!editingResource)}
      />
    </div>
  );
}
