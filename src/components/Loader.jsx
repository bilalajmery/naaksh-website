
import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
            <div className="relative flex items-center justify-center">
                {/* Spinning Ring */}
                <div className="absolute w-32 h-32 border-4 border-gray-800 border-t-yellow-500 rounded-full animate-spin"></div>

                {/* Logo Center */}
                <img
                    src="/logo/sm.png"
                    alt="Loading..."
                    className="w-20 h-auto object-contain animate-pulse relative z-10"
                />
            </div>
        </div>
    );
};

export default Loader;
