
import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const SecurityBox: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-black flex items-center">
                <ShieldCheckIcon className="h-6 w-6 mr-3" />
                Keamanan & Pembatasan Akses
            </h2>
            <p className="mt-4 text-black">
                Akses ke dasbor ini dibatasi hanya untuk peran HRD.
                Jika pengguna tanpa peran HRD mencoba mengakses halaman ini, alihkan secara otomatis ke halaman login.
            </p>
        </div>
    );
};

export default SecurityBox;