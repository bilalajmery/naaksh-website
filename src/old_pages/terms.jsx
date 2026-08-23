import { Helmet } from 'react-helmet-async';
import { FileText } from 'lucide-react';

export default function Terms() {
    return (
        <>
            <Helmet>
                <meta name="description" content="Terms of Service for NAAKSH - Read our terms and conditions for using our website and purchasing our products." />
                <link rel="canonical" href="https://naakshofficial.com/terms" />
            </Helmet>

            <div className="min-h-screen bg-white pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full mb-6">
                            <FileText size={40} className="text-black" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
                            TERMS OF <span className="text-yellow-400">SERVICE</span>
                        </h1>
                        <p className="text-gray-600 text-lg">Last Updated: December 7, 2025</p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">Agreement to Terms</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                By accessing and using the NAAKSH website, you accept and agree to be bound by the terms and
                                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">Products and Services</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                NAAKSH offers premium streetwear and urban fashion products. All products are subject to availability.
                                We reserve the right to discontinue any product at any time. Prices for our products are subject to
                                change without notice.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>All prices are listed in Pakistani Rupees (PKR)</li>
                                <li>We reserve the right to refuse service to anyone for any reason at any time</li>
                                <li>Product colors may vary slightly from images due to screen settings</li>
                                <li>We strive to display accurate product information but cannot guarantee complete accuracy</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">Orders and Payment</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                When you place an order with NAAKSH, you agree to provide current, complete, and accurate purchase
                                and account information for all purchases made at our store.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Payment must be made at the time of order placement</li>
                                <li>We accept various payment methods including cash on delivery</li>
                                <li>Orders are subject to acceptance and availability</li>
                                <li>We reserve the right to refuse or cancel any order for any reason</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">Shipping and Delivery</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We ship across Pakistan. Delivery times may vary based on location and product availability.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Standard delivery: 3-7 business days</li>
                                <li>Express delivery available in major cities</li>
                                <li>Shipping costs are calculated at checkout</li>
                                <li>We are not responsible for delays caused by courier services or unforeseen circumstances</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">Returns and Exchanges</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We want you to be completely satisfied with your purchase. If you're not happy with your order,
                                we offer returns and exchanges within 7 days of delivery.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Items must be unworn, unwashed, and in original condition with tags attached</li>
                                <li>Return shipping costs are the responsibility of the customer unless the item is defective</li>
                                <li>Refunds will be processed within 7-10 business days after receiving the returned item</li>
                                <li>Sale items may not be eligible for return or exchange</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">Intellectual Property</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                All content on this website, including but not limited to text, graphics, logos, images, and software,
                                is the property of NAAKSH and is protected by Pakistani and international copyright laws.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>You may not reproduce, distribute, or create derivative works without our written permission</li>
                                <li>The NAAKSH name and logo are trademarks of NAAKSH</li>
                                <li>Unauthorized use of our intellectual property may result in legal action</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">Limitation of Liability</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                NAAKSH shall not be liable for any indirect, incidental, special, consequential, or punitive damages
                                resulting from your use of or inability to use the service.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">Governing Law</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                These Terms shall be governed and construed in accordance with the laws of Pakistan, without regard
                                to its conflict of law provisions.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">Changes to Terms</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
                                try to provide at least 30 days' notice prior to any new terms taking effect.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                If you have any questions about these Terms, please contact us:
                            </p>
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <p className="text-gray-700 mb-2"><strong>Email:</strong> support@naakshofficial.com</p>
                                <p className="text-gray-700 mb-2"><strong>Phone:</strong> +92 340 357 7155</p>
                                <p className="text-gray-700"><strong>Address:</strong> Karachi, Pakistan</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
