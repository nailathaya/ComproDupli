
import React from 'react';

interface StatsCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value }) => {
    return (
        <div className="bg-white p-5 rounded-lg shadow-md flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
                <div className="h-6 w-6 text-blue-600">{icon}</div>
            </div>
            <div>
                <p className="text-sm text-black font-medium">{title}</p>
                <p className="text-2xl font-bold text-black">{value}</p>
            </div>
        </div>
    );
};

export default StatsCard;