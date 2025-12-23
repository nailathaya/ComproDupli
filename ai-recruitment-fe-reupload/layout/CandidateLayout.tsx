import React from 'react';
import { Outlet } from 'react-router-dom';
import CandidateSidebar from '../components/candidate/CandidateSidebar';

const CandidateLayout: React.FC = () => {
    return (
        <div className="flex h-full bg-gray-50">
            <CandidateSidebar />
            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default CandidateLayout;