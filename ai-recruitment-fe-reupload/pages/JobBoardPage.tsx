import React, { useEffect, useState, useCallback } from 'react';
import { useJobStore } from '../store/useJobStore';
import { Job, SelectedFilters } from '../types';
import { SearchIcon, ChevronDownIcon, MenuIcon } from '../components/icons';
import { FILTER_OPTIONS, MAX_SALARY } from '../constants';

import { applyJob } from '../services/api';
//
const JobCard: React.FC<{ job: Job }> = ({ job }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <img src={job.logoUrl} alt={`${job.company} logo`} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
            <p className="text-gray-600">{job.company} - {job.location}</p>
            <p className="text-sm text-gray-500 mt-1">IDR {job.salary.min.toLocaleString('id-ID')} - {job.salary.max.toLocaleString('id-ID')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">{job.jobLevel}</span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">{job.employmentType}</span>
            </div>
        </div>
        <div className="flex-shrink-0 text-right w-full sm:w-auto">
            <button onClick={() => applyJob(job.id)}
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Lamar</button>
            <p className="text-xs text-gray-400 mt-2">Diposting {job.postedDate}</p>
        </div>
    </div>
);

const FilterButton: React.FC<{
    label: string;
    filterType: keyof SelectedFilters;
    value: string;
}> = ({ label, filterType, value }) => {
    const { selectedFilters, updateFilterSelection } = useJobStore();
    const isSelected = selectedFilters[filterType].includes(value);

    const handleClick = () => {
        const currentSelection = selectedFilters[filterType];
        const newSelection = isSelected
            ? currentSelection.filter(item => item !== value)
            : [...currentSelection, value];
        updateFilterSelection(filterType, newSelection);
    };

    return (
        <button
            onClick={handleClick}
            className={`border rounded-md px-3 py-1 text-sm transition-colors duration-200 ${
                isSelected
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-black border-gray-300 hover:border-blue-500'
            }`}
        >
            {label}
        </button>
    );
};

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-4 border-b">
        <h4 className="font-semibold mb-3 text-gray-700">{title}</h4>
        <div className="flex flex-wrap gap-2">
            {children}
        </div>
    </div>
);


const JobFilters: React.FC = () => {
    const { salaryRange, setSalaryRange, resetFilters } = useJobStore();
    
    const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSalaryRange([salaryRange[0], parseInt(e.target.value, 10)]);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Filter</h3>
                <button onClick={resetFilters} className="text-sm text-blue-600 hover:underline">Atur Ulang</button>
            </div>
            
            <FilterSection title="Tingkat Pekerjaan">
                {FILTER_OPTIONS.jobLevel.map(level => <FilterButton key={level} label={level} filterType="jobLevel" value={level} />)}
            </FilterSection>

            <FilterSection title="Tipe Anjuran">
                {FILTER_OPTIONS.employmentType.map(type => <FilterButton key={type} label={type} filterType="employmentType" value={type} />)}
            </FilterSection>

            <FilterSection title="Fungsi Pekerjaan">
                {FILTER_OPTIONS.jobFunction.map(func => <FilterButton key={func} label={func} filterType="jobFunction" value={func} />)}
            </FilterSection>

            <div className="py-4 border-b">
                <h4 className="font-semibold mb-3 text-gray-700">Gaji (Maksimal per bulan)</h4>
                <input
                    type="range"
                    min="0"
                    max={MAX_SALARY}
                    step="1000000"
                    value={salaryRange[1]}
                    onChange={handleSalaryChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center mt-2 font-medium text-gray-600">
                    IDR {salaryRange[1].toLocaleString('id-ID')}
                </div>
            </div>
        </div>
    );
};

const JobBoardPage: React.FC = () => {
    const { filteredJobs, loading, fetchJobs, searchQuery, setSearchQuery } = useJobStore();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        fetchJobs(); // ⬅️ real backend
    }, []);

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-6">
                <h1 className="text-4xl font-bold text-gray-800">Cari Lowongan</h1>
                <p className="text-gray-500 mt-1">Temukan pekerjaan impian Anda berikutnya.</p>
            </header>

            <div className="flex items-center mb-6 gap-4">
                <div className="relative flex-grow">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan jabatan, perusahaan, atau kata kunci"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    className="lg:hidden p-3 bg-white border border-gray-300 rounded-lg"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                    <MenuIcon className="h-6 w-6 text-gray-700" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className={`lg:col-span-1 lg:block ${isFilterOpen ? 'block' : 'hidden'}`}>
                    <JobFilters />
                </aside>
                <main className="lg:col-span-3">
                    {loading ? (
                        <div className="text-center py-10">Memuat lowongan...</div>
                    ) : (
                        <div className="space-y-6">
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map(job => <JobCard key={job.id} job={job} />)
                            ) : (
                                <div className="bg-white p-10 text-center rounded-lg shadow-md">
                                    <h3 className="text-xl font-semibold">Tidak ada lowongan yang cocok</h3>
                                    <p className="text-gray-500 mt-2">Coba sesuaikan filter pencarian Anda.</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default JobBoardPage;
