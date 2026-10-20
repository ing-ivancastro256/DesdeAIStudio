import React, { useState } from 'react';
import { Mail, User, Phone, CheckCircle, Send, ArrowRight } from 'lucide-react';
import { PageBlockElement, SimpleFormFieldConfig } from '../../../types';

interface SimpleFormElementProps {
  element: PageBlockElement;
  isEditable?: boolean;
  onSubmitSuccess?: (data: Record<string, any>) => void;
}

export const SimpleFormElement: React.FC<SimpleFormElementProps> = ({
  element,
  isEditable = false,
  onSubmitSuccess,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    email: '',
    name: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showName = element.content.showNameField ?? true;
  const nameReq = element.content.nameRequired ?? false;
  const showPhone = element.content.showPhoneField ?? false;
  const phoneReq = element.content.phoneRequired ?? false;
  const emailReq = element.content.emailRequired ?? true;
  const extraFields: SimpleFormFieldConfig[] = element.content.extraFields || [];

  const buttonText = element.content.submitButtonText || '👉 Enviar Información';
  const buttonBg = element.content.submitButtonBg || element.styles?.bgColor || '#2848F0';
  const buttonTextColor = element.content.submitButtonTextColor || element.styles?.textColor || '#FFFFFF';
  const successMsg =
    element.content.formSuccessMessage ||
    '¡Registro completado con éxito! Revisa tu bandeja de entrada.';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditable) return; // Don't submit in editor unless preview

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onSubmitSuccess) {
        onSubmitSuccess(formData);
      }
    }, 600);
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: element.styles?.maxWidth || '520px',
    margin: '0 auto',
    marginTop: `${element.styles?.marginTop || 0}px`,
    marginBottom: `${element.styles?.marginBottom ?? 24}px`,
    paddingTop: `${element.styles?.paddingTop || 0}px`,
    paddingBottom: `${element.styles?.paddingBottom || 0}px`,
    paddingLeft: `${element.styles?.paddingLeft || 0}px`,
    paddingRight: `${element.styles?.paddingRight || 0}px`,
  };

  if (submitted) {
    return (
      <div style={containerStyle} className="w-full">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center shadow-xs animate-in zoom-in-95">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-zinc-900 font-['Poppins'] mb-1">
            ¡Información Enviada!
          </h4>
          <p className="text-xs text-zinc-600 font-['Inter']">{successMsg}</p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 text-xs font-semibold text-[#2848F0] hover:underline cursor-pointer"
          >
            Enviar otra respuesta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-zinc-200/80 shadow-md p-6 space-y-4"
      >
        {element.content.formTitle && (
          <div className="text-center mb-3">
            <h3 className="text-lg font-bold text-zinc-900 font-['Poppins']">
              {element.content.formTitle}
            </h3>
            {element.content.formSubtitle && (
              <p className="text-xs text-zinc-500 font-['Inter'] mt-1">
                {element.content.formSubtitle}
              </p>
            )}
          </div>
        )}

        {/* NAME FIELD */}
        {showName && (
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1 font-['Inter']">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>Nombre completo {nameReq && <span className="text-red-500">*</span>}</span>
            </label>
            <input
              type="text"
              required={nameReq}
              placeholder="Ej. Juan Pérez"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-[#2848F0] transition-colors"
            />
          </div>
        )}

        {/* EMAIL FIELD (MANDATORY) */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1 font-['Inter']">
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            <span>Correo electrónico {emailReq && <span className="text-red-500">*</span>}</span>
          </label>
          <input
            type="email"
            required={emailReq}
            placeholder="tu-correo@ejemplo.com"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-[#2848F0] transition-colors"
          />
        </div>

        {/* PHONE FIELD */}
        {showPhone && (
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1 font-['Inter']">
              <Phone className="w-3.5 h-3.5 text-zinc-400" />
              <span>Teléfono / WhatsApp {phoneReq && <span className="text-red-500">*</span>}</span>
            </label>
            <input
              type="tel"
              required={phoneReq}
              placeholder="+52 55 1234 5678"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-[#2848F0] transition-colors"
            />
          </div>
        )}

        {/* EXTRA DYNAMIC FIELDS (RADIO BUTTONS, SELECT, TEXT) */}
        {extraFields.map((field) => (
          <div key={field.id} className="space-y-2 text-left pt-1">
            <label className="text-xs font-semibold text-zinc-700 font-['Inter'] block">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>

            {/* Radio Button Options */}
            {field.type === 'radio' && (
              <div className="space-y-1.5 pl-1">
                {(field.options || ['Opción 1', 'Opción 2']).map((opt, optIdx) => (
                  <label
                    key={optIdx}
                    className="flex items-center gap-2.5 text-xs text-zinc-700 cursor-pointer p-2 rounded-lg hover:bg-zinc-50 border border-zinc-100 transition-colors"
                  >
                    <input
                      type="radio"
                      name={field.id}
                      value={opt}
                      checked={formData[field.id] === opt}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                      required={field.required}
                      className="accent-[#2848F0] w-3.5 h-3.5 cursor-pointer"
                    />
                    <span className="font-['Inter']">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Select Dropdown */}
            {field.type === 'select' && (
              <select
                value={formData[field.id] || ''}
                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                required={field.required}
                className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-[#2848F0]"
              >
                <option value="">Selecciona una opción...</option>
                {(field.options || []).map((opt, optIdx) => (
                  <option key={optIdx} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {/* Additional Text Field */}
            {field.type === 'text' && (
              <input
                type="text"
                placeholder="Escribe tu respuesta..."
                value={formData[field.id] || ''}
                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                required={field.required}
                className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-[#2848F0]"
              />
            )}
          </div>
        ))}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: buttonBg,
            color: buttonTextColor,
            borderRadius: `${element.styles?.borderRadius ?? 12}px`,
          }}
          className="w-full py-3 px-4 font-bold font-['Poppins'] text-xs sm:text-sm shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
