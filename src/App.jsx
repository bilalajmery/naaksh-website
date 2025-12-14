import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Home from "./pages/home";
import About from "./pages/about";
import Shop from "./pages/shop";
import Contact from "./pages/contact";
import Cart from "./pages/cart";
import Wishlist from "./pages/wishlist";
import Checkout from "./pages/checkout";
import ProductDetail from "./pages/productDetail";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "./components/Loader";

const titles = {
  "/": "NAAKSH | Premium Streetwear & Urban Fashion in Pakistan",
  "/about": "About | NAAKSH | Premium Streetwear & Urban Fashion in Pakistan",
  "/shop": "Shop | NAAKSH | Premium Streetwear & Urban Fashion in Pakistan",
  "/contact": "Contact | NAAKSH | Premium Streetwear & Urban Fashion in Pakistan",
  "/cart": "Cart | NAAKSH | Premium Streetwear & Urban Fashion in Pakistan",
  "/wishlist": "Wishlist | NAAKSH | Premium Streetwear & Urban Fashion in Pakistan",
  "/checkout": "Checkout | NAAKSH | Premium Streetwear & Urban Fashion in Pakistan",
  "/product/:slug": "Product | NAAKSH | Premium Streetwear & Urban Fashion in Pakistan",
  "/privacy": "Privacy Policy | NAAKSH | Premium Streetwear & Urban Fashion in Pakistan",
  "/terms": "Terms of Service | NAAKSH | Premium Streetwear & Urban Fashion in Pakistan",
  "/404": "404 - Page Not Found | NAAKSH | Premium Streetwear & Urban Fashion in Pakistan",
}

function App() {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);

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
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // Exception for product detail pages (handled dynamically)
    if (location.pathname.startsWith('/product/')) return;

    document.title = titles[location.pathname] || "NAAKSH | Premium Streetwear & Urban Fashion in Pakistan";
  }, [location.pathname]);


  return (
    <>
      {isPageLoading && <Loader />}
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
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
      <WhatsAppButton />
      <Footer categories={categories} loadingCategories={loadingCategories} />
    </>
  );
}

export default App;
