'use client';
import { useEffect, useState } from 'react';
import { FaUserTie, FaEye, FaCheck, FaTimes, FaSpinner, FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import { DeliverymenRoute } from '../../../components/auth/ProtectedRoute';

function DeliverymenListPage() {
  const [deliverymen, setDeliverymen] = useState([]);
  const [stats, setStats] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  // ─── Added phone search state ───
  const [phoneSearch, setPhoneSearch] = useState('');
  const router = useRouter();

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/admin/deliverymen/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching deliveryman stats:', error);
    }
  };

  const fetchdeliverymen = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/deliverymen', {
        params: {
          page,
          limit: 10,
          status: statusFilter || undefined,
          // ─── Pass phone search to backend ───
          phone: phoneSearch || undefined,
        },
      });
      setDeliverymen(res.data.deliverymen || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching deliverymen:', error);
    }
    setLoading(false);
  };

  const navigateToDetails = (id) => {
    router.push(`/deliverymen/details?id=${id}`);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ─── Added phoneSearch to dependencies so search triggers on change ───
  useEffect(() => {
    fetchdeliverymen();
  }, [page, statusFilter, phoneSearch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Deliverymen Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Deliverymen</p>
              <p className="text-2xl font-bold">{stats.total || 0}</p>
            </div>
            <FaUserTie className="text-2xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Deliverymen</p>
              <p className="text-2xl font-bold text-green-600">{stats.active || 0}</p>
            </div>
            <FaCheck className="text-2xl text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</p>
            </div>
            <FaSpinner className="text-2xl text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Deactivated</p>
              <p className="text-2xl font-bold text-red-600">{stats.deactivated || 0}</p>
            </div>
            <FaTimes className="text-2xl text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-medium">Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="">All Deliverymen</option>
            <option value="Active">Active</option>
            <option value="pending">Pending</option>
            <option value="Deactivated">Deactivated</option>
          </select>

          {/* ─── Added phone number search input ─── */}
          <span className="text-sm font-medium">Search by Phone:</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                value={phoneSearch}
                onChange={(e) => {
                  setPhoneSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Enter phone number..."
                className="border rounded pl-8 pr-3 py-1 text-sm w-48"
              />
            </div>
            {phoneSearch && (
              <button
                onClick={() => { setPhoneSearch(''); setPage(1); }}
                className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <FaTimes size={12} />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Deliverymen Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveryman</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading deliverymen...
                  </td>
                </tr>
              ) : deliverymen.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No deliverymen found
                  </td>
                </tr>
              ) : (
                deliverymen.map((deliveryman) => (
                  <tr key={deliveryman.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUserTie className="text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{deliveryman.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deliveryman.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deliveryman.phone_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        deliveryman.deliveryman_status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : deliveryman.deliveryman_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {deliveryman.deliveryman_status === 'Active' ? (
                          <FaCheck className="mr-1" />
                        ) : deliveryman.deliveryman_status === 'pending' ? (
                          <FaSpinner className="mr-1 animate-spin" />
                        ) : (
                          <FaTimes className="mr-1" />
                        )}
                        {deliveryman.deliveryman_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(deliveryman.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigateToDetails(deliveryman.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FaEye className="inline mr-1" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-2">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProtecteddeliverymenListPage() {
  return (
    <DeliverymenRoute>
      <DeliverymenListPage />
    </DeliverymenRoute>
  );
}