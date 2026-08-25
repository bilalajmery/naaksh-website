'use client';
import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Phone, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { loginCustomer, registerCustomer } from '../lib/auth';
import * as api from '../lib/api';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot'
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrors({});
      setForgotSuccess(false);
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!formData.email.trim() || !formData.password) {
      setErrors({
        email: !formData.email.trim() ? 'Email is required' : null,
        password: !formData.password ? 'Password is required' : null,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await loginCustomer({
        email: formData.email.trim(),
        password: formData.password,
      });
      toast.success(res.message || 'Welcome back to NAAKSH!');
      onClose();
      if (onSuccess) onSuccess(res.user);
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        toast.error(err.friendlyMessage || err.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await registerCustomer({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });
      toast.success(res.message || 'Account created successfully!');
      onClose();
      if (onSuccess) onSuccess(res.user);
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        toast.error(err.friendlyMessage || err.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!formData.email.trim()) {
      setErrors({ email: 'Email address is required' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.forgotPassword(formData.email.trim());
      setForgotSuccess(true);
      toast.info(res.message || 'Reset instructions sent.');
    } catch (err) {
      toast.error(err.friendlyMessage || err.message || 'Unable to process request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#121212] border border-yellow-900/40 rounded-3xl shadow-2xl overflow-hidden z-10 text-white animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-yellow-500/20 via-yellow-500/10 to-transparent p-6 pb-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400">
              NAAKSH MEMBER ACCESS
            </span>
            <h2 className="text-xl font-black uppercase tracking-tight text-white mt-0.5">
              {mode === 'login' && 'Sign In to Account'}
              {mode === 'register' && 'Join the Movement'}
              {mode === 'forgot' && 'Reset Your Password'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher (Only between Login & Register) */}
        {mode !== 'forgot' && (
          <div className="flex border-b border-white/10 bg-black/40 text-xs font-bold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrors({});
              }}
              className={`flex-1 py-3 text-center transition ${
                mode === 'login'
                  ? 'text-yellow-400 border-b-2 border-yellow-400 bg-white/5'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrors({});
              }}
              className={`flex-1 py-3 text-center transition ${
                mode === 'register'
                  ? 'text-yellow-400 border-b-2 border-yellow-400 bg-white/5'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        )}

        <div className="p-6 sm:p-8">
          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. customer@naakshofficial.com"
                    className={`w-full bg-white/5 border rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition ${
                      errors.email ? 'border-red-500 bg-red-500/10' : 'border-white/10'
                    }`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-400 mt-1">
                    {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrors({});
                    }}
                    className="text-[11px] text-yellow-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full bg-white/5 border rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition ${
                      errors.password ? 'border-red-500 bg-red-500/10' : 'border-white/10'
                    }`}
                    required
                  />
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-400 mt-1">
                    {Array.isArray(errors.password) ? errors.password[0] : errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 bg-yellow-500 text-black font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-yellow-400 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-gray-400">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-yellow-400 font-bold hover:underline"
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ali Khan"
                    className={`w-full bg-white/5 border rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition ${
                      errors.name ? 'border-red-500 bg-red-500/10' : 'border-white/10'
                    }`}
                    required
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-red-400 mt-1">
                    {Array.isArray(errors.name) ? errors.name[0] : errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. ali@example.com"
                    className={`w-full bg-white/5 border rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition ${
                      errors.email ? 'border-red-500 bg-red-500/10' : 'border-white/10'
                    }`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-400 mt-1">
                    {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Phone Number <span className="text-gray-500 lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 0300 1234567"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 8 chars"
                    className={`w-full bg-white/5 border rounded-xl py-2.5 px-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition ${
                      errors.password ? 'border-red-500 bg-red-500/10' : 'border-white/10'
                    }`}
                    required
                  />
                  {errors.password && (
                    <p className="text-[10px] text-red-400 mt-1 truncate">
                      {Array.isArray(errors.password) ? errors.password[0] : errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Confirm *
                  </label>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className={`w-full bg-white/5 border rounded-xl py-2.5 px-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition ${
                      errors.password_confirmation ? 'border-red-500 bg-red-500/10' : 'border-white/10'
                    }`}
                    required
                  />
                  {errors.password_confirmation && (
                    <p className="text-[10px] text-red-400 mt-1 truncate">
                      {Array.isArray(errors.password_confirmation) ? errors.password_confirmation[0] : errors.password_confirmation}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 bg-yellow-500 text-black font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-yellow-400 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="pt-1 text-center text-xs text-gray-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-yellow-400 font-bold hover:underline"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              {forgotSuccess ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="font-bold text-sm text-white">Instructions Sent</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    If an account exists for {formData.email}, you will receive password reset instructions shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setForgotSuccess(false);
                    }}
                    className="mt-4 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Enter the email address registered with your NAAKSH account. We will send you instructions to reset your password.
                  </p>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. ali@example.com"
                        className={`w-full bg-white/5 border rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition ${
                          errors.email ? 'border-red-500 bg-red-500/10' : 'border-white/10'
                        }`}
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-red-400 mt-1">
                        {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-yellow-500 text-black font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-yellow-400 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Sending Instructions...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-xs text-gray-400 hover:text-white transition"
                    >
                      &larr; Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
