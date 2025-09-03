'use client';
import { useState } from 'react';
import { FaMapMarkerAlt, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

export default function DeliveryZonePage() {
  const [zones, setZones] = useState([
    {
      id: 1,
      name: 'Downtown Area',
      radius: 5,
      center: { lat: 24.7136, lng: 46.6753 },
      isActive: true,
      deliveryFee: 2.50,
      minOrderAmount: 10.00
    },
    {
      id: 2,
      name: 'Suburban Area',
      radius: 8,
      center: { lat: 24.7500, lng: 46.6500 },
      isActive: true,
      deliveryFee: 5.00,
      minOrderAmount: 15.00
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    radius: 5,
    centerLat: '',
    centerLng: '',
    deliveryFee: 0,
    minOrderAmount: 0,
    isActive: true
  });

  const handleAddZone = () => {
    if (!formData.name || !formData.centerLat || !formData.centerLng) {
      alert('Please fill all required fields');
      return;
    }

    const newZone = {
      id: Date.now(),
      name: formData.name,
      radius: parseFloat(formData.radius),
      center: { 
        lat: parseFloat(formData.centerLat), 
        lng: parseFloat(formData.centerLng) 
      },
      deliveryFee: parseFloat(formData.deliveryFee),
      minOrderAmount: parseFloat(formData.minOrderAmount),
      isActive: formData.isActive
    };

    setZones([...zones, newZone]);
    setShowAddForm(false);
    resetForm();
  };

  const handleEditZone = () => {
    if (!formData.name || !formData.centerLat || !formData.centerLng) {
      alert('Please fill all required fields');
      return;
    }

    const updatedZones = zones.map(zone => 
      zone.id === editingZone.id 
        ? {
            ...zone,
            name: formData.name,
            radius: parseFloat(formData.radius),
            center: { 
              lat: parseFloat(formData.centerLat), 
              lng: parseFloat(formData.centerLng) 
            },
            deliveryFee: parseFloat(formData.deliveryFee),
            minOrderAmount: parseFloat(formData.minOrderAmount),
            isActive: formData.isActive
          }
        : zone
    );

    setZones(updatedZones);
    setEditingZone(null);
    setShowAddForm(false);
    resetForm();
  };

  const handleDeleteZone = (id) => {
    if (confirm('Are you sure you want to delete this delivery zone?')) {
      setZones(zones.filter(zone => zone.id !== id));
    }
  };

  const handleEdit = (zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      radius: zone.radius,
      centerLat: zone.center.lat.toString(),
      centerLng: zone.center.lng.toString(),
      deliveryFee: zone.deliveryFee,
      minOrderAmount: zone.minOrderAmount,
      isActive: zone.isActive
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      radius: 5,
      centerLat: '',
      centerLng: '',
      deliveryFee: 0,
      minOrderAmount: 0,
      isActive: true
    });
  };

  const toggleZoneStatus = (id) => {
    setZones(zones.map(zone => 
      zone.id === id ? { ...zone, isActive: !zone.isActive } : zone
    ));
  };

  return (
    <>
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Zones</h1>
        <p className="text-gray-600">Manage delivery zones and their settings</p>
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
          <FaPlus />
          Add New Zone
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingZone ? 'Edit Delivery Zone' : 'Add New Delivery Zone'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zone Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Downtown Area"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Radius (km) *
              </label>
              <input
                type="number"
                value={formData.radius}
                onChange={(e) => setFormData({...formData, radius: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
                max="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Center Latitude *
              </label>
              <input
                type="number"
                step="any"
                value={formData.centerLat}
                onChange={(e) => setFormData({...formData, centerLat: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 24.7136"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Center Longitude *
              </label>
              <input
                type="number"
                step="any"
                value={formData.centerLng}
                onChange={(e) => setFormData({...formData, centerLng: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 46.6753"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Fee ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.deliveryFee}
                onChange={(e) => setFormData({...formData, deliveryFee: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                min="0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded border-gray-300 mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Active Zone</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={editingZone ? handleEditZone : handleAddZone}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {editingZone ? 'Update Zone' : 'Add Zone'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingZone(null);
                resetForm();
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Zones List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Delivery Zones ({zones.length})</h2>
        </div>
        
        <div className="p-6">
          {zones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaMapMarkerAlt className="mx-auto text-4xl mb-4 text-gray-300" />
              <p>No delivery zones configured yet.</p>
              <p className="text-sm">Click "Add New Zone" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {zones.map((zone) => (
                <div key={zone.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-primary text-xl" />
                      <div>
                        <h3 className="font-semibold text-lg">{zone.name}</h3>
                        <p className="text-sm text-gray-600">
                          Radius: {zone.radius}km | 
                          Center: {zone.center.lat.toFixed(4)}, {zone.center.lng.toFixed(4)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Delivery Fee: ${zone.deliveryFee} | 
                          Min Order: ${zone.minOrderAmount}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        zone.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {zone.isActive ? 'Active' : 'Inactive'}
                      </span>
                      
                      <button
                        onClick={() => toggleZoneStatus(zone.id)}
                        className={`px-3 py-1 rounded text-sm ${
                          zone.isActive 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {zone.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      
                      <button
                        onClick={() => handleEdit(zone)}
                        className="text-blue-600 hover:text-blue-800 p-2"
                      >
                        <FaEdit />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteZone(zone.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
} 