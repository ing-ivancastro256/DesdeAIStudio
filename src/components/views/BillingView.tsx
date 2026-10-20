import React from 'react';
import { useApp } from '../../context/AppContext';
import { PLANS_DATA } from '../../data/initialData';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw,
  XCircle,
  HelpCircle,
} from 'lucide-react';

export const BillingView: React.FC = () => {
  const {
    organization,
    switchPlan,
    simulateHotmartPurchase,
    simulateHotmartCancel,
    openUpgradeModal,
  } = useApp();

  // EXPLICIT REQUIREMENT: Filter ONLY plans where is_public is true. PRO MUST NOT APPEAR.
  const publicPlans = PLANS_DATA.filter((p) => p.is_public);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 bg-white rounded-xl border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold font-['Poppins'] text-[#121111]">
            Planes y Facturación
          </h2>
          <p className="text-xs text-[#5B5B66] font-['Inter']">
            Suscripciones y cobros gestionados exclusivamente a través de <strong>Hotmart</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-['Inter']">Plan actual:</span>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-900 border border-zinc-200">
            {organization.plan_code}
          </span>
        </div>
      </div>

      {/* Activation Promo Banner */}
      {organization.plan_code === 'FREE' && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md relative overflow-hidden">
          <div className="max-w-xl">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white mb-2 inline-block">
              🔥 Oferta de Activación Especial
            </span>
            <h3 className="text-xl font-extrabold font-['Poppins']">
              Plan Basic por solo $20 USD durante tus primeros 3 meses
            </h3>
            <p className="text-xs text-blue-100 mt-1 leading-relaxed font-['Inter']">
              Accede a 5 embudos completos, pipeline Kanban en CRM, notas de prospectos, 1,000 contactos y elimina el sello de Scale Sales Pro. Luego continúa a solo $29/mes.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => simulateHotmartPurchase(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-[#2848F0] hover:bg-zinc-100 shadow-md transition-all cursor-pointer font-['Poppins']"
              >
                Activar Oferta de $20 con Hotmart
              </button>
              <span className="text-[11px] text-blue-200 font-['Inter']">
                Cancela en cualquier momento sin penalizaciones
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Cards (ONLY FREE AND BASIC SHOWN, PRO IS HIDDEN) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-2">
        {/* FREE PLAN */}
        <div
          className={`p-6 rounded-2xl border bg-white flex flex-col justify-between shadow-xs ${
            organization.plan_code === 'FREE'
              ? 'border-[#2848F0] ring-2 ring-[#2848F0]/20'
              : 'border-zinc-200'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold font-['Poppins'] text-[#121111]">Plan Free</h3>
              {organization.plan_code === 'FREE' && (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-[#2848F0]">
                  Tu Plan Actual
                </span>
              )}
            </div>

            <p className="text-xs text-[#5B5B66] font-['Inter'] mb-4">
              Para validar tu propuesta y agendar tus primeras citas sin costo.
            </p>

            <div className="mb-6">
              <span className="text-3xl font-extrabold font-['Poppins'] text-[#121111]">$0</span>
              <span className="text-xs text-zinc-500 font-['Inter']"> para siempre</span>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-700 font-['Inter'] border-t border-zinc-100 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1 Embudo de ventas completo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hasta 50 contactos en CRM</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hasta 10 citas al mes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tarjeta virtual interactiva</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Formulario con calificación básica</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <span>• Sello "Crea la tuya gratis con SSP"</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              disabled={organization.plan_code === 'FREE'}
              onClick={() => switchPlan('FREE')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              {organization.plan_code === 'FREE' ? 'Plan Actual' : 'Bajar a Free'}
            </button>
          </div>
        </div>

        {/* BASIC PLAN */}
        <div
          className={`p-6 rounded-2xl border bg-white flex flex-col justify-between shadow-md relative ${
            organization.plan_code === 'BASIC'
              ? 'border-[#2848F0] ring-2 ring-[#2848F0]'
              : 'border-zinc-300'
          }`}
        >
          <div className="absolute -top-3 right-6 bg-[#2848F0] text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs">
            Recomendado para Escalar
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold font-['Poppins'] text-[#121111]">Plan Basic</h3>
              {organization.plan_code === 'BASIC' && (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Activo
                </span>
              )}
            </div>

            <p className="text-xs text-[#5B5B66] font-['Inter'] mb-4">
              El sistema comercial integrado para profesionales y agencias de servicios.
            </p>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold font-['Poppins'] text-[#121111]">$29</span>
                <span className="text-xs text-zinc-500 font-['Inter']"> USD / mes</span>
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5 font-['Inter']">
                o $290 USD anuales (2 meses gratis)
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-700 font-['Inter'] border-t border-zinc-100 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>5 Embudos de ventas</strong> independientes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hasta <strong>1,000 contactos</strong> en CRM</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hasta <strong>100 citas al mes</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Pipeline Kanban</strong>, notas e historial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Dominio propio</strong> (.com)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Sin sello</strong> de Scale Sales Pro</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Atribución y analítica con parámetros <strong>UTM</strong></span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            {organization.plan_code === 'BASIC' ? (
              <div className="text-center py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl">
                Suscripción Basic Activa
              </div>
            ) : (
              <button
                onClick={() => simulateHotmartPurchase(false)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] shadow-sm transition-all cursor-pointer font-['Poppins']"
              >
                Suscribirme con Hotmart ($29/mes)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hotmart Webhook Simulator (Test Environment) */}
      <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold font-['Poppins'] text-zinc-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Simulador de Webhooks de Hotmart (Pruebas del MVP)</span>
            </h4>
            <p className="text-xs text-[#5B5B66] font-['Inter'] mt-0.5">
              Prueba en tiempo real cómo los eventos de pago de Hotmart activan, renuevan o cancelan el plan de tu organización.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => simulateHotmartPurchase(true)}
            className="p-3 rounded-lg border border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-colors cursor-pointer"
          >
            <div className="text-xs font-bold text-emerald-800 font-['Poppins']">
              1. Compra de Oferta ($20/3m)
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-['Inter']">
              Simula evento <code>PURCHASE_APPROVED</code> con promo y activa BASIC.
            </div>
          </button>

          <button
            onClick={() => simulateHotmartPurchase(false)}
            className="p-3 rounded-lg border border-zinc-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-colors cursor-pointer"
          >
            <div className="text-xs font-bold text-[#2848F0] font-['Poppins']">
              2. Suscripción Regular ($29/m)
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-['Inter']">
              Simula evento <code>SUBSCRIPTION_RENEWED</code> estándar.
            </div>
          </button>

          <button
            onClick={() => simulateHotmartCancel()}
            className="p-3 rounded-lg border border-zinc-200 hover:border-red-500 hover:bg-red-50/50 text-left transition-colors cursor-pointer"
          >
            <div className="text-xs font-bold text-red-700 font-['Poppins']">
              3. Cancelación o Impago
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-['Inter']">
              Simula evento <code>SUBSCRIPTION_CANCELED</code> y revierte a FREE.
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
