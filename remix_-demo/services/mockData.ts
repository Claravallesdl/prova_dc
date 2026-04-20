
import { PatientInfo, BiopsyInfo, DashboardRecord, DataRequest, SavedQuery } from '../types';

const CLINICAL_INFO: PatientInfo[] = [
  { sap: '10949', primaryTumor: 'breast', gender: 'Female', ageDx: null, rangeAge: '45-59', treatment:'Experimental Therapy, Targeted Therapy' },
  { sap: '11220', primaryTumor: 'breast', gender: 'Female', ageDx: 70, rangeAge: '60-74', treatment:'Targeted Therapy, Hormonal Therapy'},
  { sap: '16088', primaryTumor: 'lung', gender: 'Male', ageDx: null, rangeAge: '45-59',treatment:'Hormonal Therapy' },
  { sap: '18688', primaryTumor: 'head_neck', gender: 'Male', ageDx: 54, rangeAge: '45-59',treatment:'Chemotherapy, Immunotherapy' },
  { sap: '18731', primaryTumor: 'lung', gender: 'Male', ageDx: null, rangeAge: '45-59',treatment:'Chemotherapy, Targeted Therapy' },
  { sap: '19370', primaryTumor: 'lung', gender: 'Female', ageDx: 55, rangeAge: '45-59',treatment:'Chemotherapy, Targeted Therapy' },
  { sap: '19830', primaryTumor: 'liver', gender: 'Male', ageDx: null, rangeAge: '60-74',treatment:'Experimental Therapy' },
  { sap: '22582', primaryTumor: 'colon', gender: 'Male', ageDx: null, rangeAge: '60-74',treatment:'Targeted Therapy' },
  { sap: '25073', primaryTumor: 'head_neck', gender: 'Female', ageDx: 61, rangeAge: '60-74',treatment:'Targeted Therapy' },
  { sap: '25203', primaryTumor: 'colon', gender: 'Male', ageDx: 61, rangeAge: '60-74',treatment:'Chemotherapy' },
  { sap: '25596', primaryTumor: 'breast', gender: 'Female', ageDx: 53, rangeAge: '45-59',treatment:'Targeted Therapy, Immunotherapy' },
  { sap: '26186', primaryTumor: 'breast', gender: 'Female', ageDx: 67, rangeAge: '60-74',treatment:'Hormonal Therapy' },
  { sap: '27369', primaryTumor: 'breast', gender: 'Male', ageDx: null, rangeAge: '45-59' ,treatment:'Hormonal Therapy'},
  { sap: '29237', primaryTumor: 'lung', gender: 'Female', ageDx: null, rangeAge: '45-59',treatment:'UNK' },
  { sap: '29563', primaryTumor: 'lung', gender: 'Male', ageDx: 22, rangeAge: '19-29',treatment:'UNK' },
  { sap: '33897', primaryTumor: 'pancreas', gender: 'Male', ageDx: 23, rangeAge: '19-29',treatment:'Chemotherapy' },
  { sap: '37616', primaryTumor: 'pancreas', gender: 'Female', ageDx: 53, rangeAge: '45-59',treatment:'Chemotherapy'},
  { sap: '39191', primaryTumor: 'colon', gender: 'Male', ageDx: 67, rangeAge: '60-74' ,treatment:'Chemotherapy, Targeted Therapy'},
];

const BIOPSY_INFO: BiopsyInfo[] = [
  { sap: '10949', patientId: '11540', biopsyId: 'M1400036', primaryTumor: 'breast', biopsySite: 'breast', type: 'Prim', omicsData: ['WES', 'RNA-Seq'], molecularInfo: ['Panel300', 'HE'] },
  { sap: '11220', patientId: '16816919', biopsyId: 'M1400037', primaryTumor: 'breast', biopsySite: 'liver', type: 'Met', omicsData: ['WES'], molecularInfo: ['Guardant', 'MSI'] },
  { sap: '11220', patientId: '16816919', biopsyId: 'M1400038', primaryTumor: 'breast', biopsySite: 'breast', type: 'Prim', omicsData: ['WGS', 'Methylation'], molecularInfo: ['Amplicon', 'IHC'] },
  { sap: '16088', patientId: '11560', biopsyId: 'M1400039', primaryTumor: 'lung', biopsySite: 'liver', type: 'Met', omicsData: ['RNA-Seq'], molecularInfo: ['Epsilon', 'CopyNumber'] },
  { sap: '18688', patientId: '11580', biopsyId: 'M1400040', primaryTumor: 'head_neck', biopsySite: 'oral_cavity', type: 'Prim', omicsData: ['Proteomics'], molecularInfo: ['Fisher', 'HE'] },
  { sap: '10949', patientId: '11540', biopsyId: 'M1400041', primaryTumor: 'breast', biopsySite: 'lung', type: 'Met', omicsData: ['WES'], molecularInfo: ['Panel300'] },
  { sap: '16088', patientId: '11560', biopsyId: 'M1400042', primaryTumor: 'lung', biopsySite: 'lung', type: 'Prim', omicsData: ['WGS'], molecularInfo: ['MSI'] },
  { sap: '18731', patientId: '11620', biopsyId: 'M1400043', primaryTumor: 'lung', biopsySite: 'lung', type: 'Prim', omicsData: ['RNA-Seq'], molecularInfo: ['IHC'] },
  { sap: '19370', patientId: '11681', biopsyId: 'M1400044', primaryTumor: 'lung', biopsySite: 'lung', type: 'Prim', omicsData: ['WES', 'Proteomics'], molecularInfo: ['Panel300', 'CopyNumber'] },
  { sap: '19370', patientId: '11681', biopsyId: 'M1400045', primaryTumor: 'lung', biopsySite: 'liver', type: 'Met', omicsData: ['WGS'], molecularInfo: ['Guardant'] },
  { sap: '25073', patientId: '11682', biopsyId: 'M1400046', primaryTumor: 'head_neck', biopsySite: 'oral_cavity', type: 'Prim', omicsData: ['RNA-Seq'], molecularInfo: ['Amplicon'] },
  { sap: '25073', patientId: '11682', biopsyId: 'M1400047', primaryTumor: 'head_neck', biopsySite: 'breast', type: 'Met', omicsData: ['Methylation'], molecularInfo: ['Epsilon'] },
  { sap: '16088', patientId: '11560', biopsyId: 'M1400048', primaryTumor: 'lung', biopsySite: 'lung', type: 'Met', omicsData: ['WES'], molecularInfo: ['Fisher'] },
  { sap: '18688', patientId: '11580', biopsyId: 'M1400049', primaryTumor: 'head_neck', biopsySite: 'oral_cavity', type: 'Met', omicsData: ['WGS'], molecularInfo: ['HE'] },
  { sap: '10949', patientId: '11540', biopsyId: 'M1400050', primaryTumor: 'breast', biopsySite: 'liver', type: 'Met', omicsData: ['RNA-Seq'], molecularInfo: ['IHC'] },
  { sap: '19830', patientId: '11701', biopsyId: 'M1400051', primaryTumor: 'liver', biopsySite: 'liver', type: 'Prim', omicsData: ['Proteomics'], molecularInfo: ['MSI'] },
  { sap: '19830', patientId: '11701', biopsyId: 'M1400052', primaryTumor: 'liver', biopsySite: 'liver', type: 'Met', omicsData: ['WES'], molecularInfo: ['CopyNumber'] },
  { sap: '19830', patientId: '11701', biopsyId: 'M1400053', primaryTumor: 'liver', biopsySite: 'colon', type: 'Met', omicsData: ['WGS'], molecularInfo: ['Panel300'] },
  { sap: '22582', patientId: '11702', biopsyId: 'M1400054', primaryTumor: 'colon', biopsySite: 'colon', type: 'Met', omicsData: ['RNA-Seq'], molecularInfo: ['Guardant'] },
  { sap: '18688', patientId: '11580', biopsyId: 'M1400055', primaryTumor: 'head_neck', biopsySite: 'lung', type: 'Met', omicsData: ['Methylation'], molecularInfo: ['Amplicon'] },
  { sap: '19830', patientId: '11701', biopsyId: 'M1400056', primaryTumor: 'liver', biopsySite: 'colon', type: 'Met', omicsData: ['Proteomics'], molecularInfo: ['Epsilon'] },
  { sap: '22582', patientId: '11702', biopsyId: 'M1400057', primaryTumor: 'colon', biopsySite: 'colon', type: 'Met', omicsData: ['WES'], molecularInfo: ['Fisher'] },
  { sap: '25203', patientId: '11533', biopsyId: 'M1400058', primaryTumor: 'colon', biopsySite: 'colon', type: 'Prim', omicsData: ['WGS'], molecularInfo: ['HE'] },
  { sap: '25596', patientId: '11733', biopsyId: 'M1400059', primaryTumor: 'breast', biopsySite: 'breast', type: 'Prim', omicsData: ['RNA-Seq'], molecularInfo: ['IHC'] },
  { sap: '25203', patientId: '11533', biopsyId: 'M1400060', primaryTumor: 'colon', biopsySite: 'lung', type: 'Met', omicsData: ['Methylation'], molecularInfo: ['MSI'] },
  { sap: '26186', patientId: '115990', biopsyId: 'M1400061', primaryTumor: 'breast', biopsySite: 'breast', type: 'Prim', omicsData: ['Proteomics'], molecularInfo: ['CopyNumber'] },
  { sap: '26186', patientId: '115990', biopsyId: 'M1400062', primaryTumor: 'breast', biopsySite: 'lung', type: 'Met', omicsData: ['WES'], molecularInfo: ['Panel300'] },
  { sap: '26186', patientId: '115990', biopsyId: 'M1400063', primaryTumor: 'breast', biopsySite: 'cervix', type: 'Met', omicsData: ['WGS'], molecularInfo: ['Guardant'] },
  { sap: '25596', patientId: '11733', biopsyId: 'M1400064', primaryTumor: 'breast', biopsySite: 'breast', type: 'Met', omicsData: ['RNA-Seq'], molecularInfo: ['Amplicon'] },
  { sap: '27369', patientId: '21733', biopsyId: 'M1400065', primaryTumor: 'breast', biopsySite: 'breast', type: 'Prim', omicsData: ['Methylation'], molecularInfo: ['Epsilon'] },
  { sap: '29237', patientId: '433367', biopsyId: 'M1400066', primaryTumor: 'lung', biopsySite: 'lung', type: 'Prim', omicsData: ['Proteomics'], molecularInfo: ['Fisher'] },
  { sap: '27369', patientId: '21733', biopsyId: 'M1400067', primaryTumor: 'breast', biopsySite: 'colon', type: 'Met', omicsData: ['WES'], molecularInfo: ['HE'] },
  { sap: '29563', patientId: '567785', biopsyId: 'M1400068', primaryTumor: 'lung', biopsySite: 'lung', type: 'Prim', omicsData: ['WGS'], molecularInfo: ['IHC'] },
  { sap: '29563', patientId: '567785', biopsyId: 'M1400069', primaryTumor: 'lung', biopsySite: 'colon', type: 'Met', omicsData: ['RNA-Seq'], molecularInfo: ['MSI'] },
  { sap: '33897', patientId: '3211123', biopsyId: 'M1400070', primaryTumor: 'pancreas', biopsySite: 'pancreas', type: 'Prim', omicsData: ['Methylation'], molecularInfo: ['CopyNumber'] },
  { sap: '37616', patientId: '667998', biopsyId: 'M1400071', primaryTumor: 'pancreas', biopsySite: 'pancreas', type: 'Prim', omicsData: ['Proteomics'], molecularInfo: ['Panel300'] },
  { sap: '33897', patientId: '3211123', biopsyId: 'M1400072', primaryTumor: 'pancreas', biopsySite: 'liver', type: 'Met', omicsData: ['WES'], molecularInfo: ['Guardant'] },
  { sap: '39191', patientId: '4455630', biopsyId: 'M1400073', primaryTumor: 'colon', biopsySite: 'colon', type: 'Prim', omicsData: ['WGS'], molecularInfo: ['Amplicon'] },
];

export const MOCK_RECORDS: DashboardRecord[] = BIOPSY_INFO.map(biopsy => {
  const patient = CLINICAL_INFO.find(p => p.sap === biopsy.sap);
  // Assign databases based on patient SAP, ensuring variety
  const sapNum = parseInt(biopsy.sap, 10);
  const databases: string[] = [];
  if (sapNum % 3 === 0) databases.push('OC');
  if (sapNum % 4 === 0) databases.push('PS');
  if (sapNum % 2 === 0) databases.push('TC');
  if (sapNum % 5 === 0) databases.push('GC');
  if (databases.length === 0) databases.push('OC'); // Ensure at least one DB

  return {
    ...biopsy,
    gender: patient?.gender || 'Unknown',
    rangeAge: patient?.rangeAge || 'Unknown',
    treatment: patient?.treatment || 'UNK',
    databases: databases,
  };
});

export const MOCK_INCOMING_REQUESTS: DataRequest[] = [
  { 
    id: 'req_001', 
    requester: 'Dr. Maria Garcia', 
    title: 'Metastatic Breast Cancer v2', 
    date: '2025-05-12', 
    status: 'pending', 
    justification: 'Validation of new biomarker panel in HER2+ cohorts. We require longitudinal data to assess response to therapy over time.',
    requestedData: {
      patientClinical: ['Gender', 'Survival status (alive/death)'],
      biopsyClinical: [],
      treatmentHistory: true,
      clinicalTrials: false,
      omicsData: [],
      molecularInfo: ['Panel300']
    },
    patientCount: 42,
    cohortFilters: {
      primaryTumors: ['breast'],
      sex: ['Female'],
      ageRanges: ['45-59', '60-74'],
      biopsySites: [],
      types: ['Met'],
      treatments: [],
      omicsData: [],
      molecularInfo: [],
      treatmentLogic: 'any',
      omicsLogic: 'any',
      molecularLogic: 'any'
    },
    availabilitySummary: [
      {
        title: 'Patient Clinical Data',
        items: [
          { label: 'Gender', percent: 100, count: 42 },
          { label: 'Survival status (alive/death)', percent: 85, count: 36 }
        ]
      },
      {
        title: 'History & Participation',
        items: [
          { label: 'Treatment History', percent: 78, count: 33 }
        ]
      },
      {
        title: 'Molecular Information',
        items: [
          { label: 'Panel300', percent: 64, count: 27 }
        ]
      }
    ]
  },
  { 
    id: 'req_002', 
    requester: 'Prof. Thomas Miller', 
    title: 'Lung Adenocarcinoma (Multi-omic)', 
    date: '2025-05-10', 
    status: 'approved', 
    justification: 'Meta-analysis of immunotherapy response markers. This study aims to correlate genomic signatures with patient outcomes across multiple trial datasets.',
    requestedData: {
      patientClinical: ['Survival status (alive/death)'],
      biopsyClinical: [],
      treatmentHistory: false,
      clinicalTrials: false,
      omicsData: ['WGS'],
      molecularInfo: ['Guardant']
    },
    patientCount: 28,
    cohortFilters: {
      primaryTumors: ['lung'],
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
    },
    availabilitySummary: [
      {
        title: 'Patient Clinical Data',
        items: [{ label: 'Survival status (alive/death)', percent: 92, count: 26 }]
      },
      {
        title: 'Omics Data (Raw)',
        items: [{ label: 'WGS', percent: 45, count: 13 }]
      }
    ]
  },
  { 
    id: 'req_003', 
    requester: 'Dr. Sarah Chen', 
    title: 'Rare Pancreatic Tumors', 
    date: '2025-05-01', 
    status: 'rejected', 
    justification: 'Commercial diagnostic tool training (Policy mismatch). The request falls outside the scope of academic research as defined by the DAC policy.',
    requestedData: {
      patientClinical: ['Primary tumor'],
      biopsyClinical: ['Associated primary tumor'],
      treatmentHistory: false,
      clinicalTrials: false,
      omicsData: [],
      molecularInfo: []
    },
    patientCount: 12,
    cohortFilters: {
      primaryTumors: ['pancreas'],
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
    }
  },
];

export const MOCK_MY_PETITIONS: DataRequest[] = [
  { 
    id: 'pet_001', 
    requester: 'Me (Julian Vales)', 
    title: 'Prostate Treatment Outcomes (IDIBELL)', 
    date: '2025-05-15', 
    status: 'pending', 
    justification: 'Comparative study with internal hormone deprivation cohort.',
    requestedData: {
      patientClinical: ['Gender', 'Survival status (alive/death)'],
      biopsyClinical: [],
      treatmentHistory: true,
      clinicalTrials: false,
      omicsData: [],
      molecularInfo: []
    },
    patientCount: 56,
    cohortFilters: {
      primaryTumors: ['prostate'],
      sex: ['Male'],
      ageRanges: [],
      biopsySites: [],
      types: [],
      treatments: ['Androgen/Estrogen Deprivation Therapy'],
      omicsData: [],
      molecularInfo: [],
      treatmentLogic: 'any',
      omicsLogic: 'any',
      molecularLogic: 'any'
    },
    availabilitySummary: [
      {
        title: 'Patient Clinical Data',
        items: [
          { label: 'Gender', percent: 100, count: 56 },
          { label: 'Survival status (alive/death)', percent: 89, count: 50 }
        ]
      },
      {
        title: 'History & Participation',
        items: [{ label: 'Treatment History', percent: 100, count: 56 }]
      }
    ]
  },
  { 
    id: 'pet_002', 
    requester: 'Me (Julian Vales)', 
    title: 'VHIO-Radiomics-Lung', 
    date: '2025-04-20', 
    status: 'approved', 
    justification: 'Fusion of clinical data lake with imaging features.',
    requestedData: {
      patientClinical: ['Primary tumor'],
      biopsyClinical: ['Associated primary tumor'],
      treatmentHistory: false,
      clinicalTrials: false,
      omicsData: [],
      molecularInfo: []
    },
    patientCount: 120,
    cohortFilters: {
      primaryTumors: ['lung'],
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
    }
  },
];

export const MOCK_SAVED_QUERIES: SavedQuery[] = [
  { 
    id: 'q_001', 
    name: 'Metastatic Breast Patients > 45y', 
    date: '2025-05-14', 
    filters: {
      primaryTumors: ['breast'],
      sex: ['Female'],
      ageRanges: ['45-59', '60-74', '75+'],
      biopsySites: [],
      types: ['Met'],
      treatments: [],
      omicsData: [],
      molecularInfo: [],
      treatmentLogic: 'any',
      omicsLogic: 'any',
      molecularLogic: 'any'
    },
    hierarchy: ['primaryTumor', 'rangeAge', 'biopsySite']
  },
  { 
    id: 'q_002', 
    name: 'Colon Chemotherapy Cohort', 
    date: '2025-05-11', 
    filters: {
      primaryTumors: ['colon'],
      sex: [],
      ageRanges: [],
      biopsySites: [],
      types: [],
      treatments: ['Chemotherapy'],
      omicsData: [],
      molecularInfo: [],
      treatmentLogic: 'any',
      omicsLogic: 'any',
      molecularLogic: 'any'
    },
    hierarchy: ['primaryTumor', 'treatment', 'type']
  },
  {
    id: 'q_003',
    name: 'Pancreatic Excellence Multi-omic Cohort',
    date: '2026-04-20',
    filters: {
      primaryTumors: ['pancreas'],
      sex: [],
      ageRanges: [],
      biopsySites: [],
      types: [],
      treatments: [],
      omicsData: ['Methylation', 'Proteomics', 'WES'],
      molecularInfo: [],
      treatmentLogic: 'any',
      omicsLogic: 'any',
      molecularLogic: 'any'
    },
    hierarchy: ['primaryTumor', 'rangeAge', 'biopsySite']
  }
];
