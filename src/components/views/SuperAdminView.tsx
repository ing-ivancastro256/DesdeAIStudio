import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PLAN_ENTITLEMENTS_MAP } from '../../data/initialData';
import {
  ShieldAlert,
  Building,
  TrendingUp,
  CreditCard,
  Users,
  Settings,
  Database,
  Search,
} from 'lucide-react';

export const SuperAdminView: React.FC = () => {
  const { organization } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  // Sample organizations data for super admin audit
  const sampleOrganizations = [
    {
      id: 'org_ssp_demo',
      name: organization.name,
      plan_code: organization.plan_code,
      status: 'active',
      contacts: 6,
      created_at: '2026-09-01',
      mrr: organization.plan_code === 'BASIC' ? '$29 USD' : '$0 USD',
      owner: 'Alejandro Valenzuela',
      referred_by: 'ssp-aff-88',
    },
    {
      id: 'org_ssp_102',
      name: 'Mentoría Financiera Élite',
      plan_code: 'BASIC',
      status: 'active',
      contacts: 312,
      created_at: '2026-09-12',
      mrr: '$29 USD',
      owner: 'Rodrigo Carranza',
      referred_by: 'directo',
    },
    {
      id: 'org_ssp_103',
      name: 'Agencia Performance B2B',
      plan_code: 'BASIC',
      status: 'active',
      contacts: 890,
      created_at: '2026-08-20',
      mrr: '$29 USD',
      owner: 'Camila Suárez',
      referred_by: 'ssp-aff-12',
    },
    {
      id: 'org_ssp_104',
      name: 'Coaching de Carrera Ejecutiva',
      plan_code: 'FREE',
      status: 'active',
      contacts: 24,
      created_at: '2026-10-02',
      mrr: '$0 USD',
      owner: 'Diego Navarro',
      referred_by: 'ssp-aff-88',
    },
    {
      id: 'org_ssp_105',
      name: 'Consultoría Legal Corporativa',
      plan_code: 'BASIC',
      status: 'active',
      contacts: 145,
      created_at: '2026-09-28',
      mrr: '$29 USD',
      owner: 'Sofía Montalvo',
      referred_by: 'directo',
    },
  ];

  const totalMRR = 3 * 29 + (organization.plan_code === 'BASIC' ? 29 : 0);
  const totalOrgs = sampleOrganizations.length;
  const basicOrgs = sampleOrganizations.filter(
    (o) => o.id !== organization.id ? o.plan_code === 'BASIC' : organization.plan_code === 'BASIC'
  ).length;
  const conversionRate = Math.round((basicOrgs / totalOrgs) * 100);

  const filteredOrgs = sampleOrganizations.filter((o) =>
    o.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-200 text-purple-900">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-['Poppins'] text-purple-950">
              Panel de Super Administrador de Scale Sales Pro
            </h2>
            <p className="text-xs text-purple-800 font-['Inter']">
              Vista global de plataforma: métricas de negocio SaaS, organizaciones multi-tenant y configuración de planes.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 bg-purple-200 text-purple-900 rounded-lg">
          Acceso Plataforma Global
        </span>
      </div>

      {/* KPI SaaS Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-['Inter'] mb-1">
            MRR Estimado
          </div>
          <div className="text-2xl font-bold font-['Poppins'] text-[#121111]">
            ${totalMRR} USD
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Facturación recurrente mensual
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-['Inter'] mb-1">
            Organizaciones Activas
          </div>
          <div className="text-2xl font-bold font-['Poppins'] text-[#121111]">
            {totalOrgs}
          </div>
          <div className="text-[11px] text-zinc-500 font-['Inter'] mt-1">
            Multi-tenant con Row Level Security
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-['Inter'] mb-1">
            Conversión Free → Basic
          </div>
          <div className="text-2xl font-bold font-['Poppins'] text-[#2848F0]">
            {conversionRate}%
          </div>
          <div className="text-[11px] text-zinc-500 font-['Inter'] mt-1">
            {basicOrgs} organizaciones de pago
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-['Inter'] mb-1">
            Tasa de Cancelación (Churn)
          </div>
          <div className="text-2xl font-bold font-['Poppins'] text-emerald-700">
            0.0%
          </div>
          <div className="text-[11px] text-zinc-500 font-['Inter'] mt-1">
            Sin cancelaciones en el ciclo
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
            Todas las Organizaciones (Tenants)
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-['Inter']">
                <th className="py-2.5 px-3">Organización</th>
                <th className="py-2.5 px-3">Propietario</th>
                <th className="py-2.5 px-3">Plan</th>
                <th className="py-2.5 px-3">Contactos CRM</th>
                <th className="py-2.5 px-3">Código Afiliado</th>
                <th className="py-2.5 px-3">MRR</th>
                <th className="py-2.5 px-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-['Inter']">
              {filteredOrgs.map((org) => {
                const isCurrent = org.id === organization.id;
                const activePlan = isCurrent ? organization.plan_code : org.plan_code;

                return (
                  <tr key={org.id} className="hover:bg-zinc-50">
                    <td className="py-3 px-3">
                      <div className="font-bold text-zinc-900 font-['Poppins']">
                        {isCurrent ? organization.name : org.name}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">{org.id}</div>
                    </td>
                    <td className="py-3 px-3 text-zinc-700">{org.owner}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          activePlan === 'BASIC'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {activePlan}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-700">{org.contacts}</td>
                    <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">
                      {org.referred_by}
                    </td>
                    <td className="py-3 px-3 font-semibold text-zinc-900">
                      {activePlan === 'BASIC' ? '$29 USD' : '$0 USD'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Activo
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Entitlements Config in Database */}
      <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
            Tabla de Entitlements (Límites por Plan en BD)
          </h3>
          <p className="text-xs text-[#5B5B66] font-['Inter'] mt-0.5">
            Límites parametrizados en la tabla <code>plan_entitlements</code>. Ningún límite vive hardcodeado en el código fuente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-['Inter']">
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
            <h4 className="font-bold text-sm text-zinc-900 font-['Poppins']">
              Plan FREE
            </h4>
            <div className="space-y-1 text-zinc-600">
              <div className="flex justify-between">
                <span>funnel_limit:</span>
                <span className="font-mono font-bold text-zinc-900">{PLAN_ENTITLEMENTS_MAP.FREE.funnel_limit}</span>
              </div>
              <div className="flex justify-between">
                <span>contacts_limit:</span>
                <span className="font-mono font-bold text-zinc-900">{PLAN_ENTITLEMENTS_MAP.FREE.contacts_limit}</span>
              </div>
              <div className="flex justify-between">
                <span>appointments_per_month_limit:</span>
                <span className="font-mono font-bold text-zinc-900">{PLAN_ENTITLEMENTS_MAP.FREE.appointments_per_month_limit}</span>
              </div>
              <div className="flex justify-between">
                <span>kanban_crm:</span>
                <span className="font-mono font-bold text-red-600">false</span>
              </div>
              <div className="flex justify-between">
                <span>remove_branding:</span>
                <span className="font-mono font-bold text-red-600">false</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2">
            <h4 className="font-bold text-sm text-zinc-900 font-['Poppins']">
              Plan BASIC
            </h4>
            <div className="space-y-1 text-zinc-600">
              <div className="flex justify-between">
                <span>funnel_limit:</span>
                <span className="font-mono font-bold text-[#2848F0]">{PLAN_ENTITLEMENTS_MAP.BASIC.funnel_limit}</span>
              </div>
              <div className="flex justify-between">
                <span>contacts_limit:</span>
                <span className="font-mono font-bold text-[#2848F0]">{PLAN_ENTITLEMENTS_MAP.BASIC.contacts_limit}</span>
              </div>
              <div className="flex justify-between">
                <span>appointments_per_month_limit:</span>
                <span className="font-mono font-bold text-[#2848F0]">{PLAN_ENTITLEMENTS_MAP.BASIC.appointments_per_month_limit}</span>
              </div>
              <div className="flex justify-between">
                <span>kanban_crm:</span>
                <span className="font-mono font-bold text-emerald-600">true</span>
              </div>
              <div className="flex justify-between">
                <span>remove_branding:</span>
                <span className="font-mono font-bold text-emerald-600">true</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
