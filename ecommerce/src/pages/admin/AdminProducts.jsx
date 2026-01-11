import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: 0, description: "", image: "" });

  useEffect(() => {
    axios
      .get("/api/admin/products")
      .then((r) => setProducts(r.data))
      .catch(() => setProducts([]));
  }, []);

  async function create(e) {
    e.preventDefault();
    try {
      const res = await axios.post("/api/admin/products", form);
      // backend returns updated list — if it returns single product adjust accordingly
      if (Array.isArray(res.data)) setProducts(res.data);
      else setProducts((old) => [res.data, ...old]);
      setForm({ name: "", price: 0, description: "", image: "" });
    } catch (err) {
      console.error("Create error:", err);
      alert("Create failed");
    }
  }

  async function remove(id) {
    // use window.confirm to satisfy ESLint / no-restricted-globals
    if (!window.confirm("Delete this product?")) return;

    // optimistic update
    const prev = products;
    setProducts(products.filter((p) => p._id !== id));

    try {
      await axios.delete(`/api/admin/products/${id}`);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
      setProducts(prev); // rollback on failure
    }
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl mb-4">Admin - Products</h1>

      <form onSubmit={create} className="grid md:grid-cols-3 gap-2 mb-6">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          required
          className="p-2 border rounded"
        />
        <input
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          placeholder="Price"
          type="number"
          required
          className="p-2 border rounded"
        />
        <button className="px-4 py-2 bg-black text-white rounded">Create</button>
      </form>

      <ul>
        {products.map((p) => (
          <li key={p._id} className="flex justify-between items-center border p-3 rounded mb-2 bg-white">
            <div>
              <div className="font-medium">{p.name}</div>
              <div>₹{p.price}</div>
            </div>
            <div>
              <button onClick={() => remove(p._1d ?? p._id)} className="text-red-600">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
