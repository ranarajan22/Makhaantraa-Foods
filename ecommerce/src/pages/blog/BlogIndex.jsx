import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "10 Amazing Health Benefits of Makhana (Fox Nuts) - 2026 Guide",
    excerpt: "Discover the incredible health benefits of makhana, from weight loss to heart health. Learn why this superfood should be in your daily diet.",
    author: "Dr. Priya Sharma, Nutritionist",
    date: "2026-02-08",
    category: "Health & Nutrition",
    slug: "health-benefits-of-makhana",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800",
    readTime: "8 min read",
    tags: ["Health", "Nutrition", "Superfood"]
  },
  {
    id: 2,
    title: "7 Delicious Makhana Recipes - Easy & Healthy Fox Nut Dishes 2026",
    excerpt: "Transform your makhana into amazing dishes! From roasted snacks to creamy kheer, discover 7 easy recipes with step-by-step instructions.",
    author: "Chef Anjali Mehta",
    date: "2026-02-07",
    category: "Recipes",
    slug: "makhana-recipes",
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800",
    readTime: "10 min read",
    tags: ["Recipes", "Cooking", "Snacks"]
  },
  {
    id: 3,
    title: "What is Makhana? Complete Guide to Fox Nuts (Lotus Seeds) 2026",
    excerpt: "Everything you need to know about makhana. Learn what it is, how it's made, nutritional benefits, types, uses, and why Mithila makhana is the best.",
    author: "Rajesh Kumar, Food Scientist",
    date: "2026-02-06",
    category: "Education",
    slug: "what-is-makhana",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784194?w=800",
    readTime: "12 min read",
    tags: ["Education", "GI Tag", "Fox Nuts"]
  },
  {
    id: 4,
    title: "Makhana for Weight Loss: Complete Guide + 7-Day Diet Plan (2026)",
    excerpt: "Can makhana help you lose weight? YES! Discover how to use fox nuts for effective weight loss, best recipes, meal plans, and expert tips.",
    author: "Nutritionist Neha Agarwal",
    date: "2026-02-05",
    category: "Weight Loss",
    slug: "makhana-for-weight-loss",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    readTime: "15 min read",
    tags: ["Weight Loss", "Diet", "Fitness"]
  },
  {
    id: 5,
    title: "Why the GI Tag on Mithila Makhana is More Than Just a Label",
    excerpt: "Discover why the GI tag is more than a label—it's a promise of ancient tradition, world-class quality, and the authentic taste of Mithila.",
    author: "Makhaantraafoods Team",
    date: "2026-01-10",
    category: "Education",
    slug: "why-gi-mithila-makhana",
    image: "https://res.cloudinary.com/dujkkenmf/image/upload/v1769243225/products/xh9lpswvcabiuqysqcwa.webp",
    readTime: "9 min read",
    tags: ["GI Tag", "Quality", "Export"]
  },
  {
    id: 6,
    title: "Makhana: The Clean-Label Super Snack – A Personal Promise",
    excerpt: "Discover the plant-based powerhouse that's high in protein, low GI, and ready to take on any flavor you can imagine.",
    author: "Makhaantraafoods Team",
    date: "2026-01-20",
    category: "Health & Nutrition",
    slug: "healthy-snacking",
    image: "https://res.cloudinary.com/dujkkenmf/image/upload/v1769243016/products/nevehoaogbeowjdrwewa.webp",
    readTime: "10 min read",
    tags: ["Clean Label", "Plant-Based", "Premium"]
  }
];

const categories = [
  "All Posts",
  "Health & Nutrition",
  "Recipes",
  "Education",
  "Weight Loss"
];

export default function BlogIndex() {
  const [selectedCategory, setSelectedCategory] = React.useState("All Posts");

  const filteredPosts = selectedCategory === "All Posts"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Makhana Blog - Health Tips, Recipes & Nutrition Guide 2026</title>
        <meta 
          name="description" 
          content="Explore our makhana blog for health benefits, delicious recipes, nutrition tips, and weight loss guides. Expert advice on fox nuts and healthy eating." 
        />
        <meta 
          name="keywords" 
          content="makhana blog, fox nuts blog, makhana recipes, makhana benefits, healthy eating blog, nutrition articles" 
        />
        <link rel="canonical" href="https://www.makhaantraafoods.com/blog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Makhana Blog - Health Tips & Recipes" />
        <meta property="og:description" content="Expert articles on makhana benefits, recipes, and nutrition" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.makhaantraafoods.com/blog" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Makhana Blog - Health Tips & Recipes" />
        <meta name="twitter:description" content="Expert articles on makhana benefits, recipes, and nutrition" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Makhana Blog
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Expert articles on health benefits, delicious recipes, nutrition tips, and everything about makhana (fox nuts)
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author.split(',')[0]}
                    </div>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-green-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="bg-green-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-green-100 mb-8 text-lg">
              Get the latest articles, recipes, and health tips delivered to your inbox weekly
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="submit"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
