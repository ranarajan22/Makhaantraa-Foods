// API Configuration - Fallback for when environment variables aren't available
const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://makhaantraa-foods.onrender.com');
const STRIPE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SY81DGv6v2VBTyJ0t6JKsGKHdph49kkcks0y5whRtFya7lmUpEkf3CUHpO2EGIv8rIpSAGK9lhQa491BoirPqIv00RJc1FQe3';

console.log('API Base URL:', API_BASE_URL);
console.log('Stripe Key configured:', !!STRIPE_KEY);

export { API_BASE_URL, STRIPE_KEY };
