'use client';
import Link from 'next/link';
import { useState } from 'react';
import { MdDashboard, MdPeople, MdTimeline, MdSupportAgent, MdDescription, MdLogout, MdMenu } from 'react-icons/md';

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = [
    { title: 'Dashboard', icon: <MdDashboard className="text-xl md:text-lg" />, href: '/dashboard' },
    { title: 'Contacts', icon: <MdPeople className="text-xl md:text-lg" />, href: '/contacts' },
    { title: 'Weekly Utilization', icon: <MdTimeline className="text-xl md:text-lg" />, href: '/utilization' },
    { title: 'Customer Service', icon: <MdSupportAgent className="text-xl md:text-lg" />, href: '/customer-service' },
    { title: 'Reports', icon: <MdDescription className="text-xl md:text-lg" />, href: '/reports' },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear token and role from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');

      // Redirect to login page
      window.location.href = '/login';
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      <nav className="md:hidden bg-gray-900 text-gray-400 fixed top-0 w-full z-50">
        <div className="px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-700">
                <img 
                  src="/default-avatar.png" 
                  alt="Profile" 
                  className="w-full h-full rounded-full"
                />
              </div>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-800 hover:text-white"
            >
              <MdMenu className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute w-full bg-gray-900">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link 
                  key={item.title}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-800 hover:text-white transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              ))}
              <button 
                className="flex items-center space-x-2 px-3 py-2 w-full rounded-md hover:bg-gray-800 hover:text-white transition-colors text-sm"
                onClick={handleLogout}
              >
                <MdLogout className="text-lg" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col bg-gray-900 text-gray-400 w-64 min-h-screen fixed left-0">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-700">
              <img 
                src="/default-avatar.png" 
                alt="Profile" 
                className="w-full h-full rounded-full"
              />
            </div>
            <div>
              <h3 className="text-white text-sm font-medium">John Smith</h3>
              <p className="text-xs text-gray-500">PSF IV</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1 p-4">
          {menuItems.map((item) => (
            <Link 
              key={item.title}
              href={item.href}
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-800 hover:text-white transition-colors text-sm"
            >
              <span>{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          ))}
        </div>

        <div className="p-4">
          <button 
            className="flex items-center space-x-2 px-3 py-2 w-full rounded-md hover:bg-gray-800 hover:text-white transition-colors text-sm"
            onClick={handleLogout}
          >
            <MdLogout className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
