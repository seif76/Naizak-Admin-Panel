'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function CaptainPendingDetailPage() {
  const { phone_number } = useParams();
  const [captain, setCaptain] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!phone_number) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/captain/get-by-phone?phone_number=${phone_number}`);
        setCaptain(res.data.user);
        setVehicle(res.data.vehicle);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [phone_number]);

  const handleAction = async (status) => {
    try {
      await axios.put('http://localhost:5000/api/captain/status', {
        phone_number,
        status,
      });
      alert(`Captain has been marked as ${status}`);
    } catch (error) {
      alert(error.response?.data?.error || 'Action failed');
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!captain) return <p className="p-6 text-red-600">Captain not found</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Link href="/captains/pending-request" className="text-blue-600 hover:underline flex items-center gap-2 mb-4">
        <FaArrowLeft /> Back to List
      </Link>

      <h1 className="text-2xl font-bold text-primary mb-6">Captain Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Personal Info</h2>
          <p><strong>Name:</strong> {captain.name}</p>
          <p><strong>Email:</strong> {captain.email}</p>
          <p><strong>Phone:</strong> {captain.phone_number}</p>
          <p><strong>Gender:</strong> {captain.gender}</p>
          <p><strong>Status:</strong> {captain.captain_status}</p>
          {captain.profile_photo && (
            <img src={captain.profile_photo} alt="Profile" className="mt-3 w-32 h-32 object-cover rounded-full border" />
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Vehicle Info</h2>
          <p><strong>Make:</strong> {vehicle?.make}</p>
          <p><strong>Model:</strong> {vehicle?.model}</p>
          <p><strong>Year:</strong> {vehicle?.year}</p>
          <p><strong>Plate:</strong> {vehicle?.license_plate}</p>
          <p><strong>Type:</strong> {vehicle?.vehicle_type}</p>
          <p><strong>Color:</strong> {vehicle?.color}</p>
          <div className="mt-4">
            <p className="font-semibold">Driver License:</p>
            <img src={vehicle?.driver_license_photo} className="w-full max-w-xs mt-2 rounded" alt="License" />
          </div>
          <div className="mt-4">
            <p className="font-semibold">National ID:</p>
            <img src={vehicle?.national_id_photo} className="w-full max-w-xs mt-2 rounded" alt="ID" />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => handleAction('Active')}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <FaCheckCircle /> Approve
        </button>
        <button
          onClick={() => handleAction('Deactivated')}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 flex items-center gap-2"
        >
          <FaTimesCircle /> Reject
        </button>
      </div>
    </div>
  );
}
