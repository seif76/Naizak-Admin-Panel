
'use client';
import { useEffect, useState } from 'react';
import { FaUserTie, FaEye, FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
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
        params: { page, limit: 10, status: statusFilter || undefined },
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

  useEffect(() => {
    fetchdeliverymen();
  }, [page, statusFilter]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">deliverymen Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total deliverymen</p>
              <p className="text-2xl font-bold">{stats.total || 0}</p>
            </div>
            <FaUserTie className="text-2xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active deliverymen</p>
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
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="">All deliverymen</option>
            <option value="Active">Active</option>
            <option value="pending">Pending</option>
            <option value="Deactivated">Deactivated</option>
          </select>
        </div>
      </div>

      {/* deliverymen Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">deliveryman</th>
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
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Loading deliverymen...
                  </td>
                </tr>
              ) : deliverymen.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
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






