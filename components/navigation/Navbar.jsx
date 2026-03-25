'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  FaChevronDown,
  FaLeaf,
  FaClinicMedical,
  FaShoppingBag,
  FaCar,
  FaHamburger,
  FaPlus,
  FaCog,
  FaFileAlt,
  FaUsers,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';

export default function TopNavbar() {
  const [showModules, setShowModules] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const { admin, logout } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow px-4 py-3 flex items-center justify-between h-16 border-b">
      {/* Left Side: Logo */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-primary whitespace-nowrap">ElNaizak</h1>
      </div>

      {/* Center: Links */}
      <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
        <button onClick={() => router.push("/")} className="hover:text-primary flex items-center gap-2 transition-all duration-150">
          <FaUsers /> Users
        </button>
        <button onClick={() => router.push("/")} className="hover:text-primary flex items-center gap-2 transition-all duration-150">
          <FaFileAlt /> Reports
        </button>
        <button onClick={() => router.push("/settings/delivery-zone")} className="hover:text-primary flex items-center gap-2 transition-all duration-150">
          <FaCog /> Settings
        </button>
      </div>

      {/* Right: Module Selector and User Menu */}
      <div className="flex items-center gap-4">

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-all text-sm"
          >
            <FaUser className="text-gray-600" />
            <span className="hidden sm:inline">{admin?.username || 'Admin'}</span>
            <FaChevronDown className="text-gray-500" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
              <div className="p-3 border-b">
                <p className="text-sm font-medium text-gray-900">{admin?.username}</p>
                <p className="text-xs text-gray-500 capitalize">{admin?.role?.replace('_', ' ')}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
