
import React, { useState } from 'react';
import { Bell, Settings, User, ChevronDown, Info, LogOut, UserCircle, Database, CheckCircle, Layout } from 'lucide-react';

const DataLogo = () => (
  <svg viewBox="0 0 100 100" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
    <circle cx="50" cy="50" r="30" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
    <circle cx="50" cy="50" r="15" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.5" />
    
    <g stroke="#ffffff" strokeWidth="1.5">
      <line x1="50" y1="50" x2="80" y2="20" opacity="0.6" />
      <line x1="50" y1="50" x2="30" y2="85" opacity="0.4" />
      <line x1="50" y1="50" x2="15" y2="40" opacity="0.3" />
    </g>
    
    <circle cx="80" cy="20" r="3.5" fill="#3b82f6" />
    <circle cx="30" cy="85" r="3" fill="#60a5fa" />
    <circle cx="15" cy="40" r="2.5" fill="#93c5fd" />
    
    <g stroke="#ffffff" strokeWidth="1.2">
      <line x1="50" y1="50" x2="85" y2="60" opacity="0.5" />
      <line x1="50" y1="50" x2="65" y2="80" opacity="0.3" />
    </g>
    <circle cx="85" cy="60" r="3" fill="#fb923c" />
    <circle cx="65" cy="80" r="2" fill="#fdba74" />
    
    <circle cx="50" cy="50" r="5" fill="#ffffff" />
  </svg>
);

interface Notification {
  id: string;
  type: 'incoming_request' | 'request_approved';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'incoming_request',
    title: 'New Data Request',
    description: 'Dr. Maria Garcia requested access to your "Metastatic Breast Cancer" cohort.',
    time: '12m ago',
    read: false,
  },
  {
    id: '2',
    type: 'request_approved',
    title: 'Request Approved',
    description: 'Your request for the "Lung Adenocarcinoma Multi-omic" dataset has been approved by the DAC.',
    time: '2h ago',
    read: false,
  },
  {
    id: '3',
    type: 'incoming_request',
    title: 'New Data Request',
    description: 'The Pathology Lab requested raw sequencing data for 12 cases in VHIO-Lake.',
    time: 'Yesterday',
    read: true,
  }
];

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-800 border-b border-white/5 z-50 flex items-center justify-between px-6 shadow-xl">
      {/* Left: Branding */}
      <div className="flex items-center gap-3 min-w-[280px]">
        <div className="flex-shrink-0 cursor-pointer" onClick={() => onTabChange('lake')}>
          <DataLogo />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-black text-white leading-tight tracking-tight">VHIO</span>
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Data Ecosystem</span>
        </div>
      </div>

      {/* Center: Navigation Tabs */}
      <nav className="flex items-center h-full gap-8">
        <button 
          onClick={() => onTabChange('home')}
          className={`h-full px-2 flex items-center gap-2 border-b-2 transition-all text-xs font-black uppercase tracking-widest ${activeTab === 'home' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          Home
        </button>
        <button 
          onClick={() => onTabChange('how-it-works')}
          className={`h-full px-2 flex items-center gap-2 border-b-2 transition-all text-xs font-black uppercase tracking-widest ${activeTab === 'how-it-works' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          How it Works
        </button>
        <button 
          onClick={() => onTabChange('lake')}
          className={`h-full px-2 flex items-center gap-2 border-b-2 transition-all text-xs font-black uppercase tracking-widest ${
            activeTab === 'lake' 
              ? 'border-blue-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          VHIO-Lake
          <Info size={14} className="text-blue-400" />
        </button>
        <button 
          onClick={() => onTabChange('catalogue')}
          className={`h-full px-2 flex items-center gap-2 border-b-2 transition-all text-xs font-black uppercase tracking-widest ${
            activeTab === 'catalogue' 
              ? 'border-blue-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Data Catalogue
        </button>
        <button 
          onClick={() => onTabChange('workspace')}
          className={`h-full px-2 flex items-center gap-2 border-b-2 transition-all text-xs font-black uppercase tracking-widest ${
            activeTab === 'workspace' 
              ? 'border-blue-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          My Workspace
          <Layout size={14} className="text-indigo-400" />
        </button>
      </nav>

      {/* Right: User & Config */}
      <div className="flex items-center gap-2 md:gap-5">
        <div className="hidden sm:flex items-center gap-1">
          {/* Notification Button & Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsUserMenuOpen(false);
              }}
              className={`p-2 rounded-md transition-all relative ${isNotificationsOpen ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-red-500 border-2 border-slate-800 rounded-full flex items-center justify-center text-[7px] font-black text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                  <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Notifications</h3>
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-[9px] font-black text-blue-600 uppercase hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group flex gap-3 ${!notif.read ? 'bg-blue-50/20' : ''}`}
                        >
                          <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${notif.type === 'incoming_request' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {notif.type === 'incoming_request' ? <Database size={16} /> : <CheckCircle size={16} />}
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight truncate">{notif.title}</span>
                              <span className="text-[8px] font-bold text-slate-300 uppercase whitespace-nowrap">{notif.time}</span>
                            </div>
                            <p className="text-[10px] font-medium text-slate-500 leading-normal">
                              {notif.description}
                            </p>
                            {!notif.read && (
                              <div className="mt-2 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                <span className="text-[8px] font-black text-blue-500 uppercase">New</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center opacity-30 text-slate-400">
                        <Bell size={32} />
                        <p className="mt-3 text-[10px] font-black uppercase tracking-widest">No notifications</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-slate-50 text-center">
                    <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                      View Activity Log
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={() => {
              onTabChange('settings');
              setIsNotificationsOpen(false);
              setIsUserMenuOpen(false);
            }}
            className={`p-2 rounded-md transition-all ${activeTab === 'settings' ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Settings size={20} />
          </button>
        </div>
        
        <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>

        {/* User Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-3 p-1.5 hover:bg-white/5 rounded-lg transition-all group"
          >
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-white leading-none mb-1">Dr. Julian Vales</p>
              <p className="text-[10px] font-medium text-slate-400">Principal Investigator</p>
            </div>
            <div className={`w-9 h-9 bg-slate-700 border-2 rounded-full flex items-center justify-center shadow-sm overflow-hidden transition-all ${isUserMenuOpen ? 'border-blue-500' : 'border-slate-600 group-hover:border-blue-500/50'}`}>
              <User size={20} className="text-slate-400" />
            </div>
            <ChevronDown size={14} className={`text-slate-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsUserMenuOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                <button 
                  onClick={() => {
                    onTabChange('profile');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <UserCircle size={16} className="text-slate-400" />
                  Profile
                </button>
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left">
                  <LogOut size={16} className="text-red-400" />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
