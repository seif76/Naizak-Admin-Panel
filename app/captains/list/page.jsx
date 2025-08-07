
'use client';
import { useEffect, useState } from 'react';
import { FaUserTie, FaEye, FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import { CaptainsRoute } from '../../../components/auth/ProtectedRoute';

function CaptainsListPage() {
  const [captains, setCaptains] = useState([]);
  const [stats, setStats] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const router = useRouter();

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/admin/captains/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching captain stats:', error);
    }
  };

  const fetchCaptains = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/captains', {
        params: { page, limit: 10, status: statusFilter || undefined },
      });
      setCaptains(res.data.captains || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching captains:', error);
    }
    setLoading(false);
  };

  const updateCaptainStatus = async (phone_number, status) => {
    try {
      await api.put('/api/admin/captains/status', {
        phone_number,
        captain_status: status,
      });
      fetchCaptains();
    } catch (error) {
      console.error('Error updating captain status:', error);
    }
  };

  const deleteCaptain = async (phone_number) => {
    if (window.confirm('Are you sure you want to delete this captain?')) {
      try {
        await api.delete(`/api/admin/captains/delete?phone_number=${phone_number}`);
        fetchCaptains();
      } catch (error) {
        console.error('Error deleting captain:', error);
      }
    }
  };

  const navigateToDetails = (phone_number) => {
    router.push(`/captains/details?phone_number=${phone_number}`);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchCaptains();
  }, [page, statusFilter]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Captain Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Captains</p>
              <p className="text-2xl font-bold">{stats.total || 0}</p>
            </div>
            <FaUserTie className="text-2xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Captains</p>
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
            <option value="">All Captains</option>
            <option value="Active">Active</option>
            <option value="pending">Pending</option>
            <option value="Deactivated">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Captains Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Captain</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Loading captains...
                  </td>
                </tr>
              ) : captains.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No captains found
                  </td>
                </tr>
              ) : (
                captains.map((captain) => (
                  <tr key={captain.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUserTie className="text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{captain.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {captain.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {captain.phone_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {captain.vehicle ? `${captain.vehicle.make} ${captain.vehicle.model}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        captain.captain_status === 'Active' 
                          ? 'bg-green-100 text-green-800'
                          : captain.captain_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {captain.captain_status === 'Active' ? (
                          <FaCheck className="mr-1" />
                        ) : captain.captain_status === 'pending' ? (
                          <FaSpinner className="mr-1 animate-spin" />
                        ) : (
                          <FaTimes className="mr-1" />
                        )}
                        {captain.captain_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(captain.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigateToDetails(captain.phone_number)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FaEye className="inline mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => updateCaptainStatus(
                            captain.phone_number, 
                            captain.captain_status === 'Active' ? 'Deactivated' : 'Active'
                          )}
                          className={`${
                            captain.captain_status === 'Active'
                              ? 'text-red-600 hover:text-red-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {captain.captain_status === 'Active' ? (
                            <>
                              <FaTimes className="inline mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <FaCheck className="inline mr-1" />
                              Activate
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => deleteCaptain(captain.phone_number)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="inline mr-1" />
                          Delete
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

export default function ProtectedCaptainsListPage() {
  return (
    <CaptainsRoute>
      <CaptainsListPage />
    </CaptainsRoute>
  );
}






