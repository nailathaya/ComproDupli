
import { FilterOptions, Job } from './types';

export const API_BASE_URL = 'http://localhost:8000'; // Example for local dev

export const FILTER_OPTIONS: FilterOptions = {
  jobLevel: ['Internship', 'Entry Level', 'Associate', 'Mid-Senior', 'Director'],
  // FIX: Added 'Internship' to the employmentType filter options to match the Job type.
  employmentType: ['Full Time', 'Part Time', 'Freelance', 'Contractual', 'Internship'],
  jobFunction: ['Akuntansi', 'Administrasi', 'IT', 'Teknik', 'HR', 'Manajemen', 'Pendidikan', 'Marketing'],
  education: ['Kurang dari SMA', 'SMA/Sederajat', 'Diploma', 'Sarjana (S1)', 'Magister (S2)', 'Doktor (S3)'],
  company: ['Kalibrr', 'AstraPay', 'Quantum Group', 'Sumber Sukses', 'Bayer', 'Cortex Tech'],
};

export const MOCK_JOBS: Job[] = [
    {
        id: '1',
        title: 'Frontend Developer',
        company: 'Cortex Tech',
        location: 'Jakarta, Indonesia',
        jobLevel: 'Mid-Senior',
        employmentType: 'Full Time',
        jobFunction: 'IT',
        education: 'Sarjana (S1)',
        salary: { min: 15000000, max: 25000000 },
        postedDate: '2 hari lalu',
        logoUrl: 'https://picsum.photos/seed/cortex/100/100',
    },
    {
        id: '2',
        title: 'HR Generalist',
        company: 'AstraPay',
        location: 'Surabaya, Indonesia',
        jobLevel: 'Associate',
        employmentType: 'Full Time',
        jobFunction: 'HR',
        education: 'Sarjana (S1)',
        salary: { min: 8000000, max: 12000000 },
        postedDate: '5 hari lalu',
        logoUrl: 'https://picsum.photos/seed/astrapay/100/100',
    },
    {
        id: '3',
        title: 'Digital Marketing Intern',
        company: 'Quantum Group',
        location: 'Bandung, Indonesia',
        jobLevel: 'Internship',
        employmentType: 'Internship',
        jobFunction: 'Marketing',
        education: 'Mahasiswa',
        salary: { min: 2000000, max: 4000000 },
        postedDate: '1 minggu lalu',
        logoUrl: 'https://picsum.photos/seed/quantum/100/100',
    },
    {
        id: '4',
        title: 'Backend Engineer (Golang)',
        company: 'Cortex Tech',
        location: 'Remote',
        jobLevel: 'Mid-Senior',
        employmentType: 'Full Time',
        jobFunction: 'IT',
        education: 'Sarjana (S1)',
        salary: { min: 18000000, max: 30000000 },
        postedDate: 'Baru saja',
        logoUrl: 'https://picsum.photos/seed/cortex2/100/100',
    },
    {
        id: '5',
        title: 'Accounting Staff',
        company: 'Sumber Sukses',
        location: 'Medan, Indonesia',
        jobLevel: 'Entry Level',
        employmentType: 'Contractual',
        jobFunction: 'Akuntansi',
        education: 'Diploma',
        salary: { min: 5000000, max: 7000000 },
        postedDate: '3 hari lalu',
        logoUrl: 'https://picsum.photos/seed/sumber/100/100',
    }
];

export const MAX_SALARY = 50000000;