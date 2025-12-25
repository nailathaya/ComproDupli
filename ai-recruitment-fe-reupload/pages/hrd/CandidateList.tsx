import React, { useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useHrdStore } from '../../store/useHrdStore';
import { AIScreeningStatus,AIScreeningRecommendation, RecruitmentStage } from '../../types';
import { EyeIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import profilePicture from '../../components/profile-kandidat.webp';

const STAGE_ORDER = ['Screening', 'Psikotest', 'Interview HR', 'Interview User', 'Penawaran'];

const isStageUnlocked = (
  stageName: string,
  stages: RecruitmentStage[]
) => {
  if (stageName === 'Screening') return true;

  const currentIndex = STAGE_ORDER.indexOf(stageName);
  const prevStageName = STAGE_ORDER[currentIndex - 1];

  const prevStage = stages.find(s => s.name === prevStageName);

  return prevStage?.status === 'Lolos';
};

const getAIBulletColor = (status: AIScreeningStatus) => {
  switch (status) {
    case 'PASS':
      return 'bg-green-500';
    case 'REVIEW':
      return 'bg-yellow-400';
    case 'REJECT':
      return 'bg-red-500';
  }
};
const getAILabelText = (status: AIScreeningStatus) => {
  switch (status) {
    case 'PASS': return 'AI: Lolos';
    case 'REVIEW': return 'AI: Pertimbangkan';
    case 'REJECT': return 'AI: Tidak Lolos';
  }
};

const AIScreeningBullet: React.FC<{ ai: AIScreeningRecommendation }> = ({ ai }) => (
  <div className="relative group flex items-center">
    {/* BULLET */}
    <span
      className={`w-2.5 h-2.5 rounded-full ${getAIBulletColor(ai.status)}`}
    />

    {/* TOOLTIP */}
    <div
      className="
        absolute left-4 top-1/2 -translate-y-1/2
        hidden group-hover:block
        bg-black text-white text-[10px]
        px-2 py-1 rounded whitespace-nowrap z-50
      "
    >
      {getAILabelText(ai.status)}
    </div>
  </div>
);

const StageStatusBadge: React.FC<{ 
  stage: RecruitmentStage; 
  isLocked: boolean;
  onUpdate: (newStatus: RecruitmentStage['status']) => void;
}> = ({ stage, isLocked, onUpdate }) => {

  const getBadgeStyles = (status: RecruitmentStage['status']) => {
    switch (status) {
      case 'Lolos':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Tidak Lolos':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Belum':
      default:
        return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  if (isLocked) {
    return (
      <div className="w-full h-8 flex items-center justify-center bg-gray-50 rounded border border-gray-100 opacity-40">
        <span className="text-[10px] font-bold text-gray-400">Belum</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={stage.status}
        onChange={(e) =>
          onUpdate(e.target.value as RecruitmentStage['status'])
        }
        className={`w-full h-8 px-1 text-[10px] font-bold rounded border appearance-none text-center cursor-pointer ${getBadgeStyles(stage.status)}`}
      >
        <option value="Belum">⬜ Belum</option>
        <option value="Lolos">🟢 Lolos</option>
        <option value="Tidak Lolos">🔴 Tidak Lolos</option>
      </select>
    </div>
  );
};


const CandidateList: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    // const position = searchParams.get('position') || '';
    const {
      candidates,
      jobPostings,
      fetchCandidates,
      fetchJobPostings,
      updateStageStatus,
    } = useHrdStore();

    useEffect(() => {
      if (candidates.length === 0) fetchCandidates();
      if (jobPostings.length === 0) fetchJobPostings();
    }, [candidates.length, jobPostings.length, fetchCandidates, fetchJobPostings]);

    const jobId = searchParams.get('jobId') || '';
    const selectedJob = jobPostings.find(j => String(j.id) === jobId);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = e.target.value;
      navigate(id ? `/hrd/kandidat?jobId=${id}` : '/hrd/kandidat');
    };

const filteredData = useMemo(() => {
  return candidates
    .map(cand => {
      const activeApp = jobId
        ? cand.applicationHistory.find(a => String(a.job_id) === jobId)
        : cand.applicationHistory[0];

      if (!activeApp) return null;

      return { ...cand, activeApp };
    })
    .filter(Boolean);
}, [candidates, jobId]);

    return (
        <div className="flex flex-col h-full">
            <header className="mb-8">
                <h1>
                    <span className="text-4xl font-bold text-black">Manajemen Kandidat</span>
                </h1>
                <p className="text-gray-500 mt-1">
                  {jobId
                    ? `Manajemen kandidat untuk posisi ${selectedJob?.title}`
                    : 'Kelola status rekrutmen kandidat secara real-time.'}</p>
            </header>
            
            <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="max-w-xs w-full">
                    <label htmlFor="job-filter" className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                        Pilih Posisi Pekerjaan
                    </label>
                    <div className="relative">
                        <select
                            id="job-filter"
                            value={jobId}
                            onChange={handleFilterChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                        >
                            <option value="">Tampilkan Semua</option>
                            {jobPostings.map(job => (
                                <option key={job.id} value={job.id}>
                                  {job.title}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <ChevronDownIcon className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Kandidat</th>
                                {!jobId && <th scope="col" className="px-6 py-4 text-left text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Posisi</th>}
                                {STAGE_ORDER.map(stage => (
                                    <th key={stage} scope="col" className="px-3 py-4 text-center text-[10px] font-extrabold text-gray-400 uppercase tracking-widest w-28">
                                        {stage}
                                    </th>
                                ))}
                                <th scope="col" className="px-6 py-4 text-right text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Detail</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredData.map((cand) => {
                                const { activeApp } = cand;

                                return (
                                    <tr key={cand.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm" src={profilePicture} alt="" />
                                                <div className="ml-3">
                                                    <div className="text-sm font-bold text-gray-900">{cand.user.name}</div>
                                                    <div className="text-[10px] text-gray-400">{cand.user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        {!jobId && (
                                            <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-gray-600">
                                                {cand.positionApplied}
                                            </td>
                                        )}
                                        {STAGE_ORDER.map((stageName, idx) => {
                                            const stageData = activeApp?.stages.find(s => s.name === stageName) || { name: stageName, status: 'Belum' };
                                            
                                            const unlocked = isStageUnlocked(stageName, activeApp.stages);

                                            return (
                                                <td key={stageName} className="px-2 py-4">
                                                  {stageName === 'Screening' ? (
                                                    <div className="flex items-center gap-1">
                                                      {/* LABEL AI (HANYA INFO) */}
                                                      {cand.aiScreening ? (
                                                        <AIScreeningBullet ai={cand.aiScreening} />
                                                      ) : (
                                                        <div
                                                        className="w-2.5 h-2.5 rounded-full bg-gray-300"
                                                        title={'Pending'}
                                                        ></div>
                                                      )}

                                                      {/* KEPUTUSAN HRD */}
                                                      <StageStatusBadge
                                                        stage={stageData as RecruitmentStage}
                                                        isLocked={!unlocked}
                                                        onUpdate={async (status) =>{
                                                        await updateStageStatus(
                                                          cand.id,
                                                          activeApp?.id || 'mock-id',
                                                          stageName,
                                                          status
                                                        );
                                                        fetchCandidates();
                                                      }}
                                                      />
                                                    </div>
                                                  ) : (
                                                    <StageStatusBadge
                                                      stage={stageData as RecruitmentStage}
                                                      isLocked={!unlocked}
                                                      onUpdate={async (status) =>{
                                                        await updateStageStatus(
                                                          cand.id,
                                                          activeApp?.id || 'mock-id',
                                                          stageName,
                                                          status
                                                        );
                                                        fetchCandidates();
                                                      }}
                                                    />
                                                  )}
                                                </td>
                                            );
                                        })}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <button 
                                                onClick={() => navigate(`/hrd/kandidat/${cand.id}`)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CandidateList;