import React, { useState, useEffect } from "react";
import axios from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

export default function Checkout() {
  const { settings, setSettings } = useSettings();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    coupon: "",
  });
  const [status, setStatus] = useState(null);
  const [cart, setCart] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
    // Always reload settings on mount
    (async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  // Add a button to reload settings dynamically (for admin changes)
  const reloadSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        alert('Settings reloaded!');
      } else {
        alert('Failed to reload settings');
      }
    } catch (e) {
      alert('Error reloading settings');
    }
  };

  async function placeOrder(e) {
    e.preventDefault();
    if (cart.length === 0) return alert("Cart is empty");
    setStatus("loading");

    const payload = { cart, ...form };

    try {
      await axios.post("/api/orders", payload);
      localStorage.removeItem("cart");
      setStatus("success");
      nav("/");
      alert("Order placed successfully!");
    } catch (e) {
      setStatus("error");
      alert("Order failed. Try again.");
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gstPercent = Number(settings?.taxPercentage ?? 18);
  const specialDiscountPercent = settings?.specialDiscountPercentage != null
    ? Number(settings.specialDiscountPercentage)
    : gstPercent; // default: offset GST
  const gstAmount = +(subtotal * (gstPercent / 100)).toFixed(2);
  const specialDiscountAmount = +(subtotal * (specialDiscountPercent / 100)).toFixed(2);
  const shippingCost = Number(settings?.shippingCost ?? 0);
  const total = subtotal + gstAmount + shippingCost - specialDiscountAmount;

  return (
    <div className="bg-brand-soft min-h-screen py-12">
      {/* DEBUG: Show current specialDiscountPercentage */}
      <div className="bg-yellow-100 text-yellow-900 p-2 mb-2 rounded text-sm">
        <strong>DEBUG:</strong> specialDiscountPercentage = {String(settings?.specialDiscountPercentage)}
      </div>
      <main className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 px-4">
        {/* Checkout Form */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-semibold mb-6 text-center">Checkout</h1>
          <button onClick={reloadSettings} className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded text-sm">Reload Settings</button>
          <p className="text-gray-700 mb-6 text-center">
            Fill in your details to complete the order. You can also review your cart items here.
          </p>

          <form onSubmit={placeOrder} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 input-brand"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 input-brand"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-3 input-brand"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <textarea
              placeholder="Shipping Address"
              className="w-full p-3 input-brand"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Coupon Code (optional)"
              className="w-full p-3 input-brand"
              value={form.coupon}
              onChange={(e) => setForm({ ...form, coupon: e.target.value })}
            />

            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 bg-brand-gradient text-white px-6 py-3 rounded hover:opacity-95 transition text-lg font-medium shadow-brand"
              >
                {status === "loading" ? "Placing Order..." : "Place Order"}
              </button>
              <button
                type="button"
                onClick={() => nav("/products")}
                className="flex-1 btn-brand-ghost px-6 py-3 text-lg font-medium"
              >
                Shop More
              </button>
            </div>
            {status === "success" && (
              <p className="text-green-600 text-center mt-2">Order placed successfully!</p>
            )}
            {status === "error" && (
              <p className="text-red-600 text-center mt-2">Failed to place order. Try again.</p>
            )}
          </form>

          <div className="mt-8 text-gray-700">
            <h3 className="text-xl font-semibold mb-2">Why shop with us?</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>✅ Fast and reliable shipping</li>
              <li>✅ 100% handmade & unique products</li>
              <li>✅ Easy returns & customer support</li>
              <li>✅ Apply coupons for extra discounts</li>
            </ul>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="w-full md:w-1/3 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul className="space-y-3">
                {cart.map((item) => (
                  <li key={item._id} className="flex justify-between items-center border-b pb-2">
                    <span>{item.name} x {item.qty}</span>
                    <span>₹{item.price * item.qty}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST ({gstPercent}%)</span>
                  <span>₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Special Discount ({specialDiscountPercent}%)</span>
                  <span>-₹{specialDiscountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost ? `₹${shippingCost.toFixed(2)}` : 'FREE'}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => nav("/products")}
                className="mt-4 w-full bg-brand-gradient text-white px-4 py-2 rounded hover:opacity-95 transition shadow-brand"
              >
                Shop More
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
