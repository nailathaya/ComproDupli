import React from 'react';
import { useHrdStore } from '../../store/useHrdStore';
import { Notification } from '../../types';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import id from 'date-fns/locale/id';
import { useNavigate } from 'react-router-dom';

const NotificationCenter: React.FC = () => {
    const { notifications, markAsRead, markAllAsRead } = useHrdStore();
    const navigate = useNavigate();

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id);
        navigate(notification.target_page);
    };

    const hasUnread = notifications.some(n => n.status === 'unread');
    
    return (
        <div>
            <header className="mb-8 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-black">Pusat Notifikasi</h1>
                    <p className="text-gray-500 mt-1">Semua pembaruan dan peringatan penting Anda ada di sini.</p>
                </div>
                <button
                    onClick={markAllAsRead}
                    disabled={!hasUnread}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    Tandai semua telah dibaca
                </button>
            </header>
            
            <div className="bg-white rounded-lg shadow-sm">
                <ul className="divide-y divide-gray-200">
                    {notifications.length > 0 ? (
                        notifications.map(notif => (
                            <li 
                                key={notif.id} 
                                className={`p-4 flex items-start gap-4 transition-colors cursor-pointer ${notif.status === 'unread' ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white hover:bg-gray-50'}`}
                                onClick={() => handleNotificationClick(notif)}
                                style={{ pointerEvents: 'auto' }}
                            >
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
                            Tidak ada notifikasi.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default NotificationCenter;