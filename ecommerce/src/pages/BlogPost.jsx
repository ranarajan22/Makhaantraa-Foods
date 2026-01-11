import React from "react";
import { useParams, Link } from "react-router-dom";
import { blogPosts } from "../data/makhana";
import { ArrowLeft } from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug) || blogPosts[0];

  return (
    <div className="bg-brand-soft min-h-screen">
      <section className="bg-white shadow-brand border-b border-green-50">
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
          <Link to="/blog" className="text-brand inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft size={16} /> Back to blog</Link>
          <h1 className="text-4xl font-bold text-slate-900">{post.title}</h1>
          <p className="text-slate-600">Updated for exporters, retailers, and foodservice buyers.</p>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        {post.body.map((para, idx) => (
          <p key={idx} className="text-slate-800 leading-relaxed">{para}</p>
        ))}
      </section>
    </div>
  );
}
