import { useState, useEffect } from 'react';

const WhatsAppButton = () => {
    const phoneNumber = '923403577155'; // WhatsApp number without + or spaces
    const message = 'Hello! I am interested in your products.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    const [isDarkBackground, setIsDarkBackground] = useState(false);

    useEffect(() => {
        const checkBackground = () => {
            // Get button position
            const buttonElement = document.querySelector('[aria-label="Chat on WhatsApp"]');
            if (!buttonElement) return;

            const rect = buttonElement.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            // Get element at button position (excluding the button itself)
            buttonElement.style.pointerEvents = 'none';
            const elementBelow = document.elementFromPoint(x, y);
            buttonElement.style.pointerEvents = 'auto';

            if (elementBelow) {
                const bgColor = window.getComputedStyle(elementBelow).backgroundColor;

                // Check if background is dark
                const rgb = bgColor.match(/\d+/g);
                if (rgb) {
                    const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                    setIsDarkBackground(brightness < 128);
                }
            }
        };

        // Check on scroll and resize
        checkBackground();
        window.addEventListener('scroll', checkBackground);
        window.addEventListener('resize', checkBackground);

        // Also check after a short delay to ensure page is fully loaded
        setTimeout(checkBackground, 500);

        return () => {
            window.removeEventListener('scroll', checkBackground);
            window.removeEventListener('resize', checkBackground);
        };
    }, []);

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed bottom-6 right-6 z-50 w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 group ${isDarkBackground
                ? 'bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-yellow-400/50'
                : 'bg-black text-white hover:bg-yellow-400 hover:text-black hover:shadow-yellow-400/50'
                }`}
            aria-label="Chat on WhatsApp"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform relative z-10"
            >
                <path
                    fill="currentColor"
                    d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"
                />
            </svg>

            {/* Pulse animation */}
            <span className={`absolute inset-0 rounded-full animate-ping opacity-75 ${isDarkBackground ? 'bg-yellow-400' : 'bg-yellow-400'
                }`}></span>
        </a>
    );
};

export default WhatsAppButton;
