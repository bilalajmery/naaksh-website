'use client';
import React, { useState } from 'react';
import { X, Lock, Mail, Loader2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { loginCustomer } from '../../lib/auth';

export default function CheckoutLoginModal({ isOpen, onClose, email, onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Please enter your password to continue.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginCustomer({
        email: email,
        password: password,
      });

      toast.success('Logged in! Completing your order...');
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      console.error('Checkout inline login failed:', err);
      setError(err.friendlyMessage || err.message || 'Incorrect password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Alert */}
        <div className="bg-yellow-500 text-black p-6 pb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
              <ShieldCheck size={18} />
              <span>Customer Account Detected</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-black/10 transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight mt-2 text-black">
            Welcome Back!
          </h2>
          <p className="text-xs text-black/80 mt-1 font-medium leading-relaxed">
            This email already has an account. Please login to continue your order.
          </p>
        </div>

        {/* Content & Form */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-800 flex items-center justify-center flex-shrink-0 font-bold">
              <Mail size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Recognized Account Email
              </p>
              <p className="text-xs font-black text-black truncate">{email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Enter Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Your account password"
                  className={`w-full bg-gray-50 border rounded-xl py-3 pl-10 pr-4 text-sm text-black focus:outline-none focus:ring-1 focus:ring-black transition ${
                    error ? 'border-red-500 bg-red-50/50' : 'border-gray-200'
                  }`}
                  autoFocus
                  required
                />
              </div>
              {error && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 mt-2">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-yellow-500 hover:text-black transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying & Continuing...</span>
                </>
              ) : (
                <>
                  <span>Sign In & Continue Checkout</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-gray-500 hover:text-black underline transition"
              >
                Cancel or edit email address
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
