'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaUsers, 
  FaUserTie, 
  FaStore, 
  FaCar, 
  FaShoppingCart, 
  FaComments,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    customers: { total: 0, active: 0, deactivated: 0 },
    captains: { total: 0, active: 0, pending: 0, deactivated: 0 },
    vendors: { total: 0, active: 0, pending: 0, deactivated: 0 },
    orders: { total: 0, pending: 0, completed: 0 },
    rides: { total: 0, active: 0, completed: 0 }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      const [customersRes, captainsRes, vendorsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/admin/customers/stats`),
        axios.get(`${BACKEND_URL}/api/admin/captains/stats`),
        axios.get(`${BACKEND_URL}/api/admin/vendors/stats`)
      ]);

      setStats({
        customers: customersRes.data,
        captains: captainsRes.data,
        vendors: vendorsRes.data,
        orders: { total: 0, pending: 0, completed: 0 }, // TODO: Add order stats
        rides: { total: 0, active: 0, completed: 0 } // TODO: Add ride stats
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error details:', error.response?.data);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`text-3xl ${color.replace('border-l-', 'text-')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon, color, href }) => (
    <Link href={href} className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${color}`}>
      <div className="flex items-center gap-4">
        <div className={`text-2xl ${color.replace('border-l-', 'text-')}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Customers"
          value={stats.customers.active + stats.customers.deactivated}
          icon={<FaUsers />}
          color="border-l-blue-500"
          subtitle={`${stats.customers.active} active`}
        />
        <StatCard
          title="Total Captains"
          value={stats.captains.active + stats.captains.pending + stats.captains.deactivated}
          icon={<FaUserTie />}
          color="border-l-green-500"
          subtitle={`${stats.captains.pending} pending`}
        />
        <StatCard
          title="Total Vendors"
          value={stats.vendors.active + stats.vendors.pending + stats.vendors.deactivated}
          icon={<FaStore />}
          color="border-l-purple-500"
          subtitle={`${stats.vendors.pending} pending`}
        />
        <StatCard
          title="Active Rides"
          value={stats.rides.active}
          icon={<FaCar />}
          color="border-l-orange-500"
          subtitle="Currently running"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Manage Captains"
            description="View and manage all captains"
            icon={<FaUserTie />}
            color="border-l-green-500"
            href="/captains/list"
          />
          <QuickActionCard
            title="Manage Customers"
            description="View and manage all customers"
            icon={<FaUsers />}
            color="border-l-blue-500"
            href="/customers/list"
          />
          <QuickActionCard
            title="Manage Vendors"
            description="View and manage all vendors"
            icon={<FaStore />}
            color="border-l-purple-500"
            href="/vendors/list"
          />
          <QuickActionCard
            title="View Orders"
            description="Monitor all orders"
            icon={<FaShoppingCart />}
            color="border-l-orange-500"
            href="/orders/list"
          />
          <QuickActionCard
            title="Chat Support"
            description="Manage customer support"
            icon={<FaComments />}
            color="border-l-pink-500"
            href="/chat/support"
          />
          <QuickActionCard
            title="Analytics"
            description="View detailed reports"
            icon={<FaChartLine />}
            color="border-l-indigo-500"
            href="/analytics"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaChartLine className="text-4xl mx-auto mb-4 text-gray-300" />
              <p>No recent activity to display</p>
            </div>
          ) : (
            recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                <div className="text-green-500">
                  <FaCheckCircle />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

