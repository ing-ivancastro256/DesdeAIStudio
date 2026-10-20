import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  ExternalLink,
  CreditCard,
  User,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onOpenPublicCard: () => void;
  onOpenPublicFunnel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenPublicCard,
  onOpenPublicFunnel,
}) => {
  const {
    organization,
    profile,
    isSuperAdminMode,
    toggleSuperAdminMode,
    openUpgradeModal,
  } = useApp();

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Panel Principal';
      case 'card':
        return 'Mi Tarjeta Virtual';
      case 'funnels':
        return 'Embudos de Venta';
      case 'editor':
        return 'Editor Visual SSP';
      case 'crm':
        return 'CRM & Oportunidades Comerciales';
      case 'calendar':
        return 'Calendario y Citas Nativas';
      case 'forms':
        return 'Formularios y Calificación por Reglas';
      case 'analytics':
        return 'Analítica del Embudo Comercial';
      case 'integrations':
        return 'Integraciones de Email';
      case 'domains':
        return 'Dominios Propios';
      case 'billing':
        return 'Plan y Facturación';
      case 'superadmin':
        return 'Panel de Super Administrador';
      default:
        return 'Scale Sales Pro';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#121111] font-['Poppins'] leading-none">
            {getTabTitle()}
          </h1>
          <p className="text-xs text-[#5B5B66] font-['Inter'] mt-1">
            Organización: <span className="font-semibold text-zinc-900">{organization.name}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Public View Shortcuts */}
        <button
          onClick={onOpenPublicCard}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
          title="Ver cómo ve el público tu tarjeta virtual"
        >
          <span>Ver Tarjeta Pública</span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
        </button>

        <button
          onClick={onOpenPublicFunnel}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
          title="Probar el flujo del embudo completo de 5 pasos"
        >
          <span>Probar Embudo en Vivo</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
        </button>

        {/* Plan Badge & Upgrade Action */}
        <div className="flex items-center pl-2 border-l border-zinc-200 gap-2">
          {organization.plan_code === 'FREE' ? (
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-[#F0F0F2] text-[#3A3A44] border border-zinc-200">
                Plan Free
              </span>
              <button
                onClick={() =>
                  openUpgradeModal(
                    'Pasa al Plan Basic',
                    'Desbloquea el pipeline Kanban, notas del CRM, 5 embudos, 1,000 contactos y elimina el sello de Scale Sales Pro.',
                    'Aprovecha la oferta de activación por tiempo limitado: 3 meses por solo $20 USD.'
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#2848F0] hover:bg-[#1f38bf] rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mejorar a Basic ($20/3m)</span>
              </button>
            </div>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Plan Basic Activo</span>
            </span>
          )}
        </div>

        {/* Super Admin Switcher */}
        <button
          onClick={toggleSuperAdminMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
            isSuperAdminMode
              ? 'bg-purple-100 text-purple-800 border-purple-300 font-semibold'
              : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
          }`}
          title="Alternar entre la vista de usuario y el Panel de Super Administrador"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
          <span className="hidden sm:inline">
            {isSuperAdminMode ? 'Super Admin Activo' : 'Modo Super Admin'}
          </span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2">
          <img
            src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={profile.full_name}
            className="w-8 h-8 rounded-full object-cover border border-zinc-200"
          />
        </div>
      </div>
    </header>
  );
};
