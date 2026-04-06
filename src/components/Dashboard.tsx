import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../store/AppContext';
import { cn } from '../lib/utils';

const data = [
  { name: 'Jan', runs: 40 },
  { name: 'Feb', runs: 30 },
  { name: 'Mar', runs: 20 },
  { name: 'Apr', runs: 27 },
  { name: 'May', runs: 18 },
  { name: 'Jun', runs: 23 },
  { name: 'Jul', runs: 34 },
];

export default function Dashboard() {
  const { theme, language } = useAppContext();
  
  const cardClasses = cn(
    "p-6 rounded-xl border shadow-sm",
    theme === 'Dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{language === 'English' ? 'Dashboard' : '儀表板'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cardClasses}>
          <h3 className="text-sm font-medium opacity-70 mb-2">Total Runs</h3>
          <p className="text-3xl font-bold text-blue-500">1,284</p>
        </div>
        <div className={cardClasses}>
          <h3 className="text-sm font-medium opacity-70 mb-2">Tokens Processed</h3>
          <p className="text-3xl font-bold text-teal-500">4.2M</p>
        </div>
        <div className={cardClasses}>
          <h3 className="text-sm font-medium opacity-70 mb-2">Active Agents</h3>
          <p className="text-3xl font-bold text-purple-500">8</p>
        </div>
      </div>

      <div className={cardClasses}>
        <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'Dark' ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={theme === 'Dark' ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={theme === 'Dark' ? '#9ca3af' : '#6b7280'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'Dark' ? '#1f2937' : '#ffffff',
                  borderColor: theme === 'Dark' ? '#374151' : '#e5e7eb',
                  color: theme === 'Dark' ? '#ffffff' : '#000000'
                }} 
              />
              <Bar dataKey="runs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
