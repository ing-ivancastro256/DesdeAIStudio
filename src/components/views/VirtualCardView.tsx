import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ExternalLink,
  Copy,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Smartphone,
  Globe,
  Share2,
  Eye,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface VirtualCardViewProps {
  onOpenVisualEditor: () => void;
  onOpenPublicCard: () => void;
}

export const VirtualCardView: React.FC<VirtualCardViewProps> = ({
  onOpenVisualEditor,
  onOpenPublicCard,
}) => {
  const {
    virtualCard,
    updateVirtualCard,
    togglePublishCard,
    organization,
    planEntitlements,
    openUpgradeModal,
    showToast,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const cardUrl = `https://ssp.app/c/${virtualCard.slug}`;

  const copyUrl = () => {
    navigator.clipboard?.writeText(cardUrl);
    setCopied(true);
    showToast('Enlace de tu tarjeta copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  const addLink = () => {
    const newLink = {
      id: `link_${Date.now()}`,
      label: 'Nuevo Enlace Profesional',
      url: 'https://',
      position: virtualCard.links.length + 1,
      is_active: true,
    };
    updateVirtualCard({
      links: [...virtualCard.links, newLink],
    });
  };

  const removeLink = (linkId: string) => {
    updateVirtualCard({
      links: virtualCard.links.filter((l) => l.id !== linkId),
    });
  };

  const updateLink = (linkId: string, label: string, url: string) => {
    updateVirtualCard({
      links: virtualCard.links.map((l) =>
        l.id === linkId ? { ...l, label, url } : l
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="p-4 bg-white rounded-xl border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2 rounded-lg bg-blue-50 text-[#2848F0]">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-zinc-500 font-['Inter']">Enlace público de tu tarjeta:</div>
            <div className="text-sm font-mono font-bold text-zinc-900 flex items-center gap-2">
              <span>{cardUrl}</span>
              <button
                onClick={copyUrl}
                className="p-1 hover:bg-zinc-100 rounded text-zinc-500 hover:text-zinc-900 cursor-pointer"
                title="Copiar enlace"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={togglePublishCard}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              virtualCard.is_published
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-zinc-100 text-zinc-600 border-zinc-200'
            }`}
          >
            {virtualCard.is_published ? '● Publicada en Vivo' : '○ Modo Borrador'}
          </button>

          <button
            onClick={onOpenPublicCard}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Vista Pública</span>
          </button>

          <button
            onClick={onOpenVisualEditor}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>Editar en Editor Visual</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Editor vs Phone Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fast Form Settings */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Profile Information */}
          <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
              Información del Perfil Comercial
            </h3>

            <div>
              <label className="text-xs font-semibold text-zinc-700 font-['Inter']">Nombre que se muestra:</label>
              <input
                type="text"
                value={virtualCard.display_name}
                onChange={(e) => updateVirtualCard({ display_name: e.target.value })}
                className="w-full mt-1 p-2.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 font-['Inter']">Titular o Especialidad:</label>
              <input
                type="text"
                value={virtualCard.headline}
                onChange={(e) => updateVirtualCard({ headline: e.target.value })}
                className="w-full mt-1 p-2.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 font-['Inter']">Biografía o Propuesta de Valor:</label>
              <textarea
                rows={3}
                value={virtualCard.bio}
                onChange={(e) => updateVirtualCard({ bio: e.target.value })}
                className="w-full mt-1 p-2.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 font-['Inter']">Foto de Perfil (URL de imagen):</label>
              <input
                type="text"
                value={virtualCard.avatar_url}
                onChange={(e) => updateVirtualCard({ avatar_url: e.target.value })}
                className="w-full mt-1 p-2.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
              />
            </div>
          </div>

          {/* Funnel Call to Action Button */}
          <div className="p-6 bg-white rounded-xl border border-blue-200 shadow-xs space-y-4 bg-blue-50/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
                  Botón Principal al Embudo de Ventas
                </h3>
                <p className="text-xs text-[#5B5B66] font-['Inter']">
                  Este es el llamado a la acción más visible de tu tarjeta para enviar tráfico a tu VSL y calendario.
                </p>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-[#2848F0] text-white rounded">
                Alta Conversión
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 font-['Inter']">Texto del Botón:</label>
              <input
                type="text"
                value={virtualCard.funnel_button_text}
                onChange={(e) => updateVirtualCard({ funnel_button_text: e.target.value })}
                className="w-full mt-1 p-2.5 text-xs border border-blue-200 rounded-lg focus:outline-[#2848F0] bg-white font-semibold text-[#121111]"
              />
            </div>
          </div>

          {/* Custom Links List */}
          <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
                  Enlaces Adicionales
                </h3>
                <p className="text-xs text-[#5B5B66] font-['Inter']">
                  Podcasts, lead magnets, WhatsApp o recursos que quieras compartir.
                </p>
              </div>
              <button
                onClick={addLink}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#2848F0] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Enlace</span>
              </button>
            </div>

            <div className="space-y-3">
              {virtualCard.links.map((link) => (
                <div
                  key={link.id}
                  className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center gap-3"
                >
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateLink(link.id, e.target.value, link.url)}
                      placeholder="Texto del botón"
                      className="w-full p-2 text-xs border border-zinc-200 rounded-md bg-white font-medium"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateLink(link.id, link.label, e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2 text-xs border border-zinc-200 rounded-md bg-white text-zinc-600"
                    />
                  </div>

                  <button
                    onClick={() => removeLink(link.id)}
                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar enlace"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
              Redes Sociales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-zinc-600 font-medium">Instagram URL:</label>
                <input
                  type="text"
                  value={virtualCard.social_links.instagram || ''}
                  onChange={(e) =>
                    updateVirtualCard({
                      social_links: { ...virtualCard.social_links, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/..."
                  className="w-full mt-1 p-2 text-xs border border-zinc-200 rounded-lg"
                />
              </div>
              <div>
                <label className="text-zinc-600 font-medium">LinkedIn URL:</label>
                <input
                  type="text"
                  value={virtualCard.social_links.linkedin || ''}
                  onChange={(e) =>
                    updateVirtualCard({
                      social_links: { ...virtualCard.social_links, linkedin: e.target.value },
                    })
                  }
                  placeholder="https://linkedin.com/in/..."
                  className="w-full mt-1 p-2 text-xs border border-zinc-200 rounded-lg"
                />
              </div>
              <div>
                <label className="text-zinc-600 font-medium">YouTube URL:</label>
                <input
                  type="text"
                  value={virtualCard.social_links.youtube || ''}
                  onChange={(e) =>
                    updateVirtualCard({
                      social_links: { ...virtualCard.social_links, youtube: e.target.value },
                    })
                  }
                  placeholder="https://youtube.com/@..."
                  className="w-full mt-1 p-2 text-xs border border-zinc-200 rounded-lg"
                />
              </div>
              <div>
                <label className="text-zinc-600 font-medium">WhatsApp directo:</label>
                <input
                  type="text"
                  value={virtualCard.social_links.whatsapp || ''}
                  onChange={(e) =>
                    updateVirtualCard({
                      social_links: { ...virtualCard.social_links, whatsapp: e.target.value },
                    })
                  }
                  placeholder="https://wa.me/..."
                  className="w-full mt-1 p-2 text-xs border border-zinc-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mobile Mockup */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-20 w-full max-w-sm">
            <div className="text-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-['Inter']">
                Vista Previa Móvil en Vivo
              </span>
            </div>

            {/* Smartphone Frame */}
            <div className="w-full bg-[#121111] rounded-[42px] p-3 shadow-2xl border-4 border-zinc-800">
              {/* Dynamic Screen */}
              <div
                style={{ backgroundColor: virtualCard.theme_settings.bg_color || '#FBFBFD' }}
                className="w-full rounded-[34px] overflow-hidden min-h-[580px] p-6 flex flex-col justify-between border border-zinc-200 text-center"
              >
                {/* Content */}
                <div className="space-y-4">
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-2 border-white shadow-md">
                    <img
                      src={
                        virtualCard.avatar_url ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
                      }
                      alt={virtualCard.display_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h4 className="text-lg font-bold font-['Poppins'] text-[#121111]">
                      {virtualCard.display_name}
                    </h4>
                    <p className="text-xs font-semibold text-[#2848F0] mt-0.5 font-['Inter']">
                      {virtualCard.headline}
                    </p>
                    <p className="text-xs text-[#5B5B66] mt-2 font-['Inter'] leading-relaxed">
                      {virtualCard.bio}
                    </p>
                  </div>

                  {/* Primary CTA Funnel Button */}
                  <button
                    onClick={onOpenPublicCard}
                    className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] shadow-md transition-all cursor-pointer font-['Poppins']"
                  >
                    {virtualCard.funnel_button_text}
                  </button>

                  {/* Other links */}
                  <div className="space-y-2 pt-2">
                    {virtualCard.links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full py-3 px-4 rounded-xl text-xs font-semibold text-[#121111] bg-white border border-zinc-200 shadow-2xs hover:bg-zinc-50 transition-colors font-['Inter']"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Footer Viral Branding Badge (Visible in Free, removable in Basic) */}
                <div className="pt-6 pb-2">
                  {!planEntitlements.remove_branding ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-zinc-200 text-[10px] font-bold text-zinc-700 shadow-2xs font-['Inter']">
                      <span>Crea la tuya gratis con</span>
                      <strong className="text-[#121111]">Scale Sales Pro</strong>
                    </div>
                  ) : (
                    <div className="text-[10px] text-zinc-400 font-['Inter']">
                      Marca blanca activa (Plan Basic)
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Free badge disclaimer */}
            {organization.plan_code === 'FREE' && (
              <div className="mt-4 p-3 rounded-lg bg-zinc-100 border border-zinc-200 text-center">
                <div className="text-xs text-[#5B5B66] font-['Inter']">
                  El sello viral inferior genera referidos para tu cuenta.
                </div>
                <button
                  onClick={() =>
                    openUpgradeModal(
                      'Eliminar Sello de Scale Sales Pro',
                      'En el Plan Basic puedes remover la marca de Scale Sales Pro y conectar tu propio dominio.',
                      'Aprovecha la promoción de activación por $20 USD durante 3 meses.'
                    )
                  }
                  className="text-xs font-bold text-[#2848F0] hover:underline mt-1 cursor-pointer"
                >
                  Pasa a Basic para eliminar el sello
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
