import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Configure Google Auth Provider with Calendar scopes
const provider = new GoogleAuthProvider();
const CALENDAR_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly',
];

CALENDAR_SCOPES.forEach((scope) => provider.addScope(scope));

// In-memory token cache (CRITICAL: Do NOT store in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  hangoutLink?: string;
  htmlLink?: string;
  status?: string;
}

export interface GoogleCalendarListEntry {
  id: string;
  summary: string;
  primary?: boolean;
  backgroundColor?: string;
  foregroundColor?: string;
  timeZone?: string;
}

/**
 * Initialize auth listener. Clears memory token on logout.
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // User logged in to Firebase but token not in memory; user must initiate sign-in to obtain fresh OAuth access token
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Initiate Google Sign-In with popup.
 * Caches access token in memory.
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No se pudo obtener el token de acceso de Google');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Get current in-memory access token.
 */
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

/**
 * Manually set or clear cached token in memory if needed.
 */
export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

/**
 * Sign out and clear in-memory token.
 */
export const googleSignOut = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

// ==========================================
// Google Calendar API Endpoints (Client-Side)
// ==========================================

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

/**
 * List events from primary calendar
 */
export const listPrimaryEvents = async (options?: {
  timeMin?: string;
  timeMax?: string;
  maxResults?: number;
  calendarId?: string;
}): Promise<GoogleCalendarEvent[]> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('No autenticado. Por favor inicia sesión con Google.');
  }

  const calendarId = encodeURIComponent(options?.calendarId || 'primary');
  const params = new URLSearchParams();
  params.set('singleEvents', 'true');
  params.set('orderBy', 'startTime');
  params.set('maxResults', String(options?.maxResults || 50));

  if (options?.timeMin) {
    params.set('timeMin', options.timeMin);
  } else {
    // Default to start of current day
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    params.set('timeMin', now.toISOString());
  }

  if (options?.timeMax) {
    params.set('timeMax', options.timeMax);
  }

  const res = await fetch(`${CALENDAR_API_BASE}/calendars/${calendarId}/events?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody?.error?.message || `Error al obtener eventos: ${res.statusText}`);
  }

  const data = await res.json();
  return (data.items || []) as GoogleCalendarEvent[];
};

/**
 * List all calendars available to user
 */
export const listUserCalendars = async (): Promise<GoogleCalendarListEntry[]> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('No autenticado. Por favor inicia sesión con Google.');
  }

  const res = await fetch(`${CALENDAR_API_BASE}/users/me/calendarList`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody?.error?.message || 'Error al obtener calendarios');
  }

  const data = await res.json();
  return (data.items || []) as GoogleCalendarListEntry[];
};

/**
 * Create a new event in Google Calendar
 */
export const createCalendarEvent = async (event: {
  summary: string;
  description?: string;
  location?: string;
  startDateTime: string;
  endDateTime: string;
  attendees?: string[];
  calendarId?: string;
}): Promise<GoogleCalendarEvent> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('No autenticado. Por favor inicia sesión con Google.');
  }

  const calendarId = encodeURIComponent(event.calendarId || 'primary');
  const body = {
    summary: event.summary,
    description: event.description,
    location: event.location,
    start: {
      dateTime: event.startDateTime,
    },
    end: {
      dateTime: event.endDateTime,
    },
    attendees: event.attendees?.map((email) => ({ email })),
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  const res = await fetch(`${CALENDAR_API_BASE}/calendars/${calendarId}/events?conferenceDataVersion=1`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody?.error?.message || 'Error al crear evento en Google Calendar');
  }

  return await res.json();
};

/**
 * Delete an event from Google Calendar (Destructive operation - must be confirmed in UI first!)
 */
export const deleteCalendarEvent = async (
  eventId: string,
  calendarId: string = 'primary'
): Promise<void> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('No autenticado. Por favor inicia sesión con Google.');
  }

  const res = await fetch(`${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 404 && res.status !== 410) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody?.error?.message || 'Error al eliminar evento en Google Calendar');
  }
};
