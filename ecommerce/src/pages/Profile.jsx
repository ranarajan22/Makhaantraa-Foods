import React, { useEffect, useState } from "react";
import axios from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const [orders, setOrders] = useState([]);
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
    const fetchOrders = async () => {
      try {
        const r = await axios.get('/api/orders/my');
        setOrders(r.data || []);
      } catch (e) {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
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
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-green-50 to-white py-12 px-4">
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
            <div className="space-y-2 text-sm">
              <div><span className="font-semibold">Order ID:</span> {selectedOrder.orderNumber || selectedOrder._id}</div>
              <div><span className="font-semibold">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</div>
              <div><span className="font-semibold">Status:</span> {selectedOrder.status}</div>
              <div><span className="font-semibold">Total:</span> ₹{(selectedOrder.totalPrice || selectedOrder.total || 0).toFixed(2)}</div>
              {selectedOrder.shippingAddress && (
                <div>
                  <span className="font-semibold">Shipping Address:</span>
                  <div className="ml-2">
                    {Object.entries(selectedOrder.shippingAddress).map(([k, v]) => (
                      <div key={k}><span className="capitalize">{k}:</span> {v}</div>
                    ))}
                  </div>
                </div>
              )}
              {selectedOrder.items && Array.isArray(selectedOrder.items) && (
                <div>
                  <span className="font-semibold">Items:</span>
                  <ul className="ml-4 list-disc">
                    {selectedOrder.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} x{item.qty} - ₹{item.price}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedOrder.notes && (
                <div><span className="font-semibold">Notes:</span> {selectedOrder.notes}</div>
              )}
              {/* Add more fields as needed */}
            </div>
          </div>
        </div>
      )}
          <div>
            <p className="text-sm text-green-700 font-semibold">Profile</p>
            <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'User'}</h1>
            <p className="text-slate-600">{user?.email}</p>
            {user?.phone && <p className="text-slate-600">{user.phone}</p>}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="font-semibold text-green-800">Role</p>
                <p>{user?.role || 'user'}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="font-semibold text-green-800">Member Since</p>
                <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'N/A'}</p>
              </div>
              {orders.length > 0 && (
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="font-semibold text-green-800">Total Orders</p>
                  <p>{orders.length}</p>
                </div>
              )}
              {user?.lastLogin && (
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="font-semibold text-green-800">Last Login</p>
                  <p>{new Date(user.lastLogin).toLocaleString('en-IN')}</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
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
        </div>

        <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-green-800">Recent Orders</h2>
            <a href="/orders" className="text-sm font-semibold text-green-700 hover:text-green-800">See all</a>
          </div>

          {ordersLoading ? (
            <p className="text-slate-600">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-slate-600">No orders yet.</p>
          ) : (
            <>
              {/* Active Orders */}
              <div className="space-y-3">
                {orders.filter(o => o.status !== 'cancelled').slice(0, 3).map((o) => (
                  <div key={o._id} className="border border-green-50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{o.orderNumber || o._id}</p>
                      <p className="text-sm text-slate-600">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-green-700 font-bold">₹{(o.totalPrice || o.total || 0).toFixed(2)}</p>
                      <p className="text-sm text-slate-600">{o.status}</p>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold hover:bg-green-200"
                          onClick={() => { setSelectedOrder(o); setShowOrderModal(true); }}
                        >
                          Details
                        </button>
                        {o.status !== 'cancelled' && (
                          <button
                            className="px-3 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200"
                            onClick={() => handleCancelOrder(o._id)}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Cancelled Orders */}
              {orders.filter(o => o.status === 'cancelled').length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-red-700 mb-2">Cancelled Orders</h3>
                  <div className="space-y-3">
                    {orders.filter(o => o.status === 'cancelled').slice(0, 3).map((o) => (
                      <div key={o._id} className="border border-red-100 rounded-lg p-4 flex items-center justify-between bg-red-50">
                        <div>
                          <p className="font-semibold text-gray-900">{o.orderNumber || o._id}</p>
                          <p className="text-sm text-slate-600">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <p className="text-red-700 font-bold">₹{(o.totalPrice || o.total || 0).toFixed(2)}</p>
                          <p className="text-sm text-red-700">{o.status}</p>
                          <button
                            className="px-3 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold hover:bg-green-200"
                            onClick={() => { setSelectedOrder(o); setShowOrderModal(true); }}
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}