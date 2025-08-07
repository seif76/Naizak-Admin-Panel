'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  MessageCircle, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShoppingBag,
  Package,
  Eye,
  ExternalLink,
  RefreshCw,
  Send,
  MoreVertical
} from 'lucide-react';
import Cookies from 'js-cookie';
export default function SupportChat() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [chatTypeFilter, setChatTypeFilter] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const token = Cookies.get('admin_token');
  const fetchChats = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (chatTypeFilter) params.append('chat_type', chatTypeFilter);
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/support/chats?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setChats(response.data.chats || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/support/chats/${chatId}/messages`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    try {
      setSendingMessage(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/support/chats/${selectedChat.id}/messages`,
        { message: newMessage }
      );
      
      setNewMessage('');
      await fetchMessages(selectedChat.id);
      await fetchChats(); // Refresh chat list to update last message
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleChatSelect = async (chat) => {
    setSelectedChat(chat);
    await fetchMessages(chat.id);
  };

  const getChatIcon = (userType) => {
    switch (userType) {
      case 'customer':
        return <User className="w-4 h-4" />;
      case 'vendor':
        return <ShoppingBag className="w-4 h-4" />;
      case 'captain':
        return <Package className="w-4 h-4" />;
      case 'admin':
      case 'support':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'resolved':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChatTypeColor = (chatType) => {
    switch (chatType) {
      case 'support':
        return 'bg-red-100 text-red-800';
      case 'order':
        return 'bg-blue-100 text-blue-800';
      case 'ride':
        return 'bg-purple-100 text-purple-800';
      case 'general':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredChats = chats.filter(chat => {
    const matchesSearch = 
      chat.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.user_phone?.includes(searchQuery) ||
      chat.last_message?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  useEffect(() => {
    fetchChats();
  }, [statusFilter, chatTypeFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat List Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Support Chats</h1>
          
          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              
              <select
                value={chatTypeFilter}
                onChange={(e) => setChatTypeFilter(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="support">Support</option>
                <option value="order">Order</option>
                <option value="ride">Ride</option>
                <option value="general">General</option>
              </select>
            </div>
            
            <button
              onClick={fetchChats}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No chats found
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getChatIcon(chat.user_type)}
                    <div>
                      <h3 className="font-medium text-gray-900">{chat.user_name}</h3>
                      <p className="text-sm text-gray-500">{chat.user_phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(chat.status)}`}>
                      {chat.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getChatTypeColor(chat.chat_type)}`}>
                      {chat.chat_type}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{chat.last_message}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(chat.updated_at)}</span>
                  {chat.last_message_sender && (
                    <span className="flex items-center gap-1">
                      by {chat.last_message_sender.name}
                    </span>
                  )}
                </div>

                {/* Additional Info */}
                {chat.vendor_details && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                    <p className="font-medium">Vendor: {chat.vendor_details.shop_name}</p>
                    <p className="text-gray-600">{chat.vendor_details.shop_location}</p>
                  </div>
                )}

                {chat.customer_orders && chat.customer_orders.length > 0 && (
                  <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                    <p className="font-medium">Recent Orders: {chat.customer_orders.length}</p>
                    <p className="text-gray-600">Latest: ${chat.customer_orders[0]?.total_amount || 0}</p>
                  </div>
                )}

                {chat.navigation_context && (
                  <div className="mt-2">
                    <a
                      href={chat.navigation_context.url}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View {chat.navigation_context.type}
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getChatIcon(selectedChat.user_type)}
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedChat.user_name}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {selectedChat.user_phone}
                      </span>
                      {selectedChat.user_email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {selectedChat.user_email}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedChat.status)}`}>
                        {selectedChat.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {selectedChat.navigation_context && (
                    <a
                      href={selectedChat.navigation_context.url}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View  {selectedChat.navigation_context.type}
                    </a>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* User Details */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Type:</span> {selectedChat.user_type}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {selectedChat.user_status}
                  </div>
                  {selectedChat.vendor_details && (
                    <>
                      <div className="col-span-2">
                        <span className="font-medium">Shop:</span> {selectedChat.vendor_details.shop_name}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Location:</span> {selectedChat.vendor_details.shop_location}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Owner:</span> {selectedChat.vendor_details.owner_name}
                      </div>
                    </>
                  )}
                  {selectedChat.customer_orders && selectedChat.customer_orders.length > 0 && (
                    <div className="col-span-2">
                      <span className="font-medium">Recent Orders:</span>
                      <div className="mt-1 space-y-1">
                        {selectedChat.customer_orders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex items-center justify-between text-xs">
                            <span>Order #{order.id}</span>
                            <span>${order.total_price}</span>
                            <span className={`px-1 py-0.5 rounded text-xs ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {console.log('Rendering messages:', messages)}
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No messages yet</p>
                </div>
              ) : (
                messages.map((message) => {
                  console.log('Rendering message:', message);
                  return (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_type === 'admin'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium ${
                            message.sender_type === 'admin' ? 'text-blue-100' : 'text-gray-600'
                          }`}>
                            {message.sender_name || 'Unknown'}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_type === 'admin' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatDate(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  disabled={sendingMessage}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {sendingMessage ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 