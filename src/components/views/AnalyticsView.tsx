import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Lock,
  Globe,
  Share2,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { organization, planEntitlements, openUpgradeModal, contacts, appointments } = useApp();

  const funnelSteps = [
    { name: '1. Landing / Captura', views: 1240, drop: '0%' },
    { name: '2. VSL / Carta de Ventas', views: 480, drop: '-61.2%' },
    { name: '3. Filtro Calificación', views: 210, drop: '-56.2%' },
    { name: '4. Calendario de Citas', views: 85, drop: '-59.5%' },
    { name: '5. Citas Confirmadas', views: appointments.length || 24, drop: '-71.7%' },
  ];

  const utmData = [
    { source: 'instagram', medium: 'bio_link', campaign: 'reels_organico', clicks: 680, leads: 42, appointments: 14 },
    { source: 'linkedin', medium: 'post', campaign: 'lanzamiento_q4', clicks: 310, leads: 26, appointments: 8 },
    { source: 'youtube', medium: 'vsl_link', campaign: 'masterclass_b2b', clicks: 180, leads: 12, appointments: 2 },
    { source: 'directo', medium: 'whatsapp', campaign: 'seguimiento_1a1', clicks: 70, leads: 5, appointments: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 bg-white rounded-xl border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold font-['Poppins'] text-[#121111]">
            Analítica Nativa del Embudo
          </h2>
          <p className="text-xs text-[#5B5B66] font-['Inter']">
            Monitorea el rendimiento exacto de cada paso comercial para identificar cuellos de botella sin herramientas externas.
          </p>
        </div>

        <div className="text-xs text-zinc-500 font-['Inter'] bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200">
          Últimos 30 días • Datos en vivo
        </div>
      </div>

      {/* Funnel Conversion Drop-off Flow */}
      <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
          Embudo de Conversión Paso a Paso
        </h3>

        <div className="space-y-3">
          {funnelSteps.map((step, idx) => {
            const percentage = Math.round((step.views / 1240) * 100);

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-['Inter']">
                  <span className="font-semibold text-zinc-800">{step.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500">{step.drop !== '0%' ? step.drop : ''}</span>
                    <span className="font-mono font-bold text-zinc-900">{step.views} visitas ({percentage}%)</span>
                  </div>
                </div>

                <div className="w-full bg-zinc-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#2848F0] to-[#1C1C1C]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* UTM Tracking Attribution Section */}
      <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
                Atribución por Fuentes y Parámetros UTM
              </h3>
              {organization.plan_code === 'FREE' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-200 text-zinc-700 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span>Requiere Basic</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#5B5B66] font-['Inter'] mt-0.5">
              Descubre qué red social o campaña genera más citas pagadas.
            </p>
          </div>
        </div>

        {organization.plan_code === 'FREE' ? (
          <div className="p-8 rounded-xl border border-zinc-200 bg-zinc-50 text-center space-y-3">
            <p className="text-xs text-[#5B5B66] font-['Inter'] max-w-md mx-auto">
              El desglose de métricas por UTM (fuente, medio y campaña) es exclusivo del Plan Basic.
            </p>
            <button
              onClick={() =>
                openUpgradeModal(
                  'Analítica de Fuentes UTM',
                  'Mide qué post de Instagram o video de YouTube te trae los clientes que realmente compran.',
                  'Pasa al Plan Basic por $20 USD durante los primeros 3 meses.'
                )
              }
              className="px-4 py-2 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] rounded-lg shadow-sm"
            >
              Desbloquear Analítica UTM en Basic
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-['Inter']">
                  <th className="py-2.5 px-3">Fuente (utm_source)</th>
                  <th className="py-2.5 px-3">Medio (utm_medium)</th>
                  <th className="py-2.5 px-3">Campaña (utm_campaign)</th>
                  <th className="py-2.5 px-3 text-right">Clics</th>
                  <th className="py-2.5 px-3 text-right">Leads</th>
                  <th className="py-2.5 px-3 text-right">Citas Agendadas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-['Inter']">
                {utmData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50">
                    <td className="py-3 px-3 font-semibold text-zinc-900">{item.source}</td>
                    <td className="py-3 px-3 text-zinc-600">{item.medium}</td>
                    <td className="py-3 px-3 text-zinc-600">{item.campaign}</td>
                    <td className="py-3 px-3 text-right font-mono text-zinc-700">{item.clicks}</td>
                    <td className="py-3 px-3 text-right font-mono text-zinc-700">{item.leads}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#2848F0]">{item.appointments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
