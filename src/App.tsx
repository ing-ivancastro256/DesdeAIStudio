import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { VirtualCardView } from './components/views/VirtualCardView';
import { FunnelsView } from './components/views/FunnelsView';
import { CRMView } from './components/views/CRMView';
import { CalendarView } from './components/views/CalendarView';
import { FormsView } from './components/views/FormsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { IntegrationsView } from './components/views/IntegrationsView';
import { DomainsView } from './components/views/DomainsView';
import { BillingView } from './components/views/BillingView';
import { SuperAdminView } from './components/views/SuperAdminView';
import { VisualEditor } from './components/editor/VisualEditor';
import { UpgradeLimitModal } from './components/common/UpgradeLimitModal';
import { PublicCardModal } from './components/views/PublicCardModal';
import { PublicFunnelModal } from './components/views/PublicFunnelModal';
import { OnboardingModal } from './components/views/OnboardingModal';
import { FunnelPage } from './types';
import { CheckCircle2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isEditingPage, setIsEditingPage] = useState<boolean>(false);
  const [selectedEditorPage, setSelectedEditorPage] = useState<FunnelPage | undefined>(undefined);
  const [editorFunnelId, setEditorFunnelId] = useState<string | null>(null);

  const [showPublicCardModal, setShowPublicCardModal] = useState<boolean>(false);
  const [showPublicFunnelModal, setShowPublicFunnelModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);

  const { toastMessage, activeFunnel, funnels, setActiveFunnelId } = useApp();

  const handleOpenVisualEditorForPage = (page: FunnelPage, funnelId?: string) => {
    const targetFunnelId = funnelId || page.funnel_id || activeFunnel?.id || funnels[0]?.id;
    if (targetFunnelId) {
      setActiveFunnelId(targetFunnelId);
    }
    setSelectedEditorPage({ ...page, funnel_id: targetFunnelId || page.funnel_id });
    setEditorFunnelId(targetFunnelId || null);
    setIsEditingPage(true);
  };

  const handleOpenVisualEditorDefault = () => {
    const targetFunnel = activeFunnel || funnels[0];
    const page = targetFunnel?.pages?.[0];
    if (page && targetFunnel) {
      handleOpenVisualEditorForPage(page, targetFunnel.id);
    }
  };

  return (
    <div className="flex h-screen bg-[#FBFBFD] overflow-hidden text-[#121111] font-['Inter']">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setIsEditingPage(false);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentTab={currentTab}
          onOpenPublicCard={() => setShowPublicCardModal(true)}
          onOpenPublicFunnel={() => setShowPublicFunnelModal(true)}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardView
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onOpenPublicCard={() => setShowPublicCardModal(true)}
                onOpenPublicFunnel={() => setShowPublicFunnelModal(true)}
              />
            )}

            {currentTab === 'card' && (
              <VirtualCardView
                onOpenVisualEditor={handleOpenVisualEditorDefault}
                onOpenPublicCard={() => setShowPublicCardModal(true)}
              />
            )}

            {currentTab === 'funnels' && (
              <FunnelsView
                onOpenVisualEditorForPage={handleOpenVisualEditorForPage}
                onOpenPublicFunnel={() => setShowPublicFunnelModal(true)}
              />
            )}

            {currentTab === 'crm' && <CRMView />}

            {currentTab === 'calendar' && <CalendarView />}

            {currentTab === 'forms' && <FormsView />}

            {currentTab === 'analytics' && <AnalyticsView />}

            {currentTab === 'integrations' && <IntegrationsView />}

            {currentTab === 'domains' && <DomainsView />}

            {currentTab === 'billing' && <BillingView />}

            {currentTab === 'superadmin' && <SuperAdminView />}
          </div>
        </main>
      </div>

      {/* FULL-SCREEN DRAG AND DROP VISUAL EDITOR */}
      {isEditingPage && (
        <VisualEditor
          initialPage={selectedEditorPage}
          funnelId={editorFunnelId || activeFunnel?.id}
          onExit={() => {
            setIsEditingPage(false);
            setSelectedEditorPage(undefined);
            setEditorFunnelId(null);
          }}
        />
      )}

      {/* MODALS */}
      <UpgradeLimitModal />

      <PublicCardModal
        isOpen={showPublicCardModal}
        onClose={() => setShowPublicCardModal(false)}
        onOpenFunnel={() => setShowPublicFunnelModal(true)}
      />

      <PublicFunnelModal
        isOpen={showPublicFunnelModal}
        onClose={() => setShowPublicFunnelModal(false)}
      />

      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1C1C] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-zinc-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
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
