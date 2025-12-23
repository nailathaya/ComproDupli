
import React, { useState } from 'react';
import { ArrowDownTrayIcon, ServerIcon } from '@heroicons/react/24/outline';

const BackupBox: React.FC = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState('');

    const handleDownload = async () => {
        setIsDownloading(true);
        setError('');
        try {
            // In a real app, this would be an API call to a backend endpoint.
            // For example:
            // const response = await api.get('/hrd/backup/download', { responseType: 'blob' });
            // const blob = new Blob([response.data], { type: 'application/zip' });
            
            // Simulating a download for demonstration purposes.
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockData = "Ini adalah file backup dummy yang dihasilkan secara lokal.";
            const blob = new Blob([mockData], { type: 'application/zip' });
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            a.download = `backup-data-recruitment-${timestamp}.zip`;
            
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (err) {
            console.error("Download failed:", err);
            setError("Gagal mengunduh backup data. Silakan coba lagi.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-black flex items-center">
                <ServerIcon className="h-6 w-6 mr-3" />
                Cadangan Data Manual (Backup)
            </h2>
            <p className="mt-4 text-black">
                Harap lakukan pencadangan data manual secara berkala ke server lokal untuk menjaga keamanan dan integritas data.
            </p>
            <div className="mt-6">
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    <ArrowDownTrayIcon className={`h-5 w-5 mr-2 ${isDownloading ? 'animate-bounce' : ''}`} />
                    {isDownloading ? 'Mengunduh...' : 'Download Backup Data'}
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default BackupBox;