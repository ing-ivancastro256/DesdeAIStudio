import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CreditCard,
  Filter,
  Users,
  Calendar,
  ClipboardCheck,
  BarChart3,
  Plug,
  Globe,
  Settings2,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const {
    organization,
    planEntitlements,
    contacts,
    funnels,
    appointments,
    isSuperAdminMode,
    referralCode,
    openUpgradeModal,
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'card', label: 'Tarjeta Virtual', icon: CreditCard, badge: 'Viral' },
    { id: 'funnels', label: 'Embudos de Venta', icon: Filter, count: funnels.length },
    { id: 'crm', label: 'CRM & Contactos', icon: Users, count: contacts.length },
    { id: 'calendar', label: 'Calendario y Citas', icon: Calendar, count: appointments.length },
    { id: 'forms', label: 'Formularios Calificación', icon: ClipboardCheck },
    { id: 'analytics', label: 'Analítica Nativa', icon: BarChart3 },
    { id: 'integrations', label: 'Integraciones Email', icon: Plug },
    { id: 'domains', label: 'Dominios Propios', icon: Globe, lockBasic: organization.plan_code === 'FREE' },
    { id: 'billing', label: 'Plan & Facturación', icon: Settings2 },
  ];

  if (isSuperAdminMode) {
    navItems.push({
      id: 'superadmin',
      label: 'Super Admin',
      icon: Shield,
    });
  }

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col h-screen shrink-0 sticky top-0">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-100 gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#1C1C1C] flex items-center justify-center text-white font-bold font-['Poppins'] text-sm shadow-sm tracking-wider">
          SSP
        </div>
        <div>
          <div className="font-['Poppins'] font-bold text-base tracking-tight text-[#121111]">
            Scale Sales Pro
          </div>
          <div className="text-[10px] uppercase font-semibold tracking-wider text-[#5B5B66] -mt-1 font-['Inter']">
            MVP 1.0 • B2B SaaS
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 font-['Inter']">
          Sistema Comercial
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.lockBasic) {
                  openUpgradeModal(
                    'Dominios Propios',
                    'Conectar un dominio propio (.com, .io, etc.) es exclusivo del Plan Basic.',
                    'Pasa al Plan Basic para reflejar tu marca y eliminar el subdominio genérico.'
                  );
                } else {
                  onSelectTab(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#2848F0] text-white shadow-sm font-semibold'
                  : 'text-[#5B5B66] hover:text-[#121111] hover:bg-zinc-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`}
                />
                <span className="font-['Inter']">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      isActive
                        ? 'bg-blue-400/30 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isActive
                        ? 'bg-blue-400/30 text-white'
                        : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
                {item.lockBasic && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-600 font-semibold">
                    BASIC
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Plan Quotas & Limits Box */}
      <div className="p-4 border-t border-zinc-100 bg-zinc-50/70">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-['Inter']">
            Uso de tu plan ({organization.plan_code})
          </span>
          {organization.plan_code === 'FREE' && (
            <button
              onClick={() =>
                openUpgradeModal(
                  'Aumenta tus Límites',
                  'Pasa a Basic para tener 5 embudos, 1,000 contactos, 100 citas al mes y Kanban CRM.',
                  'Oferta de bienvenida: $20 por tus primeros 3 meses.'
                )
              }
              className="text-[11px] font-bold text-[#2848F0] hover:underline cursor-pointer"
            >
              Mejorar
            </button>
          )}
        </div>

        {/* Quota Bars */}
        <div className="space-y-2 text-xs text-zinc-600 font-['Inter']">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span>Embudos</span>
              <span className="font-semibold text-zinc-900">
                {funnels.length} / {planEntitlements.funnel_limit}
              </span>
            </div>
            <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#2848F0] h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (funnels.length / planEntitlements.funnel_limit) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span>Contactos CRM</span>
              <span className="font-semibold text-zinc-900">
                {contacts.length} / {planEntitlements.contacts_limit}
              </span>
            </div>
            <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#1C1C1C] h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (contacts.length / planEntitlements.contacts_limit) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Referral Tracking indicator */}
        {referralCode && (
          <div className="mt-3 pt-2 border-t border-zinc-200/80 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Afiliado:</span>
            <span className="font-mono font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              ?ref={referralCode}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
