import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './pages/home';
import About from './pages/about';
import Shop from './pages/shop';
import Contact from './pages/contact';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;