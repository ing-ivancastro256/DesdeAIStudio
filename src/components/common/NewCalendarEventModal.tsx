import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, Users, MapPin, AlignLeft, Video } from 'lucide-react';

interface NewCalendarEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: {
    summary: string;
    description?: string;
    location?: string;
    startDateTime: string;
    endDateTime: string;
    attendees?: string[];
  }) => Promise<any>;
}

export const NewCalendarEventModal: React.FC<NewCalendarEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [summary, setSummary] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('10:00');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [attendeesInput, setAttendeesInput] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      setError('Ingresa el título del evento');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const [hours, minutes] = startTime.split(':').map(Number);
      const start = new Date(date);
      start.setHours(hours, minutes, 0, 0);

      const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

      const attendees = attendeesInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.includes('@'));

      await onSubmit({
        summary: summary.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        attendees: attendees.length > 0 ? attendees : undefined,
      });

      // Reset & close
      setSummary('');
      setDescription('');
      setAttendeesInput('');
      setLocation('');
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error al crear el evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 font-['Poppins']">
                Nuevo Evento en Google Calendar
              </h3>
              <p className="text-xs text-zinc-500 font-['Inter']">
                Se agregará a tu calendario principal sincronizado
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">
              Título del Evento *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Llamada de Cierre de Alto Valor"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2848F0]/20 focus:border-[#2848F0]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">Fecha *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2848F0]/20 focus:border-[#2848F0]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">Hora Inicio *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2848F0]/20 focus:border-[#2848F0]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">Duración</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2848F0]/20 focus:border-[#2848F0] cursor-pointer"
              >
                <option value={15}>15 minutos</option>
                <option value={30}>30 minutos</option>
                <option value={45}>45 minutos</option>
                <option value={60}>1 hora</option>
                <option value={90}>1 hora 30 min</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">
              Invitados (emails separados por coma)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="cliente@empresa.com, socio@empresa.com"
                value={attendeesInput}
                onChange={(e) => setAttendeesInput(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2848F0]/20 focus:border-[#2848F0]"
              />
              <Users className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">
              Ubicación o enlace personalizado (opcional)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Oficina Principal o enlace Zoom (Google Meet se genera automáticamente)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2848F0]/20 focus:border-[#2848F0]"
              />
              <MapPin className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">
              Descripción o notas
            </label>
            <div className="relative">
              <textarea
                rows={2}
                placeholder="Objetivo de la sesión, temas a tratar..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2848F0]/20 focus:border-[#2848F0]"
              />
              <AlignLeft className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center gap-2.5 text-xs text-blue-800">
            <Video className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Se generará automáticamente una sala de <strong>Google Meet</strong> para esta reunión.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creando evento...</span>
                </>
              ) : (
                <span>Crear Evento en Google</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
