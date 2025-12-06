// src/components/Sidebar.jsx

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { mockUserData } from '../assets/assets';

const Sidebar = () => {
  const role = mockUserData.user.role; // worker | lender | company

  const menuItems = {
    worker: [
      { label: 'Dashboard', path: '/', icon: '📊' },
      { label: 'Submit Work', path: '/submit-work', icon: '📝' },
      { label: 'My Tasks', path: '/my-tasks', icon: '✅' },
      { label: 'Loans', path: '/loans', icon: '💰' },
      { label: 'Profile', path: '/personal', icon: '👤' },
    ],
    lender: [
      { label: 'Dashboard', path: '/', icon: '📊' },
      { label: 'Active Loans', path: '/lender', icon: '💵' },
      { label: 'Portfolio', path: '/portfolio', icon: '📈' },
      { label: 'Settings', path: '/settings', icon: '⚙️' },
    ],
    company: [
      { label: 'Dashboard', path: '/', icon: '📊' },
      { label: 'Manage Tasks', path: '/platform-manager', icon: '🎯' },
      { label: 'Team', path: '/team', icon: '👥' },
      { label: 'Analytics', path: '/analytics', icon: '📈' },
    ],
  };

  const items = menuItems[role] || menuItems.worker;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 overflow-y-auto hidden md:flex flex-col p-4">
      {/* User Card */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
        <div className="flex items-center gap-3 mb-3">
          <img src={mockUserData.user.avatar} alt="avatar" className="h-10 w-10 rounded-full" />
          <div>
            <p className="text-sm font-bold text-slate-900">{mockUserData.user.name}</p>
            <p className="text-xs text-slate-600 capitalize">{role}</p>
          </div>
        </div>
        <div className="h-1 w-full bg-slate-200 rounded-full mb-2">
          <div
            className="h-1 bg-emerald-500 rounded-full"
            style={{ width: `${mockUserData.karmaScore.score}%` }}
          />
        </div>
        <p className="text-xs text-slate-600">
          Karma Score: <span className="font-bold text-emerald-600">{mockUserData.karmaScore.score}</span>
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer Card */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <p className="font-medium text-slate-900 mb-1">Need Help?</p>
        <p className="mb-2">Learn how to improve your Karma Score</p>
        <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs font-medium">
          View Guide
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
