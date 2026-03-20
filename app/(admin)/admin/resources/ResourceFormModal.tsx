"use client";

import { useState, useEffect } from 'react';
import { X, Save, Video, FileText, Wrench } from 'lucide-react';
import { createResource, updateResource } from '@/app/actions/resources';
import { useToast } from '@/app/(portal)/components/ToastContext';

interface ResourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingResource?: any;
  onSuccess?: (resource: any) => void;
}

export function ResourceFormModal({ isOpen, onClose, editingResource, onSuccess }: ResourceFormModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    type: 'ARTICLE' as any,
  });

  useEffect(() => {
    if (editingResource) {
      setFormData({
        title: editingResource.title,
        description: editingResource.description || '',
        url: editingResource.url,
        type: editingResource.type,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        url: '',
        type: 'ARTICLE',
      });
    }
  }, [editingResource, isOpen]);

  // Auto-detect type based on URL
  useEffect(() => {
    if (formData.url && !editingResource) {
      if (formData.url.includes('youtube.com') || formData.url.includes('youtu.be') || formData.url.includes('vimeo')) {
        setFormData(prev => ({ ...prev, type: 'VIDEO' }));
      }
    }
  }, [formData.url, editingResource]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (editingResource) {
        res = await updateResource({ id: editingResource.id, ...formData });
      } else {
        res = await createResource(formData);
      }

      if (res.success) {
        toast({ message: `Resource ${editingResource ? 'updated' : 'added'} successfully`, type: 'success' });
        if (onSuccess && res.resource) {
          onSuccess(res.resource);
        }
        onClose();
      } else {
        toast({ message: res.error || 'Operation failed', type: 'error' });
      }
    } catch (error) {
       toast({ message: 'An unexpected error occurred', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-ink border border-admin-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-admin-border">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-surface">
              {editingResource ? 'Edit Resource' : 'Add Resource'}
            </h2>
            <p className="text-sm text-admin-muted mt-1">
               {editingResource ? 'Update details for this vault item.' : 'Add a new resource to the knowledge vault.'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-admin-muted hover:text-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold tracking-[0.1em] text-admin-muted uppercase mb-2">
              URL Link *
            </label>
            <input
              type="url"
              required
              placeholder="https://youtube.com/watch?v=..."
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className="w-full bg-admin-surface border border-admin-border rounded-xl px-4 py-2.5 text-sm text-surface placeholder:text-admin-muted focus:outline-none focus:border-[#B08D57]/50 focus:ring-1 focus:ring-[#B08D57]/50 transition-all font-mono"
            />
             <p className="text-[10px] text-admin-muted mt-1.5 ml-1">Hint: Youtube links will automatically be embedded.</p>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-[0.1em] text-admin-muted uppercase mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Introduction to Next.js App Router"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-admin-surface border border-admin-border rounded-xl px-4 py-2.5 text-sm text-surface placeholder:text-admin-muted focus:outline-none focus:border-[#B08D57]/50 focus:ring-1 focus:ring-[#B08D57]/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-[0.1em] text-admin-muted uppercase mb-2">
              Short Description
            </label>
            <textarea
              rows={3}
              placeholder="A brief summary of what students will learn..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-admin-surface border border-admin-border rounded-xl px-4 py-2.5 text-sm text-surface placeholder:text-admin-muted focus:outline-none focus:border-[#B08D57]/50 focus:ring-1 focus:ring-[#B08D57]/50 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-[0.1em] text-admin-muted uppercase mb-2">
              Resource Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'VIDEO', label: 'Video', icon: Video, color: 'text-[#B08D57]' },
                { id: 'ARTICLE', label: 'Article', icon: FileText, color: 'text-blue-400' },
                { id: 'TOOL', label: 'Tool', icon: Wrench, color: 'text-green-400' },
              ].map((type) => {
                const isSelected = formData.type === type.id;
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.id as any }))}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      isSelected 
                        ? 'bg-admin-surface border-[#B08D57] shadow-[0_0_15px_rgba(176,141,87,0.1)]' 
                        : 'bg-transparent border-admin-border hover:bg-white/5 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? type.color : 'text-admin-muted'}`} />
                    <span className={`text-[11px] font-bold tracking-wider uppercase ${isSelected ? 'text-surface' : 'text-admin-muted'}`}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-admin-muted hover:text-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#F5F2EB] hover:bg-white text-[#0B0B0C] font-bold text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#0B0B0C]/30 border-t-[#0B0B0C] rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {editingResource ? 'Save Changes' : 'Add Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
