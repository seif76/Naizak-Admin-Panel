'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaUser, FaEye } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import api from '../../../lib/axios';
export default function PendingVendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPendingVendors = async () => {
    try {
      const res = await api.get(`/api/admin/vendors/pending`);
      setVendors(res.data.vendors || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch vendors', error);
    }
  };

  const approveVendor = async (phone_number) => {
    try {
      await api.put(`/api/admin/vendors/status`, {
        phone_number,
        vendor_status: 'Active',
      });
      fetchPendingVendors();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to approve');
    }
  };

  const rejectVendor = async (phone_number) => {
    try {
      await api.put(`/api/admin/vendors/status`, {
        phone_number,
        vendor_status: 'Deactivated',
      });
      fetchPendingVendors();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to reject');
    }
  };

  const navigateToDetails = (phone_number) => {
    router.push(`/vendors/details/${phone_number}`);
  };

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-primary">🚦 Pending Vendor Requests</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : vendors.length === 0 ? (
        <p className="text-gray-600">No pending vendor requests found.</p>
      ) : (
        <div className="overflow-auto bg-white shadow rounded-md">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-100 text-sm text-gray-700">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Shop Name</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor, idx) => (
                <tr key={vendor.id} className="border-t hover:bg-gray-50 text-sm">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3 flex items-center gap-2"><FaUser /> {vendor.name}</td>
                  <td className="p-3">{vendor.phone_number}</td>
                  <td className="p-3">{vendor.email}</td>
                  <td className="p-3">{vendor.shop_name || 'N/A'}</td>
                  <td className="p-3 space-x-2 flex">
                    <button
                      onClick={() => approveVendor(vendor.phone_number)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      <FaCheckCircle className="inline mr-1" /> Approve
                    </button>
                    <button
                      onClick={() => rejectVendor(vendor.phone_number)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      <FaTimesCircle className="inline mr-1" /> Reject
                    </button>
                    <button
                      onClick={() => navigateToDetails(vendor.phone_number)}
                      className="bg-primary text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      <FaEye className="inline mr-1" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 