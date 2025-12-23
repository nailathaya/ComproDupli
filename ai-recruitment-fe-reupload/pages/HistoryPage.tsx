// import React, { useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { ApplicationHistory, Profile, RecruitmentStage } from '../types';
// import { format } from 'date-fns';
// import { id } from 'date-fns/locale';

// const result = format(new Date(), 'dd MMMM yyyy', { locale: id });
// import { BriefcaseIcon, CalendarIcon } from '@heroicons/react/24/outline';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApplicationHistory, RecruitmentStage } from '../types';
import { format } from 'date-fns';
import{ id } from 'date-fns/locale/id';

format(new Date(), 'dd MMMM yyyy', { locale: id });

import { BriefcaseIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { getMyApplications } from '../services/api';

const HistoryPage: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

    useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getMyApplications();
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.applied_at).getTime() -
            new Date(a.applied_at).getTime()
        );
        setApplications(sorted);
      } catch (err) {
        console.error('Failed to load application history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

// const HistoryPage: React.FC = () => {
//     const [applications, setApplications] = useState<ApplicationHistory[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [searchParams] = useSearchParams();

//     useEffect(() => {
//         setTimeout(() => {
//             const history = mockProfile.applicationHistory || [];
//             // Sort by most recent application date
//             const sortedHistory = [...history].sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime());
//             setApplications(sortedHistory);
//             setLoading(false);
//         }, 500);
//     }, []);

    useEffect(() => {
        if (loading) return;

        const highlightParam = searchParams.get('highlight');
        const stageParam = searchParams.get('stage');
        if (!highlightParam) return;
        
        const highlightId = highlightParam.replace('application-', '');
        const element = document.getElementById(`application-${highlightId}`);

        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // If a specific stage is requested, highlight it
                if (stageParam) {
                    const stageId = `stage-${highlightId}-${stageParam.replace(/\s+/g, '-')}`;
                    const stageElement = document.getElementById(stageId);
                    if (stageElement) {
                        const isRejection = stageElement.dataset.status === 'Tidak Lolos';
                        const highlightClass = isRejection ? 'highlight-section-red' : 'highlight-section';
                        stageElement.classList.add(highlightClass);
                        setTimeout(() => {
                            stageElement.classList.remove(highlightClass);
                        }, 3000);
                    }
                } else {
                    // Otherwise, highlight the whole card
                    element.classList.add('highlight-section');
                    setTimeout(() => {
                        element.classList.remove('highlight-section');
                    }, 3000);
                }
            }, 100);
        }
    }, [loading, searchParams]);
    
    const getStageStyling = (status: RecruitmentStage['status']) => {
        switch (status) {
            case 'Lolos':
                return {
                    bullet: 'bg-green-500',
                    line: 'bg-green-500',
                    text: 'text-green-700 font-semibold',
                };
            case 'Tidak Lolos':
                return {
                    bullet: 'bg-red-500',
                    line: 'bg-red-500',
                    text: 'text-red-700 font-semibold',
                };
            case 'Dalam Proses':
            case 'Pending':
            case 'Belum':
            default:
                return {
                    bullet: 'bg-gray-400',
                    line: 'bg-gray-300',
                    text: 'text-gray-500',
                };
        }
    };
    
    const getOverallStatusInfo = (status: ApplicationHistory['status']) => {
        switch (status) {
            case 'Diterima':
                return { text: status, color: 'text-green-700 bg-green-100' };
            case 'Interview':
                return { text: "Tahap Interview", color: 'text-green-700 bg-green-100' };
            case 'Ditolak':
                 return { text: status, color: 'text-red-700 bg-red-100' };
            case 'Dalam Proses':
                 return { text: status, color: 'text-yellow-700 bg-yellow-100' };
            case 'Pending':
                 return { text: status, color: 'text-gray-700 bg-gray-200' };
            default:
                 return { text: status, color: 'text-gray-700 bg-gray-200' };
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Memuat riwayat lamaran...</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Riwayat Lamaran</h1>
                <p className="text-gray-500 mt-1">Lacak semua status lamaran pekerjaan Anda di sini.</p>
            </header>
            
            <div className="space-y-8">
                {applications.length > 0 ? (
                    applications.map(app => {
                        const overallStatus = getOverallStatusInfo(app.status);
                        let failed = false;
                        return (
                            <div key={app.id} id={`application-${app.id}`} className="bg-white shadow-md rounded-xl p-6 transition-colors duration-300">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{app.position}</h2>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                                            {app.company && <span className="flex items-center gap-1.5"><BriefcaseIcon className="h-4 w-4" />{app.company}</span>}
                                            <span className="flex items-center gap-1.5"><CalendarIcon className="h-4 w-4" />Dilamar pada {format(new Date(app.applied_at), 'dd MMMM yyyy', { locale: id })}</span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                        <p className="text-xs text-gray-500 mb-2">Status Akhir</p>
                                        <span className={`px-3 py-1.5 rounded-full font-semibold text-sm ${overallStatus.color}`}>{overallStatus.text}</span>
                                    </div>
                                </div>

                                <div className="mt-6 overflow-x-auto pb-4">
                                    <div className="flex items-start min-w-max">
                                        {app.stages.map((stage, index) => {
                                            const isFailedStage = stage.status === 'Tidak Lolos';
                                            if (isFailedStage) {
                                                failed = true;
                                            }
                                            const isInactive = failed && !isFailedStage;
                                            const currentStyling = getStageStyling(isInactive ? 'Belum' : stage.status);
                                            const lineShouldBeActive = stage.status === 'Lolos' && !failed;
                                            const lineBgClass = lineShouldBeActive ? getStageStyling('Lolos').line : getStageStyling('Belum').line;

                                            return (
                                                <React.Fragment key={stage.name}>
                                                    <div 
                                                        id={`stage-${app.id}-${stage.name.replace(/\s+/g, '-')}`}
                                                        data-status={stage.status}
                                                        className="flex flex-col items-center flex-shrink-0 w-28 rounded-md p-1 transition-colors duration-300"
                                                    >
                                                        <div className={`w-4 h-4 rounded-full ${currentStyling.bullet}`}></div>
                                                        <p className={`text-center font-semibold text-xs mt-2 ${isInactive ? 'text-gray-400' : 'text-gray-800'}`}>{stage.name}</p>
                                                        <p className={`text-center text-xs mt-1 ${isInactive ? 'text-gray-400' : currentStyling.text}`}>{stage.status}</p>
                                                    </div>
                                                    {index < app.stages.length - 1 && (
                                                        <div className={`flex-1 h-0.5 mt-2 ${lineBgClass}`}></div>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-white shadow-md rounded-xl p-10 text-center">
                        <h3 className="text-xl font-semibold text-gray-700">Belum Ada Riwayat Lamaran</h3>
                        <p className="text-gray-500 mt-2">Anda belum melamar pekerjaan apa pun. Mulai cari lowongan sekarang!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;

// import React, { useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { ApplicationHistory, RecruitmentStage } from '../types';
// import { format } from 'date-fns';
// import{ id } from 'date-fns/locale/id';

// format(new Date(), 'dd MMMM yyyy', { locale: id });

// import { BriefcaseIcon, CalendarIcon } from '@heroicons/react/24/outline';
// import { getMyApplications } from '../services/api';

// const HistoryPage: React.FC = () => {
//   const [applications, setApplications] = useState<ApplicationHistory[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchParams] = useSearchParams();

  /* =========================
     FETCH HISTORY
  ========================= */
//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const data = await getMyApplications();
//         const sorted = [...data].sort(
//           (a, b) =>
//             new Date(b.applied_at).getTime() -
//             new Date(a.applied_at).getTime()
//         );
//         setApplications(sorted);
//       } catch (err) {
//         console.error('Failed to load application history', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, []);

//   /* =========================
//      HIGHLIGHT FROM URL
//   ========================= */
//   useEffect(() => {
//     if (loading) return;

//     const highlightParam = searchParams.get('highlight');
//     const stageParam = searchParams.get('stage');
//     if (!highlightParam) return;

//     const highlightId = highlightParam.replace('application-', '');
//     const element = document.getElementById(`application-${highlightId}`);

//     if (!element) return;

//     setTimeout(() => {
//       element.scrollIntoView({ behavior: 'smooth', block: 'center' });
//
//       if (stageParam) {
//         const stageId = `stage-${highlightId}-${stageParam.replace(/\s+/g, '-')}`;
//         const stageEl = document.getElementById(stageId);
//         if (stageEl) {
//           stageEl.classList.add('highlight-section');
//           setTimeout(() => stageEl.classList.remove('highlight-section'), 3000);
//         }
//       } else {
//         element.classList.add('highlight-section');
//         setTimeout(() => element.classList.remove('highlight-section'), 3000);
//       }
//     }, 100);
//   }, [loading, searchParams]);

//   /* =========================
//      HELPERS
//   ========================= */
//   const getStageStyle = (status: RecruitmentStage['status']) => {
//         switch (status) {
//             case 'Lolos':
//                 return {
//                     bullet: 'bg-green-500',
//                     line: 'bg-green-500',
//                     text: 'text-green-700 font-semibold',
//                 };
//             case 'Tidak Lolos':
//                 return {
//                     bullet: 'bg-red-500',
//                     line: 'bg-red-500',
//                     text: 'text-red-700 font-semibold',
//                 };
//             case 'Dalam Proses':
//             case 'Pending':
//             case 'Belum':
//             default:
//                 return {
//                     bullet: 'bg-gray-400',
//                     line: 'bg-gray-300',
//                     text: 'text-gray-500',
//                 };
//         }
//     };
// //   const getStageStyle = (status: RecruitmentStage['status']) => {
// //     switch (status) {
// //       case 'Lolos':
// //         return { bullet: 'bg-green-500', text: 'text-green-700 font-semibold' };
// //       case 'Tidak Lolos':
// //         return { bullet: 'bg-red-500', text: 'text-red-700 font-semibold' };
// //       default:
// //         return { bullet: 'bg-gray-400', text: 'text-gray-500' };
// //     }
// //   };

// //   const getOverallStatus = (status: ApplicationHistory['status']) => {
// //     switch (status) {
// //       case 'Diterima':
// //         return 'text-green-700 bg-green-100';
// //       case 'Ditolak':
// //         return 'text-red-700 bg-red-100';
// //       case 'Dalam Proses':
// //         return 'text-yellow-700 bg-yellow-100';
// //       default:
// //         return 'text-gray-700 bg-gray-200';
// //     }
// //   };
//     const getOverallStatus = (status: ApplicationHistory['status']) => {
//         switch (status) {
//             case 'Diterima':
//                 return { text: status, color: 'text-green-700 bg-green-100' };
//             case 'Interview':
//                 return { text: "Tahap Interview", color: 'text-green-700 bg-green-100' };
//             case 'Ditolak':
//                  return { text: status, color: 'text-red-700 bg-red-100' };
//             case 'Dalam Proses':
//                  return { text: status, color: 'text-yellow-700 bg-yellow-100' };
//             case 'Pending':
//                  return { text: status, color: 'text-gray-700 bg-gray-200' };
//             default:
//                  return { text: status, color: 'text-gray-700 bg-gray-200' };
//         }
//     };
//   /* =========================
//      RENDER
//   ========================= */
//   if (loading) {
//     return <div className="p-8 text-center">Memuat riwayat lamaran...</div>;
//   }

//   return (
//     <div className="container mx-auto p-4 sm:p-6 lg:p-8">
//       <header className="mb-8">
//         <h1 className="text-4xl font-bold text-gray-800">Riwayat Lamaran</h1>
//         <p className="text-gray-500 mt-1">
//           Lacak semua status lamaran pekerjaan Anda.
//         </p>
//       </header>

//       {applications.length === 0 ? (
//         <div className="bg-white shadow-md rounded-xl p-10 text-center">
//           <h3 className="text-xl font-semibold text-gray-700">
//             Belum Ada Riwayat Lamaran
//           </h3>
//           <p className="text-gray-500 mt-2">
//             Anda belum melamar pekerjaan apa pun.
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-8">
//           {applications.map((app) => (
//             <div
//               key={app.id}
//               id={`application-${app.id}`}
//               className="bg-white shadow-md rounded-xl p-6"
//             >
//               <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
//                 <div>
//                   <h2 className="text-xl font-bold">{app.position}</h2>
//                   <div className="flex gap-4 mt-2 text-sm text-gray-600">
//                     {app.company && (
//                       <span className="flex items-center gap-1">
//                         <BriefcaseIcon className="h-4 w-4" />
//                         {app.company}
//                       </span>
//                     )}
//                     <span className="flex items-center gap-1">
//                       <CalendarIcon className="h-4 w-4" />
//                       {format(new Date(app.applied_at), 'dd MMMM yyyy', {
//                         locale: id,
//                       })}
//                     </span>
//                   </div>
//                 </div>

//                 <span
//                   className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getOverallStatus(
//                     app.status
//                   )}`}
//                 >
//                   {app.status}
//                 </span>
//               </div>

//               <div className="flex gap-6 overflow-x-auto">
//                 {app.stages.map((stage) => {
//                   const style = getStageStyle(stage.status);
//                   return (
//                     <div
//                       key={stage.name}
//                       id={`stage-${app.id}-${stage.name.replace(/\s+/g, '-')}`}
//                       className="flex flex-col items-center w-28"
//                     >
//                       <div className={`w-4 h-4 rounded-full ${style.bullet}`} />
//                       <p className="text-xs font-semibold mt-2">
//                         {stage.name}
//                       </p>
//                       <p className={`text-xs mt-1 ${style.text}`}>
//                         {stage.status}
//                       </p>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default HistoryPage;
