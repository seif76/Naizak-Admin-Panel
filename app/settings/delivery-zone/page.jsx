// 'use client';
// import { useState } from 'react';
// import { FaMapMarkerAlt, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

// export default function DeliveryZonePage() {
//   const [zones, setZones] = useState([
//     {
//       id: 1,
//       name: 'Downtown Area',
//       radius: 5,
//       center: { lat: 24.7136, lng: 46.6753 },
//       isActive: true,
//       deliveryFee: 2.50,
//       minOrderAmount: 10.00
//     },
//     {
//       id: 2,
//       name: 'Suburban Area',
//       radius: 8,
//       center: { lat: 24.7500, lng: 46.6500 },
//       isActive: true,
//       deliveryFee: 5.00,
//       minOrderAmount: 15.00
//     }
//   ]);

//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingZone, setEditingZone] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     radius: 5,
//     centerLat: '',
//     centerLng: '',
//     deliveryFee: 0,
//     minOrderAmount: 0,
//     isActive: true
//   });

//   const handleAddZone = () => {
//     if (!formData.name || !formData.centerLat || !formData.centerLng) {
//       alert('Please fill all required fields');
//       return;
//     }

//     const newZone = {
//       id: Date.now(),
//       name: formData.name,
//       radius: parseFloat(formData.radius),
//       center: { 
//         lat: parseFloat(formData.centerLat), 
//         lng: parseFloat(formData.centerLng) 
//       },
//       deliveryFee: parseFloat(formData.deliveryFee),
//       minOrderAmount: parseFloat(formData.minOrderAmount),
//       isActive: formData.isActive
//     };

//     setZones([...zones, newZone]);
//     setShowAddForm(false);
//     resetForm();
//   };

//   const handleEditZone = () => {
//     if (!formData.name || !formData.centerLat || !formData.centerLng) {
//       alert('Please fill all required fields');
//       return;
//     }

//     const updatedZones = zones.map(zone => 
//       zone.id === editingZone.id 
//         ? {
//             ...zone,
//             name: formData.name,
//             radius: parseFloat(formData.radius),
//             center: { 
//               lat: parseFloat(formData.centerLat), 
//               lng: parseFloat(formData.centerLng) 
//             },
//             deliveryFee: parseFloat(formData.deliveryFee),
//             minOrderAmount: parseFloat(formData.minOrderAmount),
//             isActive: formData.isActive
//           }
//         : zone
//     );

//     setZones(updatedZones);
//     setEditingZone(null);
//     setShowAddForm(false);
//     resetForm();
//   };

//   const handleDeleteZone = (id) => {
//     if (confirm('Are you sure you want to delete this delivery zone?')) {
//       setZones(zones.filter(zone => zone.id !== id));
//     }
//   };

//   const handleEdit = (zone) => {
//     setEditingZone(zone);
//     setFormData({
//       name: zone.name,
//       radius: zone.radius,
//       centerLat: zone.center.lat.toString(),
//       centerLng: zone.center.lng.toString(),
//       deliveryFee: zone.deliveryFee,
//       minOrderAmount: zone.minOrderAmount,
//       isActive: zone.isActive
//     });
//     setShowAddForm(true);
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       radius: 5,
//       centerLat: '',
//       centerLng: '',
//       deliveryFee: 0,
//       minOrderAmount: 0,
//       isActive: true
//     });
//   };

//   const toggleZoneStatus = (id) => {
//     setZones(zones.map(zone => 
//       zone.id === id ? { ...zone, isActive: !zone.isActive } : zone
//     ));
//   };

//   return (
//     <>
//     <div className="w-full">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Zones</h1>
//         <p className="text-gray-600">Manage delivery zones and their settings</p>
//       </div>

//       {/* Add Zone Button */}
//       <div className="mb-6">
//         <button
//           onClick={() => {
//             setShowAddForm(true);
//             setEditingZone(null);
//             resetForm();
//           }}
//           className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
//         >
//           <FaPlus />
//           Add New Zone
//         </button>
//       </div>

//       {/* Add/Edit Form */}
//       {showAddForm && (
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">
//             {editingZone ? 'Edit Delivery Zone' : 'Add New Delivery Zone'}
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Zone Name *
//               </label>
//               <input
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) => setFormData({...formData, name: e.target.value})}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                 placeholder="e.g., Downtown Area"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Radius (km) *
//               </label>
//               <input
//                 type="number"
//                 value={formData.radius}
//                 onChange={(e) => setFormData({...formData, radius: e.target.value})}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                 min="1"
//                 max="50"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Center Latitude *
//               </label>
//               <input
//                 type="number"
//                 step="any"
//                 value={formData.centerLat}
//                 onChange={(e) => setFormData({...formData, centerLat: e.target.value})}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                 placeholder="e.g., 24.7136"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Center Longitude *
//               </label>
//               <input
//                 type="number"
//                 step="any"
//                 value={formData.centerLng}
//                 onChange={(e) => setFormData({...formData, centerLng: e.target.value})}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                 placeholder="e.g., 46.6753"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Delivery Fee ($)
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 value={formData.deliveryFee}
//                 onChange={(e) => setFormData({...formData, deliveryFee: e.target.value})}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                 min="0"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Minimum Order Amount ($)
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 value={formData.minOrderAmount}
//                 onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                 min="0"
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={formData.isActive}
//                   onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
//                   className="rounded border-gray-300 mr-2"
//                 />
//                 <span className="text-sm font-medium text-gray-700">Active Zone</span>
//               </label>
//             </div>
//           </div>

//           <div className="flex gap-3 mt-6">
//             <button
//               onClick={editingZone ? handleEditZone : handleAddZone}
//               className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
//             >
//               {editingZone ? 'Update Zone' : 'Add Zone'}
//             </button>
//             <button
//               onClick={() => {
//                 setShowAddForm(false);
//                 setEditingZone(null);
//                 resetForm();
//               }}
//               className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Zones List */}
//       <div className="bg-white rounded-lg shadow-md">
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-xl font-semibold">Delivery Zones ({zones.length})</h2>
//         </div>
        
//         <div className="p-6">
//           {zones.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <FaMapMarkerAlt className="mx-auto text-4xl mb-4 text-gray-300" />
//               <p>No delivery zones configured yet.</p>
//               <p className="text-sm">Click "Add New Zone" to get started.</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {zones.map((zone) => (
//                 <div key={zone.id} className="border border-gray-200 rounded-lg p-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <FaMapMarkerAlt className="text-primary text-xl" />
//                       <div>
//                         <h3 className="font-semibold text-lg">{zone.name}</h3>
//                         <p className="text-sm text-gray-600">
//                           Radius: {zone.radius}km | 
//                           Center: {zone.center.lat.toFixed(4)}, {zone.center.lng.toFixed(4)}
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Delivery Fee: ${zone.deliveryFee} | 
//                           Min Order: ${zone.minOrderAmount}
//                         </p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-2">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         zone.isActive 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {zone.isActive ? 'Active' : 'Inactive'}
//                       </span>
                      
//                       <button
//                         onClick={() => toggleZoneStatus(zone.id)}
//                         className={`px-3 py-1 rounded text-sm ${
//                           zone.isActive 
//                             ? 'bg-red-100 text-red-700 hover:bg-red-200' 
//                             : 'bg-green-100 text-green-700 hover:bg-green-200'
//                         }`}
//                       >
//                         {zone.isActive ? 'Deactivate' : 'Activate'}
//                       </button>
                      
//                       <button
//                         onClick={() => handleEdit(zone)}
//                         className="text-blue-600 hover:text-blue-800 p-2"
//                       >
//                         <FaEdit />
//                       </button>
                      
//                       <button
//                         onClick={() => handleDeleteZone(zone.id)}
//                         className="text-red-600 hover:text-red-800 p-2"
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//     </>
//   );
// } 



'use client';
import { useState, useEffect } from 'react';

// Local SVG icons to replace react-icons for preview
const IconMapMarker = ({ className }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const IconPlus = ({ className }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>);
const IconTrash = ({ className }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const IconEdit = ({ className }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>);

// NOTE FOR YOUR ACTUAL PROJECT: Uncomment the following line and delete the mock `api` object below.
 import api from '../../../lib/axios'; 


export default function DeliveryZonePage() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [formData, setFormData] = useState({
    city_name: '',
    zone_name: '',
    description: '',
    base_delivery_fee: 0,
    is_active: true
  });

  // Fetch all zones on component mount
  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/delivery-zones`);
      setZones(response.data);
    } catch (error) {
      console.error('Failed to fetch zones:', error);
      alert('Failed to load delivery zones.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddZone = async () => {
    if (!formData.city_name || formData.base_delivery_fee === '') {
      alert('Please fill all required fields (City Name and Base Delivery Fee)');
      return;
    }

    try {
      const response = await api.post(`/api/admin/delivery-zones`, {
        ...formData,
        base_delivery_fee: parseFloat(formData.base_delivery_fee)
      });
      
      setZones([response.data.zone, ...zones]);
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create zone:', error);
      alert(error.response?.data?.error || 'Failed to create zone');
    }
  };

  const handleEditZone = async () => {
    if (!formData.city_name || formData.base_delivery_fee === '') {
      alert('Please fill all required fields');
      return;
    }

    try {
      const response = await api.put(`/api/admin/delivery-zones/${editingZone.id}`, {
        ...formData,
        base_delivery_fee: parseFloat(formData.base_delivery_fee)
      });
      
      setZones(zones.map(zone => 
        zone.id === editingZone.id ? response.data.zone : zone
      ));
      setEditingZone(null);
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error('Failed to update zone:', error);
      alert(error.response?.data?.error || 'Failed to update zone');
    }
  };

  const handleDeleteZone = async (id) => {
    if (confirm('Are you sure you want to delete this delivery zone?')) {
      try {
        await api.delete(`/api/admin/delivery-zones/${id}`);
        setZones(zones.filter(zone => zone.id !== id));
      } catch (error) {
        console.error('Failed to delete zone:', error);
        alert('Failed to delete zone');
      }
    }
  };

  const toggleZoneStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.patch(`/api/admin/delivery-zones/${id}/status`, {
        is_active: newStatus
      });
      
      setZones(zones.map(zone => 
        zone.id === id ? { ...zone, is_active: newStatus } : zone
      ));
    } catch (error) {
      console.error('Failed to toggle status:', error);
      alert('Failed to update zone status');
    }
  };

  const handleEdit = (zone) => {
    setEditingZone(zone);
    setFormData({
      city_name: zone.city_name,
      zone_name: zone.zone_name || '',
      description: zone.description || '',
      base_delivery_fee: zone.base_delivery_fee,
      is_active: zone.is_active
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      city_name: '',
      zone_name: '',
      description: '',
      base_delivery_fee: 0,
      is_active: true
    });
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Zones</h1>
        <p className="text-gray-600">Manage cities, delivery zones and their base fees</p>
      </div>

      {/* Add Zone Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingZone(null);
            resetForm();
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <IconPlus className="w-4 h-4" />
          Add New Zone
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">
            {editingZone ? 'Edit Delivery Zone' : 'Add New Delivery Zone'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City Name *
              </label>
              <input
                type="text"
                value={formData.city_name}
                onChange={(e) => setFormData({...formData, city_name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Riyadh"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zone Name
              </label>
              <input
                type="text"
                value={formData.zone_name}
                onChange={(e) => setFormData({...formData, zone_name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Downtown Area"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Delivery Fee ($) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.base_delivery_fee}
                onChange={(e) => setFormData({...formData, base_delivery_fee: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Optional description"
              />
            </div>

            <div className="md:col-span-2 mt-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="rounded border-gray-300 mr-2 w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Set as Active Zone</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={editingZone ? handleEditZone : handleAddZone}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {editingZone ? 'Update Zone' : 'Save Zone'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingZone(null);
                resetForm();
              }}
              className="bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Zones List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Delivery Zones ({zones.length})</h2>
        </div>
        
        <div className="p-6">
          {loading ? (
             <div className="text-center py-8 text-gray-500">Loading delivery zones...</div>
          ) : zones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <IconMapMarker className="mx-auto w-10 h-10 mb-4 text-gray-300" />
              <p>No delivery zones configured yet.</p>
              <p className="text-sm mt-2">Click "Add New Zone" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {zones.map((zone) => (
                <div key={zone.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 rounded-full">
                        <IconMapMarker className="text-primary w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {zone.city_name} {zone.zone_name && <span className="text-gray-500 text-sm font-normal">- {zone.zone_name}</span>}
                        </h3>
                        {zone.description && (
                          <p className="text-sm text-gray-500 mt-1">{zone.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600 font-medium">
                          <span className="bg-gray-100 px-2 py-1 rounded">Base Fee: ${Number(zone.base_delivery_fee).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        zone.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {zone.is_active ? 'Active' : 'Inactive'}
                      </span>
                      
                      <button
                        onClick={() => toggleZoneStatus(zone.id, zone.is_active)}
                        className={`px-3 py-1.5 rounded text-sm font-medium ml-2 ${
                          zone.is_active 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {zone.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      
                      <div className="flex ml-auto sm:ml-2 gap-1">
                        <button
                          onClick={() => handleEdit(zone)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors"
                          title="Edit"
                        >
                          <IconEdit className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteZone(zone.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                          title="Delete"
                        >
                          <IconTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}