import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { toast } from '../components/Toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form errors
  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please provide a valid email address';
    }

    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const profile = await login(email, password);
      // Redirect based on role
      if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      // toast.error is already handled inside context.login
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-700"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
            <Heart className="w-10 h-10 fill-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          NayePankh Foundation
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Volunteer Information Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-100 rounded-2xl sm:px-10">
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Sign In to Your Portal</h3>
          
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all ${
                    errors.email ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  className={`block w-full pl-10 pr-10 py-2.5 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all ${
                    errors.password ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-850 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-md shadow-primary-700/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Seed/Test Credentials Hint */}
          <div className="mt-6 border-t border-slate-100 pt-6">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                <Shield className="w-3.5 h-3.5 text-amber-500" /> Default Seed Credentials:
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed font-mono">
                Admin: admin@nayepankh.org / admin123<br />
                Volunteer: rahul.sharma@example.com / password123
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              New to NayePankh?{' '}
              <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-all">
                Create a volunteer profile
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
