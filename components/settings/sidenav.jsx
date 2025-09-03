'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FaArrowLeft, FaMapMarkerAlt, FaCog, FaCreditCard, FaBell, FaServer, FaUsers, FaShieldAlt, FaGlobe } from 'react-icons/fa';

export default function SettingsSidenav() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('delivery-zone');

  const handleBack = () => {
    router.push('/');
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    // Navigate to the corresponding settings page
    if (item === 'delivery-zone') {
      router.push('/settings/delivery-zone');
    } else {
      router.push(`/settings/${item}`);
    }
  };

  // Check if current path matches a route
  const isActiveRoute = (route) => {
    return pathname === route || pathname.startsWith(route + '/');
  };

  // Get active class based on route
  const getActiveClass = (route) => {
    return isActiveRoute(route) ? 'bg-green-600 text-white' : 'hover:bg-green-700';
  };

  return (
    <div className="fixed pt-20 top-0 left-0 w-64 h-screen bg-primary text-white p-4 overflow-y-auto z-50">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-white hover:text-gray-200 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </button>
      </div>

      {/* Settings Header */}
      <div className="mb-6">
        <div className="flex items-center">
          <FaCog className="mr-3 text-xl" />
          <h2 className="text-xl font-bold">Settings</h2>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="space-y-2">
        <button
          onClick={() => handleItemClick('delivery-zone')}
          className={`flex items-center justify-between w-full px-2 py-2 rounded transition-colors ${getActiveClass('/settings/delivery-zone')}`}
        >
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt size={20} />
            <span>Delivery Zone</span>
          </div>
        </button>
        
        <button
          onClick={() => handleItemClick('payment-settings')}
          className={`flex items-center justify-between w-full px-2 py-2 rounded transition-colors ${getActiveClass('/settings/payment-settings')}`}
        >
          <div className="flex items-center gap-2">
            <FaCreditCard size={20} />
            <span>Payment Settings</span>
          </div>
        </button>

        <button
          onClick={() => handleItemClick('notification-settings')}
          className={`flex items-center justify-between w-full px-2 py-2 rounded transition-colors ${getActiveClass('/settings/notification-settings')}`}
        >
          <div className="flex items-center gap-2">
            <FaBell size={20} />
            <span>Notifications</span>
          </div>
        </button>

        <button
          onClick={() => handleItemClick('system-settings')}
          className={`flex items-center justify-between w-full px-2 py-2 rounded transition-colors ${getActiveClass('/settings/system-settings')}`}
        >
          <div className="flex items-center gap-2">
            <FaServer size={20} />
            <span>System Settings</span>
          </div>
        </button>

        <button
          onClick={() => handleItemClick('user-management')}
          className={`flex items-center justify-between w-full px-2 py-2 rounded transition-colors ${getActiveClass('/settings/user-management')}`}
        >
          <div className="flex items-center gap-2">
            <FaUsers size={20} />
            <span>User Management</span>
          </div>
        </button>

        <button
          onClick={() => handleItemClick('security-settings')}
          className={`flex items-center justify-between w-full px-2 py-2 rounded transition-colors ${getActiveClass('/settings/security-settings')}`}
        >
          <div className="flex items-center gap-2">
            <FaShieldAlt size={20} />
            <span>Security</span>
          </div>
        </button>

        <button
          onClick={() => handleItemClick('general-settings')}
          className={`flex items-center justify-between w-full px-2 py-2 rounded transition-colors ${getActiveClass('/settings/general-settings')}`}
        >
          <div className="flex items-center gap-2">
            <FaGlobe size={20} />
            <span>General Settings</span>
          </div>
        </button>
      </div>
    </div>
  );
}
