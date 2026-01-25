import React, { useEffect, useState } from "react";
import axios from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [bulkOrders, setBulkOrders] = useState([]);
  const [freeSamples, setFreeSamples] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const navigate = useNavigate();

  // Cancel order handler
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await axios.patch(`/api/orders/${orderId}/cancel`);
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: 'cancelled' } : o));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: 'cancelled' });
      }
    } catch (e) {
      alert('Failed to cancel order.');
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setOrdersLoading(true);
      try {
        const [ordersRes, bulkRes, sampleRes] = await Promise.all([
          axios.get('/api/orders/my'),
          axios.get('/api/bulk-orders/my'),
          axios.get('/api/free-samples/my'),
        ]);
        setOrders(ordersRes.data || []);
        setBulkOrders(bulkRes.data || []);
        setFreeSamples(sampleRes.data || []);
      } catch (e) {
        setOrders([]);
        setBulkOrders([]);
        setFreeSamples([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 via-green-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-green-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md border border-green-100 p-8 max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Please log in</h1>
          <p className="text-slate-600">Your session might be expired. Log in to view your profile.</p>
          <div className="flex flex-col gap-3">
            <a href="/login" className="w-full py-3 rounded-lg font-semibold bg-green-700 text-white hover:bg-green-800">Go to Login</a>
            <a href="/" className="w-full py-3 rounded-lg font-semibold border border-green-200 text-green-700 hover:bg-green-50">Back to Home</a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-green-50 to-white py-8 px-2 md:px-8 flex flex-col items-center">
      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
              onClick={() => setShowOrderModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-2 text-green-800">Order Details</h3>
            <div className="space-y-2 text-sm max-h-[60vh] overflow-y-auto pr-2">
              {Object.entries(selectedOrder).map(([key, value]) => {
                if (["_id", "__v"].includes(key)) return null;
                if (key === "createdAt" || key === "updatedAt") {
                  return (
                    <div key={key}><span className="font-semibold">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span> {new Date(value).toLocaleString('en-IN')}</div>
                  );
                }
                if (typeof value === "object" && value !== null) {
                  if (Array.isArray(value)) {
                    // Items array
                    return (
                      <div key={key}>
                        <span className="font-semibold">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                        <ul className="ml-4 list-disc">
                          {value.map((item, idx) => (
                            <li key={idx}>{typeof item === 'object' ? JSON.stringify(item) : String(item)}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  } else {
                    // Nested object (e.g., shippingAddress)
                    return (
                      <div key={key}>
                        <span className="font-semibold">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                        <div className="ml-2">
                          {Object.entries(value).map(([k, v]) => (
                            <div key={k}><span className="capitalize">{k}:</span> {typeof v === 'object' ? JSON.stringify(v) : String(v)}</div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                }
                return (
                  <div key={key}><span className="font-semibold">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span> {String(value)}</div>
                );
              })}
              {selectedOrder.status !== 'cancelled' && (
                <button
                  className="mt-4 px-4 py-2 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200"
                  onClick={() => handleCancelOrder(selectedOrder._id)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <section className="w-full max-w-4xl flex flex-col md:flex-row gap-8 md:gap-12 mb-8">
        {/* Profile Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-green-100 p-6 flex flex-col items-center md:items-start">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-green-700">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 text-center md:text-left">{user?.name || 'User'}</h1>
          <p className="text-slate-600 text-center md:text-left">{user?.email}</p>
          {user?.phone && <p className="text-slate-600 text-center md:text-left">{user.phone}</p>}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 w-full text-sm text-slate-600">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="font-semibold text-green-800">Role</p>
              <p>{user?.role || 'user'}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="font-semibold text-green-800">Member Since</p>
              <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'N/A'}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="font-semibold text-green-800">Total Orders</p>
              <p>{orders.length + bulkOrders.length + freeSamples.length}</p>
            </div>
            {user?.lastLogin && (
              <div className="bg-green-50 rounded-lg p-3">
                <p className="font-semibold text-green-800">Last Login</p>
                <p>{new Date(user.lastLogin).toLocaleString('en-IN')}</p>
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 w-full justify-center md:justify-start">
            <button
              onClick={() => navigate('/orders')}
              className="px-4 py-2 rounded-lg font-semibold bg-green-700 text-white hover:bg-green-800"
            >
              View My Orders
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="px-4 py-2 rounded-lg font-semibold border border-red-200 text-red-700 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
        {/* Recent Orders Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-green-800">Recent Orders</h2>
            <a href="/orders" className="text-sm font-semibold text-green-700 hover:text-green-800">See all</a>
          </div>
          {ordersLoading ? (
            <p className="text-slate-600">Loading orders...</p>
          ) : (orders.length + bulkOrders.length + freeSamples.length) === 0 ? (
            <p className="text-slate-600">No orders yet.</p>
          ) : (
            <>
              {/* Show 3 most recent orders across all types */}
              <div className="space-y-3">
                {[
                  ...orders.map(o => ({
                    ...o,
                    _type: 'regular',
                    _created: new Date(o.createdAt),
                  })),
                  ...bulkOrders.map(b => ({
                    ...b,
                    _type: 'bulk',
                    _created: new Date(b.createdAt),
                  })),
                  ...freeSamples.map(s => ({
                    ...s,
                    _type: 'sample',
                    _created: new Date(s.createdAt),
                  })),
                ]
                  .sort((a, b) => b._created - a._created)
                  .slice(0, 3)
                  .map((order) => (
                    <div key={order._id} className={`border rounded-lg p-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-2 ${order.status === 'cancelled' ? 'border-red-100 bg-red-50' : 'border-green-50'}`}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            order._type === 'regular' ? 'bg-blue-100 text-blue-700' :
                            order._type === 'bulk' ? 'bg-purple-100 text-purple-700' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order._type === 'regular' ? 'Order' : order._type === 'bulk' ? 'Bulk' : 'Sample'}
                          </span>
                          <span className="font-semibold text-gray-900 truncate">{order.orderNumber || order.orderId || order._id}</span>
                        </div>
                        <p className="text-sm text-slate-600">{order._created.toLocaleDateString('en-IN')}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 min-w-[120px]">
                        {order._type === 'regular' && (
                          <p className="text-green-700 font-bold">₹{(order.totalPrice || order.total || 0).toFixed(2)}</p>
                        )}
                        <p className={`text-sm ${order.status === 'cancelled' ? 'text-red-700' : 'text-slate-600'}`}>{order.status}</p>
                        <div className="flex flex-wrap gap-2 w-full justify-end">
                          <button
                            className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                              order._type === 'regular' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                              order._type === 'bulk' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                              'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            }`}
                            onClick={() => {
                              if (order._type === 'regular') { setSelectedOrder(order); setShowOrderModal(true); }
                              else if (order._type === 'bulk') { setSelectedOrder(null); setShowOrderModal(false); setSelectedBulkOrder(order); setShowBulkOrderModal(true); }
                              else { setSelectedOrder(null); setShowOrderModal(false); setSelectedSample(order); setShowSampleModal(true); }
                            }}
                          >
                            Details
                          </button>
                          {order.status !== 'cancelled' && (
                            order._type === 'regular' ? (
                              <button
                                className="px-3 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 whitespace-nowrap"
                                onClick={() => handleCancelOrder(order._id)}
                              >
                                Cancel
                              </button>
                            ) : order._type === 'bulk' ? (
                              <button
                                className="px-3 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 whitespace-nowrap"
                                onClick={() => alert('Bulk order cancellation is not supported in this version.')}
                              >
                                Cancel
                              </button>
                            ) : (
                              <button
                                className="px-3 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 whitespace-nowrap"
                                onClick={() => alert('Free sample cancellation is not supported in this version.')}
                              >
                                Cancel
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}