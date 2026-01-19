import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, Heart, ArrowRight, Lock, Truck, Gift } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import toast from "react-hot-toast";

export default function CartPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { settings, setSettings } = useSettings();
    // Add a button to reload settings dynamically (for admin changes)
    const reloadSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
          toast.success('Settings reloaded!');
        } else {
          toast.error('Failed to reload settings');
        }
      } catch (e) {
        toast.error('Error reloading settings');
      }
    };
  const { 
    cart, 
    wishlist, 
    updateQuantity, 
    updatePackSize,
    removeFromCart, 
    removeFromWishlist,
    moveToCart,
    cartTotal,
    cartCount 
  } = useCart();

    React.useEffect(() => {
      if (!authLoading && !user) {
        toast.error('Please login to view your cart');
        navigate('/login?next=/cart', { replace: true });
      }
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
    }, [user, authLoading, navigate, setSettings]);

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-green-800">
            Redirecting to login…
          </div>
        </div>
      );
    }

  const PACK_OPTIONS = [
    { label: '200g', value: 0.2 },
    { label: '1kg', value: 1 },
    { label: '6kg', value: 6 },
    { label: '7kg', value: 7 },
    { label: '10kg', value: 10 },
  ];

  const gstPercent = Number(settings?.taxPercentage ?? 18);
  const specialDiscountPercent = Number(settings?.specialDiscountPercentage ?? 0);
  const shippingPrice = cartTotal < 1000 ? 50 : 0; // Apply ₹50 if total < 1000, else free
  const taxPrice = cartTotal * (gstPercent / 100);
  const specialDiscountAmount = cartTotal * (specialDiscountPercent / 100);
  const total = cartTotal + shippingPrice + taxPrice - specialDiscountAmount;

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  const handleUpdateQty = (productId, newQty) => {
    if (newQty < 1) return;
    updateQuantity(productId, newQty);
  };

  const handleRemove = (productId, productName) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleMoveToCart = (product) => {
    moveToCart(product);
    toast.success(`${product.name} moved to cart`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <button onClick={reloadSettings} className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded text-sm">Reload Settings</button>
        {/* Header with gradient */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            <span className="font-semibold text-green-700">{cartCount}</span> {cartCount === 1 ? 'item' : 'items'} in cart
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-green-100">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={48} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Discover our premium makhana products!</p>
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              <ShoppingBag size={20} />
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const packSize = item.packSizeKg || 1;
                const perPackPrice = Math.round((Number(item.price) || 0) * packSize);
                const linePrice = perPackPrice * (item.qty || 1);
                return (
                <div key={item._id} className="bg-white rounded-xl shadow-md hover:shadow-lg p-4 transition-all duration-200 border border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to={`/product/${item._id}`} className="flex-shrink-0 group">
                      <div className="relative overflow-hidden rounded-lg">
                        <img 
                          src={item.mainImage || item.image || "/placeholder.png"} 
                          className="w-24 h-24 sm:w-28 sm:h-28 object-cover group-hover:scale-105 transition-transform duration-200" 
                          alt={item.name}
                        />
                      </div>
                    </Link>
                    
                    <div className="flex-grow">
                      <Link to={`/product/${item._id}`}>
                        <h3 className="font-semibold text-base text-gray-900 hover:text-green-600 transition mb-2">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex items-baseline gap-2 mb-2">
                        <p className="text-xl font-bold text-green-600">₹{perPackPrice}</p>
                        <span className="text-xs text-gray-500">({packSize}kg)</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 bg-gray-50 px-2 py-1 rounded inline-block">₹{item.price}/kg</p>
                      <div className="mb-3">
                        <label className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-2">
                          <Gift size={14} className="text-green-600" />
                          Pack Size
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {PACK_OPTIONS.map((opt) => {
                            const active = Number(opt.value) === Number(packSize);
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => updatePackSize(item._id, opt.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                  active
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600'
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
                        {/* Quantity Controls */}
                        <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-2 py-1">
                          <button
                            onClick={() => handleUpdateQty(item._id, item.qty - 1)}
                            className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-white transition disabled:opacity-40"
                            disabled={item.qty <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="min-w-[35px] text-center text-base font-semibold text-gray-900">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(item._id, item.qty + 1)}
                            className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-white transition disabled:opacity-40"
                            disabled={item.qty >= 10}
                          >
                            <Plus size={16} />
                          </button>
                          <span className="text-[10px] text-gray-500 ml-1">Max 10</span>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item._id, item.name)}
                          className="self-start sm:self-auto text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg transition"
                          title="Remove from cart"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Subtotal: <span className="text-lg font-bold text-gray-900">₹{linePrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );})}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-semibold">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <Truck size={16} className="text-green-600" />
                      Shipping
                    </span>
                    <span className="font-semibold">
                      {shippingPrice === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shippingPrice}`
                      )}
                    </span>
                  </div>
                  {/* Removed shipping note; using fixed rule: 50 if < 1000, else free */}
                  <div className="flex justify-between text-gray-600">
                    <span>GST ({gstPercent}%)</span>
                    <span className="font-semibold">₹{taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>Special Discount ({specialDiscountPercent}%)</span>
                    <span className="font-semibold">-₹{specialDiscountAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-green-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mb-3"
                >
                  <Lock size={18} />
                  Checkout
                  <ArrowRight size={18} />
                </button>
                
                <Link
                  to="/products"
                  className="block text-center text-green-600 hover:text-green-700 font-semibold text-sm hover:underline"
                >
                  ← Continue Shopping
                </Link>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Lock size={14} className="text-green-600" />
                    <span>Secure Payments</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Truck size={14} className="text-blue-600" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Gift size={14} className="text-orange-600" />
                    <span>Food-grade items: no returns; replacements only for transit damage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Section */}
        {wishlist.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-red-500 via-pink-500 to-red-600 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3">
                <Heart className="text-red-500" size={36} fill="currentColor" />
                Your Wishlist
              </h2>
              <p className="text-gray-600 text-lg">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2 border-pink-100 hover:border-pink-300">
                  <Link to={`/product/${item._id}`} className="block relative overflow-hidden">
                    <img 
                      src={item.mainImage || item.image || "/placeholder.png"} 
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300" 
                      alt={item.name}
                    />
                    <div className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-lg">
                      <Heart size={18} fill="currentColor" />
                    </div>
                  </Link>
                  <div className="p-5">
                    <Link to={`/product/${item._id}`}>
                      <h3 className="font-bold text-gray-900 hover:text-pink-600 transition line-clamp-2 mb-3 text-lg">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-2xl font-extrabold text-pink-600 mb-4">₹{item.price}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm font-bold"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item._id)}
                        className="p-3 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-200 border-2 border-red-200 hover:border-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
