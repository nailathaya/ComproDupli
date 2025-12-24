import { create } from 'zustand';
import { Job, SelectedFilters } from '../types';
import { getPublicJobs } from '../services/api';


interface JobState {
  jobs: Job[];
  filteredJobs: Job[];
  loading: boolean;

  
  searchQuery: string;
  selectedFilters: SelectedFilters;
  salaryRange: [number, number];

  appliedJobIds: number[];
  setAppliedJobIds: (ids: number[]) => void;
  addAppliedJobId: (id: number) => void;
  
  fetchJobs: () => Promise<void>;
  setSearchQuery: (q: string) => void;
  updateFilterSelection: (
    type: keyof SelectedFilters,
    values: string[]
  ) => void;
  setSalaryRange: (range: [number, number]) => void;
  resetFilters: () => void;
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  filteredJobs: [],
  loading: false,

  searchQuery: '',
  selectedFilters: {
    jobLevel: [],
    employmentType: [],
    jobFunction: [],
    education: [],
    company: [],
  },

  salaryRange: [0, 100000000],
  appliedJobIds: [],
  setAppliedJobIds: (ids) => set({ appliedJobIds: ids }),
  addAppliedJobId: (id) =>
    set((state) => ({
      appliedJobIds: [...new Set([...state.appliedJobIds, id])],
    })),

  fetchJobs: async () => {
    set({ loading: true });
    try {
      const data = await getPublicJobs();

      // mapping backend → frontend Job type
      const mappedJobs: Job[] = data.map((j: any) => ({
        id: j.id,
        title: j.title,
        company: j.department || 'Perusahaan',
        location: j.location,
        employmentType: j.employment_type,
        jobLevel: 'Entry Level', // bisa kamu derive nanti
        jobFunction: j.department,
        education: j.min_education,
        salary: {
          min: j.salary_min ?? 0,
          max: j.salary_max ?? 0,
        },
        postedDate: j.created_at,
        logoUrl: '/logo-default.png',
        status: j.status,
      }));

      set({
        jobs: mappedJobs,
        filteredJobs: mappedJobs,
      });
    } finally {
      set({ loading: false });
    }
  },

  setSearchQuery: (q) => {
    set({ searchQuery: q });
    filterJobs();
  },

  updateFilterSelection: (type, values) => {
    set((state) => ({
      selectedFilters: {
        ...state.selectedFilters,
        [type]: values,
      },
    }));
    filterJobs();
  },

  setSalaryRange: (range) => {
    set({ salaryRange: range });
    filterJobs();
  },

  resetFilters: () => {
    set({
      selectedFilters: {
        jobLevel: [],
        employmentType: [],
        jobFunction: [],
        education: [],
        company: [],
      },
      searchQuery: '',
    });
    filterJobs();
  },
}));

function filterJobs() {
  const {
    jobs,
    searchQuery,
    selectedFilters,
    salaryRange,
  } = useJobStore.getState();

  let filtered = [...jobs];

  if (searchQuery) {
    filtered = filtered.filter((j) =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedFilters.employmentType.length > 0) {
    filtered = filtered.filter((j) =>
      selectedFilters.employmentType.includes(j.employmentType)
    );
  }

  filtered = filtered.filter(
    (j) =>
      j.salary.max >= salaryRange[0] &&
      j.salary.min <= salaryRange[1]
  );

  useJobStore.setState({ filteredJobs: filtered });
}

