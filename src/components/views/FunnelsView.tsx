import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FunnelPage } from '../../types';
import {
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sliders,
  Eye,
  Globe,
  Lock,
  ChevronRight,
  Sparkles,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface FunnelsViewProps {
  onOpenVisualEditorForPage: (page: FunnelPage, funnelId?: string) => void;
  onOpenPublicFunnel: () => void;
}

export const FunnelsView: React.FC<FunnelsViewProps> = ({
  onOpenVisualEditorForPage,
  onOpenPublicFunnel,
}) => {
  const {
    funnels,
    activeFunnel,
    setActiveFunnelId,
    createFunnel,
    deleteFunnel,
    togglePublishFunnel,
    organization,
    planEntitlements,
    openUpgradeModal,
  } = useApp();

  const [newFunnelName, setNewFunnelName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [funnelToDelete, setFunnelToDelete] = useState<any | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFunnelName.trim()) return;

    const created = createFunnel(newFunnelName.trim());
    if (created) {
      setNewFunnelName('');
      setShowCreateModal(false);
    }
  };

  const getPageIconLabel = (pageType: string) => {
    switch (pageType) {
      case 'landing':
        return { num: '1', title: 'Landing de Captura', desc: 'Titular de alto impacto y llamada a la acción' };
      case 'vsl':
        return { num: '2', title: 'VSL / Carta de Ventas', desc: 'Video de ventas explicativo de 12 min' };
      case 'qualification':
        return { num: '3', title: 'Filtro de Calificación', desc: 'Cuestionario que suma puntos por respuesta' };
      case 'calendar':
        return { num: '4', title: 'Calendario de Citas', desc: 'Reserva nativa con selector de día y hora' };
      case 'thank_you':
        return { num: '5', title: 'Página de Gracias', desc: 'Confirmación e instrucciones previas a la llamada' };
      default:
        return { num: '•', title: pageType, desc: '' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Limits */}
      <div className="p-4 bg-white rounded-xl border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold font-['Poppins'] text-[#121111]">
            Tus Embudos Comerciales ({funnels.length} / {planEntitlements.funnel_limit})
          </h2>
          <p className="text-xs text-[#5B5B66] font-['Inter']">
            Cada embudo incluye la arquitectura de 5 pasos optimizada para convertir tráfico en citas.
          </p>
        </div>

        <button
          onClick={() => {
            if (funnels.length >= planEntitlements.funnel_limit) {
              openUpgradeModal(
                'Límite de Embudos',
                'Has alcanzado el límite de 1 embudo en el Plan Free.',
                'Pasa al Plan Basic para crear hasta 5 embudos independientes.'
              );
            } else {
              setShowCreateModal(true);
            }
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nuevo Embudo</span>
        </button>
      </div>

      {/* Funnels List */}
      <div className="space-y-6">
        {funnels.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-zinc-300 shadow-xs flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2848F0] flex items-center justify-center mb-4">
              <Filter className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold font-['Poppins'] text-zinc-900 mb-1">
              No tienes ningún embudo de ventas creado
            </h3>
            <p className="text-xs text-zinc-500 font-['Inter'] max-w-md mb-6 leading-relaxed">
              Has eliminado todos tus embudos. Puedes crear un nuevo embudo de venta en cualquier momento para comenzar a convertir tráfico en citas calificadas.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Nuevo Embudo</span>
            </button>
          </div>
        ) : (
          funnels.map((funnel) => {
            const isSelected = funnel.id === activeFunnel?.id;

            return (
              <div
                key={funnel.id}
                className={`bg-white rounded-xl border transition-all shadow-xs overflow-hidden ${
                  isSelected ? 'border-[#2848F0] ring-1 ring-[#2848F0]' : 'border-zinc-200'
                }`}
              >
              {/* Funnel Header */}
              <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-zinc-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
                      {funnel.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        funnel.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {funnel.status === 'published' ? '● Publicado' : '○ Borrador'}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-zinc-500 mt-1 flex items-center gap-2">
                    <span>https://ssp.app/f/{funnel.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublishFunnel(funnel.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 hover:bg-zinc-100 transition-colors cursor-pointer"
                  >
                    {funnel.status === 'published' ? 'Despublicar' : 'Publicar Embudo'}
                  </button>

                  <button
                    onClick={() => {
                      setActiveFunnelId(funnel.id);
                      onOpenPublicFunnel();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-800 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Probar Flujo en Vivo</span>
                  </button>

                  <button
                    onClick={() => setFunnelToDelete(funnel)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar embudo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>

              {/* 5 Funnel Steps Architecture */}
              <div className="p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 font-['Inter']">
                  Las 5 Páginas del Embudo Integrado
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {funnel.pages.map((page) => {
                    const info = getPageIconLabel(page.page_type);

                    return (
                      <div
                        key={page.id}
                        className="p-3.5 rounded-xl border border-zinc-200 hover:border-[#2848F0] hover:shadow-sm transition-all bg-white flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="w-6 h-6 rounded-full bg-blue-50 text-[#2848F0] text-xs font-bold flex items-center justify-center font-['Poppins']">
                              {info.num}
                            </span>
                            <span className="text-[10px] text-zinc-400 uppercase font-mono">
                              Paso {page.position}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold font-['Poppins'] text-[#121111] group-hover:text-[#2848F0] transition-colors">
                            {page.title}
                          </h4>
                          <p className="text-[11px] text-[#5B5B66] font-['Inter'] mt-1 leading-snug">
                            {info.desc}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between">
                          <button
                            onClick={() => {
                              setActiveFunnelId(funnel.id);
                              onOpenVisualEditorForPage({ ...page, funnel_id: funnel.id }, funnel.id);
                            }}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-[#2848F0] bg-blue-50/70 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                          >
                            <Sliders className="w-3 h-3" />
                            <span>Editar</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })
      )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-200">
            <h3 className="text-base font-bold font-['Poppins'] text-[#121111]">
              Crear Nuevo Embudo Comercial
            </h3>
            <p className="text-xs text-[#5B5B66] font-['Inter'] mt-1">
              Se creará automáticamente con la plantilla base de 5 páginas lista para editar.
            </p>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700">Nombre del Embudo:</label>
                <input
                  type="text"
                  placeholder="Ej: Sesión Estratégica High-Ticket Q4"
                  value={newFunnelName}
                  onChange={(e) => setNewFunnelName(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs border border-zinc-200 rounded-lg focus:outline-[#2848F0]"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2848F0] hover:bg-[#1f38bf] rounded-lg shadow-sm cursor-pointer"
                >
                  Crear Embudo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Funnel Confirmation Modal */}
      {funnelToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold font-['Poppins'] text-zinc-900">
                  ¿Eliminar Embudo de Venta?
                </h3>
                <p className="text-xs text-zinc-500 font-['Inter']">
                  Esta acción eliminará el embudo y todas sus páginas asociadas.
                </p>
              </div>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 my-4 text-xs font-['Inter'] space-y-1">
              <div className="font-semibold text-zinc-800">
                Embudo: <span className="font-normal text-zinc-600">{funnelToDelete.name}</span>
              </div>
              <div className="text-zinc-500 font-mono text-[11px]">
                https://ssp.app/f/{funnelToDelete.slug}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFunnelToDelete(null)}
                className="px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteFunnel(funnelToDelete.id);
                  setFunnelToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sí, Eliminar Embudo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
