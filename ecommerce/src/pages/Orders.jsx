import React, { useEffect, useState } from "react";
import axios from "../utils/api.js";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Orders() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  // const navigate = useNavigate();

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
          <p className="text-slate-600">Your session might be expired. Log in to view your orders.</p>
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
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full relative border border-green-200">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
              onClick={() => setShowOrderModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4 text-green-800 border-b pb-2">Order Details</h3>
            <div className="space-y-2 text-base max-h-[60vh] overflow-y-auto pr-2">
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
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-4">My Orders</h2>
          {ordersLoading ? (
            <p className="text-slate-600">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-slate-600">No orders yet.</p>
          ) : (
            <>
              {/* Active Orders */}
              <div className="space-y-3">
                {orders.filter(o => o.status !== 'cancelled').map((o) => (
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
                    {orders.filter(o => o.status === 'cancelled').map((o) => (
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
