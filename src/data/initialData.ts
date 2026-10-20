import {
  Plan,
  PlanEntitlements,
  Organization,
  Profile,
  VirtualCard,
  Funnel,
  Form,
  Contact,
  ContactNote,
  ContactEvent,
  AvailabilityRule,
  AppointmentType,
  Appointment,
  EmailIntegration,
} from '../types';

export const PLANS_DATA: Plan[] = [
  {
    code: 'FREE',
    name: 'Plan Free',
    price_monthly_cents: 0,
    price_yearly_cents: 0,
    is_public: true,
    description: 'Empieza a capturar leads y agendar tus primeras citas sin costo.',
  },
  {
    code: 'BASIC',
    name: 'Plan Basic',
    price_monthly_cents: 2900, // $29 / mes
    price_yearly_cents: 29000, // $290 / año
    is_public: true,
    description: 'El sistema comercial completo para escalar tu negocio de servicios.',
  },
  {
    code: 'PRO',
    name: 'Plan Pro',
    price_monthly_cents: 7900,
    price_yearly_cents: 79000,
    is_public: false, // Oculto explícitamente en el MVP 1.0
    description: 'Automatización y volumen para agencias y consultorías avanzadas.',
  },
];

export const PLAN_ENTITLEMENTS_MAP: Record<string, PlanEntitlements> = {
  FREE: {
    funnel_limit: 1,
    contacts_limit: 50,
    appointments_per_month_limit: 10,
    forms_limit: 1,
    pages_limit: 3,
    custom_domains_limit: 0,
    users_limit: 1,
    remove_branding: false,
    custom_domain_active: false,
    kanban_crm: false,
    notes_history: false,
    conditional_forms: false,
    utm_tracking: false,
  },
  BASIC: {
    funnel_limit: 5,
    contacts_limit: 1000,
    appointments_per_month_limit: 100,
    forms_limit: 5,
    pages_limit: 15,
    custom_domains_limit: 1,
    users_limit: 1,
    remove_branding: true,
    custom_domain_active: true,
    kanban_crm: true,
    notes_history: true,
    conditional_forms: true,
    utm_tracking: true,
  },
  PRO: {
    funnel_limit: 999999,
    contacts_limit: 25000,
    appointments_per_month_limit: 999999,
    forms_limit: 999999,
    pages_limit: 999999,
    custom_domains_limit: 5,
    users_limit: 5,
    remove_branding: true,
    custom_domain_active: true,
    kanban_crm: true,
    notes_history: true,
    conditional_forms: true,
    utm_tracking: true,
  },
};

export const INITIAL_PROFILE: Profile = {
  user_id: 'usr_demo_101',
  full_name: 'Alejandro Valenzuela',
  email: 'alejandro@valenzuelaconsulting.com',
  phone: '+52 55 1234 5678',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  is_platform_admin: false,
  created_at: '2026-09-01T10:00:00Z',
};

export const INITIAL_ORGANIZATION: Organization = {
  id: 'org_ssp_demo',
  name: 'Valenzuela Business Consulting',
  slug: 'valenzuela-consulting',
  plan_code: 'FREE',
  status: 'active',
  created_at: '2026-09-01T10:00:00Z',
};

export const INITIAL_CARD: VirtualCard = {
  id: 'card_demo_1',
  organization_id: 'org_ssp_demo',
  slug: 'alejandro-valenzuela',
  display_name: 'Alejandro Valenzuela',
  headline: 'Mentor de Negocios y Escalamiento B2B',
  bio: 'Ayudo a consultores, coaches y agencias a sistematizar su adquisición de clientes y duplicar su facturación mensual.',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  funnel_id: 'funnel_demo_1',
  funnel_button_text: '🚀 Ver Clase Magistral y Agendar Sesión de Diagnóstico',
  social_links: {
    instagram: 'https://instagram.com/alejandro.growth',
    linkedin: 'https://linkedin.com/in/alejandro-valenzuela-b2b',
    youtube: 'https://youtube.com/@alejandrovalenzuela',
    whatsapp: 'https://wa.me/525512345678',
  },
  theme_settings: {
    bg_color: '#FBFBFD',
    card_bg: '#FFFFFF',
    text_color: '#121111',
    accent_color: '#2848F0',
    button_style: 'rounded',
  },
  is_published: true,
  links: [
    {
      id: 'link_1',
      label: '🎙️ Episodio más reciente en Spotify Podcast',
      url: 'https://spotify.com',
      position: 1,
      is_active: true,
    },
    {
      id: 'link_2',
      label: '📥 Descargar Guía Gratuita: Las 7 Palancas del Alto Valor',
      url: 'https://valenzuelaconsulting.com/guia',
      position: 2,
      is_active: true,
    },
    {
      id: 'link_3',
      label: '💬 Chatear directamente por WhatsApp',
      url: 'https://wa.me/525512345678',
      position: 3,
      is_active: true,
    },
  ],
};

export const INITIAL_FORM: Form = {
  id: 'form_qualification_1',
  organization_id: 'org_ssp_demo',
  name: 'Cuestionario de Calificación Estratégica',
  form_type: 'qualification',
  pass_score: 50,
  redirect_on_fail_message: 'Actualmente no contamos con plazas para tu perfil de facturación, pero te compartimos nuestro material introductorio.',
  fields: [
    {
      id: 'field_name',
      label: 'Nombre completo',
      type: 'text',
      required: true,
    },
    {
      id: 'field_email',
      label: 'Correo electrónico corporativo',
      type: 'email',
      required: true,
    },
    {
      id: 'field_phone',
      label: 'Teléfono / WhatsApp',
      type: 'phone',
      required: true,
    },
    {
      id: 'field_revenue',
      label: '¿Cuál es tu facturación mensual promedio actual?',
      type: 'radio',
      required: true,
      options: [
        { label: 'Menos de $1,000 USD al mes', points: 0 },
        { label: 'Entre $1,000 y $3,000 USD al mes', points: 20 },
        { label: 'Entre $3,000 y $10,000 USD al mes', points: 40 },
        { label: 'Más de $10,000 USD al mes', points: 60 },
      ],
    },
    {
      id: 'field_urgency',
      label: '¿En cuánto tiempo necesitas implementar este sistema de ventas?',
      type: 'select',
      required: true,
      options: [
        { label: 'De inmediato (en los próximos 7 días)', points: 30 },
        { label: 'Este mes', points: 20 },
        { label: 'Solo estoy investigando opciones', points: 0 },
      ],
    },
    {
      id: 'field_commitment',
      label: '¿Cuentas con capacidad de inversión para acelerar tus resultados?',
      type: 'radio',
      required: true,
      options: [
        { label: 'Sí, tengo capital listo para invertir en mentoría/solución', points: 30 },
        { label: 'Depende del retorno de inversión y propuesta', points: 15 },
        { label: 'No dispongo de presupuesto ahora mismo', points: 0 },
      ],
    },
  ],
};

export const INITIAL_FUNNEL: Funnel = {
  id: 'funnel_demo_1',
  organization_id: 'org_ssp_demo',
  name: 'Embudo Principal de Captación High-Ticket',
  slug: 'sesion-estrategica-escala',
  status: 'published',
  published_at: '2026-09-05T12:00:00Z',
  created_at: '2026-09-02T11:00:00Z',
  pages: [
    {
      id: 'page_landing_1',
      funnel_id: 'funnel_demo_1',
      page_type: 'landing',
      title: 'Página de Captura / Landing',
      position: 1,
      settings: {
        seo_title: 'Cómo Escalar tu Negocio de Servicios B2B | Valenzuela Consulting',
        seo_description: 'Descubre el sistema paso a paso para agendar llamadas con tomadores de decisiones.',
      },
      sections: [
        {
          id: 'sec_land_hero',
          name: 'Hero Principal',
          bgColor: '#FFFFFF',
          paddingY: 48,
          rows: [
            {
              id: 'row_land_1',
              columns: [
                {
                  id: 'col_land_1',
                  widthPercentage: 100,
                  elements: [
                    {
                      id: 'el_land_badge',
                      type: 'subheading',
                      content: { text: 'ENTRENAMIENTO EXCLUSIVO PARA PROFESIONALES DE SERVICIOS' },
                      styles: {
                        fontSize: 13,
                        fontFamily: 'Inter',
                        textColor: '#2848F0',
                        isBold: true,
                        textAlign: 'center',
                        letterSpacing: 2,
                        marginBottom: 12,
                      },
                    },
                    {
                      id: 'el_land_h1',
                      type: 'heading',
                      content: {
                        text: 'Cómo Convertir el Tráfico de tus Redes Sociales en Citas Agendadas Calificadas Todas las Semanas',
                        level: 'h1',
                      },
                      styles: {
                        fontSize: 38,
                        lineHeight: 1.25,
                        fontFamily: 'Poppins',
                        textColor: '#121111',
                        isBold: true,
                        textAlign: 'center',
                        maxWidth: '850px',
                        marginBottom: 16,
                      },
                    },
                    {
                      id: 'el_land_p',
                      type: 'paragraph',
                      content: {
                        text: 'Sin bailar en TikTok, sin gastar miles de dólares en anuncios impredecibles y sin perseguir prospectos en frío. El sistema probado para coaches y consultores.',
                      },
                      styles: {
                        fontSize: 18,
                        lineHeight: 1.5,
                        fontFamily: 'Inter',
                        textColor: '#5B5B66',
                        textAlign: 'center',
                        maxWidth: '700px',
                        marginBottom: 28,
                      },
                    },
                    {
                      id: 'el_land_btn',
                      type: 'button',
                      content: { buttonText: '👉 Acceder al Video de Presentación Gratuito' },
                      styles: {
                        fontSize: 16,
                        fontFamily: 'Poppins',
                        textColor: '#FFFFFF',
                        bgColor: '#2848F0',
                        isBold: true,
                        paddingTop: 16,
                        paddingBottom: 16,
                        paddingLeft: 32,
                        paddingRight: 32,
                        borderRadius: 8,
                        textAlign: 'center',
                        buttonDestination: 'next_page',
                        marginBottom: 20,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'page_vsl_1',
      funnel_id: 'funnel_demo_1',
      page_type: 'vsl',
      title: 'VSL / Carta de Ventas',
      position: 2,
      settings: {},
      sections: [
        {
          id: 'sec_vsl_hero',
          name: 'Video Sales Letter',
          bgColor: '#FAFAFB',
          paddingY: 40,
          rows: [
            {
              id: 'row_vsl_1',
              columns: [
                {
                  id: 'col_vsl_1',
                  widthPercentage: 100,
                  elements: [
                    {
                      id: 'el_vsl_title',
                      type: 'heading',
                      content: {
                        text: 'Mira este video de 12 minutos antes de solicitar tu sesión',
                        level: 'h2',
                      },
                      styles: {
                        fontSize: 28,
                        fontFamily: 'Poppins',
                        textColor: '#121111',
                        isBold: true,
                        textAlign: 'center',
                        marginBottom: 20,
                      },
                    },
                    {
                      id: 'el_vsl_vid',
                      type: 'video',
                      content: {
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                      },
                      styles: {
                        maxWidth: '780px',
                        marginBottom: 28,
                      },
                    },
                    {
                      id: 'el_vsl_btn',
                      type: 'button',
                      content: { buttonText: 'Continuar al Cuestionario de Calificación →' },
                      styles: {
                        fontSize: 17,
                        fontFamily: 'Poppins',
                        textColor: '#FFFFFF',
                        bgColor: '#1C1C1C',
                        isBold: true,
                        paddingTop: 16,
                        paddingBottom: 16,
                        paddingLeft: 36,
                        paddingRight: 36,
                        borderRadius: 8,
                        textAlign: 'center',
                        buttonDestination: 'next_page',
                        marginBottom: 24,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'page_qual_1',
      funnel_id: 'funnel_demo_1',
      page_type: 'qualification',
      title: 'Filtro de Calificación',
      position: 3,
      settings: {},
      sections: [
        {
          id: 'sec_qual_1',
          name: 'Calificación de Prospectos',
          bgColor: '#FFFFFF',
          paddingY: 36,
          rows: [
            {
              id: 'row_qual_1',
              columns: [
                {
                  id: 'col_qual_1',
                  widthPercentage: 100,
                  elements: [
                    {
                      id: 'el_qual_h',
                      type: 'heading',
                      content: {
                        text: 'Descubre si tu negocio cumple los requisitos para nuestro programa',
                        level: 'h2',
                      },
                      styles: {
                        fontSize: 26,
                        fontFamily: 'Poppins',
                        textColor: '#121111',
                        isBold: true,
                        textAlign: 'center',
                        marginBottom: 10,
                      },
                    },
                    {
                      id: 'el_qual_p',
                      type: 'paragraph',
                      content: {
                        text: 'Completar este breve cuestionario nos permite analizar tu caso antes de la llamada y asegurar un diagnóstico 100% personalizado.',
                      },
                      styles: {
                        fontSize: 15,
                        fontFamily: 'Inter',
                        textColor: '#5B5B66',
                        textAlign: 'center',
                        maxWidth: '650px',
                        marginBottom: 24,
                      },
                    },
                    {
                      id: 'el_qual_form',
                      type: 'form',
                      content: { formId: 'form_qualification_1' },
                      styles: {
                        maxWidth: '600px',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'page_cal_1',
      funnel_id: 'funnel_demo_1',
      page_type: 'calendar',
      title: 'Agendamiento de Cita',
      position: 4,
      settings: {},
      sections: [
        {
          id: 'sec_cal_1',
          name: 'Calendario Nativo de Citas',
          bgColor: '#FBFBFD',
          paddingY: 36,
          rows: [
            {
              id: 'row_cal_1',
              columns: [
                {
                  id: 'col_cal_1',
                  widthPercentage: 100,
                  elements: [
                    {
                      id: 'el_cal_h',
                      type: 'heading',
                      content: {
                        text: '¡Calificas para la Sesión! Elige el día y horario que mejor te convenga',
                        level: 'h2',
                      },
                      styles: {
                        fontSize: 26,
                        fontFamily: 'Poppins',
                        textColor: '#121111',
                        isBold: true,
                        textAlign: 'center',
                        marginBottom: 8,
                      },
                    },
                    {
                      id: 'el_cal_sub',
                      type: 'paragraph',
                      content: {
                        text: 'Sesión 1 a 1 de 30 minutos vía Zoom. Recuerda asistir en una computadora con cámara activa.',
                      },
                      styles: {
                        fontSize: 15,
                        fontFamily: 'Inter',
                        textColor: '#5B5B66',
                        textAlign: 'center',
                        marginBottom: 24,
                      },
                    },
                    {
                      id: 'el_cal_widget',
                      type: 'calendar',
                      content: {},
                      styles: {
                        maxWidth: '750px',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'page_ty_1',
      funnel_id: 'funnel_demo_1',
      page_type: 'thank_you',
      title: 'Página de Gracias y Confirmación',
      position: 5,
      settings: {},
      sections: [
        {
          id: 'sec_ty_1',
          name: 'Confirmación de Sesión',
          bgColor: '#FFFFFF',
          paddingY: 48,
          rows: [
            {
              id: 'row_ty_1',
              columns: [
                {
                  id: 'col_ty_1',
                  widthPercentage: 100,
                  elements: [
                    {
                      id: 'el_ty_h',
                      type: 'heading',
                      content: {
                        text: '🎉 ¡Tu Sesión Estratégica ha sido Confirmada!',
                        level: 'h1',
                      },
                      styles: {
                        fontSize: 32,
                        fontFamily: 'Poppins',
                        textColor: '#14692B',
                        isBold: true,
                        textAlign: 'center',
                        marginBottom: 12,
                      },
                    },
                    {
                      id: 'el_ty_p',
                      type: 'paragraph',
                      content: {
                        text: 'Hemos enviado los detalles de acceso y el enlace de la sala virtual a tu correo electrónico. Por favor revisa tu bandeja de entrada o spam.',
                      },
                      styles: {
                        fontSize: 16,
                        fontFamily: 'Inter',
                        textColor: '#5B5B66',
                        textAlign: 'center',
                        maxWidth: '600px',
                        marginBottom: 24,
                      },
                    },
                    {
                      id: 'el_ty_steps',
                      type: 'bullet_list',
                      content: {
                        items: [
                          'Añade la fecha a tu calendario personal para no olvidarla.',
                          'Llega puntual (tolerancia máxima de 5 minutos).',
                          'Trae a mano las métricas actuales de tu negocio para un diagnóstico certero.',
                        ],
                      },
                      styles: {
                        fontSize: 15,
                        fontFamily: 'Inter',
                        textColor: '#121111',
                        maxWidth: '550px',
                        marginBottom: 28,
                      },
                    },
                    {
                      id: 'el_ty_btn',
                      type: 'button',
                      content: { buttonText: '📲 Confirmar mi asistencia por WhatsApp' },
                      styles: {
                        fontSize: 15,
                        fontFamily: 'Poppins',
                        textColor: '#FFFFFF',
                        bgColor: '#2848F0',
                        isBold: true,
                        paddingTop: 14,
                        paddingBottom: 14,
                        paddingLeft: 28,
                        paddingRight: 28,
                        borderRadius: 8,
                        textAlign: 'center',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'cnt_1',
    organization_id: 'org_ssp_demo',
    full_name: 'Carlos Mendoza Ramos',
    email: 'carlos@agenciagrowth.pe',
    phone: '+51 987 654 321',
    status: 'cita_agendada',
    source: 'Instagram Bio → Tarjeta SSP',
    score: 80,
    utm: { source: 'instagram', medium: 'bio_link', campaign: 'reels_organico' },
    last_activity_at: '2026-10-12T08:30:00Z',
    created_at: '2026-10-11T19:20:00Z',
  },
  {
    id: 'cnt_2',
    organization_id: 'org_ssp_demo',
    full_name: 'Mariana Duarte',
    email: 'mariana.coach@gmail.com',
    phone: '+57 310 987 6543',
    status: 'calificado',
    source: 'LinkedIn Post',
    score: 65,
    utm: { source: 'linkedin', medium: 'post', campaign: 'lanzamiento_q4' },
    last_activity_at: '2026-10-11T16:45:00Z',
    created_at: '2026-10-11T15:00:00Z',
  },
  {
    id: 'cnt_3',
    organization_id: 'org_ssp_demo',
    full_name: 'Esteban Rios',
    email: 'esteban@solucionestech.mx',
    phone: '+52 81 2345 6789',
    status: 'ganado',
    source: 'YouTube Video',
    score: 90,
    utm: { source: 'youtube', medium: 'video', campaign: 'vsl_mastery' },
    last_activity_at: '2026-10-10T11:00:00Z',
    created_at: '2026-10-05T14:10:00Z',
  },
  {
    id: 'cnt_4',
    organization_id: 'org_ssp_demo',
    full_name: 'Lucía Benítez',
    email: 'lucia@mentoriafitness.es',
    phone: '+34 612 345 678',
    status: 'contactado',
    source: 'Instagram Story',
    score: 55,
    last_activity_at: '2026-10-09T18:20:00Z',
    created_at: '2026-10-09T14:30:00Z',
  },
  {
    id: 'cnt_5',
    organization_id: 'org_ssp_demo',
    full_name: 'Roberto Gómez',
    email: 'roberto@marketingdigital.cl',
    phone: '+56 9 8765 4321',
    status: 'nuevo',
    source: 'Tarjeta Virtual SSP',
    score: 30,
    last_activity_at: '2026-10-12T07:10:00Z',
    created_at: '2026-10-12T07:10:00Z',
  },
  {
    id: 'cnt_6',
    organization_id: 'org_ssp_demo',
    full_name: 'Verónica Santos',
    email: 'veronica@santoslegal.com',
    phone: '+54 9 11 2345 6789',
    status: 'no_asistio',
    source: 'Twitter / X',
    score: 75,
    last_activity_at: '2026-10-08T15:00:00Z',
    created_at: '2026-10-06T10:15:00Z',
  },
];

export const INITIAL_NOTES: ContactNote[] = [
  {
    id: 'note_1',
    contact_id: 'cnt_1',
    organization_id: 'org_ssp_demo',
    author_id: 'usr_demo_101',
    author_name: 'Alejandro Valenzuela',
    body: 'Tiene una agencia de 4 personas. Factura $4,500/mes y su cuello de botella es que no tiene tiempo de prospectar manualmente. Interesado en programa de 90 días.',
    created_at: '2026-10-11T20:00:00Z',
  },
  {
    id: 'note_2',
    contact_id: 'cnt_3',
    organization_id: 'org_ssp_demo',
    author_id: 'usr_demo_101',
    author_name: 'Alejandro Valenzuela',
    body: '¡Cierre exitoso! Pagó el programa High-Ticket de $3,000 USD en 2 partes. Inicia onboarding el lunes.',
    created_at: '2026-10-10T11:30:00Z',
  },
];

export const INITIAL_EVENTS: ContactEvent[] = [
  {
    id: 'evt_1',
    contact_id: 'cnt_1',
    organization_id: 'org_ssp_demo',
    event_type: 'form_submitted',
    description: 'Completó Cuestionario de Calificación con 80 puntos (APROBADO)',
    created_at: '2026-10-11T19:22:00Z',
  },
  {
    id: 'evt_2',
    contact_id: 'cnt_1',
    organization_id: 'org_ssp_demo',
    event_type: 'appointment_booked',
    description: 'Agendó cita de diagnóstico para mañana a las 11:00 AM',
    created_at: '2026-10-11T19:25:00Z',
  },
  {
    id: 'evt_3',
    contact_id: 'cnt_3',
    organization_id: 'org_ssp_demo',
    event_type: 'status_changed',
    description: 'Estado cambiado a GANADO por Alejandro Valenzuela',
    created_at: '2026-10-10T11:00:00Z',
  },
];

export const INITIAL_AVAILABILITY: AvailabilityRule[] = [
  { id: 'av_1', organization_id: 'org_ssp_demo', weekday: 1, start_time: '09:00', end_time: '18:00', timezone: 'America/Mexico_City', is_active: true },
  { id: 'av_2', organization_id: 'org_ssp_demo', weekday: 2, start_time: '09:00', end_time: '18:00', timezone: 'America/Mexico_City', is_active: true },
  { id: 'av_3', organization_id: 'org_ssp_demo', weekday: 3, start_time: '09:00', end_time: '18:00', timezone: 'America/Mexico_City', is_active: true },
  { id: 'av_4', organization_id: 'org_ssp_demo', weekday: 4, start_time: '09:00', end_time: '18:00', timezone: 'America/Mexico_City', is_active: true },
  { id: 'av_5', organization_id: 'org_ssp_demo', weekday: 5, start_time: '09:00', end_time: '15:00', timezone: 'America/Mexico_City', is_active: true },
  { id: 'av_6', organization_id: 'org_ssp_demo', weekday: 6, start_time: '10:00', end_time: '14:00', timezone: 'America/Mexico_City', is_active: false },
  { id: 'av_0', organization_id: 'org_ssp_demo', weekday: 0, start_time: '10:00', end_time: '14:00', timezone: 'America/Mexico_City', is_active: false },
];

export const INITIAL_APPOINTMENT_TYPE: AppointmentType = {
  id: 'apt_type_1',
  organization_id: 'org_ssp_demo',
  name: 'Sesión de Diagnóstico y Estrategia 1 a 1',
  duration_minutes: 30,
  description: 'Evaluamos tu cuello de botella comercial y trazamos el plan de acción.',
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app_1',
    organization_id: 'org_ssp_demo',
    contact_id: 'cnt_1',
    contact_name: 'Carlos Mendoza Ramos',
    contact_email: 'carlos@agenciagrowth.pe',
    contact_phone: '+51 987 654 321',
    appointment_type_id: 'apt_type_1',
    appointment_type_name: 'Sesión de Diagnóstico 1 a 1',
    starts_at: '2026-10-13T11:00:00Z',
    ends_at: '2026-10-13T11:30:00Z',
    status: 'agendada',
    notes: 'Confirmó por WhatsApp. Muy entusiasmado.',
    created_at: '2026-10-11T19:25:00Z',
  },
  {
    id: 'app_2',
    organization_id: 'org_ssp_demo',
    contact_id: 'cnt_6',
    contact_name: 'Verónica Santos',
    contact_email: 'veronica@santoslegal.com',
    contact_phone: '+54 9 11 2345 6789',
    appointment_type_id: 'apt_type_1',
    appointment_type_name: 'Sesión de Diagnóstico 1 a 1',
    starts_at: '2026-10-08T15:00:00Z',
    ends_at: '2026-10-08T15:30:00Z',
    status: 'no_asistio',
    notes: 'No ingresó a la sala de Zoom tras 10 min de espera. Se le reenvió recordatorio.',
    created_at: '2026-10-06T10:20:00Z',
  },
];

export const INITIAL_INTEGRATIONS: EmailIntegration[] = [
  {
    id: 'int_1',
    organization_id: 'org_ssp_demo',
    provider: 'activecampaign',
    credentials_encrypted: '••••••••••••••••••••••••',
    list_id: 'list_b2b_prospects',
    list_name: 'Lista de Prospectos Calificados B2B',
    status: 'connected',
    last_synced_at: '2026-10-12T06:00:00Z',
  },
  {
    id: 'int_2',
    organization_id: 'org_ssp_demo',
    provider: 'getresponse',
    credentials_encrypted: '',
    list_id: '',
    list_name: '',
    status: 'disconnected',
  },
  {
    id: 'int_3',
    organization_id: 'org_ssp_demo',
    provider: 'kit',
    credentials_encrypted: '',
    list_id: '',
    list_name: '',
    status: 'disconnected',
  },
  {
    id: 'int_4',
    organization_id: 'org_ssp_demo',
    provider: 'mailerlite',
    credentials_encrypted: '',
    list_id: '',
    list_name: '',
    status: 'disconnected',
  },
  {
    id: 'int_5',
    organization_id: 'org_ssp_demo',
    provider: 'brevo',
    credentials_encrypted: '',
    list_id: '',
    list_name: '',
    status: 'disconnected',
  },
];
