
import React from 'react';
import SecurityBox from '../../components/hrd/settings/SecurityBox';
import BackupBox from '../../components/hrd/settings/BackupBox';

const SettingsPage: React.FC = () => {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-black">Pengaturan</h1>
                <p className="text-gray-500 mt-1">Kelola keamanan dan data sistem Anda.</p>
            </header>

            <div className="space-y-8">
                <SecurityBox />
                <BackupBox />
            </div>
        </div>
    );
};

export default SettingsPage;