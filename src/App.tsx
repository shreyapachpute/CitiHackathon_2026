import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { RoleSelectionModal } from './components/common/RoleSelectionModal';
import { AcceptanceTestGuide } from './components/common/AcceptanceTestGuide';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { InvestigatorDashboard } from './components/investigator/InvestigatorDashboard';
import { InitiatePaymentModal } from './components/customer/InitiatePaymentModal';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentRole, notification, clearNotification } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTestGuide, setShowTestGuide] = useState(false);
  const [showPaymentModalFromGuide, setShowPaymentModalFromGuide] = useState(false);

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans text-slate-800 antialiased">
      
      {/* Role Selection Screen */}
      {currentRole === 'SELECTION' ? (
        <RoleSelectionModal />
      ) : (
        <div className="flex-1 flex flex-col">
          
          {/* Left Vertical Sidebar (Matching reference banking tablet/desktop layout) */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main Content Area (With left margin for desktop sidebar) */}
          <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
            
            {/* Top Navigation Bar */}
            <Header
              onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
              onToggleGuide={() => setShowTestGuide(prev => !prev)}
              showGuide={showTestGuide}
            />

            {/* Collapsible Workflow Guide */}
            {showTestGuide && (
              <AcceptanceTestGuide
                onClose={() => setShowTestGuide(false)}
                onOpenPaymentModal={() => setShowPaymentModalFromGuide(true)}
              />
            )}

            {/* Dashboard Workspace */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
              {currentRole === 'CUSTOMER' && <CustomerDashboard />}
              {currentRole === 'INVESTIGATOR' && <InvestigatorDashboard />}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-800">ArthGuard</span>
                <span>• Digital Payment System & Bank Fraud Intelligence Platform</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Prototypes dual-graph analytics: Fund-Flow Tracing (Graph 1) & Identity Link Cluster (Graph 2).
              </p>
            </footer>

          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short">
          <div
            className={`p-4 rounded-2xl shadow-2xl border text-xs flex items-start space-x-3 text-white ${
              notification.type === 'success'
                ? 'bg-emerald-600 border-emerald-500 shadow-emerald-600/30'
                : notification.type === 'danger' || notification.type === 'warning'
                ? 'bg-rose-600 border-rose-500 shadow-rose-600/30'
                : 'bg-blue-600 border-blue-500 shadow-blue-600/30'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-200" />
            ) : notification.type === 'danger' || notification.type === 'warning' ? (
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-200" />
            ) : (
              <Info className="h-5 w-5 shrink-0 text-blue-200" />
            )}
            <div className="flex-1">
              <span className="font-bold block mb-0.5">
                {notification.type === 'success'
                  ? 'Success'
                  : notification.type === 'warning'
                  ? 'Alert'
                  : 'Notice'}
              </span>
              <p className="leading-relaxed opacity-95">{notification.message}</p>
            </div>
            <button
              onClick={clearNotification}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Launch Payment Modal if triggered from Guide */}
      {showPaymentModalFromGuide && (
        <InitiatePaymentModal onClose={() => setShowPaymentModalFromGuide(false)} />
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
