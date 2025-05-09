import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`rounded-full p-3 ${color}`}>
            <div className="text-white">{icon}</div>
          </div>
          <div className="ml-5">
            <div className="text-gray-500 text-sm">{title}</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">{value}</div>
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 mr-2 font-medium">{trend}</span>
            <span className="text-gray-500">from last period</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;