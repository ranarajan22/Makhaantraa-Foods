import React from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

export default function AnalyticsTab({ overview, orders }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Analytics & Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-semibold">Total Revenue</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">₹{(overview?.totalRevenue || 0).toLocaleString()}</p>
            </div>
            <DollarSign className="text-blue-400" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-semibold">Total Orders</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{overview?.totalOrders || 0}</p>
            </div>
            <ShoppingCart className="text-green-400" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-semibold">Total Users</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">{overview?.totalUsers || 0}</p>
            </div>
            <Users className="text-purple-400" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-semibold">Avg Order Value</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">
                ₹{overview?.totalOrders ? Math.round((overview.totalRevenue || 0) / overview.totalOrders).toLocaleString() : 0}
              </p>
            </div>
            <TrendingUp className="text-orange-400" size={32} />
          </div>
        </div>
      </div>

      {/* Order Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Order Breakdown</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-slate-600">Regular Orders</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{overview?.regularOrders || 0}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-slate-600">Bulk Orders</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{overview?.bulkOrders || 0}</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-slate-600">Free Samples</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">{overview?.freeSamples || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
