// src/components/Navbar.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUserData } from '../assets/assets';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 shadow-sm z-30">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
            KP
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Karma Passport</h2>
            <p className="text-xs text-slate-500">AI Reputation Protocol</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Karma Score Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-700">
              Score: {mockUserData.karmaScore.score}
            </span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">Worker</p>
            </div>
            <img
              src={mockUserData.user.avatar}
              alt="avatar"
              className="h-9 w-9 rounded-full"
            />
            <button
              onClick={handleLogout}
              className="hidden sm:inline text-xs text-slate-600 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
