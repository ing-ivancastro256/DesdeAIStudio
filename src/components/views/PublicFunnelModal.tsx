import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageBlockSection, PageBlockRow, PageBlockElement } from '../../types';
import {
  getColumnSurfaceStyle,
  getColumnShadowClass,
  isSectionBoxed,
  getSectionEffectiveMaxWidth,
} from '../../utils/editorTreeUtils';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  Play,
  ClipboardList,
  Sparkles,
  Phone,
  Mail,
  User,
  AlertCircle,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

import { RichTextElement } from '../editor/elements/RichTextElement';
import { AudioPlayerElement } from '../editor/elements/AudioPlayerElement';
import { IconElement } from '../editor/elements/IconElement';
import { SimpleFormElement } from '../editor/elements/SimpleFormElement';
import { PopupButtonElement, formatCtaDisplayText } from '../editor/elements/PopupButtonElement';
import { EmbeddedVideoPlayer } from '../common/EmbeddedVideoPlayer';
import { DelayedAppearance } from '../common/DelayedAppearance';
import { renderBulletIcon } from '../../utils/bulletIcons';
import {
  CountdownTimerWidget,
  FaqAccordionWidget,
  SocialLinksWidget,
  CheckboxWidget,
  InputFieldWidget,
} from '../editor/elements/ConversionWidgets';

interface PublicFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublicFunnelModal: React.FC<PublicFunnelModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    activeFunnel,
    forms,
    submitPublicForm,
    availability,
    appointmentType,
    bookPublicAppointment,
    showToast,
  } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0: Landing, 1: VSL, 2: Qual, 3: Calendar, 4: Thanks

  // Form State
  const currentForm = forms[0];
  const [formAnswers, setFormAnswers] = useState<Record<string, any>>({
    field_name: '',
    field_email: '',
    field_phone: '',
    field_revenue: '',
    field_urgency: '',
    field_commitment: '',
  });

  const [qualificationResult, setQualificationResult] = useState<{
    submitted: boolean;
    isQualified: boolean;
    score: number;
    contactId?: string;
  }>({
    submitted: false,
    isQualified: false,
    score: 0,
  });

  // Calendar State
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(1); // 1 = Tomorrow
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00');
  const [bookingNotes, setBookingNotes] = useState<string>('');

  if (!isOpen) return null;

  const availableHours = ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00'];

  const advanceToNextStep = () => {
    if (currentStepIndex < 4) {
      setCurrentStepIndex((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAnswers.field_name || !formAnswers.field_email) {
      alert('Por favor completa nombre y correo');
      return;
    }

    const result = submitPublicForm(currentForm.id, formAnswers, {
      source: 'Embudo VSL Interactivo',
      medium: 'public_funnel_view',
      campaign: activeFunnel?.slug || 'embudo',
    });

    setQualificationResult({
      submitted: true,
      isQualified: result.isQualified,
      score: result.score,
      contactId: result.contactId,
    });

    if (result.isQualified) {
      showToast(`¡Calificado con ${result.score} pts! Avanzando al calendario`);
      setTimeout(() => setCurrentStepIndex(3), 600);
    }
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const date = new Date();
    date.setDate(date.getDate() + selectedDayOffset);
    const [hours, minutes] = selectedTimeSlot.split(':');
    date.setHours(Number(hours), Number(minutes), 0, 0);

    bookPublicAppointment({
      contactId: qualificationResult.contactId,
      contactName: formAnswers.field_name || 'Prospecto Calificado',
      contactEmail: formAnswers.field_email || 'prospecto@ejemplo.com',
      contactPhone: formAnswers.field_phone || '',
      startsAt: date.toISOString(),
      notes: bookingNotes,
    });

    showToast('¡Cita confirmada! Redirigiendo a página de gracias...');
    setCurrentStepIndex(4);
  };

  // Safe page retrieval matching current step by type or position
  const stepPageTypes = ['landing', 'vsl', 'qualification', 'calendar', 'thank_you'];
  const targetType = stepPageTypes[currentStepIndex];
  const activePage =
    activeFunnel?.pages?.find((p) => p.page_type === targetType) ||
    activeFunnel?.pages?.find((p) => p.position === currentStepIndex + 1) ||
    activeFunnel?.pages?.[currentStepIndex] ||
    activeFunnel?.pages?.[0];

  const hasCustomSections = Boolean(
    activePage?.sections && activePage.sections.length > 0
  );

  const hasElementOfType = (t: string) =>
    Boolean(
      activePage?.sections?.some((sec) =>
        sec.rows?.some((row) =>
          row.columns?.some((col) =>
            col.elements?.some(
              (el) =>
                el.type === t ||
                (el.type === 'inner_columns' &&
                  el.nestedRow?.columns?.some((nc) =>
                    nc.elements?.some((nel) => nel.type === t)
                  ))
            )
          )
        )
      )
    );

  // Check if form or calendar widgets are already present inside page sections
  const hasFormWidget = hasElementOfType('form');
  const hasCalendarWidget = hasElementOfType('calendar');

  // Render Interactive Form Widget
  const renderQualificationForm = () => (
    <div className="max-w-xl mx-auto space-y-5 py-4 animate-in fade-in">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-50 text-[#2848F0]">
          Paso 3 • Filtro de Calificación
        </span>
        <h3 className="text-2xl font-bold font-['Poppins'] text-[#121111] mt-2">
          Cuestionario de Calificación Estratégica
        </h3>
        <p className="text-xs text-[#5B5B66] font-['Inter'] mt-1">
          Responde con sinceridad. El sistema por reglas calculará si cumples los requisitos mínimos para la sesión.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-['Inter']">
        <div>
          <label className="font-semibold text-zinc-700 block mb-1">Nombre Completo:</label>
          <input
            type="text"
            required
            placeholder="Tu nombre y apellido"
            value={formAnswers.field_name}
            onChange={(e) => setFormAnswers({ ...formAnswers, field_name: e.target.value })}
            className="w-full p-2.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-zinc-700 block mb-1">Correo Corporativo:</label>
            <input
              type="email"
              required
              placeholder="tu@email.com"
              value={formAnswers.field_email}
              onChange={(e) => setFormAnswers({ ...formAnswers, field_email: e.target.value })}
              className="w-full p-2.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
            />
          </div>
          <div>
            <label className="font-semibold text-zinc-700 block mb-1">WhatsApp / Teléfono:</label>
            <input
              type="text"
              required
              placeholder="+52 55 ..."
              value={formAnswers.field_phone}
              onChange={(e) => setFormAnswers({ ...formAnswers, field_phone: e.target.value })}
              className="w-full p-2.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-zinc-700 block mb-1">
            ¿Cuál es tu facturación mensual promedio actual? (+puntos de calificación)
          </label>
          <select
            required
            value={formAnswers.field_revenue}
            onChange={(e) => setFormAnswers({ ...formAnswers, field_revenue: e.target.value })}
            className="w-full p-2.5 text-xs border border-zinc-200 rounded-lg bg-white"
          >
            <option value="">Selecciona tu rango...</option>
            <option value="Menos de $1,000 USD al mes">Menos de $1,000 USD al mes (+0 pts)</option>
            <option value="Entre $1,000 y $3,000 USD al mes">Entre $1,000 y $3,000 USD al mes (+20 pts)</option>
            <option value="Entre $3,000 y $10,000 USD al mes">Entre $3,000 y $10,000 USD al mes (+40 pts)</option>
            <option value="Más de $10,000 USD al mes">Más de $10,000 USD al mes (+60 pts - Califica directo)</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-zinc-700 block mb-1">
            ¿En cuánto tiempo necesitas implementar este sistema de ventas?
          </label>
          <select
            required
            value={formAnswers.field_urgency}
            onChange={(e) => setFormAnswers({ ...formAnswers, field_urgency: e.target.value })}
            className="w-full p-2.5 text-xs border border-zinc-200 rounded-lg bg-white"
          >
            <option value="">Selecciona tu urgencia...</option>
            <option value="De inmediato (en los próximos 7 días)">De inmediato (en los próximos 7 días) (+30 pts)</option>
            <option value="Este mes">Este mes (+20 pts)</option>
            <option value="Solo estoy investigando opciones">Solo estoy investigando opciones (+0 pts)</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-zinc-700 block mb-1">
            ¿Cuentas con capacidad de inversión?
          </label>
          <select
            required
            value={formAnswers.field_commitment}
            onChange={(e) => setFormAnswers({ ...formAnswers, field_commitment: e.target.value })}
            className="w-full p-2.5 text-xs border border-zinc-200 rounded-lg bg-white"
          >
            <option value="">Selecciona una opción...</option>
            <option value="Sí, tengo capital listo para invertir en mentoría/solución">Sí, tengo capital listo (+30 pts)</option>
            <option value="Depende del retorno de inversión y propuesta">Depende de la propuesta (+15 pts)</option>
            <option value="No dispongo de presupuesto ahora mismo">No dispongo de presupuesto (+0 pts)</option>
          </select>
        </div>

        {/* Submit button */}
        <div className="pt-3">
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl text-xs font-bold font-['Poppins'] text-white bg-[#2848F0] hover:bg-[#1f38bf] shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Evaluar Mi Calificación y Continuar</span>
          </button>
        </div>
      </form>

      {/* If submitted and not qualified message */}
      {qualificationResult.submitted && !qualificationResult.isQualified && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Puntaje obtenido: {qualificationResult.score} pts (Mínimo requerido: {currentForm?.pass_score || 50})</span>
          </div>
          <p>{currentForm?.redirect_on_fail_message || 'Gracias por tu interés. Por el momento no cumples los requisitos.'}</p>
        </div>
      )}
    </div>
  );

  // Render Interactive Calendar Booking Widget
  const renderCalendarBooking = () => (
    <div className="max-w-xl mx-auto space-y-6 py-4 animate-in fade-in">
      <div className="text-center">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
          ✓ Calificación Aprobada
        </span>
        <h3 className="text-2xl font-bold font-['Poppins'] text-[#121111] mt-2">
          Elige el Día y Hora de tu Sesión 1 a 1
        </h3>
        <p className="text-xs text-[#5B5B66] font-['Inter'] mt-1">
          Duración de {appointmentType?.duration_minutes || 30} minutos vía Zoom.
        </p>
      </div>

      <form onSubmit={handleBookAppointment} className="space-y-5 text-xs font-['Inter']">
        {/* Select Day */}
        <div>
          <label className="font-semibold text-zinc-700 block mb-2">Selecciona un día:</label>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((offset) => {
              const d = new Date();
              d.setDate(d.getDate() + offset);
              const isSelected = selectedDayOffset === offset;

              return (
                <button
                  type="button"
                  key={offset}
                  onClick={() => setSelectedDayOffset(offset)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#2848F0] bg-blue-50/50 text-[#2848F0] ring-1 ring-[#2848F0]'
                      : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold text-zinc-400">
                    {d.toLocaleDateString('es-ES', { weekday: 'short' })}
                  </div>
                  <div className="text-sm font-bold mt-0.5">
                    {d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Select Time Slot */}
        <div>
          <label className="font-semibold text-zinc-700 block mb-2">Selecciona un horario disponible:</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {availableHours.map((hour) => {
              const isSelected = selectedTimeSlot === hour;
              return (
                <button
                  type="button"
                  key={hour}
                  onClick={() => setSelectedTimeSlot(hour)}
                  className={`py-2 px-2.5 rounded-lg border text-center font-mono text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2848F0] text-white border-[#2848F0] font-bold shadow-xs'
                      : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                  }`}
                >
                  {hour}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="font-semibold text-zinc-700 block mb-1">
            ¿Alguna meta o detalle específico para la llamada? (Opcional):
          </label>
          <textarea
            rows={2}
            placeholder="Coméntanos brevemente..."
            value={bookingNotes}
            onChange={(e) => setBookingNotes(e.target.value)}
            className="w-full p-2.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 rounded-xl text-xs font-bold font-['Poppins'] text-white bg-[#2848F0] hover:bg-[#1f38bf] shadow-md transition-all cursor-pointer"
        >
          Confirmar Mi Cita en el Calendario
        </button>
      </form>
    </div>
  );

  // Render Thank You Confirmation Card
  const renderThankYouConfirmation = () => (
    <div className="max-w-xl mx-auto text-center space-y-6 py-6 animate-in fade-in">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-extrabold font-['Poppins'] text-zinc-900">
        ¡Tu Cita Ha Sido Agendada con Éxito!
      </h2>

      <p className="text-xs text-[#5B5B66] font-['Inter'] leading-relaxed">
        Hemos registrado tu sesión en el calendario nativo y se ha creado tu registro en el CRM de Scale Sales Pro. Hemos enviado un correo electrónico de confirmación con los datos de acceso.
      </p>

      <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-left text-xs font-['Inter'] space-y-2">
        <div className="font-bold text-zinc-900 font-['Poppins']">Recomendaciones Previas:</div>
        <ul className="space-y-1.5 text-zinc-600 list-disc list-inside">
          <li>Asiste desde una computadora en un espacio tranquilo.</li>
          <li>Tolerancia máxima de 5 minutos antes de marcar no asistencia.</li>
          <li>Ten a mano tus objetivos y cifras de ventas actuales.</li>
        </ul>
      </div>

      <button
        onClick={onClose}
        className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#1C1C1C] hover:bg-black transition-colors cursor-pointer"
      >
        Cerrar Prueba del Embudo
      </button>
    </div>
  );

  // Render Single Element
  const renderElement = (element: PageBlockElement, eIdx: number, governingMaxW?: number) => {
    switch (element.type) {
      case 'heading': {
        const lvl = element.content.level || 'h1';
        const HeadingTag =
          lvl === 'h1'
            ? 'h1'
            : lvl === 'h3'
            ? 'h3'
            : lvl === 'h4'
            ? 'h4'
            : lvl === 'h5'
            ? 'h5'
            : 'h2';
        const defaultSize =
          lvl === 'h1'
            ? activePage?.settings?.defaultH1Size || 36
            : lvl === 'h3'
            ? activePage?.settings?.defaultH3Size || 22
            : lvl === 'h4'
            ? activePage?.settings?.defaultH4Size || 18
            : lvl === 'h5'
            ? 16
            : activePage?.settings?.defaultH2Size || 28;
        return (
          <HeadingTag
            key={element.id || eIdx}
            style={{
              fontSize: `${element.styles?.fontSize || defaultSize}px`,
              fontFamily: element.styles?.fontFamily || activePage?.settings?.headingFontFamily || 'Poppins',
              color: element.styles?.textColor || activePage?.settings?.textColor || '#121111',
              fontWeight: element.styles?.isBold ? 700 : 500,
              fontStyle: element.styles?.isItalic ? 'italic' : 'normal',
              textDecoration: element.styles?.isUnderline ? 'underline' : 'none',
              textTransform: element.styles?.textTransform || 'none',
              textAlign: element.styles?.textAlign || 'center',
              lineHeight: element.styles?.lineHeight || 1.3,
              marginTop: `${element.styles?.marginTop || 0}px`,
              marginBottom: `${element.styles?.marginBottom ?? 16}px`,
              marginLeft: `${element.styles?.marginLeft || 0}px`,
              marginRight: `${element.styles?.marginRight || 0}px`,
              paddingTop: `${element.styles?.paddingTop || 0}px`,
              paddingBottom: `${element.styles?.paddingBottom || 0}px`,
              paddingLeft: `${element.styles?.paddingLeft || 0}px`,
              paddingRight: `${element.styles?.paddingRight || 0}px`,
            }}
            dangerouslySetInnerHTML={{ __html: element.content.html || element.content.text || 'Titular de la Página' }}
          />
        );
      }

      case 'subheading':
        return (
          <p
            key={element.id || eIdx}
            style={{
              fontSize: `${element.styles?.fontSize || 18}px`,
              fontFamily: element.styles?.fontFamily || activePage?.settings?.bodyFontFamily || 'Inter',
              color: element.styles?.textColor || activePage?.settings?.textColor || '#5B5B66',
              fontWeight: element.styles?.isBold ? 600 : 400,
              fontStyle: element.styles?.isItalic ? 'italic' : 'normal',
              textDecoration: element.styles?.isUnderline ? 'underline' : 'none',
              textTransform: element.styles?.textTransform || 'none',
              textAlign: element.styles?.textAlign || 'center',
              marginTop: `${element.styles?.marginTop || 0}px`,
              marginBottom: `${element.styles?.marginBottom ?? 14}px`,
            }}
            dangerouslySetInnerHTML={{ __html: element.content.html || element.content.text || 'Subtítulo descriptivo' }}
          />
        );

      case 'paragraph':
        return (
          <p
            key={element.id || eIdx}
            style={{
              fontSize: `${element.styles?.fontSize || 16}px`,
              fontFamily: element.styles?.fontFamily || activePage?.settings?.bodyFontFamily || 'Inter',
              color: element.styles?.textColor || activePage?.settings?.textColor || '#5B5B66',
              fontWeight: element.styles?.isBold ? 600 : 400,
              fontStyle: element.styles?.isItalic ? 'italic' : 'normal',
              textDecoration: element.styles?.isUnderline ? 'underline' : 'none',
              textTransform: element.styles?.textTransform || 'none',
              textAlign: element.styles?.textAlign || 'left',
              lineHeight: element.styles?.lineHeight || 1.6,
              whiteSpace: 'pre-wrap',
              marginTop: `${element.styles?.marginTop || 0}px`,
              marginBottom: `${element.styles?.marginBottom ?? 16}px`,
            }}
            dangerouslySetInnerHTML={{ __html: element.content.html || element.content.text || 'Texto de párrafo.' }}
          />
        );

      case 'rich_text':
        return (
          <div key={element.id || eIdx} className="w-full">
            <RichTextElement element={element} isEditable={false} />
          </div>
        );

      case 'spacer':
        return (
          <div
            key={element.id || eIdx}
            style={{ height: `${element.content.spacerHeight || 32}px` }}
            className="w-full"
          />
        );

      case 'audio':
        return (
          <div key={element.id || eIdx} className="w-full">
            <AudioPlayerElement element={element} isEditable={false} />
          </div>
        );

      case 'icon':
        return (
          <div key={element.id || eIdx} className="w-full">
            <IconElement element={element} isEditable={false} />
          </div>
        );

      case 'simple_form':
        return (
          <div key={element.id || eIdx} className="w-full">
            <SimpleFormElement
              element={element}
              isEditable={false}
              onSubmitSuccess={() => {
                showToast && showToast('¡Formulario enviado con éxito!');
              }}
            />
          </div>
        );

      case 'popup_button':
        return (
          <div key={element.id || eIdx} className="w-full">
            <PopupButtonElement
              element={element}
              isEditable={false}
              defaultPrimaryColor={activePage?.settings?.primaryColor || '#2848F0'}
              defaultFontFamily={activePage?.settings?.bodyFontFamily || 'Poppins'}
              popups={activeFunnel?.pages[currentStepIndex]?.popups}
            />
          </div>
        );

      case 'bullet_list':
        return (
          <ul
            key={element.id || eIdx}
            style={{
              marginTop: `${element.styles?.marginTop || 0}px`,
              marginBottom: `${element.styles?.marginBottom ?? 16}px`,
              marginLeft: `${element.styles?.marginLeft || 0}px`,
              marginRight: `${element.styles?.marginRight || 0}px`,
              paddingTop: `${element.styles?.paddingTop || 0}px`,
              paddingBottom: `${element.styles?.paddingBottom || 0}px`,
              paddingLeft: `${element.styles?.paddingLeft || 0}px`,
              paddingRight: `${element.styles?.paddingRight || 0}px`,
              textAlign: element.styles?.textAlign || 'left',
            }}
            className="space-y-2.5 list-none p-0 m-0"
          >
            {(element.content.items || ['Punto 1', 'Punto 2']).map((item, idx) => (
              <li
                key={idx}
                className={`flex items-start ${
                  element.styles?.textAlign === 'center'
                    ? 'justify-center'
                    : element.styles?.textAlign === 'right'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
                style={{
                  textAlign: element.styles?.textAlign || 'left',
                }}
              >
                <span
                  className="shrink-0 flex items-center justify-center select-none"
                  style={{
                    marginRight: `${element.styles?.bulletSpacing ?? 10}px`,
                    marginTop: `${Math.max(2, Math.round((element.styles?.fontSize || 15) * 0.18))}px`,
                  }}
                >
                  {renderBulletIcon(
                    element.styles?.bulletIcon || 'disc',
                    element.styles?.fontSize || 15,
                    element.styles?.bulletColor || element.styles?.textColor || activePage?.settings?.textColor || '#121111'
                  )}
                </span>
                <div
                  style={{
                    flex: element.styles?.textAlign === 'center' || element.styles?.textAlign === 'right' ? '0 1 auto' : '1 1 auto',
                    minWidth: 0,
                    textAlign: element.styles?.textAlign || 'left',
                    fontSize: `${element.styles?.fontSize || 15}px`,
                    fontFamily: element.styles?.fontFamily || activePage?.settings?.bodyFontFamily || 'Inter',
                    color: element.styles?.textColor || activePage?.settings?.textColor || '#121111',
                    fontWeight: element.styles?.isBold ? 700 : 400,
                    fontStyle: element.styles?.isItalic ? 'italic' : 'normal',
                    textDecoration: element.styles?.isUnderline ? 'underline' : 'none',
                    textTransform: (element.styles?.textTransform as any) || 'none',
                    lineHeight: element.styles?.lineHeight ? `${element.styles?.lineHeight}` : 1.5,
                  }}
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              </li>
            ))}
          </ul>
        );

      case 'button': {
        const isFullWidth = Boolean(element.styles?.fullWidth);
        const align = element.styles?.textAlign || 'center';
        const normalBg = element.styles?.bgColor || activePage?.settings?.primaryColor || '#2848F0';
        const normalText = element.styles?.textColor || '#FFFFFF';
        const bWidth = element.styles?.borderWidth ?? 0;
        const hasBorder = bWidth > 0;
        const normalBorder = element.styles?.borderColor || '#18181B';
        const hoverBg = element.styles?.hoverBgColor || normalBg;
        const hoverText = element.styles?.hoverTextColor || normalText;
        const hoverBorder = hasBorder ? (element.styles?.hoverBorderColor || normalBorder) : 'transparent';

        const padY = element.styles?.buttonPaddingY ?? 14;
        const padX = element.styles?.buttonPaddingX ?? 28;
        const fontSize = element.styles?.fontSize || 16;

        const iconName = element.content.buttonIcon || '';
        const IconComp = iconName
          ? ((LucideIcons as unknown as Record<string, React.ComponentType<{ style?: React.CSSProperties; className?: string }>>)[iconName] || null)
          : null;
        const iconPos = element.content.buttonIconPosition || 'before';
        const iconSpacing = element.content.buttonIconSpacing ?? 8;
        const iconSize = element.content.buttonIconSize ?? Math.max(14, Math.round(fontSize * 1.05));
        const displayBtnText = formatCtaDisplayText(
          element.content.buttonText || 'Continuar',
          element.styles?.textTransform
        );

        return (
          <div
            key={element.id || eIdx}
            style={{
              display: 'flex',
              justifyContent: isFullWidth
                ? 'center'
                : align === 'left'
                ? 'flex-start'
                : align === 'right'
                ? 'flex-end'
                : 'center',
              width: '100%',
              marginTop: `${element.styles?.marginTop ?? 0}px`,
              marginBottom: `${element.styles?.marginBottom ?? 16}px`,
              marginLeft: `${element.styles?.marginLeft ?? 0}px`,
              marginRight: `${element.styles?.marginRight ?? 0}px`,
              paddingTop: `${element.styles?.paddingTop ?? 0}px`,
              paddingBottom: `${element.styles?.paddingBottom ?? 0}px`,
              paddingLeft: `${element.styles?.paddingLeft ?? 0}px`,
              paddingRight: `${element.styles?.paddingRight ?? 0}px`,
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (element.styles?.buttonDestination === 'calendar') {
                  const calendarEl = document.getElementById('ssp-calendar-section');
                  if (calendarEl) calendarEl.scrollIntoView({ behavior: 'smooth' });
                  else setCurrentStepIndex(3);
                } else if (element.styles?.buttonDestination === 'url' && element.styles?.buttonUrl) {
                  const targetLink = document.createElement('a');
                  targetLink.href = element.styles.buttonUrl;
                  if (element.styles.buttonOpenNewTab) {
                    targetLink.target = '_blank';
                    targetLink.rel = 'noopener noreferrer';
                  } else {
                    targetLink.target = '_self';
                  }
                  targetLink.click();
                } else {
                  advanceToNextStep();
                }
              }}
              style={
                {
                  '--cta-bg': normalBg,
                  '--cta-hover-bg': hoverBg,
                  '--cta-text': normalText,
                  '--cta-hover-text': hoverText,
                  '--cta-border': hasBorder ? normalBorder : 'transparent',
                  '--cta-hover-border': hoverBorder,
                  width: isFullWidth ? '100%' : 'auto',
                  fontSize: `${fontSize}px`,
                  fontFamily: element.styles?.fontFamily || activePage?.settings?.bodyFontFamily || 'Poppins',
                  fontWeight: element.styles?.isBold ? 700 : 500,
                  fontStyle: element.styles?.isItalic ? 'italic' : 'normal',
                  textDecoration: element.styles?.isUnderline ? 'underline' : 'none',
                  textTransform: element.styles?.textTransform || 'none',
                  paddingTop: `${padY}px`,
                  paddingBottom: `${padY}px`,
                  paddingLeft: `${padX}px`,
                  paddingRight: `${padX}px`,
                  borderRadius: `${element.styles?.borderRadius ?? 0}px`,
                  borderWidth: `${bWidth}px`,
                  borderStyle: hasBorder ? (element.styles?.borderStyle || 'solid') : 'none',
                  gap: IconComp ? `${iconSpacing}px` : '0px',
                } as React.CSSProperties
              }
              className="[background-color:var(--cta-bg)] hover:[background-color:var(--cta-hover-bg)] [color:var(--cta-text)] hover:[color:var(--cta-hover-text)] [border-color:var(--cta-border)] hover:[border-color:var(--cta-hover-border)] shadow-sm transition-colors duration-200 inline-flex items-center justify-center cursor-pointer font-semibold"
            >
              {IconComp && iconPos === 'before' && (
                <IconComp
                  style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
                  className="shrink-0"
                />
              )}
              <span>{displayBtnText}</span>
              {IconComp && iconPos === 'after' && (
                <IconComp
                  style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
                  className="shrink-0"
                />
              )}
            </button>
          </div>
        );
      }

      case 'video':
        return (
          <div
            key={element.id || eIdx}
            style={{
              display: 'flex',
              justifyContent:
                element.styles?.textAlign === 'left'
                  ? 'flex-start'
                  : element.styles?.textAlign === 'right'
                  ? 'flex-end'
                  : 'center',
              marginTop: `${element.styles?.marginTop || 0}px`,
              marginBottom: `${element.styles?.marginBottom ?? 20}px`,
            }}
          >
            <EmbeddedVideoPlayer
              videoUrl={element.content.videoUrl}
              videoFileName={element.content.videoFileName}
              aspectRatio={element.styles?.aspectRatio || '16/9'}
              borderRadius={element.styles?.borderRadius ?? 0}
              maxWidth={element.styles?.maxWidth || '780px'}
              borderWidth={element.styles?.borderWidth}
              borderColor={element.styles?.borderColor}
              borderStyle={element.styles?.borderStyle}
              isEditable={false}
              videoSource={element.content.videoSource}
              videoAutoplay={element.content.videoAutoplay}
              videoMuted={element.content.videoMuted}
              videoLoop={element.content.videoLoop}
              videoCoverType={element.content.videoCoverType}
              videoCoverImage={element.content.videoCoverImage}
              videoCoverText={element.content.videoCoverText}
              videoCoverTextFont={element.content.videoCoverTextFont}
              videoCoverTextSize={element.content.videoCoverTextSize}
              videoCoverTextColor={element.content.videoCoverTextColor}
              videoCoverTextBg={element.content.videoCoverTextBg}
              videoCoverTextBold={element.content.videoCoverTextBold}
              videoCoverPlayIcon={element.content.videoCoverPlayIcon}
              videoCoverButtonShape={element.content.videoCoverButtonShape}
              videoCoverPlayColor={element.content.videoCoverPlayColor}
              videoCoverPlayBg={element.content.videoCoverPlayBg}
              videoCoverPlaySize={element.content.videoCoverPlaySize}
              videoCoverArrowType={element.content.videoCoverArrowType}
              videoCoverArrowColor={element.content.videoCoverArrowColor}
              videoCoverArrowSize={element.content.videoCoverArrowSize}
              videoCoverArrowRotation={element.content.videoCoverArrowRotation}
              videoCoverBgType={element.content.videoCoverBgType}
              videoCoverBgColor={element.content.videoCoverBgColor}
              videoCoverBgColor2={element.content.videoCoverBgColor2}
              videoCoverBgOpacity={element.content.videoCoverBgOpacity}
            />
          </div>
        );

      case 'image': {
        const linkUrl = element.styles?.linkUrl || element.content?.linkUrl;
        const linkOpenNewTab = element.styles?.linkOpenNewTab ?? element.content?.linkOpenNewTab ?? true;
        const imgNode = (
          <img
            src={element.content.src || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80'}
            alt={element.content.alt || ''}
            style={{
              width: element.styles?.imageWidth ? `${element.styles.imageWidth}px` : (element.styles?.maxWidth || '100%'),
              height: element.styles?.imageHeight ? `${element.styles.imageHeight}px` : 'auto',
              maxWidth: '100%',
              borderRadius: `${element.styles?.borderRadius ?? 0}px`,
              opacity: element.styles?.opacity ?? 1,
              objectFit: element.styles?.imageHeight ? 'cover' : undefined,
              border: element.styles?.borderWidth
                ? `${element.styles.borderWidth}px ${element.styles.borderStyle || 'solid'} ${
                    element.styles.borderColor || '#E4E4E7'
                  }`
                : undefined,
              boxShadow:
                element.styles?.shadow === 'sm'
                  ? '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                  : element.styles?.shadow === 'md'
                  ? '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  : element.styles?.shadow === 'lg'
                  ? '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  : element.styles?.shadow === 'xl'
                  ? '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                  : undefined,
            }}
            className="transition-all"
          />
        );

        return (
          <div
            key={element.id || eIdx}
            style={{
              display: 'flex',
              justifyContent:
                element.styles?.textAlign === 'left'
                  ? 'flex-start'
                  : element.styles?.textAlign === 'right'
                  ? 'flex-end'
                  : 'center',
              marginTop: `${element.styles?.marginTop || 0}px`,
              marginBottom: `${element.styles?.marginBottom ?? 16}px`,
            }}
          >
            {linkUrl ? (
              <a
                href={linkUrl}
                target={linkOpenNewTab ? '_blank' : '_self'}
                rel="noreferrer noopener"
                className="inline-block cursor-pointer hover:opacity-95 transition-opacity"
              >
                {imgNode}
              </a>
            ) : (
              imgNode
            )}
          </div>
        );
      }

      case 'divider':
        return (
          <hr
            key={element.id || eIdx}
            style={{
              borderColor: element.styles?.textColor || '#E4E4E7',
              marginTop: `${element.styles?.marginTop || 16}px`,
              marginBottom: `${element.styles?.marginBottom ?? 16}px`,
            }}
          />
        );

      case 'form':
        return <React.Fragment key={element.id || eIdx}>{renderQualificationForm()}</React.Fragment>;

      case 'calendar':
        return <React.Fragment key={element.id || eIdx}>{renderCalendarBooking()}</React.Fragment>;

      case 'countdown':
        return (
          <div
            key={element.id || eIdx}
            style={{
              textAlign: element.styles?.textAlign || 'center',
              marginTop: `${element.styles?.marginTop || 0}px`,
              marginBottom: `${element.styles?.marginBottom ?? 20}px`,
            }}
            className="w-full"
          >
            <CountdownTimerWidget
              endDate={element.content.countdownEndDate}
              daysLabel={element.content.countdownDaysLabel}
              hoursLabel={element.content.countdownHoursLabel}
              minutesLabel={element.content.countdownMinutesLabel}
              secondsLabel={element.content.countdownSecondsLabel}
              theme={element.content.countdownTheme || 'dark'}
            />
          </div>
        );

      case 'faq':
        return (
          <div
            key={element.id || eIdx}
            style={{
              marginTop: `${element.styles?.marginTop || 0}px`,
              marginBottom: `${element.styles?.marginBottom ?? 20}px`,
            }}
            className="w-full"
          >
            <FaqAccordionWidget items={element.content.faqItems} />
          </div>
        );

      case 'social_links':
        return (
          <div
            key={element.id || eIdx}
            style={{
              textAlign: element.styles?.textAlign || 'center',
              marginTop: `${element.styles?.marginTop || 0}px`,
              marginBottom: `${element.styles?.marginBottom ?? 20}px`,
            }}
            className="w-full"
          >
            <SocialLinksWidget
              links={element.content.socialLinks}
              size={element.content.socialSize || 'md'}
              styleType={element.content.socialStyle || 'colored'}
              colorMode={element.content.socialColorMode || 'default'}
              iconColor={element.content.socialIconColor || '#FFFFFF'}
              bgColor={element.content.socialBgColor || '#2848F0'}
              shape={element.content.socialShape || 'circle'}
            />
          </div>
        );

      case 'checkbox':
        return (
          <div
            key={element.id || eIdx}
            style={{
              textAlign: element.styles?.textAlign || 'left',
              marginTop: `${element.styles?.marginTop || 0}px`,
              marginBottom: `${element.styles?.marginBottom ?? 16}px`,
            }}
            className="w-full"
          >
            <CheckboxWidget
              label={element.content.checkboxLabel}
              checked={element.content.checkboxChecked}
              required={element.content.checkboxRequired}
            />
          </div>
        );

      case 'input_field':
        return (
          <div
            key={element.id || eIdx}
            style={{
              display: 'flex',
              justifyContent:
                element.styles?.textAlign === 'center'
                  ? 'center'
                  : element.styles?.textAlign === 'right'
                  ? 'flex-end'
                  : 'flex-start',
              marginTop: `${element.styles?.marginTop || 0}px`,
              marginBottom: `${element.styles?.marginBottom ?? 16}px`,
            }}
            className="w-full"
          >
            <InputFieldWidget
              label={element.content.fieldLabel}
              placeholder={element.content.fieldPlaceholder}
              type={element.content.fieldType || 'email'}
              required={element.content.fieldRequired}
            />
          </div>
        );

      case 'form_button':
        return (
          <div
            key={element.id || eIdx}
            style={{
              display: 'flex',
              justifyContent:
                element.styles?.textAlign === 'left'
                  ? 'flex-start'
                  : element.styles?.textAlign === 'right'
                  ? 'flex-end'
                  : 'center',
              marginTop: `${element.styles?.marginTop || 0}px`,
              marginBottom: `${element.styles?.marginBottom ?? 16}px`,
              width: '100%',
            }}
          >
            <button
              onClick={() => {
                showToast && showToast('¡Formulario enviado con éxito!');
                if (element.styles?.buttonDestination === 'calendar') {
                  const calendarEl = document.getElementById('ssp-calendar-section');
                  if (calendarEl) calendarEl.scrollIntoView({ behavior: 'smooth' });
                  else advanceToNextStep();
                } else if (element.styles?.buttonDestination === 'url' && element.styles?.buttonUrl) {
                  window.open(element.styles.buttonUrl, '_blank');
                } else {
                  advanceToNextStep();
                }
              }}
              style={{
                width: element.styles?.fullWidth !== false ? '100%' : 'auto',
                backgroundColor: element.styles?.bgColor || activePage?.settings?.primaryColor || '#2848F0',
                color: element.styles?.textColor || '#FFFFFF',
                fontSize: `${element.styles?.fontSize || 16}px`,
                fontFamily: element.styles?.fontFamily || activePage?.settings?.bodyFontFamily || 'Poppins',
                fontWeight: element.styles?.isBold ? 700 : 600,
                fontStyle: element.styles?.isItalic ? 'italic' : 'normal',
                textDecoration: element.styles?.isUnderline ? 'underline' : 'none',
                textTransform: element.styles?.textTransform || 'none',
                paddingTop: `${element.styles?.paddingTop || 14}px`,
                paddingBottom: `${element.styles?.paddingBottom || 14}px`,
                paddingLeft: `${element.styles?.paddingLeft || 28}px`,
                paddingRight: `${element.styles?.paddingRight || 28}px`,
                borderRadius: `${element.styles?.borderRadius ?? 8}px`,
                boxShadow: '0 4px 14px 0 rgba(40, 72, 240, 0.35)',
              }}
              className="hover:brightness-105 active:scale-[0.99] transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group shadow-md"
            >
              <div className="flex items-center justify-center gap-2">
                <span>{element.content.buttonText || 'Enviar Información'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
              {element.content.buttonSubtext && (
                <span className="text-[11px] opacity-85 font-normal tracking-wide">
                  {element.content.buttonSubtext}
                </span>
              )}
            </button>
          </div>
        );

      case 'inner_columns':
        if (element.nestedRow) {
          return (
            <div
              key={element.id || eIdx}
              style={{
                marginTop: `${element.styles?.marginTop || 0}px`,
                marginBottom: `${element.styles?.marginBottom ?? 16}px`,
              }}
              className="w-full"
            >
              {renderRowBlock(element.nestedRow, eIdx, governingMaxW)}
            </div>
          );
        }
        return null;

      default:
        return (
          <div key={element.id || eIdx} className="my-2 p-2 text-xs text-zinc-500">
            {element.content?.text}
          </div>
        );
    }
  };

  const renderRowBlock = (row: PageBlockRow, rIdx: number, governingMaxW?: number) => {
    const pageMaxW =
      governingMaxW ??
      (activePage?.settings?.pageWidthType === 'full'
        ? undefined
        : activePage?.settings?.pageContentMaxWidth || 1200);

    const effectiveRowMaxW =
      (row.widthType || 'boxed') === 'boxed' && row.maxWidth
        ? pageMaxW
          ? Math.min(row.maxWidth, pageMaxW)
          : row.maxWidth
        : pageMaxW;

    const rowStyle: React.CSSProperties = {
      maxWidth:
        (row.widthType || 'boxed') === 'boxed' && row.maxWidth && effectiveRowMaxW
          ? `${effectiveRowMaxW}px`
          : row.widthType === 'full'
          ? '100%'
          : undefined,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: row.marginTop !== undefined ? `${row.marginTop}px` : '0px',
      marginBottom: row.marginBottom !== undefined ? `${row.marginBottom}px` : '0px',
      paddingTop: row.paddingTop !== undefined ? `${row.paddingTop}px` : undefined,
      paddingBottom: row.paddingBottom !== undefined ? `${row.paddingBottom}px` : undefined,
      paddingLeft: row.paddingLeft !== undefined ? `${row.paddingLeft}px` : undefined,
      paddingRight: row.paddingRight !== undefined ? `${row.paddingRight}px` : undefined,
      backgroundColor: row.bgColor || undefined,
      borderRadius: `${row.borderRadius ?? 0}px`,
      borderWidth: row.borderWidth !== undefined ? `${row.borderWidth}px` : undefined,
      borderColor: row.borderColor || undefined,
      borderStyle: row.borderStyle || (row.borderWidth ? 'solid' : undefined),
    };

    return (
      <DelayedAppearance
        key={row.id || rIdx}
        delayMinutes={row.delayMinutes}
        delaySeconds={row.delaySeconds}
        active={true}
      >
        <div style={rowStyle} className="relative transition-all">
          <div className="flex flex-wrap -mx-3 items-stretch">
            {row.columns.map((column, cIdx) => {
              const colSurfaceStyle = getColumnSurfaceStyle(column, { isPreview: true });
              const colShadowClass = getColumnShadowClass(column.shadow);
              return (
                <div
                  key={column.id || cIdx}
                  style={{ width: `${column.widthPercentage}%` }}
                  className="px-3 flex flex-col"
                >
                  <div
                    style={colSurfaceStyle}
                    className={`w-full flex-1 transition-all ${colShadowClass}`}
                  >
                    {column.elements.map((element, eIdx) =>
                      renderElement(element, eIdx, effectiveRowMaxW)
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DelayedAppearance>
    );
  };

  // Render a Full Section with background, paddings, overlay & columns
  const renderSection = (section: PageBlockSection, secIdx: number) => {
    const effectiveBgType =
      section.bgType ||
      (section.bgGradient ? 'gradient' : section.bgImageUrl ? 'image' : 'solid');

    const pageCanvasMaxW =
      activePage?.settings?.pageWidthType === 'full'
        ? 1440
        : activePage?.settings?.pageContentMaxWidth || 1200;
    const sectionIsBoxed = isSectionBoxed(section);
    const sectionEffectiveMaxW = getSectionEffectiveMaxWidth(section, pageCanvasMaxW);
    const secBorderStyle = section.borderStyle || 'solid';
    const secBorderColor = section.borderColor || '#E4E4E7';

    const sectionStyle: React.CSSProperties = {
      width: '100%',
      maxWidth: sectionIsBoxed ? `${sectionEffectiveMaxW}px` : undefined,
      paddingTop: `${section.paddingTop ?? section.paddingY ?? 40}px`,
      paddingBottom: `${section.paddingBottom ?? section.paddingY ?? 40}px`,
      paddingLeft: `${section.paddingLeft ?? 24}px`,
      paddingRight: `${section.paddingRight ?? 24}px`,
      marginTop: `${section.marginTop ?? 0}px`,
      marginBottom: `${section.marginBottom ?? 0}px`,
      marginLeft: sectionIsBoxed
        ? section.marginLeft
          ? `${section.marginLeft}px`
          : 'auto'
        : `${section.marginLeft ?? 0}px`,
      marginRight: sectionIsBoxed
        ? section.marginRight
          ? `${section.marginRight}px`
          : 'auto'
        : `${section.marginRight ?? 0}px`,
      borderRadius: `${section.borderRadius ?? 0}px`,
      borderTop: section.borderTopWidth
        ? `${section.borderTopWidth}px ${secBorderStyle} ${secBorderColor}`
        : undefined,
      borderRight: section.borderRightWidth
        ? `${section.borderRightWidth}px ${secBorderStyle} ${secBorderColor}`
        : undefined,
      borderBottom: section.borderBottomWidth
        ? `${section.borderBottomWidth}px ${secBorderStyle} ${secBorderColor}`
        : undefined,
      borderLeft: section.borderLeftWidth
        ? `${section.borderLeftWidth}px ${secBorderStyle} ${secBorderColor}`
        : undefined,
      position: 'relative',
    };

    if (effectiveBgType === 'solid') {
      const hasCustomCanvasSurface = Boolean(
        (activePage?.settings?.pageBgImageUrl &&
          activePage.settings.pageBgImageUrl.trim() !== '') ||
          (activePage?.settings?.pageBgColor &&
            activePage.settings.pageBgColor.toUpperCase() !== '#FFFFFF')
      );
      const isUntouchedLegacyWhite =
        !section.bgCustom &&
        (!section.bgColor || section.bgColor.toUpperCase() === '#FFFFFF') &&
        !sectionIsBoxed &&
        hasCustomCanvasSurface;
      sectionStyle.backgroundColor =
        section.bgColor === 'transparent' || isUntouchedLegacyWhite
          ? 'transparent'
          : section.bgColor || '#FFFFFF';
    } else if (effectiveBgType === 'gradient') {
      sectionStyle.backgroundImage =
        section.bgGradient || 'linear-gradient(135deg, #18181B 0%, #09090B 100%)';
    } else if (effectiveBgType === 'image' && section.bgImageUrl) {
      sectionStyle.backgroundImage = `url("${section.bgImageUrl}")`;
      sectionStyle.backgroundSize = 'cover';
      sectionStyle.backgroundPosition = 'center';
      sectionStyle.backgroundRepeat = 'no-repeat';
    }

    return (
      <DelayedAppearance
        key={section.id || secIdx}
        delayMinutes={section.delayMinutes}
        delaySeconds={section.delaySeconds}
        active={true}
      >
        <div style={sectionStyle} className="relative overflow-hidden shrink-0 w-full">
          {/* Overlay for image background */}
          {effectiveBgType === 'image' && (section.bgOverlayType || 'dark') !== 'none' && (
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                borderRadius: 'inherit',
                backgroundColor:
                  (section.bgOverlayType || 'dark') === 'dark' ? '#000000' : '#FFFFFF',
                opacity: (section.bgOverlayOpacity ?? 60) / 100,
              }}
            />
          )}

          <div
            className="relative z-1 mx-auto"
            style={{
              maxWidth: sectionIsBoxed
                ? '100%'
                : activePage?.settings?.pageWidthType === 'full'
                ? '100%'
                : `${pageCanvasMaxW}px`,
              width: '100%',
            }}
          >
            {section.rows.map((row, rIdx) => renderRowBlock(row, rIdx, sectionEffectiveMaxW))}
          </div>
        </div>
      </DelayedAppearance>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden relative">
        {/* Modal Top Header with Stepper Progress */}
        <div className="p-3.5 border-b border-zinc-200 bg-zinc-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold font-['Poppins'] text-[#121111] whitespace-nowrap">
              {activeFunnel?.name || 'Embudo SSP'} (Paso {currentStepIndex + 1}/5):
            </span>
            <div className="flex items-center gap-1.5 text-xs font-['Inter']">
              {['1. Landing', '2. VSL', '3. Calificación', '4. Calendario', '5. Gracias'].map(
                (stepName, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStepIndex(i)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      currentStepIndex === i
                        ? 'bg-[#2848F0] text-white shadow-xs'
                        : i < currentStepIndex
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-zinc-200/70 text-zinc-500 hover:bg-zinc-200'
                    }`}
                  >
                    {stepName}
                  </button>
                )
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200 transition-colors cursor-pointer ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container rendering edited page sections */}
        <div className="flex-1 overflow-y-auto relative bg-[#F4F4F5]">
          <div
            className="min-h-full h-auto w-full shrink-0 relative flex flex-col mx-auto overflow-hidden"
            style={{
              maxWidth:
                activePage?.settings?.pageWidthType === 'full'
                  ? '100%'
                  : `${activePage?.settings?.pageContentMaxWidth || 1200}px`,
              borderRadius: `${activePage?.settings?.pageBorderRadius ?? 0}px`,
              backgroundColor: activePage?.settings?.pageBgColor || '#FFFFFF',
              fontFamily: activePage?.settings?.bodyFontFamily || 'Inter',
              color: activePage?.settings?.textColor || '#121111',
              paddingTop: `${activePage?.settings?.pagePaddingTop ?? 0}px`,
              paddingRight: `${activePage?.settings?.pagePaddingRight ?? 0}px`,
              paddingBottom: `${activePage?.settings?.pagePaddingBottom ?? 0}px`,
              paddingLeft: `${activePage?.settings?.pagePaddingLeft ?? 0}px`,
            }}
          >
            {activePage?.settings?.pageBgImageUrl &&
              activePage.settings.pageBgImageUrl.trim() !== '' && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: `${activePage?.settings?.pageBorderRadius ?? 0}px`,
                    backgroundImage: `url("${activePage.settings.pageBgImageUrl}")`,
                    backgroundSize:
                      activePage.settings.pageBgImageSize === 'stretch'
                        ? '100% 100%'
                        : activePage.settings.pageBgImageSize || 'cover',
                    backgroundPosition: activePage.settings.pageBgImagePosition || 'center',
                    backgroundRepeat: activePage.settings.pageBgImageRepeat || 'no-repeat',
                    backgroundAttachment:
                      activePage.settings.pageBgImageAttachment === 'fixed' ? 'fixed' : 'scroll',
                    opacity: (activePage.settings.pageBgImageOpacity ?? 100) / 100,
                  }}
                />
              )}
            {hasCustomSections ? (
              <div className="w-full relative flex flex-col shrink-0">
              {activePage?.sections.map((section, secIdx) => renderSection(section, secIdx))}

              {/* If on step 2 (Qualification) and no explicit form element was in sections, append interactive form */}
              {currentStepIndex === 2 && !hasFormWidget && (
                <div className="p-6 bg-zinc-50 border-t border-zinc-200">
                  {renderQualificationForm()}
                </div>
              )}

              {/* If on step 3 (Calendar) and no explicit calendar element was in sections, append interactive calendar */}
              {currentStepIndex === 3 && !hasCalendarWidget && (
                <div className="p-6 bg-zinc-50 border-t border-zinc-200">
                  {renderCalendarBooking()}
                </div>
              )}

              {/* If on step 4 (Thank you), show summary */}
              {currentStepIndex === 4 && (
                <div className="p-6 bg-zinc-50 border-t border-zinc-200">
                  {renderThankYouConfirmation()}
                </div>
              )}
            </div>
          ) : (
            /* Fallback when no custom sections are configured */
            <div className="p-6 md:p-8">
              {currentStepIndex === 0 && (
                <div className="max-w-xl mx-auto text-center space-y-6 py-4 animate-in fade-in">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-50 text-[#2848F0]">
                    Masterclass Gratuita de Alto Valor
                  </span>
                  <h1 className="text-3xl font-extrabold font-['Poppins'] text-[#121111] leading-tight">
                    Cómo Convertir Tráfico en Citas Agendadas Calificadas Cada Semana
                  </h1>
                  <p className="text-sm text-[#5B5B66] font-['Inter'] leading-relaxed">
                    Descubre el sistema comercial integrado que elimina las herramientas dispersas y te permite capturar prospectos calificados en piloto automático.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setCurrentStepIndex(1)}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold font-['Poppins'] text-white bg-[#2848F0] hover:bg-[#1f38bf] shadow-lg transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                    >
                      <span>Ver Clase Magistral (VSL)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {currentStepIndex === 1 && (
                <div className="max-w-2xl mx-auto text-center space-y-6 py-2 animate-in fade-in">
                  <h2 className="text-2xl font-bold font-['Poppins'] text-[#121111]">
                    Mira Esta Presentación de 12 Minutos
                  </h2>
                  <div className="aspect-video bg-zinc-950 rounded-2xl overflow-hidden shadow-xl flex items-center justify-center relative border border-zinc-800 group">
                    <div className="text-center text-white p-6 space-y-2">
                      <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center mx-auto shadow-xl group-hover:scale-105 transition-transform">
                        <Play className="w-7 h-7 text-white fill-white ml-1" />
                      </div>
                      <div className="font-bold text-sm font-['Poppins']">
                        Video Sales Letter (VSL) Integrado
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentStepIndex(2)}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold font-['Poppins'] text-white bg-[#1C1C1C] hover:bg-black shadow-md transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                  >
                    <span>Continuar al Cuestionario de Calificación</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {currentStepIndex === 2 && renderQualificationForm()}
              {currentStepIndex === 3 && renderCalendarBooking()}
              {currentStepIndex === 4 && renderThankYouConfirmation()}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
