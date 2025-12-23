import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUiStore } from '../../store/useUiStore';
import {
    ChartBarIcon,
    CpuChipIcon,
    TrophyIcon,
    PresentationChartBarIcon,
    ChevronDoubleLeftIcon,
    UsersIcon,
    BriefcaseIcon,
} from '@heroicons/react/24/outline';

const navItems = [
    { to: '/hrd/dashboard', icon: ChartBarIcon, label: 'Dashboard' },
    { to: '/hrd/jobs', icon: BriefcaseIcon, label: 'Lowongan Kerja' },
    { to: '/hrd/kandidat', icon: UsersIcon, label: 'Manajemen Kandidat' },
    { to: '/hrd/matching', icon: CpuChipIcon, label: 'AI Matching' },
    // { to: '/hrd/ranking', icon: TrophyIcon, label: 'Peringkat Kandidat' },
    // { to: '/hrd/gap-analysis', icon: PresentationChartBarIcon, label: 'Analisis Kesenjangan' },
];

const Sidebar: React.FC = () => {
    const { isSidebarOpen, setSidebarOpen, isSidebarCollapsed, toggleSidebarCollapse } = useUiStore();
    const location = useLocation();

    // Close mobile sidebar on navigation
    useEffect(() => {
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    }, [location.pathname, setSidebarOpen]);

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center px-4 py-3 text-sm rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-gray-100 text-black font-bold'
                : 'text-black hover:bg-gray-100'
        } ${isSidebarCollapsed ? 'justify-center' : ''}`;

    const sidebarContent = (
        <div className="flex flex-col h-full">
            <div className={`flex items-center h-16 px-4 border-b border-gray-200 shrink-0 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                 {!isSidebarCollapsed && (
                    <span className="text-xl font-bold text-black">AI Recruitment</span>
                 )}
                <button
                    onClick={toggleSidebarCollapse}
                    className="p-2 hidden md:block text-black rounded-lg hover:bg-gray-100"
                    aria-label={isSidebarCollapsed ? 'Perbesar sidebar' : 'Perkecil sidebar'}
                >
                    <ChevronDoubleLeftIcon className={`h-6 w-6 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
                </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-2">
                {navItems.map(item => (
                    <NavLink key={item.to} to={item.to} className={navLinkClass} title={isSidebarCollapsed ? item.label : undefined}>
                        <item.icon className={`h-6 w-6 shrink-0 ${!isSidebarCollapsed ? 'mr-3' : ''}`} />
                        {!isSidebarCollapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>
        </div>
    );

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setSidebarOpen(false)}
            />
            {/* Mobile Sidebar Panel */}
            <aside
                className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-40 transform transition-transform md:hidden ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                 <div className="flex flex-col h-full">
                    <nav className="flex-1 px-3 py-4 space-y-2">
                        {navItems.map(item => (
                            <NavLink key={item.to} to={item.to} className={navLinkClass}>
                                <item.icon className="h-6 w-6 mr-3" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Desktop Sidebar */}
            <aside className={`hidden md:flex flex-col flex-shrink-0 bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
                {sidebarContent}
            </aside>
        </>
    );
};

export default Sidebar;