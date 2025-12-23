

import React from 'react';
import { Notification } from '../../types';
import { XMarkIcon, CheckCircleIcon, InformationCircleIcon, ExclamationTriangleIcon, BellIcon } from '@heroicons/react/24/outline';
// FIX: Changed date-fns imports to use sub-paths to resolve module export errors.
import format from 'date-fns/format';
import id from 'date-fns/locale/id';

interface NotificationDetailModalProps {
    notification: Notification | null;
    onClose: () => void;
}

const getIcon = (type: 'success' | 'info' | 'warning') => {
    switch (type) {
        case 'success':
            return <CheckCircleIcon className="h-8 w-8 text-green-500" />;
        case 'info':
            return <InformationCircleIcon className="h-8 w-8 text-blue-500" />;
        case 'warning':
            return <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />;
        default:
            return <BellIcon className="h-8 w-8 text-gray-500" />;
    }
};

const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({ notification, onClose }) => {
    if (!notification) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="notification-detail-title">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 id="notification-detail-title" className="text-xl font-bold text-black">Detail Notifikasi</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-black" aria-label="Tutup">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        {/* FIX: Added non-null assertion as 'type' is optional. */}
                        <div className="flex-shrink-0 mt-1">{getIcon(notification.type!)}</div>
                        <div className="flex-grow">
                            <p className="text-base text-gray-800">{notification.message}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                {/* FIX: Changed 'timestamp' to 'created_at'. */}
                                {format(new Date(notification.created_at), "EEEE, dd MMMM yyyy 'pukul' HH:mm", { locale: id })}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-100">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationDetailModal;