'use client';
import { useState } from 'react';
import { FaCog, FaBell, FaShieldAlt, FaDatabase, FaGlobe, FaPalette, FaKey, FaUsers } from 'react-icons/fa';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'ElNaizak',
      siteDescription: 'Multi-service platform',
      contactEmail: 'admin@elnaizak.com',
      contactPhone: '+1234567890',
      timezone: 'UTC',
      language: 'en'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      orderAlerts: true,
      captainAlerts: true,
      vendorAlerts: true
    },
    security: {
      sessionTimeout: 30,
      requireTwoFactor: false,
      passwordMinLength: 8,
      maxLoginAttempts: 5
    },
    appearance: {
      theme: 'light',
      primaryColor: '#22c55e',
      sidebarCollapsed: false,
      showNotifications: true
    }
  });

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const saveSettings = async (category) => {
    try {
      // Here you would save to backend
      console.log(`Saving ${category} settings:`, settings[category]);
      alert(`${category} settings saved successfully!`);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };

  const TabButton = ({ id, title, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-primary text-white' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      {title}
    </button>
  );

  const SettingItem = ({ label, type = 'text', value, onChange, options = [] }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-200">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded border-gray-300"
        />
      ) : type === 'number' ? (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded px-3 py-1 text-sm w-24"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded px-3 py-1 text-sm w-64"
        />
      )}
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your system configuration</p>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex gap-2">
            <TabButton id="general" title="General" icon={<FaCog />} />
            <TabButton id="notifications" title="Notifications" icon={<FaBell />} />
            <TabButton id="security" title="Security" icon={<FaShieldAlt />} />
            <TabButton id="appearance" title="Appearance" icon={<FaPalette />} />
            <TabButton id="system" title="System" icon={<FaDatabase />} />
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">General Settings</h2>
              <SettingItem
                label="Site Name"
                value={settings.general.siteName}
                onChange={(value) => handleSettingChange('general', 'siteName', value)}
              />
              <SettingItem
                label="Site Description"
                value={settings.general.siteDescription}
                onChange={(value) => handleSettingChange('general', 'siteDescription', value)}
              />
              <SettingItem
                label="Contact Email"
                type="email"
                value={settings.general.contactEmail}
                onChange={(value) => handleSettingChange('general', 'contactEmail', value)}
              />
              <SettingItem
                label="Contact Phone"
                value={settings.general.contactPhone}
                onChange={(value) => handleSettingChange('general', 'contactPhone', value)}
              />
              <SettingItem
                label="Timezone"
                type="select"
                value={settings.general.timezone}
                onChange={(value) => handleSettingChange('general', 'timezone', value)}
                options={[
                  { value: 'UTC', label: 'UTC' },
                  { value: 'EST', label: 'Eastern Time' },
                  { value: 'PST', label: 'Pacific Time' },
                  { value: 'GMT', label: 'GMT' }
                ]}
              />
              <SettingItem
                label="Language"
                type="select"
                value={settings.general.language}
                onChange={(value) => handleSettingChange('general', 'language', value)}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'ar', label: 'Arabic' },
                  { value: 'fr', label: 'French' }
                ]}
              />
              <div className="pt-4">
                <button
                  onClick={() => saveSettings('general')}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save General Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
              <SettingItem
                label="Email Notifications"
                type="checkbox"
                value={settings.notifications.emailNotifications}
                onChange={(value) => handleSettingChange('notifications', 'emailNotifications', value)}
              />
              <SettingItem
                label="SMS Notifications"
                type="checkbox"
                value={settings.notifications.smsNotifications}
                onChange={(value) => handleSettingChange('notifications', 'smsNotifications', value)}
              />
              <SettingItem
                label="Push Notifications"
                type="checkbox"
                value={settings.notifications.pushNotifications}
                onChange={(value) => handleSettingChange('notifications', 'pushNotifications', value)}
              />
              <SettingItem
                label="Order Alerts"
                type="checkbox"
                value={settings.notifications.orderAlerts}
                onChange={(value) => handleSettingChange('notifications', 'orderAlerts', value)}
              />
              <SettingItem
                label="Captain Alerts"
                type="checkbox"
                value={settings.notifications.captainAlerts}
                onChange={(value) => handleSettingChange('notifications', 'captainAlerts', value)}
              />
              <SettingItem
                label="Vendor Alerts"
                type="checkbox"
                value={settings.notifications.vendorAlerts}
                onChange={(value) => handleSettingChange('notifications', 'vendorAlerts', value)}
              />
              <div className="pt-4">
                <button
                  onClick={() => saveSettings('notifications')}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save Notification Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
              <SettingItem
                label="Session Timeout (minutes)"
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(value) => handleSettingChange('security', 'sessionTimeout', value)}
              />
              <SettingItem
                label="Require Two-Factor Authentication"
                type="checkbox"
                value={settings.security.requireTwoFactor}
                onChange={(value) => handleSettingChange('security', 'requireTwoFactor', value)}
              />
              <SettingItem
                label="Minimum Password Length"
                type="number"
                value={settings.security.passwordMinLength}
                onChange={(value) => handleSettingChange('security', 'passwordMinLength', value)}
              />
              <SettingItem
                label="Maximum Login Attempts"
                type="number"
                value={settings.security.maxLoginAttempts}
                onChange={(value) => handleSettingChange('security', 'maxLoginAttempts', value)}
              />
              <div className="pt-4">
                <button
                  onClick={() => saveSettings('security')}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save Security Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
              <SettingItem
                label="Theme"
                type="select"
                value={settings.appearance.theme}
                onChange={(value) => handleSettingChange('appearance', 'theme', value)}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'auto', label: 'Auto' }
                ]}
              />
              <SettingItem
                label="Primary Color"
                type="color"
                value={settings.appearance.primaryColor}
                onChange={(value) => handleSettingChange('appearance', 'primaryColor', value)}
              />
              <SettingItem
                label="Collapse Sidebar by Default"
                type="checkbox"
                value={settings.appearance.sidebarCollapsed}
                onChange={(value) => handleSettingChange('appearance', 'sidebarCollapsed', value)}
              />
              <SettingItem
                label="Show Notifications Badge"
                type="checkbox"
                value={settings.appearance.showNotifications}
                onChange={(value) => handleSettingChange('appearance', 'showNotifications', value)}
              />
              <div className="pt-4">
                <button
                  onClick={() => saveSettings('appearance')}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save Appearance Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">System Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">System Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Backend API:</span>
                      <span className="text-green-600">Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Database:</span>
                      <span className="text-green-600">Connected</span>
                    </div>
                    <div className="flex justify-between">
                      <span>File Storage:</span>
                      <span className="text-green-600">Available</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800">
                      Clear Cache
                    </button>
                    <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800">
                      Backup Database
                    </button>
                    <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800">
                      View Logs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
  