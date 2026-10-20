import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardCheck,
  Plus,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const FormsView: React.FC = () => {
  const { forms, organization, planEntitlements, openUpgradeModal } = useApp();
  const currentForm = forms[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 bg-white rounded-xl border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold font-['Poppins'] text-[#121111]">
            Formularios y Calificación por Reglas ({forms.length} / {planEntitlements.forms_limit})
          </h2>
          <p className="text-xs text-[#5B5B66] font-['Inter']">
            Sistema determinista por puntos: cada respuesta asigna una puntuación y decide si el visitante califica para agendar.
          </p>
        </div>

        <button
          onClick={() => {
            if (forms.length >= planEntitlements.forms_limit) {
              openUpgradeModal(
                'Límite de Formularios',
                'El Plan Free permite 1 formulario de calificación.',
                'Pasa a Basic para crear hasta 5 formularios con lógica condicional avanzada.'
              );
            }
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Formulario</span>
        </button>
      </div>

      {/* Main Qualification Form Details */}
      <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
                {currentForm.name}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase tracking-wider">
                Filtro Estratégico
              </span>
            </div>
            <p className="text-xs text-[#5B5B66] font-['Inter'] mt-0.5">
              Insertado automáticamente en el Paso 3 del Embudo.
            </p>
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center gap-4 text-xs font-['Inter']">
            <div>
              <span className="text-zinc-500">Puntaje mínimo de pase:</span>
              <div className="text-base font-bold text-[#2848F0] font-mono">
                {currentForm.pass_score} Puntos
              </div>
            </div>
            <div className="text-[11px] text-zinc-500 max-w-[200px]">
              Si la suma es &gt;= {currentForm.pass_score}, el prospecto avanza directamente al calendario de citas.
            </div>
          </div>
        </div>

        {/* Fields and Scoring Rules breakdown */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-['Inter']">
            Campos del Formulario y Asignación de Puntos (Sin IA)
          </h4>

          <div className="space-y-3">
            {currentForm.fields.map((field, idx) => (
              <div
                key={field.id}
                className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-700 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-zinc-900 font-['Poppins']">
                      {field.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-zinc-200 text-zinc-600 rounded">
                    Tipo: {field.type}
                  </span>
                </div>

                {/* If field has scoring options */}
                {field.options && field.options.length > 0 && (
                  <div className="pl-7 space-y-1.5">
                    <div className="text-[11px] font-semibold text-zinc-600">
                      Reglas de puntuación por respuesta:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {field.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className="p-2 rounded-lg bg-white border border-zinc-200 text-xs flex items-center justify-between"
                        >
                          <span className="text-zinc-700 font-['Inter']">{opt.label}</span>
                          <span
                            className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                              opt.points > 0
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-zinc-100 text-zinc-500'
                            }`}
                          >
                            +{opt.points} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Conditional Logic Promo for Basic */}
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#2848F0] shrink-0" />
            <div className="text-xs text-zinc-700 font-['Inter']">
              <strong>Lógica Condicional Dinámica:</strong> Muestra u oculta preguntas según las respuestas previas del prospecto. (Disponible en Plan Basic).
            </div>
          </div>

          {organization.plan_code === 'FREE' && (
            <button
              onClick={() =>
                openUpgradeModal(
                  'Formularios Condicionales',
                  'Personaliza el cuestionario para cada tipo de cliente con lógica if/then.',
                  'Activa Basic por solo $20 USD los primeros 3 meses.'
                )
              }
              className="shrink-0 px-3 py-1.5 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] rounded-lg transition-colors cursor-pointer"
            >
              Desbloquear en Basic
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
