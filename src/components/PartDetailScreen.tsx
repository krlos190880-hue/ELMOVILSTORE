import React, { useState } from 'react';
import { SparePart } from '../types';
import { soundFX } from '../utils/audio';

interface PartDetailScreenProps {
  part: SparePart;
  onBack: () => void;
  onOpenScanner: () => void;
  onUpdateStock: (partId: string, delta: number) => void;
  onAssignWorkOrder: (part: SparePart) => void;
  onPrintThermalLabel: (part: SparePart) => void;
}

export const PartDetailScreen: React.FC<PartDetailScreenProps> = ({
  part,
  onBack,
  onOpenScanner,
  onUpdateStock,
  onAssignWorkOrder,
  onPrintThermalLabel,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isLowStock = part.stock > 0 && part.stock <= part.minStockAlert;
  const isOutOfStock = part.stock === 0;

  const grossMargin = part.pvpPrice - part.costPrice;
  const roiPercentage = part.costPrice > 0 ? ((grossMargin / part.costPrice) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col justify-between selection:bg-primary selection:text-on-primary font-body-md pb-24">
      {/* 1. TOP APP BAR */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md px-3 h-14 flex items-center justify-between border-b border-outline-variant/40 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div className="min-w-0">
            <h1 className="font-headline-lg-mobile text-sm sm:text-base font-bold text-on-surface tracking-tight truncate leading-tight">
              Ficha de Repuesto
            </h1>
            <p className="font-code-sm text-xs text-tertiary truncate">
              {part.sku} • {part.drawer}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPrintThermalLabel(part)}
            className="w-9 h-9 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container active:scale-95 transition-transform"
            title="Imprimir Etiqueta Térmica"
          >
            <span className="material-symbols-outlined text-[20px]">print</span>
          </button>
          <button
            onClick={onOpenScanner}
            className="w-9 h-9 flex items-center justify-center rounded text-primary hover:bg-surface-container active:scale-95 transition-transform"
            title="Escanear Código"
          >
            <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN TECHNICAL SPECIMEN VIEW */}
      <main className="w-full max-w-lg mx-auto px-3 pt-3 space-y-3">
        {/* CAROUSEL / SPECIMEN INSPECTOR HERO */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/60 shadow-xs overflow-hidden">
          {/* Active Photo Stage */}
          <div className="relative w-full aspect-[4/3] bg-surface-container-low flex items-center justify-center p-3 overflow-hidden">
            <img
              src={part.images[activeImageIndex]?.url || part.images[0]?.url}
              alt={part.images[activeImageIndex]?.caption || part.name}
              className="w-full h-full object-contain filter drop-shadow-md transition-all duration-300"
            />

            {/* Specimen Tag overlay */}
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
              <span className="bg-inverse-surface/85 text-inverse-on-surface font-code-sm text-[10px] px-2 py-0.5 rounded font-bold backdrop-blur-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-secondary-container">
                  {part.images[activeImageIndex]?.icon || 'photo_camera'}
                </span>
                {part.images[activeImageIndex]?.caption}
              </span>
            </div>

            {/* Carousel step dots */}
            {part.images.length > 1 && (
              <div className="absolute bottom-2 inset-x-0 flex justify-center items-center gap-1.5 z-10">
                {part.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      soundFX.playClick();
                      setActiveImageIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      activeImageIndex === idx ? 'w-5 bg-primary' : 'w-1.5 bg-outline-variant'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails strip */}
          {part.images.length > 1 && (
            <div className="p-2 border-t border-outline-variant/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {part.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveImageIndex(idx);
                  }}
                  className={`w-14 h-14 rounded border cursor-pointer overflow-hidden shrink-0 transition-all ${
                    activeImageIndex === idx ? 'border-2 border-primary shadow-xs' : 'border-outline-variant/60 opacity-70'
                  }`}
                >
                  <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HEADER BLOCK: NAME, SKU, QUALITY BADGE */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/60 p-3 shadow-xs space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 bg-primary text-on-primary font-title-sm text-[10px] font-bold rounded">
                  {part.brand}
                </span>
                {part.condition === 'segunda_mano' ? (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-950 border border-amber-300 font-title-sm text-[10px] font-bold rounded flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] text-amber-800">recycling</span>
                    SEGUNDA MANO / DESPIECE
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-900 border border-blue-200 font-title-sm text-[10px] font-bold rounded">
                    NUEVO A ESTRENAR
                  </span>
                )}
                <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed font-code-sm text-[10px] font-bold rounded">
                  {part.qualityBadge}
                </span>
                <span className="px-2 py-0.5 bg-surface-container text-tertiary font-label-sm text-[10px] rounded">
                  {part.warranty}
                </span>
              </div>
              <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface mt-1.5 leading-snug">
                {part.name}
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant mt-0.5">{part.subtitle}</p>
            </div>
          </div>

          {/* Barcode representation */}
          <div className="bg-surface-container-low rounded p-2 flex items-center justify-between font-code-sm text-xs border border-outline-variant/40">
            <div>
              <span className="text-[10px] text-tertiary block font-label-sm">Código de Barras EAN-13:</span>
              <span className="font-bold text-on-surface tracking-wider">{part.barcode}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-tertiary block font-label-sm">Ubicación Física:</span>
              <span className="font-bold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                {part.drawer}
              </span>
            </div>
          </div>

          {/* Hierarchy location breadcrumb */}
          <div className="flex items-center gap-1 text-[11px] font-code-sm text-tertiary pt-0.5">
            <span>{part.locationHierarchy.workshop}</span>
            <span>&gt;</span>
            <span>{part.locationHierarchy.module}</span>
            <span>&gt;</span>
            <span className="text-primary font-semibold">{part.locationHierarchy.drawer}</span>
            <span className="ml-auto text-[10px] font-bold text-primary bg-primary-fixed/40 px-1.5 py-0.5 rounded">
              {part.bayRack}
            </span>
          </div>
        </div>

        {/* SEGUNDA MANO: FICHA TÉCNICA DE RECUPERACIÓN & BANCO */}
        {part.condition === 'segunda_mano' && (
          <div className="bg-amber-50/70 rounded-lg border border-amber-300 p-3 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-800 text-[18px]">verified</span>
                <h3 className="font-headline-md text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Control de Calidad • Pieza de Segunda Mano
                </h3>
              </div>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded border border-amber-300">
                Recuperación Taller
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/80 p-2 rounded border border-amber-200">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 block">
                  Grado Técnico / Cosmético
                </span>
                <span className="font-bold text-amber-950 text-xs">
                  {part.conditionGrade || 'Grado A (Excelente)'}
                </span>
              </div>

              <div className="bg-white/80 p-2 rounded border border-amber-200">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 block">
                  Terminal Donante / Origen
                </span>
                <span className="font-bold text-amber-950 text-xs truncate block" title={part.donorDevice}>
                  {part.donorDevice || 'Despiece interno verificado'}
                </span>
              </div>
            </div>

            {/* Si tiene datos de batería */}
            {(part.healthPercentage !== undefined || part.batteryCycles !== undefined) && (
              <div className="grid grid-cols-2 gap-2 bg-white/90 p-2.5 rounded border border-amber-300/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                    <span className="material-symbols-outlined text-base">battery_charging_full</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-tertiary block font-semibold">Salud de Batería</span>
                    <span className="text-sm font-bold text-emerald-800">
                      {part.healthPercentage ?? '--'}% SOH
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 shrink-0">
                    <span className="material-symbols-outlined text-base">cached</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-tertiary block font-semibold">Ciclos Registrados</span>
                    <span className="text-sm font-bold text-blue-900">
                      {part.batteryCycles ?? '--'} ciclos
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Banco de pruebas */}
            {part.testedStatus && (
              <div className="bg-white/80 p-2 rounded border border-amber-200 text-xs">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 block mb-0.5">
                  Pruebas Realizadas en Banco
                </span>
                <p className="text-amber-950 font-medium leading-tight">
                  {part.testedStatus}
                </p>
              </div>
            )}
          </div>
        )}


        {/* STOCK & ECONOMIC TELEMETRY PANEL */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/60 p-3 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
            <div>
              <span className="font-label-sm text-[10px] text-tertiary uppercase tracking-wider font-semibold">
                Estado Actual del Stock
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                {isOutOfStock ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-metric-badge font-bold bg-red-50 text-red-700 border border-red-200">
                    <span className="w-2 h-2 rounded-full bg-red-600 mr-1.5"></span>
                    0 unidades • AGOTADO
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-metric-badge font-bold bg-amber-50 text-amber-800 border border-amber-300">
                    <span className="w-2 h-2 rounded-full bg-amber-600 mr-1.5 animate-pulse"></span>
                    {part.stock} unidades • STOCK BAJO
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-metric-badge font-bold bg-green-50 text-green-800 border border-green-300">
                    <span className="w-2 h-2 rounded-full bg-green-600 mr-1.5"></span>
                    {part.stock} unidades • EN STOCK
                  </span>
                )}
                <span className="text-[11px] font-label-sm text-tertiary">
                  (Mínimo: {part.minStockAlert} uds)
                </span>
              </div>
            </div>

            {/* In-place Stock Stepper */}
            <div className="flex items-center border border-outline-variant rounded bg-surface">
              <button
                onClick={() => {
                  soundFX.playClick();
                  onUpdateStock(part.id, -1);
                }}
                className="w-8 h-8 flex items-center justify-center font-bold text-sm text-on-surface-variant hover:bg-surface-container active:scale-90 transition-transform"
                title="Restar 1 unidad"
              >
                -
              </button>
              <span className="w-8 text-center font-metric-badge font-bold text-xs text-primary">
                {part.stock}
              </span>
              <button
                onClick={() => {
                  soundFX.playClick();
                  onUpdateStock(part.id, 1);
                }}
                className="w-8 h-8 flex items-center justify-center font-bold text-sm text-on-surface-variant hover:bg-surface-container active:scale-90 transition-transform"
                title="Añadir 1 unidad"
              >
                +
              </button>
            </div>
          </div>

          {/* Pricing & Gross Margin breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2 bg-surface-container-low rounded border border-outline-variant/30">
              <span className="font-label-sm text-[10px] text-tertiary block">Coste Unitario</span>
              <span className="font-code-sm text-xs font-bold text-on-surface">{part.costPrice.toFixed(2)} €</span>
            </div>
            <div className="p-2 bg-surface-container-low rounded border border-outline-variant/30">
              <span className="font-label-sm text-[10px] text-tertiary block">PVP Taller</span>
              <span className="font-code-sm text-xs font-bold text-primary">{part.pvpPrice.toFixed(2)} €</span>
            </div>
            <div className="p-2 bg-surface-container-low rounded border border-outline-variant/30">
              <span className="font-label-sm text-[10px] text-tertiary block">Margen Bruto</span>
              <span className="font-code-sm text-xs font-bold text-emerald-700">
                +{grossMargin.toFixed(2)} € ({roiPercentage}%)
              </span>
            </div>
          </div>
        </div>

        {/* TECHNICAL SPECIFICATIONS & HARDWARE COMPATIBILITY */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/60 p-3 shadow-xs space-y-2.5">
          <div className="flex items-center gap-1.5 border-b border-outline-variant/40 pb-2">
            <span className="material-symbols-outlined text-primary text-[18px]">build</span>
            <h3 className="font-headline-md text-xs font-bold text-on-surface uppercase tracking-wider">
              Compatibilidad de Hardware &amp; Banco
            </h3>
          </div>

          {/* Model Chips */}
          <div>
            <span className="font-label-sm text-[10px] text-tertiary block mb-1 font-semibold">
              Modelos A-Number Soportados:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {part.hardwareCompatibility.map((model) => (
                <span
                  key={model}
                  className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-code-sm text-xs font-medium border border-outline-variant/40"
                >
                  {model}
                </span>
              ))}
            </div>
          </div>

          {/* Panel / Hardware specs */}
          <div className="text-xs bg-surface-container-low p-2 rounded text-on-surface-variant font-body-md leading-relaxed border border-outline-variant/30">
            <p>
              <strong className="text-on-surface font-semibold">Especificaciones de banco: </strong>
              {part.panelSpecs}
            </p>
          </div>

          {/* Technical notes */}
          {part.technicalNotes && (
            <div className="text-xs bg-amber-50/50 border border-amber-200/80 p-2 rounded text-amber-900 font-body-md leading-relaxed">
              <p>
                <strong className="font-semibold text-amber-950">Nota técnica de taller: </strong>
                {part.technicalNotes}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] font-code-sm text-tertiary pt-1">
            <span>Proveedor: <strong className="text-on-surface">{part.supplier}</strong></span>
            <span>Último albarán: <strong className="text-on-surface">{part.lastEntryDate}</strong></span>
          </div>
        </div>

        {/* AUDIT LOG / MOVEMENT HISTORY */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/60 p-3 shadow-xs space-y-2">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">history</span>
              <h3 className="font-headline-md text-xs font-bold text-on-surface uppercase tracking-wider">
                Auditoría de Movimientos
              </h3>
            </div>
            <span className="font-code-sm text-[10px] text-tertiary">{part.moveHistory.length} registros</span>
          </div>

          <div className="space-y-1.5">
            {part.moveHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/30 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded flex items-center justify-center font-code-sm text-xs font-bold shrink-0 ${
                      item.type === 'salida' ? 'bg-red-100 text-error' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {item.type === 'salida' ? '-' : '+'}
                  </span>
                  <div>
                    <span className="font-semibold text-on-surface block">{item.description}</span>
                    {item.technician && (
                      <span className="font-label-sm text-[10px] text-tertiary">Resp: {item.technician}</span>
                    )}
                  </div>
                </div>
                <span className="font-code-sm text-[10px] text-tertiary whitespace-nowrap">{item.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 3. STICKY BOTTOM ACTIONS */}
      <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest/95 backdrop-blur-md p-3 border-t border-outline-variant/40 shadow-lg z-40">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <button
            onClick={() => onPrintThermalLabel(part)}
            className="h-11 px-3 bg-surface-container border border-outline-variant rounded flex items-center justify-center text-on-surface hover:bg-surface-container-high active:scale-95 transition-transform"
            title="Imprimir Etiqueta Térmica"
            type="button"
          >
            <span className="material-symbols-outlined text-lg mr-1 text-primary">print</span>
            <span className="font-title-sm text-xs font-semibold">Etiqueta QR</span>
          </button>

          <button
            onClick={() => onAssignWorkOrder(part)}
            disabled={part.stock <= 0}
            className="flex-1 h-11 bg-primary text-on-primary rounded font-headline-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow active:scale-[0.98] transition-transform hover:bg-primary-container disabled:opacity-50"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">build</span>
            <span>Salida a Orden de Trabajo (-1)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
