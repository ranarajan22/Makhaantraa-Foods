import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function About() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-brand-soft min-h-screen">
    <main className="p-6 max-w-5xl mx-auto space-y-10 bg-brand-soft min-h-screen">
      {/* Header */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-gray-700">
          We are Makhaantraa — a modern food brand built to bring GI-tagged Mithila makhana from farmers to families who care about purity, traceability, and taste.
        </p>
      </section>

      {/* Our Story */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Our Story</h2>
        <p className="text-gray-700">
          Founded in 2020, Makhaantraa started with a small collective of Mithila farmers and food technologists who wanted to champion authentic, nutrient-rich makhana. What began as a regional initiative has grown into a trusted brand serving homes and businesses across India.
        </p>
        <p className="text-gray-700">
          We stay close to the source: transparent sourcing, careful grading, and packaging that preserves freshness so every batch tastes as intended.
        </p>
      </section>

      {/* Mission */}
      <section className="space-y-4 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-brand">Our Mission</h2>
        <p className="text-gray-700">
          To make premium, GI-tagged Mithila makhana accessible, consistent, and delightful — from bulk buyers to everyday snackers.
        </p>
      </section>

      {/* Values */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Our Values</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Quality: Single-origin lots, careful grading, and freshness-first packaging.</li>
            <li>Integrity: Full traceability from pond to pack, with honest labeling.</li>
            <li>Consistency: Lab checks and process discipline so every batch tastes the same.</li>
            <li>Customer Focus: Responsive support, reliable delivery, and clear communication.</li>
        </ul>
      </section>

      {/* Customer Promise */}
      <section className="space-y-4 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-brand">Our Customer Promise</h2>
        <p className="text-gray-700">
          We obsess over the details: moisture levels, pop rate, and clean supply chains. If something isn&apos;t right, we make it right — quickly.
        </p>
      </section>

      {/* Closing Statement */}
      <section className="text-center">
        <h2 className="text-2xl font-semibold">Join Our Journey</h2>
        <p className="text-gray-700 mt-2">
          Whether you&apos;re sourcing for a kitchen, a store, or your family, we&apos;re here to deliver dependable quality and flavor in every pack.
        </p>
        <Link to="/products" className="mt-4 inline-block bg-brand-gradient text-white px-6 py-3 rounded font-semibold hover:opacity-95 transition shadow-brand">
          Shop Now
        </Link>
      </section>
    </main>
    </div>
  );
}
