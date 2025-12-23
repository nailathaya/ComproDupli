
// import { create } from 'zustand';
// import { Job, FilterOptions, SelectedFilters } from '../types';
// import { FILTER_OPTIONS, MOCK_JOBS, MAX_SALARY } from '../constants';
// // import api from '../services/api';

// interface JobState {
//   jobs: Job[];
//   filteredJobs: Job[];
//   filters: FilterOptions;
//   selectedFilters: SelectedFilters;
//   country: string;
//   salaryRange: [number, number];
//   searchQuery: string;
//   loading: boolean;
//   fetchJobs: () => Promise<void>;
//   updateFilterSelection: <K extends keyof SelectedFilters>(filterType: K, value: SelectedFilters[K]) => void;
//   setCountry: (country: string) => void;
//   setSalaryRange: (range: [number, number]) => void;
//   setSearchQuery: (query: string) => void;
//   resetFilters: () => void;
//   applyFilters: () => void;
// }

// const initialSelectedFilters: SelectedFilters = {
//     jobLevel: [],
//     employmentType: [],
//     jobFunction: [],
//     education: [],
//     company: [],
// };

// export const useJobStore = create<JobState>((set, get) => ({
//   jobs: [],
//   filteredJobs: [],
//   filters: FILTER_OPTIONS,
//   selectedFilters: initialSelectedFilters,
//   country: 'Indonesia',
//   salaryRange: [0, MAX_SALARY],
//   searchQuery: '',
//   loading: false,

//   fetchJobs: async () => {
//     set({ loading: true });
//     try {
//       // In a real app:
//       // const response = await api.get('/jobs');
//       // set({ jobs: response.data, filteredJobs: response.data, loading: false });
      
//       // Using mock data:
//       setTimeout(() => {
//         set({ jobs: MOCK_JOBS, loading: false });
//         get().applyFilters();
//       }, 500);
//     } catch (error) {
//       console.error("Failed to fetch jobs:", error);
//       set({ loading: false });
//     }
//   },

//   updateFilterSelection: (filterType, value) => {
//     set((state) => ({
//       selectedFilters: {
//         ...state.selectedFilters,
//         [filterType]: value,
//       },
//     }));
//     get().applyFilters();
//   },

//   setCountry: (country) => {
//     set({ country });
//     // Potentially re-fetch or filter jobs by country here
//   },

//   setSalaryRange: (range) => {
//     set({ salaryRange: range });
//     get().applyFilters();
//   },

//   setSearchQuery: (query) => {
//     set({ searchQuery: query });
//     get().applyFilters();
//   },

//   resetFilters: () => {
//     set({
//       selectedFilters: initialSelectedFilters,
//       salaryRange: [0, MAX_SALARY],
//       searchQuery: '',
//     });
//     get().applyFilters();
//   },
  
//   applyFilters: () => {
//     set(state => {
//         const { jobs, selectedFilters, salaryRange, searchQuery } = state;
//         const lowerCaseQuery = searchQuery.toLowerCase();

//         const newFilteredJobs = jobs.filter(job => {
//             const queryMatch = !searchQuery || 
//                                job.title.toLowerCase().includes(lowerCaseQuery) ||
//                                job.company.toLowerCase().includes(lowerCaseQuery) ||
//                                job.jobFunction.toLowerCase().includes(lowerCaseQuery);

//             const salaryMatch = job.salary.min >= salaryRange[0] && job.salary.max <= salaryRange[1];

//             const jobLevelMatch = selectedFilters.jobLevel.length === 0 || selectedFilters.jobLevel.includes(job.jobLevel);
//             const employmentTypeMatch = selectedFilters.employmentType.length === 0 || selectedFilters.employmentType.includes(job.employmentType);
//             const jobFunctionMatch = selectedFilters.jobFunction.length === 0 || selectedFilters.jobFunction.includes(job.jobFunction);
//             const educationMatch = selectedFilters.education.length === 0 || selectedFilters.education.includes(job.education);
//             const companyMatch = selectedFilters.company.length === 0 || selectedFilters.company.includes(job.company);

//             return queryMatch && salaryMatch && jobLevelMatch && employmentTypeMatch && jobFunctionMatch && educationMatch && companyMatch;
//         });
//         return { filteredJobs: newFilteredJobs };
//     });
//   }

// }));

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
