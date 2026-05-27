'use client';

import React, { useState, useEffect } from 'react';
import { NavbarService } from '@/services/apiService';
import { NavbarLink } from '@/types';
import { Plus, Edit, Trash2, X, Loader2, Link as LinkIcon } from 'lucide-react';

export default function NavbarAdmin() {
  const [links, setLinks] = useState<NavbarLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<NavbarLink | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    order: 0,
    isVisible: true,
  });

  const loadLinks = async () => {
    setLoading(true);
    try {
      const data = await NavbarService.getAll();
      setLinks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleOpenModal = (linkData?: NavbarLink) => {
    if (linkData) {
      setEditingLink(linkData);
      setFormData({
        title: linkData.title,
        link: linkData.link,
        order: linkData.order,
        isVisible: linkData.isVisible,
      });
    } else {
      setEditingLink(null);
      setFormData({
        title: '',
        link: '/',
        order: links.length + 1,
        isVisible: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLink) {
        await NavbarService.update(editingLink._id, formData);
      } else {
        await NavbarService.create(formData);
      }
      handleCloseModal();
      loadLinks();
    } catch (err) {
      console.error(err);
      alert('Error saving navbar link.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this navigation link?')) {
      try {
        await NavbarService.delete(id);
        loadLinks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Navbar Links</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the bottom navigation menu items</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          Add Link
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold w-16 text-center">Order</th>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">URL Path</th>
                <th className="px-6 py-4 font-semibold">Visibility</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {links.map((link) => (
                <tr key={link._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-bold text-gray-400 text-center">{link.order}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{link.title}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-medium w-max">
                      <LinkIcon className="w-3 h-3" />
                      {link.link}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${link.isVisible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {link.isVisible ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleOpenModal(link)}
                      className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(link._id)}
                      className="text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {links.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No navbar links found. Create your first link!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">
                {editingLink ? 'Edit Navbar Link' : 'Add Navbar Link'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <form id="navbar-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Display Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                    placeholder="e.g., About Us"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">URL Path</label>
                  <input
                    type="text"
                    required
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition font-mono text-sm"
                    placeholder="e.g., /about-us or https://external.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must match the slug of the CMS page you want to link to (e.g., /about-us).</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl mt-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.isVisible}
                      onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <span className="text-sm font-semibold text-gray-700">Show link in Navigation Bar</span>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="navbar-form"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition shadow-sm"
              >
                {editingLink ? 'Save Changes' : 'Add Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
