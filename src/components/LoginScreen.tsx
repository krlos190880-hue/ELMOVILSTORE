import React, { useState } from 'react';
import { TechnicianUser } from '../types';
import { soundFX } from '../utils/audio';
import { AdminAuthModal } from './AdminAuthModal';

interface LoginScreenProps {
  users: TechnicianUser[];
  onLogin: (user: TechnicianUser) => void;
  onAddNewUser: (newUser: TechnicianUser) => void;
  onDeleteUser?: (userId: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  users,
  onLogin,
  onAddNewUser,
  onDeleteUser,
}) => {
  const [selectedUser, setSelectedUser] = useState<TechnicianUser | null>(users[0] || null);
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState('Taller Central // Banco #04');
  const [showAddModal, setShowAddModal] = useState(false);

  // Admin authorization & delete modal state
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [adminAuthReason, setAdminAuthReason] = useState('Se requiere autorización de Administrador.');
  const [adminAuthAction, setAdminAuthAction] = useState<'add' | 'delete' | null>(null);
  const [targetDeleteUser, setTargetDeleteUser] = useState<TechnicianUser | null>(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<TechnicianUser | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newRole, setNewRole] = useState('Técnico de Banco');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newPin, setNewPin] = useState('1234');
  const [newStation, setNewStation] = useState('Taller Central // Banco #06');
  const [newIsAdmin, setNewIsAdmin] = useState(false);

  const workshops = [
    'Taller Central // Banco #04',
    'Taller Central // Banco Principal',
    'Laboratorio Clean-Room // Mesa 2',
    'Recepción & Control de Entradas',
    'Taller Norte // Almacén 1',
  ];

  const handleSelectUser = (user: TechnicianUser) => {
    soundFX.playClick();
    setSelectedUser(user);
    setPinInput('');
    setErrorMessage(null);
  };

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
    if (!selectedUser) return;
    if (enteredPin === selectedUser.pin) {
      soundFX.playSuccessChime();
      onLogin(selectedUser);
    } else {
      soundFX.playErrorBeep();
      setErrorMessage('PIN incorrecto. Intenta nuevamente.');
      setTimeout(() => {
        setPinInput('');
      }, 700);
    }
  };

  const adminUsers = users.filter((u) => u.isAdmin);

  const handleRequestAddTechnician = () => {
    soundFX.playClick();
    setAdminAuthAction('add');
    setAdminAuthReason(
      '🔒 Permiso de Administrador Requerido: Solo el personal administrador puede dar de alta nuevos técnicos en el sistema del taller.'
    );
    setShowAdminAuthModal(true);
  };

  const handleRequestDeleteTechnician = (tech: TechnicianUser, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFX.playClick();

    if (tech.isAdmin && adminUsers.length <= 1) {
      soundFX.playErrorBeep();
      setActionNotice('⚠️ No puedes dar de baja al único Administrador del taller.');
      setTimeout(() => setActionNotice(null), 3500);
      return;
    }

    setTargetDeleteUser(tech);
    setAdminAuthAction('delete');
    setAdminAuthReason(
      `🔒 Permiso de Administrador Requerido: Autoriza la baja del técnico ${tech.name} (${tech.code}).`
    );
    setShowAdminAuthModal(true);
  };

  const handleAdminAuthSuccess = () => {
    setShowAdminAuthModal(false);
    if (adminAuthAction === 'add') {
      setNewCode(`#0${users.length + 1}`);
      setNewIsAdmin(false);
      setShowAddModal(true);
    } else if (adminAuthAction === 'delete' && targetDeleteUser) {
      setConfirmDeleteUser(targetDeleteUser);
    }
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteUser || !onDeleteUser) return;
    const deletedId = confirmDeleteUser.id;
    soundFX.playSuccessChime();
    onDeleteUser(deletedId);
    if (selectedUser?.id === deletedId) {
      const remaining = users.filter((u) => u.id !== deletedId);
      setSelectedUser(remaining[0] || null);
    }
    setConfirmDeleteUser(null);
    setTargetDeleteUser(null);
  };

  const handleDirectAccess = () => {
    if (!selectedUser) return;
    soundFX.playSuccessChime();
    onLogin(selectedUser);
  };

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) return;

    soundFX.playSuccessChime();
    const created: TechnicianUser = {
      id: `tech-${Date.now()}`,
      name: newName.trim(),
      code: newCode.trim().startsWith('#') ? newCode.trim() : `#${newCode.trim()}`,
      role: newRole,
      roleBadge: newIsAdmin ? 'ADMIN' : 'TÉCNICO',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      pin: newPin || '1234',
      specialty: newSpecialty || 'Reparaciones Generales & Diagnóstico',
      station: newStation,
      activeOrdersCount: 0,
      email: `${newName.toLowerCase().replace(/\s+/g, '.')}@quickui.tech`,
      isAdmin: newIsAdmin,
    };

    onAddNewUser(created);
    setSelectedUser(created);
    setPinInput('');
    setShowAddModal(false);
    // Reset form
    setNewName('');
    setNewCode('');
    setNewSpecialty('');
    setNewIsAdmin(false);
  };


  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased flex flex-col justify-between selection:bg-primary selection:text-on-primary">
      {/* TOP BRANDING BAR */}
      <header className="px-4 py-3 bg-surface-container-lowest border-b border-outline-variant/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded bg-primary text-on-primary flex items-center justify-center font-bold shadow-xs">
            <span className="material-symbols-outlined text-xl">handyman</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-primary font-headline-md tracking-tight leading-none">
                QuickUI
              </h1>
              <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.2 rounded font-code-sm font-semibold uppercase">
                Taller Técnico v2.4
              </span>
            </div>
            <p className="text-[11px] font-code-sm text-tertiary">
              Control de Inventario, Gavetas &amp; Órdenes de Reparación
            </p>
          </div>
        </div>

        {/* WORKSHOP / SUCURSAL SELECTOR */}
        <div className="hidden sm:flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded border border-outline-variant/30 text-xs">
          <span className="material-symbols-outlined text-[16px] text-tertiary">storefront</span>
          <select
            value={selectedWorkshop}
            onChange={(e) => setSelectedWorkshop(e.target.value)}
            className="bg-transparent text-on-surface font-code-sm text-xs font-semibold focus:outline-none cursor-pointer"
          >
            {workshops.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 flex flex-col justify-center">
        <div className="text-center mb-6">
          <span className="text-[11px] font-label-sm font-bold text-tertiary uppercase tracking-wider block mb-1">
            Estación de Trabajo Activa
          </span>
          <h2 className="text-xl sm:text-2xl font-headline-md font-bold text-on-surface tracking-tight">
            Iniciar Sesión de Técnico
          </h2>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
            Selecciona tu perfil de usuario para ingresar al inventario de piezas, control de gavetas y registro de banco.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* USER SELECTION LIST (LEFT / TOP) */}
          <div className="lg:col-span-7 space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-tertiary uppercase tracking-wider font-code-sm">
                Técnicos Registrados ({users.length})
              </span>
              <button
                type="button"
                onClick={handleRequestAddTechnician}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 bg-primary/5 hover:bg-primary/10 border border-primary/20 px-2 py-1 rounded-lg transition-all"
                title="Requiere autorización de Administrador"
              >
                <span className="material-symbols-outlined text-sm text-amber-600">admin_panel_settings</span>
                <span>+ Agregar Técnico</span>
              </button>
            </div>

            {actionNotice && (
              <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-semibold text-amber-700 flex items-center gap-1.5 animate-in fade-in">
                <span className="material-symbols-outlined text-base">info</span>
                <span>{actionNotice}</span>
              </div>
            )}

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {users.map((user) => {
                const isSelected = selectedUser?.id === user.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                      isSelected
                        ? 'bg-primary/5 border-primary ring-1 ring-primary shadow-xs'
                        : 'bg-surface-container-lowest border-outline-variant/60 hover:border-outline-variant hover:bg-surface-container/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className={`w-11 h-11 rounded-full object-cover border-2 ${
                            user.isAdmin
                              ? 'border-amber-500 ring-1 ring-amber-500/30'
                              : isSelected
                              ? 'border-primary'
                              : 'border-outline-variant'
                          }`}
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-surface"></span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm font-title-sm font-bold text-on-surface truncate">
                            {user.name}
                          </h3>
                          <span className="text-xs font-code-sm font-bold text-primary bg-primary/10 px-1.5 py-0.2 rounded">
                            {user.code}
                          </span>
                          {user.isAdmin && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-code-sm font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 border border-amber-500/30 uppercase">
                              <span className="material-symbols-outlined text-[11px]">verified_user</span>
                              ADMIN
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-body-md text-tertiary truncate">
                          {user.role}
                        </p>
                        <p className="text-[10px] font-code-sm text-on-surface-variant truncate mt-0.5">
                          {user.specialty}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end justify-between self-stretch">
                      <div>
                        <span className="inline-block text-[9px] font-code-sm font-bold px-1.5 py-0.5 rounded bg-surface-container text-tertiary uppercase">
                          {user.roleBadge}
                        </span>
                        <span className="block text-[10px] text-tertiary font-code-sm mt-0.5">
                          {user.activeOrdersCount} OT
                        </span>
                      </div>

                      {onDeleteUser && (
                        <button
                          type="button"
                          onClick={(e) => handleRequestDeleteTechnician(user, e)}
                          className="w-7 h-7 rounded-md flex items-center justify-center text-tertiary hover:text-red-600 hover:bg-red-50 active:scale-90 transition-all opacity-70 group-hover:opacity-100"
                          title={`Eliminar técnico ${user.name} (Requiere Admin)`}
                        >
                          <span className="material-symbols-outlined text-[17px]">delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PIN & ACCESS PANEL (RIGHT) */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-sm space-y-4">
            {selectedUser ? (
              <>
                <div className="text-center pb-2 border-b border-outline-variant/40">
                  <div className="relative inline-block mx-auto mb-2">
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary mx-auto shadow-sm"
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-surface"></span>
                  </div>
                  <h3 className="text-base font-bold text-on-surface leading-tight">
                    {selectedUser.name}
                  </h3>
                  <p className="text-xs font-code-sm text-primary font-semibold">
                    {selectedUser.code} • {selectedUser.role}
                  </p>
                  <p className="text-[11px] text-tertiary mt-0.5">
                    {selectedUser.station}
                  </p>
                </div>

                {/* PIN DISPLAY */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-tertiary font-code-sm">
                      PIN DE SEGURIDAD (4 DÍGITOS)
                    </span>
                    <span className="text-[10px] text-tertiary font-code-sm">
                      Demo: <strong className="text-primary">{selectedUser.pin}</strong>
                    </span>
                  </div>

                  <div className="flex justify-center gap-3 py-2">
                    {[0, 1, 2, 3].map((i) => {
                      const isFilled = pinInput.length > i;
                      return (
                        <div
                          key={i}
                          className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg font-bold font-code-sm transition-all ${
                            isFilled
                              ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20 scale-105'
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
                <div className="grid grid-cols-3 gap-2 pt-1 max-w-[240px] mx-auto">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeypadPress(digit)}
                      className="h-11 rounded-lg bg-surface border border-outline-variant/50 text-sm font-bold font-code-sm text-on-surface hover:bg-surface-container active:scale-95 transition-transform"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('clear')}
                    className="h-11 rounded-lg bg-surface border border-outline-variant/50 text-xs font-bold font-code-sm text-tertiary hover:bg-surface-container active:scale-95 transition-transform"
                  >
                    BORRAR
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    className="h-11 rounded-lg bg-surface border border-outline-variant/50 text-sm font-bold font-code-sm text-on-surface hover:bg-surface-container active:scale-95 transition-transform"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('back')}
                    className="h-11 rounded-lg bg-surface border border-outline-variant/50 text-tertiary hover:bg-surface-container active:scale-95 transition-transform flex items-center justify-center"
                    title="Retroceso"
                  >
                    <span className="material-symbols-outlined text-base">backspace</span>
                  </button>
                </div>

                {/* DIRECT LOGIN SHORTCUT */}
                <div className="pt-2 border-t border-outline-variant/40 space-y-2">
                  <button
                    type="button"
                    onClick={handleDirectAccess}
                    className="w-full py-2.5 px-3 bg-primary text-on-primary rounded-lg font-headline-md text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary-container active:scale-[0.98] transition-all shadow-xs"
                  >
                    <span className="material-symbols-outlined text-base">login</span>
                    <span>Ingresar como {selectedUser.name.split(' ')[0]}</span>
                  </button>

                  <p className="text-[10px] text-center text-tertiary">
                    Sesión cifrada con permisos de banco técnico y trazabilidad de piezas.
                  </p>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-tertiary">
                <span className="material-symbols-outlined text-4xl mb-2">person_search</span>
                <p className="text-xs">Selecciona un técnico de la lista para ingresar</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="px-4 py-3 bg-surface-container-lowest border-t border-outline-variant/30 text-center text-xs text-tertiary font-code-sm">
        <span>QuickUI Sistema Taller Central • Modo Multi-Usuario Activo</span>
      </footer>

      {/* MODAL: REGISTRAR NUEVO TÉCNICO */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-xl border border-outline-variant p-5 w-full max-w-md shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">badge</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-sm font-bold text-on-surface">
                    Nuevo Perfil de Técnico
                  </h3>
                  <p className="text-[11px] text-tertiary font-code-sm">
                    Alta de usuario en el sistema de taller
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: David Silva"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs font-body-md outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    Código *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="#08"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded font-code-sm text-xs font-bold text-primary outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    Rol / Puesto
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs outline-none focus:border-primary"
                  >
                    <option value="Técnico de Banco">Técnico de Banco</option>
                    <option value="Técnico Senior">Técnico Senior</option>
                    <option value="Especialista Microsoldadura">Especialista Microsoldadura</option>
                    <option value="Control de Stock & Recepción">Control de Stock &amp; Recepción</option>
                    <option value="Supervisor de Taller">Supervisor de Taller</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    PIN Numérico (4 dígitos)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="1234"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded font-code-sm text-xs font-bold text-center tracking-widest outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Especialidad Técnica
                </label>
                <input
                  type="text"
                  placeholder="Ej: Cambio de Cristales & Pantallas OLED"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Ubicación / Puesto Asignado
                </label>
                <input
                  type="text"
                  placeholder="Taller Central // Banco #06"
                  value={newStation}
                  onChange={(e) => setNewStation(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded font-code-sm text-xs outline-none focus:border-primary"
                />
              </div>

              {/* ADMIN PRIVILEGES TOGGLE */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="isAdminCheck"
                  checked={newIsAdmin}
                  onChange={(e) => setNewIsAdmin(e.target.checked)}
                  className="mt-0.5 rounded border-outline-variant text-amber-600 focus:ring-amber-500 h-4 w-4 cursor-pointer accent-amber-600"
                />
                <label htmlFor="isAdminCheck" className="cursor-pointer text-xs">
                  <span className="font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-amber-600">verified_user</span>
                    <span>Conceder Rango de Administrador</span>
                  </span>
                  <span className="block text-[11px] text-tertiary mt-0.5 leading-snug">
                    Habilita la autorización para registrar nuevos técnicos, dar de baja personal y gestionar configuraciones globales del taller.
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-surface border border-outline-variant rounded text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-on-primary rounded text-xs font-headline-md font-bold hover:bg-primary-container shadow"
                >
                  Registrar Técnico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN AUTHORIZATION MODAL */}
      {showAdminAuthModal && (
        <AdminAuthModal
          adminUsers={adminUsers}
          title="Autorización de Administrador Requerida"
          reason={adminAuthReason}
          onSuccess={handleAdminAuthSuccess}
          onClose={() => setShowAdminAuthModal(false)}
        />
      )}

      {/* CONFIRM DELETE TECHNICIAN MODAL */}
      {confirmDeleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-surface rounded-2xl border border-red-200 p-5 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-outline-variant/40 pb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">person_remove</span>
              </div>
              <div>
                <h3 className="font-headline-md text-sm font-bold text-on-surface">
                  ¿Dar de Baja al Técnico?
                </h3>
                <p className="text-[11px] font-code-sm text-red-600 font-semibold">
                  Acción irreversible de Administrador
                </p>
              </div>
            </div>

            <div className="p-3 bg-surface-container rounded-xl flex items-center gap-3 border border-outline-variant/50">
              <img
                src={confirmDeleteUser.avatar}
                alt={confirmDeleteUser.name}
                className="w-11 h-11 rounded-full object-cover border border-outline-variant shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-on-surface truncate">
                  {confirmDeleteUser.name}
                </p>
                <p className="text-[11px] font-code-sm text-primary font-semibold">
                  {confirmDeleteUser.code} • {confirmDeleteUser.role}
                </p>
                <p className="text-[10px] text-tertiary truncate mt-0.5">
                  {confirmDeleteUser.station}
                </p>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              El perfil de <strong>{confirmDeleteUser.name}</strong> será revocado del sistema. Sus credenciales de acceso quedarán inhabilitadas inmediatamente.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/50">
              <button
                type="button"
                onClick={() => setConfirmDeleteUser(null)}
                className="px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold font-headline-md hover:bg-red-700 flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">delete_forever</span>
                <span>Confirmar Baja</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
