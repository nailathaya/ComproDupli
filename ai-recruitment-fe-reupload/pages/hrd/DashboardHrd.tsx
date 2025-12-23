
import React, { useEffect } from 'react';
import { useHrdStore } from '../../store/useHrdStore';
import StatsCard from '../../components/hrd/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BriefcaseIcon, UsersIcon, ScaleIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

const competencyData = [
  { name: 'React', 'Paling Dicari': 45 },
  { name: 'Go', 'Paling Dicari': 42 },
  { name: 'TypeScript', 'Paling Dicari': 38 },
  { name: 'Node.js', 'Paling Dicari': 35 },
  { name: 'SQL', 'Paling Dicari': 33 },
  { name: 'AWS', 'Paling Dicari': 25 },
];

const NextUpdate: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[70vh] text-center">
    <h1 className="text-3xl font-bold text-black mb-3">{title}</h1>
    <p className="text-gray-500 mb-4">
      Fitur ini akan tersedia pada update berikutnya 🚀
    </p>

    <div className="text-blue-600 space-y-1">
      <p>• Lowongan Kerja</p>
      <p>• Daftar Kandidat</p>
      <p>• AI Matching</p>
    </div>
  </div>
);

const DashboardHrd: React.FC = () => {
  return <NextUpdate title="Dashboard HRD" />;
};

export default DashboardHrd;


// const DashboardHrd: React.FC = () => {
//     const { dashboardStats, fetchDashboardStats, loading } = useHrdStore();

//     useEffect(() => {
//         fetchDashboardStats();
//     }, [fetchDashboardStats]);
    
//     if (loading && dashboardStats.activeJobs === 0) {
//         return <div className="text-center text-black">Memuat data dasbor...</div>;
//     }

//     return (
//         <div>
//             <header className="mb-8">
//                 <h1 className="text-4xl font-bold text-black">Dashboard Analitik HRD</h1>
//                 <p className="text-gray-500 mt-1">Selamat datang! Berikut adalah ringkasan aktivitas perekrutan Anda.</p>
//             </header>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 <StatsCard icon={<BriefcaseIcon />} title="Lowongan Aktif" value={dashboardStats.activeJobs.toString()} />
//                 <StatsCard icon={<UsersIcon />} title="Total Pelamar" value={dashboardStats.totalApplicants.toString()} />
//                 <StatsCard icon={<ScaleIcon />} title="Rata-rata Fit Score" value={`${dashboardStats.avgFitScore}%`} />
//                 <StatsCard icon={<CheckBadgeIcon />} title="Kandidat Memenuhi" value={dashboardStats.qualifiedCandidates.toString()} />
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-md">
//                 <h2 className="text-xl font-bold text-black mb-4">Kompetensi yang Paling Dicari</h2>
//                 <div style={{ width: '100%', height: 400 }}>
//                     <ResponsiveContainer>
//                         <BarChart data={competencyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
//                             <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                             <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#000' }} />
//                             <YAxis tick={{ fontSize: 12, fill: '#000' }} />
//                             <Tooltip cursor={{ fill: 'rgba(239, 246, 255, 0.7)' }} />
//                             <Legend wrapperStyle={{ fontSize: '14px', color: '#000' }} />
//                             <Bar dataKey="Paling Dicari" fill="#2563eb" barSize={30} radius={[4, 4, 0, 0]} />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DashboardHrd;