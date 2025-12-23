import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/hrd/Sidebar';

const HrdLayout: React.FC = () => {
    return (
        <div className="flex h-full bg-gray-50">
            <Sidebar />
            <div className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default HrdLayout;