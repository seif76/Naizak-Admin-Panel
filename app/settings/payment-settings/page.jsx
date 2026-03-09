'use client';
import { useState } from 'react';
import { FaCreditCard, FaPaypal, FaStripe, FaCog, FaSave } from 'react-icons/fa';

export default function PaymentSettingsPage() {
  const [paymentSettings, setPaymentSettings] = useState({
    stripe: {
      enabled: true,
      publishableKey: 'pk_test_...',
      secretKey: 'sk_test_...',
      webhookSecret: 'whsec_...'
    },
    paypal: {
      enabled: false,
      clientId: '',
      clientSecret: '',
      mode: 'sandbox'
    },
    commission: {
      platformFee: 10, // percentage
      deliveryFee: 5, // percentage
      minimumOrder: 10.00
    },
    paymentMethods: {
      creditCard: true,
      debitCard: true,
      cashOnDelivery: true,
      digitalWallet: false
    }
  });

  const handleSettingChange = (category, key, value) => {
    setPaymentSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const saveSettings = async (category) => {
    try {
      console.log(`Saving ${category} settings:`, paymentSettings[category]);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Settings</h1>
        <p className="text-gray-600">Configure payment gateways and commission settings</p>
      </div>

      <div className="space-y-6">
        {/* Stripe Configuration */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FaStripe className="text-blue-600 text-2xl" />
              <h2 className="text-xl font-semibold">Stripe Configuration</h2>
            </div>
          </div>
          <div className="p-6">
            <SettingItem
              label="Enable Stripe"
              type="checkbox"
              value={paymentSettings.stripe.enabled}
              onChange={(value) => handleSettingChange('stripe', 'enabled', value)}
            />
            <SettingItem
              label="Publishable Key"
              value={paymentSettings.stripe.publishableKey}
              onChange={(value) => handleSettingChange('stripe', 'publishableKey', value)}
              placeholder="pk_test_..."
            />
            <SettingItem
              label="Secret Key"
              type="password"
              value={paymentSettings.stripe.secretKey}
              onChange={(value) => handleSettingChange('stripe', 'secretKey', value)}
              placeholder="sk_test_..."
            />
            <SettingItem
              label="Webhook Secret"
              type="password"
              value={paymentSettings.stripe.webhookSecret}
              onChange={(value) => handleSettingChange('stripe', 'webhookSecret', value)}
              placeholder="whsec_..."
            />
            <div className="pt-4">
              <button
                onClick={() => saveSettings('stripe')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <FaSave />
                Save Stripe Settings
              </button>
            </div>
          </div>
        </div>

        {/* PayPal Configuration */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FaPaypal className="text-blue-500 text-2xl" />
              <h2 className="text-xl font-semibold">PayPal Configuration</h2>
            </div>
          </div>
          <div className="p-6">
            <SettingItem
              label="Enable PayPal"
              type="checkbox"
              value={paymentSettings.paypal.enabled}
              onChange={(value) => handleSettingChange('paypal', 'enabled', value)}
            />
            <SettingItem
              label="Client ID"
              value={paymentSettings.paypal.clientId}
              onChange={(value) => handleSettingChange('paypal', 'clientId', value)}
              placeholder="Client ID from PayPal"
            />
            <SettingItem
              label="Client Secret"
              type="password"
              value={paymentSettings.paypal.clientSecret}
              onChange={(value) => handleSettingChange('paypal', 'clientSecret', value)}
              placeholder="Client Secret from PayPal"
            />
            <SettingItem
              label="Mode"
              type="select"
              value={paymentSettings.paypal.mode}
              onChange={(value) => handleSettingChange('paypal', 'mode', value)}
              options={[
                { value: 'sandbox', label: 'Sandbox (Testing)' },
                { value: 'live', label: 'Live (Production)' }
              ]}
            />
            <div className="pt-4">
              <button
                onClick={() => saveSettings('paypal')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
              >
                <FaSave />
                Save PayPal Settings
              </button>
            </div>
          </div>
        </div>

        {/* Commission Settings */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FaCog className="text-green-600 text-2xl" />
              <h2 className="text-xl font-semibold">Commission & Fees</h2>
            </div>
          </div>
          <div className="p-6">
            <SettingItem
              label="Platform Commission (%)"
              type="number"
              value={paymentSettings.commission.platformFee}
              onChange={(value) => handleSettingChange('commission', 'platformFee', value)}
            />
            <SettingItem
              label="Delivery Fee (%)"
              type="number"
              value={paymentSettings.commission.deliveryFee}
              onChange={(value) => handleSettingChange('commission', 'deliveryFee', value)}
            />
            <SettingItem
              label="Minimum Order Amount ($)"
              type="number"
              value={paymentSettings.commission.minimumOrder}
              onChange={(value) => handleSettingChange('commission', 'minimumOrder', value)}
            />
            <div className="pt-4">
              <button
                onClick={() => saveSettings('commission')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
              >
                <FaSave />
                Save Commission Settings
              </button>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FaCreditCard className="text-purple-600 text-2xl" />
              <h2 className="text-xl font-semibold">Payment Methods</h2>
            </div>
          </div>
          <div className="p-6">
            <SettingItem
              label="Credit Cards"
              type="checkbox"
              value={paymentSettings.paymentMethods.creditCard}
              onChange={(value) => handleSettingChange('paymentMethods', 'creditCard', value)}
            />
            <SettingItem
              label="Debit Cards"
              type="checkbox"
              value={paymentSettings.paymentMethods.debitCard}
              onChange={(value) => handleSettingChange('paymentMethods', 'debitCard', value)}
            />
            <SettingItem
              label="Cash on Delivery"
              type="checkbox"
              value={paymentSettings.paymentMethods.cashOnDelivery}
              onChange={(value) => handleSettingChange('paymentMethods', 'cashOnDelivery', value)}
            />
            <SettingItem
              label="Digital Wallets"
              type="checkbox"
              value={paymentSettings.paymentMethods.digitalWallet}
              onChange={(value) => handleSettingChange('paymentMethods', 'digitalWallet', value)}
            />
            <div className="pt-4">
              <button
                onClick={() => saveSettings('paymentMethods')}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2"
              >
                <FaSave />
                Save Payment Methods
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 