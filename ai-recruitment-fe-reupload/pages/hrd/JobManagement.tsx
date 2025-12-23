// import React, { useEffect } from 'react';
// import { useHrdStore } from '../../store/useHrdStore';
// import { useNavigate } from 'react-router-dom';
// import { PlusIcon, PencilIcon, BriefcaseIcon, MapPinIcon, CalendarIcon, EyeIcon } from '@heroicons/react/24/outline';
// import format from 'date-fns/format';
// import id from 'date-fns/locale/id';

// const JobManagement: React.FC = () => {
//     const { jobPositions, fetchDashboardStats } = useHrdStore();
//     const navigate = useNavigate();

//     useEffect(() => {
//         // Ensure data is loaded
//         if (jobPositions.length === 0) {
//             fetchDashboardStats();
//         }
//     }, [jobPositions, fetchDashboardStats]);

//     const getStatusBadge = (status: string) => {
//         switch (status) {
//             case 'Published':
//             case 'Aktif':
//                 return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Published</span>;
//             case 'Draft':
//                 return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Draft</span>;
//             case 'Closed':
//             case 'Ditutup':
//                 return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Closed</span>;
//             default:
//                 return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
//         }
//     };

//     return (
//         <div>
//             <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <div>
//                     <h1 className="text-4xl font-bold text-black">Manajemen Lowongan</h1>
//                     <p className="text-gray-500 mt-1">Buat, kelola, dan pantau lowongan pekerjaan Anda.</p>
//                 </div>
//                 <button
//                     onClick={() => navigate('/hrd/jobs/new')}
//                     className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
//                 >
//                     <PlusIcon className="h-5 w-5" />
//                     Buat Lowongan Baru
//                 </button>
//             </header>

//             <div className="bg-white shadow-sm rounded-xl overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Posisi</th>
//                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departemen</th>
//                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
//                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penutupan</th>
//                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi</th>
//                                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {jobPositions.map((job) => (
//                                 <tr key={job.id} className="hover:bg-gray-50 transition-colors">
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="flex items-center">
//                                             <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                                                 <BriefcaseIcon className="h-6 w-6 text-blue-600" />
//                                             </div>
//                                             <div className="ml-4">
//                                                 <div className="text-sm font-bold text-gray-900">{job.title}</div>
//                                                 <div className="text-xs text-gray-500">{job.employmentType}</div>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                                         {job.department || '-'}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="flex items-center text-sm text-gray-700">
//                                             <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
//                                             {job.location}
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         {getStatusBadge(job.status || 'Draft')}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                                         {job.closingDate ? format(new Date(job.closingDate), 'dd MMM yyyy', {locale: id}) : '-'}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
//                                         {job.openPositions || 0}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                         <button 
//                                             onClick={() => navigate(`/hrd/jobs/${job.id}`)}
//                                             className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg mr-2"
//                                             title="Lihat Detail"
//                                         >
//                                             <EyeIcon className="h-5 w-5" />
//                                         </button>
//                                         <button 
//                                             onClick={() => navigate(`/hrd/jobs/${job.id}/edit`)}
//                                             className="text-gray-600 hover:text-gray-900 bg-gray-50 p-2 rounded-lg"
//                                             title="Edit Lowongan"
//                                         >
//                                             <PencilIcon className="h-5 w-5" />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                             {jobPositions.length === 0 && (
//                                 <tr>
//                                     <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
//                                         Belum ada lowongan yang dibuat. Klik tombol "Buat Lowongan Baru" untuk memulai.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default JobManagement;

import React, { useEffect } from 'react';
import { useHrdStore } from '../../store/useHrdStore';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  BriefcaseIcon,
  MapPinIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const JobManagement: React.FC = () => {
  const { jobPostings, fetchJobPostings, loading } = useHrdStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobPostings(); // 🔥 PENTING
  }, [fetchJobPostings]);

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Manajemen Lowongan</h1>
          <p className="text-gray-500">
            Buat dan kelola lowongan pekerjaan
          </p>
        </div>
        <button
          onClick={() => navigate('/hrd/jobs/new')}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg"
        >
          <PlusIcon className="h-5 w-5" />
          Buat Lowongan Baru
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Judul</th>
              <th className="px-6 py-3">Lokasi</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Penutupan</th>
              <th className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {jobPostings.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold flex gap-3 items-center">
                  <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                  {job.title}
                </td>
                <td className="px-6 py-4">
                  <MapPinIcon className="h-4 w-4 inline mr-1" />
                  {job.location}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {job.closing_date
                    ? format(new Date(job.closing_date), 'dd MMM yyyy', {
                        locale: idLocale,
                      })
                    : '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => navigate(`/hrd/jobs/${job.id}`)}
                    className="mr-2 text-blue-600"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => navigate(`/hrd/jobs/${job.id}/edit`)}
                    className="text-gray-600"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {jobPostings.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  Belum ada lowongan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobManagement;
