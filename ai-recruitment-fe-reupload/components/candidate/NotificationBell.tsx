import React, { useState, useEffect, useRef } from 'react';
import { useCandidateStore } from '../../store/useCandidateStore';
import { Notification } from '../../types';
import { BellIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import {formatDistanceToNow} from 'date-fns/formatDistanceToNow';
import {id} from 'date-fns/locale/id';

const CandidateNotificationBell: React.FC = () => {
    const { notifications, navigateToTarget } = useCandidateStore();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const unreadCount = notifications.filter(n => n.status === 'unread').length;
    
    const handleNotificationClick = (notification: Notification) => {
        setIsOpen(false);
        navigateToTarget(notification, navigate);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-gray-300 hover:text-white p-2 rounded-full focus:outline-none"
                aria-label={`Notifikasi (${unreadCount} belum dibaca)`}
            >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div 
                    className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 ring-1 ring-black ring-opacity-5"
                >
                    <div className="py-2 px-4 font-bold text-black border-b border-gray-200">Notifikasi</div>
                    <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? notifications.slice(0, 5).map(notif => (
                             <li 
                                key={notif.id} 
                                onClick={() => handleNotificationClick(notif)}
                                className={`p-3 transition-colors hover:bg-gray-100 cursor-pointer ${notif.status === 'unread' ? 'bg-blue-50' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-grow">
                                        <p className="font-bold text-sm text-black leading-tight">{notif.title}</p>
                                        <p className="text-sm text-gray-700 leading-tight mt-1">{notif.message}</p>
                                        <p className="text-xs text-gray-400 mt-1.5">
                                             {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: id })}
                                        </p>
                                    </div>
                                    {notif.status === 'unread' && (
                                        <div className="flex-shrink-0 self-center">
                                          <span className="h-2.5 w-2.5 bg-blue-500 rounded-full block"></span>
                                        </div>
                                    )}
                                </div>
                             </li>
                        )) : (
                            <li className="p-4 text-center text-sm text-gray-500">Tidak ada notifikasi.</li>
                        )}
                    </ul>
                    <Link 
                        to="/notifications"
                        onClick={() => setIsOpen(false)}
                        className="block bg-gray-50 hover:bg-gray-100 text-center text-sm font-medium text-blue-600 py-2 border-t border-gray-200"
                    >
                        Lihat Semua Notifikasi
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CandidateNotificationBell;