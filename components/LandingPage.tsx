import React from 'react';
import { ArrowRight, Database, Search } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-grid-slate-100 p-8">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Text Content */}
        <div className="text-left">
          <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">VHIO Data Ecosystem</span>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter mt-2 mb-6">
            Accelerate Your Oncology Research
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-lg mb-12">
            An integrated platform for high-precision oncology data. Explore curated clinical histories and molecular profiles to accelerate your research.
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('how-it-works')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
              Read the Guide <ArrowRight size={16} />
            </button>

          </div>
        </div>

        {/* Right Column: Action Cards */}
        <div className="space-y-6">
          <ActionCard
            icon={Database}
            title="Go to VHIO Lake"
            description="A high-precision oncology data lake integrating clinical histories with molecular NGS profiling."
            onClick={() => onNavigate('lake')}
          />
          <ActionCard
            icon={Search}
            title="Explore the Catalogue"
            description="Use powerful filtering tools to define patient cohorts and discover datasets."
            onClick={() => onNavigate('catalogue')}
          />
          <ActionCard
            icon={Database}
            title="Manage Your Workspace"
            description="Track your data requests, manage saved queries, and review petitions."
            onClick={() => onNavigate('workspace')}
          />
        </div>

      </div>
       <style>{`
        .bg-grid-slate-100 {
          background-image: linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

interface ActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon: Icon, title, description, onClick }) => (
  <button onClick={onClick} className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-lg flex items-center text-left hover:shadow-xl hover:border-blue-300 transition-all group">
    <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center mr-5 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
      <Icon size={24} />
    </div>
    <div className="flex-1">
      <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 leading-snug">{description}</p>
    </div>
    <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-all ml-4 transform group-hover:translate-x-1" />
  </button>
);
