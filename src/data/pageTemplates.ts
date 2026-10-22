import { PageBlockSection, FunnelPageGlobalSettings } from '../types';

export interface PageTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  badge: string;
  badgeColor: string;
  previewColor: string;
  pageSettings?: Partial<FunnelPageGlobalSettings>;
  sections: PageBlockSection[];
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: 'tpl_carta_ventas_redes_sociales',
    name: 'Carta de Ventas - Sistema Redes Sociales ($1000/Mes)',
    category: 'Carta de Ventas / VSL',
    description: 'Plantilla idéntica a la imagen: Barra superior de urgencia en rojo ("⚠️ Finalmente... Un sistema Real"), titular de alto impacto con palabras clave en oro ("$1000 Dólares Mensuales") y redes sociales subrayadas, subtítulo persuasivo, reproductor de video con marco dorado y botón de acción verde de alta conversión.',
    badge: 'Nueva Plantilla',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    previewColor: '#FACC15',
    pageSettings: {
      pageWidthType: 'full',
      pageContentMaxWidth: 1100,
      pageBgColor: '#000000',
      headingFontFamily: 'Poppins',
      bodyFontFamily: 'Inter',
      primaryColor: '#16A34A',
      pageBorderRadius: 0,
      textColor: '#FFFFFF',
    },
    sections: [
      {
        id: 'sec_sv_urgency_bar',
        name: 'Barra Superior de Alerta',
        bgColor: '#DC2626',
        paddingY: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 16,
        paddingRight: 16,
        rows: [
          {
            id: 'row_sv_urgency',
            widthType: 'full',
            maxWidth: 1200,
            columns: [
              {
                id: 'col_sv_urgency',
                widthPercentage: 100,
                elements: [
                  {
                    id: 'el_sv_urgency_text',
                    type: 'subheading',
                    content: {
                      text: '⚠️ Finalmente... Un sistema Real que tiene todo lo que necesitas para ganar mucho dinero... DESDE TU CASA!',
                    },
                    styles: {
                      fontSize: 14,
                      fontFamily: 'Poppins',
                      textColor: '#FFFFFF',
                      isBold: true,
                      textAlign: 'center',
                      marginTop: 0,
                      marginBottom: 0,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'sec_sv_headline_subheadline',
        name: 'Titular Principal y Subtítulo',
        bgColor: '#000000',
        paddingY: 36,
        paddingTop: 44,
        paddingBottom: 16,
        paddingLeft: 20,
        paddingRight: 20,
        rows: [
          {
            id: 'row_sv_headline',
            widthType: 'boxed',
            maxWidth: 960,
            columns: [
              {
                id: 'col_sv_headline',
                widthPercentage: 100,
                elements: [
                  {
                    id: 'el_sv_gold_headline',
                    type: 'rich_text',
                    content: {
                      html: '<h1 style="font-size: 34px; line-height: 1.35; font-weight: 800; font-family: Poppins, sans-serif; text-align: center; color: #FFFFFF; margin: 0 0 20px 0;">"Descubre el Novedoso Sistema que te permite <span style="color: #FACC15;">ganar $1000 Dólares Mensuales a más</span> <span style="font-style: italic;">Trabajando desde Casa...</span> <span style="text-decoration: underline; font-style: italic;">Usando Solamente Tus Redes Sociales</span>"</h1>',
                    },
                    styles: {
                      textAlign: 'center',
                      marginTop: 0,
                      marginBottom: 16,
                    },
                  },
                  {
                    id: 'el_sv_gold_subheadline',
                    type: 'rich_text',
                    content: {
                      html: '<p style="font-size: 16px; line-height: 1.6; text-align: center; color: #E4E4E7; font-family: Inter, sans-serif; margin: 0 0 8px 0;">Sin Procesos Técnicos Complicados... <span style="font-style: italic; font-weight: 600; color: #FFFFFF;">Incluso sin Tener Experiencia</span><br/><span style="font-weight: 700; color: #FFFFFF; display: inline-block; margin-top: 6px;">Mira la presentación Completa 👇👇</span></p>',
                    },
                    styles: {
                      textAlign: 'center',
                      marginTop: 0,
                      marginBottom: 16,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'sec_sv_video',
        name: 'Presentación en Video (Marco Dorado)',
        bgColor: '#000000',
        paddingY: 16,
        paddingTop: 8,
        paddingBottom: 24,
        paddingLeft: 20,
        paddingRight: 20,
        rows: [
          {
            id: 'row_sv_video',
            widthType: 'boxed',
            maxWidth: 840,
            columns: [
              {
                id: 'col_sv_video',
                widthPercentage: 100,
                elements: [
                  {
                    id: 'el_sv_video_player',
                    type: 'video',
                    content: {
                      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    },
                    styles: {
                      maxWidth: '820px',
                      borderRadius: 8,
                      borderWidth: 3,
                      borderColor: '#FACC15',
                      borderStyle: 'solid',
                      aspectRatio: '16/9',
                      marginTop: 0,
                      marginBottom: 20,
                      textAlign: 'center',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'sec_sv_reinforce_cta',
        name: 'Texto de Redes Sociales y Botón CTA',
        bgColor: '#000000',
        paddingY: 20,
        paddingTop: 8,
        paddingBottom: 60,
        paddingLeft: 20,
        paddingRight: 20,
        rows: [
          {
            id: 'row_sv_cta',
            widthType: 'boxed',
            maxWidth: 880,
            columns: [
              {
                id: 'col_sv_cta',
                widthPercentage: 100,
                elements: [
                  {
                    id: 'el_sv_reinforce_text',
                    type: 'rich_text',
                    content: {
                      html: '<p style="font-size: 15px; line-height: 1.6; text-align: center; color: #FFFFFF; font-family: Inter, sans-serif; margin: 0 0 24px 0;">Redes Sociales que usas todos los días como <strong><em>Facebook, Instagram, Youtube, Tiktok, WhatsApp...</em></strong> <strong><span style="text-decoration: underline;">Desde hoy vas a Ganar Dinero por Usarlas!...</span></strong> <strong>Empieza AHORA</strong></p>',
                    },
                    styles: {
                      textAlign: 'center',
                      marginTop: 0,
                      marginBottom: 20,
                    },
                  },
                  {
                    id: 'el_sv_cta_button',
                    type: 'button',
                    content: {
                      buttonText: '➜ ¡SÍ, QUIERO APROVECHAR ESTA OPORTUNIDAD!',
                    },
                    styles: {
                      fontSize: 16,
                      fontFamily: 'Poppins',
                      isBold: true,
                      textColor: '#FFFFFF',
                      bgColor: '#16A34A',
                      buttonDestination: 'next_page',
                      paddingTop: 18,
                      paddingBottom: 18,
                      paddingLeft: 36,
                      paddingRight: 36,
                      borderRadius: 8,
                      textAlign: 'center',
                      marginTop: 4,
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
    id: 'tpl_vsl_coaching_exact',
    name: 'VSL Coaching & Formación (Alta Conversión)',
    category: 'Video Sales Letter (VSL)',
    description: 'Plantilla idéntica a la imagen: Barra superior azul con banner "VÍDEO GRATIS", titular de alto impacto con palabras clave subrayadas y resaltadas en verde esmeralda, reproductor de video centrado, viñetas de curiosidad con checks azules y botón de acción verde esmeralda.',
    badge: 'Recomendada',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    previewColor: '#00C49F',
    pageSettings: {
      pageWidthType: 'full',
      pageContentMaxWidth: 1200,
      pageBgColor: '#FFFFFF',
      headingFontFamily: 'Poppins',
      bodyFontFamily: 'Inter',
      primaryColor: '#00C49F',
      pageBorderRadius: 0,
      textColor: '#0F172A',
    },
    sections: [
      {
        id: 'sec_top_banner',
        name: 'Barra Superior Informativa',
        bgColor: '#2563EB',
        paddingY: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 16,
        paddingRight: 16,
        rows: [
          {
            id: 'row_top_banner_1',
            columns: [
              {
                id: 'col_top_banner_1',
                widthPercentage: 100,
                elements: [
                  {
                    id: 'el_top_banner_text',
                    type: 'subheading',
                    content: { text: 'VÍDEO GRATIS - 17 MINUTOS' },
                    styles: {
                      fontSize: 13,
                      fontFamily: 'Poppins',
                      textColor: '#FFFFFF',
                      isBold: true,
                      letterSpacing: 2,
                      textAlign: 'center',
                      marginBottom: 0,
                      marginTop: 0,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'sec_headline_hero',
        name: 'Titular Principal y Promesa',
        bgColor: '#FFFFFF',
        paddingY: 36,
        paddingTop: 44,
        paddingBottom: 20,
        paddingLeft: 24,
        paddingRight: 24,
        rows: [
          {
            id: 'row_headline_1',
            widthType: 'boxed',
            maxWidth: 1050,
            columns: [
              {
                id: 'col_headline_1',
                widthPercentage: 100,
                elements: [
                  {
                    id: 'el_headline_rich',
                    type: 'rich_text',
                    content: {
                      html: '<h1 style="font-size: 36px; line-height: 1.25; font-weight: 800; font-family: Poppins, sans-serif; color: #0F172A; text-align: center; margin-bottom: 16px; letter-spacing: -0.5px;">Descubre el sistema <span style="text-decoration: underline; text-decoration-thickness: 3px;">llave en mano</span> que instalamos en <span style="color: #00BFA5; font-style: italic;">negocios de coaching o formación</span> para que consigan ventas estables</h1><p style="font-size: 18px; line-height: 1.5; font-family: Inter, sans-serif; color: #334155; text-align: center; font-weight: 500; margin-bottom: 0;">...sin depender de lanzamientos o crear contenidos a diario</p>',
                    },
                    styles: {
                      textAlign: 'center',
                      marginBottom: 0,
                      marginTop: 0,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'sec_core_video_bullets',
        name: 'Video y Bullets con Checkmarks',
        bgColor: '#FFFFFF',
        paddingY: 24,
        paddingTop: 12,
        paddingBottom: 48,
        paddingLeft: 24,
        paddingRight: 24,
        rows: [
          {
            id: 'row_core_vsl',
            widthType: 'boxed',
            maxWidth: 1100,
            columns: [
              {
                id: 'col_vsl_video',
                widthPercentage: 50,
                elements: [
                  {
                    id: 'el_vsl_player',
                    type: 'video',
                    content: {
                      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    },
                    styles: {
                      maxWidth: '100%',
                      borderRadius: 10,
                      marginTop: 4,
                      marginBottom: 0,
                    },
                  },
                ],
              },
              {
                id: 'col_vsl_copy',
                widthPercentage: 50,
                elements: [
                  {
                    id: 'el_vsl_copy_text',
                    type: 'rich_text',
                    content: {
                      html: '<p style="font-size: 16px; line-height: 1.6; color: #1E293B; margin-bottom: 20px; font-family: Inter, sans-serif;">El sistema que usamos desde hace 4 años para atraer a desconocidos interesados en lo que ofrecemos y <strong>convertirlos en clientes en menos de 7 días</strong></p><p style="font-size: 15px; line-height: 1.55; color: #1E293B; margin-bottom: 18px; font-family: Inter, sans-serif; display: flex; align-items: flex-start; gap: 10px;"><span style="color: #2563EB; font-weight: 800; font-size: 19px; line-height: 1; flex-shrink: 0; margin-top: 2px;">✔</span><span>Cómo aprovechar el potencial del algoritmo que hace el <strong>90% del trabajo por ti</strong> para encontrar a clientes potenciales</span></p><p style="font-size: 15px; line-height: 1.55; color: #1E293B; margin-bottom: 28px; font-family: Inter, sans-serif; display: flex; align-items: flex-start; gap: 10px;"><span style="color: #2563EB; font-weight: 800; font-size: 19px; line-height: 1; flex-shrink: 0; margin-top: 2px;">✔</span><span>Cómo aprovechar el potencial de la <strong>publicidad online para hacer rentable tu inversión</strong> y atraer solo a clientes cualificados</span></p>',
                    },
                    styles: {
                      marginBottom: 16,
                      marginTop: 0,
                    },
                  },
                  {
                    id: 'el_vsl_cta_btn',
                    type: 'button',
                    content: {
                      buttonText: 'VER VÍDEO AHORA',
                    },
                    styles: {
                      fontSize: 18,
                      fontFamily: 'Poppins',
                      textColor: '#FFFFFF',
                      bgColor: '#00C49F',
                      isBold: true,
                      paddingTop: 16,
                      paddingBottom: 16,
                      paddingLeft: 36,
                      paddingRight: 36,
                      borderRadius: 50,
                      textAlign: 'center',
                      marginBottom: 0,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'sec_legal_footer',
        name: 'Pie de Página Legal',
        bgColor: '#FFFFFF',
        paddingY: 36,
        paddingTop: 32,
        paddingBottom: 36,
        paddingLeft: 24,
        paddingRight: 24,
        rows: [
          {
            id: 'row_legal_footer_1',
            columns: [
              {
                id: 'col_legal_footer_1',
                widthPercentage: 100,
                elements: [
                  {
                    id: 'el_legal_copy_1',
                    type: 'paragraph',
                    content: {
                      text: 'Instituto Webinar © 2023',
                    },
                    styles: {
                      fontSize: 12,
                      fontFamily: 'Inter',
                      textColor: '#64748B',
                      textAlign: 'center',
                      marginBottom: 6,
                      marginTop: 0,
                    },
                  },
                  {
                    id: 'el_legal_copy_2',
                    type: 'paragraph',
                    content: {
                      text: 'Aviso Legal - Política de Privacidad - Política de Cookies',
                    },
                    styles: {
                      fontSize: 11,
                      fontFamily: 'Inter',
                      textColor: '#64748B',
                      textAlign: 'center',
                      marginBottom: 0,
                      marginTop: 0,
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
    id: 'tpl_lead_magnet_squeeze',
    name: 'Squeeze Page / Captura de Prospectos',
    category: 'Captura (Lead Magnet)',
    description: 'Página de registro limpio diseñada para alta conversión: Insignia de oferta gratuita, titular persuasivo, portada/mockup y formulario directo de nombre y correo.',
    badge: 'Alta Conversión',
    badgeColor: 'bg-blue-100 text-[#2848F0] border-blue-300',
    previewColor: '#2848F0',
    pageSettings: {
      pageWidthType: 'boxed',
      pageContentMaxWidth: 1100,
      pageBgColor: '#FAFAFB',
      headingFontFamily: 'Poppins',
      bodyFontFamily: 'Inter',
      primaryColor: '#2848F0',
      pageBorderRadius: 0,
      textColor: '#121111',
    },
    sections: [
      {
        id: 'sec_sq_hero',
        name: 'Hero de Captura',
        bgColor: '#FFFFFF',
        paddingY: 48,
        rows: [
          {
            id: 'row_sq_1',
            columns: [
              {
                id: 'col_sq_left',
                widthPercentage: 55,
                elements: [
                  {
                    id: 'el_sq_badge',
                    type: 'subheading',
                    content: { text: 'GUÍA GRATUITA EN PDF + PLANTILLAS' },
                    styles: {
                      fontSize: 12,
                      fontFamily: 'Inter',
                      textColor: '#2848F0',
                      isBold: true,
                      letterSpacing: 2,
                      marginBottom: 12,
                    },
                  },
                  {
                    id: 'el_sq_h1',
                    type: 'heading',
                    content: {
                      text: 'Los 7 Errores Críticos que Te Impiden Escalar Tu Negocio de Servicios Este Año',
                      level: 'h1',
                    },
                    styles: {
                      fontSize: 32,
                      fontFamily: 'Poppins',
                      textColor: '#121111',
                      isBold: true,
                      lineHeight: 1.25,
                      marginBottom: 16,
                    },
                  },
                  {
                    id: 'el_sq_desc',
                    type: 'paragraph',
                    content: {
                      text: 'Descarga gratis la guía práctica con el checklist paso a paso que utilizan los negocios de 6 cifras para captar clientes predecibles semana tras semana.',
                    },
                    styles: {
                      fontSize: 15,
                      fontFamily: 'Inter',
                      textColor: '#5B5B66',
                      lineHeight: 1.6,
                      marginBottom: 20,
                    },
                  },
                  {
                    id: 'el_sq_form',
                    type: 'simple_form',
                    content: {},
                    styles: {
                      marginBottom: 12,
                    },
                  },
                ],
              },
              {
                id: 'col_sq_right',
                widthPercentage: 45,
                elements: [
                  {
                    id: 'el_sq_img',
                    type: 'image',
                    content: {
                      src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop&q=80',
                      alt: 'Portada Guía Lead Magnet',
                    },
                    styles: {
                      maxWidth: '100%',
                      borderRadius: 12,
                      shadow: 'lg',
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
    id: 'tpl_sales_page_full',
    name: 'Carta de Ventas Completa (Long-Form)',
    category: 'Ventas & Cierre',
    description: 'Estructura integral para productos o servicios High-Ticket: Cabecera con navegación, Titular principal, Problema vs Solución, Testimonios y Llamada a la acción final.',
    badge: 'Completa',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    previewColor: '#7C3AED',
    pageSettings: {
      pageWidthType: 'boxed',
      pageContentMaxWidth: 1200,
      pageBgColor: '#FFFFFF',
      headingFontFamily: 'Poppins',
      bodyFontFamily: 'Inter',
      primaryColor: '#7C3AED',
      pageBorderRadius: 0,
      textColor: '#121111',
    },
    sections: [
      {
        id: 'sec_long_nav',
        name: 'Cabecera de Navegación',
        bgColor: '#FFFFFF',
        paddingY: 16,
        borderBottomWidth: 1,
        borderColor: '#E4E4E7',
        rows: [
          {
            id: 'row_long_nav',
            columns: [
              {
                id: 'col_ln_1',
                widthPercentage: 40,
                elements: [
                  {
                    id: 'el_ln_brand',
                    type: 'heading',
                    content: { text: '✦ Metodología Élite', level: 'h3' },
                    styles: { fontSize: 20, fontFamily: 'Poppins', textColor: '#121111', isBold: true },
                  },
                ],
              },
              {
                id: 'col_ln_2',
                widthPercentage: 60,
                elements: [
                  {
                    id: 'el_ln_btn',
                    type: 'button',
                    content: { buttonText: '👉 Aplicar al Programa' },
                    styles: {
                      fontSize: 14,
                      fontFamily: 'Poppins',
                      bgColor: '#7C3AED',
                      textColor: '#FFFFFF',
                      isBold: true,
                      paddingTop: 10,
                      paddingBottom: 10,
                      paddingLeft: 20,
                      paddingRight: 20,
                      borderRadius: 8,
                      textAlign: 'right',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'sec_long_hero',
        name: 'Hero y Promesa Principal',
        bgColor: '#FDFCFE',
        paddingY: 48,
        rows: [
          {
            id: 'row_lh_1',
            columns: [
              {
                id: 'col_lh_1',
                widthPercentage: 100,
                elements: [
                  {
                    id: 'el_lh_h1',
                    type: 'heading',
                    content: {
                      text: 'El Sistema Definitivo para Escalar tu Facturación Mensual sin Quemarte',
                      level: 'h1',
                    },
                    styles: {
                      fontSize: 36,
                      fontFamily: 'Poppins',
                      textColor: '#121111',
                      isBold: true,
                      textAlign: 'center',
                      marginBottom: 16,
                    },
                  },
                  {
                    id: 'el_lh_p',
                    type: 'paragraph',
                    content: {
                      text: 'Acompañamiento 1 a 1 para consultores y agencias que desean instalar un sistema predecible de atracción de clientes de alto valor.',
                    },
                    styles: {
                      fontSize: 17,
                      fontFamily: 'Inter',
                      textColor: '#52525B',
                      textAlign: 'center',
                      maxWidth: '800px',
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
];
