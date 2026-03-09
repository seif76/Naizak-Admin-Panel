// 'use client';
// import { useEffect, useState } from 'react';
// import { FaCheckCircle, FaTimesCircle, FaMotorcycle, FaEye } from 'react-icons/fa';
// import { useRouter } from 'next/navigation';
// import api from '../../../lib/axios';

// export default function PendingDeliverymenPage() {
//   const [deliverymen, setDeliverymen] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const fetchPendingDeliverymen = async () => {
//     try {
//       const res = await api.get(`/api/admin/deliverymen/pending`);
//       setDeliverymen(res.data || []);
//       setLoading(false);
//     } catch (error) {
//       console.error('Failed to fetch deliverymen', error);
//     }
//   };

//   const approveDeliveryman = async (id) => {
//     try {
//       await api.put(`/api/admin/deliverymen/status`, {
//         id,
//         status: 'Active',
//       });
//       fetchPendingDeliverymen();
//     } catch (error) {
//       alert(error.response?.data?.error || 'Failed to approve');
//     }
//   };

//   const rejectDeliveryman = async (id) => {
//     try {
//       await api.put(`/api/admin/deliverymen/status`, {
//         id,
//         status: 'Deactivated',
//       });
//       fetchPendingDeliverymen();
//     } catch (error) {
//       alert(error.response?.data?.error || 'Failed to reject');
//     }
//   };

//   const navigateToDetails = (id) => {
//     router.push(`/deliverymen/details?id=${id}`);
//   };

//   useEffect(() => {
//     fetchPendingDeliverymen();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4 text-primary">🚦 Pending Deliveryman Requests</h1>

//       {loading ? (
//         <p className="text-gray-600">Loading...</p>
//       ) : deliverymen.length === 0 ? (
//         <p className="text-gray-600">No pending deliveryman requests found.</p>
//       ) : (
//         <div className="overflow-auto bg-white shadow rounded-md">
//           <table className="w-full min-w-[900px]">
//             <thead className="bg-gray-100 text-sm text-gray-700">
//               <tr>
//                 <th className="p-3">#</th>
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Phone</th>
//                 <th className="p-3">Email</th>
//                 <th className="p-3">Vehicle Type</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {deliverymen.map((deliveryman, idx) => (
//                 <tr key={deliveryman.id} className="border-t hover:bg-gray-50 text-sm">
//                   <td className="p-3">{idx + 1}</td>
//                   <td className="p-3 flex items-center gap-2"><FaMotorcycle /> {deliveryman.name}</td>
//                   <td className="p-3">{deliveryman.phone_number}</td>
//                   <td className="p-3">{deliveryman.email}</td>
//                   <td className="p-3">{deliveryman.vehicle_type || 'N/A'}</td>
//                   <td className="p-3 space-x-2 flex">
//                     <button
//                       onClick={() => approveDeliveryman(deliveryman.id)}
//                       className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                     >
//                       <FaCheckCircle className="inline mr-1" /> Approve
//                     </button>
//                     <button
//                       onClick={() => rejectDeliveryman(deliveryman.id)}
//                       className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                     >
//                       <FaTimesCircle className="inline mr-1" /> Reject
//                     </button>
//                     <button
//                       onClick={() => navigateToDetails(deliveryman.id)}
//                       className="bg-primary text-white px-3 py-1 rounded hover:bg-green-700"
//                     >
//                       <FaEye className="inline mr-1" /> View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';
import { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaMotorcycle, FaEye, FaChevronLeft, FaChevronRight, FaSearch, FaClock } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '../../../lib/axios';

export default function PendingDeliverymenPage() {
  const [deliverymen, setDeliverymen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const limit = 10;
  const router = useRouter();

  const fetchPendingDeliverymen = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/deliverymen/pending`, {
        params: { page: currentPage, limit },
      });

      const data = res.data;
      // support both array response and { deliverymen, total } shape
      const list = Array.isArray(data) ? data : (data.deliverymen || []);
      const totalCount = data.total || list.length;

      setDeliverymen(list);
      setTotal(totalCount);
      setTotalPages(Math.ceil(totalCount / limit));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch deliverymen', error);
      setLoading(false);
    }
  };

  const approveDeliveryman = async (id) => {
    try {
      await api.put(`/api/admin/deliverymen/${id}/status`, { id, status: 'Active' });
      fetchPendingDeliverymen(page);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to approve');
    }
  };

  const rejectDeliveryman = async (id) => {
    try {
      await api.put(`/api/admin/deliverymen/${id}/status`, { id, status: 'Deactivated' });
      fetchPendingDeliverymen(page);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to reject');
    }
  };

  const navigateToDetails = (id) => {
    router.push(`/deliverymen/details?id=${id}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchPendingDeliverymen(newPage);
  };

  useEffect(() => {
    fetchPendingDeliverymen(1);
  }, []);

  const filtered = deliverymen.filter((d) =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.email?.toLowerCase().includes(search.toLowerCase()) ||
    d.phone_number?.includes(search)
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <FaClock className="text-yellow-500" /> Pending Deliveryman Requests
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} request{total !== 1 ? 's' : ''} awaiting review
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FaMotorcycle className="text-4xl mb-3 animate-bounce text-primary" />
            <p className="text-sm">Loading deliverymen...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FaMotorcycle className="text-4xl mb-3" />
            <p className="text-sm font-medium">No pending requests found</p>
            <p className="text-xs mt-1">All deliverymen have been reviewed</p>
          </div>
        ) : (
          <>
            <div className="overflow-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wide">
                    <th className="px-4 py-3 text-left w-10">#</th>
                    <th className="px-4 py-3 text-left">Deliveryman</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Gender</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((deliveryman, idx) => (
                    <tr
                      key={deliveryman.id}
                      className="hover:bg-blue-50/30 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                        {(page - 1) * limit + idx + 1}
                      </td>

                      {/* Avatar + Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {deliveryman.profile_photo ? (
                            <img
                              src={deliveryman.profile_photo}
                              alt={deliveryman.name}
                              className="w-9 h-9 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                              {deliveryman.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-gray-800">{deliveryman.name}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-gray-600">{deliveryman.phone_number}</td>
                      <td className="px-4 py-3 text-gray-600">{deliveryman.email || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{deliveryman.gender || 'N/A'}</td>

                      {/* Status Badge */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                          Pending
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => approveDeliveryman(deliveryman.id)}
                            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <FaCheckCircle /> Approve
                          </button>
                          <button
                            onClick={() => rejectDeliveryman(deliveryman.id)}
                            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <FaTimesCircle /> Reject
                          </button>
                          <button
                            onClick={() => navigateToDetails(deliveryman.id)}
                            className="flex items-center gap-1.5 bg-primary hover:opacity-90 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-opacity"
                          >
                            <FaEye /> View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/50">
              <p className="text-xs text-gray-500">
                Showing <span className="font-semibold text-gray-700">{(page - 1) * limit + 1}</span> – <span className="font-semibold text-gray-700">{Math.min(page * limit, total)}</span> of <span className="font-semibold text-gray-700">{total}</span> results
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronLeft className="text-xs" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === '...' ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-xs">...</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => handlePageChange(item)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                          page === item
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}