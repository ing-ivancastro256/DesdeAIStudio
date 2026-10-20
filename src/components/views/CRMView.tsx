import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Contact, ContactStatus } from '../../types';
import {
  Users,
  Search,
  Plus,
  Lock,
  List,
  Columns as KanbanIcon,
  Phone,
  Mail,
  Calendar,
  Clock,
  Sparkles,
  FileText,
  Activity,
  X,
  ExternalLink,
} from 'lucide-react';

const CRM_STAGES: { id: ContactStatus; label: string; bg: string; text: string }[] = [
  { id: 'nuevo', label: 'Nuevo', bg: '#F0F0F2', text: '#3A3A44' },
  { id: 'contactado', label: 'Contactado', bg: '#EFE6FB', text: '#5B2BB0' },
  { id: 'calificado', label: 'Calificado', bg: '#E3E9FD', text: '#1C34B8' },
  { id: 'cita_agendada', label: 'Cita Agendada', bg: '#FFF1D6', text: '#8A5A00' },
  { id: 'no_asistio', label: 'No Asistió', bg: '#FFE9DA', text: '#9A3B00' },
  { id: 'ganado', label: 'Ganado', bg: '#DDF5E3', text: '#14692B' },
  { id: 'perdido', label: 'Perdido', bg: '#FCE4E4', text: '#A11D1D' },
];

export const CRMView: React.FC = () => {
  const {
    contacts,
    contactNotes,
    contactEvents,
    updateContactStatus,
    addContactNote,
    createManualContact,
    organization,
    planEntitlements,
    openUpgradeModal,
  } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>(
    planEntitlements.kanban_crm ? 'kanban' : 'list'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContactForm, setNewContactForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    status: 'nuevo' as ContactStatus,
  });

  const filteredContacts = contacts.filter(
    (c) =>
      c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStageMeta = (status: ContactStatus) => {
    return CRM_STAGES.find((s) => s.id === status) || CRM_STAGES[0];
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact || !newNoteText.trim()) return;
    addContactNote(selectedContact.id, newNoteText.trim());
    setNewNoteText('');
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactForm.full_name.trim() || !newContactForm.email.trim()) return;
    const ok = createManualContact(newContactForm);
    if (ok) {
      setShowAddContactModal(false);
      setNewContactForm({ full_name: '', email: '', phone: '', status: 'nuevo' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header: Controls & Switcher */}
      <div className="p-4 bg-white rounded-xl border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-lg border border-zinc-200">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Lista (Free/Basic)</span>
            </button>

            <button
              onClick={() => {
                if (!planEntitlements.kanban_crm) {
                  openUpgradeModal(
                    'Pipeline Kanban del CRM',
                    'El tablero Kanban visual para arrastrar y soltar prospectos entre etapas comerciales está disponible desde el Plan Basic.',
                    'Pasa a Basic para organizar tus oportunidades comerciales como un profesional.'
                  );
                } else {
                  setViewMode('kanban');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <KanbanIcon className="w-3.5 h-3.5" />
              <span>Pipeline Kanban</span>
              {organization.plan_code === 'FREE' && (
                <Lock className="w-3 h-3 text-amber-600 ml-0.5" />
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0] bg-zinc-50/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="text-xs text-zinc-500 font-['Inter']">
            {contacts.length} / {planEntitlements.contacts_limit} contactos
          </div>
          <button
            onClick={() => setShowAddContactModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#1C1C1C] hover:bg-black rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Contacto</span>
          </button>
        </div>
      </div>

      {/* CRM Main Content Area */}
      {viewMode === 'list' ? (
        /* LIST VIEW (Available on FREE & BASIC) */
        <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-['Inter']">
                  <th className="py-3 px-4">Contacto</th>
                  <th className="py-3 px-4">Teléfono / WhatsApp</th>
                  <th className="py-3 px-4">Etapa Comercial</th>
                  <th className="py-3 px-4">Puntaje Reglas</th>
                  <th className="py-3 px-4">Origen / Fuente</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-['Inter']">
                {filteredContacts.map((contact) => {
                  const stage = getStageMeta(contact.status);

                  return (
                    <tr
                      key={contact.id}
                      className="hover:bg-zinc-50/70 transition-colors cursor-pointer"
                      onClick={() => setSelectedContact(contact)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-zinc-900 font-['Poppins']">
                          {contact.full_name}
                        </div>
                        <div className="text-zinc-500 text-[11px]">{contact.email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-600">
                        {contact.phone || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={contact.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            updateContactStatus(contact.id, e.target.value as ContactStatus)
                          }
                          style={{ backgroundColor: stage.bg, color: stage.text }}
                          className="px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide border-0 focus:ring-1 focus:ring-zinc-400 cursor-pointer"
                        >
                          {CRM_STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold font-mono text-zinc-800">
                          {contact.score} pts
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-500 text-[11px]">
                        {contact.source}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContact(contact);
                          }}
                          className="text-[#2848F0] font-semibold hover:underline"
                        >
                          Ver Ficha
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN VIEW (BASIC PLAN) */
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1300px]">
            {CRM_STAGES.map((stage) => {
              const stageContacts = filteredContacts.filter((c) => c.status === stage.id);

              return (
                <div
                  key={stage.id}
                  className="w-72 bg-zinc-100/70 rounded-xl p-3 flex flex-col max-h-[700px] border border-zinc-200/80"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <span
                        style={{ backgroundColor: stage.bg, color: stage.text }}
                        className="px-2.5 py-0.5 rounded-md text-xs font-bold font-['Poppins']"
                      >
                        {stage.label}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-zinc-500 font-mono">
                      {stageContacts.length}
                    </span>
                  </div>

                  {/* Cards inside Column */}
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                    {stageContacts.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className="p-3 bg-white rounded-lg border border-zinc-200 hover:border-[#2848F0] shadow-2xs hover:shadow-sm transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="text-xs font-bold text-zinc-900 font-['Poppins'] group-hover:text-[#2848F0]">
                            {contact.full_name}
                          </h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-[#2848F0] font-bold">
                            {contact.score} pts
                          </span>
                        </div>

                        <div className="text-[11px] text-zinc-500 truncate mb-2 font-['Inter']">
                          {contact.email}
                        </div>

                        {contact.phone && (
                          <div className="text-[11px] text-zinc-600 flex items-center gap-1.5 mb-2 font-['Inter']">
                            <Phone className="w-3 h-3 text-zinc-400" />
                            <span>{contact.phone}</span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400">
                          <span className="truncate max-w-[120px]">{contact.source}</span>
                          <span className="text-[#2848F0] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            Abrir →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Contact Profile & Notes & Events Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
                  Ficha Comercial: {selectedContact.full_name}
                </h3>
                <div className="text-xs text-zinc-500 font-['Inter'] flex items-center gap-3 mt-1">
                  <span>{selectedContact.email}</span>
                  <span>•</span>
                  <span>{selectedContact.phone || 'Sin teléfono'}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedContact(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Stage & Score Quick Change */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Etapa Actual en Pipeline:
                  </label>
                  <select
                    value={selectedContact.status}
                    onChange={(e) => {
                      const next = e.target.value as ContactStatus;
                      updateContactStatus(selectedContact.id, next);
                      setSelectedContact({ ...selectedContact, status: next });
                    }}
                    className="w-full p-2 text-xs border border-zinc-200 rounded-lg bg-white font-semibold"
                  >
                    {CRM_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Calificación de Reglas:
                  </label>
                  <div className="p-2 text-xs font-mono font-bold bg-white rounded-lg border border-zinc-200 flex items-center justify-between">
                    <span>{selectedContact.score} Puntos</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-sans font-semibold">
                      {selectedContact.score >= 50 ? 'Calificado' : 'Lead Estándar'}
                    </span>
                  </div>
                </div>
              </div>

              {/* UTM parameters if available */}
              {selectedContact.utm && (
                <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs">
                  <div className="font-semibold text-blue-900 mb-1">Parámetros de Atribución (UTM):</div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-blue-800 font-mono">
                    <div>source: {selectedContact.utm.source || '—'}</div>
                    <div>medium: {selectedContact.utm.medium || '—'}</div>
                    <div>campaign: {selectedContact.utm.campaign || '—'}</div>
                  </div>
                </div>
              )}

              {/* Notes Section (Basic feature) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-['Poppins'] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-zinc-500" />
                    <span>Notas del Contacto</span>
                  </h4>
                  {organization.plan_code === 'FREE' && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-200 text-zinc-700 font-semibold">
                      Requiere Basic
                    </span>
                  )}
                </div>

                {organization.plan_code === 'FREE' ? (
                  <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-center">
                    <p className="text-xs text-[#5B5B66] font-['Inter'] mb-2">
                      El registro de notas y bitácora comercial está reservado para el Plan Basic.
                    </p>
                    <button
                      onClick={() =>
                        openUpgradeModal(
                          'Notas de Prospectos en CRM',
                          'Registra acuerdos, presupuestos y objeciones de cada llamada para no perder contexto.',
                          'Activa Basic con la oferta de $20 USD por 3 meses.'
                        )
                      }
                      className="text-xs font-bold text-[#2848F0] hover:underline"
                    >
                      Desbloquear Notas en Basic →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <form onSubmit={handleAddNote} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Escribe un apunte sobre esta llamada o seguimiento..."
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        className="flex-1 p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] rounded-lg cursor-pointer"
                      >
                        Añadir Nota
                      </button>
                    </form>

                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {contactNotes
                        .filter((n) => n.contact_id === selectedContact.id)
                        .map((note) => (
                          <div
                            key={note.id}
                            className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs"
                          >
                            <p className="text-zinc-800 leading-relaxed">{note.body}</p>
                            <div className="mt-1 text-[10px] text-zinc-400 flex items-center justify-between">
                              <span>Por: {note.author_name}</span>
                              <span>{new Date(note.created_at).toLocaleString('es-ES')}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* History & Event Log */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-['Poppins'] flex items-center gap-1.5 mb-2">
                  <Activity className="w-4 h-4 text-zinc-500" />
                  <span>Historial de Eventos del Lead</span>
                </h4>

                <div className="border border-zinc-200 rounded-xl divide-y divide-zinc-100 max-h-48 overflow-y-auto">
                  {contactEvents
                    .filter((e) => e.contact_id === selectedContact.id)
                    .map((evt) => (
                      <div key={evt.id} className="p-3 text-xs flex items-start gap-3">
                        <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-zinc-800">{evt.description}</div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">
                            {new Date(evt.created_at).toLocaleString('es-ES')}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Contact Creation Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-200">
            <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
              Agregar Contacto Manual al CRM
            </h3>

            <form onSubmit={handleCreateContact} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700">Nombre Completo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Laura Jiménez"
                  value={newContactForm.full_name}
                  onChange={(e) =>
                    setNewContactForm({ ...newContactForm, full_name: e.target.value })
                  }
                  className="w-full mt-1 p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700">Correo Electrónico:</label>
                <input
                  type="email"
                  required
                  placeholder="laura@empresa.com"
                  value={newContactForm.email}
                  onChange={(e) =>
                    setNewContactForm({ ...newContactForm, email: e.target.value })
                  }
                  className="w-full mt-1 p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700">Teléfono / WhatsApp:</label>
                <input
                  type="text"
                  placeholder="+52 55 ..."
                  value={newContactForm.phone}
                  onChange={(e) =>
                    setNewContactForm({ ...newContactForm, phone: e.target.value })
                  }
                  className="w-full mt-1 p-2 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700">Etapa Inicial:</label>
                <select
                  value={newContactForm.status}
                  onChange={(e) =>
                    setNewContactForm({
                      ...newContactForm,
                      status: e.target.value as ContactStatus,
                    })
                  }
                  className="w-full mt-1 p-2 text-xs border border-zinc-200 rounded-lg bg-white"
                >
                  {CRM_STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] rounded-lg cursor-pointer"
                >
                  Guardar Contacto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
