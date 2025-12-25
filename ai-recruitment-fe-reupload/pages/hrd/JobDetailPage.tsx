// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useHrdStore } from '../../store/useHrdStore';
// import { JobDetail, JobPosition } from '../../types';
// import { ChevronLeftIcon, PencilIcon, BriefcaseIcon, MapPinIcon, CalendarIcon, AcademicCapIcon, UserGroupIcon, BuildingOffice2Icon, CheckBadgeIcon } from '@heroicons/react/24/outline';
// import {format} from 'date-fns/format';
// import {id as idLocale} from 'date-fns/locale/id';

// const JobDetailPage: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();
//     const { getJobById } = useHrdStore();
//     const [job, setJob] = useState<JobDetail | undefined>(undefined);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (id) {
//             const foundJob = getJobById(id);
//             setJob(foundJob);
//         }
//         setLoading(false);
//     }, [id, getJobById]);

//     if (loading) return <div className="text-center p-10">Memuat detail lowongan...</div>;
//     if (!job) return <div className="text-center p-10 text-red-500">Lowongan tidak ditemukan.</div>;

//     const getStatusBadge = (status: string) => {
//         switch (status) {
//             case 'Published':
//             case 'Aktif':
//                 return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">Published</span>;
//             case 'Draft':
//                 return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">Draft</span>;
//             case 'Closed':
//             case 'Ditutup':
//                 return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">Closed</span>;
//             default:
//                 return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">{status}</span>;
//         }
//     };

//     return (
//         <div className="max-w-5xl mx-auto pb-20">
//             <button onClick={() => navigate('/hrd/jobs')} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6">
//                 <ChevronLeftIcon className="h-4 w-4" />
//                 Kembali ke Manajemen Lowongan
//             </button>

//             <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                 <div>
//                     <div className="flex items-center gap-3">
//                         <h1 className="text-3xl font-bold text-black">{job.title}</h1>
//                         {getStatusBadge(job.status || 'Draft')}
//                     </div>
//                     <p className="text-gray-500 mt-2">{job.department} · {job.location} · {job.employmentType}</p>
//                 </div>
//                 <div className="flex gap-3">
//                     <button 
//                         onClick={() => navigate(`/hrd/jobs/${job.id}/edit`)}
//                         className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                         <PencilIcon className="h-4 w-4" />
//                         Edit
//                     </button>
//                 </div>
//             </header>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 {/* Main Content */}
//                 <div className="lg:col-span-2 space-y-8">
//                     {/* Deskripsi */}
//                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//                         <h2 className="text-xl font-bold text-black mb-4">Deskripsi Pekerjaan</h2>
//                         <div className="prose max-w-none text-gray-700 whitespace-pre-line">
//                             {job.description}
//                         </div>
//                     </div>

//                     {/* Persyaratan */}
//                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//                         <h2 className="text-xl font-bold text-black mb-6">Persyaratan Kandidat</h2>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                             <div className="flex items-start gap-3">
//                                 <AcademicCapIcon className="h-6 w-6 text-blue-600 mt-0.5" />
//                                 <div>
//                                     <p className="text-sm font-semibold text-gray-500">Pendidikan Minimal</p>
//                                     <p className="font-medium text-black">{job.requirements?.education || '-'}</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-start gap-3">
//                                 <BriefcaseIcon className="h-6 w-6 text-blue-600 mt-0.5" />
//                                 <div>
//                                     <p className="text-sm font-semibold text-gray-500">Pengalaman Kerja</p>
//                                     <p className="font-medium text-black">{job.requirements?.experience_years ? `${job.requirements.experience_years} Tahun` : 'Fresh Graduate'}</p>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {/* Keahlian Wajib */}
//                         <div>
//                             <p className="text-sm font-semibold text-gray-500 mb-3">Keahlian Wajib</p>
//                             <div className="flex flex-wrap gap-2">
//                             {job.requirements?.skills?.length > 0 ? (
//                                 job.requirements.skills.map((skill, idx) => (
//                                 <span
//                                     key={idx}
//                                     className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
//                                 >
//                                     {skill}
//                                 </span>
//                                 ))
//                             ) : (
//                                 <p className="text-sm text-gray-400">Tidak ditentukan</p>
//                             )}
//                             </div>
//                         </div>

//                         {/* Sertifikasi (Opsional) */}
//                         <div>
//                             <p className="text-sm font-semibold text-gray-500 mb-3">
//                             Sertifikasi <span className="text-gray-400 font-normal">(Opsional)</span>
//                             </p>

//                             {job.requirements?.certifications?.length > 0 ? (
//                             <ul className="space-y-2">
//                                 {job.requirements.certifications.map((cert, idx) => (
//                                 <li
//                                     key={idx}
//                                     className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"
//                                 >
//                                     <CheckBadgeIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
//                                     <span className="text-sm">{cert}</span>
//                                 </li>
//                                 ))}
//                             </ul>
//                             ) : (
//                             <p className="text-sm text-gray-400">Tidak ada sertifikasi khusus</p>
//                             )}
//                         </div>
//                         </div>

//                     </div>
//                 </div>

//                 {/* Sidebar Info */}
//                 <div className="space-y-6">
//                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//                         <h3 className="font-bold text-lg text-black mb-4">Informasi Posisi</h3>
//                         <div className="space-y-4">
//                             <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
//                                 <BuildingOffice2Icon className="h-5 w-5 text-gray-400" />
//                                 <div>
//                                     <p className="text-xs text-gray-500">Departemen</p>
//                                     <p className="text-sm font-semibold text-black">{job.department}</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
//                                 <MapPinIcon className="h-5 w-5 text-gray-400" />
//                                 <div>
//                                     <p className="text-xs text-gray-500">Lokasi Kerja</p>
//                                     <p className="text-sm font-semibold text-black">{job.location}</p>
//                                 </div>
//                             </div>
//                              <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
//                                 <UserGroupIcon className="h-5 w-5 text-gray-400" />
//                                 <div>
//                                     <p className="text-xs text-gray-500">Jumlah Posisi</p>
//                                     <p className="text-sm font-semibold text-black">{job.openPositions} Orang</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-3">
//                                 <CalendarIcon className="h-5 w-5 text-gray-400" />
//                                 <div>
//                                     <p className="text-xs text-gray-500">Batas Lamaran</p>
//                                     <p className="text-sm font-semibold text-black">{job.closingDate ? format(new Date(job.closingDate), 'dd MMMM yyyy', {locale: idLocale}) : '-'}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default JobDetailPage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JobDetail } from '../../types';
import {
  ChevronLeftIcon,
  PencilIcon,
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const API_BASE_URL = 'http://127.0.0.1:8000';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 FETCH DARI ENDPOINT BARU
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/job-postings/${id}`);
        if (!res.ok) throw new Error('Failed to fetch job');

        const data: JobDetail = await res.json();
        setJob(data);
      } catch (err) {
        console.error(err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id]);

  if (loading) {
    return <div className="text-center p-10">Memuat detail lowongan...</div>;
  }

  if (!job) {
    return (
      <div className="text-center p-10 text-red-500">
        Lowongan tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <button
        onClick={() => navigate('/hrd/jobs')}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Kembali ke Manajemen Lowongan
      </button>

      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-1">
          Detail Lowongan
        </h1>
        <p className="text-gray-500">
          {job.department} · {job.location}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          {/* DESKRIPSI */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Deskripsi Pekerjaan</h2>
            <p className="whitespace-pre-line text-gray-700">
              {job.description}
            </p>
          </div>

          {/* PERSYARATAN */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-bold mb-6">Persyaratan Kandidat</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex gap-3">
                <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Pendidikan Minimal</p>
                  <p className="font-semibold">{job.min_education}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Pengalaman Kerja</p>
                  <p className="font-semibold">
                    {job.min_experience_years ?? 0} Tahun
                  </p>
                </div>
              </div>
            </div>

            {/* SKILLS & CERTIFICATIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SKILLS */}
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-3">
                  Keahlian Wajib
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.length > 0 ? (
                    job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">
                      Tidak ditentukan
                    </p>
                  )}
                </div>
              </div>

              {/* CERTIFICATIONS */}
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-3">
                  Sertifikasi{' '}
                  <span className="font-normal text-gray-400">
                    (Opsional)
                  </span>
                </p>

                {job.certifications.length > 0 ? (
                  <ul className="space-y-2">
                    {job.certifications.map((cert, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border"
                      >
                        <CheckBadgeIcon className="h-5 w-5 text-green-500" />
                        <span className="text-sm">{cert}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">
                    Tidak ada sertifikasi khusus
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-bold text-lg mb-4">Informasi Posisi</h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <BuildingOffice2Icon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Departemen</p>
                  <p className="font-semibold">{job.department}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Lokasi</p>
                  <p className="font-semibold">{job.location}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <UserGroupIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Jumlah Posisi</p>
                  <p className="font-semibold">
                    {job.required_candidates} Orang
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Batas Lamaran</p>
                  <p className="font-semibold">
                    {job.closing_date
                      ? format(
                          new Date(job.closing_date),
                          'dd MMMM yyyy',
                          { locale: idLocale }
                        )
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
