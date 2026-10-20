import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Plus,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export const DomainsView: React.FC = () => {
  const {
    customDomains,
    addCustomDomain,
    organization,
    planEntitlements,
    openUpgradeModal,
  } = useApp();

  const [newDomain, setNewDomain] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    const ok = addCustomDomain(newDomain.trim());
    if (ok) {
      setNewDomain('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 bg-white rounded-xl border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold font-['Poppins'] text-[#121111]">
            Dominios Personalizados ({customDomains.length} / {planEntitlements.custom_domains_limit})
          </h2>
          <p className="text-xs text-[#5B5B66] font-['Inter']">
            Conecta tu propio dominio (ej: tuagencia.com) para que tu tarjeta y tus embudos muestren tu propia marca.
          </p>
        </div>

        {organization.plan_code === 'FREE' && (
          <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Exclusivo del Plan Basic</span>
          </span>
        )}
      </div>

      {/* If FREE, show Lock & Upgrade Card */}
      {organization.plan_code === 'FREE' ? (
        <div className="p-8 bg-white rounded-xl border border-zinc-200 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2848F0] flex items-center justify-center mx-auto">
            <Globe className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
              Usa Tu Propia Dirección Web
            </h3>
            <p className="text-xs text-[#5B5B66] font-['Inter'] mt-1 leading-relaxed">
              En lugar de usar <code>ssp.app/c/tu-nombre</code>, conecta tu dominio corporativo con certificado SSL automático y elimina el subdominio de Scale Sales Pro.
            </p>
          </div>
          <button
            onClick={() =>
              openUpgradeModal(
                'Dominios Personalizados',
                'Conecta 1 dominio propio completo en el Plan Basic.',
                'Aprovecha la promoción de $20 USD por tus primeros 3 meses.'
              )
            }
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] shadow-sm cursor-pointer"
          >
            Mejorar a Plan Basic
          </button>
        </div>
      ) : (
        /* BASIC DOMAIN MANAGEMENT */
        <div className="space-y-6">
          {/* Add Domain Form */}
          <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-xs">
            <h3 className="text-base font-bold font-['Poppins'] text-[#121111] mb-3">
              Conectar Nuevo Dominio
            </h3>
            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="ej: consultas.minegocio.com o minegocio.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="flex-1 p-2.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] rounded-lg shadow-sm cursor-pointer shrink-0"
              >
                Conectar y Verificar
              </button>
            </form>

            <div className="mt-4 p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs font-['Inter'] text-zinc-600">
              <div className="font-semibold text-zinc-900 mb-1">Configuración DNS requerida:</div>
              <div className="font-mono text-[11px] text-zinc-700">
                Registro CNAME: <code>@ o www</code> apuntando a <code>cname.scalesalespro.com</code>
              </div>
            </div>
          </div>

          {/* Connected Domains List */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-zinc-200 bg-zinc-50 font-['Poppins'] font-bold text-xs text-zinc-800">
              Dominios Conectados
            </div>
            <div className="divide-y divide-zinc-100">
              {customDomains.map((cd) => (
                <div key={cd.id} className="p-4 flex items-center justify-between text-xs font-['Inter']">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span className="font-mono font-bold text-zinc-900">{cd.domain}</span>
                  </div>
                  <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verificado & SSL Activo</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
