import type { CSSProperties } from 'react';
import {
  LibraryItem,
  PageBlockSection,
  PageBlockRow,
  PageBlockElement,
  PopupWindowSettings,
} from '../types';
import { PAGE_TEMPLATES } from '../data/pageTemplates';
import { cloneRowWithFreshIds } from './editorTreeUtils';

export const DEFAULT_LIBRARY_CATEGORY = 'Sin categoría';

export const INITIAL_LIBRARY_CATEGORIES: string[] = [
  DEFAULT_LIBRARY_CATEGORY,
  'Carta de Ventas / VSL',
  'Captura / Leads',
  'Cabeceras',
  'Oferta y Bonos',
  'Testimonios y Autoridad',
  'Preguntas y Garantía',
  'Cierre y Urgencia',
  'Pie de Página',
];

const freshUid = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

const refreshElementInternalIds = (el: PageBlockElement): PageBlockElement => {
  const next: PageBlockElement = {
    ...el,
    content: { ...el.content },
  };

  if (Array.isArray(next.content.formFields)) {
    next.content.formFields = next.content.formFields.map((field) => ({
      ...field,
      id: freshUid('fld'),
    }));
  }

  if (Array.isArray(next.content.extraFields)) {
    next.content.extraFields = next.content.extraFields.map((field) => ({
      ...field,
      id: freshUid('efld'),
    }));
  }

  if (Array.isArray(next.content.faqItems)) {
    next.content.faqItems = next.content.faqItems.map((faq) => ({
      ...faq,
      id: freshUid('faq'),
    }));
  }

  if (Array.isArray(next.content.socialLinks)) {
    next.content.socialLinks = next.content.socialLinks.map((soc) => ({
      ...soc,
      id: freshUid('soc'),
    }));
  }

  if (next.type === 'inner_columns' && next.nestedRow) {
    next.nestedRow = refreshRowInternalIds(next.nestedRow);
  }

  return next;
};

const refreshRowInternalIds = (row: PageBlockRow): PageBlockRow => ({
  ...row,
  columns: row.columns.map((col) => ({
    ...col,
    elements: col.elements.map((el) => refreshElementInternalIds(el)),
  })),
});

export const cloneSectionWithFreshIds = (
  section: PageBlockSection
): PageBlockSection => {
  const copy: PageBlockSection = JSON.parse(JSON.stringify(section));
  copy.id = freshUid('sec');
  copy.rows = (copy.rows || []).map((row) =>
    refreshRowInternalIds(cloneRowWithFreshIds(row))
  );
  return copy;
};

export const cloneSectionsWithFreshIds = (
  sections: PageBlockSection[]
): PageBlockSection[] =>
  (sections || []).map((sec) => cloneSectionWithFreshIds(sec));

const countElementsInRow = (row: PageBlockRow): number =>
  (row.columns || []).reduce((acc, col) => {
    const colCount = (col.elements || []).reduce((elAcc, el) => {
      if (el.type === 'inner_columns' && el.nestedRow) {
        return elAcc + countElementsInRow(el.nestedRow);
      }
      return elAcc + 1;
    }, 0);
    return acc + colCount;
  }, 0);

export const isCanvasEffectivelyEmpty = (
  sections: PageBlockSection[]
): boolean => {
  if (!sections || sections.length === 0) return true;
  const totalElements = sections.reduce(
    (sum, sec) =>
      sum +
      (sec.rows || []).reduce((rSum, r) => rSum + countElementsInRow(r), 0),
    0
  );
  return totalElements === 0;
};

export interface PrebuiltBlockDef {
  type: string;
  title: string;
  cleanName: string;
  category: string;
  badge: string;
  badgeColor: string;
  desc: string;
}

export const PREBUILT_BLOCK_DEFS: PrebuiltBlockDef[] = [
  {
    type: 'header',
    title: '🔝 Cabecera de Página (Header & Nav)',
    cleanName: 'Cabecera de Página (Header & Nav)',
    category: 'Cabeceras',
    badge: 'Cabecera',
    badgeColor: 'bg-blue-50 text-[#2848F0]',
    desc: 'Logotipo de marca a la izquierda, menú de navegación central y botón de llamada a la acción destacado.',
  },
  {
    type: 'offer',
    title: '📦 Presentación de la Oferta (Stack)',
    cleanName: 'Presentación de la Oferta (Stack)',
    category: 'Oferta y Bonos',
    badge: 'Carta de Venta',
    badgeColor: 'bg-emerald-50 text-emerald-700',
    desc: 'Mockup / imagen de producto, bullet points de valor acumulado y desglose de precio de lanzamiento.',
  },
  {
    type: 'fascinations',
    title: '🎯 Bullets de Fascinación y Beneficios',
    cleanName: 'Bullets de Fascinación y Beneficios',
    category: 'Oferta y Bonos',
    badge: 'Copywriting',
    badgeColor: 'bg-indigo-50 text-indigo-700',
    desc: '2 columnas con viñetas de alta curiosidad que enganchan y explican lo que descubrirán.',
  },
  {
    type: 'guarantee',
    title: '🛡️ Garantía 100% Incondicional',
    cleanName: 'Garantía 100% Incondicional',
    category: 'Preguntas y Garantía',
    badge: 'Riesgo Cero',
    badgeColor: 'bg-blue-50 text-[#2848F0]',
    desc: 'Sello de seguridad, garantía de satisfacción de 30 días y reversión total del riesgo.',
  },
  {
    type: 'comparison',
    title: '⚖️ Comparativa: Antes vs Después',
    cleanName: 'Comparativa: Antes vs Después',
    category: 'Oferta y Bonos',
    badge: 'Contraste',
    badgeColor: 'bg-zinc-100 text-zinc-700',
    desc: 'Contraste directo entre el método antiguo disperso y tu sistema integrado de alto rendimiento.',
  },
  {
    type: 'bonuses',
    title: '🎁 Bonos Exclusivos (Bonus Stack)',
    cleanName: 'Bonos Exclusivos (Bonus Stack)',
    category: 'Oferta y Bonos',
    badge: '3 Tarjetas',
    badgeColor: 'bg-purple-50 text-purple-700',
    desc: '3 columnas con bonos de acción rápida (scripts, automatizaciones, soporte) valorados en USD.',
  },
  {
    type: 'vsl',
    title: '🎬 Bloque VSL Principal',
    cleanName: 'Bloque VSL Principal con Video',
    category: 'Carta de Ventas / VSL',
    badge: 'Video',
    badgeColor: 'bg-red-50 text-red-700',
    desc: 'Titular provocador, reproductor de video centrado y botón de llamada a la acción.',
  },
  {
    type: 'bio',
    title: '👤 Sobre el Autor / Quién Soy',
    cleanName: 'Sobre el Autor / Quién Soy',
    category: 'Testimonios y Autoridad',
    badge: 'Autoridad',
    badgeColor: 'bg-sky-50 text-sky-700',
    desc: 'Foto del consultor, credenciales, historia de origen y justificación de por qué escucharte.',
  },
  {
    type: 'testimonials',
    title: '💬 Testimonios y Prueba Social',
    cleanName: 'Testimonios y Prueba Social',
    category: 'Testimonios y Autoridad',
    badge: 'Casos Reales',
    badgeColor: 'bg-teal-50 text-teal-700',
    desc: '2 columnas con citas de clientes, nombres de negocio y resultados cuantificables.',
  },
  {
    type: 'faq',
    title: '❓ Preguntas Frecuentes (FAQ)',
    cleanName: 'Preguntas Frecuentes (FAQ)',
    category: 'Preguntas y Garantía',
    badge: 'Objeciones',
    badgeColor: 'bg-amber-50 text-amber-700',
    desc: 'Derribo de objeciones comunes sobre conocimientos técnicos, tiempos y resultados esperados.',
  },
  {
    type: 'urgency',
    title: '⏳ Urgencia y Cupos Limitados',
    cleanName: 'Urgencia y Cupos Limitados',
    category: 'Cierre y Urgencia',
    badge: 'Escasez',
    badgeColor: 'bg-orange-50 text-orange-700',
    desc: 'Fondo oscuro contrastante con aviso de cupos limitados mensuales y botón de acción inmediata.',
  },
  {
    type: 'cta',
    title: '⚡ Llamada a la Acción de Cierre',
    cleanName: 'Llamada a la Acción de Cierre',
    category: 'Cierre y Urgencia',
    badge: 'Cierre',
    badgeColor: 'bg-blue-50 text-blue-800',
    desc: 'Fondo oscuro, recordatorio de plazas limitadas y botón de alta conversión.',
  },
  {
    type: 'footer',
    title: '🔻 Pie de Página (Footer Completo)',
    cleanName: 'Pie de Página (Footer Completo)',
    category: 'Pie de Página',
    badge: 'Footer',
    badgeColor: 'bg-zinc-800 text-zinc-100',
    desc: 'Logotipo, enlaces rápidos de navegación, botón de WhatsApp, aviso legal y copyright.',
  },
];

export const createPrebuiltBlockSection = (
  blockType: string
): PageBlockSection => {
  const s = () => freshUid('id');

  if (blockType === 'header') {
    return {
      id: freshUid('sec_hdr'),
      name: 'Cabecera de Página (Header)',
      bgColor: '#FFFFFF',
      paddingY: 16,
      paddingTop: 16,
      paddingBottom: 16,
      paddingLeft: 24,
      paddingRight: 24,
      borderBottomWidth: 1,
      borderColor: '#E4E4E7',
      rows: [
        {
          id: freshUid('row_hdr'),
          name: 'Barra de Navegación',
          widthType: 'boxed',
          maxWidth: 1200,
          columns: [
            {
              id: freshUid('col_hdr_brand'),
              widthPercentage: 32,
              elements: [
                {
                  id: s(),
                  type: 'heading',
                  content: { text: '✦ MiNegocio Pro', level: 'h3' },
                  styles: {
                    fontSize: 20,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    marginBottom: 2,
                    marginTop: 0,
                    textAlign: 'left',
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: { text: 'Soluciones Digitales de Alta Conversión' },
                  styles: {
                    fontSize: 11,
                    fontFamily: 'Inter',
                    textColor: '#71717A',
                    marginBottom: 0,
                    marginTop: 0,
                    textAlign: 'left',
                  },
                },
              ],
            },
            {
              id: freshUid('col_hdr_nav'),
              widthPercentage: 40,
              elements: [
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'Inicio   •   Servicios   •   Testimonios   •   Contacto',
                  },
                  styles: {
                    fontSize: 13,
                    fontFamily: 'Inter',
                    textColor: '#52525B',
                    textAlign: 'center',
                    isBold: false,
                    marginBottom: 0,
                    marginTop: 10,
                  },
                },
              ],
            },
            {
              id: freshUid('col_hdr_cta'),
              widthPercentage: 28,
              elements: [
                {
                  id: s(),
                  type: 'button',
                  content: { buttonText: '👉 Agendar Llamada' },
                  styles: {
                    fontSize: 13,
                    fontFamily: 'Poppins',
                    textColor: '#FFFFFF',
                    bgColor: '#2848F0',
                    isBold: true,
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderRadius: 8,
                    textAlign: 'right',
                    marginBottom: 0,
                  },
                },
              ],
            },
          ],
        },
      ],
    };
  }

  if (blockType === 'footer') {
    return {
      id: freshUid('sec_ftr'),
      name: 'Pie de Página (Footer)',
      bgColor: '#09090B',
      paddingY: 48,
      paddingTop: 48,
      paddingBottom: 36,
      paddingLeft: 24,
      paddingRight: 24,
      borderTopWidth: 1,
      borderColor: '#27272A',
      rows: [
        {
          id: freshUid('row_ftr_main'),
          name: 'Contenido Principal Footer',
          widthType: 'boxed',
          maxWidth: 1200,
          marginBottom: 20,
          columns: [
            {
              id: freshUid('col_ftr_info'),
              widthPercentage: 40,
              elements: [
                {
                  id: s(),
                  type: 'heading',
                  content: { text: '✦ MiNegocio Pro', level: 'h3' },
                  styles: {
                    fontSize: 18,
                    fontFamily: 'Poppins',
                    textColor: '#FFFFFF',
                    isBold: true,
                    marginBottom: 8,
                    marginTop: 0,
                    textAlign: 'left',
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'Ayudamos a profesionales, consultores y empresas a escalar sus resultados con sistemas predecibles y tecnología de vanguardia.',
                  },
                  styles: {
                    fontSize: 13,
                    fontFamily: 'Inter',
                    textColor: '#94A3B8',
                    lineHeight: 1.6,
                    marginBottom: 12,
                    marginTop: 0,
                    textAlign: 'left',
                  },
                },
                {
                  id: s(),
                  type: 'subheading',
                  content: { text: '✉️ Contacto: soporte@minegocio.com' },
                  styles: {
                    fontSize: 12,
                    fontFamily: 'Inter',
                    textColor: '#CBD5E1',
                    marginBottom: 0,
                    marginTop: 0,
                    textAlign: 'left',
                  },
                },
              ],
            },
            {
              id: freshUid('col_ftr_links'),
              widthPercentage: 30,
              elements: [
                {
                  id: s(),
                  type: 'subheading',
                  content: { text: 'ENLACES RÁPIDOS' },
                  styles: {
                    fontSize: 11,
                    fontFamily: 'Inter',
                    textColor: '#64748B',
                    isBold: true,
                    letterSpacing: 1,
                    marginBottom: 8,
                    marginTop: 0,
                    textAlign: 'left',
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: '• Página Principal\n• Método y Beneficios\n• Casos de Éxito\n• Preguntas Frecuentes',
                  },
                  styles: {
                    fontSize: 13,
                    fontFamily: 'Inter',
                    textColor: '#E2E8F0',
                    lineHeight: 1.8,
                    marginBottom: 0,
                    marginTop: 0,
                    textAlign: 'left',
                  },
                },
              ],
            },
            {
              id: freshUid('col_ftr_cta'),
              widthPercentage: 30,
              elements: [
                {
                  id: s(),
                  type: 'subheading',
                  content: { text: 'ATENCIÓN AL CLIENTE' },
                  styles: {
                    fontSize: 11,
                    fontFamily: 'Inter',
                    textColor: '#64748B',
                    isBold: true,
                    letterSpacing: 1,
                    marginBottom: 8,
                    marginTop: 0,
                    textAlign: 'left',
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: '¿Tienes preguntas o requieres asistencia personalizada? Estamos a un mensaje de distancia.',
                  },
                  styles: {
                    fontSize: 13,
                    fontFamily: 'Inter',
                    textColor: '#94A3B8',
                    lineHeight: 1.5,
                    marginBottom: 14,
                    marginTop: 0,
                    textAlign: 'left',
                  },
                },
                {
                  id: s(),
                  type: 'button',
                  content: { buttonText: '💬 Contactar por WhatsApp' },
                  styles: {
                    fontSize: 13,
                    fontFamily: 'Poppins',
                    textColor: '#FFFFFF',
                    bgColor: '#22C55E',
                    isBold: true,
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 18,
                    paddingRight: 18,
                    borderRadius: 8,
                    textAlign: 'center',
                    marginBottom: 0,
                  },
                },
              ],
            },
          ],
        },
        {
          id: freshUid('row_ftr_legal'),
          name: 'Avisos Legales y Derechos',
          widthType: 'boxed',
          maxWidth: 1200,
          columns: [
            {
              id: freshUid('col_ftr_legal'),
              widthPercentage: 100,
              elements: [
                {
                  id: s(),
                  type: 'divider',
                  content: {},
                  styles: {
                    borderColor: '#27272A',
                    marginTop: 16,
                    marginBottom: 20,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'Este sitio web no forma parte de Facebook™ ni Google™. Facebook es una marca registrada de Meta, Inc.\n\n© 2026 MiNegocio Pro. Todos los derechos reservados. | Políticas de Privacidad | Términos y Condiciones | Aviso Legal',
                  },
                  styles: {
                    fontSize: 11,
                    fontFamily: 'Inter',
                    textColor: '#64748B',
                    textAlign: 'center',
                    lineHeight: 1.6,
                    marginBottom: 0,
                    marginTop: 0,
                  },
                },
              ],
            },
          ],
        },
      ],
    };
  }

  if (blockType === 'vsl') {
    return {
      id: freshUid('sec_vsl'),
      name: 'Bloque VSL con Video',
      bgColor: '#FAFAFB',
      paddingY: 48,
      rows: [
        {
          id: freshUid('row_vsl'),
          columns: [
            {
              id: freshUid('col_vsl'),
              widthPercentage: 100,
              elements: [
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: 'Descubre el Método Exacto de 3 Fases en Este Video',
                    level: 'h2',
                  },
                  styles: {
                    fontSize: 30,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    textAlign: 'center',
                    marginBottom: 16,
                    marginTop: 0,
                  },
                },
                {
                  id: s(),
                  type: 'video',
                  content: {
                    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                  },
                  styles: { maxWidth: '750px', marginBottom: 24, marginTop: 0 },
                },
                {
                  id: s(),
                  type: 'button',
                  content: {
                    buttonText: '👉 Solicitar Mi Sesión de Diagnóstico Gratis',
                  },
                  styles: {
                    fontSize: 17,
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
                  },
                },
              ],
            },
          ],
        },
      ],
    };
  }

  if (blockType === 'testimonials') {
    return {
      id: freshUid('sec_test'),
      name: 'Testimonios y Prueba Social',
      bgColor: '#FFFFFF',
      paddingY: 44,
      rows: [
        {
          id: freshUid('row_test_title'),
          columns: [
            {
              id: freshUid('col_test_t'),
              widthPercentage: 100,
              elements: [
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: 'Resultados Comprobados de Clientes Reales',
                    level: 'h2',
                  },
                  styles: {
                    fontSize: 26,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    textAlign: 'center',
                    marginBottom: 28,
                    marginTop: 0,
                  },
                },
              ],
            },
          ],
        },
        {
          id: freshUid('row_test_cols'),
          columns: [
            {
              id: freshUid('col_t1'),
              widthPercentage: 50,
              elements: [
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: '"Logramos llenar nuestro calendario con 14 llamadas estratégicas en las primeras dos semanas sin invertir un solo centavo extra en pauta."',
                  },
                  styles: {
                    fontSize: 15,
                    fontFamily: 'Inter',
                    textColor: '#121111',
                    isItalic: true,
                    marginBottom: 8,
                    marginTop: 0,
                  },
                },
                {
                  id: s(),
                  type: 'subheading',
                  content: { text: '— Martín Estrada, Consultor Financiero' },
                  styles: {
                    fontSize: 13,
                    fontFamily: 'Inter',
                    textColor: '#2848F0',
                    isBold: true,
                  },
                },
              ],
            },
            {
              id: freshUid('col_t2'),
              widthPercentage: 50,
              elements: [
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: '"Antes tenía todo regado entre Calendly, formularios y hojas de Excel. Con Scale Sales Pro centralicé todo y duplicamos las conversiones."',
                  },
                  styles: {
                    fontSize: 15,
                    fontFamily: 'Inter',
                    textColor: '#121111',
                    isItalic: true,
                    marginBottom: 8,
                    marginTop: 0,
                  },
                },
                {
                  id: s(),
                  type: 'subheading',
                  content: { text: '— Andrea Morales, Coach Ejecutiva' },
                  styles: {
                    fontSize: 13,
                    fontFamily: 'Inter',
                    textColor: '#2848F0',
                    isBold: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    };
  }

  if (blockType === 'offer') {
    return {
      id: freshUid('sec_offer'),
      name: 'Presentación de la Oferta y Stack de Valor',
      bgColor: '#FFFFFF',
      paddingY: 52,
      rows: [
        {
          id: freshUid('row_off_title'),
          columns: [
            {
              id: freshUid('col_off_t'),
              widthPercentage: 100,
              elements: [
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: 'Todo Lo Que Recibes Al Unirte Hoy',
                    level: 'h2',
                  },
                  styles: {
                    fontSize: 30,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    textAlign: 'center',
                    marginBottom: 8,
                    marginTop: 0,
                  },
                },
                {
                  id: s(),
                  type: 'subheading',
                  content: {
                    text: 'Un sistema llave en mano probado para captar, calificar y cerrar clientes de alto valor.',
                  },
                  styles: {
                    fontSize: 16,
                    fontFamily: 'Inter',
                    textColor: '#5B5B66',
                    textAlign: 'center',
                    marginBottom: 32,
                  },
                },
              ],
            },
          ],
        },
        {
          id: freshUid('row_off_body'),
          columns: [
            {
              id: freshUid('col_off_img'),
              widthPercentage: 45,
              elements: [
                {
                  id: s(),
                  type: 'image',
                  content: {
                    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
                    alt: 'Stack de la Oferta',
                  },
                  styles: {
                    maxWidth: '100%',
                    borderRadius: 12,
                    marginBottom: 12,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: '✨ Acceso instantáneo a la plataforma y todos los recursos descargables.',
                  },
                  styles: {
                    fontSize: 13,
                    fontFamily: 'Inter',
                    textColor: '#5B5B66',
                    isItalic: true,
                    textAlign: 'center',
                  },
                },
              ],
            },
            {
              id: freshUid('col_off_list'),
              widthPercentage: 55,
              elements: [
                {
                  id: s(),
                  type: 'subheading',
                  content: { text: 'Desglose detallado del paquete:' },
                  styles: {
                    fontSize: 18,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    marginBottom: 12,
                  },
                },
                {
                  id: s(),
                  type: 'bullet_list',
                  content: {
                    items: [
                      '📦 Sistema de Captación High-Ticket Paso a Paso (Valor: $1,497 USD)',
                      '📋 Plantillas de Cartas de Ventas y Embudos Listos (Valor: $997 USD)',
                      '⚡ Plataforma Scale Sales Pro con CRM y Calendario (Valor: $1,200 USD)',
                      '🎯 Sesiones Semanales de Mentoría Estratégica en Vivo (Valor: $2,500 USD)',
                    ],
                  },
                  styles: { marginBottom: 16 },
                },
                {
                  id: s(),
                  type: 'divider',
                  content: {},
                  styles: { marginBottom: 14 },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'Valor Total Acumulado: $6,194 USD. Tu inversión hoy: Solo una fracción con precio de lanzamiento.',
                  },
                  styles: {
                    fontSize: 15,
                    fontFamily: 'Poppins',
                    textColor: '#2848F0',
                    isBold: true,
                    marginBottom: 16,
                  },
                },
                {
                  id: s(),
                  type: 'button',
                  content: {
                    buttonText: '👉 Quiero Mi Acceso Completo a la Oferta',
                  },
                  styles: {
                    fontSize: 16,
                    fontFamily: 'Poppins',
                    textColor: '#FFFFFF',
                    bgColor: '#2848F0',
                    isBold: true,
                    paddingTop: 16,
                    paddingBottom: 16,
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
    };
  }

  if (blockType === 'fascinations') {
    return {
      id: freshUid('sec_fasc'),
      name: 'Bullets de Fascinación y Beneficios',
      bgColor: '#F8FAFC',
      paddingY: 48,
      rows: [
        {
          id: freshUid('row_fasc_title'),
          columns: [
            {
              id: freshUid('col_fasc_t'),
              widthPercentage: 100,
              elements: [
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: 'Esto Es Exactamente Lo Que Descubrirás Dentro',
                    level: 'h2',
                  },
                  styles: {
                    fontSize: 28,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    textAlign: 'center',
                    marginBottom: 8,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'Estrategias de respuesta directa probadas para eliminar la fricción y multiplicar prospectos.',
                  },
                  styles: {
                    fontSize: 15,
                    fontFamily: 'Inter',
                    textColor: '#5B5B66',
                    textAlign: 'center',
                    marginBottom: 30,
                  },
                },
              ],
            },
          ],
        },
        {
          id: freshUid('row_fasc_cols'),
          columns: [
            {
              id: freshUid('col_fasc_1'),
              widthPercentage: 50,
              elements: [
                {
                  id: s(),
                  type: 'bullet_list',
                  content: {
                    items: [
                      '🎯 El secreto de 3 fases para transformar tráfico frío en prospectos ansiosos por agendar.',
                      '🎯 Por qué los embudos tradicionales fallan y cómo este modelo duplica la asistencia.',
                      '🎯 La estructura de guion de 12 minutos que hace que el prospecto se autocalifique solo.',
                    ],
                  },
                  styles: { marginBottom: 16 },
                },
              ],
            },
            {
              id: freshUid('col_fasc_2'),
              widthPercentage: 50,
              elements: [
                {
                  id: s(),
                  type: 'bullet_list',
                  content: {
                    items: [
                      '🎯 Cómo filtrar curiosos y hablar exclusivamente con clientes con presupuesto real.',
                      '🎯 Automatizaciones nativas de seguimiento por WhatsApp para reducir el absentismo al 10%.',
                      '🎯 El proceso exacto para escalar sin tener que trabajar 14 horas apagando incendios.',
                    ],
                  },
                  styles: { marginBottom: 16 },
                },
              ],
            },
          ],
        },
      ],
    };
  }

  if (blockType === 'guarantee') {
    return {
      id: freshUid('sec_guar'),
      name: 'Garantía 100% Incondicional',
      bgColor: '#FFFFFF',
      paddingY: 44,
      rows: [
        {
          id: freshUid('row_guar'),
          columns: [
            {
              id: freshUid('col_guar_badge'),
              widthPercentage: 25,
              elements: [
                {
                  id: s(),
                  type: 'image',
                  content: {
                    src: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
                    alt: 'Garantía Incondicional',
                  },
                  styles: {
                    maxWidth: '170px',
                    borderRadius: 99,
                    textAlign: 'center',
                    marginBottom: 12,
                  },
                },
              ],
            },
            {
              id: freshUid('col_guar_text'),
              widthPercentage: 75,
              elements: [
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: 'Nuestra Garantía Incondicional de 30 Días: Cero Riesgo Para Ti',
                    level: 'h3',
                  },
                  styles: {
                    fontSize: 22,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    marginBottom: 10,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'Prueba todo el sistema durante 30 días enteros. Si aplicas los pasos y sientes que no estás consiguiendo prospectos más calificados, o si simplemente no estás 100% fascinado con la experiencia, solo escríbenos y te reembolsaremos la totalidad de tu inversión de inmediato.',
                  },
                  styles: {
                    fontSize: 14,
                    fontFamily: 'Inter',
                    textColor: '#5B5B66',
                    marginBottom: 10,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: '🔒 Sin preguntas incómodas, sin resentimientos. Toda la responsabilidad recae sobre nosotros.',
                  },
                  styles: {
                    fontSize: 14,
                    fontFamily: 'Inter',
                    textColor: '#059669',
                    isBold: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    };
  }

  if (blockType === 'comparison') {
    return {
      id: freshUid('sec_comp'),
      name: 'Comparativa: Método Antiguo vs Scale Sales Pro',
      bgColor: '#F4F4F5',
      paddingY: 48,
      rows: [
        {
          id: freshUid('row_comp_title'),
          columns: [
            {
              id: freshUid('col_comp_t'),
              widthPercentage: 100,
              elements: [
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: '¿Por Qué Este Enfoque Es Radicalmente Diferente?',
                    level: 'h2',
                  },
                  styles: {
                    fontSize: 28,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    textAlign: 'center',
                    marginBottom: 32,
                  },
                },
              ],
            },
          ],
        },
        {
          id: freshUid('row_comp_cols'),
          columns: [
            {
              id: freshUid('col_comp_old'),
              widthPercentage: 50,
              elements: [
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: '❌ El Método Antiguo y Disperso',
                    level: 'h3',
                  },
                  styles: {
                    fontSize: 18,
                    fontFamily: 'Poppins',
                    textColor: '#DC2626',
                    isBold: true,
                    marginBottom: 12,
                  },
                },
                {
                  id: s(),
                  type: 'bullet_list',
                  content: {
                    items: [
                      'Múltiples herramientas inconexas (ClickFunnels + Calendly + Zapier + Excel)',
                      'Leads que se pierden por fallas en webhooks o automatizaciones caídas',
                      'Llamadas eternas con personas sin presupuesto ni poder de decisión',
                      'Costos acumulados de cientos de dólares al mes en suscripciones',
                    ],
                  },
                  styles: { marginBottom: 16 },
                },
              ],
            },
            {
              id: freshUid('col_comp_new'),
              widthPercentage: 50,
              elements: [
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: '🚀 El Sistema Integrado Scale Sales Pro',
                    level: 'h3',
                  },
                  styles: {
                    fontSize: 18,
                    fontFamily: 'Poppins',
                    textColor: '#16A34A',
                    isBold: true,
                    marginBottom: 12,
                  },
                },
                {
                  id: s(),
                  type: 'bullet_list',
                  content: {
                    items: [
                      'Todo en una sola suite centralizada: Embudos, Calificación, CRM y Agenda',
                      'Lead scoring automático en tiempo real según respuestas clave',
                      'Solo atiendes reuniones con prospectos calificados con dinero listo',
                      'Ahorro del 70% en costos de software y cero configuración técnica',
                    ],
                  },
                  styles: { marginBottom: 16 },
                },
              ],
            },
          ],
        },
      ],
    };
  }

  if (blockType === 'bio') {
    return {
      id: freshUid('sec_bio'),
      name: 'Sobre el Autor / Quién Soy',
      bgColor: '#FFFFFF',
      paddingY: 48,
      rows: [
        {
          id: freshUid('row_bio'),
          columns: [
            {
              id: freshUid('col_bio_img'),
              widthPercentage: 35,
              elements: [
                {
                  id: s(),
                  type: 'image',
                  content: {
                    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
                    alt: 'Mentor / Fundador',
                  },
                  styles: {
                    maxWidth: '100%',
                    borderRadius: 16,
                    marginBottom: 12,
                  },
                },
              ],
            },
            {
              id: freshUid('col_bio_content'),
              widthPercentage: 65,
              elements: [
                {
                  id: s(),
                  type: 'subheading',
                  content: { text: 'CONOCE A TU GUÍA ESTRATÉGICO' },
                  styles: {
                    fontSize: 12,
                    fontFamily: 'Poppins',
                    textColor: '#2848F0',
                    isBold: true,
                    marginBottom: 6,
                  },
                },
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: '¿Quién Diseñó Este Sistema Comercial?',
                    level: 'h2',
                  },
                  styles: {
                    fontSize: 26,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    marginBottom: 14,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'Durante los últimos 6 años he asesorado a más de 300 consultores, agencias y proveedores de servicios B2B, ayudándolos a generar millones de dólares en ventas mediante embudos de respuesta directa.',
                  },
                  styles: {
                    fontSize: 14,
                    fontFamily: 'Inter',
                    textColor: '#5B5B66',
                    marginBottom: 10,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'Diseñé Scale Sales Pro porque vi que la gran mayoría de emprendedores no fracasa por su producto, sino por la falta de un sistema predecible que transforme el interés en ventas reales.',
                  },
                  styles: {
                    fontSize: 14,
                    fontFamily: 'Inter',
                    textColor: '#5B5B66',
                    marginBottom: 18,
                  },
                },
                {
                  id: s(),
                  type: 'button',
                  content: { buttonText: 'Conoce Más y Solicita Tu Sesión' },
                  styles: {
                    fontSize: 14,
                    fontFamily: 'Poppins',
                    textColor: '#FFFFFF',
                    bgColor: '#1C1C1C',
                    borderRadius: 8,
                  },
                },
              ],
            },
          ],
        },
      ],
    };
  }

  if (blockType === 'bonuses') {
    return {
      id: freshUid('sec_bonuses'),
      name: 'Bonos Exclusivos de Acción Rápida',
      bgColor: '#FAF5FF',
      paddingY: 48,
      rows: [
        {
          id: freshUid('row_bon_title'),
          columns: [
            {
              id: freshUid('col_bon_t'),
              widthPercentage: 100,
              elements: [
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: 'Bonos Exclusivos si Tomas Acción Hoy',
                    level: 'h2',
                  },
                  styles: {
                    fontSize: 28,
                    fontFamily: 'Poppins',
                    textColor: '#581C87',
                    isBold: true,
                    textAlign: 'center',
                    marginBottom: 8,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'Aceleradores tácticos para que obtengas resultados aún más rápido sin costo adicional.',
                  },
                  styles: {
                    fontSize: 15,
                    fontFamily: 'Inter',
                    textColor: '#7E22CE',
                    textAlign: 'center',
                    marginBottom: 32,
                  },
                },
              ],
            },
          ],
        },
        {
          id: freshUid('row_bon_cards'),
          columns: [
            {
              id: freshUid('col_bon_1'),
              widthPercentage: 33.33,
              elements: [
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: '🎁 Bono #1: Bóveda de Scripts',
                    level: 'h3',
                  },
                  styles: {
                    fontSize: 16,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    marginBottom: 8,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'Preguntas exactas palabra por palabra para cerrar en llamadas sin sonar invasivo.',
                  },
                  styles: {
                    fontSize: 13,
                    fontFamily: 'Inter',
                    textColor: '#5B5B66',
                    marginBottom: 10,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: { text: 'Valor: $497 USD (¡GRATIS HOY!)' },
                  styles: {
                    fontSize: 13,
                    fontFamily: 'Poppins',
                    textColor: '#2848F0',
                    isBold: true,
                  },
                },
              ],
            },
            {
              id: freshUid('col_bon_2'),
              widthPercentage: 33.33,
              elements: [
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: '🎁 Bono #2: Secuencias WhatsApp',
                    level: 'h3',
                  },
                  styles: {
                    fontSize: 16,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    marginBottom: 8,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'Plantillas de recordatorio automatizado para asegurar una asistencia del 85%.',
                  },
                  styles: {
                    fontSize: 13,
                    fontFamily: 'Inter',
                    textColor: '#5B5B66',
                    marginBottom: 10,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: { text: 'Valor: $297 USD (¡GRATIS HOY!)' },
                  styles: {
                    fontSize: 13,
                    fontFamily: 'Poppins',
                    textColor: '#2848F0',
                    isBold: true,
                  },
                },
              ],
            },
            {
              id: freshUid('col_bon_3'),
              widthPercentage: 33.33,
              elements: [
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: '🎁 Bono #3: Plantillas de Copy',
                    level: 'h3',
                  },
                  styles: {
                    fontSize: 16,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    marginBottom: 8,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'Estructuras de alta conversión para tus titulares, correos y páginas de captura.',
                  },
                  styles: {
                    fontSize: 13,
                    fontFamily: 'Inter',
                    textColor: '#5B5B66',
                    marginBottom: 10,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: { text: 'Valor: $397 USD (¡GRATIS HOY!)' },
                  styles: {
                    fontSize: 13,
                    fontFamily: 'Poppins',
                    textColor: '#2848F0',
                    isBold: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    };
  }

  if (blockType === 'faq') {
    return {
      id: freshUid('sec_faq'),
      name: 'Preguntas Frecuentes y Objeciones',
      bgColor: '#FFFFFF',
      paddingY: 48,
      rows: [
        {
          id: freshUid('row_faq_title'),
          columns: [
            {
              id: freshUid('col_faq_t'),
              widthPercentage: 100,
              elements: [
                {
                  id: s(),
                  type: 'heading',
                  content: { text: 'Preguntas Frecuentes', level: 'h2' },
                  styles: {
                    fontSize: 28,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    textAlign: 'center',
                    marginBottom: 8,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'Respuestas directas a las dudas más comunes de nuestros miembros.',
                  },
                  styles: {
                    fontSize: 15,
                    fontFamily: 'Inter',
                    textColor: '#5B5B66',
                    textAlign: 'center',
                    marginBottom: 32,
                  },
                },
              ],
            },
          ],
        },
        {
          id: freshUid('row_faq_items'),
          columns: [
            {
              id: freshUid('col_faq_body'),
              widthPercentage: 100,
              elements: [
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: '❓ ¿Necesito saber de programación o diseño web?',
                    level: 'h3',
                  },
                  styles: {
                    fontSize: 16,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    marginBottom: 6,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'Para nada. La plataforma fue creada para que cualquier usuario pueda editar textos, fondos, colores, bloques y formularios simplemente haciendo clic o arrastrando elementos.',
                  },
                  styles: {
                    fontSize: 14,
                    fontFamily: 'Inter',
                    textColor: '#5B5B66',
                    marginBottom: 20,
                  },
                },
                {
                  id: s(),
                  type: 'divider',
                  content: {},
                  styles: { marginBottom: 18 },
                },
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: '❓ ¿Cómo funciona la calificación automática de prospectos?',
                    level: 'h3',
                  },
                  styles: {
                    fontSize: 16,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    marginBottom: 6,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'El cuestionario pondera respuestas de facturación, presupuesto y urgencia. Quienes alcanzan el puntaje mínimo acceden de inmediato a tu calendario; los demás son filtrados con cortesía.',
                  },
                  styles: {
                    fontSize: 14,
                    fontFamily: 'Inter',
                    textColor: '#5B5B66',
                    marginBottom: 20,
                  },
                },
                {
                  id: s(),
                  type: 'divider',
                  content: {},
                  styles: { marginBottom: 18 },
                },
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: '❓ ¿En cuánto tiempo puedo tener mi embudo al aire?',
                    level: 'h3',
                  },
                  styles: {
                    fontSize: 16,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    marginBottom: 6,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'Con las plantillas y bloques prearmados de Scale Sales Pro, la mayoría de nuestros clientes tienen su embudo completo publicado en menos de una tarde.',
                  },
                  styles: {
                    fontSize: 14,
                    fontFamily: 'Inter',
                    textColor: '#5B5B66',
                    marginBottom: 24,
                  },
                },
                {
                  id: s(),
                  type: 'button',
                  content: { buttonText: '👉 Agendar Mi Sesión Estratégica' },
                  styles: {
                    fontSize: 15,
                    fontFamily: 'Poppins',
                    textColor: '#FFFFFF',
                    bgColor: '#2848F0',
                    isBold: true,
                    textAlign: 'center',
                  },
                },
              ],
            },
          ],
        },
      ],
    };
  }

  if (blockType === 'urgency') {
    return {
      id: freshUid('sec_urg'),
      name: 'Urgencia y Plazas Limitadas',
      bgColor: '#09090B',
      paddingY: 48,
      rows: [
        {
          id: freshUid('row_urg'),
          columns: [
            {
              id: freshUid('col_urg_1'),
              widthPercentage: 100,
              elements: [
                {
                  id: s(),
                  type: 'subheading',
                  content: {
                    text: '⚠️ ATENCIÓN: PLAZAS LIMITADAS PARA ESTE MES',
                  },
                  styles: {
                    fontSize: 12,
                    fontFamily: 'Poppins',
                    textColor: '#F59E0B',
                    isBold: true,
                    textAlign: 'center',
                    marginBottom: 8,
                  },
                },
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: 'Solo Aceptamos 15 Clientes Nuevos Este Mes',
                    level: 'h2',
                  },
                  styles: {
                    fontSize: 28,
                    fontFamily: 'Poppins',
                    textColor: '#FFFFFF',
                    isBold: true,
                    textAlign: 'center',
                    marginBottom: 14,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'Para asegurar la máxima calidad de atención y acompañamiento personalizado a cada uno de nuestros clientes, cerramos admisiones una vez alcanzado el cupo máximo de 15 nuevas cuentas.',
                  },
                  styles: {
                    fontSize: 15,
                    fontFamily: 'Inter',
                    textColor: '#A1A1AA',
                    textAlign: 'center',
                    marginBottom: 24,
                  },
                },
                {
                  id: s(),
                  type: 'button',
                  content: {
                    buttonText: '⚡ Asegurar Mi Cupo Antes de que se Agote',
                  },
                  styles: {
                    fontSize: 16,
                    fontFamily: 'Poppins',
                    textColor: '#09090B',
                    bgColor: '#F59E0B',
                    isBold: true,
                    paddingTop: 16,
                    paddingBottom: 16,
                    paddingLeft: 32,
                    paddingRight: 32,
                    borderRadius: 8,
                    textAlign: 'center',
                  },
                },
              ],
            },
          ],
        },
      ],
    };
  }

  // Default CTA Block
  return {
    id: freshUid('sec_cta'),
    name: 'Llamada a la Acción de Cierre',
    bgColor: '#1C1C1C',
    paddingY: 48,
    rows: [
      {
        id: freshUid('row_cta'),
        columns: [
          {
            id: freshUid('col_cta'),
            widthPercentage: 100,
            elements: [
              {
                id: s(),
                type: 'heading',
                content: {
                  text: '¿Listo Para Multiplicar Tus Citas Calificadas?',
                  level: 'h2',
                },
                styles: {
                  fontSize: 30,
                  fontFamily: 'Poppins',
                  textColor: '#FFFFFF',
                  isBold: true,
                  textAlign: 'center',
                  marginBottom: 12,
                  marginTop: 0,
                },
              },
              {
                id: s(),
                type: 'paragraph',
                content: {
                  text: 'Las plazas para este mes son limitadas. Agenda hoy antes de que se agoten los horarios.',
                },
                styles: {
                  fontSize: 16,
                  fontFamily: 'Inter',
                  textColor: '#A1A1AA',
                  textAlign: 'center',
                  marginBottom: 24,
                  marginTop: 0,
                },
              },
              {
                id: s(),
                type: 'button',
                content: {
                  buttonText: '⚡ Reservar Mi Espacio Ahora Mismo',
                },
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
                },
              },
            ],
          },
        ],
      },
    ],
  };
};

export const DEFAULT_POPUP_SETTINGS: Required<PopupWindowSettings> = {
  maxWidth: 560,
  overlayOpacity: 68,
  closeOnBackdropClick: true,
  closeBtnPosition: 'inside',
  closeBtnOffsetX: 0,
  closeBtnOffsetY: 0,
  closeBtnSize: 32,
  closeBtnShape: 'circle',
  closeBtnBgColor: '#18181B',
  closeBtnIconColor: '#FFFFFF',
  showTopProgressBar: false,
  progressBarPercent: 50,
  progressBarText: 'Paso 1 de 2: Casi listo — Completa tus datos abajo',
  progressBarColor: '#2848F0',
  progressBarTextColor: '#FFFFFF',
};

export const resolvePopupSettings = (
  settings?: PopupWindowSettings
): Required<PopupWindowSettings> => ({
  maxWidth: settings?.maxWidth ?? DEFAULT_POPUP_SETTINGS.maxWidth,
  overlayOpacity: settings?.overlayOpacity ?? DEFAULT_POPUP_SETTINGS.overlayOpacity,
  closeOnBackdropClick:
    settings?.closeOnBackdropClick ?? DEFAULT_POPUP_SETTINGS.closeOnBackdropClick,
  closeBtnPosition:
    settings?.closeBtnPosition ?? DEFAULT_POPUP_SETTINGS.closeBtnPosition,
  closeBtnOffsetX: settings?.closeBtnOffsetX ?? DEFAULT_POPUP_SETTINGS.closeBtnOffsetX,
  closeBtnOffsetY: settings?.closeBtnOffsetY ?? DEFAULT_POPUP_SETTINGS.closeBtnOffsetY,
  closeBtnSize: settings?.closeBtnSize ?? DEFAULT_POPUP_SETTINGS.closeBtnSize,
  closeBtnShape: settings?.closeBtnShape ?? DEFAULT_POPUP_SETTINGS.closeBtnShape,
  closeBtnBgColor: settings?.closeBtnBgColor ?? DEFAULT_POPUP_SETTINGS.closeBtnBgColor,
  closeBtnIconColor:
    settings?.closeBtnIconColor ?? DEFAULT_POPUP_SETTINGS.closeBtnIconColor,
  showTopProgressBar:
    settings?.showTopProgressBar ?? DEFAULT_POPUP_SETTINGS.showTopProgressBar,
  progressBarPercent:
    settings?.progressBarPercent ?? DEFAULT_POPUP_SETTINGS.progressBarPercent,
  progressBarText: settings?.progressBarText ?? DEFAULT_POPUP_SETTINGS.progressBarText,
  progressBarColor:
    settings?.progressBarColor ?? DEFAULT_POPUP_SETTINGS.progressBarColor,
  progressBarTextColor:
    settings?.progressBarTextColor ?? DEFAULT_POPUP_SETTINGS.progressBarTextColor,
});

export const computePopupCloseButtonStyle = (
  settings?: PopupWindowSettings
): CSSProperties => {
  const s = resolvePopupSettings(settings);
  const size = s.closeBtnSize;
  const baseTop =
    s.closeBtnPosition === 'edge'
      ? -Math.round(size / 2)
      : s.closeBtnPosition === 'outside'
      ? -(size + 10)
      : 12;
  const baseRight =
    s.closeBtnPosition === 'edge'
      ? -Math.round(size / 2)
      : s.closeBtnPosition === 'outside'
      ? 0
      : 12;
  const borderRadius =
    s.closeBtnShape === 'circle'
      ? '9999px'
      : s.closeBtnShape === 'rounded'
      ? '8px'
      : '0px';

  return {
    top: `${baseTop + s.closeBtnOffsetY}px`,
    right: `${baseRight - s.closeBtnOffsetX}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius,
    backgroundColor: s.closeBtnBgColor,
    color: s.closeBtnIconColor,
  };
};

export const createBlankPopupSections = (): PageBlockSection[] => {
  const s = () => freshUid('pop');
  return [
    {
      id: s(),
      name: 'Sección Principal Pop-up',
      bgColor: 'transparent',
      paddingTop: 28,
      paddingBottom: 28,
      paddingLeft: 28,
      paddingRight: 28,
      rows: [
        {
          id: s(),
          name: 'Contenedor',
          columns: [
            {
              id: s(),
              widthPercentage: 100,
              elements: [
                {
                  id: s(),
                  type: 'heading',
                  content: {
                    text: '¡Último Paso! Ingresa tus Datos para Continuar',
                    level: 'h2',
                  },
                  styles: {
                    fontSize: 24,
                    fontFamily: 'Poppins',
                    textColor: '#121111',
                    isBold: true,
                    textAlign: 'center',
                    marginBottom: 10,
                  },
                },
                {
                  id: s(),
                  type: 'paragraph',
                  content: {
                    text: 'Completa el formulario a continuación para desbloquear tu acceso inmediato.',
                  },
                  styles: {
                    fontSize: 14,
                    fontFamily: 'Inter',
                    textColor: '#52525B',
                    textAlign: 'center',
                    marginBottom: 18,
                  },
                },
                {
                  id: s(),
                  type: 'simple_form',
                  content: {
                    showNameField: true,
                    showPhoneField: false,
                    submitButtonText: 'Quiero Mi Acceso Ahora →',
                    formSuccessMessage:
                      '¡Excelente! Hemos recibido tus datos correctamente.',
                  },
                  styles: {
                    bgColor: '#2848F0',
                    textColor: '#FFFFFF',
                    borderRadius: 8,
                    marginBottom: 6,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ];
};

export const buildInitialPopupSeeds = (): LibraryItem[] => {
  const nowIso = new Date().toISOString();
  const s = () => freshUid('seedpop');

  const lead2StepPopup: LibraryItem = {
    id: 'lib_pop_lead_2step',
    kind: 'popup',
    name: 'Captura Rápida 2 Pasos (Lead Magnet)',
    category: 'Captura / Leads',
    isFavorite: false,
    isSystemSeed: true,
    pageSettings: {
      pageBgColor: '#FFFFFF',
      pageBorderRadius: 16,
      primaryColor: '#2848F0',
      textColor: '#121111',
      headingFontFamily: 'Poppins',
      bodyFontFamily: 'Inter',
    },
    popupSettings: {
      ...DEFAULT_POPUP_SETTINGS,
      maxWidth: 540,
      closeBtnPosition: 'edge',
      closeBtnSize: 32,
      closeBtnShape: 'circle',
      closeBtnBgColor: '#18181B',
      closeBtnIconColor: '#FFFFFF',
      showTopProgressBar: true,
      progressBarPercent: 50,
      progressBarText: 'Paso 1 de 2: 50% Completado — ¿A dónde enviamos tu acceso?',
      progressBarColor: '#2848F0',
      progressBarTextColor: '#FFFFFF',
    },
    sections: [
      {
        id: s(),
        name: 'Sección Captura 2 Pasos',
        bgColor: 'transparent',
        paddingTop: 28,
        paddingBottom: 28,
        paddingLeft: 28,
        paddingRight: 28,
        rows: [
          {
            id: s(),
            name: 'Contenedor',
            columns: [
              {
                id: s(),
                widthPercentage: 100,
                elements: [
                  {
                    id: s(),
                    type: 'heading',
                    content: {
                      text: 'Ingresa Tu Mejor Correo para Acceder a la Clase Gratuita',
                      level: 'h2',
                    },
                    styles: {
                      fontSize: 23,
                      fontFamily: 'Poppins',
                      textColor: '#111827',
                      isBold: true,
                      textAlign: 'center',
                      marginBottom: 10,
                    },
                  },
                  {
                    id: s(),
                    type: 'paragraph',
                    content: {
                      text: 'Recibirás el enlace privado de acceso + la guía práctica descargable en menos de 60 segundos.',
                    },
                    styles: {
                      fontSize: 14,
                      fontFamily: 'Inter',
                      textColor: '#52525B',
                      textAlign: 'center',
                      marginBottom: 18,
                    },
                  },
                  {
                    id: s(),
                    type: 'simple_form',
                    content: {
                      showNameField: true,
                      showPhoneField: true,
                      submitButtonText: 'Sí, Quiero Ver el Entrenamiento Ahora →',
                      formSuccessMessage:
                        '¡Perfecto! Redirigiendo a tu acceso exclusivo...',
                    },
                    styles: {
                      bgColor: '#2848F0',
                      textColor: '#FFFFFF',
                      borderRadius: 10,
                      marginBottom: 10,
                    },
                  },
                  {
                    id: s(),
                    type: 'paragraph',
                    content: {
                      text: '🔒 Tus datos están 100% protegidos. Cero spam garantizado.',
                    },
                    styles: {
                      fontSize: 12,
                      fontFamily: 'Inter',
                      textColor: '#71717A',
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
    ],
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const exitOfferPopup: LibraryItem = {
    id: 'lib_pop_exit_offer',
    kind: 'popup',
    name: 'Oferta Relámpago / Intención de Salida',
    category: 'Cierre y Urgencia',
    isFavorite: false,
    isSystemSeed: true,
    pageSettings: {
      pageBgColor: '#0F172A',
      pageBorderRadius: 18,
      primaryColor: '#F59E0B',
      textColor: '#F8FAFC',
      headingFontFamily: 'Poppins',
      bodyFontFamily: 'Inter',
    },
    popupSettings: {
      ...DEFAULT_POPUP_SETTINGS,
      maxWidth: 580,
      closeBtnPosition: 'inside',
      closeBtnSize: 32,
      closeBtnShape: 'circle',
      closeBtnBgColor: '#EF4444',
      closeBtnIconColor: '#FFFFFF',
      showTopProgressBar: false,
    },
    sections: [
      {
        id: s(),
        name: 'Sección Oferta de Salida',
        bgColor: 'transparent',
        paddingTop: 32,
        paddingBottom: 30,
        paddingLeft: 30,
        paddingRight: 30,
        rows: [
          {
            id: s(),
            name: 'Contenedor',
            columns: [
              {
                id: s(),
                widthPercentage: 100,
                elements: [
                  {
                    id: s(),
                    type: 'paragraph',
                    content: {
                      text: '⚡ ESPERA UN SEGUNDO — OFERTA ÚNICA ANTES DE SALIR',
                    },
                    styles: {
                      fontSize: 12,
                      fontFamily: 'Poppins',
                      textColor: '#FBBF24',
                      isBold: true,
                      textAlign: 'center',
                      marginBottom: 8,
                    },
                  },
                  {
                    id: s(),
                    type: 'heading',
                    content: {
                      text: '¿Te Vas con las Manos Vacías? Llévate el Bono de Acción Rápida Gratis',
                      level: 'h2',
                    },
                    styles: {
                      fontSize: 24,
                      fontFamily: 'Poppins',
                      textColor: '#FFFFFF',
                      isBold: true,
                      textAlign: 'center',
                      marginBottom: 12,
                    },
                  },
                  {
                    id: s(),
                    type: 'paragraph',
                    content: {
                      text: 'Reclama tu cupón especial y desbloquea la plantilla probada de Scale Sales Pro antes de que el contador llegue a cero.',
                    },
                    styles: {
                      fontSize: 14,
                      fontFamily: 'Inter',
                      textColor: '#CBD5E1',
                      textAlign: 'center',
                      marginBottom: 16,
                    },
                  },
                  {
                    id: s(),
                    type: 'countdown',
                    content: {
                      countdownEndDate: new Date(
                        Date.now() + 2 * 60 * 60 * 1000
                      ).toISOString(),
                      countdownTheme: 'dark',
                    },
                    styles: {
                      textAlign: 'center',
                      marginBottom: 18,
                    },
                  },
                  {
                    id: s(),
                    type: 'inline_form',
                    content: {
                      inlineEmailPlaceholder: 'Ingresa tu mejor correo electrónico...',
                      submitButtonText: 'Reclamar Bono →',
                      inlineFormButtonWidthPercent: 35,
                      inlineFormHeight: 50,
                      inlineFormGap: 0,
                      formSuccessMessage: '¡Cupón reservado! Redirigiendo...',
                    },
                    styles: {
                      bgColor: '#F59E0B',
                      textColor: '#111827',
                      isBold: true,
                      borderRadius: 10,
                      marginBottom: 6,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  return [lead2StepPopup, exitOfferPopup];
};

export const buildInitialLibrarySeed = (): LibraryItem[] => {
  const nowIso = new Date().toISOString();

  const seededTemplates: LibraryItem[] = PAGE_TEMPLATES.map((tpl) => ({
    id: `lib_tpl_${tpl.id}`,
    kind: 'template',
    name: tpl.name,
    category: tpl.category || DEFAULT_LIBRARY_CATEGORY,
    isFavorite: false,
    isSystemSeed: true,
    sections: cloneSectionsWithFreshIds(tpl.sections),
    pageSettings: tpl.pageSettings
      ? JSON.parse(JSON.stringify(tpl.pageSettings))
      : undefined,
    createdAt: nowIso,
    updatedAt: nowIso,
  }));

  const seededBlocks: LibraryItem[] = PREBUILT_BLOCK_DEFS.map((def) => ({
    id: `lib_blk_${def.type}`,
    kind: 'block',
    name: def.cleanName,
    category: def.category || DEFAULT_LIBRARY_CATEGORY,
    isFavorite: false,
    isSystemSeed: true,
    sections: [createPrebuiltBlockSection(def.type)],
    createdAt: nowIso,
    updatedAt: nowIso,
  }));

  return [...seededTemplates, ...seededBlocks, ...buildInitialPopupSeeds()];
};
