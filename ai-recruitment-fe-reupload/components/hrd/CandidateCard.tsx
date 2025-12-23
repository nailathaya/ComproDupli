
import React from 'react';
import { MatchResult } from '../../types';
import { ChartPieIcon } from '@heroicons/react/24/solid';

interface CandidateCardProps {
    result: MatchResult;
    rank: number;
    onViewDetail: (result: MatchResult) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ result, rank, onViewDetail }) => {
    const { candidate, fitScore } = result;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-4 flex-grow">
                 <span className="text-xl font-bold text-gray-400 w-8 text-center">{rank}</span>
                 <img src={candidate.user.avatarUrl} alt={candidate.user.name} className="h-16 w-16 rounded-full object-cover"/>
                 <div className="flex-grow">
                     <h3 className="font-bold text-lg text-black">{candidate.user.name}</h3>
                     <p className="text-sm text-black">{candidate.workExperience[0]?.jobTitle || 'N/A'}</p>
                     <p className="text-xs text-gray-400">{candidate.user.location}</p>
                 </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-200">
                    <ChartPieIcon className="h-6 w-6 text-black" />
                    <div>
                        <p className="text-xs text-black">Fit Score</p>
                        <p className="font-bold text-lg text-black">{fitScore}%</p>
                    </div>
                </div>
                 <button 
                    onClick={() => onViewDetail(result)}
                    className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Lihat Detail
                 </button>
            </div>
        </div>
    );
};

export default CandidateCard;