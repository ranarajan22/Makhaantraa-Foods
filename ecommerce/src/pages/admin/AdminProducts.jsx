
import React, { useEffect, useState } from "react";
import axios from "axios";


export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: 0, description: "", image: "" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: 0, description: "", image: "" });

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
      if (Array.isArray(res.data)) setProducts(res.data);
      else setProducts((old) => [res.data, ...old]);
      setForm({ name: "", price: 0, description: "", image: "" });
    } catch (err) {
      console.error("Create error:", err);
      alert("Create failed");
    }
  }

  function startEdit(product) {
    setEditId(product._id);
    setEditForm({
      name: product.name || "",
      price: product.price || 0,
      description: product.description || "",
      image: product.image || ""
    });
  }

  function cancelEdit() {
    setEditId(null);
    setEditForm({ name: "", price: 0, description: "", image: "" });
  }

  async function saveEdit(id) {
    try {
      const res = await axios.put(`/api/admin/products/${id}`, editForm);
      setProducts((old) => old.map((p) => (p._id === id ? res.data : p)));
      cancelEdit();
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this product?")) return;
    const prev = products;
    setProducts(products.filter((p) => p._id !== id));
    try {
      await axios.delete(`/api/admin/products/${id}`);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
      setProducts(prev);
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
            {editId === p._id ? (
              <>
                <div className="flex flex-col gap-1">
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="p-1 border rounded mb-1"
                  />
                  <input
                    value={editForm.price}
                    type="number"
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    className="p-1 border rounded mb-1"
                  />
                  <input
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="p-1 border rounded mb-1"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(p._id)} className="text-green-600 mr-2">Save</button>
                  <button onClick={cancelEdit} className="text-gray-600">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div>₹{p.price}</div>
                  <div className="text-xs text-gray-500">{p.description}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(p)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => remove(p._id)} className="text-red-600">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
