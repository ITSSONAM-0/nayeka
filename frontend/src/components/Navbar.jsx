import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Heart, LogOut, User, Menu, X, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                  NayePankh
                </span>
                <span className="text-[10px] uppercase tracking-widest text-primary-600 font-semibold block leading-none">
                  Foundation
                </span>
              </div>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              <span className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-500">
                Volunteer Portal
              </span>
            </div>
          </div>

          {/* Right Side: Profile Info & Logout */}
          <div className="hidden sm:flex sm:items-center sm:gap-4">
            <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {user.fullName}
                </div>
                <div className="flex items-center gap-1">
                  {user.role === 'admin' ? (
                    <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wide">
                      <Shield className="w-2.5 h-2.5 mr-0.5" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wide">
                      Volunteer
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-500 hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-3 shadow-inner">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-base">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">{user.fullName}</div>
              <div className="text-xs text-slate-500">{user.email}</div>
              <div className="mt-1">
                {user.role === 'admin' ? (
                  <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wide">
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wide">
                    Volunteer
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
