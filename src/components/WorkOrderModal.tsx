import React, { useState } from 'react';
import { SparePart, WorkOrder } from '../types';
import { soundFX } from '../utils/audio';

interface WorkOrderModalProps {
  part: SparePart;
  workOrders: WorkOrder[];
  onAssign: (partId: string, orderId: string, technician: string) => void;
  onClose: () => void;
}

export const WorkOrderModal: React.FC<WorkOrderModalProps> = ({
  part,
  workOrders,
  onAssign,
  onClose,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<string>(workOrders[0]?.id || '');
  const [technician, setTechnician] = useState<string>('Carlos M.');
  const [notes, setNotes] = useState<string>('Asignado a reparación en curso.');

  const handleConfirm = () => {
    soundFX.playSuccessChime();
    onAssign(part.id, selectedOrder, technician);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-lg border border-outline-variant shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">build_circle</span>
            <div>
              <h3 className="font-headline-md text-sm font-bold text-on-surface">Salida a Orden de Trabajo</h3>
              <p className="font-code-sm text-[10px] text-tertiary">Descontar repuesto para reparación activa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Selected Part Summary */}
        <div className="p-3 bg-surface-container/50 border-b border-outline-variant flex items-center gap-3">
          <img
            src={part.images[0]?.url}
            alt={part.name}
            className="w-14 h-14 object-cover rounded border border-outline-variant"
          />
          <div className="min-w-0 flex-1">
            <p className="font-title-sm text-xs font-bold text-on-surface truncate">{part.name}</p>
            <p className="font-code-sm text-[11px] text-primary">{part.sku} • {part.drawer}</p>
            <p className="font-label-sm text-[11px] text-tertiary mt-0.5">
              Stock actual: <strong className="text-on-surface">{part.stock} uds</strong>
            </p>
          </div>
        </div>

        {/* Form Selection */}
        <div className="p-4 space-y-3">
          <div>
            <label className="block font-label-sm text-xs text-on-surface font-semibold mb-1">
              Seleccionar Orden de Trabajo Activa:
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {workOrders.map((wo) => (
                <div
                  key={wo.id}
                  onClick={() => setSelectedOrder(wo.id)}
                  className={`p-2 rounded border cursor-pointer transition-all flex items-center justify-between ${
                    selectedOrder === wo.id
                      ? 'bg-primary-fixed/40 border-primary shadow-xs'
                      : 'bg-surface-container-lowest border-outline-variant hover:bg-surface-container-low'
                  }`}
                >
                  <div>
                    <span className="font-code-sm text-xs font-bold text-primary block">{wo.id}</span>
                    <span className="font-body-md text-xs text-on-surface font-semibold">{wo.title} ({wo.device})</span>
                    <span className="font-label-sm text-[10px] text-tertiary block">Técnico: {wo.technician}</span>
                  </div>
                  <span className={`text-[10px] font-metric-badge px-2 py-0.5 rounded font-semibold ${
                    wo.status === 'En Proceso' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {wo.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-xs text-on-surface font-semibold mb-1">
              Técnico Asignado:
            </label>
            <select
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded p-2 text-xs font-body-md"
            >
              <option value="Carlos M. (#04)">Carlos M. (#04) - Especialista Micro-soldadura</option>
              <option value="Marcos T. (#02)">Marcos T. (#02) - Banco Pantallas</option>
              <option value="Laura S. (#01)">Laura S. (#01) - Control Calidad</option>
            </select>
          </div>

          <div>
            <label className="block font-label-sm text-xs text-on-surface font-semibold mb-1">
              Notas de intervención:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded p-2 text-xs font-body-md"
              placeholder="Notas breves de salida..."
            />
          </div>
        </div>

        {/* Action button */}
        <div className="p-3 bg-surface-container-low border-t border-outline-variant flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-surface border border-outline-variant rounded text-xs font-semibold hover:bg-surface-container"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={part.stock <= 0}
            className="flex-1 py-2 bg-primary text-on-primary rounded text-xs font-semibold hover:bg-primary-container active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            Confirmar Salida (-1)
          </button>
        </div>
      </div>
    </div>
  );
};
