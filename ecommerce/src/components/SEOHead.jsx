import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEOHead({ 
  title = 'HandMadeHeaven - Premium Handcrafted Products', 
  description = 'Shop beautiful handmade products including jewelry, pottery, home decor, and textiles',
  image = '/mainimage.jpg',
  url = 'https://handmadeheaven.com'
}) {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="keywords" content="handmade, jewelry, pottery, home decor, textiles, artisan, crafts" />
      <meta name="author" content="HandMadeHeaven" />
      <meta name="robots" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Structured Data (Schema.org) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Organization",
          "name": "HandMadeHeaven",
          "url": "https://handmadeheaven.com",
          "logo": "https://handmadeheaven.com/logo.png",
          "description": description,
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "email": "support@handmadeheaven.com"
          }
        })}
      </script>
    </Helmet>
  );
}
