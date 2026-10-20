import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useGoogleCalendar } from '../../hooks/useGoogleCalendar';
import { GoogleSignInButton } from '../common/GoogleSignInButton';
import {
  Plug,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Settings2,
  Calendar,
  Sparkles,
  LogOut,
  ArrowRight,
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const { integrations, toggleIntegration, showToast } = useApp();
  const {
    googleUser,
    isConnected: isGoogleConnected,
    isSigningIn,
    isLoadingAuth,
    signIn,
    signOut,
    events,
  } = useGoogleCalendar();

  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [listNameInput, setListNameInput] = useState('Prospectos Calificados SSP');

  const providerMeta: Record<string, { name: string; desc: string; logoText: string; color: string }> = {
    activecampaign: {
      name: 'ActiveCampaign',
      desc: 'Sincroniza contactos automáticamente y activa automatizaciones de bienvenida y seguimiento.',
      logoText: 'AC',
      color: '#356AE6',
    },
    getresponse: {
      name: 'GetResponse',
      desc: 'Envía leads calificados directamente a tu lista o autorespondedor configurado.',
      logoText: 'GR',
      color: '#00BAFF',
    },
    kit: {
      name: 'Kit (ConvertKit)',
      desc: 'Ideal para creadores y consultores que envían newsletters y secuencias educativas.',
      logoText: 'KIT',
      color: '#FF715B',
    },
    mailerlite: {
      name: 'MailerLite',
      desc: 'Plataforma intuitiva de email marketing para pequeños negocios y profesionales independientes.',
      logoText: 'ML',
      color: '#00A15D',
    },
    brevo: {
      name: 'Brevo (Sendinblue)',
      desc: 'Gestión omnicanal de correos transaccionales y campañas masivas para servicios.',
      logoText: 'BV',
      color: '#0B996F',
    },
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;
    toggleIntegration(selectedProvider, listNameInput);
    setSelectedProvider(null);
    setApiKeyInput('');
  };

  return (
    <div className="space-y-8">
      {/* Google Workspace & Calendar Integration Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold font-['Poppins'] text-[#121111] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#4285F4]" />
              <span>Google Workspace & Calendario</span>
            </h2>
            <p className="text-xs text-[#5B5B66] font-['Inter'] mt-0.5">
              Conexión directa mediante OAuth seguro para sincronizar citas, salas de Google Meet y eventos.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Integración Oficial
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="3" fill="#4285F4" />
                <path d="M3 9H21" stroke="white" strokeWidth="1.5" />
                <path d="M7 2V5" stroke="#1A73E8" strokeWidth="2" strokeLinecap="round" />
                <path d="M17 2V5" stroke="#1A73E8" strokeWidth="2" strokeLinecap="round" />
                <text x="7" y="17" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
                  31
                </text>
              </svg>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold font-['Poppins'] text-zinc-900">
                  Google Calendar
                </h3>
                {isGoogleConnected ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Conectado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-500">
                    No conectado
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5B5B66] font-['Inter'] leading-relaxed max-w-xl">
                Crea automáticamente eventos en tu Google Calendar con enlaces a Google Meet cuando un prospecto reserve una cita en cualquiera de tus embudos.
              </p>
              {isGoogleConnected && googleUser?.email && (
                <div className="text-xs text-zinc-700 font-medium pt-1">
                  Cuenta vinculada: <strong className="text-zinc-900">{googleUser.email}</strong> • {events.length} eventos sincronizados
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {isGoogleConnected ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    showToast('Cuenta de Google Calendar desconectada');
                  }}
                  className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Desconectar</span>
                </button>
              </div>
            ) : (
              <GoogleSignInButton
                onClick={async () => {
                  try {
                    await signIn();
                    showToast('Google Calendar conectado exitosamente');
                  } catch {
                    // handled
                  }
                }}
                disabled={isSigningIn || isLoadingAuth}
                text={isSigningIn ? 'Conectando...' : 'Conectar Google Calendar'}
              />
            )}
          </div>
        </div>
      </div>

      {/* Email Marketing Section */}
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-xl border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div>
            <h2 className="text-base font-bold font-['Poppins'] text-[#121111]">
              Integraciones de Email Marketing
            </h2>
            <p className="text-xs text-[#5B5B66] font-['Inter']">
              Conecta tu herramienta de correo favorita. Cada lead que complete el formulario se enviará a la lista que elijas en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Credenciales encriptadas en backend</span>
          </div>
        </div>

        {/* Grid of the 5 email platforms */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((item) => {
            const meta = providerMeta[item.provider] || {
              name: item.provider,
              desc: '',
              logoText: 'EM',
              color: '#121111',
            };
            const isConnected = item.status === 'connected';

            return (
              <div
                key={item.id}
                className={`p-5 rounded-xl border transition-all bg-white flex flex-col justify-between shadow-xs ${
                  isConnected ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-zinc-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: meta.color }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold font-['Poppins'] text-xs shadow-xs"
                      >
                        {meta.logoText}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold font-['Poppins'] text-zinc-900">
                          {meta.name}
                        </h3>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            isConnected ? 'text-emerald-700' : 'text-zinc-400'
                          }`}
                        >
                          {isConnected ? '● Conectado' : '○ No Conectado'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#5B5B66] font-['Inter'] leading-relaxed mb-4">
                    {meta.desc}
                  </p>

                  {isConnected && (
                    <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900 font-['Inter'] mb-4 space-y-0.5">
                      <div>
                        Lista destino: <strong>{item.list_name}</strong>
                      </div>
                      <div className="text-emerald-700 text-[10px]">
                        Sincronización activa en tiempo real
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-zinc-100">
                  {isConnected ? (
                    <button
                      onClick={() => toggleIntegration(item.provider, '')}
                      className="w-full py-2 px-3 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Desconectar
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedProvider(item.provider);
                        setApiKeyInput('');
                      }}
                      className="w-full py-2 px-3 text-xs font-bold text-white bg-[#1C1C1C] hover:bg-black rounded-lg transition-colors cursor-pointer"
                    >
                      Conectar {meta.name}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connection Modal for Email Marketing */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-200">
            <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
              Conectar {providerMeta[selectedProvider]?.name}
            </h3>
            <p className="text-xs text-[#5B5B66] font-['Inter'] mt-1">
              Ingresa la clave API para sincronizar contactos calificados.
            </p>

            <form onSubmit={handleConnect} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700">API Key / Token de Acceso:</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••••••••••••••"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700">Nombre de la Lista o Tag:</label>
                <input
                  type="text"
                  required
                  value={listNameInput}
                  onChange={(e) => setListNameInput(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedProvider(null)}
                  className="px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] rounded-lg cursor-pointer"
                >
                  Guardar y Activar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
