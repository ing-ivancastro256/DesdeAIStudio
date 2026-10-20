import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  X,
  CreditCard,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const UpgradeLimitModal: React.FC = () => {
  const { upgradeModal, closeUpgradeModal, simulateHotmartPurchase } = useApp();

  if (!upgradeModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeUpgradeModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2848F0] mb-4">
          <Zap className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold font-['Poppins'] text-[#121111]">
          {upgradeModal.featureTitle || 'Desbloquea el Plan Basic'}
        </h3>
        <p className="text-sm text-[#5B5B66] font-['Inter'] mt-1.5 leading-relaxed">
          {upgradeModal.limitMessage ||
            'Has llegado al límite de tu plan actual o estás utilizando una funcionalidad avanzada.'}
        </p>

        {/* Promo Activation Card */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2848F0] bg-blue-100/80 px-2 py-0.5 rounded">
              🔥 Oferta de Activación
            </span>
            <span className="text-xs text-zinc-500 line-through font-semibold">
              $87 USD
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-[#121111] font-['Poppins']">
              $20 USD
            </span>
            <span className="text-xs font-semibold text-zinc-600">
              pago único por 3 meses completos
            </span>
          </div>
          <p className="text-[11px] text-[#5B5B66] mt-1 font-['Inter']">
            Luego continúa a solo $29/mes. Cancela en cualquier momento sin penalizaciones.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="mt-4 space-y-2 text-xs text-zinc-700 font-['Inter']">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Hasta <strong>5 embudos completos</strong> de alta conversión (vs 1 en Free)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Hasta <strong>1,000 contactos</strong> en CRM (vs 50 en Free)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Pipeline Kanban</strong>, notas del contacto e historial de eventos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Dominio propio</strong> y elimina el sello de Scale Sales Pro</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Parámetros <strong>UTM</strong> y formularios avanzados</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={() => simulateHotmartPurchase(true)}
            className="w-full py-3 px-4 rounded-xl font-bold font-['Poppins'] text-sm text-white bg-[#2848F0] hover:bg-[#1f38bf] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Aceptar Oferta y Activar Basic ($20/3m)</span>
          </button>

          <button
            onClick={closeUpgradeModal}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            Continuar con Plan Free por ahora
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
          <span>Procesamiento seguro vía Hotmart Checkout & Webhooks</span>
        </div>
      </div>
    </div>
  );
};
