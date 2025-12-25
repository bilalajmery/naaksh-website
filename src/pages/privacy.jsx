import { Helmet } from 'react-helmet-async';
import { Shield } from 'lucide-react';

export default function Privacy() {
    return (
        <>
            <Helmet>
                <meta name="description" content="Privacy Policy for NAAKSH - Learn how we collect, use, and protect your personal information." />
                <link rel="canonical" href="https://naakshofficial.com/privacy" />
            </Helmet>

            <div className="min-h-screen bg-white pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full mb-6">
                            <Shield size={40} className="text-black" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
                            PRIVACY <span className="text-yellow-400">POLICY</span>
                        </h1>
                        <p className="text-gray-600 text-lg">Last Updated: December 7, 2025</p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">Introduction</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Welcome to NAAKSH. We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you about how we look after your personal data when you visit
                                our website and tell you about your privacy rights and how the law protects you.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">Information We Collect</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We may collect, use, store and transfer different kinds of personal data about you which we have
                                grouped together as follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                                <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
                                <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">How We Use Your Information</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We will only use your personal data when the law allows us to. Most commonly, we will use your
                                personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>To process and deliver your order including managing payments and collecting money owed to us</li>
                                <li>To manage our relationship with you including notifying you about changes to our terms or privacy policy</li>
                                <li>To enable you to participate in promotions or complete a survey</li>
                                <li>To administer and protect our business and this website</li>
                                <li>To deliver relevant website content and advertisements to you</li>
                                <li>To use data analytics to improve our website, products/services, marketing, customer relationships and experiences</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">Data Security</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We have put in place appropriate security measures to prevent your personal data from being
                                accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition,
                                we limit access to your personal data to those employees, agents, contractors and other third
                                parties who have a business need to know.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">Your Legal Rights</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Under certain circumstances, you have rights under data protection laws in relation to your personal data:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Request access to your personal data</li>
                                <li>Request correction of your personal data</li>
                                <li>Request erasure of your personal data</li>
                                <li>Object to processing of your personal data</li>
                                <li>Request restriction of processing your personal data</li>
                                <li>Request transfer of your personal data</li>
                                <li>Right to withdraw consent</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">Cookies</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Our website uses cookies to distinguish you from other users of our website. This helps us to
                                provide you with a good experience when you browse our website and also allows us to improve our site.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                If you have any questions about this privacy policy or our privacy practices, please contact us:
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
