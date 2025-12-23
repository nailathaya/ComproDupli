
import React, { useState } from 'react';
import { MatchResult } from '../../types';
import CandidateCard from './CandidateCard';
import { XMarkIcon, CheckCircleIcon, XCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';


const RankingList: React.FC<{ results: MatchResult[] }> = ({ results }) => {
    const [selectedCandidate, setSelectedCandidate] = useState<MatchResult | null>(null);
    
    const DetailModal: React.FC<{ result: MatchResult, onClose: () => void }> = ({ result, onClose }) => {
         const { candidate, fitScore, matchingAspects, aiReason } = result;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-black">Detail Rekomendasi Kandidat</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-black">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto">
                        <div className="flex items-start gap-4 mb-6">
                            <img src={candidate.user.avatarUrl} alt={candidate.user.name} className="h-20 w-20 rounded-full object-cover border-2 border-gray-200" />
                            <div>
                                <h3 className="text-2xl font-extrabold text-black">{candidate.user.name}</h3>
                                <p className="text-black">{candidate.workExperience[0]?.jobTitle} di {candidate.workExperience[0]?.companyName}</p>
                                <p className="text-sm text-gray-500 mt-1">{candidate.user.location}</p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-sm text-black">Fit Score</p>
                                <p className="text-3xl font-bold text-black">{fitScore}%</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 text-black rounded-lg p-4 mb-6 flex items-start gap-3">
                            <SparklesIcon className="h-6 w-6 text-black flex-shrink-0 mt-1"/>
                            <div>
                                <h4 className="font-bold text-black">Alasan Kandidat Direkomendasikan</h4>
                                <p className="text-sm text-black">{aiReason}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-black mb-2">Aspek yang Memenuhi Kriteria</h4>
                                <ul className="space-y-1.5">
                                    {matchingAspects.meets.map((aspect, i) => (
                                        <li key={i} className="flex items-center text-sm text-black">
                                            <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" /> {aspect}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold text-black mb-2">Aspek yang Belum Memenuhi</h4>
                                <ul className="space-y-1.5">
                                    {matchingAspects.lacks.map((aspect, i) => (
                                        <li key={i} className="flex items-center text-sm text-black">
                                            <XCircleIcon className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" /> {aspect}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                     <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-100">Tutup</button>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Lanjutkan Proses</button>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="space-y-4">
            {results.map((result, index) => (
                <CandidateCard 
                    key={result.candidate.id} 
                    result={result} 
                    rank={index + 1}
                    onViewDetail={setSelectedCandidate}
                />
            ))}
            {selectedCandidate && <DetailModal result={selectedCandidate} onClose={() => setSelectedCandidate(null)} />}
        </div>
    );
};

export default RankingList;