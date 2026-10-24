import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Organization,
  Profile,
  PlanCode,
  PlanEntitlements,
  VirtualCard,
  Funnel,
  FunnelPage,
  Form,
  Contact,
  ContactStatus,
  ContactNote,
  ContactEvent,
  AvailabilityRule,
  AppointmentType,
  Appointment,
  AppointmentStatus,
  EmailIntegration,
  CustomDomain,
} from '../types';
import { getAccessToken, createCalendarEvent } from '../services/googleCalendarService';
import {
  INITIAL_ORGANIZATION,
  INITIAL_PROFILE,
  INITIAL_CARD,
  INITIAL_FUNNEL,
  INITIAL_FORM,
  INITIAL_CONTACTS,
  INITIAL_NOTES,
  INITIAL_EVENTS,
  INITIAL_AVAILABILITY,
  INITIAL_APPOINTMENT_TYPE,
  INITIAL_APPOINTMENTS,
  INITIAL_INTEGRATIONS,
  PLAN_ENTITLEMENTS_MAP,
} from '../data/initialData';

interface UpgradeModalInfo {
  isOpen: boolean;
  featureTitle: string;
  featureDescription: string;
  limitMessage: string;
}

interface AppContextType {
  // Tenant & Organization
  organization: Organization;
  profile: Profile;
  planEntitlements: PlanEntitlements;
  isSuperAdminMode: boolean;
  toggleSuperAdminMode: () => void;
  updateOrganizationName: (name: string) => void;
  updateProfile: (profile: Partial<Profile>) => void;
  switchPlan: (plan: PlanCode) => void;

  // Referral capture (?ref=)
  referralCode: string | null;

  // Upgrade Modal
  upgradeModal: UpgradeModalInfo;
  openUpgradeModal: (featureTitle: string, featureDescription: string, limitMessage: string) => void;
  closeUpgradeModal: () => void;

  // Virtual Card
  virtualCard: VirtualCard;
  updateVirtualCard: (updated: Partial<VirtualCard>) => void;
  togglePublishCard: () => void;

  // Funnels
  funnels: Funnel[];
  activeFunnel: Funnel;
  setActiveFunnelId: (id: string) => void;
  createFunnel: (name: string) => boolean;
  deleteFunnel: (funnelId: string) => void;
  updateFunnelPage: (funnelId: string, pageId: string, updatedPage: Partial<FunnelPage>) => void;
  togglePublishFunnel: (funnelId: string) => void;

  // Forms & Qualification
  forms: Form[];
  submitPublicForm: (
    formId: string,
    answers: Record<string, any>,
    utm?: Record<string, string>
  ) => { isQualified: boolean; score: number; contactId: string };

  // Native Calendar & Appointments
  availability: AvailabilityRule[];
  appointmentType: AppointmentType;
  appointments: Appointment[];
  updateAvailability: (rules: AvailabilityRule[]) => void;
  bookPublicAppointment: (params: {
    contactId?: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    startsAt: string;
    notes?: string;
  }) => Appointment;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;

  // CRM
  contacts: Contact[];
  contactNotes: ContactNote[];
  contactEvents: ContactEvent[];
  updateContactStatus: (contactId: string, status: ContactStatus) => void;
  addContactNote: (contactId: string, body: string) => void;
  createManualContact: (contact: Partial<Contact>) => boolean;

  // Integrations
  integrations: EmailIntegration[];
  toggleIntegration: (provider: string, listName: string) => void;

  // Custom Domains
  customDomains: CustomDomain[];
  addCustomDomain: (domain: string) => boolean;

  // Hotmart Webhook Simulation
  simulateHotmartPurchase: (promoApplied?: boolean) => void;
  simulateHotmartCancel: () => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Capture ?ref= from URL
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        setReferralCode(ref);
        localStorage.setItem('ssp_ref_code', ref);
      } else {
        const cached = localStorage.getItem('ssp_ref_code');
        if (cached) setReferralCode(cached);
      }
    } catch {
      // safe fallback
    }
  }, []);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  // Organization & Profile
  const [organization, setOrganization] = useState<Organization>(() => {
    const saved = localStorage.getItem('ssp_org');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    const initial = { ...INITIAL_ORGANIZATION };
    const cachedRef = localStorage.getItem('ssp_ref_code');
    if (cachedRef) {
      initial.referred_by_affiliate_id = cachedRef;
      initial.referred_at = new Date().toISOString();
    }
    return initial;
  });

  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('ssp_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_PROFILE;
  });

  const [isSuperAdminMode, setIsSuperAdminMode] = useState<boolean>(false);

  // Upgrade Modal
  const [upgradeModal, setUpgradeModal] = useState<UpgradeModalInfo>({
    isOpen: false,
    featureTitle: '',
    featureDescription: '',
    limitMessage: '',
  });

  const openUpgradeModal = (featureTitle: string, featureDescription: string, limitMessage: string) => {
    setUpgradeModal({
      isOpen: true,
      featureTitle,
      featureDescription,
      limitMessage,
    });
  };

  const closeUpgradeModal = () => {
    setUpgradeModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Virtual Card
  const [virtualCard, setVirtualCard] = useState<VirtualCard>(() => {
    const saved = localStorage.getItem('ssp_card');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_CARD;
  });

  // Funnels
  const [funnels, setFunnels] = useState<Funnel[]>(() => {
    const saved = localStorage.getItem('ssp_funnels');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize so all pages have funnel_id properly bound to their enclosing funnel
          return parsed.map((f: Funnel) => ({
            ...f,
            pages: (f.pages || []).map((p) => ({
              ...p,
              funnel_id: f.id,
              settings: {
                ...p.settings,
                pageWidthType: p.settings?.pageWidthType || 'boxed',
                pageContentMaxWidth: p.settings?.pageContentMaxWidth || 1200,
                pageBorderRadius:
                  p.settings?.pageBorderRadius === undefined || p.settings?.pageBorderRadius === 16
                    ? 0
                    : p.settings.pageBorderRadius,
                pagePaddingTop: p.settings?.pagePaddingTop ?? 0,
                pagePaddingBottom:
                  p.settings?.pagePaddingBottom === undefined || p.settings?.pagePaddingBottom === 40
                    ? 0
                    : p.settings.pagePaddingBottom,
              },
            })),
          }));
        }
      } catch {
        // fallback
      }
    }
    return [INITIAL_FUNNEL];
  });

  const [activeFunnelId, setActiveFunnelId] = useState<string>(funnels[0]?.id || 'funnel_demo_1');

  // Forms
  const [forms, setForms] = useState<Form[]>(() => {
    const saved = localStorage.getItem('ssp_forms');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [INITIAL_FORM];
  });

  // Contacts
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('ssp_contacts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_CONTACTS;
  });

  // Notes & Events
  const [contactNotes, setContactNotes] = useState<ContactNote[]>(() => {
    const saved = localStorage.getItem('ssp_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_NOTES;
  });

  const [contactEvents, setContactEvents] = useState<ContactEvent[]>(() => {
    const saved = localStorage.getItem('ssp_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_EVENTS;
  });

  // Calendar
  const [availability, setAvailability] = useState<AvailabilityRule[]>(() => {
    const saved = localStorage.getItem('ssp_availability');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_AVAILABILITY;
  });

  const [appointmentType] = useState<AppointmentType>(INITIAL_APPOINTMENT_TYPE);

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('ssp_appointments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_APPOINTMENTS;
  });

  // Integrations
  const [integrations, setIntegrations] = useState<EmailIntegration[]>(() => {
    const saved = localStorage.getItem('ssp_integrations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_INTEGRATIONS;
  });

  // Custom Domains
  const [customDomains, setCustomDomains] = useState<CustomDomain[]>([
    {
      id: 'cd_1',
      organization_id: 'org_ssp_demo',
      domain: 'valenzuelaconsulting.com',
      status: 'verified',
      verified_at: '2026-09-10T12:00:00Z',
    },
  ]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('ssp_org', JSON.stringify(organization));
  }, [organization]);

  useEffect(() => {
    localStorage.setItem('ssp_card', JSON.stringify(virtualCard));
  }, [virtualCard]);

  useEffect(() => {
    try {
      localStorage.setItem('ssp_funnels', JSON.stringify(funnels));
    } catch {
      // Ignore storage quota errors when large media data URLs are loaded in session
    }
  }, [funnels]);

  useEffect(() => {
    localStorage.setItem('ssp_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('ssp_notes', JSON.stringify(contactNotes));
  }, [contactNotes]);

  useEffect(() => {
    localStorage.setItem('ssp_events', JSON.stringify(contactEvents));
  }, [contactEvents]);

  useEffect(() => {
    localStorage.setItem('ssp_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('ssp_integrations', JSON.stringify(integrations));
  }, [integrations]);

  const planEntitlements = PLAN_ENTITLEMENTS_MAP[organization.plan_code] || PLAN_ENTITLEMENTS_MAP.FREE;

  const toggleSuperAdminMode = () => {
    setIsSuperAdminMode((prev) => !prev);
    showToast(!isSuperAdminMode ? 'Modo Super Administrador Activado' : 'Regresando a Vista de Organización');
  };

  const updateOrganizationName = (name: string) => {
    setOrganization((prev) => ({ ...prev, name }));
    showToast('Nombre de la organización actualizado');
  };

  const updateProfile = (updated: Partial<Profile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem('ssp_profile', JSON.stringify(next));
      return next;
    });
    showToast('Perfil actualizado');
  };

  const switchPlan = (plan: PlanCode) => {
    setOrganization((prev) => ({
      ...prev,
      plan_code: plan,
    }));
    showToast(`Plan actualizado con éxito a ${plan}`);
  };

  // Virtual Card Handlers
  const updateVirtualCard = (updated: Partial<VirtualCard>) => {
    setVirtualCard((prev) => ({ ...prev, ...updated }));
  };

  const togglePublishCard = () => {
    setVirtualCard((prev) => {
      const next = !prev.is_published;
      showToast(next ? 'Tarjeta virtual publicada' : 'Tarjeta despublicada (modo borrador)');
      return { ...prev, is_published: next };
    });
  };

  // Funnel Handlers
  const activeFunnel = funnels.find((f) => f.id === activeFunnelId) || funnels[0] || INITIAL_FUNNEL;

  const createFunnel = (name: string): boolean => {
    if (funnels.length >= planEntitlements.funnel_limit) {
      openUpgradeModal(
        'Límite de Embudos Alcanzado',
        'Has alcanzado el límite de embudos permitidos en tu plan actual.',
        `Tu plan ${organization.plan_code} permite un máximo de ${planEntitlements.funnel_limit} embudo(s). Pasa al Plan Basic para crear hasta 5 embudos de alta conversión.`
      );
      return false;
    }

    const newFunnelId = `funnel_${Date.now()}`;
    const newFunnel: Funnel = {
      id: newFunnelId,
      organization_id: organization.id,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      status: 'draft',
      created_at: new Date().toISOString(),
      pages: INITIAL_FUNNEL.pages.map((p, idx) => ({
        ...JSON.parse(JSON.stringify(p)),
        id: `page_${newFunnelId}_${idx + 1}`,
        funnel_id: newFunnelId,
      })),
    };

    setFunnels((prev) => {
      const updated = [...prev, newFunnel];
      try {
        localStorage.setItem('ssp_funnels', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to sync new funnel to localStorage', err);
      }
      return updated;
    });
    setActiveFunnelId(newFunnel.id);
    showToast(`Embudo "${name}" creado desde la plantilla base`);
    return true;
  };

  const updateFunnelPage = (funnelId: string, pageId: string, updatedPage: Partial<FunnelPage>) => {
    setFunnels((prev) => {
      // 1. Locate the target funnel
      let targetIndex = prev.findIndex((f) => f.id === funnelId);

      // If not found by explicit funnelId, try activeFunnelId
      if (targetIndex === -1 && activeFunnelId) {
        targetIndex = prev.findIndex((f) => f.id === activeFunnelId);
      }

      // If still not found, try finding the funnel that contains pageId
      if (targetIndex === -1) {
        targetIndex = prev.findIndex((f) => f.pages.some((p) => p.id === pageId));
      }

      // If still not found, fallback to first available funnel
      if (targetIndex === -1 && prev.length > 0) {
        targetIndex = 0;
      }

      if (targetIndex === -1) return prev;

      const nextFunnels = prev.map((funnel, fIdx) => {
        if (fIdx !== targetIndex) return funnel;

        const pageExists = funnel.pages.some((p) => p.id === pageId);
        let updatedPages: FunnelPage[];

        if (pageExists) {
          updatedPages = funnel.pages.map((p) => {
            if (p.id !== pageId) return p;
            return {
              ...p,
              ...updatedPage,
              funnel_id: funnel.id,
            };
          });
        } else {
          // If pageId was not found by exact string, find by page_type, position, or first page
          let matched = false;
          updatedPages = funnel.pages.map((p, pIdx) => {
            if (
              !matched &&
              ((updatedPage.page_type && p.page_type === updatedPage.page_type) ||
                (updatedPage.position && p.position === updatedPage.position) ||
                pIdx === 0)
            ) {
              matched = true;
              return {
                ...p,
                ...updatedPage,
                funnel_id: funnel.id,
              };
            }
            return p;
          });
        }

        return {
          ...funnel,
          pages: updatedPages,
        };
      });

      // Synchronously write to localStorage to guarantee instant persistence
      try {
        localStorage.setItem('ssp_funnels', JSON.stringify(nextFunnels));
      } catch (err) {
        console.error('Failed to sync funnels to localStorage', err);
      }

      return nextFunnels;
    });
  };

  const togglePublishFunnel = (funnelId: string) => {
    setFunnels((prev) => {
      const nextFunnels = prev.map((f) => {
        if (f.id !== funnelId) return f;
        const nextStatus: 'draft' | 'published' = f.status === 'published' ? 'draft' : 'published';
        showToast(
          nextStatus === 'published'
            ? `Embudo "${f.name}" publicado exitosamente`
            : `Embudo "${f.name}" guardado en borrador`
        );
        return {
          ...f,
          status: nextStatus,
          published_at: nextStatus === 'published' ? new Date().toISOString() : f.published_at,
        };
      });
      try {
        localStorage.setItem('ssp_funnels', JSON.stringify(nextFunnels));
      } catch (err) {
        console.error('Failed to sync funnels to localStorage', err);
      }
      return nextFunnels;
    });
  };

  const deleteFunnel = (funnelId: string) => {
    setFunnels((prev) => {
      const remaining = prev.filter((f) => f.id !== funnelId);
      if (activeFunnelId === funnelId || remaining.length === 0) {
        setActiveFunnelId(remaining.length > 0 ? remaining[0].id : '');
      }
      try {
        localStorage.setItem('ssp_funnels', JSON.stringify(remaining));
      } catch (err) {
        console.error('Failed to sync funnels to localStorage', err);
      }
      return remaining;
    });
    showToast('Embudo eliminado exitosamente');
  };

  // Forms and Qualification Logic
  const submitPublicForm = (
    formId: string,
    answers: Record<string, any>,
    utm?: Record<string, string>
  ) => {
    const form = forms.find((f) => f.id === formId) || INITIAL_FORM;
    let score = 0;

    // Calculate score from answers
    form.fields.forEach((field) => {
      const answerVal = answers[field.id];
      if (field.options && answerVal !== undefined) {
        const selectedOpt = field.options.find((opt) => opt.label === answerVal);
        if (selectedOpt) {
          score += selectedOpt.points;
        }
      }
    });

    const isQualified = score >= form.pass_score;
    const fullName = answers.field_name || answers.name || 'Prospecto Web';
    const email = answers.field_email || answers.email || 'lead@email.com';
    const phone = answers.field_phone || answers.phone || '';

    // Check contact limits
    if (contacts.length >= planEntitlements.contacts_limit) {
      console.warn('Contacts limit reached on plan');
    }

    const newContactId = `cnt_${Date.now()}`;
    const newContact: Contact = {
      id: newContactId,
      organization_id: organization.id,
      full_name: fullName,
      email,
      phone,
      status: isQualified ? 'calificado' : 'nuevo',
      source: 'Embudo de Ventas SSP',
      score,
      utm: utm ? { source: utm.source, medium: utm.medium, campaign: utm.campaign } : undefined,
      last_activity_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    setContacts((prev) => [newContact, ...prev]);

    // Add event
    const eventText = isQualified
      ? `Completó cuestionario con ${score} pts. ¡CALIFICADO para agendar!`
      : `Completó cuestionario con ${score} pts. No alcanzó el puntaje mínimo de ${form.pass_score}.`;

    const newEvent: ContactEvent = {
      id: `evt_${Date.now()}`,
      contact_id: newContactId,
      organization_id: organization.id,
      event_type: 'form_submitted',
      description: eventText,
      created_at: new Date().toISOString(),
    };
    setContactEvents((prev) => [newEvent, ...prev]);

    return { isQualified, score, contactId: newContactId };
  };

  // Availability & Native Appointments
  const updateAvailability = (rules: AvailabilityRule[]) => {
    setAvailability(rules);
    localStorage.setItem('ssp_availability', JSON.stringify(rules));
    showToast('Reglas de disponibilidad guardadas');
  };

  const bookPublicAppointment = ({
    contactId,
    contactName,
    contactEmail,
    contactPhone,
    startsAt,
    notes,
  }: {
    contactId?: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    startsAt: string;
    notes?: string;
  }): Appointment => {
    let resolvedContactId = contactId;
    if (!resolvedContactId) {
      // Find or create contact
      const existing = contacts.find((c) => c.email.toLowerCase() === contactEmail.toLowerCase());
      if (existing) {
        resolvedContactId = existing.id;
      } else {
        const newContact: Contact = {
          id: `cnt_${Date.now()}`,
          organization_id: organization.id,
          full_name: contactName,
          email: contactEmail,
          phone: contactPhone,
          status: 'cita_agendada',
          source: 'Calendario Directo SSP',
          score: 70,
          last_activity_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };
        setContacts((prev) => [newContact, ...prev]);
        resolvedContactId = newContact.id;
      }
    }

    const startDate = new Date(startsAt);
    const endDate = new Date(startDate.getTime() + appointmentType.duration_minutes * 60000);

    const newAppt: Appointment = {
      id: `app_${Date.now()}`,
      organization_id: organization.id,
      contact_id: resolvedContactId,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      appointment_type_id: appointmentType.id,
      appointment_type_name: appointmentType.name,
      starts_at: startDate.toISOString(),
      ends_at: endDate.toISOString(),
      status: 'agendada',
      notes,
      created_at: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppt, ...prev]);

    // Update contact status to 'cita_agendada'
    setContacts((prev) =>
      prev.map((c) => (c.id === resolvedContactId ? { ...c, status: 'cita_agendada' } : c))
    );

    // Event log
    const newEvent: ContactEvent = {
      id: `evt_${Date.now()}`,
      contact_id: resolvedContactId,
      organization_id: organization.id,
      event_type: 'appointment_booked',
      description: `Agendó cita nativa para el ${new Date(startsAt).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      created_at: new Date().toISOString(),
    };
    setContactEvents((prev) => [newEvent, ...prev]);

    // Background Google Calendar auto-sync if connected
    getAccessToken().then((token) => {
      if (token) {
        createCalendarEvent({
          summary: `Cita Embudo: ${contactName} (${appointmentType.name})`,
          description: `Cita reservada desde embudo Scale Sales Pro.\n\nCliente: ${contactName}\nEmail: ${contactEmail}\nTeléfono: ${contactPhone || 'No provisto'}\nNotas: ${notes || 'Ninguna'}`,
          startDateTime: startDate.toISOString(),
          endDateTime: endDate.toISOString(),
          attendees: contactEmail ? [contactEmail] : undefined,
        }).catch((err) => {
          console.warn('Auto-sync to Google Calendar failed silently:', err);
        });
      }
    });

    return newAppt;
  };

  const updateAppointmentStatus = (appointmentId: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id !== appointmentId) return a;
        return { ...a, status };
      })
    );

    // Sync contact status if appropriate
    const target = appointments.find((a) => a.id === appointmentId);
    if (target && target.contact_id) {
      if (status === 'no_asistio') {
        updateContactStatus(target.contact_id, 'no_asistio');
      } else if (status === 'completada') {
        updateContactStatus(target.contact_id, 'contactado');
      }
    }

    showToast(`Estado de cita actualizado a "${status}"`);
  };

  // CRM Handlers
  const updateContactStatus = (contactId: string, status: ContactStatus) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id !== contactId) return c;
        return { ...c, status, last_activity_at: new Date().toISOString() };
      })
    );

    const newEvent: ContactEvent = {
      id: `evt_${Date.now()}`,
      contact_id: contactId,
      organization_id: organization.id,
      event_type: 'status_changed',
      description: `Estado comercial actualizado a: ${status.toUpperCase().replace('_', ' ')}`,
      created_at: new Date().toISOString(),
    };
    setContactEvents((prev) => [newEvent, ...prev]);
    showToast(`Contacto movido a "${status.replace('_', ' ')}"`);
  };

  const addContactNote = (contactId: string, body: string) => {
    if (!planEntitlements.notes_history) {
      openUpgradeModal(
        'Historial de Notas del CRM',
        'El registro de notas e historial detallado es una funcionalidad del Plan Basic.',
        'Pasa al Plan Basic para documentar cada interacción y objeción de tus prospectos.'
      );
      return;
    }

    const newNote: ContactNote = {
      id: `note_${Date.now()}`,
      contact_id: contactId,
      organization_id: organization.id,
      author_id: profile.user_id,
      author_name: profile.full_name,
      body,
      created_at: new Date().toISOString(),
    };

    setContactNotes((prev) => [newNote, ...prev]);
    showToast('Nota registrada con éxito');
  };

  const createManualContact = (newContactData: Partial<Contact>): boolean => {
    if (contacts.length >= planEntitlements.contacts_limit) {
      openUpgradeModal(
        'Límite de Contactos Alcanzado',
        `Has llegado al límite de ${planEntitlements.contacts_limit} contactos en tu plan actual.`,
        'Pasa al Plan Basic para gestionar hasta 1,000 contactos en tu CRM.'
      );
      return false;
    }

    const contact: Contact = {
      id: `cnt_${Date.now()}`,
      organization_id: organization.id,
      full_name: newContactData.full_name || 'Nuevo Contacto',
      email: newContactData.email || '',
      phone: newContactData.phone || '',
      status: (newContactData.status as ContactStatus) || 'nuevo',
      source: 'Ingreso Manual CRM',
      score: 50,
      last_activity_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    setContacts((prev) => [contact, ...prev]);
    showToast(`Contacto ${contact.full_name} añadido`);
    return true;
  };

  // Integrations
  const toggleIntegration = (provider: string, listName: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.provider !== provider) return item;
        const willConnect = item.status !== 'connected';
        return {
          ...item,
          status: willConnect ? 'connected' : 'disconnected',
          list_name: willConnect ? listName || 'Lista Principal de Prospectos' : '',
          list_id: willConnect ? `list_${Date.now()}` : '',
          credentials_encrypted: willConnect ? '••••••••••••••••••••••••' : '',
          last_synced_at: willConnect ? new Date().toISOString() : undefined,
        };
      })
    );
    showToast(`Integración con ${provider.toUpperCase()} actualizada`);
  };

  // Custom Domains
  const addCustomDomain = (domain: string): boolean => {
    if (!planEntitlements.custom_domain_active || planEntitlements.custom_domains_limit === 0) {
      openUpgradeModal(
        'Dominio Propio',
        'La conexión de dominios personalizados (.com, .net, etc.) está disponible desde el Plan Basic.',
        'Pasa al Plan Basic para que tu tarjeta y embudos funcionen bajo tu propia marca comercial.'
      );
      return false;
    }

    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '');
    const newDomain: CustomDomain = {
      id: `cd_${Date.now()}`,
      organization_id: organization.id,
      domain: cleanDomain,
      status: 'verified',
      verified_at: new Date().toISOString(),
    };

    setCustomDomains((prev) => [...prev, newDomain]);
    showToast(`Dominio ${cleanDomain} configurado y verificado`);
    return true;
  };

  // Hotmart Webhook Simulation
  const simulateHotmartPurchase = (promoApplied = true) => {
    setOrganization((prev) => ({
      ...prev,
      plan_code: 'BASIC',
    }));
    closeUpgradeModal();
    showToast(
      promoApplied
        ? '🎉 Webhook de Hotmart: Oferta activada ($20 pago único por 3 meses). ¡Bienvenido a Plan Basic!'
        : '🎉 Webhook de Hotmart: Suscripción activada ($29/mes). ¡Bienvenido a Plan Basic!'
    );
  };

  const simulateHotmartCancel = () => {
    setOrganization((prev) => ({
      ...prev,
      plan_code: 'FREE',
    }));
    showToast('⚠️ Webhook de Hotmart: Suscripción cancelada. Tu cuenta ha vuelto al Plan Free.');
  };

  return (
    <AppContext.Provider
      value={{
        organization,
        profile,
        planEntitlements,
        isSuperAdminMode,
        toggleSuperAdminMode,
        updateOrganizationName,
        updateProfile,
        switchPlan,
        referralCode,
        upgradeModal,
        openUpgradeModal,
        closeUpgradeModal,
        virtualCard,
        updateVirtualCard,
        togglePublishCard,
        funnels,
        activeFunnel,
        setActiveFunnelId,
        createFunnel,
        deleteFunnel,
        updateFunnelPage,
        togglePublishFunnel,
        forms,
        submitPublicForm,
        availability,
        appointmentType,
        appointments,
        updateAvailability,
        bookPublicAppointment,
        updateAppointmentStatus,
        contacts,
        contactNotes,
        contactEvents,
        updateContactStatus,
        addContactNote,
        createManualContact,
        integrations,
        toggleIntegration,
        customDomains,
        addCustomDomain,
        simulateHotmartPurchase,
        simulateHotmartCancel,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
