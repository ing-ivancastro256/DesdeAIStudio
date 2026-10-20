import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building,
  CreditCard,
  Filter,
  X,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    organization,
    updateOrganizationName,
    virtualCard,
    updateVirtualCard,
    showToast,
  } = useApp();

  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState(organization.name);
  const [headline, setHeadline] = useState(virtualCard.headline);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1) {
      if (businessName.trim()) {
        updateOrganizationName(businessName.trim());
      }
      setStep(2);
    } else if (step === 2) {
      if (headline.trim()) {
        updateVirtualCard({ headline: headline.trim() });
      }
      setStep(3);
    } else {
      showToast('🎉 ¡Onboarding completado! Tu sistema comercial está listo.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#1C1C1C] flex items-center justify-center text-white font-bold text-xs font-['Poppins']">
            SSP
          </div>
          <div>
            <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
              Configuración Inicial de Scale Sales Pro
            </h3>
            <p className="text-xs text-zinc-500 font-['Inter']">
              Paso {step} de 3 • Deja listo tu sistema comercial en 2 minutos
            </p>
          </div>
        </div>

        {/* Step 1: Business Name */}
        {step === 1 && (
          <div className="space-y-4 py-2 animate-in fade-in">
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
              <Building className="w-5 h-5 text-[#2848F0] shrink-0 mt-0.5" />
              <div className="text-xs text-blue-950 font-['Inter']">
                <strong>Paso 1: Tu Negocio de Servicios</strong>
                <p className="text-blue-900/80 mt-0.5">
                  ¿Cómo se llama tu consultora, agencia o práctica profesional de coaching?
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">Nombre Comercial:</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ej: Valenzuela Consulting o Mariana Coaching"
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Step 2: Virtual Card Specialty */}
        {step === 2 && (
          <div className="space-y-4 py-2 animate-in fade-in">
            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div className="text-xs text-purple-950 font-['Inter']">
                <strong>Paso 2: Tu Tarjeta Virtual de Adquisición</strong>
                <p className="text-purple-900/80 mt-0.5">
                  Esta será tu carta de presentación en redes sociales (Instagram, LinkedIn, etc.) que canaliza visitantes hacia tu embudo.
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">Tu Especialidad o Titular:</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Ej: Mentor de Negocios y Escalamiento B2B"
                className="w-full p-2.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Step 3: Funnel & System Ready */}
        {step === 3 && (
          <div className="space-y-4 py-2 animate-in fade-in text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-bold font-['Poppins'] text-[#121111]">
                ¡Tu Embudo de 5 Pasos Está Creado!
              </h4>
              <p className="text-xs text-[#5B5B66] font-['Inter'] mt-1 leading-relaxed">
                Hemos generado automáticamente la plantilla base de 5 páginas (Landing, VSL, Calificación por Reglas, Calendario de Citas y Gracias), junto con tu CRM listo para recibir prospectos.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 font-['Inter'] text-left space-y-1">
              <div>✓ Plan Free activado con 1 embudo y 50 contactos.</div>
              <div>✓ Tarjeta virtual lista en <strong>/c/{virtualCard.slug}</strong>.</div>
              <div>✓ Calificación por reglas activa (aprobación a los 50 pts).</div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 cursor-pointer"
            >
              Atrás
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] shadow-sm flex items-center gap-1.5 cursor-pointer font-['Poppins']"
          >
            <span>{step === 3 ? 'Comenzar a Usar SSP' : 'Continuar'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
