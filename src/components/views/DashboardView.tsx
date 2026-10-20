import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Calendar,
  Filter,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ArrowUpRight,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  CreditCard,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenPublicCard: () => void;
  onOpenPublicFunnel: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenPublicCard,
  onOpenPublicFunnel,
}) => {
  const {
    organization,
    contacts,
    appointments,
    funnels,
    virtualCard,
    planEntitlements,
    openUpgradeModal,
  } = useApp();

  // Metrics calculation
  const totalVisits = 1240;
  const funnelClicks = 480;
  const totalLeads = contacts.length;
  const bookedAppointments = appointments.length;
  const conversionRate = Math.round((bookedAppointments / (funnelClicks || 1)) * 100);

  const upcomingAppointments = appointments
    .filter((a) => a.status === 'agendada')
    .slice(0, 3);

  const recentContacts = contacts.slice(0, 4);

  // Status Badge color helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'nuevo':
        return { bg: '#F0F0F2', text: '#3A3A44', label: 'Nuevo' };
      case 'contactado':
        return { bg: '#EFE6FB', text: '#5B2BB0', label: 'Contactado' };
      case 'calificado':
        return { bg: '#E3E9FD', text: '#1C34B8', label: 'Calificado' };
      case 'cita_agendada':
        return { bg: '#FFF1D6', text: '#8A5A00', label: 'Cita Agendada' };
      case 'no_asistio':
        return { bg: '#FFE9DA', text: '#9A3B00', label: 'No Asistió' };
      case 'ganado':
        return { bg: '#DDF5E3', text: '#14692B', label: 'Ganado' };
      case 'perdido':
        return { bg: '#FCE4E4', text: '#A11D1D', label: 'Perdido' };
      default:
        return { bg: '#F0F0F2', text: '#3A3A44', label: status };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if funnel is in draft or limits near */}
      {funnels.some((f) => f.status === 'draft') && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs text-amber-900 font-['Inter']">
              <strong>Recordatorio:</strong> Tienes embudos guardados en borrador. Publica tu embudo para empezar a recibir citas desde tus redes sociales.
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('funnels')}
            className="text-xs font-bold text-amber-900 underline hover:no-underline cursor-pointer"
          >
            Ver Embudos
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Visitas a Tarjeta */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-['Inter']">
              Visitas Tarjeta
            </span>
            <CreditCard className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-['Poppins'] text-[#121111]">
            {totalVisits.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1 font-['Inter']">
            <span>+18.4%</span>
            <span className="text-zinc-400">vs semana previa</span>
          </div>
        </div>

        {/* Card 2: Clics al Embudo */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-['Inter']">
              Clics al Embudo
            </span>
            <ArrowUpRight className="w-4 h-4 text-[#2848F0]" />
          </div>
          <div className="text-2xl font-bold font-['Poppins'] text-[#121111]">
            {funnelClicks.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500 font-['Inter'] mt-1">
            38.7% CTR desde tarjeta
          </div>
        </div>

        {/* Card 3: Leads Calificados */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-['Inter']">
              Leads Calificados
            </span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-['Poppins'] text-[#121111]">
            {totalLeads}
          </div>
          <div className="text-[11px] text-zinc-500 font-['Inter'] mt-1">
            Filtrados por reglas SSP
          </div>
        </div>

        {/* Card 4: Citas Agendadas */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-['Inter']">
              Citas Agendadas
            </span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-['Poppins'] text-[#121111]">
            {bookedAppointments}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium font-['Inter'] mt-1">
            {planEntitlements.appointments_per_month_limit - bookedAppointments} disponibles este mes
          </div>
        </div>

        {/* Card 5: Tasa de Conversión */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-['Inter']">
              Conversión Citas
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-['Poppins'] text-[#121111]">
            {conversionRate}%
          </div>
          <div className="text-[11px] text-zinc-500 font-['Inter'] mt-1">
            Clic a Cita Confirmada
          </div>
        </div>
      </div>

      {/* Main Grid: Checklist & Upgrades vs Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Commercial System Checkpoint */}
        <div className="lg:col-span-2 space-y-6">
          {/* Checkpoint "Sistema Comercial Listo" */}
          <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
                  Estado del Sistema Comercial SSP
                </h3>
                <p className="text-xs text-[#5B5B66] font-['Inter']">
                  Tu embudo conectado: Red Social → Tarjeta Virtual → Landing → VSL → Calificación → Calendario → CRM.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                100% Operativo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-lg border border-zinc-100 bg-zinc-50/60 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-zinc-900 font-['Poppins']">
                    1. Tarjeta Virtual Pública
                  </div>
                  <div className="text-[11px] text-zinc-500 font-['Inter']">
                    Publicada en /{virtualCard.slug} con botón de redirección directo.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-zinc-100 bg-zinc-50/60 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-zinc-900 font-['Poppins']">
                    2. Embudo de 5 Páginas
                  </div>
                  <div className="text-[11px] text-zinc-500 font-['Inter']">
                    Landing, Video, Calificación, Calendario y Gracias.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-zinc-100 bg-zinc-50/60 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-zinc-900 font-['Poppins']">
                    3. Calificación por Reglas
                  </div>
                  <div className="text-[11px] text-zinc-500 font-['Inter']">
                    Filtra prospectos por puntos (mínimo 50 pts) antes de agendar.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-zinc-100 bg-zinc-50/60 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-zinc-900 font-['Poppins']">
                    4. Calendario y CRM Nativos
                  </div>
                  <div className="text-[11px] text-zinc-500 font-['Inter']">
                    Disponibilidad L-V, confirmaciones por email y seguimiento de leads.
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade Invitation in Dashboard (Shown after system is ready, not right at signup) */}
            {organization.plan_code === 'FREE' && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2848F0]" />
                    <span className="text-xs font-bold font-['Poppins'] text-[#121111]">
                      Lleva tu sistema comercial al siguiente nivel
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5B5B66] font-['Inter'] mt-1">
                    Desbloquea el pipeline Kanban, notas en el CRM, dominio propio y elimina la marca de agua de Scale Sales Pro.
                  </p>
                </div>
                <button
                  onClick={() =>
                    openUpgradeModal(
                      'Oferta de Bienvenida a Plan Basic',
                      'Aprovecha el precio exclusivo de activación.',
                      'Obtén 3 meses de Plan Basic por solo $20 USD pago único.'
                    )
                  }
                  className="shrink-0 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] transition-colors shadow-sm cursor-pointer"
                >
                  Mejorar a Basic ($20/3m)
                </button>
              </div>
            )}
          </div>

          {/* Recent Leads in CRM */}
          <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
                Leads Recientes en tu Embudo
              </h3>
              <button
                onClick={() => onNavigateTab('crm')}
                className="text-xs font-semibold text-[#2848F0] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver CRM Completo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-zinc-100">
              {recentContacts.map((contact) => {
                const badge = getStatusBadge(contact.status);
                return (
                  <div
                    key={contact.id}
                    className="py-3 flex items-center justify-between hover:bg-zinc-50 px-2 rounded-lg transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-zinc-900 font-['Poppins']">
                        {contact.full_name}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-['Inter'] flex items-center gap-2 mt-0.5">
                        <span>{contact.email}</span>
                        <span>•</span>
                        <span>Puntaje: {contact.score} pts</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        style={{ backgroundColor: badge.bg, color: badge.text }}
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide"
                      >
                        {badge.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Upcoming Appointments & Quick Links */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
                Próximas Citas
              </h3>
              <button
                onClick={() => onNavigateTab('calendar')}
                className="text-xs font-semibold text-[#2848F0] hover:underline cursor-pointer"
              >
                Calendario
              </button>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 text-xs font-['Inter']">
                No hay citas agendadas pendientes.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/60 hover:bg-zinc-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-zinc-900 font-['Poppins']">
                        {app.contact_name}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        Agendada
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-600 flex items-center gap-1.5 font-['Inter']">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>
                        {new Date(app.starts_at).toLocaleDateString('es-ES', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1 font-['Inter'] truncate">
                      {app.appointment_type_name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Share Card */}
          <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-xs">
            <h3 className="text-base font-bold font-['Poppins'] text-[#121111] mb-2">
              Enlaces Públicos Activos
            </h3>
            <p className="text-xs text-[#5B5B66] font-['Inter'] mb-4">
              Pega este enlace en tu biografía de Instagram, LinkedIn o TikTok para canalizar a tu audiencia.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={onOpenPublicCard}
                className="w-full py-2.5 px-3 rounded-lg border border-zinc-200 hover:border-[#2848F0] hover:bg-blue-50/40 text-xs font-semibold text-zinc-800 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="truncate">/{virtualCard.slug} (Tarjeta)</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              </button>

              <button
                onClick={funnels.length > 0 ? onOpenPublicFunnel : () => onNavigateTab('funnels')}
                className="w-full py-2.5 px-3 rounded-lg border border-zinc-200 hover:border-[#2848F0] hover:bg-blue-50/40 text-xs font-semibold text-zinc-800 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="truncate">
                  {funnels.length > 0 ? `/${funnels[0]?.slug} (Embudo VSL)` : 'Crear Embudo de Venta'}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#2848F0] shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
