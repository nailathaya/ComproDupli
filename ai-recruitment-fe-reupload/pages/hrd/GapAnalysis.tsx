
import React, { useEffect, useState } from 'react';
import { useHrdStore } from '../../store/useHrdStore';
import { GapAnalysisReport } from '../../types';
import { LightBulbIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';


const NextUpdate: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[70vh] text-center">
    <h1 className="text-3xl font-bold text-black mb-3">{title}</h1>
    <p className="text-gray-500 mb-4">
      Fitur ini akan tersedia pada update berikutnya 🚀
    </p>
  </div>
);

const GapAnalysis: React.FC = () => {
  return <NextUpdate title="Analisis Kesenjangan" />;
};

export default GapAnalysis;


// const GapAnalysis: React.FC = () => {
//     const { jobPositions, gapAnalysisReports, runGapAnalysis, loading, fetchDashboardStats } = useHrdStore();
//     const [selectedJob, setSelectedJob] = useState<string>('');

//     useEffect(() => {
//         if (jobPositions.length === 0) {
//             fetchDashboardStats();
//         }
//     }, [jobPositions, fetchDashboardStats]);

//     useEffect(() => {
//         if (jobPositions.length > 0 && !selectedJob) {
//             setSelectedJob(jobPositions[0].id);
//         }
//     }, [jobPositions, selectedJob]);
    
//     const handleRunAnalysis = () => {
//         if (selectedJob) {
//             runGapAnalysis(selectedJob);
//         }
//     };

//     const ReportCard: React.FC<{ report: GapAnalysisReport }> = ({ report }) => (
//         <div className="bg-white p-6 rounded-lg shadow-md">
//             <div className="flex items-center mb-4">
//                 <img src={report.candidate.user.avatarUrl} alt={report.candidate.user.name} className="h-12 w-12 rounded-full object-cover"/>
//                 <div className="ml-4">
//                     <h4 className="font-bold text-lg text-black">{report.candidate.user.name}</h4>
//                     <p className="text-sm text-gray-500">Skor Kesenjangan: <span className="font-semibold text-black">{report.gapScore}</span></p>
//                 </div>
//             </div>
//             <div>
//                 <h5 className="font-semibold text-black mb-2">Kompetensi yang Kurang</h5>
//                 <ul className="space-y-1">
//                     {report.missingCompetencies[0] === "Tidak ada kesenjangan kompetensi utama" ? (
//                         <li className="flex items-center text-sm text-black">
//                            <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500"/> {report.missingCompetencies[0]}
//                         </li>
//                     ) : (
//                         report.missingCompetencies.map((comp, i) => (
//                             <li key={i} className="flex items-center text-sm text-black">
//                                 <XCircleIcon className="h-4 w-4 mr-2 text-red-500" />
//                                 {comp}
//                             </li>
//                         ))
//                     )}
//                 </ul>
//             </div>
//              <div className="mt-4 pt-4 border-t border-gray-200">
//                 <h5 className="font-semibold text-black mb-2">Rekomendasi Pelatihan (AI)</h5>
//                 <ul className="space-y-1">
//                      {report.trainingRecommendations.length > 0 ? report.trainingRecommendations.map((rec, i) => (
//                         <li key={i} className="flex items-start text-sm text-black">
//                             <LightBulbIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-yellow-500" />
//                             {rec}
//                         </li>
//                     )) : (
//                          <li className="flex items-start text-sm text-black">
//                              <CheckCircleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
//                              Tidak ada rekomendasi pelatihan yang diperlukan saat ini.
//                         </li>
//                     )}
//                 </ul>
//             </div>
//         </div>
//     );


//     return (
//         <div>
//             <header className="mb-8">
//                 <h1 className="text-4xl font-bold text-black">Laporan Analisis Kesenjangan</h1>
//                 <p className="text-gray-500 mt-1">Identifikasi kesenjangan kompetensi kandidat dan dapatkan rekomendasi pelatihan dari AI.</p>
//             </header>
            
//             <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//                 <h2 className="text-xl font-bold text-black mb-4">Pilih Posisi</h2>
//                  <div className="flex flex-col sm:flex-row items-end gap-4">
//                     <div className="flex-grow w-full">
//                         <label htmlFor="job-position-gap" className="block text-sm font-medium text-black mb-1">Posisi Pekerjaan</label>
//                         <select
//                             id="job-position-gap"
//                             value={selectedJob}
//                             onChange={(e) => setSelectedJob(e.target.value)}
//                             className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
//                         >
//                             {jobPositions.map(job => (
//                                 <option key={job.id} value={job.id}>{job.title}</option>
//                             ))}
//                         </select>
//                     </div>
//                     <button
//                         onClick={handleRunAnalysis}
//                         disabled={loading || !selectedJob}
//                         className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
//                     >
//                         {loading ? 'Menganalisis...' : 'Jalankan Analisis'}
//                     </button>
//                 </div>
//             </div>

//              {loading ? (
//                 <div className="text-center p-10 bg-white rounded-lg shadow-md">
//                     <p className="font-semibold text-black">Menganalisis kesenjangan kompetensi...</p>
//                 </div>
//             ) : gapAnalysisReports.length > 0 && (
//                 <div>
//                      <h2 className="text-2xl font-bold text-black mb-6">Hasil Analisis</h2>
//                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {gapAnalysisReports.map(report => <ReportCard key={report.candidate.id} report={report} />)}
//                      </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default GapAnalysis;