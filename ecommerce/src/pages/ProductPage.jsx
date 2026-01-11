import React, {useEffect,useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function addToCart(product, qty=1){
  try {
    const cartData = localStorage.getItem("cart") || "[]";
    const cart = JSON.parse(cartData);
    const cartArr = Array.isArray(cart) ? cart : [];
    const idx = cartArr.findIndex(i=>i._id===product._id);
    if(idx>=0) cartArr[idx].qty += qty; else cartArr.push({...product, qty});
    localStorage.setItem("cart", JSON.stringify(cartArr));
  } catch (e) {
    console.error("Error updating cart:", e);
  }
}

export default function ProductPage(){
  const { id } = useParams();
  const [product,setProduct]=useState(null);
  const nav = useNavigate();
  useEffect(()=>{ axios.get(`/api/products/${id}`).then(r=>setProduct(r.data)).catch(()=>setProduct(null)); },[id]);
  if(!product) return <div className="p-6">Loading...</div>;
  return (
    <main className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-6">
      <img src={product.image||'/placeholder.png'} alt={product.name} className="w-full h-96 object-cover rounded" />
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-xl mt-2">₹{product.price}</p>
        <p className="mt-4">{product.description}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={()=>{ addToCart(product); nav('/cart'); }} className="px-4 py-2 border rounded">Add to cart</button>
          <button onClick={()=>{ addToCart(product,1); nav('/checkout'); }} className="px-4 py-2 bg-black text-white rounded">Buy now</button>
        </div>
      </div>
    </main>
  );
}