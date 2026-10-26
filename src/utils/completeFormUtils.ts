import {
  CompleteFormButtonStyles,
  CompleteFormEmailTarget,
  CompleteFormFieldItem,
  CompleteFormFieldType,
  CompleteFormGlobalFieldStyle,
  CompleteFormPostSubmitActions,
  EmailProvider,
  PageBlockElement,
} from '../types';

export const EMAIL_MARKETING_PROVIDERS: {
  id: EmailProvider;
  name: string;
  accent: string;
  placeholder: string;
}[] = [
  {
    id: 'activecampaign',
    name: 'ActiveCampaign',
    accent: '#004CFF',
    placeholder: 'Ej. Lista Clientes VIP / Tag: Lead_Embudo',
  },
  {
    id: 'getresponse',
    name: 'GetResponse',
    accent: '#00BAFF',
    placeholder: 'Ej. Campaña Masterclass / Tag: Registro',
  },
  {
    id: 'kit',
    name: 'Kit (ConvertKit)',
    accent: '#FB6970',
    placeholder: 'Ej. Formulario Principal / Tag: Interesado',
  },
  {
    id: 'mailerlite',
    name: 'MailerLite',
    accent: '#09C269',
    placeholder: 'Ej. Grupo Suscriptores / Segmento Activo',
  },
  {
    id: 'brevo',
    name: 'Brevo',
    accent: '#0B996E',
    placeholder: 'Ej. Lista Leads #4 / Atributo: Embudo',
  },
];

export const CTA_FORM_BUTTON_ICONS: string[] = [
  'ArrowRight',
  'ArrowLeft',
  'ArrowUpRight',
  'ChevronRight',
  'ExternalLink',
  'Send',
  'CheckCircle',
  'Check',
  'Sparkles',
  'Zap',
  'Rocket',
  'Flame',
  'Play',
  'PlayCircle',
  'Calendar',
  'Clock',
  'Phone',
  'MessageCircle',
  'Mail',
  'Video',
  'ShoppingCart',
  'ShoppingBag',
  'CreditCard',
  'DollarSign',
  'Download',
  'Gift',
  'Lock',
  'ShieldCheck',
  'Award',
  'Star',
  'Heart',
  'ThumbsUp',
  'Users',
  'Eye',
  'Bell',
  'Crown',
];

export const DEFAULT_POLICY_HTML =
  'He leído y acepto las <a href="https://tusitio.com/privacidad" target="_blank" rel="noopener noreferrer">políticas de privacidad</a> y los <a href="https://tusitio.com/terminos" target="_blank" rel="noopener noreferrer">términos y condiciones</a>.';

export const DEFAULT_POLICY_ERROR_TEXT =
  'Debe estar seleccionado y aceptado las políticas para poder enviar.';

export const DEFAULT_NAME_PLACEHOLDER = 'Tu nombre';
export const DEFAULT_EMAIL_PLACEHOLDER = 'Tu mejor email';
export const DEFAULT_SELECT_PLACEHOLDER = 'Elige una alternativa';

const KNOWN_AUTO_PLACEHOLDERS = new Set([
  'tu nombre',
  'tu nombre completo',
  'coloca tu nombre',
  'tu mejor email',
  'coloca tu mejor email',
  'tucorreo@ejemplo.com',
  'escribe aquí...',
  'escribe tu respuesta...',
  'escribe tu mensaje',
  'tu teléfono',
  'tu whatsapp',
  '+51 999 888 777',
  '+52 55 1234 5678',
  'elige una alternativa',
  'selecciona una opción...',
  'selecciona una alternativa',
]);

const NON_SELECT_LEAKED_PLACEHOLDERS = new Set([
  'tu nombre',
  'tu nombre completo',
  'coloca tu nombre',
  'tu mejor email',
  'coloca tu mejor email',
  'tucorreo@ejemplo.com',
  'escribe aquí...',
  'escribe tu respuesta...',
  'escribe tu mensaje',
  'tu teléfono',
  'tu whatsapp',
  '+51 999 888 777',
  '+52 55 1234 5678',
  'selecciona una opción...',
]);

export function isDefaultOrLegacyPlaceholder(value?: string): boolean {
  if (!value) return true;
  return KNOWN_AUTO_PLACEHOLDERS.has(value.trim().toLowerCase());
}

export function getDefaultPlaceholderForField(
  type: CompleteFormFieldType,
  label?: string
): string {
  switch (type) {
    case 'email':
      return DEFAULT_EMAIL_PLACEHOLDER;
    case 'select':
      return DEFAULT_SELECT_PLACEHOLDER;
    case 'text':
      if (!label || /nombre|name/i.test(label)) {
        return DEFAULT_NAME_PLACEHOLDER;
      }
      return 'Escribe aquí...';
    case 'textarea':
      return 'Escribe tu mensaje';
    case 'tel':
      return 'Tu teléfono';
    case 'whatsapp':
      return 'Tu WhatsApp';
    case 'radio':
    case 'checkbox':
    default:
      return '';
  }
}

export function createDefaultCompleteFormFields(): CompleteFormFieldItem[] {
  const ts = Date.now();
  return [
    {
      id: `fld_${ts}_1`,
      type: 'text',
      label: 'Nombre',
      placeholder: DEFAULT_NAME_PLACEHOLDER,
      required: false,
      columnWidth: '100',
    },
    {
      id: `fld_${ts}_2`,
      type: 'email',
      label: 'Email',
      placeholder: DEFAULT_EMAIL_PLACEHOLDER,
      required: true,
      columnWidth: '100',
    },
  ];
}

export function createDefaultGlobalFieldStyle(
  defaultFontFamily: string = 'Inter'
): Required<CompleteFormGlobalFieldStyle> {
  return {
    fontFamily: defaultFontFamily || 'Inter',
    fontSize: 14,
    isBold: false,
    isItalic: false,
    textColor: '#18181B',
    labelColor: '#27272A',
    bgColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#D4D4D8',
    borderRadius: 0,
  };
}

export function createDefaultFormButtonStyles(
  currentText: string = 'Enviar Información',
  currentSubtext: string = '',
  defaultPrimaryColor: string = '#2848F0',
  defaultFontFamily: string = 'Poppins'
): CompleteFormButtonStyles {
  const normalBg = defaultPrimaryColor || '#2848F0';
  return {
    text: currentText,
    subtext: currentSubtext,
    icon: '',
    iconPosition: 'after',
    iconSpacing: 8,
    iconSize: 18,
    paddingY: 14,
    paddingX: 24,
    fontSize: 15,
    fontFamily: defaultFontFamily || 'Poppins',
    textTransform: 'none',
    isBold: true,
    isItalic: false,
    isUnderline: false,
    align: 'center',
    fullWidth: true,
    bgType: 'solid',
    bgColor: normalBg,
    bgColor2: '#1E3A8A',
    textColor: '#FFFFFF',
    borderColor: '#18181B',
    hoverBgColor: undefined,
    hoverTextColor: undefined,
    hoverBorderColor: undefined,
    borderWidth: 0,
    borderStyle: 'solid',
    borderRadius: 0,
  };
}

function sanitizeFormFieldItem(field: CompleteFormFieldItem): CompleteFormFieldItem {
  let placeholder = field.placeholder;
  const trimmedLower = placeholder?.trim().toLowerCase();

  if (field.type === 'email') {
    if (
      placeholder === undefined ||
      trimmedLower === 'tucorreo@ejemplo.com' ||
      trimmedLower === 'coloca tu mejor email'
    ) {
      placeholder = DEFAULT_EMAIL_PLACEHOLDER;
    }
  } else if (field.type === 'text') {
    if (
      trimmedLower === 'tu nombre completo' ||
      trimmedLower === 'coloca tu nombre'
    ) {
      placeholder = DEFAULT_NAME_PLACEHOLDER;
    } else if (placeholder === undefined) {
      placeholder = getDefaultPlaceholderForField('text', field.label);
    }
  } else if (field.type === 'select') {
    if (
      placeholder === undefined ||
      (trimmedLower !== undefined && NON_SELECT_LEAKED_PLACEHOLDERS.has(trimmedLower))
    ) {
      placeholder = DEFAULT_SELECT_PLACEHOLDER;
    }
  } else if (
    (field.type === 'whatsapp' || field.type === 'tel' || field.type === 'textarea') &&
    placeholder === undefined
  ) {
    placeholder = getDefaultPlaceholderForField(field.type, field.label);
  }

  const needsOptions =
    field.type === 'select' || field.type === 'radio' || field.type === 'checkbox';

  return {
    ...field,
    placeholder,
    // Email is ALWAYS required; all other fields respect their boolean flag (default false)
    required: field.type === 'email' ? true : Boolean(field.required),
    optionsText:
      needsOptions && field.optionsText === undefined
        ? 'Opción 1\nOpción 2\nOpción 3'
        : field.optionsText,
  };
}

function ensureMandatoryEmailField(
  list: CompleteFormFieldItem[]
): CompleteFormFieldItem[] {
  const sanitized = list.map(sanitizeFormFieldItem);
  if (sanitized.some((f) => f.type === 'email')) {
    return sanitized;
  }
  const emailField: CompleteFormFieldItem = {
    id: 'mandatory_email',
    type: 'email',
    label: 'Email',
    placeholder: DEFAULT_EMAIL_PLACEHOLDER,
    required: true,
    columnWidth: '100',
  };
  const next = [...sanitized];
  next.splice(Math.min(1, next.length), 0, emailField);
  return next;
}

export function normalizeCompleteFormFields(
  content: PageBlockElement['content']
): CompleteFormFieldItem[] {
  if (Array.isArray(content.formFields)) {
    return ensureMandatoryEmailField(content.formFields);
  }

  const migrated: CompleteFormFieldItem[] = [];

  if (content.showNameField !== false) {
    migrated.push({
      id: 'legacy_name',
      type: 'text',
      label: 'Nombre',
      placeholder: DEFAULT_NAME_PLACEHOLDER,
      required: false,
      columnWidth: '100',
    });
  }

  migrated.push({
    id: 'legacy_email',
    type: 'email',
    label: 'Email',
    placeholder: DEFAULT_EMAIL_PLACEHOLDER,
    required: true,
    columnWidth: '100',
  });

  if (content.showPhoneField) {
    migrated.push({
      id: 'legacy_phone',
      type: 'whatsapp',
      label: 'WhatsApp',
      placeholder: 'Tu WhatsApp',
      required: Boolean(content.phoneRequired),
      columnWidth: '100',
    });
  }

  if (Array.isArray(content.extraFields)) {
    content.extraFields.forEach((extra, idx) => {
      const extraType: CompleteFormFieldType = extra.type || 'text';
      migrated.push({
        id: extra.id || `legacy_extra_${idx}`,
        type: extraType,
        label: extra.label || `Campo ${idx + 1}`,
        placeholder: getDefaultPlaceholderForField(extraType, extra.label),
        required: Boolean(extra.required),
        columnWidth: '100',
        optionsText: Array.isArray(extra.options)
          ? extra.options.join('\n')
          : 'Opción 1\nOpción 2\nOpción 3',
      });
    });
  }

  return ensureMandatoryEmailField(migrated);
}

export function getResolvedGlobalFieldStyle(
  content: PageBlockElement['content'],
  defaultFontFamily: string = 'Inter'
): Required<CompleteFormGlobalFieldStyle> {
  const s = content.formFieldStyles || {};
  return {
    fontFamily: s.fontFamily || defaultFontFamily || 'Inter',
    fontSize: s.fontSize ?? 14,
    isBold: Boolean(s.isBold),
    isItalic: Boolean(s.isItalic),
    textColor: s.textColor || '#18181B',
    labelColor: s.labelColor || '#27272A',
    bgColor: s.bgColor || '#FFFFFF',
    borderWidth: s.borderWidth ?? 1,
    borderStyle: s.borderStyle || 'solid',
    borderColor: s.borderColor || '#D4D4D8',
    borderRadius: s.borderRadius ?? 0,
  };
}

export function getResolvedFieldStyle(
  field: CompleteFormFieldItem,
  globalStyle: Required<CompleteFormGlobalFieldStyle>
): Required<CompleteFormGlobalFieldStyle> {
  const ov = field.styleOverride;
  if (!ov || !ov.enabled) {
    return globalStyle;
  }
  return {
    fontFamily: ov.fontFamily || globalStyle.fontFamily,
    fontSize: ov.fontSize ?? globalStyle.fontSize,
    isBold: ov.isBold ?? globalStyle.isBold,
    isItalic: ov.isItalic ?? globalStyle.isItalic,
    textColor: ov.textColor || globalStyle.textColor,
    labelColor: ov.labelColor || globalStyle.labelColor,
    bgColor: ov.bgColor || globalStyle.bgColor,
    borderWidth: ov.borderWidth ?? globalStyle.borderWidth,
    borderStyle: ov.borderStyle || globalStyle.borderStyle,
    borderColor: ov.borderColor || globalStyle.borderColor,
    borderRadius: ov.borderRadius ?? globalStyle.borderRadius,
  };
}

export function getResolvedFormButtonStyles(
  element: PageBlockElement,
  defaultPrimaryColor: string = '#2848F0',
  defaultFontFamily: string = 'Poppins'
): Required<CompleteFormButtonStyles> {
  const b = element.content.formButtonStyles || {};
  const normalBg =
    b.bgColor || element.content.submitButtonBg || defaultPrimaryColor || '#2848F0';
  const normalText = b.textColor || element.content.submitButtonTextColor || '#FFFFFF';
  const normalBorder = b.borderColor || '#18181B';
  return {
    text: b.text ?? element.content.submitButtonText ?? 'Enviar Información',
    subtext: b.subtext ?? '',
    icon: b.icon ?? '',
    iconPosition: b.iconPosition || 'after',
    iconSpacing: b.iconSpacing ?? 8,
    iconSize: b.iconSize ?? 18,
    paddingY: b.paddingY ?? 14,
    paddingX: b.paddingX ?? 24,
    fontSize: b.fontSize ?? 15,
    fontFamily: b.fontFamily || defaultFontFamily || 'Poppins',
    textTransform: b.textTransform || 'none',
    isBold: b.isBold ?? true,
    isItalic: Boolean(b.isItalic),
    isUnderline: Boolean(b.isUnderline),
    align: b.align || 'center',
    fullWidth: b.fullWidth ?? true,
    bgType: b.bgType || 'solid',
    bgColor: normalBg,
    bgColor2: b.bgColor2 || '#1E3A8A',
    textColor: normalText,
    borderColor: normalBorder,
    hoverBgColor: b.hoverBgColor || normalBg,
    hoverTextColor: b.hoverTextColor || normalText,
    hoverBorderColor: b.hoverBorderColor || normalBorder,
    borderWidth: b.borderWidth ?? 0,
    borderStyle: b.borderStyle || 'solid',
    borderRadius: b.borderRadius ?? 0,
  };
}

export function getResolvedPostSubmitActions(
  content: PageBlockElement['content']
): Required<CompleteFormPostSubmitActions> {
  const act = content.formPostSubmitActions || {};
  const existingTargets = act.emailTargets || [];
  const mergedTargets: CompleteFormEmailTarget[] = EMAIL_MARKETING_PROVIDERS.map((prov) => {
    const found = existingTargets.find((t) => t.provider === prov.id);
    return (
      found || {
        provider: prov.id,
        enabled: false,
        listOrTag: '',
      }
    );
  });

  return {
    goToNextStep: Boolean(act.goToNextStep),
    redirectToUrl: act.redirectToUrl ?? Boolean(content.formRedirectUrl),
    redirectUrl: act.redirectUrl ?? content.formRedirectUrl ?? '',
    redirectOpenNewTab: Boolean(act.redirectOpenNewTab),
    addToCrm: act.addToCrm ?? true,
    sendToEmailMarketing: Boolean(act.sendToEmailMarketing),
    emailTargets: mergedTargets,
  };
}

export function parseFieldOptions(optionsText?: string): { label: string; value: string }[] {
  const raw = optionsText ?? 'Opción 1\nOpción 2\nOpción 3';
  const lines = raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return [
      { label: 'Opción 1', value: 'Opción 1' },
      { label: 'Opción 2', value: 'Opción 2' },
    ];
  }

  return lines.map((line) => {
    const pipeIdx = line.indexOf('|');
    if (pipeIdx !== -1) {
      const label = line.slice(0, pipeIdx).trim() || line;
      const value = line.slice(pipeIdx + 1).trim() || label;
      return { label, value };
    }
    return { label: line, value: line };
  });
}

export function sanitizePolicyHtml(rawHtml?: string): string {
  const fallback = DEFAULT_POLICY_HTML;
  if (!rawHtml || !rawHtml.trim()) return fallback;

  if (typeof DOMParser === 'undefined') {
    return rawHtml;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${rawHtml}</div>`, 'text/html');
  const root = doc.body.firstElementChild;
  if (!root) return fallback;

  const allowedTags = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'A', 'BR', 'SPAN']);

  const cleanNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const el = node as HTMLElement;
    const tag = el.tagName.toUpperCase();
    const inner = Array.from(el.childNodes).map(cleanNode).join('');

    if (tag === 'BR') return '<br />';

    if (!allowedTags.has(tag)) {
      return inner;
    }

    if (tag === 'A') {
      const rawHref = (el.getAttribute('href') || '').trim();
      const safeHref =
        rawHref && !/^javascript:/i.test(rawHref)
          ? rawHref.replace(/"/g, '&quot;')
          : '#';
      return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; font-weight: 600;">${inner}</a>`;
    }

    const lower = tag.toLowerCase();
    return `<${lower}>${inner}</${lower}>`;
  };

  return Array.from(root.childNodes).map(cleanNode).join('');
}
