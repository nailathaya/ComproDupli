import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

import { CandidateDetail, Document as DocType, Activity, WorkExperience, Education, ApplicationHistory } from '../../types';

import {
  EnvelopeIcon,
  MapPinIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  ChevronLeftIcon,
  AcademicCapIcon,
  BanknotesIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

import { getCandidateById } from '../../services/api';

const getYearSafe = (dateStr?: string) => {
  if (!dateStr) return 'Sekarang';
  return format(new Date(dateStr), 'yyyy');
};


// --- HELPER FUNCTIONS ---

const formatDateRange = (startDateStr: string, endDateStr: string) => {
    if (!startDateStr) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    const startDate = new Date(startDateStr + 'T00:00:00');
    const endDate = endDateStr ? new Date(endDateStr + 'T00:00:00') : new Date();

    const startFormatted = startDate.toLocaleDateString('id-ID', options);
    const endFormatted = endDateStr ? endDate.toLocaleDateString('id-ID', options) : 'Sekarang';
    
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    months = months <= 0 ? 0 : months;

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let duration = '';
    if (years > 0) duration += `${years} thn `;
    if (remainingMonths > 0) duration += `${remainingMonths} bln`;
    if (duration === '') duration = 'Kurang dari sebulan';

    return `${startFormatted} - ${endFormatted} · ${duration.trim()}`;
};

const formatSalary = (min: number, max: number) => {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    return `${formatter.format(min)} - ${formatter.format(max)}`;
};


// --- UI SUB-COMPONENTS ---

const SectionCard: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className }) => (
    <div className={`bg-white shadow-sm rounded-xl p-5 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
            {icon}
            <h2 className="text-lg font-bold text-black">{title}</h2>
        </div>
        {children}
    </div>
);

const WorkExperienceSection: React.FC<{ experiences: CandidateDetail['workExperience'] }> = ({ experiences }) => (
    <SectionCard title="Pengalaman Kerja" icon={<BriefcaseIcon className="h-5 w-5 text-gray-500" />}>
        <div className="space-y-5 relative before:absolute before:inset-0 before:ml-2.5 before:w-0.5 before:bg-gray-200">
            {experiences.length > 0 ? experiences.map(exp => (
                <div key={exp.id} className="relative pl-8">
                     <div className="absolute left-0 top-1 w-2.5 h-2.5 bg-gray-300 rounded-full border-4 border-white ring-2 ring-gray-200"></div>
                     <p className="font-bold text-black">{exp.jobTitle}</p>
                     <p className="text-sm font-medium text-gray-700">{exp.companyName}</p>
                     <p className="text-xs text-gray-500 my-1">{formatDateRange(exp.startDate, exp.endDate)}</p>
                     <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                </div>
            )) : <p className="text-sm text-gray-500">Tidak ada pengalaman kerja yang dicantumkan.</p>}
        </div>
    </SectionCard>
);

const EducationSection: React.FC<{ educations: CandidateDetail['education'] }> = ({ educations }) => (
    <SectionCard title="Pendidikan" icon={<AcademicCapIcon className="h-5 w-5 text-gray-500" />}>
        <div className="space-y-4">
            {educations.length > 0 ? educations.map(edu => (
                <div key={edu.id}>
                    <p className="font-bold text-black">{edu.institution}</p>
                    <p className="text-sm text-gray-700">{edu.degree}, {edu.fieldOfStudy}</p>
                    <p className="text-xs text-gray-500 mt-1">{getYearSafe(edu.startDate)} - {getYearSafe(edu.endDate)}</p>
                </div>
            )) : <p className="text-sm text-gray-500">Tidak ada riwayat pendidikan yang dicantumkan.</p>}
        </div>
    </SectionCard>
);

const SkillBadge: React.FC<{ skill: string }> = ({ skill }) => (
    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
        {skill}
    </span>
);

const SalaryExpectationSection: React.FC<{ salary: CandidateDetail['salaryExpectation'] }> = ({ salary }) => (
    <SectionCard title="Ekspektasi Gaji" icon={<BanknotesIcon className="h-5 w-5 text-gray-500" />}>
        <p className="text-xl font-semibold text-black">{formatSalary(salary.min, salary.max)}</p>
        <p className="text-xs text-gray-500">per bulan</p>
    </SectionCard>
);

const DocumentCard: React.FC<{ doc: CandidateDetail['documents'][0] }> = ({ doc }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
            <DocumentTextIcon className="h-6 w-6 text-gray-500 flex-shrink-0" />
            <div className="flex-grow min-w-0">
                <p className="font-semibold text-black truncate">{doc.name}</p>
                <p className="text-xs text-gray-400">{doc.file_name}</p>
            </div>
        </div>
        {/* <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex-shrink-0" aria-label="Download">
            <ArrowDownTrayIcon className="h-5 w-5" />
        </button> */}
    </div>
);

const ActivityItem: React.FC<{ activity: CandidateDetail['activity'][0], isLast: boolean }> = ({ activity, isLast }) => (
    <div className="flex gap-4">
        <div className="relative">
            <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 ring-4 ring-white"></div>
            {!isLast && <div className="absolute top-5 left-1/2 -translate-x-1/2 w-px h-full bg-gray-200"></div>}
        </div>
        <div>
            <p className="font-medium text-black">{activity.event}</p>
            <p className="text-xs text-gray-500">{format(new Date(activity.time), "EEEE, dd MMM yyyy 'pukul' HH:mm", { locale: idLocale })}</p>
        </div>
    </div>
);

const ApplicationHistorySection: React.FC<{ applications: CandidateDetail['applicationHistory'] }> = ({ applications }) => {
    const STAGE_ORDER = [
    'Screening',
    'Psikotest',
    'Interview HR',
    'Interview User',
    'Penawaran',
    ] as const;

    const getLatestStage = (stages: ApplicationHistory['stages']) => {
    // fallback default
    let latestStage = {
        name: 'Screening',
        status: 'Belum',
    };

    if (!stages || stages.length === 0) {
        return latestStage;
    }

    // mapping stage name → status
    const stageMap = new Map(
        stages.map(stage => [stage.name, stage.status])
    );

    for (const stageName of STAGE_ORDER) {
        const status = stageMap.get(stageName);

        if (!status || status === 'Belum') {
        // belum dikerjakan → ini stage aktif
        return {
            name: stageName,
            status: 'Belum',
        };
        }

        if (status === 'Tidak Lolos') {
        // gagal → stop di sini
        return {
            name: stageName,
            status: 'Tidak Lolos',
        };
        }

        // status === 'Lolos'
        latestStage = {
        name: stageName,
        status: 'Lolos',
        };
    }

    // kalau semua lolos sampai akhir
    return latestStage;
    };


    const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Lolos':
        return 'bg-green-100 text-green-800';
      case 'Tidak Lolos':
        return 'bg-red-100 text-red-800';
      default: // Belum
        return 'bg-gray-100 text-gray-800';
    }
  };

    return (
        <SectionCard title="Riwayat Lamaran Pekerjaan" icon={<ClockIcon className="h-5 w-5 text-gray-500" />}>
            <div className="space-y-4">
                {applications.length > 0 ? (
                    [...applications].sort((a, b) => new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime())
                        .map(app => {
                            const latestStage = getLatestStage(app.stages);
                            return (
                            <div key={app.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                <div>
                                    <p className="font-bold text-black">{app.position}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Tanggal Melamar: {format(new Date(app.applied_date), 'dd MMMM yyyy', { locale: idLocale })}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(latestStage.status)}`}>
                                        {latestStage.name}
                                    </span>
                                </div>
                            </div>
                        )})
                ) : (
                    <p className="text-sm text-gray-500">Kandidat belum pernah melamar pekerjaan.</p>
                )}
            </div>
        </SectionCard>
    );
};


// --- MAIN COMPONENT ---

const CandidateDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [candidate, setCandidate] = useState<CandidateDetail  | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    useEffect(() => {
    const loadCandidate = async () => {
        try {
            setLoading(true);
            setError(false);

            if (!id) throw new Error("Invalid id");

            const data = await getCandidateById(id);
            if (!data) throw new Error("Candidate not found");

            setCandidate(data);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    loadCandidate();
}, [id, getCandidateById]);

    
    useEffect(() => {
        if (loading || !candidate) return;

        const highlightId = searchParams.get('highlight');
        if (!highlightId) return;

        const element = document.getElementById(highlightId);

        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const card = element.querySelector('.bg-white'); // Find the card inside the wrapper
                if (card) {
                    card.classList.add('highlight-section');
                    setTimeout(() => {
                        card.classList.remove('highlight-section');
                    }, 3000);
                }
            }, 100);
        }
    }, [loading, candidate, searchParams]);

    if (loading) return <div className="text-center p-10">Memuat data kandidat...</div>;
    if (error || !candidate) return <div className="text-center p-10 text-red-500">Gagal memuat data kandidat.</div>;

    return (
        <div>
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold hover:underline mb-6">
                <ChevronLeftIcon className="h-4 w-4" />
                Kembali
            </button>

            <div id="profile_info" className="bg-white shadow-sm rounded-xl p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                    <img src={candidate.user?.avatarUrl || '/avatar-placeholder.png'}
                    alt={candidate.user?.name || 'Candidate'} className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 flex-shrink-0" />
                    <div className="flex-grow">
                        <h1 className="text-3xl font-bold text-black">{candidate.user?.name}</h1>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5"><BriefcaseIcon className="h-4 w-4 text-black"/> <span className="text-black font-medium">{candidate.positionApplied}</span></span>
                            <span className="flex items-center gap-1.5"><EnvelopeIcon className="h-4 w-4"/> {candidate.user?.email}</span>
                            <span className="flex items-center gap-1.5"><MapPinIcon className="h-4 w-4"/> {candidate.user?.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <WorkExperienceSection experiences={candidate.workExperience ?? []} />
                    <EducationSection educations={candidate.education ?? []} />
                    <SectionCard title="Keahlian" icon={<SparklesIcon className="h-5 w-5 text-gray-500" />}>
                        <div className="flex flex-wrap gap-2">
                            {(candidate.skills ?? []).map(skill => (
                                <SkillBadge key={skill.id} skill={skill.name} />
                            ))}
                        </div>
                    </SectionCard>
                </div>

                <div className="space-y-6">
                    <SalaryExpectationSection salary={candidate.salaryExpectation ?? []} />
                    <div id="document">
                        <SectionCard title="Dokumen" icon={<DocumentTextIcon className="h-5 w-5 text-gray-500" />}>
                            <div className="space-y-3">
                                {(candidate.documents ?? []).length > 0 ? (
                                    (candidate.documents ?? []).map(doc => <DocumentCard key={doc.file_name} doc={doc}/>)
                                ) : (
                                    <p className="text-sm text-gray-500">Tidak ada dokumen yang diunggah.</p>
                                )}
                            </div>
                        </SectionCard>
                    </div>
                    <SectionCard title="Aktivitas Kandidat">
                         <div className="relative space-y-6">
                             {(candidate.activity ?? []).length > 0 ? (
                                (candidate.activity ?? []).map((act, index) => <ActivityItem key={index} activity={act} isLast={index === candidate.activity.length - 1} />)
                             ) : (
                                <p className="text-sm text-gray-500">Tidak ada aktivitas terbaru.</p>
                             )}
                         </div>
                    </SectionCard>
                </div>
            </div>

            <div id="application_history" className="mt-6">
                <ApplicationHistorySection applications={candidate.applicationHistory ?? []} />
            </div>
        </div>
    );
};

export default CandidateDetailPage;