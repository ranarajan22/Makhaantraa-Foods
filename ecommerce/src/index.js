import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Configure axios base URL; default to same-origin so CRA proxy works in dev
axios.defaults.baseURL = process.env.REACT_APP_API_URL || '';
const bootstrapToken = localStorage.getItem('token');
if (bootstrapToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${bootstrapToken}`;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
