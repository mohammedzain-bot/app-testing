'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Wrench, FolderOpen } from 'lucide-react';

export default function ServicesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  
  const [selectedCatId, setSelectedCatId] = useState('');
  const [newServiceName, setNewServiceName] = useState('');

  async function fetchCategories() {
    try {
      const res = await axios.get('https://servenow-backend-16sw.onrender.com/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName || !newCategoryIcon) return;
    try {
      await axios.post('https://servenow-backend-16sw.onrender.com/api/categories', {
        name: newCategoryName,
        iconUrl: newCategoryIcon,
      });
      setNewCategoryName('');
      setNewCategoryIcon('');
      fetchCategories();
    } catch (err) {
      alert('Failed to add category');
    }
  }

  async function handleAddService(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCatId || !newServiceName) return;
    try {
      await axios.post('https://servenow-backend-16sw.onrender.com/api/services', {
        name: newServiceName,
        categoryId: selectedCatId,
      });
      setNewServiceName('');
      fetchCategories(); // Refresh to show new service inside category
    } catch (err) {
      alert('Failed to add service');
    }
  }

  if (loading) return <div className="animate-pulse">Loading services...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Services</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Forms */}
        <div className="space-y-8">
          {/* Add Category Form */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FolderOpen size={18} className="text-indigo-600" />
              Add Category
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Category Name</label>
                <input 
                  type="text" 
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Electrician"
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Emoji / Icon</label>
                <input 
                  type="text" 
                  value={newCategoryIcon}
                  onChange={e => setNewCategoryIcon(e.target.value)}
                  placeholder="e.g. ⚡"
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center justify-center gap-2">
                <Plus size={16} /> Add Category
              </button>
            </form>
          </div>

          {/* Add Service Form */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Wrench size={18} className="text-indigo-600" />
              Add Sub-Service
            </h2>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Select Category</label>
                <select 
                  value={selectedCatId}
                  onChange={e => setSelectedCatId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="">-- Choose Category --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.iconUrl} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Service Name</label>
                <input 
                  type="text" 
                  value={newServiceName}
                  onChange={e => setNewServiceName(e.target.value)}
                  placeholder="e.g. AC Installation"
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center justify-center gap-2">
                <Plus size={16} /> Add Service
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-lg font-bold mb-6">Current Service Catalog</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="border rounded-xl p-4 bg-slate-50">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-3">
                    <span className="text-2xl">{cat.iconUrl}</span>
                    <h3 className="font-bold text-slate-800">{cat.name}</h3>
                  </div>
                  
                  {cat.services && cat.services.length > 0 ? (
                    <ul className="space-y-2">
                      {cat.services.map((svc: any) => (
                        <li key={svc.id} className="text-sm text-slate-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                          {svc.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No specific sub-services added yet. Providers can still select the general category.</p>
                  )}
                </div>
              ))}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
