import React, { useState } from 'react';
import { TechnicianUser } from '../types';
import { soundFX } from '../utils/audio';

interface AdminAuthModalProps {
  adminUsers: TechnicianUser[];
  title?: string;
  reason?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  adminUsers,
  title = 'Autorización de Administrador',
  reason = 'Esta acción requiere credenciales de Administrador para modificar el equipo técnico.',
  onSuccess,
  onClose,
}) => {
  const [selectedAdminId, setSelectedAdminId] = useState<string>(
    adminUsers[0]?.id || ''
  );
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedAdmin =
    adminUsers.find((u) => u.id === selectedAdminId) || adminUsers[0];

  const handleKeypadPress = (val: string) => {
    soundFX.playClick();
    setErrorMessage(null);
    if (val === 'clear') {
      setPinInput('');
    } else if (val === 'back') {
      setPinInput((prev) => prev.slice(0, -1));
    } else {
      if (pinInput.length < 4) {
        const next = pinInput + val;
        setPinInput(next);
        if (next.length === 4) {
          verifyPin(next);
        }
      }
    }
  };

  const verifyPin = (enteredPin: string) => {
    // Check against selected admin's PIN or master PIN 9999
    if (
      (selectedAdmin && enteredPin === selectedAdmin.pin) ||
      enteredPin === '9999' ||
      adminUsers.some((u) => u.pin === enteredPin)
    ) {
      soundFX.playSuccessChime();
      onSuccess();
    } else {
      soundFX.playErrorBeep();
      setErrorMessage('PIN de Administrador incorrecto');
      setTimeout(() => {
        setPinInput('');
      }, 700);
    }
  };

  const handleQuickVerify = () => {
    soundFX.playSuccessChime();
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-surface rounded-2xl border border-outline-variant p-5 w-full max-w-sm shadow-2xl space-y-4">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
            </div>
            <div>
              <h3 className="font-headline-md text-sm font-bold text-on-surface">
                {title}
              </h3>
              <span className="text-[10px] font-code-sm font-bold text-amber-600 uppercase bg-amber-500/10 px-1.5 py-0.2 rounded">
                Control de Permisos
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          {reason}
        </p>

        {/* ADMIN SELECTOR */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-tertiary uppercase font-code-sm">
            Seleccionar Administrador Autorizante:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {adminUsers.map((admin) => {
              const isSelected = admin.id === selectedAdminId;
              return (
                <button
                  key={admin.id}
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedAdminId(admin.id);
                    setPinInput('');
                    setErrorMessage(null);
                  }}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                      : 'border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container'
                  }`}
                >
                  <img
                    src={admin.avatar}
                    alt={admin.name}
                    className="w-8 h-8 rounded-full object-cover border border-outline-variant shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate">
                      {admin.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] font-code-sm font-semibold text-amber-600 truncate">
                      {admin.code} • Admin
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PIN DISPLAY */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-tertiary font-code-sm">
              PIN DE AUTORIZACIÓN
            </span>
            {selectedAdmin && (
              <span className="text-[10px] text-tertiary font-code-sm">
                PIN Demo: <strong className="text-amber-600 font-bold">{selectedAdmin.pin}</strong>
              </span>
            )}
          </div>

          <div className="flex justify-center gap-3 py-1">
            {[0, 1, 2, 3].map((i) => {
              const isFilled = pinInput.length > i;
              return (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center text-lg font-bold font-code-sm transition-all ${
                    isFilled
                      ? 'border-amber-500 bg-amber-500/10 text-amber-600 ring-2 ring-amber-500/20 scale-105'
                      : 'border-outline-variant/60 bg-surface-container text-tertiary'
                  }`}
                >
                  {isFilled ? '•' : ''}
                </div>
              );
            })}
          </div>

          {errorMessage && (
            <div className="text-center text-xs font-semibold text-red-600 animate-in fade-in flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* NUMERIC KEYPAD */}
        <div className="grid grid-cols-3 gap-1.5 max-w-[220px] mx-auto pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeypadPress(digit)}
              className="h-10 rounded-lg bg-surface border border-outline-variant/50 text-sm font-bold font-code-sm text-on-surface hover:bg-surface-container active:scale-95 transition-transform"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleKeypadPress('clear')}
            className="h-10 rounded-lg bg-surface border border-outline-variant/50 text-[11px] font-bold font-code-sm text-tertiary hover:bg-surface-container active:scale-95 transition-transform"
          >
            BORRAR
          </button>
          <button
            type="button"
            onClick={() => handleKeypadPress('0')}
            className="h-10 rounded-lg bg-surface border border-outline-variant/50 text-sm font-bold font-code-sm text-on-surface hover:bg-surface-container active:scale-95 transition-transform"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => handleKeypadPress('back')}
            className="h-10 rounded-lg bg-surface border border-outline-variant/50 text-tertiary hover:bg-surface-container active:scale-95 transition-transform flex items-center justify-center"
            title="Retroceso"
          >
            <span className="material-symbols-outlined text-base">backspace</span>
          </button>
        </div>

        {/* SHORTCUT & FOOTER */}
        <div className="pt-2 border-t border-outline-variant/50 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleQuickVerify}
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-headline-md text-xs font-bold hover:bg-amber-700 flex items-center gap-1 shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span>Autorizar como Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
