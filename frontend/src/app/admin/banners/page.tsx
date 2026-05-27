'use client';

import React, { useState, useEffect } from 'react';
import { Banner } from '@/types';
import { BannerService } from '@/services/apiService';
import { Plus, Search, Edit2, Trash2, X, Loader2, Eye, EyeOff } from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Form states
  const [link, setLink] = useState('');
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await BannerService.getAll();
      setBanners(data);
    } catch (err) {
      console.error('Failed to load banners', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setLink('');
    setActive(true);
    setOrder(0);
    setImageUrl('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (b: Banner) => {
    setEditingBanner(b);
    setLink(b.link || '');
    setActive(b.isActive);
    setOrder(b.order);
    setImageUrl(b.image || '');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const payload = {
      image: imageUrl,
      link,
      isActive: active,
      order,
    };

    try {
      if (editingBanner) {
        await BannerService.update(editingBanner._id, payload as any);
      } else {
        await BannerService.create(payload as any);
      }
      setIsModalOpen(false);
      loadBanners();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save banner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this promotional banner?')) {
      try {
        await BannerService.delete(id);
        loadBanners();
      } catch (err) {
        console.error('Error deleting banner', err);
      }
    }
  };

  const filteredBanners = banners;

  return (
    <div className="space-y-6">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Homepage Banners</h1>
          <p className="text-sm text-gray-550">Configure sliding advertisements and B2B announcements.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Banner
        </button>
      </div>

      {/* Filter and search row */}
      <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search banners by title..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-gray-450 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Banners grid list */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-150 p-12 flex justify-center items-center shadow-xs">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
          <span className="text-gray-500 font-semibold">Loading promo banners...</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-extrabold border-b border-gray-150">
                  <th className="px-6 py-4">Preview</th>
                  <th className="px-6 py-4">Destination Link</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredBanners.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-55/50">
                    <td className="px-6 py-4">
                      <div className="w-24 h-12 bg-gray-50 border rounded-lg overflow-hidden flex items-center justify-center p-1">
                        <img
                          src={b.image ? getImageUrl(b.image) : "/placeholder.png"}
                          alt="Banner"
                          className="max-h-full max-w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs max-w-[200px] truncate">
                      {b.link || 'None'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-bold">{b.order}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        b.isActive
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {b.isActive ? (
                          <>
                            <Eye className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Hidden
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-1.5 hover:bg-gray-150 text-gray-655 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(b._id)}
                          className="p-1.5 hover:bg-red-50 text-red-650 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBanners.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-450 font-medium">
                      No banners found.
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
                {editingBanner ? 'Edit Promo Banner' : 'Add New Banner'}
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
                <div className="bg-red-50 text-red-655 p-4 rounded-lg text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Banner Image URL*</label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                {imageUrl && (
                  <div className="mt-3 relative w-full h-32 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                    <img src={getImageUrl(imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Destination URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Destination Click Link URL</label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. /?category=agriculture-equipment"
                />
              </div>

              {/* Order & Active */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Display Sequence Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 0"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="active"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded-sm focus:ring-blue-500"
                  />
                  <label htmlFor="active" className="text-sm font-bold text-gray-700 select-none">
                    Display active on portal
                  </label>
                </div>
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
                  <span>{editingBanner ? 'Save Changes' : 'Create Banner'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
