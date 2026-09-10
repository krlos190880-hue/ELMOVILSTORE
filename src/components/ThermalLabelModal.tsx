import React, { useState } from 'react';
import { SparePart } from '../types';
import { soundFX } from '../utils/audio';

interface ThermalLabelModalProps {
  part: SparePart;
  onClose: () => void;
}

export const ThermalLabelModal: React.FC<ThermalLabelModalProps> = ({ part, onClose }) => {
  const [printStatus, setPrintStatus] = useState<'idle' | 'printing' | 'done'>('idle');
  const [copies, setCopies] = useState(1);

  const handlePrint = () => {
    soundFX.playClick();
    setPrintStatus('printing');
    setTimeout(() => {
      soundFX.playSuccessChime();
      setPrintStatus('done');
      setTimeout(() => {
        setPrintStatus('idle');
        onClose();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-lg border border-outline-variant shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">print</span>
            <h3 className="font-headline-md text-sm font-bold text-on-surface">Imprimir Etiqueta Térmica</h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Thermal Label Preview (50x30mm standard roll format) */}
        <div className="p-4 flex flex-col items-center bg-surface-container-high/40">
          <div className="w-64 bg-white border-2 border-dashed border-gray-400 p-3 rounded shadow-sm text-black font-mono select-none">
            {/* Top row */}
            <div className="flex justify-between items-start border-b border-black pb-1 mb-1.5 text-[10px]">
              <div>
                <span className="font-bold text-[11px] block">{part.brand.toUpperCase()} WORKSHOP</span>
                <span className="text-[9px] text-gray-700">{part.drawer}</span>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className={`border px-1 text-[9px] font-bold uppercase ${
                  part.condition === 'segunda_mano' ? 'bg-black text-white border-black' : 'border-black'
                }`}>
                  {part.condition === 'segunda_mano' ? '2ª MANO' : 'NUEVO'}
                </span>
                {part.condition === 'segunda_mano' && part.conditionGrade && (
                  <span className="text-[8px] font-bold text-gray-800">
                    {part.conditionGrade.slice(0, 10)}
                  </span>
                )}
              </div>
            </div>

            {/* Part Name & SKU */}
            <div className="text-center my-1.5">
              <p className="font-bold text-xs leading-tight line-clamp-2 text-left">{part.name}</p>
              <p className="text-[11px] font-bold tracking-wider text-left mt-0.5">{part.sku}</p>
            </div>

            {/* Barcode & QR representation */}
            <div className="flex items-center justify-between pt-1 border-t border-black">
              {/* Simulated QR block */}
              <div className="w-12 h-12 bg-black p-1 flex items-center justify-center rounded-xs">
                <div className="w-full h-full bg-white grid grid-cols-4 gap-0.5 p-0.5">
                  <div className="bg-black"></div>
                  <div className="bg-black"></div>
                  <div className="bg-white"></div>
                  <div className="bg-black"></div>
                  <div className="bg-white"></div>
                  <div className="bg-black"></div>
                  <div className="bg-black"></div>
                  <div className="bg-white"></div>
                  <div className="bg-black"></div>
                  <div className="bg-white"></div>
                  <div className="bg-black"></div>
                  <div className="bg-black"></div>
                  <div className="bg-black"></div>
                  <div className="bg-black"></div>
                  <div className="bg-white"></div>
                  <div className="bg-black"></div>
                </div>
              </div>

              {/* Barcode lines */}
              <div className="flex flex-col items-end">
                <div className="flex gap-[2px] h-8 items-end">
                  {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 3, 2, 1, 4, 2, 1, 3].map((w, i) => (
                    <div
                      key={i}
                      className="bg-black h-full"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
                <span className="text-[9px] tracking-widest mt-0.5">{part.barcode}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[8px] mt-1 pt-1 border-t border-gray-300 text-gray-600">
              <span>BAY-01 // TALLER</span>
              <span>PVP: {part.pvpPrice.toFixed(2)}€</span>
            </div>
          </div>

          <p className="font-code-sm text-[11px] text-tertiary mt-2">Formato estándar 50x30mm (Zebra / Brother)</p>
        </div>

        {/* Options & Action */}
        <div className="p-4 space-y-3 bg-surface-container-lowest">
          <div className="flex items-center justify-between text-xs font-label-sm">
            <span className="text-on-surface-variant font-semibold">Número de Copias:</span>
            <div className="flex items-center border border-outline-variant rounded">
              <button
                onClick={() => setCopies(Math.max(1, copies - 1))}
                className="w-7 h-7 flex items-center justify-center hover:bg-surface-container text-on-surface"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-primary">{copies}</span>
              <button
                onClick={() => setCopies(copies + 1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-surface-container text-on-surface"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handlePrint}
            disabled={printStatus === 'printing'}
            className="w-full py-2.5 bg-primary text-on-primary rounded font-headline-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-container active:scale-[0.98] transition-transform disabled:opacity-75 shadow"
          >
            {printStatus === 'printing' ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                <span>Enviando a impresora térmica...</span>
              </>
            ) : printStatus === 'done' ? (
              <>
                <span className="material-symbols-outlined text-lg text-secondary-container">check_circle</span>
                <span>¡Etiqueta Impresa!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">print</span>
                <span>Imprimir {copies > 1 ? `(${copies} copias)` : ''}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
