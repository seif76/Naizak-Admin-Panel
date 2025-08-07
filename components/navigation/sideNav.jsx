
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import api from '../../lib/axios';

import * as AiIcons from 'react-icons/ai';
import * as MdIcons from 'react-icons/md';
import { FaClipboardCheck, FaStore, FaShoppingCart, FaComments, FaChartLine, FaCog, FaUsers, FaUserTie } from 'react-icons/fa';

export default function SideNav() {
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openCaptain, setOpenCaptain] = useState(false);
  const [openVendor, setOpenVendor] = useState(false);
  const [openOrders, setOpenOrders] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const [counts, setCounts] = useState({
    customers: { total: 0, active: 0, deactivated: 0 },
    captains: { total: 0, active: 0, pending: 0, deactivated: 0 },
    vendors: { total: 0, active: 0, pending: 0, deactivated: 0 },
    orders: {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    },
    support: {
      active: 0,
      resolved: 0
    }
  });
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();

  const toggleCustomer = () => setOpenCustomer(!openCustomer);
  const toggleCaptain = () => setOpenCaptain(!openCaptain);
  const toggleVendor = () => setOpenVendor(!openVendor);
  const toggleOrders = () => setOpenOrders(!openOrders);
  const toggleSupport = () => setOpenSupport(!openSupport);

  const ArrowIcon = AiIcons.AiOutlineDown;

  // Fetch counts from backend
  const fetchCounts = async () => {
    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      const [customerRes, captainRes, vendorRes, orderRes, supportRes] = await Promise.all([
        api.get('/api/admin/customers/stats'),
        api.get('/api/admin/captains/stats'),
        api.get('/api/admin/vendors/stats'),
        api.get('/api/admin/orders/stats'),
        api.get('/api/admin/support/stats')
      ]);

      setCounts({
        customers: customerRes.data || { total: 0, active: 0, deactivated: 0 },
        captains: captainRes.data || { total: 0, active: 0, pending: 0, deactivated: 0 },
        vendors: vendorRes.data || { total: 0, active: 0, pending: 0, deactivated: 0 },
        orders: {
          total: orderRes.data?.total || 0,
          pending: orderRes.data?.pending || 0,
          confirmed: orderRes.data?.confirmed || 0,
          completed: orderRes.data?.completed || 0,
          cancelled: orderRes.data?.cancelled || 0
        },
        support: {
          active: supportRes.data?.active || 0,
          resolved: supportRes.data?.resolved || 0
        }
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
      // Set default values on error
      setCounts({
        customers: { total: 0, active: 0, deactivated: 0 },
        captains: { total: 0, active: 0, pending: 0, deactivated: 0 },
        vendors: { total: 0, active: 0, pending: 0, deactivated: 0 },
        orders: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
        support: { active: 0, resolved: 0 }
      });
    } finally {
      setLoading(false);
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

  // Get submenu active class
  const getSubmenuActiveClass = (route) => {
    return isActiveRoute(route) ? 'bg-green-800 text-white' : 'hover:bg-green-800';
  };

  // Auto-expand sections based on current route
  useEffect(() => {
    if (pathname.startsWith('/customers')) setOpenCustomer(true);
    if (pathname.startsWith('/captains')) setOpenCaptain(true);
    if (pathname.startsWith('/vendors')) setOpenVendor(true);
    if (pathname.startsWith('/orders')) setOpenOrders(true);
    if (pathname.startsWith('/support')) setOpenSupport(true);
  }, [pathname]);

  // Fetch counts on mount
  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div className="fixed pt-20 top-0 left-0 w-64 h-screen bg-primary text-white p-4 overflow-y-auto z-50">
      <h1 className="text-xl font-bold mb-6">Admin Panel</h1>

      {/* Dashboard */}
      <div className="mb-4">
        <Link 
          href="/" 
          className={`flex items-center justify-between px-2 py-2 rounded transition-colors ${getActiveClass('/')}`}
        >
          <div className="flex items-center gap-2">
            <FaChartLine size={20} />
            <span>Dashboard</span>
          </div>
        </Link>
      </div>

      {/* Customers */}
      <div>
        <button
          onClick={toggleCustomer}
          className={`flex items-center justify-between w-full px-2 py-2 rounded transition-colors ${getActiveClass('/customers')}`}
        >
          <div className="flex items-center gap-2">
            <MdIcons.MdPeopleOutline size={20} />
            <span>Customers</span>
            {!loading && (
              <span className="ml-auto bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                {counts.customers.total}
              </span>
            )}
          </div>
          <ArrowIcon className={`transition-transform ${openCustomer ? 'rotate-180' : ''}`} />
        </button>
        {openCustomer && (
          <div className="ml-6 mt-2 space-y-1">
            <Link 
              href="/customers/list" 
              className={`block px-2 py-1 rounded transition-colors ${getSubmenuActiveClass('/customers/list')}`}
            >
              List
            </Link>
            <Link 
              href="/customers/addNew" 
              className={`block px-2 py-1 rounded transition-colors ${getSubmenuActiveClass('/customers/addNew')}`}
            >
              Add New
            </Link>
          </div>
        )}
      </div>

      {/* Captains */}
      <div className="mt-4">
        <button
          onClick={toggleCaptain}
          className={`flex items-center justify-between w-full px-2 py-2 rounded transition-colors ${getActiveClass('/captains')}`}
        >
          <div className="flex items-center gap-2">
            <MdIcons.MdDriveEta size={20} />
            <span>Captains</span>
            {!loading && (
              <span className="ml-auto bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                {counts.captains.total}
              </span>
            )}
          </div>
          <ArrowIcon className={`transition-transform ${openCaptain ? 'rotate-180' : ''}`} />
        </button>
        {openCaptain && (
          <div className="ml-6 mt-2 space-y-1">
            <Link 
              href="/captains/list" 
              className={`block px-2 py-1 rounded transition-colors ${getSubmenuActiveClass('/captains/list')}`}
            >
              List
            </Link>
            <Link 
              href="/captains/addNew" 
              className={`block px-2 py-1 rounded transition-colors ${getSubmenuActiveClass('/captains/addNew')}`}
            >
              Add New
            </Link>
            <Link 
              href="/captains/pendingCaptains" 
              className={`block px-2 py-1 rounded transition-colors ${getSubmenuActiveClass('/captains/pendingCaptains')}`}
            >
              <div className="flex items-center justify-between">
                <span>Pending</span>
                {!loading && counts.captains.pending > 0 && (
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    {counts.captains.pending}
                  </span>
                )}
              </div>  
             
            </Link>
          </div>
        )}
      </div>

      {/* Vendors */}
      <div className="mt-4">
        <button
          onClick={toggleVendor}
          className={`flex items-center justify-between w-full px-2 py-2 rounded transition-colors ${getActiveClass('/vendors')}`}
        >
          <div className="flex items-center gap-2">
            <FaStore size={20} />
            <span>Vendors</span>
            {!loading && (
              <span className="ml-auto bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                {counts.vendors.total}
              </span>
            )}
          </div>
          <ArrowIcon className={`transition-transform ${openVendor ? 'rotate-180' : ''}`} />
        </button>
        {openVendor && (
          <div className="ml-6 mt-2 space-y-1">
            <Link 
              href="/vendors/list" 
              className={`block px-2 py-1 rounded transition-colors ${getSubmenuActiveClass('/vendors/list')}`}
            >
              List
            </Link>
            <Link 
              href="/vendors/addNew" 
              className={`block px-2 py-1 rounded transition-colors ${getSubmenuActiveClass('/vendors/addNew')}`}
            >
              Add New
            </Link>
            <Link 
              href="/vendors/pendingVendors" 
              className={`block px-2 py-1 rounded transition-colors ${getSubmenuActiveClass('/vendors/pendingVendors')}`}
            >
              <div className="flex items-center justify-between">
                <span>Pending</span>
                {!loading && counts.vendors.pending > 0 && (
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    {counts.vendors.pending}
                  </span>
                )}
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Orders */}
      <div className="mt-4">
        <button
          onClick={toggleOrders}
          className={`flex items-center justify-between w-full px-2 py-2 rounded transition-colors ${getActiveClass('/orders')}`}
        >
          <div className="flex items-center gap-2">
            <FaShoppingCart size={20} />
            <span>Orders</span>
            {!loading && (
              <span className="ml-auto bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                {counts.orders.total}
              </span>
            )}
          </div>
          <ArrowIcon className={`transition-transform ${openOrders ? 'rotate-180' : ''}`} />
        </button>
        {openOrders && (
          <div className="ml-6 mt-2 space-y-1">
            <Link 
              href="/orders/list" 
              className={`block px-2 py-1 rounded transition-colors ${getSubmenuActiveClass('/orders/list')}`}
            >
              All Orders
            </Link>
            <Link 
              href="/orders/pending" 
              className={`block px-2 py-1 rounded transition-colors ${getSubmenuActiveClass('/orders/pending')}`}
            >
              <div className="flex items-center justify-between">
                <span>Pending</span>
                {!loading && counts.orders.pending > 0 && (
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    {counts.orders.pending}
                  </span>
                )}
              </div>
            </Link>
            <Link 
              href="/orders/confirmed" 
              className={`block px-2 py-1 rounded transition-colors ${getSubmenuActiveClass('/orders/confirmed')}`}
            >
              <div className="flex items-center justify-between">
                <span>Confirmed</span>
                {!loading && counts.orders.confirmed > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {counts.orders.confirmed}
                  </span>
                )}
              </div>
            </Link>
            <Link 
              href="/orders/completed" 
              className={`block px-2 py-1 rounded transition-colors ${getSubmenuActiveClass('/orders/completed')}`}
            >
              <div className="flex items-center justify-between">
                <span>Completed</span>
                {!loading && counts.orders.completed > 0 && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {counts.orders.completed}
                  </span>
                )}
              </div>
            </Link>
            <Link 
              href="/orders/cancelled" 
              className={`block px-2 py-1 rounded transition-colors ${getSubmenuActiveClass('/orders/cancelled')}`}
            >
              <div className="flex items-center justify-between">
                <span>Cancelled</span>
                {!loading && counts.orders.cancelled > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {counts.orders.cancelled}
                  </span>
                )}
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Support */}
      <div className="mt-4">
        <button
          onClick={toggleSupport}
          className={`flex items-center justify-between w-full px-2 py-2 rounded transition-colors ${getActiveClass('/support')}`}
        >
          <div className="flex items-center gap-2">
            <FaComments size={20} />
            <span>Support</span>
            {!loading && (
              <span className="ml-auto bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                {counts.support.active + counts.support.resolved}
              </span>
            )}
          </div>
          <ArrowIcon className={`transition-transform ${openSupport ? 'rotate-180' : ''}`} />
        </button>
        {openSupport && (
          <div className="ml-6 mt-2 space-y-1">
            <Link 
              href="/support/chat" 
              className={`block px-2 py-1 rounded transition-colors ${getSubmenuActiveClass('/support/chat')}`}
            >
              <div className="flex items-center justify-between">
                <span>Chat Support</span>
                {!loading && counts.support.active > 0 && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    {counts.support.active}
                  </span>
                )}
              </div>
            </Link>
            <Link 
              href="/support/tickets" 
              className={`block px-2 py-1 rounded transition-colors ${getSubmenuActiveClass('/support/tickets')}`}
            >
              <div className="flex items-center justify-between">
                <span>Tickets</span>
                {!loading && counts.support.resolved > 0 && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {counts.support.resolved}
                  </span>
                )}
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="mt-6 pt-6 border-t border-green-600">
        <Link 
          href="/settings" 
          className={`flex items-center gap-2 px-2 py-2 rounded transition-colors ${getActiveClass('/settings')}`}
        >
          <FaCog size={20} />
          <span>Settings</span>
        </Link>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
        </div>
      )}
    </div>
  );
}

