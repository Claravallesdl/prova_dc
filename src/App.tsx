import React, { useState, useMemo, useRef } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { SummaryBox } from '../components/SummaryBox';
import { SunburstChart } from '../components/SunburstChart';
import { DataTable } from '../components/DataTable';
import { FilterTags } from '../components/FilterTags';
import { ProfilePage } from '../components/ProfilePage';
import { SettingsPage } from '../components/SettingsPage';
import { RequestsPage } from '../components/RequestsPage';

import { HowItWorksPage } from '../components/HowItWorksPage';
import { LandingPage } from '../components/LandingPage';
import { DataRequestPage, RequestDraft } from '../components/DataRequestPage';
import { PetitionDetailModal } from '../components/PetitionDetailModal';
import { MyPetition, DataRequest } from './types';
import { FilterState, ViewMode, HierarchyField, SavedQuery, HierarchyNode } from './types';
import * as d3 from 'd3';
import { MOCK_RECORDS, MOCK_SAVED_QUERIES, MOCK_INCOMING_REQUESTS, MOCK_MY_PETITIONS } from '../services/mockData';
import { 
  LayoutGrid, Table as TableIcon, Layers, Info, 
  AlertCircle, Database, Bookmark, Check, ArrowRight, X, Save, Filter,
  FileText, Dna, ClipboardList, Pill, Search
} from 'lucide-react';

export interface AppConfig {
  autoExpand: boolean;
  highDensity: boolean;
  showLabels: boolean;
  emailNotifs: boolean;
  pushNotifs: boolean;
  anonymousExport: boolean;
  defaultExport: string;
}



const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [appConfig, setAppConfig] = useState<AppConfig>({
    autoExpand: false,
    highDensity: false,
    showLabels: true,
    emailNotifs: true,
    pushNotifs: true,
    anonymousExport: false,
    defaultExport: 'CSV'
  });

  const [filters, setFilters] = useState<FilterState>({
    primaryTumors: [],
    sex: [],
    ageRanges: [],
    biopsySites: [],
    types: [],
    treatments: [],
    omicsData: [],
    molecularInfo: [],
    treatmentLogic: 'any',
    omicsLogic: 'any',
    molecularLogic: 'any'
  });

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Sunburst);
  const [activeHierarchy, setActiveHierarchy] = useState<HierarchyField[]>(['primaryTumor', 'treatment']);
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>(MOCK_SAVED_QUERIES);
  
  // Save Dialog State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [queryNameToSave, setQueryNameToSave] = useState('');
  
  // Feedback states
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showSubmitToast, setShowSubmitToast] = useState(false);
  const [lastSavedName, setLastSavedName] = useState('');
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const saveInputRef = useRef<HTMLInputElement>(null);

  // Data Request State
  const [requestDraft, setRequestDraft] = useState<RequestDraft | null>(null);
  const [showDraftToast, setShowDraftToast] = useState(false);
  const [myPetitions, setMyPetitions] = useState<MyPetition[]>(MOCK_MY_PETITIONS);
  const [selectedPetition, setSelectedPetition] = useState<MyPetition | null>(null);
  const [editingPetition, setEditingPetition] = useState<MyPetition | null>(null);
  const [incomingRequests, setIncomingRequests] = useState<DataRequest[]>(MOCK_INCOMING_REQUESTS);
  const [hoveredNode, setHoveredNode] = useState<d3.HierarchyRectangularNode<HierarchyNode> | null>(null);
  const [previousTab, setPreviousTab] = useState('home');

  // Total unique patients in the clinical database is 18
  const totalUniquePatients = 57290;

  const filteredData = useMemo(() => {
    return MOCK_RECORDS.filter(record => {
      const matchTumor = filters.primaryTumors.length === 0 || filters.primaryTumors.includes(record.primaryTumor);
      const matchSex = filters.sex.length === 0 || filters.sex.includes(record.gender);
      const matchAge = filters.ageRanges.length === 0 || filters.ageRanges.includes(record.rangeAge);
      const matchSite = filters.biopsySites.length === 0 || filters.biopsySites.includes(record.biopsySite);
      const matchType = filters.types.length === 0 || filters.types.includes(record.type);
      
      const matchOmics = filters.omicsData.length === 0 || (() => {
        if (filters.omicsLogic === 'all') {
          return filters.omicsData.every(o => record.omicsData.includes(o));
        } else {
          return filters.omicsData.some(o => record.omicsData.includes(o));
        }
      })();

      const matchMolecular = filters.molecularInfo.length === 0 || (() => {
        if (filters.molecularLogic === 'all') {
          return filters.molecularInfo.every(m => record.molecularInfo.includes(m));
        } else {
          return filters.molecularInfo.some(m => record.molecularInfo.includes(m));
        }
      })();
      
      const matchTreatment = filters.treatments.length === 0 || (() => {
        const patientTreatments = record.treatment.split(',').map(t => t.trim());
        if (filters.treatmentLogic === 'all') {
          return filters.treatments.every(t => patientTreatments.includes(t));
        } else {
          return filters.treatments.some(t => patientTreatments.includes(t));
        }
      })();

      return matchTumor && matchSex && matchAge && matchSite && matchType && matchTreatment && matchOmics && matchMolecular;
    });
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, value: string[] | string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      primaryTumors: [],
      sex: [],
      ageRanges: [],
      biopsySites: [],
      types: [],
      treatments: [],
      omicsData: [],
      molecularInfo: [],
      treatmentLogic: 'any',
      omicsLogic: 'any',
      molecularLogic: 'any'
    });
    setActiveHierarchy(['primaryTumor', 'treatment']);
  };

  const toggleHierarchyField = (field: HierarchyField) => {
    setActiveHierarchy(prev => {
      const isCurrentlyActive = prev.includes(field);
      if (isCurrentlyActive) {
        return prev.filter(f => f !== field);
      } else {
        if (prev.length >= 4) return prev; 
        return [...prev, field];
      }
    });
  };

  const generateDynamicTitle = () => {
    const parts: string[] = [];
    if (filters.types.length === 1) {
      parts.push(filters.types[0] === 'Met' ? 'Metastatic' : 'Primary');
    } else if (filters.types.length > 1) {
      parts.push('Mixed Origin');
    }
    if (filters.sex.length === 1) {
      parts.push(filters.sex[0]);
    }
    if (filters.primaryTumors.length === 1) {
      parts.push(filters.primaryTumors[0].charAt(0).toUpperCase() + filters.primaryTumors[0].slice(1).replace(/_/g, ' '));
    } else if (filters.primaryTumors.length > 1) {
      parts.push('Multi-tumor');
    }
    if (parts.length === 0) {
      parts.push('Full');
    }
    parts.push('Cohort');
    if (filters.ageRanges.length > 0) {
      const isSenior = filters.ageRanges.every(r => ['45-59', '60-74', '75+'].includes(r)) && filters.ageRanges.length >= 2;
      const isYoung = filters.ageRanges.every(r => ['0-18', '19-29', '30-44'].includes(r)) && filters.ageRanges.length >= 2;
      if (isSenior) parts.push('> 45y');
      else if (isYoung) parts.push('< 45y');
      else if (filters.ageRanges.length === 1) parts.push(`(${filters.ageRanges[0]})`);
    }
    if (filters.treatments.length === 1) {
      parts.push(`w/ ${filters.treatments[0].split(' ')[0]}`);
    } else if (filters.treatments.length > 1) {
      parts.push('w/ Multi-therapy');
    }
    const title = parts.join(' ');
    const maxLength = 50;
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  const openSaveModal = () => {
    setQueryNameToSave(generateDynamicTitle());
    setIsSaveModalOpen(true);
    setTimeout(() => saveInputRef.current?.select(), 100);
  };

  const handleSaveConfirmed = () => {
    const finalName = queryNameToSave.trim() || `Query ${new Date().toLocaleDateString()}`;
    const newQuery: SavedQuery = {
      id: `q_${Date.now()}`,
      name: finalName,
      date: new Date().toISOString().split('T')[0],
      filters: { ...filters },
      hierarchy: [...activeHierarchy]
    };
    setSavedQueries(prev => [newQuery, ...prev]);
    setLastSavedName(finalName);
    setIsSaveModalOpen(false);
    setShowSaveToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setShowSaveToast(false);
    }, 4000);
  };

  const handleRequestSubmit = (details: Partial<DataRequest>) => {
    if (editingPetition) {
      const updatedPetition = { ...editingPetition, ...details, status: 'pending' as RequestStatus } as MyPetition;
      setMyPetitions(myPetitions.map(p => p.id === editingPetition.id ? updatedPetition : p));
      setEditingPetition(null);
    } else {
    const newPetition: MyPetition = {
      id: `req_${Date.now()}`,
      requester: 'Current User',
      title: details.title || '',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      justification: details.justification || '',
      requestedData: details.requestedData!,
      cohortFilters: details.cohortFilters,
      patientCount: details.patientCount,
      availabilitySummary: details.availabilitySummary,
      
      registrationTime: details.registrationTime || '',
      applicationDate: details.applicationDate || '',
      applicantDetails: details.applicantDetails || { name: '', email: '', group: '', isMulticenter: false },
      researchersInvolved: details.researchersInvolved || [],
      projectBriefSummary: details.projectBriefSummary || '',
      projectDetailedDescription: details.projectDetailedDescription || { previousWork: '', objectiveResearchApproach: '', anticipatedResults: '' }
    };
    const newIncomingRequest: DataRequest = { ...newPetition };

    setMyPetitions(prev => [newPetition, ...prev]);
    setIncomingRequests(prev => [newIncomingRequest, ...prev]);
    }
    setActiveTab('workspace');
    setShowSubmitToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setShowSubmitToast(false);
    }, 4000);
  };

  const handleSaveDraft = (draft: RequestDraft) => {
    if (editingPetition) {
      const updatedPetition = { ...editingPetition, ...draft };
      setMyPetitions(myPetitions.map(p => p.id === editingPetition.id ? updatedPetition : p));
      setEditingPetition(null);
    } else {
    const newPetition: MyPetition = {
      id: `draft_${Date.now()}`,
      title: draft.title || 'Untitled Draft',
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      justification: draft.justification,
      requestedData: draft.requestedData,
    };
    setMyPetitions(prev => [newPetition, ...prev]);
    }
    setRequestDraft(draft);
    setActiveTab('workspace');
    setShowDraftToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setShowDraftToast(false);
    }, 4000);
  };

  const handleApproveRequest = (id: string) => {
    setIncomingRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'approved' } : req));
    setMyPetitions(prev => prev.map(pet => pet.id === id ? { ...pet, status: 'approved' } : pet));
  };

  const handleRejectRequest = (id: string, justification: string) => {
    console.log(`Rejecting request ${id} with justification: ${justification}`);
    setIncomingRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'rejected' } : req));
    setMyPetitions(prev => prev.map(pet => pet.id === id ? { ...pet, status: 'rejected' } : pet));
  };

  const handleLoadQuery = (queryFilters: FilterState, queryHierarchy: HierarchyField[]) => {
    setFilters(queryFilters);
    setActiveHierarchy(queryHierarchy);
    setActiveTab('catalogue');
  };

  const handleSunburstClick = (nodeFilters: Partial<Record<keyof FilterState, string>>) => {
    if (Object.keys(nodeFilters).length === 0) {
      handleReset();
      return;
    }
    setFilters(prev => {
      const newFilters = { ...prev };
      Object.entries(nodeFilters).forEach(([key, value]) => {
        const filterKey = key as keyof FilterState;
        if (Array.isArray(newFilters[filterKey])) {
          // If the value contains commas (joined from array fields or treatment string), split it
          if (['treatments', 'omicsData', 'molecularInfo'].includes(filterKey) && value.includes(',')) {
            (newFilters[filterKey] as string[]) = value.split(',').map(v => v.trim());
          } else {
            (newFilters[filterKey] as string[]) = [value];
          }
        }
      });
      return newFilters;
    });
  };

  const handleEditPetition = (petition: MyPetition) => {
    setEditingPetition(petition);
    setRequestDraft({
      title: petition.title,
      justification: petition.justification,
      requestedData: petition.requestedData,
    });
    setPreviousTab(activeTab);
    setActiveTab('request-data');
  };

  const hierarchyOptions: { label: string; value: HierarchyField }[] = [
    { label: 'Primary Tumor', value: 'primaryTumor' },
    { label: 'Biological Sex', value: 'gender' },
    { label: 'Age at Diagnosis', value: 'rangeAge' },
    { label: 'Biopsy Site', value: 'biopsySite' },
    { label: 'Biopsy Origin', value: 'type' },
    { label: 'Treatment', value: 'treatment' },
    { label: 'Omics Data', value: 'omicsData' }
  ];

    const activeFilterEntries = Object.entries(filters).filter(([, val]) => Array.isArray(val) && val.length > 0);
  const atLimit = activeHierarchy.length >= 4;

  const dbs = [
    { id: 'OC', icon: FileText, name: 'OncoClinical', desc: 'Curated Clinical Data from REDCap first visits at VH.', patientCount: 20915 },
    { id: 'PS', icon: Dna, name: 'Prescreening_NEW', desc: 'Molecular data including biopsy details and results from multiple genomic test panels.', patientCount: 18133 },
    { id: 'TC', icon: ClipboardList, name: 'ClinicalTrials', desc: 'Patient Inclusion at VH Clinical Trials', patientCount: 20396 },
    { id: 'GC', icon: Pill, name: 'OncoPharma', desc: 'Pharmacotherapy history and drugs administered to oncology patients at VH.', patientCount: 40353 }
  ];

  return (
    <div className={`h-screen bg-slate-50 flex flex-col overflow-hidden ${appConfig.highDensity ? 'text-xs' : ''}`}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex flex-1 pt-16 overflow-hidden">


        {activeTab === 'catalogue' && (
          <>
            <Sidebar 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onReset={handleReset} 
              autoExpand={appConfig.autoExpand}
            />

            <main className="ml-72 flex-1 flex flex-col overflow-hidden bg-white relative">
              <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Action Bar: Filters & Buttons */}
                <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/30">
                  <FilterTags filters={filters} onRemove={(key, val) => {
                    setFilters(prev => {
                      const currentVal = prev[key as keyof FilterState];
                      if (!Array.isArray(currentVal)) return prev;
                      return { ...prev, [key as keyof FilterState]: currentVal.filter(v => v !== val) };
                    });
                  }} />
                  <div className="flex items-center gap-2">
                    <button onClick={openSaveModal} className="group flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm uppercase tracking-wider">
                      <Bookmark size={12} className="group-hover:scale-110 transition-transform" /> Save Query
                    </button>
                    <button onClick={() => { setPreviousTab('catalogue'); setActiveTab('request-data'); }} className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 rounded-lg text-[10px] font-black text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-200 uppercase tracking-wider">
                      <FileText size={12} /> Request Data
                    </button>
                  </div>
                </div>

                {/* Hierarchy Selector */}
                <div className={`flex-shrink-0 border-b border-slate-50 flex items-center justify-between gap-6 ${appConfig.highDensity ? 'px-4 py-2' : 'px-6 py-3'}`}>
                  <div className="flex items-center gap-4 flex-1 overflow-hidden">
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                        <Layers size={12} /> Hierarchy <span className="text-slate-300">({activeHierarchy.length}/4)</span>:
                      </span>
                      {atLimit && (
                        <div className="flex items-center gap-1 text-[8px] font-bold text-amber-500 uppercase tracking-tight animate-pulse">
                          <AlertCircle size={10} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {hierarchyOptions.map(option => {
                        const isActive = activeHierarchy.includes(option.value);
                        const disabled = !isActive && atLimit;
                        return (
                          <button
                            key={option.value}
                            disabled={disabled}
                            onClick={() => toggleHierarchyField(option.value)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all border uppercase tracking-tight 
                              ${isActive 
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                : disabled 
                                  ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' 
                                  : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-500'}`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 bg-slate-100 p-1 rounded-xl border border-slate-200/50 shadow-inner h-fit">
                    <button onClick={() => setViewMode(ViewMode.Sunburst)} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-tight ${viewMode === ViewMode.Sunburst ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                      <LayoutGrid size={13} /> Sunburst
                    </button>
                    <button onClick={() => setViewMode(ViewMode.Table)} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-tight ${viewMode === ViewMode.Table ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                      <TableIcon size={13} /> Dataset
                    </button>
                  </div>
                </div>

                {/* Main Visualization Area */}
                <div className="flex-1 flex overflow-hidden">
                  <div className="flex-1 relative overflow-hidden flex flex-col pr-0">
                    {viewMode === ViewMode.Sunburst && (
                      <SunburstChart 
                        data={filteredData} 
                        filters={filters} 
                        activeHierarchy={activeHierarchy}
                        forceLabels={appConfig.showLabels}
                        onHover={setHoveredNode}
                        onNodeClick={handleSunburstClick}
                      />
                    )}
                    {viewMode === ViewMode.Table && <DataTable data={filteredData} />}
                  </div>

                  <div className={`${appConfig.highDensity ? 'w-56' : 'w-64'} flex-shrink-0 border-l border-slate-50 bg-slate-50/10 p-5 flex flex-col gap-4`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <Info size={14} className="text-blue-500" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cohort Insights</span>
                    </div>
                    <SummaryBox 
                      allRecords={MOCK_RECORDS} 
                      filteredRecords={filteredData} 
                      dashboardIntegrated 
                      hoveredNode={hoveredNode}
                      activeHierarchy={activeHierarchy}
                    />
                  </div>
                </div>
              </div>
            </main>
          </>
        )}

        {activeTab === 'lake' && (
          <main className="flex-1 overflow-hidden bg-slate-50 p-4">
            <div className="max-w-7xl mx-auto h-full flex flex-col gap-2">
              
              {/* 1. VHIO Lake Ecosystem Header */}
              <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl flex items-center justify-between overflow-hidden relative flex-shrink-0">
                <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                  <Database size={100} strokeWidth={0.5} />
                </div>
                <div className="relative z-10 flex flex-col gap-2 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                      <Database className="text-blue-400" size={20} />
                    </div>
                    <h1 className="text-xl font-black uppercase tracking-tight leading-none">VHIO-Lake Ecosystem</h1>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium leading-relaxed max-w-lg">
                    A high-precision oncology data lake integrating clinical histories with molecular NGS profiling. 
                    The <strong>Data Catalogue</strong> serves as the primary portal for cohort discovery and dataset requests.
                  </p>
                </div>
                <div className="relative z-10 flex gap-8 mr-4">
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-100 uppercase tracking-tight">{totalUniquePatients.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Patients</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-blue-400 uppercase tracking-tight">{dbs.length}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Data Bases</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-3 gap-2">
                {/* 2. Dynamic Integration Hub */}
                <div className="col-span-2 bg-slate-900 rounded-xl p-6 border border-blue-900/50 shadow-2xl flex flex-col relative overflow-hidden bg-grid-slate-800">
                  <div className="flex items-center justify-between mb-2 relative z-10">
                    <div className="flex items-center gap-3">
                      <h2 className="text-[14px] font-black text-white uppercase tracking-[0.2em]">VHIO Data Lake</h2>
                    </div>
                    <div className="bg-blue-500/10 px-3 py-1 rounded-md border border-blue-400/20">
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">Note : Not all patients appear in all databases.</p>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-[1.3fr_1fr] gap-6 items-center">
                    {/* Left Column: DB Explanations */}
                    <div className="flex flex-col gap-9 pr-4 border-r border-slate-800/50">
                      {dbs.map(db => (
                        <div key={db.id} className="flex items-start gap-3">
                          <div className="w-8 h-8 flex-shrink-0 bg-slate-800 rounded-md flex items-center justify-center text-blue-300 border border-slate-700">
                            <db.icon size={14} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-[12px] font-black text-white uppercase tracking-wider">{db.name}</h3>
                            <p className="text-[11px] text-slate-400 leading-normal">{db.desc}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black text-white">{db.patientCount.toLocaleString()}</p>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Patients</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right Column: Visualization */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse"></div>
                        <div className="absolute inset-2 bg-slate-900 rounded-full border-2 border-blue-500/20"></div>
                        <div className="relative w-20 h-20 bg-slate-800 rounded-full flex flex-col items-center justify-center shadow-2xl border-2 border-blue-500/50">
                          <Database size={24} className="text-blue-400" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest mt-1">VHIO-Lake</span>
                        </div>
                      </div>
                      {dbs.map((db, index) => {
                        const angle = (index / dbs.length) * (2 * Math.PI) - Math.PI / 2;
                        const radius = 110;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        return (
                          <div
                            key={db.id}
                            className="absolute w-12 h-12 bg-slate-800/80 backdrop-blur-md rounded-full border border-slate-700 flex items-center justify-center shadow-lg"
                            style={{
                              transform: `translate(${x}px, ${y}px)`,
                              animation: `orbit-2 12s linear infinite`,
                              animationDelay: `-${(12 / dbs.length) * index}s`
                            }}
                          >
                            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-blue-300 border border-slate-600">
                              <db.icon size={12} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Action Portal Area */}
                <div className="bg-teal-950 rounded-xl p-6 text-white shadow-xl flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 opacity-10">
                      <Search size={100} />
                  </div>
                  <div className="w-16 h-16 bg-white/10 rounded-lg border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Search size={28} className="text-teal-400" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-2">Interactive Exploration</h2>
                    <p className="text-xs text-teal-100/80 font-medium leading-relaxed max-w-xs">
                      The <strong>Data Catalogue</strong> is your gateway to the VHIO-Lake. Use its powerful filtering tools to define patient cohorts based on clinical and molecular data. Once a cohort is defined, you can submit a request for a curated dataset for your research.
                    </p>
                  </div>
                  <button onClick={() => setActiveTab('catalogue')} className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white text-teal-950 px-6 py-3 rounded-md hover:bg-teal-50 transition-all shadow-lg active:scale-95">
                    Launch Catalogue <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <style>{`
                @keyframes orbit-2 {
                  from { transform: rotate(0deg) translateX(110px) rotate(0deg); }
                  to   { transform: rotate(360deg) translateX(110px) rotate(-360deg); }
                }
                .bg-grid-slate-800 {
                  background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
                  background-size: 20px 20px;
                }
              `}</style>

              <style>{`
                @keyframes orbit {
                  from { transform: rotate(0deg) translateX(160px) rotate(0deg); }
                  to   { transform: rotate(360deg) translateX(160px) rotate(-360deg); }
                }
                .bg-grid-slate-800 {
                  background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
                  background-size: 20px 20px;
                }
              `}</style>

            </div>
          </main>
        )}

        {activeTab === 'workspace' && (
          <RequestsPage 
            onLoadQuery={handleLoadQuery} 
            savedQueries={savedQueries}
            setSavedQueries={setSavedQueries}
            myPetitions={myPetitions}
            setMyPetitions={setMyPetitions}
            incomingRequests={incomingRequests}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
            onSelectPetition={setSelectedPetition}
            onEditPetition={handleEditPetition}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === 'request-data' && (
          <DataRequestPage 
            onBack={() => { setActiveTab(previousTab); setEditingPetition(null); }}
            onSubmit={handleRequestSubmit}
            onSaveDraft={handleSaveDraft}
            filters={filters}
            filteredRecords={filteredData}
            draft={requestDraft}
          />
        )}
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'home' && <LandingPage onNavigate={setActiveTab} />}
        {activeTab === 'how-it-works' && <HowItWorksPage />}
        

        {activeTab === 'settings' && (
          <SettingsPage 
            config={appConfig} 
            onChange={(key, val) => setAppConfig(prev => ({ ...prev, [key]: val }))} 
          />
        )}
      </div>

      {isSaveModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
              <div className="px-8 pt-8 pb-4">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                          <Bookmark size={20} />
                       </div>
                       <div>
                          <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Save Search Query</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workspace Archival</p>
                       </div>
                    </div>
                    <button onClick={() => setIsSaveModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
                      <X size={20} />
                    </button>
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Query Title</label>
                       <input ref={saveInputRef} type="text" value={queryNameToSave} onChange={(e) => setQueryNameToSave(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSaveConfirmed()} placeholder="Enter a descriptive name..." className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                    </div>
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Filter size={12} className="text-blue-500" /> Active Filters Summary</p>
                       <div className="space-y-3">
                         {activeFilterEntries.length > 0 ? (
                           <div className="flex flex-wrap gap-2">
                             {activeFilterEntries.map(([key, val]) => (
                               <div key={key} className="flex flex-col gap-1">
                                 <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">{key.replace('primaryTumors', 'Tumor').replace('sex', 'Sex').replace('treatments', 'Rx').replace('biopsySites', 'Site').replace('ageRanges', 'Age')}:</span>
                                 <div className="flex flex-wrap gap-1">{(val as string[]).map(v => <span key={v} className={`px-2 py-0.5 border rounded-lg text-[9px] font-black uppercase tracking-tight shadow-sm bg-slate-50 text-slate-700`}>{v.replace(/_/g, ' ')}</span>)}</div>
                               </div>
                             ))}
                           </div>
                         ) : <div className="flex flex-col items-center py-4 text-slate-300"><Database size={24} className="opacity-20 mb-2" /><p className="text-[9px] font-black uppercase tracking-widest">Full Cohort (No Filters)</p></div>}
                       </div>
                    </div>
                 </div>
              </div>
              <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3 mt-4">
                 <button onClick={() => setIsSaveModalOpen(false)} className="px-6 py-2.5 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
                 <button onClick={handleSaveConfirmed} disabled={!queryNameToSave.trim()} className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:shadow-none"><Save size={14} /> Confirm & Save</button>
              </div>
           </div>
        </div>
      )}

      {showSubmitToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
           <div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-6 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/30"><Check size={18} strokeWidth={3} /></div>
                 <div className="flex flex-col"><p className="text-xs font-black uppercase tracking-tight">Request Submitted Successfully</p><p className="text-[10px] text-slate-400 font-medium">Your data access request is now under review by the DAC.</p></div>
              </div>
              <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                 <button onClick={() => { setActiveTab('workspace'); setShowSubmitToast(false); }} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-400 hover:text-green-300 transition-colors">View <ArrowRight size={12} /></button>
                 <button onClick={() => setShowSubmitToast(false)} className="p-1 text-slate-500 hover:text-white transition-colors"><X size={14} /></button>
              </div>
           </div>
        </div>
      )}

      {showSaveToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
           <div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-6 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30"><Check size={18} strokeWidth={3} /></div>
                 <div className="flex flex-col"><p className="text-xs font-black uppercase tracking-tight">Query Saved Successfully</p><p className="text-[10px] text-slate-400 font-medium">"{lastSavedName}" added to My Workspace.</p></div>
              </div>
              <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                 <button onClick={() => { setActiveTab('workspace'); setShowSaveToast(false); }} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">View <ArrowRight size={12} /></button>
                 <button onClick={() => setShowSaveToast(false)} className="p-1 text-slate-500 hover:text-white transition-colors"><X size={14} /></button>
              </div>
           </div>
        </div>
      )}

      <PetitionDetailModal 
        petition={selectedPetition}
        onClose={() => setSelectedPetition(null)}
      />

      {showDraftToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
           <div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-6 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30"><Save size={18} strokeWidth={3} /></div>
                 <div className="flex flex-col"><p className="text-xs font-black uppercase tracking-tight">Draft Saved Successfully</p><p className="text-[10px] text-slate-400 font-medium">Your request draft has been saved.</p></div>
              </div>
              <button onClick={() => setShowDraftToast(false)} className="p-1 text-slate-500 hover:text-white transition-colors"><X size={14} /></button>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;