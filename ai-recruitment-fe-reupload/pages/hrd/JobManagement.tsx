import React, { useEffect } from 'react';
import { useHrdStore } from '../../store/useHrdStore';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  BriefcaseIcon,
  MapPinIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const JobManagement: React.FC = () => {
  const { jobPostings, fetchJobPostings, loading } = useHrdStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobPostings(); // 🔥 PENTING
  }, [fetchJobPostings]);

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Manajemen Lowongan</h1>
          <p className="text-gray-500">
            Buat dan kelola lowongan pekerjaan
          </p>
        </div>
        <button
          onClick={() => navigate('/hrd/jobs/new')}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg"
        >
          <PlusIcon className="h-5 w-5" />
          Buat Lowongan Baru
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Judul</th>
              <th className="px-6 py-3">Lokasi</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Penutupan</th>
              <th className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {jobPostings.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold flex gap-3 items-center">
                  <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                  {job.title}
                </td>
                <td className="px-6 py-4">
                  <MapPinIcon className="h-4 w-4 inline mr-1" />
                  {job.location}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {job.closing_date
                    ? format(new Date(job.closing_date), 'dd MMM yyyy', {
                        locale: idLocale,
                      })
                    : '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => navigate(`/hrd/jobs/${job.id}`)}
                    className="mr-2 text-blue-600"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => navigate(`/hrd/jobs/${job.id}/edit`)}
                    className="text-gray-600"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {jobPostings.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  Belum ada lowongan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobManagement;
