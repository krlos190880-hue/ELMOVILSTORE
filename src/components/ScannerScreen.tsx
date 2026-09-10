import React, { useState } from 'react';
import { SparePart, WorkOrder, RecentScan } from '../types';
import { soundFX } from '../utils/audio';

interface ScannerScreenProps {
  parts: SparePart[];
  workOrders: WorkOrder[];
  recentScans: RecentScan[];
  onClose: () => void;
  onConfirmMovement: (partId: string, type: 'salida' | 'entrada', qty: number, orderRef: string) => void;
  onOpenDetail: (part: SparePart) => void;
}

export const ScannerScreen: React.FC<ScannerScreenProps> = ({
  parts,
  workOrders,
  recentScans,
  onClose,
  onConfirmMovement,
  onOpenDetail,
}) => {
  const [selectedMode, setSelectedMode] = useState<'salida' | 'entrada' | 'consulta'>('salida');
  const [torchActive, setTorchActive] = useState(false);
  const [scannedPartIndex, setScannedPartIndex] = useState(1); // Default to iPhone 13 Battery
  const [movementQty, setMovementQty] = useState(1);
  const [selectedOrderRef, setSelectedOrderRef] = useState('OT #1042');
  const [deliveryNote, setDeliveryNote] = useState('ALB-8831');
  const [showHistory, setShowHistory] = useState(false);

  const currentScannedPart = parts[scannedPartIndex] || parts[0];

  const handleCycleScannedPart = () => {
    soundFX.playScanBeep();
    setScannedPartIndex((prev) => (prev + 1) % parts.length);
  };

  const handleToggleTorch = () => {
    soundFX.playClick();
    setTorchActive(!torchActive);
  };

  const handleConfirm = () => {
    soundFX.playSuccessChime();
    const ref = selectedMode === 'salida' ? selectedOrderRef : deliveryNote;
    onConfirmMovement(currentScannedPart.id, selectedMode === 'salida' ? 'salida' : 'entrada', movementQty, ref);
  };

  return (
    <div className="relative min-h-screen bg-black text-on-surface flex flex-col justify-between antialiased select-none overflow-x-hidden">
      {/* 1. TOP BAR / APP BAR (HUD) */}
      <header className="absolute top-0 left-0 w-full z-30 px-3 py-2 flex items-center justify-between bg-gradient-to-b from-black/85 via-black/50 to-transparent">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-surface-container-lowest/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-surface-container-lowest/30 active:scale-95 transition-transform"
          title="Cerrar Escáner"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* MODE SELECTOR PILL */}
        <div className="flex bg-surface-container-lowest/20 backdrop-blur-md rounded-full p-0.5 border border-white/10">
          <button
            onClick={() => {
              soundFX.playClick();
              setSelectedMode('salida');
            }}
            className={`px-3 py-1 rounded-full font-label-sm text-xs font-semibold transition-all ${
              selectedMode === 'salida'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Salida Reparación
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setSelectedMode('entrada');
            }}
            className={`px-3 py-1 rounded-full font-label-sm text-xs font-semibold transition-all ${
              selectedMode === 'entrada'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Entrada Pedido
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setSelectedMode('consulta');
            }}
            className={`px-2.5 py-1 rounded-full font-label-sm text-xs font-semibold transition-all ${
              selectedMode === 'consulta'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Consulta
          </button>
        </div>

        {/* TORCH TOGGLE BUTTON */}
        <button
          onClick={handleToggleTorch}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            torchActive
              ? 'bg-secondary-container text-black ring-4 ring-secondary-container/40'
              : 'bg-surface-container-lowest/20 text-white backdrop-blur-md hover:bg-surface-container-lowest/30'
          }`}
          title={torchActive ? 'Apagar Linterna' : 'Encender Linterna'}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: torchActive ? "'FILL' 1" : "'FILL' 0" }}>
            flashlight_on
          </span>
        </button>
      </header>

      {/* 2. CAMERA VIEWFINDER & OPTICAL SCANNER STAGE */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center overflow-hidden bg-zinc-950">
        {/* Background Specimen Image representing workshop microscope / camera feed */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <img
            src={currentScannedPart.images[0]?.url}
            alt="Microscopio de inspección"
            className="w-full h-full object-cover opacity-80 filter brightness-95 contrast-105"
          />
          {/* Torch Light simulation overlay */}
          {torchActive && (
            <div className="absolute inset-0 bg-radial from-secondary-container/25 via-transparent to-transparent pointer-events-none"></div>
          )}
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/85 pointer-events-none"></div>
        </div>

        {/* Optical Alignment Grid Overlay */}
        <div className="absolute inset-0 optical-grid pointer-events-none z-10 opacity-30"></div>

        {/* TECHNICAL HUD TELEMETRY OVERLAY */}
        <div className="absolute top-14 left-4 z-20 flex flex-col gap-1 font-code-sm text-[10px] text-secondary-container bg-black/60 px-2 py-1.5 rounded backdrop-blur-xs border border-secondary-container/20">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-ping"></span>
            <span className="font-bold tracking-wider">OPTICAL-AI ACTIVE</span>
          </div>
          <span className="text-white/70">FPS: 60 • ISO 120 • 48MP MACRO</span>
          <span className="text-secondary-container font-semibold">GAVETA EN FOCO: {currentScannedPart.drawer}</span>
        </div>

        {/* Simulated Barcode / QR Target Box (Reticle) */}
        <div className="relative z-20 w-64 h-64 sm:w-72 sm:h-72 border-2 border-secondary-container/50 rounded-lg flex items-center justify-center shadow-[0_0_25px_rgba(57,184,253,0.3)]">
          {/* Corner brackets */}
          <span className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-secondary-container rounded-tl-sm"></span>
          <span className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-secondary-container rounded-tr-sm"></span>
          <span className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-secondary-container rounded-bl-sm"></span>
          <span className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-secondary-container rounded-br-sm"></span>

          {/* Animated Laser Scanning Line */}
          <div className="scanner-line absolute left-2 right-2 h-0.5 bg-secondary-container shadow-[0_0_12px_#39b8fd]"></div>

          {/* Optical crosshairs center */}
          <div className="w-4 h-4 border border-dashed border-secondary-container/70 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-secondary-container rounded-full"></div>
          </div>

          {/* Barcode code badge inside frame */}
          <div className="absolute bottom-2 bg-black/80 text-secondary-container px-2 py-0.5 rounded font-code-sm text-[10px] tracking-wider border border-secondary-container/40">
            {currentScannedPart.barcode}
          </div>
        </div>

        {/* Quick Cycle Simulator Button */}
        <div className="absolute bottom-36 sm:bottom-40 z-20 flex items-center gap-2">
          <button
            onClick={handleCycleScannedPart}
            className="px-3 py-1.5 bg-black/75 hover:bg-black/90 text-secondary-container border border-secondary-container/40 rounded-full font-code-sm text-xs backdrop-blur-md flex items-center gap-1.5 active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">switch_access_shortcut</span>
            <span>Simular escaneo de otra pieza ({currentScannedPart.brand})</span>
          </button>
        </div>
      </div>

      {/* 3. INVENTORY DETECTION BOTTOM SHEET (HUD) */}
      <div className="relative z-30 w-full bg-surface rounded-t-2xl shadow-2xl p-4 border-t border-outline-variant/60 flex flex-col gap-3">
        {/* Drag handle / Indicator */}
        <div className="w-12 h-1 bg-outline-variant rounded-full mx-auto -mt-1 cursor-pointer" onClick={() => setShowHistory(!showHistory)}></div>

        {/* PART DETECTION CARD */}
        <div className="flex items-start gap-3">
          <div
            className="relative w-16 h-16 rounded bg-surface-container-low border border-outline-variant overflow-hidden shrink-0 cursor-pointer group"
            onClick={() => onOpenDetail(currentScannedPart)}
          >
            <img
              src={currentScannedPart.images[0]?.url}
              alt={currentScannedPart.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <span className="absolute bottom-0 inset-x-0 bg-inverse-surface/80 text-[8px] font-code-sm text-inverse-on-surface text-center py-0.5">
              VER
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              {currentScannedPart.condition === 'segunda_mano' ? (
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-950 border border-amber-300 font-code-sm text-[10px] font-bold rounded flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[11px] text-amber-800">recycling</span>
                  2ª MANO
                </span>
              ) : (
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-900 border border-blue-200 font-code-sm text-[10px] font-bold rounded">
                  NUEVO
                </span>
              )}
              <span className="px-1.5 py-0.5 bg-primary-fixed text-on-primary-fixed font-code-sm text-[10px] font-bold rounded">
                {currentScannedPart.qualityBadge}
              </span>
              <span className="text-tertiary text-xs font-code-sm">{currentScannedPart.sku}</span>
            </div>
            <h2
              className="font-headline-md text-sm font-bold text-on-surface truncate cursor-pointer hover:text-primary mt-0.5"
              onClick={() => onOpenDetail(currentScannedPart)}
            >
              {currentScannedPart.name}
            </h2>
            {currentScannedPart.donorDevice && (
              <p className="text-[10px] text-tertiary truncate">
                <strong className="text-on-surface-variant font-medium">Donante:</strong> {currentScannedPart.donorDevice}
              </p>
            )}
            <div className="flex items-center gap-2 mt-0.5 text-xs">
              <span className="text-primary font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                {currentScannedPart.drawer}
              </span>
              <span className="text-outline-variant">•</span>
              <span className="font-metric-badge font-bold text-on-surface">
                Stock actual: <strong className="text-primary">{currentScannedPart.stock} uds</strong>
              </span>
            </div>
          </div>
        </div>

        {/* CONTEXT CONTROLS ACCORDING TO SELECTED MODE */}
        {selectedMode === 'salida' && (
          <div className="bg-surface-container-low rounded p-2.5 space-y-2 border border-outline-variant/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-label-sm font-semibold text-on-surface-variant">Asignar a Orden de Trabajo:</span>
              <select
                value={selectedOrderRef}
                onChange={(e) => setSelectedOrderRef(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant rounded font-code-sm text-xs text-primary font-bold px-2 py-1"
              >
                {workOrders.map((wo) => (
                  <option key={wo.id} value={wo.id}>
                    {wo.id} - {wo.title} ({wo.device})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs font-semibold text-on-surface-variant">Cantidad a retirar:</span>
              <div className="flex items-center border border-outline-variant rounded bg-surface">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setMovementQty(Math.max(1, movementQty - 1));
                  }}
                  className="w-8 h-8 flex items-center justify-center font-bold text-sm text-on-surface-variant hover:bg-surface-container"
                >
                  -
                </button>
                <span className="w-8 text-center font-metric-badge font-bold text-xs text-primary">{movementQty}</span>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setMovementQty(movementQty + 1);
                  }}
                  className="w-8 h-8 flex items-center justify-center font-bold text-sm text-on-surface-variant hover:bg-surface-container"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedMode === 'entrada' && (
          <div className="bg-surface-container-low rounded p-2.5 space-y-2 border border-outline-variant/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-label-sm font-semibold text-on-surface-variant">Referencia Albarán / Factura:</span>
              <input
                type="text"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant rounded font-code-sm text-xs text-primary font-bold px-2 py-1 w-32 text-right"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs font-semibold text-on-surface-variant">Unidades a ingresar:</span>
              <div className="flex items-center border border-outline-variant rounded bg-surface">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setMovementQty(Math.max(1, movementQty - 1));
                  }}
                  className="w-8 h-8 flex items-center justify-center font-bold text-sm text-on-surface-variant hover:bg-surface-container"
                >
                  -
                </button>
                <span className="w-8 text-center font-metric-badge font-bold text-xs text-primary">{movementQty}</span>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setMovementQty(movementQty + 1);
                  }}
                  className="w-8 h-8 flex items-center justify-center font-bold text-sm text-on-surface-variant hover:bg-surface-container"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRIMARY ACTION BUTTON */}
        <div className="flex items-center gap-2">
          {selectedMode === 'consulta' ? (
            <button
              onClick={() => onOpenDetail(currentScannedPart)}
              className="flex-1 py-2.5 bg-primary text-on-primary rounded font-headline-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow active:scale-[0.98] transition-transform hover:bg-primary-container"
            >
              <span className="material-symbols-outlined text-base">visibility</span>
              <span>Abrir Ficha Técnica Completa</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => onOpenDetail(currentScannedPart)}
                className="px-3 py-2.5 bg-surface-container text-on-surface rounded font-label-sm text-xs font-semibold hover:bg-surface-container-high active:scale-95 transition-transform"
                title="Ver Ficha"
              >
                <span className="material-symbols-outlined text-base">info</span>
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 bg-primary text-on-primary rounded font-headline-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow active:scale-[0.98] transition-transform hover:bg-primary-container"
              >
                <span className="material-symbols-outlined text-base">
                  {selectedMode === 'salida' ? 'output' : 'input'}
                </span>
                <span>
                  Confirmar {selectedMode === 'salida' ? `Salida (${movementQty} ud)` : `Entrada (+${movementQty})`}
                </span>
              </button>
            </>
          )}
        </div>

        {/* RECENT SCANS TOGGLE DRAWER */}
        <div className="border-t border-outline-variant/40 pt-2">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowHistory(!showHistory)}
          >
            <span className="font-label-sm text-[10px] text-tertiary uppercase tracking-wider font-semibold">
              Últimos escaneos del día ({recentScans.length})
            </span>
            <span className="material-symbols-outlined text-sm text-tertiary">
              {showHistory ? 'expand_less' : 'expand_more'}
            </span>
          </div>

          {showHistory && (
            <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto">
              {recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between p-1.5 bg-surface-container-lowest rounded border border-outline-variant/40 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${scan.dotColor}`}></span>
                    <span className="font-semibold text-on-surface truncate max-w-[140px]">{scan.partName}</span>
                    <span className="font-code-sm text-[10px] text-tertiary">{scan.sku}</span>
                  </div>
                  <span className="font-code-sm text-[10px] text-primary font-bold">{scan.refCode}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
