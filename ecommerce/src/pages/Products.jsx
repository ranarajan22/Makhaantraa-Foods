import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, ShieldCheck, AlertCircle } from "lucide-react";

import { makhanaProducts } from "../data/makhana";
import { API_BASE_URL } from "../config";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Always show these products at the top in this order if present
  // Update: Use new product names as per database
  const getOrderedProducts = useCallback((products) => {
    const orderedNames = [
      "Raw Makhana (Phool)",
      "Roasted Makhana",
      "Flavored Makhana"
    ];
    const nameMap = {};
    products.forEach(p => {
      if (p.name) nameMap[p.name.trim().toLowerCase()] = p;
    });
    const ordered = orderedNames
      .map(name => nameMap[name.trim().toLowerCase()])
      .filter(Boolean);
    const rest = products.filter(
      p => !orderedNames.some(name => p.name && p.name.trim().toLowerCase() === name.trim().toLowerCase())
    );
    return [...ordered, ...rest];
  }, []);

  const safeProducts = useMemo(() => {
    if (products.length) {
      // Only show products with category 'Makhana', custom order
      return getOrderedProducts(products.filter(p => (p.category === 'Makhana')));
    }
    return getOrderedProducts(makhanaProducts.map(p => ({ ...p, productId: p.id, _id: p.id })));
  }, [products, getOrderedProducts]);
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE_URL}/api/products?limit=100`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
        const data = await res.json();
        if (isMounted) {
          setProducts(Array.isArray(data.products) ? data.products : []);
        }
      } catch (err) {
        if (!isMounted || err.name === "AbortError") return;
        console.error("Products fetch failed", err);
        setError("Live prices unavailable. Showing static catalog.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  return (
    <div className="bg-brand-soft min-h-screen">
      <section className="bg-brand-gradient text-white">
        <div className="max-w-6xl mx-auto px-4 py-14 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3 max-w-2xl">
            <p className="pill-brand bg-white/15 text-white inline-flex items-center gap-2"><ShieldCheck size={16} /> GI-tagged Mithila lots</p>
            <h1 className="text-4xl font-bold">Best Selling Makhana – GI-Certified</h1>
            <p className="text-white/90">Seven curated SKUs from 7 Suta flagship to flavored RTE, mirroring Merakisan’s best-seller lineup. Each lot includes COA, pop-rate, and moisture data.</p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/makhana-sample" className="bg-white text-brand px-5 py-3 rounded-lg font-semibold hover:opacity-95 transition shadow-brand">Get Free Sample</Link>
              <Link to="/order-bulk" className="btn-brand-ghost bg-white text-brand px-5 py-3 rounded-lg font-semibold">Order in Bulk</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-2xl font-bold">99%+</div>
              <div className="opacity-80">Pop rate (flagship)</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-2xl font-bold">&lt; 3%</div>
              <div className="opacity-80">Moisture</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-2xl font-bold">GI</div>
              <div className="opacity-80">Mithila origin</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-2xl font-bold">24-48h</div>
              <div className="opacity-80">Sample dispatch</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-3xl font-bold text-slate-900">Best Selling Makhana</h2>
          <p className="text-sm text-slate-600">Seven GI-certified SKUs inspired by Merakisan’s lineup.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeProducts.map((p) => {
            const displayImage = p.image || p.mainImage || (p.images && p.images[0]);
            return (
            <button
              key={p._id || p.productId || p.id}
              onClick={() => navigate(`/product/${p.productId || p._id || p.id}`)}
              className="text-left bg-white rounded-2xl shadow-brand border border-green-50 p-6 flex flex-col gap-3 transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              {displayImage && (
                <div className="w-full h-40 rounded-xl bg-green-50 overflow-hidden">
                  <img
                    src={displayImage}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 text-brand font-semibold text-sm"><Package size={18} /> {p.grade}</div>
              <h3 className="text-2xl font-bold text-slate-900">{p.name}</h3>
              <p className="text-slate-700 text-sm leading-relaxed">{p.description}</p>
              <div className="flex items-baseline gap-2 text-slate-900">
                <span className="text-xl font-bold text-brand">₹{p.price ?? "-"}</span>
                {p.originalPrice ? <span className="text-sm text-gray-400 line-through">₹{p.originalPrice}</span> : null}
                {p.discount ? <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">{p.discount}% OFF</span> : null}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                <div className="bg-green-50 rounded-lg p-3"><div className="text-xs text-slate-500">Pop Rate</div><div className="font-semibold">{p.popRate || "-"}</div></div>
                <div className="bg-green-50 rounded-lg p-3"><div className="text-xs text-slate-500">Moisture</div><div className="font-semibold">{p.moisture || "-"}</div></div>
                <div className="bg-green-50 rounded-lg p-3"><div className="text-xs text-slate-500">Packaging</div><div className="font-semibold">{p.packaging || "-"}</div></div>
                <div className="bg-green-50 rounded-lg p-3"><div className="text-xs text-slate-500">Use Case</div><div className="font-semibold">{p.use || "-"}</div></div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-700">
                <span className="flex items-center gap-2">
                  <span>MOQ: <span className="font-semibold">{p.moq || "-"}</span></span>
                  <span className="text-xs text-slate-500">| Stock: {typeof p.stock === "number" ? p.stock : "-"}</span>
                </span>
                <span className="text-brand font-semibold">View details →</span>
              </div>
            </button>
          );
          })}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        {loading && (
          <div className="text-sm text-slate-600">Loading live catalog...</div>
        )}
      </section>
    </div>
  );
}
