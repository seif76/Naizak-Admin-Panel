'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaChartLine, 
  FaUsers, 
  FaUserTie, 
  FaStore, 
  FaShoppingCart, 
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaFilter
} from 'react-icons/fa';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalVendors: 0,
      revenueGrowth: 0,
      orderGrowth: 0
    },
    revenue: {
      daily: [],
      weekly: [],
      monthly: []
    },
    topVendors: [],
    topProducts: [],
    recentOrders: []
  });
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // This would need to be implemented in the backend
      const res = await axios.get(`${BACKEND_URL}/api/admin/dashboard/overview?range=${timeRange}`);
      setAnalytics(res.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Mock data for demonstration
      setAnalytics({
        overview: {
          totalRevenue: 125000,
          totalOrders: 1250,
          totalCustomers: 850,
          totalVendors: 120,
          revenueGrowth: 12.5,
          orderGrowth: 8.3
        },
        revenue: {
          daily: [],
          weekly: [],
          monthly: []
        },
        topVendors: [
          { name: 'Tech Store', revenue: 15000, orders: 150 },
          { name: 'Food Corner', revenue: 12000, orders: 200 },
          { name: 'Fashion Hub', revenue: 10000, orders: 80 }
        ],
        topProducts: [
          { name: 'iPhone 13', sales: 50, revenue: 50000 },
          { name: 'Pizza Margherita', sales: 200, revenue: 4000 },
          { name: 'Nike Shoes', sales: 30, revenue: 3000 }
        ],
        recentOrders: [
          { id: 1, customer: 'John Doe', vendor: 'Tech Store', amount: 1200, status: 'completed' },
          { id: 2, customer: 'Jane Smith', vendor: 'Food Corner', amount: 45, status: 'pending' },
          { id: 3, customer: 'Mike Johnson', vendor: 'Fashion Hub', amount: 89, status: 'confirmed' }
        ]
      });
    }
    setLoading(false);
  };

  const StatCard = ({ title, value, icon, growth, color = 'blue' }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {growth !== undefined && (
            <div className={`flex items-center text-sm ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growth >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span className="ml-1">{Math.abs(growth)}%</span>
            </div>
          )}
        </div>
        <div className={`text-3xl text-${color}-500`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const RevenueChart = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Revenue Overview</h3>
        <div className="flex gap-2">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === range 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 flex items-end justify-center gap-2">
        {/* Mock chart bars */}
        {[65, 80, 45, 90, 75, 85, 70].map((height, index) => (
          <div
            key={index}
            className="w-8 bg-gradient-to-t from-primary to-green-400 rounded-t"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        Revenue trend for the selected period
      </div>
    </div>
  );

  const TopList = ({ title, data, type = 'vendor' }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
              <div>
                <p className="font-medium">{item.name}</p>
                {type === 'vendor' && (
                  <p className="text-sm text-gray-600">{item.orders} orders</p>
                )}
                {type === 'product' && (
                  <p className="text-sm text-gray-600">{item.sales} sold</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-primary">${item.revenue?.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Monitor your platform performance and insights</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`$${analytics.overview.totalRevenue.toLocaleString()}`}
          icon={<FaDollarSign />}
          growth={analytics.overview.revenueGrowth}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={analytics.overview.totalOrders.toLocaleString()}
          icon={<FaShoppingCart />}
          growth={analytics.overview.orderGrowth}
          color="blue"
        />
        <StatCard
          title="Total Customers"
          value={analytics.overview.totalCustomers.toLocaleString()}
          icon={<FaUsers />}
          color="purple"
        />
        <StatCard
          title="Active Vendors"
          value={analytics.overview.totalVendors.toLocaleString()}
          icon={<FaStore />}
          color="orange"
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueChart />
        <TopList
          title="Top Vendors"
          data={analytics.topVendors}
          type="vendor"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopList
          title="Top Products"
          data={analytics.topProducts}
          type="product"
        />
        
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {analytics.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">#{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.vendor}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">${order.amount}</p>
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Platform Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Order Value</span>
              <span className="font-semibold">$45.20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer Retention</span>
              <span className="font-semibold">78%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vendor Satisfaction</span>
              <span className="font-semibold">4.2/5</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Service Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Food Delivery</span>
              <span className="font-semibold">45%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shopping</span>
              <span className="font-semibold">30%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ride Services</span>
              <span className="font-semibold">25%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800">
              Generate Report
            </button>
            <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800">
              Export Data
            </button>
            <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800">
              View Detailed Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 