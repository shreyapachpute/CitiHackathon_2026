import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  User,
  Search,
  Bell,
  RefreshCw,
  ListChecks,
  Menu,
  X,
  Lock,
  ArrowRight,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleGuide: () => void;
  showGuide: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onToggleGuide, showGuide }) => {
  const {
    currentRole,
    setRole,
    customer,
    riskRequests,
    fraudReports,
    resetDemoData,
    showNotification
  } = useApp();

  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const flaggedRiskCount = riskRequests.filter(r => (r.riskScore ?? 0) >= 70).length;
  const activeFraudCount = fraudReports.filter(f => f.status !== 'RESOLVED').length;

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/90 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
        
        {/* Left: Mobile Sidebar Menu Toggle + Search Bar */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden transition-colors"
            title="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Quick Search Bar */}
          <div className="relative hidden sm:block w-64 md:w-80">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search accounts, UTR, transactions..."
              className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Right: Actions, Notifications, Role Switcher, Reset Demo */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
          
          {/* Notifications Button */}
          <button
            onClick={() => setShowNotificationsModal(true)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {(flaggedRiskCount > 0 || activeFraudCount > 0) && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Workflow Guide Toggle */}
          <button
            onClick={onToggleGuide}
            className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showGuide
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ListChecks className="h-4 w-4 text-teal-600" />
            <span>Workflow Guide</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setRole('CUSTOMER')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                currentRole === 'CUSTOMER'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setRole('INVESTIGATOR')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                currentRole === 'INVESTIGATOR'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Investigator
            </button>
          </div>

          {/* Switch Role / Login Screen Button */}
          <button
            onClick={() => setRole('SELECTION')}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-blue-700 hover:bg-blue-50/60 font-semibold text-xs transition-colors"
            title="Return to Login / Role Selection Screen"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Change Account</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (window.confirm('Reset all simulated ArthGuard accounts, transactions, and graphs?')) {
                resetDemoData();
              }
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Reset Demo Data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

        </div>
      </header>

      {/* Notifications Drawer Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Notifications & Activity</h3>
              </div>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto text-xs">
              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 space-y-1">
                <span className="font-bold text-blue-900 block">ArthGuard Automated Defense Active</span>
                <p className="text-blue-700">All outbound payments continuously evaluated against 26+ mule syndicate nodes.</p>
              </div>

              {flaggedRiskCount > 0 && (
                <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 space-y-1">
                  <span className="font-bold text-rose-900 block">Critical Mule Network Alert</span>
                  <p className="text-rose-700">₹1.00 Crore layering hub (ACC-9081-2246) active in Graph 1 & Graph 2.</p>
                </div>
              )}

              {fraudReports.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 block">Fraud Case Logged: {fraudReports[0].id}</span>
                  <p className="text-amber-700">{fraudReports[0].description.slice(0, 80)}...</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowNotificationsModal(false)}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs rounded-xl shadow transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
