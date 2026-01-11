import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { blogPosts } from "../data/makhana";
import { BookOpen } from "lucide-react";

export default function Blog() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-brand-soft min-h-screen">
      <section className="bg-brand-gradient text-white">
        <div className="max-w-6xl mx-auto px-4 py-14 flex flex-col gap-3">
          <p className="pill-brand bg-white/15 text-white inline-flex items-center gap-2"><BookOpen size={16} /> Blog</p>
          <h1 className="text-4xl font-bold">Insights on sourcing and exporting Makhana</h1>
          <p className="text-white/90">Learn about GI tagging, moisture control, packaging, and how to build retail-ready Makhana products.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <article key={post.slug} className="bg-white rounded-2xl shadow-brand border border-green-50 p-6 flex flex-col gap-3">
            <h3 className="text-2xl font-bold text-slate-900">{post.title}</h3>
            <p className="text-slate-700 text-sm">{post.excerpt}</p>
            <Link to={`/blog/${post.slug}`} className="text-brand font-semibold text-sm hover:underline">Read more</Link>
          </article>
        ))}
      </section>
    </div>
  );
}
