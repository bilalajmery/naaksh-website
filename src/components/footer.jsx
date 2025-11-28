function Footer() {
  return (
    <footer className="bg-gray-100 py-16 border-t">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-6xl font-bold mb-6">NAAKSH</h1>
        <p className="text-lg text-gray-600 mb-8">Minimal Clothing • Made in Pakistan • Loved Worldwide</p>
        
        <div className="flex justify-center space-x-8 mb-8">
          <a href="#" className="text-2xl hover:text-gray-600">Instagram</a>
          <a href="#" className="text-2xl hover:text-gray-600">TikTok</a>
          <a href="#" className="text-2xl hover:text-gray-600">WhatsApp</a>
        </div>
        
        <p className="text-sm text-gray-500">© 2025 NAAKSH. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;