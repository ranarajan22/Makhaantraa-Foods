import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

export default function SettingsTab({ settings, updateSettings }) {
  const [formData, setFormData] = useState({
    companyName: 'Makhaantraa Foods',
    heroImage: settings?.heroImage || '',
    companyEmail: settings?.companyEmail || 'info@makhaantraa.com',
    companyPhone: settings?.companyPhone || '+91-XXXXXXXXXX',
    whatsappNumber: settings?.whatsappNumber || '+91-XXXXXXXXXX',
    businessAddress: '123 Business St, City, State, PIN',
    maintenanceMode: settings?.maintenanceMode || false,
    maintenanceMessage: settings?.maintenanceMessage || '',
    shippingCost: settings?.shippingCost ?? 50,
    taxPercentage: settings?.taxPercentage ?? 18,
    specialDiscountPercentage: settings?.specialDiscountPercentage ?? 0,
    paymentGateway: 'razorpay',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    currencyCode: 'INR'
  });

  // Sync incoming settings to the form when settings change
  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      companyEmail: settings?.companyEmail || 'info@makhaantraa.com',
      companyPhone: settings?.companyPhone || '+91-XXXXXXXXXX',
      whatsappNumber: settings?.whatsappNumber || '+91-XXXXXXXXXX',
      maintenanceMode: settings?.maintenanceMode || false,
      maintenanceMessage: settings?.maintenanceMessage || '',
      shippingCost: settings?.shippingCost ?? 50,
      taxPercentage: settings?.taxPercentage ?? 18,
      specialDiscountPercentage: settings?.specialDiscountPercentage ?? 0,
      currencyCode: settings?.currencyCode || 'INR',
      heroImage: settings?.heroImage || ''
    }));
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle hero image upload
  const handleHeroImageChange = (url) => {
    setFormData(prev => ({ ...prev, heroImage: url }));
  };

  const handleSubmit = () => {
    // Only send fields that exist in backend schema
    const validFields = [
      'companyEmail',
      'companyPhone',
      'whatsappNumber',
      'maintenanceMode',
      'maintenanceMessage',
      'shippingCost',
      'taxPercentage',
      'specialDiscountPercentage',
      'currencyCode',
      'heroImage'
    ];
    const payload = {};
    validFields.forEach((key) => {
      if (formData[key] !== undefined) payload[key] = formData[key];
    });
    updateSettings(payload);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">System Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Image Upload */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-4 border-b border-slate-200">Homepage Hero Image</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Hero Section Main Image</label>
              <ImageUploadField
                value={formData.heroImage}
                onChange={handleHeroImageChange}
                label="Hero Image"
                name="heroImage"
              />
              <p className="text-xs text-slate-500 mt-1">This image will be shown in the homepage hero section.</p>
            </div>
          </div>
        </div>
        {/* Company Settings */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-4 border-b border-slate-200">Company Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
              <input
                type="text"
                name="companyPhone"
                value={formData.companyPhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">WhatsApp Contact Number</label>
              <input
                type="text"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="e.g., +91XXXXXXXXXX"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Business Address</label>
              <textarea
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Tax */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-4 border-b border-slate-200">Shipping & Tax</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Shipping Cost (₹)</label>
              <input
                type="number"
                name="shippingCost"
                value={formData.shippingCost}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tax Percentage (%)</label>
              <input
                type="number"
                name="taxPercentage"
                value={formData.taxPercentage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Special Discount (%)</label>
              <input
                type="number"
                name="specialDiscountPercentage"
                value={formData.specialDiscountPercentage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-slate-500 mt-1">Applied as a discount on checkout summary (use to offset GST if needed).</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Currency Code</label>
              <input
                type="text"
                name="currencyCode"
                value={formData.currencyCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateway */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-4 border-b border-slate-200">Payment Gateway</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Gateway</label>
              <select
                name="paymentGateway"
                value={formData.paymentGateway}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="razorpay">Razorpay</option>
                <option value="stripe">Stripe</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                ℹ️ Configure payment gateway credentials in environment variables for production use.
              </p>
            </div>
          </div>
        </div>

        {/* Email Configuration */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-4 border-b border-slate-200">Email Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">SMTP Host</label>
              <input
                type="text"
                name="smtpHost"
                value={formData.smtpHost}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">SMTP Port</label>
              <input
                type="number"
                name="smtpPort"
                value={formData.smtpPort}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Site Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-4 border-b border-slate-200">Site Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">Maintenance Mode</label>
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={!!formData.maintenanceMode}
                onChange={(e) => setFormData(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                className="h-5 w-5"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Maintenance Message</label>
              <textarea
                name="maintenanceMessage"
                value={formData.maintenanceMessage}
                onChange={handleChange}
                rows="3"
                placeholder="We’re performing upgrades. The site will be back shortly."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <p className="text-sm text-slate-600">When enabled, customers will see this message and storefront operations can be limited.</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
        >
          <Save size={20} /> Save All Settings
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-semibold">
          <X size={20} /> Reset
        </button>
      </div>
    </div>
  );
}
