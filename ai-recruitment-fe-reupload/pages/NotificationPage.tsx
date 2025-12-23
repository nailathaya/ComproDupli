import React from 'react';
import { useCandidateStore } from '../store/useCandidateStore';
import { Notification } from '../types';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import id from 'date-fns/locale/id';
import { useNavigate } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/outline';

const NotificationPage: React.FC = () => {
    const { notifications, navigateToTarget } = useCandidateStore();
    const navigate = useNavigate();

    const handleNotificationClick = (notification: Notification) => {
        navigateToTarget(notification, navigate);
    };
    
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-black">Pusat Notifikasi</h1>
                <p className="text-gray-500 mt-1">Semua pembaruan dan pemberitahuan penting untuk Anda.</p>
            </header>
            
            <div className="bg-white rounded-lg shadow-sm max-w-4xl mx-auto">
                <ul className="divide-y divide-gray-200">
                    {notifications.length > 0 ? (
                        notifications.map(notif => (
                            <li 
                                key={notif.id} 
                                className={`p-4 flex items-start gap-4 transition-colors cursor-pointer ${notif.status === 'unread' ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white hover:bg-gray-50'}`}
                                onClick={() => handleNotificationClick(notif)}
                            >
                                <div className="flex-shrink-0 pt-1">
                                    <BellIcon className="h-5 w-5 text-gray-500"/>
                                </div>
                                <div className="flex-grow">
                                    <p className="font-bold text-sm text-gray-800">{notif.title}</p>
                                    <p className="text-sm text-gray-700 mt-1">{notif.message}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: id })}
                                    </p>
                                </div>
                                {notif.status === 'unread' && (
                                    <div className="flex-shrink-0 self-center">
                                        <span className="h-2.5 w-2.5 bg-blue-500 rounded-full block"></span>
                                    </div>
                                )}
                            </li>
                        ))
                    ) : (
                        <li className="p-6 text-center text-gray-500">
                            Tidak ada notifikasi baru.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default NotificationPage;