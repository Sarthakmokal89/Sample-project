import React from 'react';

interface CardStatProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const CardStat: React.FC<CardStatProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-violet-900 border border-violet-800/80 p-5 rounded-xl shadow-lg">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <div className="text-gray-400">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
};

export default CardStat;