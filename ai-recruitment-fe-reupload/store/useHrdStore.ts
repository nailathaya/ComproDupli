
import { create } from 'zustand';
import { Candidate, Notification, MatchResult, JobPosition, ApplicationHistory, CandidateWithApplications, RecruitmentStage } from '../types';
import {
  getCandidates,
  getCandidateById as fetchCandidateById,
  getJobPostings
} from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* =====================
   AUTH HEADER
===================== */
function authHeader() {
  const token = localStorage.getItem("access_token"); // ✅ SAMAKAN
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* =========================
   TYPE
========================= */
interface DashboardStats {
  activeJobs: number;
  totalApplicants: number;
  avgFitScore: number;
  qualifiedCandidates: number;
}

type AIScreeningStatus = 'PASS' | 'REVIEW' | 'REJECT';

interface AIScreeningRecommendation {
  status: AIScreeningStatus;
  confidence: number;
  reason: string;
}

interface HrdState {
  // DATA
  candidates: (Candidate & {
    aiScreening?: AIScreeningRecommendation;
  })[];
  jobPostings: JobPosition[];
  

  // DASHBOARD
  dashboardStats: DashboardStats;

  // AI MATCHING
  matchResults: MatchResult[];

  // NOTIFICATIONS
  notifications: Notification[];

  // STATE
  loading: boolean;

  // ACTIONS
  fetchCandidates: () => Promise<void>;
  fetchJobPostings: () => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
  runMatching: (jobId: string) => Promise<void>;
  markAsRead: (id: string) => void;
  getCandidateById: (id: string) => Promise<Candidate | null>;
  updateStageStatus: (candidateId: string, applicationId: number, stageName: string, newStatus: RecruitmentStage['status']) => void;
  getJobById: (id: string) => JobPosition | undefined;
}

/* =========================
   STORE
========================= */
export const useHrdStore = create<HrdState>((set, get) => ({
  candidates: [],
  jobPostings: [],
  matchResults: [],
  loading: false,

  dashboardStats: {
    activeJobs: 0,
    totalApplicants: 0,
    avgFitScore: 0,
    qualifiedCandidates: 0,
  },

  /* =========================
     🔔 NOTIFICATIONS (DUMMY)
  ========================= */
  notifications: [
    {
      id: '1',
      title: 'Pelamar Baru',
      message: 'Ada kandidat baru melamar posisi Frontend Developer',
      category: 'candidate',
      status: 'unread',
      target_page: '/hrd/candidates',
      created_at: new Date().toISOString(),
    },
  ],

  markAsRead: (id) =>
    set({
      notifications: get().notifications.map((n) =>
        n.id === id ? { ...n, status: 'read' } : n
      ),
    }),

  /* =========================
     👥 FETCH CANDIDATES
  ========================= */
  fetchCandidates: async () => {
  set({ loading: true });
  try {
    const data = await getCandidates();

    set({
      candidates: data.map((cand: any) => ({
        ...cand,
        aiScreening: cand.aiScreening ?? null,
      })),
    });

  } catch (err) {
    console.error('Failed to fetch candidates', err);
  } finally {
    set({ loading: false });
  }
},

  /* =========================
     💼 FETCH JOB POSTINGS (INI KUNCI 🔥)
  ========================= */
  getJobById: (id) => {
    return get().jobPostings.find(
      job => String(job.id) === String(id)
    );
  },

  fetchJobPostings: async () => {
    set({ loading: true });
    try {
      const data = await getJobPostings();
      set({ jobPostings: data });
    } finally {
      set({ loading: false });
    }
  },

  /* =========================
     📊 DASHBOARD STATS
  ========================= */
fetchDashboardStats: async () => {
  let jobs = get().jobPostings;

  if (!jobs.length) {
    jobs = await getJobPostings();
    set({ jobPostings: jobs });
  }

  set({
    dashboardStats: {
      activeJobs: jobs.length,
      totalApplicants: get().candidates.length,
      avgFitScore: 78,
      qualifiedCandidates: Math.floor(get().candidates.length * 0.6),
    },
  });
},


  /* =========================
   🤖 AI MATCHING
========================= */
runMatching: async (jobId: string) => {
  set({ loading: true });

  try {
    const res = await fetch(`${API_BASE_URL}/ai/match`, {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ job_id: Number(jobId) }),
    });

    if (!res.ok) throw new Error('AI matching failed');

    const data: MatchResult[] = await res.json();

    set((state) => ({
      matchResults: data,
      candidates: state.candidates.map((cand) => {
        const ai = data.find(r => r.candidate.id === cand.id);
        if (!ai) return cand;

        return {
          ...cand,
          aiScreening: ai.screeningRecommendation, // 🔥 INI KUNCI
        };
      }),
      loading: false,
    }));

  } catch (error) {
    console.error('AI Matching error:', error);
    set({ loading: false });
  }
},

updateStageStatus: async (candidateId, applicationId, stageName, newStatus) => {
  // 1️⃣ OPTIMISTIC UPDATE
  set(state => ({
    candidates: state.candidates.map(candidate => {
      if (String(candidate.id) !== candidateId) return candidate;

      return {
        ...candidate,
        applicationHistory: candidate.applicationHistory.map(app => {
          if (app.id !== Number(applicationId)) return app;

          return {
            ...app,
            stages: app.stages.map(stage =>
              stage.name === stageName
                ? { ...stage, status: newStatus }
                : stage
            ),
          };
        }),
      };
    }),
  }));

  // 2️⃣ BACKEND SYNC
  await fetch(
    `${API_BASE_URL}/applications/${applicationId}/stage?name=${stageName}&status=${newStatus}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
},



  getCandidateById: async (id) => {
    return await fetchCandidateById(id);
  },
}));
