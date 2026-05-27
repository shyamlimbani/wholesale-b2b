'use client';

import React, { useState, useEffect } from 'react';
import { Lead } from '@/types';
import { LeadService } from '@/services/apiService';
import { Loader2, Trash2, Search, Calendar, Phone, User, Download } from 'lucide-react';

export default function LeadsAdmin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadLeads = async (search = '') => {
    setLoading(true);
    try {
      const data = await LeadService.getAll({ search });
      console.log('Leads state updated with:', data);
      setLeads(data);
    } catch (e) {
      console.error('Failed to load B2B leads', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    loadLeads();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadLeads(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    loadLeads('');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this lead?')) {
      try {
        await LeadService.delete(id);
        loadLeads(searchQuery);
      } catch (err) {
        console.error(err);
        alert('Error deleting lead record');
      }
    }
  };

  // Convert to CSV for Admin download
  const handleExportCSV = () => {
    if (leads.length === 0) return;
    
    const headers = ['Name', 'Mobile Number', 'Date Captured'];
    const rows = leads.map(l => [
      l.name,
      l.mobile,
      new Date(l.createdAt).toLocaleString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `b2b_wholesale_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Wholesale Inquiries (Leads)</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and export captured leads from the login lead wall system.</p>
        </div>
        
        {leads.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="bg-blue-600 hover:bg-blue-750 text-white px-4.5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition text-xs shadow-sm hover:shadow"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
          <Search className="w-4.5 h-4.5 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search leads by name or mobile number..."
            className="w-full pl-11 pr-20 py-2 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition text-slate-800"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-16 top-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition"
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-slate-800 transition"
          >
            Search
          </button>
        </form>

        <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest shrink-0">
          Total Captured: <span className="text-blue-600 font-black">{leads.length}</span>
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-500 font-semibold">Retrieving lead register...</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/70 text-slate-400 text-xs font-extrabold uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Mobile Number</th>
                  <th className="px-6 py-4">Date Captured</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/30 transition text-sm">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 text-slate-650 p-2 rounded-xl">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-800">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-blue-500" />
                        <span>{lead.mobile}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(lead.createdAt).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100/70 p-2.5 rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-slate-400 font-medium">
                      No captured B2B leads match your current search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards View */}
          <div className="md:hidden divide-y divide-gray-100">
            {leads.map((lead) => (
              <div key={lead._id} className="p-5 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="bg-slate-100 text-slate-650 p-2 rounded-xl shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-850 truncate">{lead.name}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(lead._id)}
                    className="text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-xl transition shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="font-mono">{lead.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-450 justify-end">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
            {leads.length === 0 && (
              <div className="p-8 text-center text-slate-400 font-medium">
                No captured B2B leads found.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
