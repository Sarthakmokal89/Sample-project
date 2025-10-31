import React from 'react';
import { AlertsIcon } from '@/components/Icons';

const Alerts: React.FC = () => {
  return (
    <div>
        <h1 className="text-2xl font-bold text-white">Alerts</h1>
        <div className="mt-16 flex flex-col items-center text-center">
            <AlertsIcon className="w-16 h-16 text-violet-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-300">Alert Management Coming Soon</h2>
            <p className="text-gray-500 mt-2 max-w-md">This page will display system and feedback alerts. We are working on bringing this feature to you.</p>
        </div>
    </div>
  );
};

export default Alerts;
