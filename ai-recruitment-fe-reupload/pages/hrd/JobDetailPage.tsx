import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHrdStore } from '../../store/useHrdStore';
import { JobDetail, JobPosition } from '../../types';
import { ChevronLeftIcon, PencilIcon, BriefcaseIcon, MapPinIcon, CalendarIcon, AcademicCapIcon, UserGroupIcon, BuildingOffice2Icon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import {format} from 'date-fns/format';
import {id as idLocale} from 'date-fns/locale/id';

const JobDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getJobById } = useHrdStore();
    const [job, setJob] = useState<JobDetail | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const foundJob = getJobById(id);
            setJob(foundJob);
        }
        setLoading(false);
    }, [id, getJobById]);

    if (loading) return <div className="text-center p-10">Memuat detail lowongan...</div>;
    if (!job) return <div className="text-center p-10 text-red-500">Lowongan tidak ditemukan.</div>;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Published':
            case 'Aktif':
                return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">Published</span>;
            case 'Draft':
                return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">Draft</span>;
            case 'Closed':
            case 'Ditutup':
                return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">Closed</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <button onClick={() => navigate('/hrd/jobs')} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6">
                <ChevronLeftIcon className="h-4 w-4" />
                Kembali ke Manajemen Lowongan
            </button>

            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-black">{job.title}</h1>
                        {getStatusBadge(job.status || 'Draft')}
                    </div>
                    <p className="text-gray-500 mt-2">{job.department} · {job.location} · {job.employmentType}</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => navigate(`/hrd/jobs/${job.id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <PencilIcon className="h-4 w-4" />
                        Edit
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Deskripsi */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-black mb-4">Deskripsi Pekerjaan</h2>
                        <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                            {job.description}
                        </div>
                    </div>

                    {/* Persyaratan */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-black mb-6">Persyaratan Kandidat</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex items-start gap-3">
                                <AcademicCapIcon className="h-6 w-6 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">Pendidikan Minimal</p>
                                    <p className="font-medium text-black">{job.requirements?.education || '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <BriefcaseIcon className="h-6 w-6 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">Pengalaman Kerja</p>
                                    <p className="font-medium text-black">{job.requirements?.experience_years ? `${job.requirements.experience_years} Tahun` : 'Fresh Graduate'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm font-semibold text-gray-500 mb-3">Keahlian Wajib</p>
                            <div className="flex flex-wrap gap-2">
                                {job.requirements?.skills.map((skill, idx) => (
                                    <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                         {job.requirements?.certifications && job.requirements.certifications.length > 0 && (
                            <div>
                                <p className="text-sm font-semibold text-gray-500 mb-3">Sertifikasi</p>
                                <ul className="space-y-2">
                                    {job.requirements.certifications.map((cert, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                            <CheckBadgeIcon className="h-5 w-5 text-green-500" />
                                            {cert}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg text-black mb-4">Informasi Posisi</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                                <BuildingOffice2Icon className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Departemen</p>
                                    <p className="text-sm font-semibold text-black">{job.department}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                                <MapPinIcon className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Lokasi Kerja</p>
                                    <p className="text-sm font-semibold text-black">{job.location}</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                                <UserGroupIcon className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Jumlah Posisi</p>
                                    <p className="text-sm font-semibold text-black">{job.openPositions} Orang</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <CalendarIcon className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Batas Lamaran</p>
                                    <p className="text-sm font-semibold text-black">{job.closingDate ? format(new Date(job.closingDate), 'dd MMMM yyyy', {locale: idLocale}) : '-'}</p>
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