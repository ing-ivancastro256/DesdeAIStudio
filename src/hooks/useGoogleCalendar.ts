import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  googleSignOut,
  getAccessToken,
  listPrimaryEvents,
  createCalendarEvent,
  deleteCalendarEvent,
  GoogleCalendarEvent,
} from '../services/googleCalendarService';
import { Appointment } from '../types';

export function useGoogleCalendar() {
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Track which appointment IDs have been synced during session
  const [syncedAppointmentIds, setSyncedAppointmentIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('ssp_gcal_synced_ids');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const markAppointmentSynced = useCallback((id: string) => {
    setSyncedAppointmentIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem('ssp_gcal_synced_ids', JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  // Listen to auth changes
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setHasToken(Boolean(token));
        setIsLoadingAuth(false);
      },
      () => {
        setGoogleUser(null);
        setHasToken(false);
        setIsLoadingAuth(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const refreshEvents = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) return;

    setIsLoadingEvents(true);
    setError(null);
    try {
      // Get events from start of this month up to 60 days ahead
      const timeMin = new Date();
      timeMin.setDate(timeMin.getDate() - 7); // include last 7 days for context
      const items = await listPrimaryEvents({
        timeMin: timeMin.toISOString(),
        maxResults: 50,
      });
      setEvents(items);
    } catch (err: any) {
      console.error('Error fetching Google Calendar events:', err);
      setError(err?.message || 'Error al sincronizar con Google Calendar');
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  // Once user & token are available, load events
  useEffect(() => {
    if (hasToken) {
      refreshEvents();
    } else {
      setEvents([]);
    }
  }, [hasToken, refreshEvents]);

  const signIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setHasToken(true);
        await refreshEvents();
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setError(err?.message || 'No se pudo iniciar sesión con Google');
      throw err;
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      await googleSignOut();
      setGoogleUser(null);
      setHasToken(false);
      setEvents([]);
    } catch (err: any) {
      console.error('Sign-out error:', err);
      setError(err?.message || 'Error al cerrar sesión');
    }
  };

  const syncAppointment = async (appt: Appointment) => {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Primero conecta tu cuenta de Google Calendar');
    }

    const startDateTime = appt.starts_at;
    const endDateTime = appt.ends_at;

    const summary = `Cita Scale Sales Pro: ${appt.contact_name} (${appt.appointment_type_name || 'Estrategia'})`;
    const description = `Cita agendada desde embudo Scale Sales Pro.\n\nCliente: ${appt.contact_name}\nEmail: ${appt.contact_email}\nTeléfono: ${appt.contact_phone || 'No provisto'}\nNotas: ${appt.notes || 'Ninguna'}`;

    const attendees = appt.contact_email ? [appt.contact_email] : undefined;

    const created = await createCalendarEvent({
      summary,
      description,
      startDateTime,
      endDateTime,
      attendees,
    });

    markAppointmentSynced(appt.id);
    await refreshEvents();
    return created;
  };

  const createCustomEvent = async (params: {
    summary: string;
    description?: string;
    location?: string;
    startDateTime: string;
    endDateTime: string;
    attendees?: string[];
  }) => {
    const created = await createCalendarEvent(params);
    await refreshEvents();
    return created;
  };

  const removeEvent = async (eventId: string) => {
    await deleteCalendarEvent(eventId);
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  return {
    googleUser,
    hasToken,
    isConnected: Boolean(googleUser && hasToken),
    isLoadingAuth,
    isSigningIn,
    events,
    isLoadingEvents,
    error,
    syncedAppointmentIds,
    signIn,
    signOut,
    refreshEvents,
    syncAppointment,
    createCustomEvent,
    removeEvent,
  };
}
