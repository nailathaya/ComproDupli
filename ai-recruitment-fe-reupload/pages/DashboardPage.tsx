// import React, { useState, useMemo, useRef, DragEvent, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { useAuthStore } from '../store/useAuthStore';
// import { Profile, WorkExperience, Education, Skill, User, ApplicationHistory, RecruitmentStage, Document } from '../types';
// import { CheckCircleIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, XCircleIcon } from '../components/icons';
// import { getCandidateById } from '@/services/api';

import React, { useState, useMemo, useRef, DragEvent, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Profile, WorkExperience, Education, Skill, Document } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, XCircleIcon } from '../components/icons';
import { getCandidateById } from '../services/api';
import profilePicture from '../components/profile-kandidat.webp';
import {
  updateCandidate,
  updateSalary,
  saveExperiences,
  saveEducations,
  saveSkills,
  saveDocuments,
} from "../services/api";


// Helper function to format date
const formatDate = (dateString: string) => {
    if (!dateString) return 'Sekarang';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    // Adding a timezone specifier to prevent off-by-one day errors
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Consistent class for form inputs
const formInputClass = "w-full bg-white text-black border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";
const formTextareaClass = `${formInputClass} min-h-[80px]`;

// UI Components
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white shadow-md rounded-xl p-6 ${className}`}>
        {children}
    </div>
);

const EditableField: React.FC<{ label: string; value: string; name: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; isEditing: boolean; type?: string }> = ({ label, value, name, onChange, isEditing, type = 'text' }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-500 mb-1">{label}</label>
        {isEditing ? (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={formInputClass}
            />
        ) : (
            <p className="text-gray-800 break-words">{value || '-'}</p>
        )}
    </div>
);

const SectionCard: React.FC<{ title: string; children: React.ReactNode; onAdd?: () => void }> = ({ title, children, onAdd }) => (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">{title}</h3>
            {onAdd && (
                 <button onClick={onAdd} className="flex items-center text-sm text-blue-600 font-semibold hover:text-blue-800">
                    <PlusIcon className="h-5 w-5 mr-1" />
                    Tambah
                </button>
            )}
        </div>
        <div>{children}</div>
    </Card>
);

const FileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

// Main Profile Card
const ProfilUtamaCard: React.FC<{ profile: Profile; setProfile: React.Dispatch<React.SetStateAction<Profile>> }> = ({ profile, setProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: profile.user.name,
        location: profile.user.location,
        email: profile.user.email,
        phoneNumber: profile.user.phoneNumber || '',
    });
    const [profileImage, setProfileImage] = useState(`https://i.pravatar.cc/150?u=${profile.user.email}`);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const triggerFileSelect = () => fileInputRef.current?.click();

    const handleSave = async () => {
  await updateCandidate(profile.user.id, {
    name: formData.name,
    location: formData.location,
    phoneNumber: formData.phoneNumber,
  });

  setProfile(prev =>
    prev
      ? {
          ...prev,
          user: {
            ...prev.user,
            name: formData.name,
            location: formData.location,
            phoneNumber: formData.phoneNumber,
          },
        }
      : prev
  );

  setIsEditing(false);
};



    const handleCancel = () => {
        setFormData({
            name: profile.user.name,
            location: profile.user.location,
            email: profile.user.email,
            phoneNumber: profile.user.phoneNumber || '',
        });
        setIsEditing(false);
    }

    return (
        <Card>
            <div className="flex justify-between items-start flex-wrap gap-6">
                <div className="flex items-start gap-6 flex-grow min-w-[280px]">
                    <div className="relative flex-shrink-0">
                        <img className="h-24 w-24 rounded-full object-cover" src={profilePicture}/>
                        {isEditing && (
                            <>
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                                <button onClick={triggerFileSelect} className="absolute -bottom-1 -right-1 bg-blue-600 p-1.5 rounded-full text-white hover:bg-blue-700" aria-label="Ubah foto profil">
                                    <PencilIcon className="h-4 w-4" />
                                </button>
                            </>
                        )}
                    </div>
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <EditableField label="Nama Lengkap" name="name" value={formData.name} onChange={handleInputChange} isEditing={isEditing} />
                        <EditableField label="Lokasi" name="location" value={formData.location} onChange={handleInputChange} isEditing={isEditing} />
                        <EditableField label="Email" name="email" value={formData.email} onChange={handleInputChange} isEditing={isEditing} type="email" />
                        <EditableField label="Nomor Telepon" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} isEditing={isEditing} type="tel" />
                    </div>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto text-left sm:text-right">
                    <div className="flex items-center justify-start sm:justify-end text-gray-500 mb-4">
                         <EyeIcon className="h-5 w-5 mr-2" />
                         <span className="font-semibold">{profile.user.profileViews || 0}</span>
                         <span className="ml-1">views</span>
                    </div>
                    {isEditing ? (
                        <div className="flex space-x-2 justify-start sm:justify-end">
                            <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Batal</button>
                            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Simpan</button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit Profil
                        </button>
                    )}
                </div>
            </div>
        </Card>
    );
};

// Salary Expectation Card
const SalaryExpectation: React.FC<{ profile: Profile, setProfile: React.Dispatch<React.SetStateAction<Profile>> }> = ({ profile, setProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [salary, setSalary] = useState({
        min: profile.salaryExpectation?.min ?? 0,
        max: profile.salaryExpectation?.max ?? 0,
    }
    );
    useEffect(() => {
  setSalary({
    min: profile.salaryExpectation?.min ?? 0,
    max: profile.salaryExpectation?.max ?? 0,
  });
}, [profile.salaryExpectation]);
    
    const handleSave = async () => {
    try {
        await updateSalary(profile.user.id, {
            min: salary.min,
            max: salary.max,
        });

        setProfile((p) =>
    p
      ? {
          ...p,
          salaryExpectation: {
            min: salary.min,
            max: salary.max,
          },
        }
      : p
    );

        setIsEditing(false);
    } catch (err) {
        console.error("Failed save salary:", err);
        alert("Gagal menyimpan gaji");
    }
    
};


    
    return (
     <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">Ekspektasi Gaji</h3>
            {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-600"><PencilIcon className="h-5 w-5"/></button>
            )}
        </div>
        {isEditing ? (
             <div className="space-y-4">
                <div className="flex space-x-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500">Minimal (per bulan)</label>
                        <input type="number"
                            value={salary.min ?? Number("")}
                            onChange={(e) =>
                                setSalary((s) => ({ ...s, min: Number(e.target.value) || "" }))
                            } className={`mt-1 ${formInputClass}`}/>

                            
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-500">Maksimal (per bulan)</label>
                        <input type="number"
                            value={salary.max ?? Number("")}
                            onChange={(e) =>
                                setSalary((s) => ({ ...s, max: Number(e.target.value) || "" }))
                            } className={`mt-1 ${formInputClass}`}/>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Simpan</button>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Batal</button>
                </div>
             </div>
        ) : (
            <div className="flex space-x-4">
                <div>
                    <label className="text-sm font-medium text-gray-500">Minimal</label>
                    <p className="mt-1 text-gray-800 font-semibold">IDR {(profile.salaryExpectation?.min ?? 0).toLocaleString('id-ID')}</p>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-500">Maksimal</label>
                    <p className="mt-1 text-gray-800 font-semibold">IDR {(profile.salaryExpectation?.max ?? 0).toLocaleString('id-ID')}</p>
                </div>
            </div>
        )}
     </Card>
    );
}

// Work Experience Section
const WorkExperienceSection: React.FC<{ experiences: WorkExperience[]; onUpdate: (exps: WorkExperience[]) => void }> = ({ experiences, onUpdate }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<WorkExperience, 'id'>>({ jobTitle: '', companyName: '', startDate: '', endDate: '', description: '' });

    const handleSave = (id?: string) => {
        if (id) { // Editing
            onUpdate(experiences.map(exp => exp.id === id ? { id, ...formData } : exp));
            setEditingId(null);
        } else { // Adding
            onUpdate([...experiences, { id: Date.now().toString(), ...formData }]);
            setIsAdding(false);
        }
        setFormData({ jobTitle: '', companyName: '', startDate: '', endDate: '', description: '' });
    };

    const handleEditClick = (exp: WorkExperience) => {
        setEditingId(exp.id);
        setFormData({
            jobTitle: exp.jobTitle,
            companyName: exp.companyName,
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description
        });
        setIsAdding(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Anda yakin ingin menghapus pengalaman ini?')) {
            onUpdate(experiences.filter(exp => exp.id !== id));
        }
    };
    
    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ jobTitle: '', companyName: '', startDate: '', endDate: '', description: '' });
    };
    
    const renderForm = (id?: string) => (
        <div className="p-4 border border-gray-300 rounded-md space-y-3 bg-white">
            <input value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} placeholder="Jabatan" className={formInputClass}/>
            <input value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="Nama Perusahaan" className={formInputClass}/>
            <div className="flex gap-2">
                <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} placeholder="Tanggal Mulai" className={formInputClass}/>
                <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} placeholder="Tanggal Selesai" className={formInputClass}/>
            </div>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Deskripsi" className={formTextareaClass}/>
            <div className="flex gap-2">
                <button onClick={() => handleSave(id)} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg">Simpan</button>
                <button onClick={handleCancel} className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-lg">Batal</button>
            </div>
        </div>
    );
    
    return (
        <SectionCard title="Pengalaman Kerja" onAdd={() => { setIsAdding(true); setEditingId(null); }}>
            <div className="space-y-4">
                {isAdding && renderForm()}
                {experiences.map(exp => (
                    <div key={exp.id}>
                         {editingId === exp.id ? renderForm(exp.id) : (
                            <div className="p-4 bg-white border border-gray-300 rounded-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-800">{exp.jobTitle}</p>
                                        <p className="text-sm text-gray-600">{exp.companyName}</p>
                                        <p className="text-xs text-gray-400 mt-1">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                                        <p className="text-sm text-gray-500 mt-2 break-words">{exp.description}</p>
                                    </div>
                                    <div className="flex space-x-2 flex-shrink-0 ml-4">
                                        <button onClick={() => handleEditClick(exp)} className="text-gray-400 hover:text-blue-600"><PencilIcon className="h-5 w-5"/></button>
                                        <button onClick={() => handleDelete(exp.id)} className="text-gray-400 hover:text-red-600"><TrashIcon className="h-5 w-5"/></button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </SectionCard>
    );
};

// Skills Section
const SkillsSection: React.FC<{ skills: Skill[]; onUpdate: (skills: Skill[]) => void }> = ({ skills, onUpdate }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<{name: string, level: Skill['level']}>({ name: '', level: 'Basic' });

    const handleSave = () => {
        if (!formData.name.trim()) return;
        if (editingId) {
            onUpdate(skills.map(s => s.id === editingId ? { ...s, ...formData } : s));
            setEditingId(null);
        } else {
            onUpdate([...skills, { id: Date.now().toString(), ...formData }]);
            setIsAdding(false);
        }
        setFormData({ name: '', level: 'Basic' });
    };

    const handleEditClick = (skill: Skill) => {
        setEditingId(skill.id);
        setFormData({ name: skill.name, level: skill.level });
        setIsAdding(false); // Ensure add form is hidden
    };

    const handleDelete = (id: string) => onUpdate(skills.filter(s => s.id !== id));

    const handleCancel = () => {
        setEditingId(null);
        setIsAdding(false);
        setFormData({ name: '', level: 'Basic' });
    };

    const renderForm = () => (
        <div className="p-4 border border-gray-300 rounded-md mb-4 flex items-end gap-2 bg-white">
            <div className="flex-grow">
                <label className="text-xs">Nama Keahlian</label>
                <input value={formData.name} onChange={e => setFormData(f => ({...f, name: e.target.value}))} className={formInputClass}/>
            </div>
            <div>
                <label className="text-xs">Level</label>
                <select value={formData.level} onChange={e => setFormData(f => ({...f, level: e.target.value as Skill['level']}))} className={formInputClass}>
                    <option>Basic</option><option>Intermediate</option><option>Advanced</option><option>Expert</option>
                </select>
            </div>
            <button onClick={handleSave} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg">Simpan</button>
            <button onClick={handleCancel} className="p-2 text-gray-500 bg-gray-200 rounded-lg"><XCircleIcon className="h-6 w-6"/></button>
        </div>
    );

    return (
        <SectionCard title="Keahlian" onAdd={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', level: 'Basic' }); }}>
            {(isAdding || editingId) && renderForm()}
            <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                    <div key={skill.id} className="group bg-blue-100 text-blue-800 text-sm font-medium pl-3 pr-1 py-1 rounded-full flex items-center">
                        {skill.name} <span className="text-blue-500 ml-1">({skill.level})</span>
                        <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditClick(skill)} className="text-blue-500 hover:text-blue-700"><PencilIcon className="h-4 w-4"/></button>
                            <button onClick={() => handleDelete(skill.id)} className="ml-1 text-blue-400 hover:text-blue-700"><XCircleIcon className="h-4 w-4"/></button>
                        </div>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
};


// Education Section
const EducationSection: React.FC<{ educations: Education[], onUpdate: (edus: Education[]) => void }> = ({ educations, onUpdate }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Education, 'id'>>({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' });

    const handleSave = (id?: string) => {
        if (!formData.institution.trim() || !formData.degree.trim()) {
            alert("Institusi dan Gelar tidak boleh kosong.");
            return;
        }
        if (id) {
            onUpdate(educations.map(edu => edu.id === id ? { id, ...formData } : edu));
            setEditingId(null);
        } else {
            onUpdate([...educations, { id: Date.now().toString(), ...formData }]);
            setIsAdding(false);
        }
        setFormData({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' });
    };

    const handleEditClick = (edu: Education) => {
        setEditingId(edu.id);
        setFormData({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: edu.startDate,
            endDate: edu.endDate
        });
        setIsAdding(false);
    };
    
    const handleDelete = (id: string) => {
         if (window.confirm('Anda yakin ingin menghapus data pendidikan ini?')) {
            onUpdate(educations.filter(edu => edu.id !== id));
        }
    }

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' });
    };
    
    const renderForm = (id?: string) => (
        <div className="p-4 border border-gray-300 rounded-md bg-white space-y-3">
            <input value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} placeholder="Institusi" className={formInputClass}/>
            <div className="flex gap-2">
                <input value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} placeholder="Gelar (Cth: S.Kom)" className={formInputClass}/>
                <input value={formData.fieldOfStudy} onChange={e => setFormData({...formData, fieldOfStudy: e.target.value})} placeholder="Bidang Studi" className={formInputClass}/>
            </div>
            <div className="flex gap-2">
                 <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className={formInputClass}/>
                 <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className={formInputClass}/>
            </div>
            <div className="flex gap-2">
                <button onClick={() => handleSave(id)} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg">Simpan</button>
                <button onClick={handleCancel} className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-lg">Batal</button>
            </div>
        </div>
    );
    
    return (
        <SectionCard title="Pendidikan" onAdd={() => { setIsAdding(true); setEditingId(null); }}>
            <div className="space-y-4">
                {isAdding && renderForm()}
                {educations.map(edu => (
                    <div key={edu.id}>
                        {editingId === edu.id ? renderForm(edu.id) : (
                             <div className="p-4 bg-white border border-gray-300 rounded-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-800">{edu.institution}</p>
                                        <p className="text-sm text-gray-600">{edu.degree}, {edu.fieldOfStudy}</p>
                                        <p className="text-xs text-gray-400 mt-1">{formatDate(edu.startDate)} s/d {formatDate(edu.endDate)}</p>
                                    </div>
                                    <div className="flex space-x-2 flex-shrink-0 ml-4">
                                        <button onClick={() => handleEditClick(edu)} className="text-gray-400 hover:text-blue-600"><PencilIcon className="h-5 w-5"/></button>
                                        <button onClick={() => handleDelete(edu.id)} className="text-gray-400 hover:text-red-600"><TrashIcon className="h-5 w-5"/></button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </SectionCard>
    );
};

const ConfirmationDialog: React.FC<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ title, message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-600">{message}</p>
            <div className="mt-6 flex justify-end space-x-3">
                <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Batal
                </button>
                <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
                    Hapus
                </button>
            </div>
        </div>
    </div>
);


// const DocumentUploadSection: React.FC<{ documents: Document[]; onUpdate: (docs: Document[]) => void }> = ({ documents = [], onUpdate }) => {
//     // --- Common State & Memos ---
//     const [error, setError] = useState('');
//     const resume = useMemo(() => documents.find(doc => doc.type === 'resume'), [documents]);
//     const certificates = useMemo(() => documents.filter(doc => doc.type === 'certificate'), [documents]);
    
//     // --- Reusable Uploader UI ---
    const UploaderUI: React.FC<{
        stagedFiles: File[];
        onFileRemove: (fileName: string) => void;
        onFilesAdd: (files: File[]) => void;
        onSave: () => void;
        onCancel: () => void;
        accept: string;
        multiple: boolean;
    }> = ({ stagedFiles, onFileRemove, onFilesAdd, onSave, onCancel, accept, multiple }) => {
        const [isDragging, setIsDragging] = useState(false);
        const inputRef = useRef<HTMLInputElement>(null);

        const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
        const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
        const handleDrop = (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) onFilesAdd(Array.from(e.dataTransfer.files));
        };
        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) onFilesAdd(Array.from(e.target.files));
        };

        return (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4 mt-2">
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragging ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-300'}`}
                >
                    <p className="text-sm text-black">Seret & lepas file di sini atau</p>
                    <button type="button" className="text-sm font-semibold text-blue-600 hover:underline mt-1">
                        Pilih File
                    </button>
                    <input type="file" accept={accept} ref={inputRef} onChange={handleFileChange} className="hidden" multiple={multiple} />
                </div>
                {stagedFiles.length > 0 && <div className="space-y-2 max-h-40 overflow-y-auto p-1">{stagedFiles.map(file => (<div key={file.name} className="flex items-center justify-between p-2 bg-white border rounded-md text-sm"><span className="text-gray-800 truncate">{file.name}</span><button onClick={() => onFileRemove(file.name)}><XCircleIcon className="h-5 w-5 text-gray-400 hover:text-red-500"/></button></div>))}</div>}
                <div className="flex justify-end gap-2 pt-2"><button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Batal</button><button onClick={onSave} disabled={stagedFiles.length === 0} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors">Simpan</button></div>
            </div>
        );
    };

//     // --- Resume State & Logic ---
//     const [isAddingResume, setIsAddingResume] = useState(false);
//     const [stagedResume, setStagedResume] = useState<File | null>(null);
//     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//     const formatBytes = (bytes?: number, decimals = 2) => {
//         if (!bytes || bytes === 0) return '0 Bytes';
//         const k = 1024;
//         const dm = decimals < 0 ? 0 : decimals;
//         const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
//     };

//     const handleAddStagedResume = (files: File[]) => {
//         const file = files[0];
//         if (!file) return;

//         setError('');
//         const allowedFormats = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
//         if (!allowedFormats.includes(file.type)) {
//             setError("Format file tidak didukung. Gunakan PDF, DOC, atau DOCX.");
//             return;
//         }

//         const maxSize = 5 * 1024 * 1024; // 5 MB
//         if (file.size > maxSize) {
//             setError("Ukuran file melebihi batas 5 MB.");
//             return;
//         }
//         setStagedResume(file);
//     };
    
//     const handleSaveResume = () => {
//         if (!stagedResume) return;
//         const newResume: Document = {
//             id: `resume-${Date.now()}`,
//             type: 'resume',
//             name: stagedResume.name,
//             fileSize: stagedResume.size,
//             uploadedAt: new Date().toISOString(),
//             url: URL.createObjectURL(stagedResume)
//         };
//         onUpdate([...certificates, newResume]);
//         setStagedResume(null);
//         setIsAddingResume(false);
//     };
    
//     const handleConfirmDelete = () => {
//         onUpdate(certificates);
//         setShowDeleteConfirm(false);
//     };

//     // --- Certificate State & Logic ---
//     const [isAddingCerts, setIsAddingCerts] = useState(false);
//     const [stagedCerts, setStagedCerts] = useState<File[]>([]);
    
//     const handleSaveCerts = () => {
//         if (stagedCerts.length === 0) return;
//         const newCertDocs: Document[] = stagedCerts.map((file, index) => ({
//             id: `cert-${Date.now()}-${index}`,
//             type: 'certificate', name: file.name, url: '#', uploadedAt: new Date().toISOString(),
//         }));
//         onUpdate(resume ? [resume, ...certificates, ...newCertDocs] : [...certificates, ...newCertDocs]);
//         setStagedCerts([]);
//         setIsAddingCerts(false);
//     };

//     const handleDeleteCertificate = (docToDelete: Document) => {
//         if (window.confirm(`Anda yakin ingin menghapus "${docToDelete.name}"?`)) {
//              onUpdate(documents.filter(doc => doc.id !== docToDelete.id));
//         }
//     };
    
//     return (
//         <SectionCard title="Dokumen Unggahan">
//             {showDeleteConfirm && (
//                 <ConfirmationDialog
//                     title="Hapus Resume?"
//                     message="Resume yang dihapus tidak dapat dikembalikan."
//                     onConfirm={handleConfirmDelete}
//                     onCancel={() => setShowDeleteConfirm(false)}
//                 />
//             )}
//             <div className="space-y-6">
//                 {/* --- New Resume Section --- */}
//                 <div>
//                     <h4 className="font-semibold text-gray-700 mb-2">Resume</h4>
//                     {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
                    
//                     {resume ? (
//                         <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
//                             <p className="font-bold text-gray-800">Resume Anda</p>
//                             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
//                                 <p className="text-sm text-gray-600 truncate">
//                                     <span className="font-medium text-black">{resume.name}</span> – {formatBytes(resume.fileSize)} – Diunggah pada {formatDate(resume.uploadedAt)}
//                                 </p>
//                                 <div className="flex items-center gap-3 flex-shrink-0">
//                                     <a href={resume.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline">Lihat</a>
//                                     <button onClick={() => setShowDeleteConfirm(true)} className="text-sm font-semibold text-red-600 hover:underline">Hapus</button>
//                                 </div>
//                             </div>
//                              <p className="text-xs text-gray-500 mt-2">Anda hanya dapat mengupload satu resume.</p>
//                         </div>
//                     ) : isAddingResume ? (
//                         <UploaderUI
//                             stagedFiles={stagedResume ? [stagedResume] : []}
//                             onFileRemove={() => setStagedResume(null)}
//                             onFilesAdd={handleAddStagedResume}
//                             onSave={handleSaveResume}
//                             onCancel={() => { setIsAddingResume(false); setError(''); setStagedResume(null); }}
//                             accept=".pdf,.doc,.docx"
//                             multiple={false}
//                         />
//                     ) : (
//                         <button onClick={() => { setIsAddingResume(true); setError(''); }} className="w-full mt-3 border-2 border-dashed border-gray-300 rounded-lg py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center">
//                            <PlusIcon className="h-5 w-5 mr-2" />
//                            Add Submission
//                        </button>
//                     )}
//                 </div>

//                 {/* --- Certificate Section (Preserved) --- */}
//                 <div>
//                     <h4 className="font-semibold text-gray-700 mb-2">Sertifikat</h4>
//                      <div className="space-y-2">
//                         {certificates.map(cert => (
//                            <div key={cert.id} className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
//                                <div className="flex items-center gap-3 min-w-0">
//                                    <FileIcon className="h-6 w-6 text-gray-500 flex-shrink-0" />
//                                    <p className="text-sm font-medium text-gray-800 truncate" title={cert.name}>{cert.name}</p>
//                                </div>
//                                <button onClick={() => handleDeleteCertificate(cert)} className="text-gray-400 hover:text-red-600 flex-shrink-0 ml-2">
//                                    <TrashIcon className="h-5 w-5" />
//                                </button>
//                            </div>
//                         ))}
//                     </div>
//                      {isAddingCerts ? (
//                         <UploaderUI
//                             stagedFiles={stagedCerts}
//                             onFileRemove={(name) => setStagedCerts(f => f.filter(file => file.name !== name))}
//                             onFilesAdd={(files) => setStagedCerts(f => [...f, ...files])}
//                             onSave={handleSaveCerts}
//                             onCancel={() => setIsAddingCerts(false)}
//                             accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
//                             multiple={true}
//                         />
//                     ) : (
//                        <button onClick={() => setIsAddingCerts(true)} className="w-full mt-3 border-2 border-dashed border-gray-300 rounded-lg py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center">
//                            <PlusIcon className="h-5 w-5 mr-2" />
//                            Add Submission
//                        </button>
//                     )}
//                 </div>
//             </div>
//         </SectionCard>
//     );
// };


// const DashboardPage: React.FC = () => {
//     const { user } = useAuthStore();
//     const [profile, setProfile] = useState<Profile | null>(null);
//     const [searchParams] = useSearchParams();

//     useEffect(() => {
//         if (!user) return;

//         setProfile({
//             user: {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             location: user.location || '',
//             onlineStatus: user.onlineStatus || 'offline',
//             role: user.role,
//             phoneNumber: '',
//             profileViews: 0,
//             },
//             salaryExpectation: { min: 0, max: 0 },
//             workExperience: [],
//             education: [],
//             skills: [],
//             applicationHistory: [],
//             documents: [],
//         });
//         }, [user]);


//     useEffect(() => {
//         const highlightId = searchParams.get('highlight');
//         if (!highlightId) return;

//         const element = document.getElementById(highlightId);
//         if (element) {
//             setTimeout(() => {
//                 element.scrollIntoView({ behavior: 'smooth', block: 'center' });
//                 element.classList.add('highlight-section');
//                 setTimeout(() => element.classList.remove('highlight-section'), 3000);
//             }, 100);
//         }
//     }, [searchParams]);

//     if (!user) {
//         return <div>Loading user...</div>;
//     }

//     return (
//         <div className="container mx-auto p-4 sm:p-6 lg:p-8">
//             <div className="space-y-6">
//                 <ProfilUtamaCard profile={profile} setProfile={setProfile} />
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     <div className="lg:col-span-2 space-y-6">
//                         <WorkExperienceSection experiences={profile.workExperience || []} onUpdate={exps => setProfile(p => ({...p, workExperience: exps}))}/>
//                         <EducationSection educations={profile.education || []} onUpdate={edus => setProfile(p => ({...p, education: edus}))} />
//                         <SkillsSection skills={profile.skills || []} onUpdate={newSkills => setProfile(p => ({...p, skills: newSkills}))} />
//                     </div>
//                     <div className="space-y-6">
//                         <SalaryExpectation profile={profile} setProfile={setProfile} />
//                         <DocumentUploadSection 
//                             documents={profile.documents || []} 
//                             onUpdate={docs => setProfile(p => ({ ...p, documents: docs }))} 
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default DashboardPage;

const DocumentUploadSection: React.FC<{
  documents: Document[];
  onUpdate: (docs: Document[]) => void;
}> = ({ documents = [], onUpdate }) => {

  // =========================
  // MEMO
  // =========================
  const resume = useMemo(
    () => documents.find(d => d.type === 'resume'),
    [documents]
  );

  const certificates = useMemo(
    () => documents.filter(d => d.type === 'certificate'),
    [documents]
  );

  // =========================
  // RESUME STATE
  // =========================
  const [isAddingResume, setIsAddingResume] = useState(false);
  const [stagedResume, setStagedResume] = useState<File | null>(null);
  const [error, setError] = useState('');

  // =========================
  // CERTIFICATE STATE (WITH DESCRIPTION)
  // =========================
  type StagedCertificate = {
    file: File;
    description: string;
  };

  const [isAddingCerts, setIsAddingCerts] = useState(false);
  const [stagedCerts, setStagedCerts] = useState<StagedCertificate[]>([]);

  // =========================
  // RESUME HANDLER
  // =========================
  const handleAddResume = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    setError('');
    setStagedResume(file);
  };

  const handleSaveResume = () => {
    if (!stagedResume) return;

    const newResume: Document = {
      id: `resume-${Date.now()}`,
      type: 'resume',
      file_name: stagedResume.name,
      fileSize: stagedResume.size,
      uploadedAt: new Date().toISOString(),
      file_url: URL.createObjectURL(stagedResume),
    };

    onUpdate([...certificates, newResume]);
    setStagedResume(null);
    setIsAddingResume(false);
  };

  // =========================
  // CERTIFICATE HANDLER
  // =========================
  const handleSaveCerts = () => {
    if (stagedCerts.length === 0) return;

    const newCertDocs: Document[] = stagedCerts.map(
      ({ file, description }, idx) => ({
        id: `cert-${Date.now()}-${idx}`,
        type: 'certificate',
        file_name: file.name,
        description,
        uploaded_at: new Date().toISOString(),
        file_url: '#',
      })
    );

    onUpdate(
      resume
        ? [resume, ...certificates, ...newCertDocs]
        : [...certificates, ...newCertDocs]
    );

    setStagedCerts([]);
    setIsAddingCerts(false);
  };

  // =========================
  // RENDER
  // =========================
  return (
    <SectionCard title="Dokumen Unggahan">
      <div className="space-y-6">

        {/* ================= RESUME ================= */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Resume</h4>

          {resume ? (
            <div className="p-3 bg-gray-50 border rounded-lg">
              <p className="font-medium text-gray-800">{resume.file_name}</p>
            </div>
          ) : isAddingResume ? (
            <UploaderUI
              stagedFiles={stagedResume ? [stagedResume] : []}
              onFileRemove={() => setStagedResume(null)}
              onFilesAdd={handleAddResume}
              onSave={handleSaveResume}
              onCancel={() => {
                setIsAddingResume(false);
                setStagedResume(null);
              }}
              accept=".pdf,.doc,.docx"
              multiple={false}
            />
          ) : (
            <button
              onClick={() => setIsAddingResume(true)}
              className="w-full border-2 border-dashed rounded-lg py-2 text-gray-600"
            >
              + Add Resume
            </button>
          )}

          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>

        {/* ================= CERTIFICATE ================= */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Sertifikat</h4>

          {/* Existing certificates */}
          {certificates.map(cert => (
            <div
              key={cert.id}
              className="p-3 bg-gray-50 border rounded-lg mb-2"
            >
              <p className="font-medium text-gray-800">{cert.file_name}</p>
              {cert.description && (
                <p className="text-sm text-gray-600">{cert.description}</p>
              )}
            </div>
          ))}

          {/* Upload cert */}
          {isAddingCerts ? (
            <div className="space-y-3">
              <UploaderUI
                stagedFiles={stagedCerts.map(c => c.file)}
                onFileRemove={(name) =>
                  setStagedCerts(prev =>
                    prev.filter(c => c.file.name !== name)
                  )
                }
                onFilesAdd={(files) =>
                  setStagedCerts(prev => [
                    ...prev,
                    ...files.map(file => ({
                      file,
                      description: '',
                    })),
                  ])
                }
                onSave={handleSaveCerts}
                onCancel={() => {
                  setIsAddingCerts(false);
                  setStagedCerts([]);
                }}
                accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                multiple
              />

              {/* INPUT DESKRIPSI */}
              {stagedCerts.map((item, idx) => (
                <div
                  key={item.file.name}
                  className="p-3 bg-white border rounded-lg"
                >
                  <p className="text-sm font-medium">{item.file.name}</p>
                  <input
                    type="text"
                    placeholder="Deskripsi sertifikat"
                    value={item.description}
                    onChange={(e) =>
                      setStagedCerts(prev =>
                        prev.map((c, i) =>
                          i === idx
                            ? { ...c, description: e.target.value }
                            : c
                        )
                      )
                    }
                    className={`${formInputClass} mt-2`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <button
              onClick={() => setIsAddingCerts(true)}
              className="w-full border-2 border-dashed rounded-lg py-2 text-gray-600"
            >
              + Add Certificate
            </button>
          )}
        </div>
      </div>
    </SectionCard>
  );
};


const DashboardPage: React.FC = () => {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [searchParams] = useSearchParams();


    const refetchProfile = async () => {
  if (!user?.id) return;

  const res = await getCandidateById(user.id);

  setProfile({
    user: {
      id: res.user.id,
      name: res.user.name,
      email: res.user.email,
      location: res.user.location ?? '',
      phoneNumber: res.user.phoneNumber ?? '',
      role: res.user.role,
      onlineStatus: res.user.onlineStatus ?? 'offline',
      profileViews: res.user.profileViews ?? 0,
      avatarUrl: res.user.avatarUrl,
    },

    salaryExpectation: res.salaryExpectation ?? { min: 0, max: 0 },
    workExperience: res.workExperience ?? [],
    education: res.education ?? [],
    skills: res.skills ?? [],
    documents: res.documents ?? [],
    applicationHistory: res.applicationHistory ?? [],
  });
};


    useEffect(() => {
        if (!user?.id) return;
        refetchProfile();
    }, [user?.id]);
    // useEffect(() => {
    //     if (!user?.id) return;
        
    //     const fetchProfile = async () => {
    //         try {
    //             const res = await getCandidateById(user.id);

    //             const normalizedProfile: Profile = {
    //                 user: {
    //                     id: res.id ?? res.user_id,
    //                     name: res.name,
    //                     email: res.email,
    //                     location: res.location ?? '',
    //                     onlineStatus: res.online_status ?? 'offline',
    //                     role: res.role,
    //                     phoneNumber: res.phone_number ?? '',
    //                     profileViews: res.profile_views ?? 0,
    //                 },
    //                 salaryExpectation: res.salary_expectation ?? { min: 0, max: 0 },
    //                 workExperience: res.work_experience ?? [],
    //                 education: res.education ?? [],
    //                 skills: res.skills ?? [],
    //                 applicationHistory: res.application_history ?? [],
    //                 documents: res.documents ?? [],
    //             };

    //             setProfile(normalizedProfile);
    //         } catch (err) {
    //             console.error('Failed fetch profile:', err);
    //         }
    //     };

    //     fetchProfile();
    // }, [user]);

    // =========================
    // HIGHLIGHT SECTION (QUERY)
    // =========================
    useEffect(() => {
        if (!profile) return;

        const highlightId = searchParams.get('highlight');
        if (!highlightId) return;

        const element = document.getElementById(highlightId);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('highlight-section');
                setTimeout(() => element.classList.remove('highlight-section'), 3000);
            }, 100);
        }
    }, [searchParams, profile]);

    // =========================
    // GUARD RENDER
    // =========================
    if (!user || !profile) {
        return (
            <div className="p-8 text-center text-gray-500">
                Memuat dashboard...
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
                <ProfilUtamaCard
                    profile={profile}
                    setProfile={setProfile}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <WorkExperienceSection
                            experiences={profile.workExperience}
                            onUpdate={async (exps) => {
                                
                                setProfile(p => p ? { ...p, workExperience: exps } : p);
                                await saveExperiences(profile.user.id, exps);
                        }}
                        />
                        <EducationSection
                            educations={profile.education}
                            onUpdate={async (edus) => {
                                setProfile(p => p ? { ...p, education: edus } : p);
                                
                                await saveEducations(profile.user.id, edus);
                            }}
                        />

                        <SkillsSection
                            skills={profile.skills}
                            onUpdate={async (skills) => {
                                
                                setProfile(p => p ? { ...p, skills } : p);
                                await saveSkills(profile.user.id, skills);
                            }}
                        />
                    </div>

                    <div className="space-y-6">
                        {<SalaryExpectation profile={profile} setProfile={setProfile} />/* <SalaryExpectation
                            salary_expectation={profile.salary_expectation}
                            onUpdate={async (salary_expectation) => {
                                
                                setProfile(p => p ? { ...p, salary_expectation } : p);
                                await updateSalary(profile.user.id, salary_expectation);
                            }}
                        /> */}

                        <DocumentUploadSection
                            documents={profile.documents}
                            onUpdate={async (docs) => {
                                
                                setProfile(p => p ? { ...p, documents: docs } : p);
                                await saveDocuments(profile.user.id, docs);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;