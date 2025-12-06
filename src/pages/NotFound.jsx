import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight, AlertTriangle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6 relative overflow-hidden">
            <Helmet>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Abstract Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
                <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-black rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-yellow-400 rounded-full blur-[100px]"></div>
            </div>

            <div className="text-center max-w-4xl mx-auto relative z-10">
                <div className="relative mb-6 section-404">
                    {/* Massive 404 Text */}
                    <h1 className="text-[120px] sm:text-[200px] lg:text-[280px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-200 select-none">
                        404
                    </h1>

                    {/* Floating Overlay Card */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-2xl px-8 py-6 md:px-12 md:py-8 rounded-2xl transform rotate-[-2deg]">
                            <div className="flex items-center gap-3 mb-2 justify-center">
                                <AlertTriangle className="text-yellow-500" size={24} />
                                <span className="font-bold text-black tracking-widest uppercase text-sm md:text-base">System Message</span>
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-black whitespace-nowrap">
                                Page Not Found
                            </h2>
                        </div>
                    </div>
                </div>

                <p className="text-gray-500 text-lg md:text-xl mb-12 max-w-lg mx-auto leading-relaxed font-medium">
                    The page you are looking for has been moved or disappeared into the void.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                    <Link
                        to="/"
                        className="w-full sm:w-auto overflow-hidden relative group bg-black text-yellow-400 px-10 py-5 rounded-[5px] font-bold tracking-wider uppercase transition-all hover:bg-gray-900 hover:shadow-lg hover:shadow-yellow-400/20 hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-center gap-3 relative z-10">
                            <Home size={20} />
                            <span>Return Home</span>
                        </div>
                    </Link>

                    <Link
                        to="/shop"
                        className="w-full sm:w-auto group flex items-center justify-center gap-3 px-10 py-5 rounded-[5px] font-bold tracking-wider uppercase border-2 border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                    >
                        <span>View Collection</span>
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1 text-yellow-500 group-hover:text-yellow-400" />
                    </Link>
                </div>

                {/* Footer decorations */}
                <div className="mt-20 flex items-center justify-center gap-8 text-gray-300">
                    <div className="h-px w-12 bg-gray-200"></div>
                    <span className="uppercase tracking-[0.3em] text-xs font-semibold text-gray-400">Naaksh Official</span>
                    <div className="h-px w-12 bg-gray-200"></div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
