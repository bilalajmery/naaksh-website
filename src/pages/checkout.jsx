import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Search, Check, MapPin, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

// Pakistan Data
const PAKISTAN_STATES = [
    "Punjab",
    "Sindh",
    "Khyber Pakhtunkhwa",
    "Balochistan",
    "Islamabad Capital Territory",
    "Azad Jammu and Kashmir",
    "Gilgit-Baltistan"
];

const PAKISTAN_CITIES = {
    "Punjab": ["Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot", "Bahawalpur", "Sargodha", "Sheikhupura", "Jhang", "Rahim Yar Khan", "Gujrat", "Kasur", "Sahiwal", "Okara", "Wah Cantonment", "Dera Ghazi Khan", "Mirpur Khas", "Chiniot", "Kamoke", "Mandi Bahauddin", "Toba Tek Singh", "Muzaffargarh", "Hafizabad", "Jhelum", "Khanewal", "Khushab", "Attock", "Layyah", "Bhakkar", "Chakwal", "Lodhran", "Mianwali", "Narowal", "Pakpattan", "Rajanpur", "Vehari"],
    "Sindh": ["Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah", "Kotri", "Mirpur Khas", "Shikarpur", "Jacobabad", "Khairpur", "Dadu", "Tando Adam", "Tando Allahyar", "Umerkot", "Badin", "Ghotki", "Kashmore", "Matiari", "Naushahro Feroze", "Sanghar", "Sujawal", "Thatta"],
    "Khyber Pakhtunkhwa": ["Peshawar", "Mardan", "Mingora", "Kohat", "Abbottabad", "Dera Ismail Khan", "Nowshera", "Charsadda", "Swabi", "Mansehra", "Swat", "Haripur", "Bannu", "Batkhela", "Chitral", "Dir", "Hangu", "Karak", "Lakki Marwat", "Malakand", "Shangla", "Tank", "Timergara"],
    "Balochistan": ["Quetta", "Turbat", "Khuzdar", "Hub", "Chaman", "Gwadar", "Sibi", "Zhob", "Loralai", "Kalat", "Mastung", "Nushki", "Pishin", "Qila Abdullah", "Qila Saifullah"],
    "Islamabad Capital Territory": ["Islamabad"],
    "Azad Jammu and Kashmir": ["Muzaffarabad", "Mirpur", "Bhimber", "Kotli", "Rawalakot", "Bagh", "Pallandri", "Hattian Bala", "Haveli", "Neelum"],
    "Gilgit-Baltistan": ["Gilgit", "Skardu", "Chilas", "Ghanche", "Ghizer", "Astore", "Hunza", "Nagar", "Shigar", "Kharmang"]
};

// Custom Searchable Select Component
const SearchableSelect = ({ options, value, onChange, placeholder, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef(null);

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={wrapperRef}>
            <div
                className={`w-full bg-gray-50 border border-gray-200 rounded-md py-3 px-4 flex justify-between items-center cursor-pointer transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={value ? "text-gray-900" : "text-gray-400"}>
                    {value || placeholder}
                </span>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-gray-200 rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-black"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt}
                                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${value === opt ? 'bg-gray-50 font-medium' : 'text-gray-700'}`}
                                    onClick={() => {
                                        onChange(opt);
                                        setIsOpen(false);
                                        setSearchTerm("");
                                    }}
                                >
                                    {opt}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-sm text-gray-400">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function Checkout() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [showSavedAddresses, setShowSavedAddresses] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        state: '',
        city: '',
        address: '',
        instruction: ''
    });

    const [saveAddress, setSaveAddress] = useState(false);

    // Shipping Config (Matching Cart)
    const IS_SHIPPING_ENABLED = false;
    const SHIPPING_COST = 250;

    useEffect(() => {
        // Load Cart
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) setCartItems(JSON.parse(savedCart));
            else navigate('/cart'); // Redirect if empty
        } catch (error) {
            console.error("Cart error");
        }

        // Load Saved Addresses
        try {
            const saved = localStorage.getItem('savedAddresses');
            if (saved) setSavedAddresses(JSON.parse(saved));
        } catch (error) {
            console.error("Address load error");
        }

        setLoading(false);
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStateChange = (state) => {
        setFormData(prev => ({ ...prev, state: state, city: '' })); // Reset city on state change
    };

    const handleCityChange = (city) => {
        setFormData(prev => ({ ...prev, city: city }));
    };

    const handleAutoFill = (address) => {
        setFormData({
            name: address.name,
            email: address.email,
            phone: address.phone,
            state: address.state,
            city: address.city,
            address: address.address,
            instruction: ''
        });
        setShowSavedAddresses(false);
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCheckout = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.name || !formData.email || !formData.phone || !formData.state || !formData.city || !formData.address) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);

        // Prepare Order Payload
        const orderData = {
            customer: formData,
            items: cartItems.map(item => ({
                product_id: item.productId, // or item.id if that's the real DB id
                name: item.name,
                slug: item.slug,
                price: item.priceNum,
                quantity: item.quantity,
                color: item.color,
                size: item.size,
                image: item.image
            })),
            summary: {
                subtotal,
                shipping,
                total
            },
            orderDate: new Date().toISOString()
        };

        try {
            const response = await fetch(import.meta.env.VITE_SERVER_URL + '/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            const result = await response.json();

            // Save Address Logic (only if successful)
            if (saveAddress) {
                const newAddress = {
                    id: Date.now(),
                    ...formData,
                    instruction: undefined
                };
                const existingAddresses = [...savedAddresses];
                const isDuplicate = existingAddresses.some(addr =>
                    addr.name === newAddress.name &&
                    addr.phone === newAddress.phone &&
                    addr.address === newAddress.address
                );

                if (!isDuplicate) {
                    const updatedAddresses = [newAddress, ...existingAddresses];
                    setSavedAddresses(updatedAddresses);
                    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
                }
            }

            toast.success("Order Placed Successfully!");
            localStorage.removeItem('cart'); // Clear cart
            setCartItems([]);
            navigate('/'); // Go Home

        } catch (error) {
            console.error('Checkout Error:', error);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);
    const shipping = IS_SHIPPING_ENABLED ? SHIPPING_COST : 0;
    const total = subtotal + shipping;

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-black" />
            </div>
        );
    }

    if (cartItems.length === 0) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">

            <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-4xl font-black mb-12 tracking-tighter text-center">CHECKOUT</h1>

                <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">

                    {/* LEFT COLUMN: FORM */}
                    <div className="space-y-8 col-span-2">

                        {/* Saved Addresses Dropdown */}
                        {savedAddresses.length > 0 && (
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <MapPin size={18} /> Saved Addresses
                                    </h3>
                                    <button
                                        onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                                        className="text-sm text-yellow-600 hover:text-yellow-700 font-medium underline"
                                    >
                                        {showSavedAddresses ? 'Hide' : 'Show'}
                                    </button>
                                </div>

                                {showSavedAddresses && (
                                    <div className="grid gap-3">
                                        {savedAddresses.map(addr => (
                                            <div key={addr.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors flex justify-between items-center" onClick={() => handleAutoFill(addr)}>
                                                <div>
                                                    <p className="font-bold text-sm">{addr.name}</p>
                                                    <p className="text-xs text-gray-500">{addr.address}, {addr.city}</p>
                                                </div>
                                                <button className="text-xs bg-black text-white px-3 py-1 rounded-sm">
                                                    Use
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleCheckout} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                            <h2 className="text-xl font-bold mb-6">Contact & Delivery</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-md py-3 px-4 focus:outline-none focus:border-black transition-colors"
                                        placeholder="e.g. John Doe"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-md py-3 px-4 focus:outline-none focus:border-black transition-colors"
                                        placeholder="e.g. 03001234567"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-md py-3 px-4 focus:outline-none focus:border-black transition-colors"
                                    placeholder="e.g. john@example.com"
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Province / State</label>
                                    <SearchableSelect
                                        options={PAKISTAN_STATES}
                                        value={formData.state}
                                        onChange={handleStateChange}
                                        placeholder="Select Province"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">City</label>
                                    <SearchableSelect
                                        options={formData.state ? PAKISTAN_CITIES[formData.state] || [] : []}
                                        value={formData.city}
                                        onChange={handleCityChange}
                                        placeholder={formData.state ? "Select City" : "Select Province First"}
                                        disabled={!formData.state}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-md py-3 px-4 focus:outline-none focus:border-black transition-colors min-h-[100px]"
                                    placeholder="House number, street address..."
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Order Instructions (Optional)</label>
                                <textarea
                                    name="instruction"
                                    value={formData.instruction}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-md py-3 px-4 focus:outline-none focus:border-black transition-colors min-h-[80px]"
                                    placeholder="Special instructions for delivery..."
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <div
                                    className={`w-5 h-5 border rounded cursor-pointer flex items-center justify-center transition-colors ${saveAddress ? 'bg-black border-black' : 'border-gray-300 bg-white'}`}
                                    onClick={() => setSaveAddress(!saveAddress)}
                                >
                                    {saveAddress && <Check size={12} className="text-white" />}
                                </div>
                                <label className="text-sm text-gray-600 cursor-pointer select-none" onClick={() => setSaveAddress(!saveAddress)}>
                                    Save this address for future orders
                                </label>
                            </div>
                        </form>
                    </div>


                    {/* RIGHT COLUMN: SUMMARY */}
                    <div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-32">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2">
                                {cartItems.map((item, i) => (
                                    <div key={`${item.id}-${i}`} className="flex gap-4 py-3 border-b border-gray-50 last:border-0">
                                        <div className="w-16 h-16 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {item.color} | {item.size} | x{item.quantity}
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold">
                                            PKR {(item.priceNum * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>PKR {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                                        {shipping === 0 ? "Free" : `PKR ${shipping}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xl font-black pt-4 border-t border-gray-100">
                                    <span>Total</span>
                                    <span>PKR {total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isSubmitting}
                                className={`w-full bg-black text-white py-4 mt-8 text-sm font-bold tracking-widest hover:bg-gray-900 transition-colors uppercase rounded-lg shadow-lg flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Processing...
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
