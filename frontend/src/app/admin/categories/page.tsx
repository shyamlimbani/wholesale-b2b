'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/types';
import { CategoryService } from '@/services/apiService';
import { Plus, Search, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';
import Image from 'next/image';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [parent, setParent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await CategoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Auto-slugify
  useEffect(() => {
    if (!editingCategory) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [name, editingCategory]);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setParent('');
    setImageFile(null);
    setImageUrl('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    
    const parentId = typeof cat.parent === 'object' ? cat.parent?._id : cat.parent;
    setParent(parentId || '');
    
    setImageFile(null);
    setImageUrl(cat.image || '');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('description', description);
    if (parent) {
      formData.append('parent', parent);
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editingCategory) {
        await CategoryService.update(editingCategory._id, formData);
      } else {
        await CategoryService.create(formData);
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? All subcategories will lose their parent link.')) {
      try {
        await CategoryService.delete(id);
        loadCategories();
      } catch (err) {
        console.error('Error deleting category', err);
      }
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchVal.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchVal.toLowerCase())
  );

  const getParentName = (parentVal: any) => {
    if (!parentVal) return '-';
    if (typeof parentVal === 'object' && parentVal !== null) {
      return parentVal.name;
    }
    const match = categories.find((c) => c._id === parentVal);
    return match ? match.name : '-';
  };

  return (
    <div className="space-y-6">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Categories Management</h1>
          <p className="text-sm text-gray-550">Organize wholesale product groupings and hierarchies.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Filter and search row */}
      <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table listing */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-150 p-12 flex justify-center items-center shadow-xs">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
          <span className="text-gray-500 font-semibold">Loading categories...</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-extrabold border-b border-gray-150">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Parent Category</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredCategories.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-55/50">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-gray-50 border rounded-lg overflow-hidden flex items-center justify-center p-1">
                        <Image
                          src={c.image ? getImageUrl(c.image) : "/placeholder.png"}
                          alt=""
                          width={48}
                          height={48}
                          className="max-h-full max-w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{c.name}</div>
                      {c.description && <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{c.description}</div>}
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{c.slug}</td>
                    <td className="px-6 py-4 text-gray-600 font-semibold">{getParentName(c.parent)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 hover:bg-gray-150 text-gray-655 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-450 font-medium">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => !submitting && setIsModalOpen(false)} />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 animate-scale-in flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-gray-800">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                disabled={submitting}
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-500 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {errorMsg && (
                <div className="bg-red-50 text-red-650 p-4 rounded-lg text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Category Name*</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Textiles & Fabrics"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Category Slug*</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. textiles-fabrics"
                />
              </div>

              {/* Parent category */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Parent Category (Optional)</label>
                <select
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None (Top Level Category)</option>
                  {categories
                    .filter((c) => !editingCategory || c._id !== editingCategory._id) // Can't select itself
                    .map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Summarize product types in this category..."
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Upload Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imageUrl && !imageFile && (
                  <div className="mt-3 relative w-16 h-16 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-55">
                    <img src={getImageUrl(imageUrl)} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-6 border-t flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-750 font-bold rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-650 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg text-sm transition flex items-center gap-1.5 shadow-sm"
                >
                  {submitting && <Loader2 className="w-4.5 h-4.5 animate-spin" />}
                  <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
