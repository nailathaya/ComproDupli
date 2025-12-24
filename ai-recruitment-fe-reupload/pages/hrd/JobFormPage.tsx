import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHrdStore } from '../../store/useHrdStore';
import { JobPosition, JobRequirements } from '../../types';
import { ChevronLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createJobPosting,updateJobPosting } from '../../services/api';


const INITIAL_REQUIREMENTS: JobRequirements = {
    education: 'Sarjana (S1)',
    experience_years: 0,
    certifications: [],
    skills: []
};

const INITIAL_JOB = {
  title: '',
  department: '',
  location: '',
  employmentType: 'Full Time',
  jobDescription: '',
  closingDate: '',
  openPositions: 1,
  status: 'Draft',
};


const JobFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // const { addJob, updateJob, getJobById } = useHrdStore();
    const { jobPostings } = useHrdStore();
    
    const [formData, setFormData] = useState<typeof INITIAL_JOB>(INITIAL_JOB);
    const [requirements, setRequirements] = useState<JobRequirements>(INITIAL_REQUIREMENTS);
    const [newCert, setNewCert] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    useEffect(() => {
  if (!id) return;

  const job = jobPostings.find(j => String(j.id) === id);
  if (!job) return;

  setFormData({
    title: job.title,
    department: job.department,
    location: job.location,

    // 🔥 FIX FIELD NAMES
    employmentType: job.employment_type,
    jobDescription: job.description,

    closingDate: job.closing_date ?? '',
    openPositions: job.required_candidates,
    status: job.status,
  });

  setRequirements({
    education: job.min_education,
    experience_years: job.min_experience_years,

    skills: job.skills ?? [],
    certifications: job.certifications ?? [],
  });
}, [id, jobPostings]);


    const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleRequirementChange = (field: keyof JobRequirements, value: any) => {
        setRequirements(prev => ({ ...prev, [field]: value }));
    };

    const addCertification = () => {
        if (!newCert.trim()) return;
        setRequirements(prev => ({
            ...prev,
            certifications: [...prev.certifications, newCert.trim()]
        }));
        setNewCert('');
    };

    const removeCertification = (index: number) => {
        setRequirements(prev => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index)
        }));
    };

    const addSkill = (e?: React.KeyboardEvent) => {
        if (e && e.key !== 'Enter') return;
        if (e) e.preventDefault();
        
        if (!newSkill.trim()) return;
        if (!requirements.skills.includes(newSkill.trim())) {
             setRequirements(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
        }
        setNewSkill('');
    };

    const removeSkill = (skillToRemove: string) => {
        setRequirements(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove)
        }));
    };

    const validate = () => {
        const newErrors: {[key: string]: string} = {};
        if (!formData.title?.trim()) newErrors.title = 'Judul posisi wajib diisi';
        if (!formData.department?.trim()) newErrors.department = 'Departemen wajib diisi';
        if (!formData.location?.trim()) newErrors.location = 'Lokasi wajib diisi';
        if (!formData.jobDescription?.trim()) newErrors.jobDescription = 'Deskripsi pekerjaan wajib diisi';
        if (requirements.skills.length === 0) newErrors.skills = 'Minimal satu keahlian wajib diisi';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (status: 'Draft' | 'Published') => {
  if (status === 'Published' && !validate()) return;

  setIsSubmitting(true);

  const payload = {
    title: formData.title!,
    department: formData.department!,
    employment_type: formData.employmentType!,
    location: formData.location!,
    description: formData.jobDescription!,
    min_education: requirements.education,
    min_experience_years: requirements.experience_years,
    closing_date: formData.closingDate || undefined,
    required_candidates: formData.openPositions || 1,
    skills: requirements.skills,
    certifications: requirements.certifications,
    status: status.toLowerCase(),
  };

  try {
    if (id) {
      // 🔥 EDIT MODE
      await updateJobPosting(id, payload);
    } else {
      // 🔥 CREATE MODE
      await createJobPosting(payload);
    }

    navigate('/hrd/jobs');
  } finally {
    setIsSubmitting(false);
  }
};

    const inputClass = (name: string) => `w-full border rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'}`;
    const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <button onClick={() => navigate('/hrd/jobs')} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6">
                <ChevronLeftIcon className="h-4 w-4" />
                Kembali ke Daftar Lowongan
            </button>

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-black">{id ? 'Edit Lowongan' : 'Buat Lowongan Baru'}</h1>
                <p className="text-gray-500 mt-1">Lengkapi informasi di bawah ini untuk mempublikasikan lowongan pekerjaan.</p>
            </header>

            <div className="space-y-8">
                {/* Section A: Informasi Dasar */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-black mb-6 pb-2 border-b border-gray-100">Informasi Dasar</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Judul Posisi <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                name="title" 
                                value={formData.title} 
                                onChange={handleBasicChange} 
                                className={inputClass('title')}
                                placeholder="Contoh: Senior Frontend Developer"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Departemen/Divisi <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                name="department" 
                                value={formData.department} 
                                onChange={handleBasicChange} 
                                className={inputClass('department')}
                                placeholder="Contoh: Engineering"
                            />
                             {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Tipe Pekerjaan</label>
                            <select 
                                name="employmentType" 
                                value={formData.employmentType} 
                                onChange={handleBasicChange} 
                                className={inputClass('employmentType')}
                            >
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Contractual">Contractual</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Lokasi Kerja <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                name="location" 
                                value={formData.location} 
                                onChange={handleBasicChange} 
                                className={inputClass('location')}
                                placeholder="Contoh: Jakarta (Hybrid)"
                            />
                             {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Deskripsi Pekerjaan <span className="text-red-500">*</span></label>
                            <textarea 
                                name="jobDescription" 
                                value={formData.jobDescription} 
                                onChange={handleBasicChange} 
                                className={`${inputClass('jobDescription')} h-40`}
                                placeholder="Jelaskan tanggung jawab dan detail pekerjaan..."
                            ></textarea>
                             {errors.jobDescription && <p className="text-red-500 text-xs mt-1">{errors.jobDescription}</p>}
                        </div>
                    </div>
                </div>

                {/* Section B: Persyaratan Kandidat */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-black mb-6 pb-2 border-b border-gray-100">Persyaratan Kandidat</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Pendidikan Minimal</label>
                            <select 
                                value={requirements.education} 
                                onChange={(e) => handleRequirementChange('education', e.target.value)} 
                                className={inputClass('education')}
                            >
                                <option value="SMA/SMK">SMA/SMK</option>
                                <option value="Diploma">Diploma</option>
                                <option value="Sarjana (S1)">Sarjana (S1)</option>
                                <option value="Magister (S2)">Magister (S2)</option>
                                <option value="Doktor (S3)">Doktor (S3)</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Minimal Pengalaman (Tahun)</label>
                            <input 
                                type="number" 
                                min="0" 
                                value={requirements.experience_years} 
                                onChange={(e) => handleRequirementChange('experience_years', parseInt(e.target.value) || 0)} 
                                className={inputClass('experience_years')}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Keahlian Wajib (Tekan Enter) <span className="text-red-500">*</span></label>
                            <div className={`flex flex-wrap items-center gap-2 p-2 border rounded-lg ${errors.skills ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'}`}>
                                {requirements.skills.map((skill) => (
                                    <span key={skill} className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center">
                                        {skill}
                                        <button onClick={() => removeSkill(skill)} className="ml-1.5 text-blue-600 hover:text-blue-900 focus:outline-none">
                                            <XMarkIcon className="h-4 w-4" />
                                        </button>
                                    </span>
                                ))}
                                <input 
                                    type="text" 
                                    value={newSkill} 
                                    onChange={(e) => setNewSkill(e.target.value)} 
                                    onKeyDown={addSkill}
                                    className="flex-grow min-w-[150px] outline-none bg-transparent text-black placeholder-gray-400 p-1"
                                    placeholder={requirements.skills.length === 0 ? "Ketik skill lalu tekan Enter..." : ""}
                                />
                            </div>
                            {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
                        </div>

                         <div className="md:col-span-2">
                            <label className={labelClass}>Sertifikasi (Opsional)</label>
                            <div className="flex gap-2 mb-2">
                                <input 
                                    type="text" 
                                    value={newCert} 
                                    onChange={(e) => setNewCert(e.target.value)} 
                                    className={inputClass('cert')}
                                    placeholder="Contoh: Google Cloud Professional Architect"
                                />
                                <button onClick={addCertification} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 rounded-lg font-medium transition-colors">Tambah</button>
                            </div>
                            <ul className="space-y-2">
                                {requirements.certifications.map((cert, idx) => (
                                    <li key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700">
                                        {cert}
                                        <button onClick={() => removeCertification(idx)} className="text-red-500 hover:text-red-700 font-medium text-xs">Hapus</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Section C: Informasi Tambahan */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-black mb-6 pb-2 border-b border-gray-100">Informasi Tambahan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div>
                            <label className={labelClass}>Tanggal Penutupan</label>
                            <input 
                                type="date" 
                                name="closingDate"
                                value={formData.closingDate} 
                                onChange={handleBasicChange}
                                className={inputClass('closingDate')}
                            />
                        </div>

                         <div>
                            <label className={labelClass}>Jumlah Kandidat Dibutuhkan</label>
                            <input 
                                type="number" 
                                min="1"
                                name="openPositions"
                                value={formData.openPositions} 
                                onChange={handleBasicChange}
                                className={inputClass('openPositions')}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-4 pt-4">
                    <button 
                        onClick={() => handleSubmit('Draft')}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        Simpan Draft
                    </button>
                    <button 
                         onClick={() => handleSubmit('Published')}
                         disabled={isSubmitting}
                         className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                        {isSubmitting ? 'Menyimpan...' : 'Publish Lowongan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobFormPage;