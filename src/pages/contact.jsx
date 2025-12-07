import { NavLink } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(import.meta.env.VITE_SERVER_URL + '/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            // Handle validation errors (422) or other error responses
            if (!response.ok) {
                if (response.status === 422 && result.errors) {
                    // Extract first error message from errors object
                    const firstErrorKey = Object.keys(result.errors)[0];
                    const errorMessage = result.errors[firstErrorKey][0];
                    toast.error(errorMessage);
                } else if (result.message) {
                    // Use the message from API if available
                    toast.error(result.message);
                } else {
                    toast.error('Failed to send message. Please try again.');
                }
                return;
            }

            toast.success('Message sent successfully! We\'ll get back to you soon.');
            // Clear form on success
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            console.error('Contact Form Error:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <>
            <Helmet>
                <meta name="description" content="Get in touch with Naaksh. We are here to help with sizing, orders, or just to chat. Call, email, or visit us in Lahore." />
            </Helmet>
            {/* HERO - FULL DARK */}
            <section className="relative h-screen bg-black text-white flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-yellow-900/20" />
                <img
                    src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1920&h=1080&fit=crop"
                    alt="Contact"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />

                <div className="relative z-10 text-center px-6">
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8">
                        GET IN <span className="text-yellow-400">TOUCH</span>
                    </h1>
                    <p className="text-2xl md:text-3xl font-light tracking-wide max-w-2xl mx-auto">
                        Questions? Custom orders? Collabs? We're all ears.
                    </p>
                </div>
            </section>

            {/* MAIN CONTACT SECTION - LIGHT BG */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20">

                    {/* LEFT - CONTACT INFO */}
                    <div className="space-y-16">
                        <div>
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-10">
                                LET'S <span className="text-yellow-400">TALK</span>
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                                Whether you have a question about sizing, want bulk orders, or just wanna say what's up — hit us up. We reply fast.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                                    <Phone className="w-7 h-7 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-sm uppercase tracking-wider text-gray-500">Call / WhatsApp</p>
                                    <p className="text-2xl font-bold">+92 317 000 6677</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                                    <Mail className="w-7 h-7 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-sm uppercase tracking-wider text-gray-500">Email Us</p>
                                    <p className="text-2xl font-bold">hello@naaksh.pk</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                                    <MapPin className="w-7 h-7 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-sm uppercase tracking-wider text-gray-500">Visit Us</p>
                                    <p className="text-2xl font-bold">Lahore, Pakistan</p>
                                </div>
                            </div>
                        </div>

                        {/* Social */}
                        <div>
                            <p className="text-sm uppercase tracking-wider text-gray-500 mb-6">Follow the movement</p>
                            <div className="flex gap-6">
                                <a href="https://instagram.com/naaksh.official" target="_blank" className="group">
                                    <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center group-hover:bg-yellow-400 transition-all duration-300">
                                        <Instagram className="w-7 h-7 text-white group-hover:text-black transition-colors" />
                                    </div>
                                </a>

                            </div>
                            {/* Add TikTok, Facebook etc if needed */}
                        </div>
                    </div>

                    {/* RIGHT - CONTACT FORM */}
                    <div className="bg-black text-white rounded-3xl p-12 lg:p-16">
                        <h3 className="text-4xl font-black mb-10">
                            SEND US A <span className="text-yellow-400">MESSAGE</span>
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Your Name"
                                    disabled={isSubmitting}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-5 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Your Email"
                                    disabled={isSubmitting}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-5 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="Subject"
                                    disabled={isSubmitting}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-5 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <textarea
                                    rows="6"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Your Message..."
                                    disabled={isSubmitting}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-5 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-yellow-400 text-black py-5 text-xl font-bold uppercase tracking-wider hover:bg-yellow-300 transition-all duration-300 rounded-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                <Send size={24} />
                            </button>
                        </form>
                    </div>
                </div>
            </section >

            {/* MAP / LOCATION - DARK BG */}
            < section className="py-32 bg-black text-white text-center" >
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-16">
                        FIND US IN <span className="text-yellow-400">KARACHI</span>
                    </h2>

                    {/* Placeholder for Google Maps or Image */}
                    <div className="relative h-96 md:h-[600px] rounded-3xl overflow-hidden shadow-2xl mx-auto max-w-5xl">
                        <img
                            src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=600&fit=crop"
                            alt="Lahore"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <p className="text-4xl font-bold tracking-wider">
                                Coming Soon – Physical Store 2026
                            </p>
                        </div>
                    </div>
                </div>
            </section >

            {/* WHY CHOOSE NAAKSH - LIGHT THEME */}
            <section className="py-32 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                            WHY CHOOSE <span className="text-yellow-400">NAAKSH?</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We're not just another streetwear brand. Here's what makes us different.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="group bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-yellow-400/50">
                            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 tracking-tight">Premium Quality</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Every piece is crafted with high-grade fabrics and attention to detail. We don't compromise on quality, ever.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="group bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-yellow-400/50">
                            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 tracking-tight">Lightning Fast Delivery</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Order today, wear it tomorrow. Express shipping across Pakistan ensures you get your drip ASAP.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="group bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-yellow-400/50">
                            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 tracking-tight">Best Price Guarantee</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Premium streetwear without the premium markup. Quality gear at prices that make sense.
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div className="group bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-yellow-400/50">
                            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 tracking-tight">Easy Returns & Exchanges</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Not feeling it? No worries. Hassle-free returns and exchanges within 7 days. Your satisfaction matters.
                            </p>
                        </div>

                        {/* Card 5 */}
                        <div className="group bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-yellow-400/50">
                            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 tracking-tight">24/7 Customer Support</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Questions at 2 AM? We got you. Our team is always ready to help via WhatsApp, email, or DM.
                            </p>
                        </div>

                        {/* Card 6 */}
                        <div className="group bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-yellow-400/50">
                            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 tracking-tight">Trusted by Thousands</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Join the NAAKSH family. Thousands of satisfied customers across Pakistan trust us for their streetwear needs.
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-20">
                        <p className="text-2xl font-bold mb-8 text-gray-800">
                            Ready to upgrade your wardrobe?
                        </p>
                        <NavLink
                            to="/shop"
                            className="inline-block bg-black text-white px-12 py-5 text-lg font-bold tracking-wider hover:bg-yellow-400 hover:text-black transition-all duration-300 rounded-xl"
                        >
                            SHOP NOW
                        </NavLink>
                    </div>
                </div>
            </section>
        </>
    );
}