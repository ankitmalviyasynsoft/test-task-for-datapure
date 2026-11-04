'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { CheckSquare, LogOut, Moon, Sun, Settings, ChevronDown, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { AppearanceModal } from '../ui/AppearanceModal';

const DEFAULT_AVATAR = '/default-avatar.svg';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImgError(false);
  }, [user?.avatar]);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 dark:shadow-none group-hover:bg-primary-hover transition-colors">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight">
              TaskManager<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick Appearance trigger button */}
            <button
              onClick={() => setIsAppearanceOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Theme & Appearance Settings"
              aria-label="Theme & Appearance Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Profile dropdown menu */}
            {user && (
              <div className="relative pl-3 border-l border-slate-200 dark:border-slate-800" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer text-left select-none focus:outline-none ${
                    isMenuOpen
                      ? 'bg-slate-100 dark:bg-slate-800/90 border-slate-300 dark:border-slate-700 shadow-xs'
                      : 'border-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700/60'
                  }`}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={!imgError && user.avatar ? user.avatar : DEFAULT_AVATAR}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      setImgError(true);
                      e.currentTarget.src = DEFAULT_AVATAR;
                    }}
                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover shrink-0"
                  />
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-tight truncate max-w-[130px]">
                      {user.email}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isMenuOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-black/50 p-2 z-50 animate-slide-up">
                    <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {user.email}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsAppearanceOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/70 rounded-xl transition-colors cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Theme & Appearance</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Appearance Customization Modal */}
      <AppearanceModal isOpen={isAppearanceOpen} onClose={() => setIsAppearanceOpen(false)} />
    </>
  );
};
