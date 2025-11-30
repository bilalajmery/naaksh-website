import { NavLink } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Send } from 'lucide-react';

export default function Contact() {
    return (
        <>
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

                        <form className="space-y-8">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-5 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-5 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-5 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all"
                                />
                            </div>
                            <div>
                                <textarea
                                    rows="6"
                                    placeholder="Your Message..."
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-5 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all resize-none"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-yellow-400 text-black py-5 text-xl font-bold uppercase tracking-wider hover:bg-yellow-300 transition-all duration-300 rounded-xl flex items-center justify-center gap-3"
                            >
                                Send Message
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
                        FIND US IN <span className="text-yellow-400">LAHORE</span>
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
                                Coming Soon – Physical Store 2025
                            </p>
                        </div>
                    </div>
                </div>
            </section >
        </>
    );
}