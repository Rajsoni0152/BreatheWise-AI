import React, { useState, useEffect } from 'react';
import { AirQualityProvider, useAirQuality } from './context/AirQualityContext';
import { ImpactProvider } from './context/ImpactContext';
import { Navbar } from './components/Navbar';
import { Sidebar, NAV_ITEMS } from './components/Sidebar';
import { CitySearchModal } from './components/CitySearchModal';
import { LandingPage } from './views/LandingPage';
import { DashboardView } from './views/DashboardView';
import { AssistantView } from './views/AssistantView';
import { RoutineView } from './views/RoutineView';
import { IndoorView } from './views/IndoorView';
import { TravelView } from './views/TravelView';
import { ImpactView } from './views/ImpactView';
import { LearnView } from './views/LearnView';

function AppContent() {
  const [activeTab, setActiveTab] = useState('landing');
  const { setIsSearchOpen } = useAirQuality();

  // Global keyboard shortcuts (Ctrl+K or '/' opens City Search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  // If user is on landing page, show full-screen landing with quick launch to any tab
  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <LandingPage onLaunch={(tab) => setActiveTab(tab)} />
        <CitySearchModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace: Sidebar + Dynamic View Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Desktop Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic View Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
          {activeTab === 'dashboard' && <DashboardView onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === 'assistant' && <AssistantView />}
          {activeTab === 'routine' && <RoutineView />}
          {activeTab === 'indoor' && <IndoorView />}
          {activeTab === 'travel' && <TravelView />}
          {activeTab === 'impact' && <ImpactView />}
          {activeTab === 'learn' && <LearnView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] leading-tight truncate max-w-[55px]">
                {item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Global City Search Modal */}
      <CitySearchModal />
    </div>
  );
}

export default function App() {
  return (
    <AirQualityProvider>
      <ImpactProvider>
        <AppContent />
      </ImpactProvider>
    </AirQualityProvider>
  );
}
