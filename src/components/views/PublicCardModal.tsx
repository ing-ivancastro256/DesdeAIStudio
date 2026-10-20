import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface PublicCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFunnel: () => void;
}

export const PublicCardModal: React.FC<PublicCardModalProps> = ({
  isOpen,
  onClose,
  onOpenFunnel,
}) => {
  const { virtualCard, planEntitlements, referralCode, organization } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-[36px] bg-[#121111] p-3 shadow-2xl border-4 border-zinc-700 max-h-[92vh] flex flex-col">
        {/* Close Button Floating */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg hover:bg-zinc-100 z-50 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Screen container */}
        <div
          style={{ backgroundColor: virtualCard.theme_settings.bg_color || '#FBFBFD' }}
          className="w-full h-full rounded-[28px] overflow-y-auto p-5 flex flex-col justify-between border border-zinc-200 text-center"
        >
          {/* Top content */}
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
              <h2 className="text-xl font-bold font-['Poppins'] text-[#121111]">
                {virtualCard.display_name}
              </h2>
              <p className="text-xs font-semibold text-[#2848F0] mt-0.5 font-['Inter']">
                {virtualCard.headline}
              </p>
              <p className="text-xs text-[#5B5B66] mt-2 font-['Inter'] leading-relaxed">
                {virtualCard.bio}
              </p>
            </div>

            {/* Social Icons Bar */}
            <div className="flex items-center justify-center gap-3 pt-1">
              {virtualCard.social_links.instagram && (
                <a
                  href={virtualCard.social_links.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:text-pink-600 shadow-2xs"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {virtualCard.social_links.linkedin && (
                <a
                  href={virtualCard.social_links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:text-blue-700 shadow-2xs"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {virtualCard.social_links.youtube && (
                <a
                  href={virtualCard.social_links.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:text-red-600 shadow-2xs"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {virtualCard.social_links.whatsapp && (
                <a
                  href={virtualCard.social_links.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:text-emerald-600 shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Primary Funnel CTA Button */}
            <button
              onClick={() => {
                onClose();
                onOpenFunnel();
              }}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] shadow-md transition-all cursor-pointer font-['Poppins'] flex items-center justify-center gap-2 group"
            >
              <span>{virtualCard.funnel_button_text}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Custom Links */}
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

          {/* Footer Branding Badge (Free requirement: viral badge with ref) */}
          <div className="pt-6 pb-2">
            {!planEntitlements.remove_branding ? (
              <a
                href={`https://scalesalespro.com?ref=${referralCode || organization.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-zinc-200 text-[10px] font-bold text-zinc-700 shadow-2xs font-['Inter'] hover:border-[#2848F0] transition-colors"
              >
                <span>Crea la tuya gratis con</span>
                <strong className="text-[#121111]">Scale Sales Pro</strong>
              </a>
            ) : (
              <div className="text-[10px] text-zinc-400 font-['Inter']">
                {organization.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
