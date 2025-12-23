
import React, { useEffect, useState } from 'react';
import { useHrdStore } from '../../store/useHrdStore';
import RankingList from '../../components/hrd/RankingList';
import { MatchResult } from '../../types';


const NextUpdate: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[70vh] text-center">
    <h1 className="text-3xl font-bold text-black mb-3">{title}</h1>
    <p className="text-gray-500 mb-4">
      Fitur ini akan tersedia pada update berikutnya 🚀
    </p>
  </div>
);

const CandidateRanking: React.FC = () => {
  return <NextUpdate title="Peringkat Kandidat" />;
};

export default CandidateRanking;


// const CandidateRanking: React.FC = () => {
//     const { jobPositions, matchResults, fetchRanking, fetchDashboardStats, loading } = useHrdStore();
//     const [selectedJob, setSelectedJob] = useState<string>('');
//     const [initialLoad, setInitialLoad] = useState(true);

//     useEffect(() => {
//         if (jobPositions.length === 0) {
//             fetchDashboardStats();
//         }
//     }, [jobPositions, fetchDashboardStats]);

//     useEffect(() => {
//         if (jobPositions.length > 0 && !selectedJob) {
//             const defaultJobId = jobPositions[0].id;
//             setSelectedJob(defaultJobId);
//             fetchRanking(defaultJobId).then(() => setInitialLoad(false));
//         }
//     }, [jobPositions, selectedJob, fetchRanking]);
    
//     const handleJobChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const jobId = e.target.value;
//         setSelectedJob(jobId);
//         fetchRanking(jobId);
//     };

//     return (
//         <div>
//             <header className="mb-8">
//                 <h1 className="text-4xl font-bold text-black">Rekomendasi & Peringkat Kandidat</h1>
//                 <p className="text-gray-500 mt-1">Tinjau kandidat teratas yang direkomendasikan oleh AI untuk setiap posisi.</p>
//             </header>

//             <div className="mb-6 max-w-md">
//                  <label htmlFor="job-select" className="block text-sm font-medium text-black mb-1">
//                     Tampilkan Peringkat untuk Posisi
//                  </label>
//                  <select 
//                     id="job-select"
//                     value={selectedJob}
//                     onChange={handleJobChange}
//                     className="w-full bg-white border border-gray-300 text-black rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     disabled={jobPositions.length === 0}
//                  >
//                     {jobPositions.map(job => (
//                         <option key={job.id} value={job.id}>{job.title}</option>
//                     ))}
//                  </select>
//             </div>
            
//             {loading || initialLoad ? (
//                  <div className="text-center p-10 bg-white rounded-lg shadow-md">
//                     <p className="font-semibold text-black">Memuat peringkat kandidat...</p>
//                 </div>
//             ) : matchResults.length > 0 ? (
//                 <RankingList results={matchResults} />
//             ) : (
//                  <div className="bg-white p-10 text-center rounded-lg shadow-md">
//                     <h3 className="text-xl font-semibold text-black">Belum ada hasil peringkat</h3>
//                     <p className="text-gray-500 mt-2">Jalankan AI Matching Engine terlebih dahulu untuk melihat rekomendasi.</p>
//                 </div>
//             )}

//         </div>
//     );
// };

// export default CandidateRanking;