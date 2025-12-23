import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useUiStore } from '../../store/useUiStore';
import { Bars3Icon } from '@heroicons/react/24/outline';
import HrdNotificationBell from '../hrd/NotificationBell';
import CandidateNotificationBell from '../candidate/NotificationBell';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUiStore();
  const navigate = useNavigate();
  const isHrd = user?.role === 'hrd';
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (!isProfileOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <header className="bg-blue-600 shadow-md fixed w-full z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {isHrd && (
               <button
                onClick={toggleSidebar}
                className="md:hidden mr-4 p-2 text-gray-300 hover:text-white"
                aria-label="Toggle sidebar"
               >
                <Bars3Icon className="h-6 w-6" />
              </button>
            )}
            { !isHrd && (
                <button
                    onClick={toggleSidebar}
                    className="md:hidden mr-4 p-2 text-gray-300 hover:text-white"
                    aria-label="Toggle sidebar"
                >
                    <Bars3Icon className="h-6 w-6" />
                </button>
            )}
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-xl">AI Recruit</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isHrd ? <HrdNotificationBell /> : <CandidateNotificationBell />}
              <div className="relative ml-3" ref={dropdownRef}>
                <div>
                   <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center text-white"
                        aria-expanded={isProfileOpen}
                        aria-haspopup="true"
                    >
                        <span className="mr-2">{user?.name}</span>
                        <img className="h-8 w-8 rounded-full object-cover" src={user?.avatarUrl} alt="User avatar" />
                    </button>
                    <div className={`${isProfileOpen ? 'block' : 'hidden'} absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5`}>
                        {isHrd && (
                             <Link
                                to="/hrd/settings"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                Pengaturan
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Keluar
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;