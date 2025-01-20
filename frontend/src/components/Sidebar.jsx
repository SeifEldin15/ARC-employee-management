'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MdDashboard, MdPeople, MdTimeline, MdSupportAgent, MdDescription, MdLogout, MdMenu, MdGroups, MdAccountCircle } from 'react-icons/md';

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/auth/info');
        const data = await response.json();
        setUserInfo(data);
        setRole(data.role);
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const SkeletonItem = () => (
    <div className="flex items-center space-x-2 px-3 py-2 rounded-md">
      <div className="w-5 h-5 bg-gray-700 rounded animate-pulse"></div>
      <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
    </div>
  );

  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: <MdDashboard className="text-xl md:text-lg" />, 
      href: role === 'Manager' ? '/Managerdashboard' : '/Dashboard'
    },
    { 
      title: 'Contacts', 
      icon: <MdPeople className="text-xl md:text-lg" />, 
      href: '/Contacts'
    },
    ...(role !== 'Manager' ? [
      { title: 'Weekly Utilization', icon: <MdTimeline className="text-xl md:text-lg" />, href: '/Report' },
      { title: 'Customer Service', icon: <MdSupportAgent className="text-xl md:text-lg" />, href: '/Pdf' },
    ] : []),
    { 
      title: 'Reports', 
      icon: <MdDescription className="text-xl md:text-lg" />, 
      href: role === 'Manager' ? '/Managerreports' : '/Myreports' 
    },
    ...(role === 'Manager' ? [
      {
        title: 'Team',
        icon: <MdGroups className="text-xl md:text-lg" />,
        href: '/Team'
      },
      {
        title: 'Contracts',
        icon: <MdDescription className="text-xl md:text-lg" />,
        href: '/Contracts'
      }
    ] : [])
  ];

  const handleLogout = () => {
    // Clear token and role from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Redirect to root path
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      <nav className="md:hidden bg-gray-900 text-gray-400 fixed top-0 w-full z-50">
        <div className="px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                {loading ? (
                  <div className="w-full h-full rounded-full bg-gray-700 animate-pulse" />
                ) : userInfo?.image ? (
                  <img 
                    src={userInfo.image}
                    alt="Profile" 
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <MdAccountCircle className="w-full h-full text-gray-400" />
                )}
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
              {loading ? (
                [...Array(4)].map((_, i) => <SkeletonItem key={i} />)
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col bg-gray-900 text-gray-400 w-64 min-h-screen fixed left-0">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              {loading ? (
                <div className="w-full h-full rounded-full bg-gray-700 animate-pulse" />
              ) : userInfo?.image ? (
                <img 
                  src={userInfo.image}
                  alt="Profile" 
                  className="w-full h-full rounded-full"
                />
              ) : (
                <MdAccountCircle className="w-full h-full text-gray-400" />
              )}
            </div>
            <div>
              {loading ? (
                <>
                  <div className="h-4 w-24 bg-gray-700 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-20 bg-gray-700 rounded animate-pulse"></div>
                </>
              ) : (
                <>
                  <h3 className="text-white text-sm font-medium">{userInfo?.name || 'Loading...'}</h3>
                  <p className="text-xs text-gray-500">{userInfo?.job_title || 'Employee'}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1 p-4">
          {loading ? (
            [...Array(4)].map((_, i) => <SkeletonItem key={i} />)
          ) : (
            menuItems.map((item) => (
              <Link 
                key={item.title}
                href={item.href}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-800 hover:text-white transition-colors text-sm"
              >
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            ))
          )}
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
