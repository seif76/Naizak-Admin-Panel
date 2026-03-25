'use client';
import { useState, useEffect } from 'react';
import api from "../../../lib/axios"
// Local SVG Icons
const IconPlus = ({ className }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>);
const IconTrash = ({ className }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const IconEdit = ({ className }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>);
const IconSave = ({ className }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);
const IconTag = ({ className }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>);
const IconRefresh = ({ className }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>);

export default function GeneralSettingsPage() {
  // Safe check for process environment to avoid browser rendering errors
  const BACKEND_URL = typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_BACKEND_URL ? process.env.NEXT_PUBLIC_BACKEND_URL : '';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingFee, setSavingFee] = useState(false);

  // --- Service Fee State ---
  const [serviceFee, setServiceFee] = useState({
    fee_type: 'percentage',
    value: 0,
    is_active: true
  });

  // --- Vendor Categories State ---
  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: '',
    is_active: true
  });

  // Initial Data Fetch
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch data concurrently with strict error throwing (no silent fallbacks)
      const [feeRes, categoriesRes] = await Promise.all([
        api.get(`/api/admin/settings/service-fee`),
        api.get(`/api/admin/settings/vendor-categories`)
      ]);

      if (feeRes.data) {
        setServiceFee(feeRes.data);
      }
      if (categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to connect to the backend server to load data. Please make sure the backend API is running.');
    } finally {
      setLoading(false);
    }
  };

  // --- Service Fee Handlers ---
  const handleUpdateServiceFee = async () => {
    if (serviceFee.value === '' || serviceFee.value < 0) {
      alert('Please enter a valid fee value.');
      return;
    }

    try {
      setSavingFee(true);
      const response = await api.put(`/api/admin/settings/service-fee`, {
        fee_type: serviceFee.fee_type,
        value: parseFloat(serviceFee.value),
        is_active: serviceFee.is_active
      });
      setServiceFee(response.data.serviceFee || response.data);
      alert('Service fee updated successfully!');
    } catch (err) {
      console.error('Failed to update service fee:', err);
      alert('Failed to update service fee. Please check your server connection.');
    } finally {
      setSavingFee(false);
    }
  };

  // --- Vendor Categories Handlers ---
  const resetCategoryForm = () => {
    setCategoryForm({ name: '', description: '', icon: '', is_active: true });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim()) {
      alert('Category name is required.');
      return;
    }

    try {
      if (editingCategory) {
        // Update
        const response = await api.put(`/api/admin/settings/vendor-categories/${editingCategory.id}`, categoryForm);
        const updatedCategory = response.data.category || response.data;
        setCategories(categories.map(cat => cat.id === editingCategory.id ? updatedCategory : cat));
      } else {
        // Create
        const response = await api.post(`/api/admin/settings/vendor-categories`, categoryForm);
        const newCategory = response.data.category || response.data;
        setCategories([newCategory, ...categories]);
      }
      resetCategoryForm();
    } catch (err) {
      console.error('Failed to save category:', err);
      alert('Failed to save the category. Please try again.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/api/admin/settings/vendor-categories/${id}`);
        setCategories(categories.filter(cat => cat.id !== id));
      } catch (err) {
        console.error('Failed to delete category:', err);
        alert('Failed to delete the category.');
      }
    }
  };

  const toggleCategoryStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.patch(`/api/admin/settings/vendor-categories/${id}/status`, { is_active: newStatus });
      setCategories(categories.map(cat => cat.id === id ? { ...cat, is_active: newStatus } : cat));
    } catch (err) {
      console.error('Failed to update category status:', err);
      alert('Failed to update status.');
    }
  };

  const openEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      is_active: category.is_active
    });
    setShowCategoryForm(true);
  };

  // Render States
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <IconRefresh className="w-8 h-8 animate-spin mb-4 text-blue-500" />
        <p>Loading configuration from server...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-red-800 text-lg font-semibold mb-2">Connection Error</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <button 
          onClick={fetchData}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
        >
          <IconRefresh className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">General Settings & Categories</h1>
        <p className="text-gray-600">Manage global platform fees and vendor business categories</p>
      </div>

      {/* --- Section 1: Global Service Fee --- */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 mb-10 overflow-hidden">
        <div className="bg-gray-50 p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Global Service Fee</h2>
          <p className="text-sm text-gray-500 mt-1">Configure the default platform fee applied to orders.</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fee Type</label>
              <select
                value={serviceFee.fee_type}
                onChange={(e) => setServiceFee({ ...serviceFee, fee_type: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fee Value {serviceFee.fee_type === 'percentage' ? '(%)' : '($)'}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={serviceFee.value}
                onChange={(e) => setServiceFee({ ...serviceFee, value: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* <div className="pb-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={serviceFee.is_active}
                  onChange={(e) => setServiceFee({ ...serviceFee, is_active: e.target.checked })}
                  className="rounded border-gray-300 mr-2 w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Fee is Active</span>
              </label>
            </div> */}
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <button
              onClick={handleUpdateServiceFee}
              disabled={savingFee}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              <IconSave className="w-5 h-5" />
              {savingFee ? 'Saving...' : 'Update Service Fee'}
            </button>
          </div>
        </div>
      </section>

      {/* --- Section 2: Vendor Categories --- */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 p-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Vendor Categories</h2>
            <p className="text-sm text-gray-500 mt-1">Manage categories assigned to stores/vendors (e.g., Restaurants, Pharmacies).</p>
          </div>
          <button
            onClick={() => {
              resetCategoryForm();
              setShowCategoryForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
          >
            <IconPlus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        {/* Form to Add/Edit Category */}
        {showCategoryForm && (
          <div className="p-6 border-b border-gray-200 bg-blue-50/30">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Grocery"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (URL or class)</label>
                <input
                  type="text"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., /icons/grocery.png"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Category description..."
                ></textarea>
              </div>
              <div className="md:col-span-2 mt-1">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryForm.is_active}
                    onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })}
                    className="rounded border-gray-300 mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Category is Active</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSaveCategory}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingCategory ? 'Update' : 'Save'}
              </button>
              <button
                onClick={resetCategoryForm}
                className="bg-white text-gray-700 border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="p-0">
          {categories.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <IconTag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No vendor categories found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {categories.map((category) => (
                <div key={category.id} className="p-4 hover:bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      {category.icon ? (
                        <span className="font-bold text-lg">{category.name.charAt(0)}</span>
                      ) : (
                        <IconTag className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{category.name}</h4>
                      {category.description && <p className="text-sm text-gray-500">{category.description}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto ml-auto sm:ml-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                    
                    <button
                      onClick={() => toggleCategoryStatus(category.id, category.is_active)}
                      className={`text-sm font-medium ${
                        category.is_active ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'
                      }`}
                    >
                      {category.is_active ? 'Deactivate' : 'Activate'}
                    </button>

                    <div className="flex gap-1 ml-auto sm:ml-4 border-l border-gray-200 pl-4">
                      <button
                        onClick={() => openEditCategory(category)}
                        className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <IconEdit className="w-5 h-5" />
                      </button>
                      {/* <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <IconTrash className="w-5 h-5" />
                      </button> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}