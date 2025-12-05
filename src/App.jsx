import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./pages/home";
import About from "./pages/about";
import Shop from "./pages/shop";
import Contact from "./pages/contact";
import Cart from "./pages/cart";
import Wishlist from "./pages/wishlist";
import Checkout from "./pages/checkout";
import ProductDetail from "./pages/productDetail";
import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Helmet } from 'react-helmet-async';

function App() {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetch("/category/data.json")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setCategories(data);
        setLoadingCategories(false);
      })
      .catch(() => {
        console.error("Failed to load categories");
        setLoadingCategories(false);
      });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Naaksh – Premium Minimalist Clothing & Streetwear</title>
        <meta name="description" content="Naaksh offers unique, customizable fashion with high-quality T-shirts and bold or minimalist designs to help you stand out. Fashion, made personal." />
        <meta name="keywords" content="Naaksh, Naaksh clothing, minimalist clothing Pakistan, premium hoodies, streetwear, fashion brand, apparel" />
        <meta property="og:title" content="Naaksh – Premium Minimalist Clothing" />
        <meta property="og:description" content="Naaksh offers unique, customizable fashion with high-quality T-shirts and bold or minimalist designs to help you stand out. Fashion, made personal." />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://naaksh.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Naaksh – Premium Minimalist Clothing" />
        <meta name="twitter:description" content="Naaksh offers unique, customizable fashion with high-quality T-shirts and bold or minimalist designs to help you stand out. Fashion, made personal." />
        <meta name="twitter:image" content="/logo.png" />
      </Helmet>
      <Navbar categories={categories} loadingCategories={loadingCategories} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
      <Footer categories={categories} loadingCategories={loadingCategories} />
    </>
  );
}

export default App;
