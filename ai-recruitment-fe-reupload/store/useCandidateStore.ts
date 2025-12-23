import { create } from 'zustand';
import { Notification } from '../types';

type NavigateFunction = (to: string, options?: any) => void;

const unsortedNotifications: Notification[] = [
    {
        id: "notif-2",
        title: "Update Status Lamaran",
        message: "Anda lolos ke tahap Interview User untuk posisi Senior Frontend Developer.",
        status: "unread",
        category: "application-stage",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        target_page: "/history",
        target_params: { highlight: "application-app_hist_1", stage: "Interview User" }
    },
    {
        id: "notif-1",
        title: "Lamaran Dilihat",
        message: "Lamaran Anda untuk posisi UI/UX Designer telah dilihat oleh HRD.",
        status: "unread",
        category: "application-viewed",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        target_page: "/history",
        target_params: { highlight: "application-app_hist_3" }
    },
    {
        id: 'notif-4',
        title: 'Update Status Lamaran',
        message: 'Maaf, Anda belum lolos tahap Interview HRD untuk posisi "Frontend Developer".',
        status: 'read',
        category: 'application-stage',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), // 1 day ago
        target_page: '/history',
        target_params: { highlight: 'application-app_hist_2', stage: 'Interview HR' },
    },
    {
        id: "notif-3",
        title: "Rekomendasi Lowongan",
        message: "Ada 2 lowongan baru yang cocok dengan keahlian Anda.",
        status: "read",
        category: "job-recommendation",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        target_page: "/jobs",
        target_params: {}
    },
    {
        id: 'notif-5',
        title: 'Penawaran Kerja',
        message: 'Selamat! Anda menerima Penawaran Kerja untuk posisi "Backend Engineer".',
        status: 'read',
        category: 'application-stage-update',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        target_page: '/history',
        target_params: { highlight: 'application-app_hist_4', stage: 'Penawaran' }
    }
];

const MOCK_CANDIDATE_NOTIFICATIONS = unsortedNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());


interface CandidateState {
    notifications: Notification[];
    markNotificationAsRead: (id: string) => void;
    navigateToTarget: (notification: Notification, navigate: NavigateFunction) => void;
}

export const useCandidateStore = create<CandidateState>((set, get) => ({
    notifications: MOCK_CANDIDATE_NOTIFICATIONS,

    markNotificationAsRead: (id: string) => {
        set((state) => ({
            notifications: state.notifications.map(notif =>
                notif.id === id ? { ...notif, status: 'read' } : notif
            ),
        }));
    },
    
    navigateToTarget: (notification: Notification, navigate: NavigateFunction) => {
        get().markNotificationAsRead(notification.id);
        
        const params = new URLSearchParams();
        if (notification.target_params) {
            Object.entries(notification.target_params).forEach(([key, value]) => {
                if (value) {
                    params.append(key, value.toString());
                }
            });
        }

        const queryString = params.toString();
        const targetUrl = `${notification.target_page}${queryString ? `?${queryString}` : ''}`;
        
        navigate(targetUrl);
    }
}));