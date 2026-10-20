import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentStatus, AvailabilityRule, Appointment } from '../../types';
import { useGoogleCalendar } from '../../hooks/useGoogleCalendar';
import { GoogleSignInButton } from '../common/GoogleSignInButton';
import { NewCalendarEventModal } from '../common/NewCalendarEventModal';
import { DestructiveConfirmModal } from '../common/DestructiveConfirmModal';
import { GoogleCalendarEvent } from '../../services/googleCalendarService';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Settings,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  LogOut,
  Video,
  MapPin,
  Users,
  ExternalLink,
  Trash2,
  CalendarCheck,
  Sparkles,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const {
    appointments,
    availability,
    updateAvailability,
    updateAppointmentStatus,
    appointmentType,
    showToast,
  } = useApp();

  const {
    googleUser,
    isConnected,
    isLoadingAuth,
    isSigningIn,
    events,
    isLoadingEvents,
    error: gcalError,
    syncedAppointmentIds,
    signIn,
    signOut,
    refreshEvents,
    syncAppointment,
    createCustomEvent,
    removeEvent,
  } = useGoogleCalendar();

  const [activeTab, setActiveTab] = useState<'appointments' | 'gcal' | 'availability'>('appointments');
  const [localRules, setLocalRules] = useState<AvailabilityRule[]>(availability);

  // Modals state
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<GoogleCalendarEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [syncingApptId, setSyncingApptId] = useState<string | null>(null);
  const [isBulkSyncing, setIsBulkSyncing] = useState(false);

  const weekdays = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];

  const handleToggleDay = (weekday: number) => {
    const updated = localRules.map((rule) =>
      rule.weekday === weekday ? { ...rule, is_active: !rule.is_active } : rule
    );
    setLocalRules(updated);
    updateAvailability(updated);
  };

  const handleTimeChange = (weekday: number, field: 'start_time' | 'end_time', val: string) => {
    const updated = localRules.map((rule) =>
      rule.weekday === weekday ? { ...rule, [field]: val } : rule
    );
    setLocalRules(updated);
    updateAvailability(updated);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'agendada':
        return { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Agendada' };
      case 'completada':
        return { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Completada' };
      case 'no_asistio':
        return { bg: 'bg-orange-100', text: 'text-orange-900', label: 'No Asistió' };
      case 'cancelada':
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' };
      default:
        return { bg: 'bg-zinc-100', text: 'text-zinc-800', label: status };
    }
  };

  const handleSyncSingle = async (appt: Appointment) => {
    if (!isConnected) {
      try {
        await signIn();
      } catch {
        return;
      }
    }

    try {
      setSyncingApptId(appt.id);
      await syncAppointment(appt);
      showToast(`Cita con ${appt.contact_name} sincronizada en Google Calendar`);
    } catch (err: any) {
      showToast(err?.message || 'Error al sincronizar con Google Calendar');
    } finally {
      setSyncingApptId(null);
    }
  };

  const handleBulkSync = async () => {
    if (!isConnected) {
      try {
        await signIn();
      } catch {
        return;
      }
    }

    const unsynced = appointments.filter((a) => !syncedAppointmentIds.has(a.id));
    if (unsynced.length === 0) {
      showToast('Todas las citas ya están sincronizadas con Google Calendar');
      return;
    }

    setIsBulkSyncing(true);
    let successCount = 0;
    for (const appt of unsynced) {
      try {
        await syncAppointment(appt);
        successCount++;
      } catch (err) {
        console.error('Error syncing appt:', appt.id, err);
      }
    }
    setIsBulkSyncing(false);
    showToast(`Se sincronizaron ${successCount} citas con Google Calendar`);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      setIsDeleting(true);
      await removeEvent(eventToDelete.id);
      showToast('Evento eliminado de Google Calendar');
      setEventToDelete(null);
    } catch (err: any) {
      showToast(err?.message || 'Error al eliminar evento');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Google Calendar Integration Status Banner */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-zinc-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="3" fill="#4285F4" />
              <path d="M3 9H21" stroke="white" strokeWidth="1.5" />
              <path d="M7 2V5" stroke="#1A73E8" strokeWidth="2" strokeLinecap="round" />
              <path d="M17 2V5" stroke="#1A73E8" strokeWidth="2" strokeLinecap="round" />
              <text x="7" y="17" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
                31
              </text>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-['Poppins'] text-zinc-900">
                Google Calendar
              </h2>
              {isConnected ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Conectado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-600">
                  No conectado
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 font-['Inter'] mt-0.5">
              {isConnected && googleUser?.email
                ? `Sincronizado con la cuenta ${googleUser.email}. Citas y eventos bidireccionales.`
                : 'Conecta tu cuenta de Google para sincronizar citas de embudos y gestionar tu agenda en vivo.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {isConnected ? (
            <>
              <button
                type="button"
                onClick={() => setIsNewEventModalOpen(true)}
                className="px-3 py-2 text-xs font-semibold text-white bg-[#2848F0] hover:bg-[#1f38bf] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Evento</span>
              </button>
              <button
                type="button"
                onClick={refreshEvents}
                disabled={isLoadingEvents}
                className="p-2 text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Actualizar eventos de Google Calendar"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingEvents ? 'animate-spin text-[#2848F0]' : ''}`} />
              </button>
              <button
                type="button"
                onClick={signOut}
                className="px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                title="Desconectar cuenta"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desconectar</span>
              </button>
            </>
          ) : (
            <GoogleSignInButton
              onClick={signIn}
              disabled={isSigningIn || isLoadingAuth}
              text={isSigningIn ? 'Conectando...' : 'Conectar con Google Calendar'}
            />
          )}
        </div>
      </div>

      {gcalError && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{gcalError}</span>
          </div>
          <button
            onClick={() => refreshEvents()}
            className="px-2.5 py-1 text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-md cursor-pointer transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-1.5 bg-zinc-100 rounded-xl border border-zinc-200">
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'appointments'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Citas de Embudos ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('gcal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'gcal'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5 text-[#2848F0]" />
            <span>Eventos de Google Calendar ({events.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'availability'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Disponibilidad y Horarios
          </button>
        </div>

        {activeTab === 'appointments' && appointments.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkSync}
              disabled={isBulkSyncing}
              className="px-3 py-1.5 text-xs font-semibold text-[#2848F0] hover:bg-blue-50 bg-white border border-blue-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2848F0]" />
              <span>{isBulkSyncing ? 'Sincronizando...' : 'Sincronizar Todo a Google Calendar'}</span>
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: SSP FUNNEL APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-['Inter']">
              Historial y Próximas Sesiones de Embudos
            </span>
            <span className="text-xs text-zinc-500">
              Duración: <strong>{appointmentType.duration_minutes} minutos</strong> por sesión
            </span>
          </div>

          <div className="divide-y divide-zinc-100">
            {appointments.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400 font-['Inter']">
                No hay citas agendadas aún. Las citas aparecerán aquí en cuanto los prospectos califiquen en tu embudo.
              </div>
            ) : (
              appointments.map((app) => {
                const badge = getStatusBadge(app.status);
                const isSynced = syncedAppointmentIds.has(app.id);
                const isThisSyncing = syncingApptId === app.id;

                return (
                  <div
                    key={app.id}
                    className="p-4 hover:bg-zinc-50/60 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold font-['Poppins'] text-zinc-900">
                          {app.contact_name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                        {isSynced && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" />
                            Google Calendar
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-zinc-600 flex flex-wrap items-center gap-3 font-['Inter']">
                        <span className="flex items-center gap-1 font-semibold text-zinc-800">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          {new Date(app.starts_at).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>•</span>
                        <span>{app.contact_email}</span>
                        {app.contact_phone && (
                          <>
                            <span>•</span>
                            <span>{app.contact_phone}</span>
                          </>
                        )}
                      </div>

                      {app.notes && (
                        <div className="text-[11px] text-zinc-500 italic mt-1 font-['Inter']">
                          Nota: "{app.notes}"
                        </div>
                      )}
                    </div>

                    {/* Actions: Sync to GCal & Status updater */}
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSyncSingle(app)}
                        disabled={isThisSyncing}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                          isSynced
                            ? 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                            : 'bg-blue-50 hover:bg-blue-100 text-[#2848F0] border-blue-200'
                        }`}
                        title="Crear o actualizar evento en Google Calendar"
                      >
                        {isThisSyncing ? (
                          <span className="w-3 h-3 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                        ) : (
                          <CalendarIcon className="w-3.5 h-3.5" />
                        )}
                        <span>{isSynced ? 'Volver a sincronizar' : 'Enviar a Google Calendar'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <label className="text-[11px] text-zinc-400 font-medium">Estado:</label>
                        <select
                          value={app.status}
                          onChange={(e) =>
                            updateAppointmentStatus(app.id, e.target.value as AppointmentStatus)
                          }
                          className="p-1.5 text-xs border border-zinc-200 rounded-lg bg-white font-semibold cursor-pointer"
                        >
                          <option value="agendada">Agendada</option>
                          <option value="completada">Completada</option>
                          <option value="no_asistio">No Asistió</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE GOOGLE CALENDAR EVENTS */}
      {activeTab === 'gcal' && (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 font-['Inter']">
                Eventos en Vivo de Google Calendar
              </span>
              <p className="text-[11px] text-zinc-500 font-['Inter'] mt-0.5">
                Próximos compromisos sincronizados en tiempo real con tu cuenta de Google Workspace
              </p>
            </div>
            {isConnected && (
              <button
                type="button"
                onClick={() => setIsNewEventModalOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2848F0] hover:bg-[#1f38bf] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Evento</span>
              </button>
            )}
          </div>

          {!isConnected ? (
            <div className="p-10 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2848F0]">
                <CalendarIcon className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-sm font-bold text-zinc-900 font-['Poppins']">
                  Conecta Google Calendar para ver tus eventos
                </h3>
                <p className="text-xs text-zinc-500 font-['Inter'] mt-1">
                  Inicia sesión con tu cuenta de Google con un solo clic para ver tu calendario, reuniones de Google Meet y sincronizar citas.
                </p>
              </div>
              <div className="pt-2">
                <GoogleSignInButton
                  onClick={signIn}
                  disabled={isSigningIn}
                  text={isSigningIn ? 'Iniciando sesión...' : 'Conectar con Google Calendar'}
                />
              </div>
            </div>
          ) : isLoadingEvents ? (
            <div className="p-12 text-center space-y-3">
              <div className="inline-block w-8 h-8 border-3 border-zinc-200 border-t-[#2848F0] rounded-full animate-spin" />
              <p className="text-xs text-zinc-500 font-['Inter']">Cargando eventos de Google Calendar...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-xs text-zinc-400 font-['Inter']">
                No hay eventos próximos en tu calendario principal para los próximos días.
              </p>
              <button
                type="button"
                onClick={() => setIsNewEventModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-[#2848F0] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                Crear tu primer evento
              </button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {events.map((evt) => {
                const startTime = evt.start?.dateTime || evt.start?.date;
                const endTime = evt.end?.dateTime || evt.end?.date;

                const formattedDate = startTime
                  ? new Date(startTime).toLocaleDateString('es-ES', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })
                  : 'Fecha por definir';

                const formattedTime = evt.start?.dateTime
                  ? `${new Date(evt.start.dateTime).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })} - ${
                      evt.end?.dateTime
                        ? new Date(evt.end.dateTime).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''
                    }`
                  : 'Todo el día';

                return (
                  <div
                    key={evt.id}
                    className="p-4 hover:bg-zinc-50/70 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold font-['Poppins'] text-zinc-900 truncate">
                          {evt.summary || '(Sin título)'}
                        </h4>
                        {evt.status === 'confirmed' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Confirmado
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600 font-['Inter']">
                        <span className="flex items-center gap-1 font-semibold text-zinc-800">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          {formattedDate} • {formattedTime}
                        </span>

                        {evt.location && (
                          <span className="flex items-center gap-1 text-zinc-500">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                            {evt.location}
                          </span>
                        )}

                        {evt.attendees && evt.attendees.length > 0 && (
                          <span className="flex items-center gap-1 text-zinc-500">
                            <Users className="w-3.5 h-3.5 text-zinc-400" />
                            {evt.attendees.length} invitado(s)
                          </span>
                        )}
                      </div>

                      {evt.description && (
                        <p className="text-[11px] text-zinc-500 line-clamp-2 font-['Inter']">
                          {evt.description}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {evt.hangoutLink && (
                        <a
                          href={evt.hangoutLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-[#00897B] hover:bg-[#00796B] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Unirse a Meet</span>
                        </a>
                      )}

                      {evt.htmlLink && (
                        <a
                          href={evt.htmlLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
                          title="Abrir en Google Calendar"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => setEventToDelete(evt)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar evento de Google Calendar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AVAILABILITY RULES CONFIG */}
      {activeTab === 'availability' && (
        <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
              Horarios Semanales de Disponibilidad
            </h3>
            <p className="text-xs text-[#5B5B66] font-['Inter'] mt-1">
              Configura los días y rangos de hora en que los visitantes pueden agendar automáticamente.
            </p>
          </div>

          <div className="divide-y divide-zinc-100">
            {localRules.map((rule) => (
              <div
                key={rule.id}
                className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 w-40">
                  <input
                    type="checkbox"
                    id={`day_${rule.weekday}`}
                    checked={rule.is_active}
                    onChange={() => handleToggleDay(rule.weekday)}
                    className="w-4 h-4 text-[#2848F0] rounded border-zinc-300 focus:ring-0 cursor-pointer"
                  />
                  <label
                    htmlFor={`day_${rule.weekday}`}
                    className={`text-xs font-bold cursor-pointer ${
                      rule.is_active ? 'text-zinc-900' : 'text-zinc-400 line-through'
                    }`}
                  >
                    {weekdays[rule.weekday]}
                  </label>
                </div>

                {rule.is_active ? (
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-zinc-500 font-medium">Desde:</span>
                    <input
                      type="time"
                      value={rule.start_time}
                      onChange={(e) => handleTimeChange(rule.weekday, 'start_time', e.target.value)}
                      className="p-1.5 border border-zinc-200 rounded-md bg-zinc-50 font-mono text-xs"
                    />

                    <span className="text-zinc-500 font-medium">Hasta:</span>
                    <input
                      type="time"
                      value={rule.end_time}
                      onChange={(e) => handleTimeChange(rule.weekday, 'end_time', e.target.value)}
                      className="p-1.5 border border-zinc-200 rounded-md bg-zinc-50 font-mono text-xs"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-zinc-400 italic">No disponible para reservas</span>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
            <div className="text-xs text-blue-900 font-['Inter']">
              <strong>Zona Horaria Configurada:</strong> America/Mexico_City (GMT-6). Las citas se ajustan al huso horario de tu cliente.
            </div>
            <span className="text-[11px] font-bold text-[#2848F0] bg-blue-100 px-2.5 py-1 rounded-md">
              Automático
            </span>
          </div>
        </div>
      )}

      {/* Modal: New Event */}
      <NewCalendarEventModal
        isOpen={isNewEventModalOpen}
        onClose={() => setIsNewEventModalOpen(false)}
        onSubmit={async (params) => {
          await createCustomEvent(params);
          showToast('Evento creado en Google Calendar exitosamente');
        }}
      />

      {/* Modal: Confirm Deletion (MANDATORY User Confirmation for destructive API operation) */}
      <DestructiveConfirmModal
        isOpen={Boolean(eventToDelete)}
        title="Eliminar Evento de Google Calendar"
        message={`¿Estás seguro de que deseas eliminar permanentemente "${eventToDelete?.summary || 'este evento'}" de tu Google Calendar? Esta acción borrará el evento de tu cuenta de Google y notificará a los invitados.`}
        confirmLabel="Sí, eliminar de Google"
        cancelLabel="Cancelar"
        isProcessing={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setEventToDelete(null)}
      />
    </div>
  );
};
