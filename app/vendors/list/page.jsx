'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStore, FaSpinner, FaUserSlash, FaEye, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function VendorsListPage() {
  const [vendors, setVendors] = useState([]);
  const [stats, setStats] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/vendors/stats`);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching vendor stats:', error);
    }
  };

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/vendors`, {
        params: { page, limit: 10, status: statusFilter || undefined },
      });
      
      setVendors(res.data.vendors || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
    setLoading(false);
  };

  const deleteVendor = async (phone_number) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/vendors/delete?phone_number=${phone_number}`);
      fetchVendors();
    } catch (error) {
      console.error('Error deleting vendor:', error);
    }
  };

  const updateVendorStatus = async (phone_number, status) => {
    try {
      await axios.put(`${BACKEND_URL}/api/admin/vendors/status`, {
        phone_number,
        vendor_status: status
      });
      fetchVendors();
    } catch (error) {
      console.error('Error updating vendor status:', error);
    }
  };

  const navigateToDetails = (phone_number) => {
    router.push(`/vendors/details?phone_number=${phone_number}`);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [page, statusFilter]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vendor Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <div className="flex items-center gap-2 text-blue-600">
            <FaStore /> <span className="text-lg">Active: {stats.active || 0}</span>
          </div>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <div className="flex items-center gap-2 text-yellow-600">
            <FaSpinner /> <span className="text-lg">Pending: {stats.pending || 0}</span>
          </div>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <div className="flex items-center gap-2 text-red-600">
            <FaUserSlash /> <span className="text-lg">Deactivated: {stats.deactivated || 0}</span>
          </div>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <div className="flex items-center gap-2 text-green-600">
            <FaStore /> <span className="text-lg">Total: {(stats.active || 0) + (stats.pending || 0) + (stats.deactivated || 0)}</span>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="pending">Pending</option>
          <option value="Deactivated">Deactivated</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white shadow rounded">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="p-3">#</th>
              <th className="p-3">Shop Name</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Location</th>
              <th className="p-3">Status</th>
              <th className="p-3">Products</th>
              <th className="px-3 p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center p-5">Loading...</td></tr>
            ) : vendors?.length === 0 ? (
              <tr><td colSpan={8} className="text-center p-5">No data</td></tr>
            ) : (
              vendors?.map((vendor, idx) => (
                <tr key={vendor.id} className="border-b">
                  <td className="p-3">{(page - 1) * 10 + idx + 1}</td>
                  <td className="p-3">{vendor.vendor_info.shop_name}</td>
                  <td className="p-3">{vendor.vendor_info.owner_name}</td>
                  <td className="p-3">{vendor.vendor_info.phone_number}</td>
                  <td className="p-3">{vendor.vendor_info.shop_location}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      vendor.vendor_status === 'Active' ? 'bg-green-100 text-green-800' :
                      vendor.vendor_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vendor.vendor_status}
                    </span>
                  </td>
                  <td className="p-3">{vendor.products_count || 0}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button 
                    onClick={() => navigateToDetails(vendor.phone_number)}
                    className="text-primary hover:text-blue-700">
                      <FaEye />
                    </button>
                    {vendor.vendor_status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateVendorStatus(vendor.phone_number, 'Active')}
                          className="text-green-500 hover:text-green-700"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          onClick={() => updateVendorStatus(vendor.phone_number, 'Deactivated')}
                          className="text-red-500 hover:text-red-700"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => deleteVendor(vendor.phone_number)} 
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num + 1}
            className={`px-3 py-1 rounded border ${page === num + 1 ? 'bg-green-500 text-white' : 'bg-white text-gray-800'}`}
            onClick={() => setPage(num + 1)}
          >
            {num + 1}
          </button>
        ))}
      </div>
    </div>
  );
} 