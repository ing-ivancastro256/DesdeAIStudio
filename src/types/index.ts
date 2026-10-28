export type PlanCode = 'FREE' | 'BASIC' | 'PRO';

export interface PlanEntitlements {
  funnel_limit: number;
  contacts_limit: number;
  appointments_per_month_limit: number;
  forms_limit: number;
  pages_limit: number;
  custom_domains_limit: number;
  users_limit: number;
  remove_branding: boolean;
  custom_domain_active: boolean;
  kanban_crm: boolean;
  notes_history: boolean;
  conditional_forms: boolean;
  utm_tracking: boolean;
}

export interface Plan {
  code: PlanCode;
  name: string;
  price_monthly_cents: number;
  price_yearly_cents: number;
  is_public: boolean;
  description: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan_code: PlanCode;
  status: 'active' | 'suspended' | 'trial';
  referred_by_affiliate_id?: string;
  referred_at?: string;
  created_at: string;
}

export interface Profile {
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  is_platform_admin: boolean;
  created_at: string;
}

export interface CardLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
  position: number;
  is_active: boolean;
}

export interface VirtualCard {
  id: string;
  organization_id: string;
  slug: string;
  display_name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  funnel_id?: string;
  funnel_button_text: string;
  social_links: {
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    whatsapp?: string;
    tiktok?: string;
    twitter?: string;
  };
  theme_settings: {
    bg_color: string;
    card_bg: string;
    text_color: string;
    accent_color: string;
    button_style: 'rounded' | 'pill' | 'square';
  };
  is_published: boolean;
  links: CardLink[];
}

export type PageType = 'landing' | 'vsl' | 'qualification' | 'calendar' | 'thank_you';

export interface ElementStyles {
  fontSize?: number;
  lineHeight?: number;
  fontFamily?: 'Poppins' | 'Inter' | string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textColor?: string;
  bulletIcon?: 'disc' | 'check' | 'check_circle' | 'square' | 'arrow' | 'star' | 'zap' | 'dash' | string;
  bulletColor?: string;
  bulletSpacing?: number;
  bgColor?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  borderRadius?: number;
  letterSpacing?: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  rotation?: number;
  opacity?: number;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  imageWidth?: number;
  imageHeight?: number;
  imageWidthUnit?: 'px' | '%';
  imageHeightUnit?: 'px' | '%';
  aspectRatioLocked?: boolean;
  imageFit?: 'contain' | 'cover' | 'stretch' | 'auto';
  imagePosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  imageRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  linkUrl?: string;
  linkOpenNewTab?: boolean;
  aspectRatio?: '16/9' | '4/3' | '9/16' | '1/1' | 'auto';
  buttonDestination?: 'next_page' | 'calendar' | 'url';
  buttonUrl?: string;
  buttonOpenNewTab?: boolean;
  maxWidth?: string;
  fullWidth?: boolean;
  boxShadow?: string;
  buttonPaddingY?: number;
  buttonPaddingX?: number;
  hoverBgColor?: string;
  hoverTextColor?: string;
  hoverBorderColor?: string;
}

export type ElementType =
  | 'heading'
  | 'subheading'
  | 'paragraph'
  | 'bullet_list'
  | 'rich_text'
  | 'button'
  | 'image'
  | 'video'
  | 'divider'
  | 'spacer'
  | 'audio'
  | 'icon'
  | 'simple_form'
  | 'inline_form'
  | 'popup_button'
  | 'form'
  | 'calendar'
  | 'countdown'
  | 'faq'
  | 'social_links'
  | 'checkbox'
  | 'input_field'
  | 'form_button'
  | 'card_avatar'
  | 'card_name'
  | 'card_bio'
  | 'card_links'
  | 'card_funnel_button'
  | 'inner_columns';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SocialLinkItem {
  id: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'whatsapp' | 'youtube' | 'x' | 'linkedin';
  url: string;
  enabled: boolean;
}

export interface SimpleFormFieldConfig {
  id: string;
  type: 'radio' | 'text' | 'select' | 'checkbox';
  label: string;
  required?: boolean;
  options?: string[];
}

export type CompleteFormFieldType =
  | 'text'
  | 'email'
  | 'textarea'
  | 'tel'
  | 'whatsapp'
  | 'select'
  | 'radio'
  | 'checkbox';

export type CompleteFormColumnWidth = '100' | '75' | '66' | '50' | '33' | '25';

export type CompleteFormInputSize = 'xs' | 'sm' | 'md' | 'lg';

export interface CompleteFormGlobalFieldStyle {
  fontFamily?: string;
  fontSize?: number;
  isBold?: boolean;
  isItalic?: boolean;
  textColor?: string;
  labelColor?: string;
  bgColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  borderColor?: string;
  borderRadius?: number;
}

export interface CompleteFormFieldStyleOverride extends CompleteFormGlobalFieldStyle {
  enabled?: boolean;
}

export interface CompleteFormFieldItem {
  id: string;
  type: CompleteFormFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  columnWidth?: CompleteFormColumnWidth;
  optionsText?: string;
  styleOverride?: CompleteFormFieldStyleOverride;
}

export interface CompleteFormButtonStyles {
  text?: string;
  subtext?: string;
  icon?: string;
  iconPosition?: 'before' | 'after';
  iconSpacing?: number;
  iconSize?: number;
  paddingY?: number;
  paddingX?: number;
  fontSize?: number;
  fontFamily?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  align?: 'left' | 'center' | 'right';
  fullWidth?: boolean;
  bgType?: 'solid' | 'gradient';
  bgColor?: string;
  bgColor2?: string;
  textColor?: string;
  borderColor?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
  hoverBorderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  borderRadius?: number;
}

export interface CompleteFormEmailTarget {
  provider: EmailProvider;
  enabled: boolean;
  listOrTag: string;
}

export interface CompleteFormPostSubmitActions {
  goToNextStep?: boolean;
  goToFunnelPage?: boolean;
  targetFunnelPageId?: string;
  redirectToUrl?: boolean;
  redirectUrl?: string;
  redirectOpenNewTab?: boolean;
  addToCrm?: boolean;
  sendToEmailMarketing?: boolean;
  emailTargets?: CompleteFormEmailTarget[];
}

export interface PopupModal {
  id: string;
  name: string;
  title?: string;
  subtitle?: string;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  bgColor?: string;
  elements: PageBlockElement[];
}

export interface PageBlockElement {
  id: string;
  type: ElementType;
  nestedRow?: PageBlockRow;
  content: {
    text?: string;
    level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
    items?: string[];
    html?: string;
    src?: string;
    alt?: string;
    linkUrl?: string;
    linkOpenNewTab?: boolean;
    videoUrl?: string; // YouTube / Vimeo / etc.
    videoFileName?: string;
    videoSource?: 'youtube' | 'vimeo' | 'wistia' | 'upload' | 'external' | 'server';
    videoAutoplay?: boolean;
    videoMuted?: boolean;
    videoLoop?: boolean;
    videoCoverType?: 'none' | 'image' | 'custom';
    videoCoverImage?: string;
    videoCoverText?: string;
    videoCoverTextFont?: string;
    videoCoverTextSize?: number;
    videoCoverTextColor?: string;
    videoCoverTextBg?: string;
    videoCoverTextBold?: boolean;
    videoCoverPlayIcon?: 'play' | 'play_circle' | 'play_square' | 'video' | 'film' | 'tv' | 'sparkle' | 'flame' | 'zap' | 'volume_2' | 'eye' | 'heart' | 'disc' | string;
    videoCoverButtonShape?: 'circle' | 'square' | 'rounded';
    videoCoverPlayColor?: string;
    videoCoverPlayBg?: string;
    videoCoverPlaySize?: number;
    videoCoverArrowType?: 'curved' | 'straight' | 'corner' | 'hand';
    videoCoverArrowColor?: string;
    videoCoverArrowSize?: number;
    videoCoverArrowRotation?: number;
    videoCoverBgType?: 'solid' | 'gradient' | 'pattern';
    videoCoverBgColor?: string;
    videoCoverBgColor2?: string;
    videoCoverBgOpacity?: number;
    buttonText?: string;
    buttonSubtextEnabled?: boolean;
    buttonSubtext?: string;
    buttonSubtextColor?: string;
    buttonSubtextFontSize?: number;
    buttonSubtextFontFamily?: string;
    buttonSubtextBold?: boolean;
    buttonSubtextItalic?: boolean;
    buttonSubtextUnderline?: boolean;
    buttonSubtextTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    buttonSubtextGap?: number;
    buttonSubtextIcon?: string;
    buttonIcon?: string;
    buttonIconPosition?: 'before' | 'after';
    buttonIconSpacing?: number;
    buttonIconSize?: number;
    formId?: string;
    // Spacer
    spacerHeight?: number;
    // Audio / Hybrid Player
    audioType?: 'direct' | 'spotify' | 'soundcloud';
    audioSource?: 'soundcloud' | 'spotify' | 'external' | 'upload' | 'server';
    audioUrl?: string;
    audioFileName?: string;
    audioTitle?: string;
    audioArtist?: string;
    audioAutoplay?: boolean;
    audioLoop?: boolean;
    audioPlaylistTracks?: { title: string; artist?: string; duration?: string; url?: string }[];
    audioBgType?: 'solid' | 'gradient';
    audioBgColor?: string;
    audioBgColorEnd?: string;
    audioTitleColor?: string;
    audioArtistColor?: string;
    audioTitleSize?: number;
    audioFontFamily?: string;
    audioPlayButtonBg?: string;
    audioPlayIconColor?: string;
    audioPlayButtonShape?: 'circle' | 'rounded' | 'square';
    audioProgressColor?: string;
    audioProgressBgColor?: string;
    audioPlayerSize?: 'compact' | 'normal' | 'large';
    // Icon
    iconName?: string;
    iconSize?: number;
    iconColor?: string;
    iconBgColor?: string;
    iconShape?: 'none' | 'circle' | 'square' | 'rounded';
    // Complete Form (simple_form) & Inline Form (inline_form)
    formName?: string;
    formFields?: CompleteFormFieldItem[];
    formInputSize?: CompleteFormInputSize;
    formRowsGap?: number;
    formShowLabels?: boolean;
    formShowRequiredMark?: boolean;
    formFieldStyles?: CompleteFormGlobalFieldStyle;
    formButtonStyles?: CompleteFormButtonStyles;
    inlineFormHeight?: number;
    inlineFormButtonWidthPercent?: number;
    inlineFormGap?: number;
    inlineEmailPlaceholder?: string;
    inlineEmailLabel?: string;
    inlineShowLabel?: boolean;
    policyCheckboxEnabled?: boolean;
    policyCheckboxHtml?: string;
    policyCheckboxFontSize?: number;
    policyCheckboxTextColor?: string;
    policyCheckboxErrorText?: string;
    formPostSubmitActions?: CompleteFormPostSubmitActions;
    // Legacy Simple Form fallbacks
    formTitle?: string;
    formSubtitle?: string;
    showNameField?: boolean;
    nameRequired?: boolean;
    showPhoneField?: boolean;
    phoneRequired?: boolean;
    emailRequired?: boolean;
    extraFields?: SimpleFormFieldConfig[];
    submitButtonText?: string;
    submitButtonBg?: string;
    submitButtonTextColor?: string;
    formSuccessMessage?: string;
    formRedirectUrl?: string;
    // Popup Button
    popupButtonText?: string;
    popupId?: string;
    // Countdown
    countdownEndDate?: string;
    countdownDaysLabel?: string;
    countdownHoursLabel?: string;
    countdownMinutesLabel?: string;
    countdownSecondsLabel?: string;
    countdownTheme?: 'dark' | 'light' | 'primary';
    // FAQ
    faqItems?: FaqItem[];
    // Social Links
    socialLinks?: SocialLinkItem[];
    socialSize?: 'sm' | 'md' | 'lg';
    socialStyle?: 'default' | 'custom' | 'colored' | 'black' | 'outline' | 'rounded';
    socialColorMode?: 'default' | 'custom';
    socialIconColor?: string;
    socialBgColor?: string;
    socialShape?: 'circle' | 'square' | 'rounded' | 'none';
    // Checkbox
    checkboxLabel?: string;
    checkboxRequired?: boolean;
    checkboxChecked?: boolean;
    // Input Field
    fieldLabel?: string;
    fieldPlaceholder?: string;
    fieldType?: 'text' | 'email' | 'phone' | 'number' | 'textarea';
    fieldRequired?: boolean;
  };
  styles: ElementStyles;
}

export interface PageBlockColumn {
  id: string;
  name?: string;
  widthPercentage: number; // e.g. 100, 50, 33.33, 25
  bgType?: 'solid' | 'gradient';
  bgColor?: string;
  bgColor2?: string;
  bgGradient?: string;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: number;
  marginBottom?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  verticalAlign?: 'top' | 'center' | 'bottom';
  elements: PageBlockElement[];
}

export interface PageBlockRow {
  id: string;
  name?: string;
  widthType?: 'full' | 'boxed'; // 'full' or 'boxed'
  maxWidth?: number; // e.g. 1140, 1200, 960, 800
  bgColor?: string;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: number;
  marginBottom?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  // Retardo de aparición (delay)
  delayMinutes?: number;
  delaySeconds?: number;
  columns: PageBlockColumn[];
}

export interface PageBlockSection {
  id: string;
  name: string;
  // Background configuration
  bgType?: 'solid' | 'gradient' | 'image';
  bgColor?: string;
  bgCustom?: boolean;
  bgGradient?: string;
  bgGradientColor1?: string;
  bgGradientColor2?: string;
  bgImageUrl?: string;
  bgImagePosition?: 'center' | 'top' | 'bottom' | 'cover' | 'contain';
  bgImageRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  bgImageAttachment?: 'scroll' | 'fixed';
  bgOverlayType?: 'none' | 'dark' | 'light' | 'color';
  bgOverlayColor?: string;
  bgOverlayOpacity?: number; // 0 to 100
  // Width configuration (governed by Canvas width)
  widthType?: 'boxed' | 'full';
  maxWidth?: number | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '5xl' | '7xl' | 'full';
  // Spacing
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  paddingY?: number; // fallback legacy
  // Border & Effects
  borderRadius?: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  // Retardo de aparición (delay)
  delayMinutes?: number;
  delaySeconds?: number;
  // Content
  rows: PageBlockRow[];
}

export interface FontOption {
  value: string;
  name: string;
  category: 'sans' | 'serif' | 'display';
}

export const AVAILABLE_FONTS: FontOption[] = [
  { value: 'Inter', name: 'Inter (Moderna y Limpia)', category: 'sans' },
  { value: 'Poppins', name: 'Poppins (Geométrica de Impacto)', category: 'sans' },
  { value: 'Roboto', name: 'Roboto (Estándar Digital)', category: 'sans' },
  { value: 'Montserrat', name: 'Montserrat (Moderna Urbana)', category: 'sans' },
  { value: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (SaaS & B2B Premium)', category: 'sans' },
  { value: 'DM Sans', name: 'DM Sans (Contemporánea)', category: 'sans' },
  { value: 'Outfit', name: 'Outfit (Minimalista)', category: 'sans' },
  { value: 'Lato', name: 'Lato (Equilibrada)', category: 'sans' },
  { value: 'Open Sans', name: 'Open Sans (Alta Legibilidad)', category: 'sans' },
  { value: 'Raleway', name: 'Raleway (Elegante y Fina)', category: 'sans' },
  { value: 'Oswald', name: 'Oswald (Condensada / Cartel)', category: 'display' },
  { value: 'Playfair Display', name: 'Playfair Display (Serif de Lujo)', category: 'serif' },
  { value: 'Merriweather', name: 'Merriweather (Serif Editorial)', category: 'serif' },
  { value: 'Cinzel', name: 'Cinzel (Clásica Solemne)', category: 'serif' },
];

export interface FunnelPageGlobalSettings {
  pageWidthType?: 'full' | 'boxed'; // 'full' or 'boxed'
  pageContentMaxWidth?: number;     // e.g. 1200 (default), 800, 960, 1140, 1400
  pageBorderRadius?: number;        // corner rounding / redondeo de esquinas en px (0, 8, 16, 24, etc.)
  pageBgColor?: string;             // General canvas background color
  pageBgImageEnabled?: boolean;     // Toggle switch to enable/disable canvas background image without losing uploaded URL
  pageBgImageUrl?: string;          // Optional canvas background image URL / Data URL
  pageBgImageOpacity?: number;      // 0 to 100 (default 100)
  pageBgImageSize?: 'cover' | 'contain' | 'stretch' | 'auto';
  pageBgImagePosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  pageBgImageRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  pageBgImageAttachment?: 'scroll' | 'fixed';
  primaryColor?: string;            // Global primary brand color for buttons
  textColor?: string;               // Global body text color
  headingFontFamily?: string;       // Global font for H1-H4
  bodyFontFamily?: string;          // Global font for paragraphs/buttons
  defaultH1Size?: number;           // Default H1 font size in px
  defaultH2Size?: number;           // Default H2 font size in px
  defaultH3Size?: number;           // Default H3 font size in px
  defaultH4Size?: number;           // Default H4 font size in px
  pagePaddingTop?: number;
  pagePaddingRight?: number;
  pagePaddingBottom?: number;
  pagePaddingLeft?: number;
  seo_title?: string;
  seo_description?: string;
  autoPopupTrigger?: 'none' | 'exit_intent' | 'delay';
  autoPopupId?: string;
  autoPopupDelaySeconds?: number;
}

export interface FunnelPage {
  id: string;
  funnel_id: string;
  page_type: PageType;
  title: string;
  position: number;
  sections: PageBlockSection[];
  popups?: PopupModal[];
  settings: FunnelPageGlobalSettings;
}

export type LibraryItemKind =
  | 'template'
  | 'block'
  | 'popup'
  | 'element'
  | 'webpage'
  | 'image';

export type PopupCloseButtonPosition = 'inside' | 'edge' | 'outside';
export type PopupCloseButtonShape = 'circle' | 'rounded' | 'square';

export interface PopupWindowSettings {
  maxWidth?: number;
  overlayOpacity?: number;
  closeOnBackdropClick?: boolean;
  closeBtnPosition?: PopupCloseButtonPosition;
  closeBtnOffsetX?: number;
  closeBtnOffsetY?: number;
  closeBtnSize?: number;
  closeBtnShape?: PopupCloseButtonShape;
  closeBtnBgColor?: string;
  closeBtnIconColor?: string;
  showTopProgressBar?: boolean;
  progressBarPercent?: number;
  progressBarText?: string;
  progressBarColor?: string;
  progressBarTextColor?: string;
}

export interface LibraryItem {
  id: string;
  kind: LibraryItemKind;
  name: string;
  category: string;
  isFavorite: boolean;
  isSystemSeed?: boolean;
  sections: PageBlockSection[];
  pageSettings?: Partial<FunnelPageGlobalSettings>;
  popupSettings?: PopupWindowSettings;
  createdAt: string;
  updatedAt: string;
}

export interface Funnel {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  status: 'draft' | 'published';
  custom_domain_id?: string;
  published_at?: string;
  created_at: string;
  pages: FunnelPage[];
}

export interface FormOption {
  label: string;
  points: number;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'radio' | 'textarea';
  required: boolean;
  options?: FormOption[];
}

export interface Form {
  id: string;
  organization_id: string;
  name: string;
  form_type: 'basic' | 'qualification';
  fields: FormField[];
  pass_score: number;
  redirect_on_fail_message?: string;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  organization_id: string;
  contact_id: string;
  answers: Record<string, any>;
  score: number;
  is_qualified: boolean;
  utm?: Record<string, string>;
  created_at: string;
}

export type ContactStatus =
  | 'nuevo'
  | 'contactado'
  | 'calificado'
  | 'cita_agendada'
  | 'no_asistio'
  | 'ganado'
  | 'perdido';

export interface Contact {
  id: string;
  organization_id: string;
  full_name: string;
  email: string;
  phone: string;
  status: ContactStatus;
  source: string;
  score: number;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  last_activity_at: string;
  created_at: string;
}

export interface ContactNote {
  id: string;
  contact_id: string;
  organization_id: string;
  author_id: string;
  author_name: string;
  body: string;
  created_at: string;
}

export interface ContactEvent {
  id: string;
  contact_id: string;
  organization_id: string;
  event_type: string;
  description: string;
  payload?: any;
  created_at: string;
}

export interface AvailabilityRule {
  id: string;
  organization_id: string;
  weekday: number; // 0 Sunday - 6 Saturday
  start_time: string; // "09:00"
  end_time: string; // "18:00"
  timezone: string;
  is_active: boolean;
}

export interface AppointmentType {
  id: string;
  organization_id: string;
  name: string;
  duration_minutes: number;
  description?: string;
}

export type AppointmentStatus = 'agendada' | 'completada' | 'no_asistio' | 'cancelada';

export interface Appointment {
  id: string;
  organization_id: string;
  contact_id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  appointment_type_id: string;
  appointment_type_name: string;
  starts_at: string; // ISO date string
  ends_at: string;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
}

export interface TrackingEvent {
  id: string;
  organization_id: string;
  funnel_id: string;
  page_id?: string;
  visitor_id: string;
  event_type: 'view' | 'click' | 'scroll' | 'vsl_progress' | 'form_submit' | 'appointment_booked';
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  created_at: string;
}

export interface CustomDomain {
  id: string;
  organization_id: string;
  domain: string;
  status: 'pending' | 'verified' | 'failed';
  verified_at?: string;
}

export type EmailProvider = 'getresponse' | 'activecampaign' | 'kit' | 'mailerlite' | 'brevo';

export interface EmailIntegration {
  id: string;
  organization_id: string;
  provider: EmailProvider;
  credentials_encrypted: string;
  list_id: string;
  list_name: string;
  status: 'connected' | 'disconnected';
  last_synced_at?: string;
}

export interface Subscription {
  id: string;
  organization_id: string;
  plan_code: PlanCode;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  billing_period: 'monthly' | 'yearly' | 'promo';
  payment_provider: 'hotmart';
  external_subscription_id: string;
  started_at: string;
  current_period_end: string;
  canceled_at?: string;
}
