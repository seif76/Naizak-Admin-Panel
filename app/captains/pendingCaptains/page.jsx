// 'use client';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaCheckCircle, FaTimesCircle, FaUser } from 'react-icons/fa';

// export default function PendingCaptainsPage() {
//   const [captains, setCaptains] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchPendingCaptains = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/captain/pending');
//       setCaptains(res.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Failed to fetch captains', error);
//     }
//   };

//   const approveCaptain = async (phone_number) => {
//     try {
//       await axios.put('http://localhost:5000/api/captain/status', {
//         phone_number,
//         status: 'Active',
//       });
//       fetchPendingCaptains(); // Refresh list
//     } catch (error) {
//       alert(error.response?.data?.error || 'Failed to approve');
//     }
//   };

//   const rejectCaptain = async (phone_number) => {
//     try {
//       await axios.put('http://localhost:5000/api/captain/status', {
//         phone_number,
//         status: 'Deactivated',
//       });
//       fetchPendingCaptains(); // Refresh list
//     } catch (error) {
//       alert(error.response?.data?.error || 'Failed to reject');
//     }
//   };

//   useEffect(() => {
//     fetchPendingCaptains();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4 text-primary">🚦 Pending Captain Requests</h1>

//       {loading ? (
//         <p className="text-gray-600">Loading...</p>
//       ) : captains.length === 0 ? (
//         <p className="text-gray-600">No pending captain requests found.</p>
//       ) : (
//         <div className="overflow-auto bg-white shadow rounded-md">
//           <table className="w-full min-w-[800px]">
//             <thead className="bg-gray-100 text-sm text-gray-700">
//               <tr>
//                 <th className="p-3">#</th>
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Phone</th>
//                 <th className="p-3">Email</th>
//                 <th className="p-3">Gender</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {captains.map((captain, idx) => (
//                 <tr key={captain.id} className="border-t hover:bg-gray-50 text-sm">
//                   <td className="p-3">{idx + 1}</td>
//                   <td className="p-3 flex items-center gap-2"><FaUser /> {captain.name}</td>
//                   <td className="p-3">{captain.phone_number}</td>
//                   <td className="p-3">{captain.email}</td>
//                   <td className="p-3 capitalize">{captain.gender || 'N/A'}</td>
//                   <td className="p-3  space-x-2">
//                     <button
//                       onClick={() => approveCaptain(captain.phone_number)}
//                       className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                     >
//                       <FaCheckCircle className="inline mr-1" /> Approve
//                     </button>
//                     <button
//                       onClick={() => rejectCaptain(captain.phone_number)}
//                       className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                     >
//                       <FaTimesCircle className="inline mr-1" /> Reject
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
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaUser, FaEye } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function PendingCaptainsPage() {
  const [captains, setCaptains] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPendingCaptains = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/captain/pending');
      setCaptains(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch captains', error);
    }
  };

  const approveCaptain = async (phone_number) => {
    try {
      await axios.put('http://localhost:5000/api/captain/status', {
        phone_number,
        status: 'Active',
      });
      fetchPendingCaptains();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to approve');
    }
  };

  const rejectCaptain = async (phone_number) => {
    try {
      await axios.put('http://localhost:5000/api/captain/status', {
        phone_number,
        status: 'Deactivated',
      });
      fetchPendingCaptains();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to reject');
    }
  };

  const navigateToDetails = (phone_number) => {
    router.push(`/captains/pending-request/${phone_number}`);
  };

  useEffect(() => {
    fetchPendingCaptains();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-primary">🚦 Pending Captain Requests</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : captains.length === 0 ? (
        <p className="text-gray-600">No pending captain requests found.</p>
      ) : (
        <div className="overflow-auto bg-white shadow rounded-md">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-100 text-sm text-gray-700">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {captains.map((captain, idx) => (
                <tr key={captain.id} className="border-t hover:bg-gray-50 text-sm">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3 flex items-center gap-2"><FaUser /> {captain.name}</td>
                  <td className="p-3">{captain.phone_number}</td>
                  <td className="p-3">{captain.email}</td>
                  <td className="p-3 capitalize">{captain.gender || 'N/A'}</td>
                  <td className="p-3 space-x-2 flex">
                    <button
                      onClick={() => approveCaptain(captain.phone_number)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      <FaCheckCircle className="inline mr-1" /> Approve
                    </button>
                    <button
                      onClick={() => rejectCaptain(captain.phone_number)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      <FaTimesCircle className="inline mr-1" /> Reject
                    </button>
                    <button
                      onClick={() => navigateToDetails(captain.phone_number)}
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

