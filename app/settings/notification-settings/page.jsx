'use client';
import { useState } from 'react';
import { FaBell, FaEnvelope, FaSms, FaMobile, FaDesktop, FaSave } from 'react-icons/fa';

export default function NotificationSettingsPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      enabled: true,
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'noreply@elnaizak.com',
      smtpPassword: '',
      fromEmail: 'noreply@elnaizak.com',
      fromName: 'ElNaizak Platform'
    },
    sms: {
      enabled: false,
      provider: 'twilio',
      accountSid: '',
      authToken: '',
      fromNumber: ''
    },
    push: {
      enabled: true,
      vapidPublicKey: '',
      vapidPrivateKey: ''
    },
    notifications: {
      newOrder: { email: true, sms: false, push: true },
      orderStatus: { email: true, sms: true, push: true },
      newVendor: { email: true, sms: false, push: false },
      newCaptain: { email: true, sms: false, push: false },
      paymentReceived: { email: true, sms: false, push: true },
      systemAlert: { email: true, sms: true, push: true }
    }
  });

  const handleSettingChange = (category, key, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleNotificationChange = (notificationType, channel, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [notificationType]: {
          ...prev.notifications[notificationType],
          [channel]: value
        }
      }
    }));
  };

  const saveSettings = async (category) => {
    try {
      console.log(`Saving ${category} settings:`, notificationSettings[category]);
      alert(`${category} settings saved successfully!`);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };

  const SettingItem = ({ label, type = 'text', value, onChange, options = [], placeholder = '' }) => (
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
          placeholder={placeholder}
        />
      )}
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Settings</h1>
        <p className="text-gray-600">Configure email, SMS, and push notification settings</p>
      </div>

      <div className="space-y-6">
        {/* Email Configuration */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-blue-600 text-2xl" />
              <h2 className="text-xl font-semibold">Email Configuration</h2>
            </div>
          </div>
          <div className="p-6">
            <SettingItem
              label="Enable Email Notifications"
              type="checkbox"
              value={notificationSettings.email.enabled}
              onChange={(value) => handleSettingChange('email', 'enabled', value)}
            />
            <SettingItem
              label="SMTP Host"
              value={notificationSettings.email.smtpHost}
              onChange={(value) => handleSettingChange('email', 'smtpHost', value)}
            />
            <SettingItem
              label="SMTP Port"
              type="number"
              value={notificationSettings.email.smtpPort}
              onChange={(value) => handleSettingChange('email', 'smtpPort', value)}
            />
            <SettingItem
              label="SMTP Username"
              value={notificationSettings.email.smtpUser}
              onChange={(value) => handleSettingChange('email', 'smtpUser', value)}
            />
            <SettingItem
              label="SMTP Password"
              type="password"
              value={notificationSettings.email.smtpPassword}
              onChange={(value) => handleSettingChange('email', 'smtpPassword', value)}
            />
            <SettingItem
              label="From Email"
              type="email"
              value={notificationSettings.email.fromEmail}
              onChange={(value) => handleSettingChange('email', 'fromEmail', value)}
            />
            <SettingItem
              label="From Name"
              value={notificationSettings.email.fromName}
              onChange={(value) => handleSettingChange('email', 'fromName', value)}
            />
            <div className="pt-4">
              <button
                onClick={() => saveSettings('email')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <FaSave />
                Save Email Settings
              </button>
            </div>
          </div>
        </div>

        {/* SMS Configuration */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FaSms className="text-green-600 text-2xl" />
              <h2 className="text-xl font-semibold">SMS Configuration</h2>
            </div>
          </div>
          <div className="p-6">
            <SettingItem
              label="Enable SMS Notifications"
              type="checkbox"
              value={notificationSettings.sms.enabled}
              onChange={(value) => handleSettingChange('sms', 'enabled', value)}
            />
            <SettingItem
              label="SMS Provider"
              type="select"
              value={notificationSettings.sms.provider}
              onChange={(value) => handleSettingChange('sms', 'provider', value)}
              options={[
                { value: 'twilio', label: 'Twilio' },
                { value: 'nexmo', label: 'Nexmo' },
                { value: 'aws-sns', label: 'AWS SNS' }
              ]}
            />
            <SettingItem
              label="Account SID"
              value={notificationSettings.sms.accountSid}
              onChange={(value) => handleSettingChange('sms', 'accountSid', value)}
              placeholder="Account SID from provider"
            />
            <SettingItem
              label="Auth Token"
              type="password"
              value={notificationSettings.sms.authToken}
              onChange={(value) => handleSettingChange('sms', 'authToken', value)}
              placeholder="Auth token from provider"
            />
            <SettingItem
              label="From Number"
              value={notificationSettings.sms.fromNumber}
              onChange={(value) => handleSettingChange('sms', 'fromNumber', value)}
              placeholder="+1234567890"
            />
            <div className="pt-4">
              <button
                onClick={() => saveSettings('sms')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
              >
                <FaSave />
                Save SMS Settings
              </button>
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FaMobile className="text-purple-600 text-2xl" />
              <h2 className="text-xl font-semibold">Push Notifications</h2>
            </div>
          </div>
          <div className="p-6">
            <SettingItem
              label="Enable Push Notifications"
              type="checkbox"
              value={notificationSettings.push.enabled}
              onChange={(value) => handleSettingChange('push', 'enabled', value)}
            />
            <SettingItem
              label="VAPID Public Key"
              value={notificationSettings.push.vapidPublicKey}
              onChange={(value) => handleSettingChange('push', 'vapidPublicKey', value)}
              placeholder="VAPID public key"
            />
            <SettingItem
              label="VAPID Private Key"
              type="password"
              value={notificationSettings.push.vapidPrivateKey}
              onChange={(value) => handleSettingChange('push', 'vapidPrivateKey', value)}
              placeholder="VAPID private key"
            />
            <div className="pt-4">
              <button
                onClick={() => saveSettings('push')}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2"
              >
                <FaSave />
                Save Push Settings
              </button>
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FaBell className="text-orange-600 text-2xl" />
              <h2 className="text-xl font-semibold">Notification Types</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(notificationSettings.notifications).map(([type, channels]) => (
                <div key={type} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-blue-600" />
                      <label className="text-sm">Email</label>
                      <input
                        type="checkbox"
                        checked={channels.email}
                        onChange={(e) => handleNotificationChange(type, 'email', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <FaSms className="text-green-600" />
                      <label className="text-sm">SMS</label>
                      <input
                        type="checkbox"
                        checked={channels.sms}
                        onChange={(e) => handleNotificationChange(type, 'sms', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMobile className="text-purple-600" />
                      <label className="text-sm">Push</label>
                      <input
                        type="checkbox"
                        checked={channels.push}
                        onChange={(e) => handleNotificationChange(type, 'push', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <button
                onClick={() => saveSettings('notifications')}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 flex items-center gap-2"
              >
                <FaSave />
                Save Notification Types
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 