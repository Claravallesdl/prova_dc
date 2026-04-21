
import React from 'react';
import { DashboardRecord } from '../types';
import { Table as TableIcon } from 'lucide-react';

interface DataTableProps {
  data: DashboardRecord[];
}

interface TreatmentStats {
  name: string;
  count: number;
}

interface SummaryRow {
  tumor: string;
  biopsyCount: number;
  patientCount: number;
  metastaticCount: number;
  primarySiteCount: number;
  treatmentStats: TreatmentStats[];
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const summaryData = React.useMemo(() => {
    const aggregation: Record<string, { 
      biopsies: number; 
      patients: Set<string>; 
      met: number; 
      prim: number; 
      treatments: Record<string, number> 
    }> = {};

    data.forEach((record) => {
      const tumorKey = record.primaryTumor || 'Unknown';
      if (!aggregation[tumorKey]) {
        aggregation[tumorKey] = { 
          biopsies: 0, 
          patients: new Set(), 
          met: 0, 
          prim: 0, 
          treatments: {} 
        };
      }
      
      const stats = aggregation[tumorKey];
      stats.biopsies += 1;
      stats.patients.add(record.sap);
      if (record.type === 'Met' || record.type === 'Metastatic') stats.met += 1;
      if (record.type === 'Prim' || record.type === 'Primary') stats.prim += 1;
      
      // Process treatments and count occurrences
      const treatmentList = record.treatment.split(',').map(t => t.trim());
      treatmentList.forEach(t => {
        if (t === 'UNK' || !t) return;
        stats.treatments[t] = (stats.treatments[t] || 0) + 1;
      });
    });

    return Object.entries(aggregation)
      .map(([tumor, stats]): SummaryRow => ({
        tumor,
        biopsyCount: stats.biopsies,
        patientCount: stats.patients.size,
        metastaticCount: stats.met,
        primarySiteCount: stats.prim,
        treatmentStats: Object.entries(stats.treatments)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count),
      }))
      .sort((a, b) => b.biopsyCount - a.biopsyCount);
  }, [data]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/30 sticky top-0 z-10">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border-b border-slate-100">Primary Tumor</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center bg-white border-b border-slate-100">Patients</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center bg-white border-b border-slate-100">Biopsies</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center bg-white border-b border-slate-100">Primary Biopsy</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center bg-white border-b border-slate-100">Metastatic Biopsy</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border-b border-slate-100">Therapy Distribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {summaryData.map((row) => (
              <tr key={row.tumor} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-xs font-black text-slate-700 capitalize">
                    {row.tumor.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-xs font-bold text-slate-600">{row.patientCount}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-xs font-black text-blue-700">{row.biopsyCount}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-xs font-bold text-emerald-600">{row.primarySiteCount}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-xs font-bold text-amber-600">{row.metastaticCount}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {row.treatmentStats.length > 0 ? row.treatmentStats.map(ts => (
                      <span 
                        key={ts.name} 
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-100 text-[9px] font-bold text-blue-700 rounded-lg shadow-sm"
                      >
                        {ts.name}
                        <span className="bg-blue-600 text-white px-1 rounded-md text-[8px] font-black">
                          {ts.count}
                        </span>
                      </span>
                    )) : (
                      <span className="text-[9px] text-slate-300 italic px-1">Untreated / Unknown</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {summaryData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 opacity-30">
            <TableIcon size={48} />
            <p className="mt-4 font-black uppercase tracking-widest text-xs">No records found</p>
          </div>
        )}
      </div>
    </div>
  );
};
