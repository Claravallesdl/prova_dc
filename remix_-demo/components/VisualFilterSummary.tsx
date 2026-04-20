import React from 'react';
import { FilterState } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface VisualFilterSummaryProps {
  filters: FilterState;
  patientCount: number;
}

export const VisualFilterSummary: React.FC<VisualFilterSummaryProps> = ({ filters, patientCount }) => {
  const data = Object.entries(filters)
    .filter(([key, value]) => Array.isArray(value) && value.length > 0 && key !== 'treatmentLogic')
    .map(([key, value]) => ({ name: key, count: (value as string[]).length }));

  return (
    <div className="w-full">
      <p className="text-sm text-blue-900/80 leading-relaxed mb-4">A cohort of <strong>{patientCount} patients</strong> has been selected based on the following criteria:</p>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
