import { MessageCircleMore } from 'lucide-react';
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
            className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 group ${isDarkBackground
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-yellow-400/50'
                    : 'bg-black text-white hover:bg-yellow-400 hover:text-black hover:shadow-yellow-400/50'
                }`}
            aria-label="Chat on WhatsApp"
        >
            <MessageCircleMore size={28} className="group-hover:scale-110 transition-transform" />

            {/* Pulse animation */}
            <span className={`absolute inset-0 rounded-full animate-ping opacity-75 ${isDarkBackground ? 'bg-yellow-400' : 'bg-yellow-400'
                }`}></span>
        </a>
    );
};

export default WhatsAppButton;
