import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Send,
  Shield,
  FileWarning,
  History,
  Lock,
  Layers,
  Share2,
  Activity,
  AlertTriangle,
  Sliders,
  CreditCard,
  HelpCircle,
  TrendingUp,
  Cpu,
  User,
  Search,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    currentRole,
    setRole,
    activeSidebarTab,
    setActiveSidebarTab,
    customer,
    riskRequests,
    fraudReports,
    freezeRequests
  } = useApp();

  const flaggedAlertsCount = riskRequests.filter(r => (r.riskScore ?? 0) >= 70).length;
  const activeCasesCount = fraudReports.filter(f => f.status !== 'RESOLVED').length;
  const pendingFreezesCount = freezeRequests.filter(f => f.status === 'PENDING_BANK_AUTHORIZATION').length;

  const customerNavItems = [
    { id: 'HOME', label: 'Home', icon: Home, desc: 'Personal Dashboard' },
    { id: 'PAYMENTS', label: 'Payments', icon: Send, desc: 'Send Money & Transfer' },
    { id: 'SECURITY', label: 'Risk Radar', icon: Shield, desc: 'Counterparty Safety' },
    { id: 'DISPUTES', label: 'Disputes & Fraud', icon: FileWarning, badge: fraudReports.length, desc: 'Filed Reports' },
    { id: 'HISTORY', label: 'Statements', icon: History, desc: 'Transaction History' },
    { id: 'SERVICES', label: 'Security Center', icon: Sliders, desc: 'Limits & Protection' }
  ];

  const investigatorNavItems = [
    { id: 'OVERVIEW', label: 'Fraud Radar', icon: TrendingUp, desc: 'KPI Hub & Threat Stats' },
    { id: 'ALERTS', label: 'Risk Alerts', icon: Activity, badge: flaggedAlertsCount, desc: 'AI Flagged Telemetry' },
    { id: 'FUND_FLOW', label: 'Fund-Flow Graph', icon: Layers, desc: 'Graph 1: Money Trail' },
    { id: 'IDENTITY_GRAPH', label: 'Identity Links', icon: Share2, desc: 'Graph 2: Mule Cluster' },
    { id: 'FRAUD_REPORTS', label: 'Fraud Reports', icon: FileWarning, badge: activeCasesCount, desc: 'Victim Dossiers' },
    { id: 'FREEZES', label: 'Freeze Pipeline', icon: Lock, badge: pendingFreezesCount, desc: 'Bank Authorization' },
    { id: 'MONITORING', label: 'Monitoring', icon: History, desc: 'Live Txn Stream' }
  ];

  const items = currentRole === 'INVESTIGATOR' ? investigatorNavItems : customerNavItems;

  const handleTabClick = (tabId: string) => {
    setActiveSidebarTab(tabId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 shadow-sm flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo & Switcher Header */}
        <div>
          <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveSidebarTab(currentRole === 'INVESTIGATOR' ? 'OVERVIEW' : 'HOME')}>
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
                  ArthGuard
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-teal-600 uppercase">
                  {currentRole === 'INVESTIGATOR' ? 'Fraud Operations' : 'Digital Banking'}
                </span>
              </div>
            </div>

            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200">
              v2.5
            </span>
          </div>

          {/* Role Status Tag */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${currentRole === 'INVESTIGATOR' ? 'bg-indigo-600 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-slate-600 font-medium">
                {currentRole === 'INVESTIGATOR' ? 'Inspector Vikram Rao' : customer.name}
              </span>
            </div>
            <button
              onClick={() => setRole(currentRole === 'INVESTIGATOR' ? 'CUSTOMER' : 'INVESTIGATOR')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline decoration-dotted"
            >
              Switch
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)]">
            {items.map(item => {
              const Icon = item.icon;
              const isActive = activeSidebarTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                    <div className="text-left">
                      <span className="block leading-tight">{item.label}</span>
                      <span className={`text-[10px] block leading-tight font-normal ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                        {item.desc}
                      </span>
                    </div>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white text-blue-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Security Snapshot */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs">
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                {currentRole === 'INVESTIGATOR' ? 'VR' : 'AM'}
              </div>
              <div>
                <span className="font-bold text-slate-800 block text-xs leading-tight">
                  {currentRole === 'INVESTIGATOR' ? 'Lead Investigator' : 'Primary Account'}
                </span>
                <span className="font-mono text-[10px] text-slate-400 block leading-tight">
                  {currentRole === 'INVESTIGATOR' ? 'CYBER-INV-04' : customer.id}
                </span>
              </div>
            </div>

            <button
              onClick={() => setRole('SELECTION')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Logout / Change Role"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
