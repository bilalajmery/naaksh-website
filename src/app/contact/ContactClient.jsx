'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Music2, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { submitContact } from '../../lib/api';

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please enter your name';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Please enter a valid email address';
    if (!formData.subject.trim()) errors.subject = 'Please enter a subject';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fix the errors in the form.');
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      await submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim()
      });

      setSubmitted(true);
      toast.success('Thank you! Your message has been sent to our customer care team.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Contact Form Error:', error);
      if (error.errors) {
        setFormErrors(error.errors);
      }
      toast.error(error.friendlyMessage || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative bg-[#0d0d0d] text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 text-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-2 inline-block">
            Customer Support & Inquiries
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight mb-6">
            Get in <span className="text-yellow-400">Touch</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed">
            Have questions about drops, custom sizing, or bulk orders? Our dedicated team is here to assist you.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Info & Social */}
          <div className="space-y-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-yellow-600">
                Direct Channels
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black mt-1 mb-4">
                We Reply Promptly
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Connect directly through WhatsApp, email, or our official social channels. We prioritize swift resolutions for all orders.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-12 h-12 bg-black text-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Call / WhatsApp</h3>
                  <p className="text-base font-black text-black mt-0.5">+92 340 357 7155</p>
                  <p className="text-[11px] text-gray-400">Mon - Sat (10:00 AM - 8:00 PM PKT)</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-12 h-12 bg-black text-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Support</h3>
                  <p className="text-base font-black text-black mt-0.5">support@naakshofficial.com</p>
                  <p className="text-[11px] text-gray-400">Average response within 24 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-12 h-12 bg-black text-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Headquarters</h3>
                  <p className="text-base font-black text-black mt-0.5">Karachi, Pakistan</p>
                  <p className="text-[11px] text-gray-400">Online Storefront & Distribution Hub</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-4">Follow NAAKSH</h3>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/naakshofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-11 h-11 bg-black text-white rounded-xl flex items-center justify-center hover:bg-yellow-400 hover:text-black transition shadow-sm"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://www.facebook.com/naakshofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-11 h-11 bg-black text-white rounded-xl flex items-center justify-center hover:bg-yellow-400 hover:text-black transition shadow-sm"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://www.tiktok.com/@naakshofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-11 h-11 bg-black text-white rounded-xl flex items-center justify-center hover:bg-yellow-400 hover:text-black transition shadow-sm"
                >
                  <Music2 size={18} />
                </a>
                <a
                  href="https://www.youtube.com/@NaakshOfficial-f9h"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-11 h-11 bg-black text-white rounded-xl flex items-center justify-center hover:bg-yellow-400 hover:text-black transition shadow-sm"
                >
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="bg-[#0d0d0d] text-white p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-2">
              Send a <span className="text-yellow-400">Message</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mb-8">
              Fill out the form below and our customer team will respond shortly.
            </p>

            {submitted && (
              <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-2xl flex items-start gap-3 text-green-300 text-xs">
                <CheckCircle2 size={18} className="flex-shrink-0 text-green-400 mt-0.5" />
                <span>Your message has been sent successfully! We will get back to you soon.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Bilal Ahmed"
                  disabled={isSubmitting}
                  className={`w-full bg-white/5 border rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition ${
                    formErrors.name ? 'border-red-500 bg-red-950/20' : 'border-white/10'
                  }`}
                  required
                />
                {formErrors.name && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. you@example.com"
                  disabled={isSubmitting}
                  className={`w-full bg-white/5 border rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition ${
                    formErrors.email ? 'border-red-500 bg-red-950/20' : 'border-white/10'
                  }`}
                  required
                />
                {formErrors.email && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g. Order Inquiry / Size Guide"
                  disabled={isSubmitting}
                  className={`w-full bg-white/5 border rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition ${
                    formErrors.subject ? 'border-red-500 bg-red-950/20' : 'border-white/10'
                  }`}
                  required
                />
                {formErrors.subject && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.subject}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Message *
                </label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your inquiry with at least 10 characters..."
                  disabled={isSubmitting}
                  className={`w-full bg-white/5 border rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition resize-none ${
                    formErrors.message ? 'border-red-500 bg-red-950/20' : 'border-white/10'
                  }`}
                  required
                ></textarea>
                {formErrors.message && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-xs font-bold uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2 shadow-lg ${
                  isSubmitting
                    ? 'bg-yellow-400/50 text-black cursor-not-allowed'
                    : 'bg-yellow-400 text-black hover:bg-yellow-300 shadow-yellow-500/20'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE NAAKSH */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-600">The NAAKSH Standard</span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-black mt-1">
              Why Customers Trust Us
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-black text-base uppercase text-black mb-2">100% Combed Cotton</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                240 GSM heavyweight bio-washed cotton engineered for ultimate comfort and silhouette structure.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-black text-base uppercase text-black mb-2">Free Delivery Nationwide</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Express doorstep delivery across Pakistan via tracked courier networks with zero shipping charges.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-black text-base uppercase text-black mb-2">7-Day Easy Exchanges</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Hassle-free size exchanges and returns within 7 days of delivery. Customer satisfaction guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
