import React, { useState } from 'react';
import { SparePart, WorkOrder, DrawerLocation, TechnicianUser } from '../types';
import { soundFX } from '../utils/audio';
import { AdminAuthModal } from './AdminAuthModal';

interface SettingsScreenProps {
  parts: SparePart[];
  workOrders: WorkOrder[];
  drawers?: DrawerLocation[];
  currentUser?: TechnicianUser | null;
  users?: TechnicianUser[];
  onAddNewUser?: (newUser: TechnicianUser) => void;
  onDeleteUser?: (userId: string) => void;
  onToggleAdminUser?: (userId: string) => void;
  onLogout?: () => void;
  onSwitchUser?: () => void;
  onOpenDrawersModal?: () => void;
  onBack: () => void;
  onOpenScanner: () => void;
  onOpenAddPart: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  parts,
  workOrders,
  drawers = [],
  currentUser = null,
  users = [],
  onAddNewUser,
  onDeleteUser,
  onToggleAdminUser,
  onLogout,
  onSwitchUser,
  onOpenDrawersModal,
  onBack,
  onOpenScanner,
  onOpenAddPart,
}) => {
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [showAddTechModal, setShowAddTechModal] = useState(false);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<TechnicianUser | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // New Technician form fields
  const [newTechName, setNewTechName] = useState('');
  const [newTechCode, setNewTechCode] = useState('');
  const [newTechRole, setNewTechRole] = useState('Técnico de Banco');
  const [newTechSpecialty, setNewTechSpecialty] = useState('');
  const [newTechStation, setNewTechStation] = useState('Taller Central // Banco #06');
  const [newTechPin, setNewTechPin] = useState('1234');
  const [newTechIsAdmin, setNewTechIsAdmin] = useState(false);

  const hasAdminAccess = currentUser?.isAdmin || adminUnlocked;
  const adminUsers = users.filter((u) => u.isAdmin);

  const showNotice = (msg: string) => {
    setNoticeMessage(msg);
    setTimeout(() => setNoticeMessage(null), 3500);
  };

  const handleOpenAddTech = () => {
    soundFX.playClick();
    if (!hasAdminAccess) {
      setShowAdminAuthModal(true);
      return;
    }
    setNewTechCode(`#0${users.length + 1}`);
    setNewTechIsAdmin(false);
    setShowAddTechModal(true);
  };

  const handleCreateTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechName.trim() || !newTechCode.trim()) return;

    soundFX.playSuccessChime();
    const created: TechnicianUser = {
      id: `tech-${Date.now()}`,
      name: newTechName.trim(),
      code: newTechCode.trim().startsWith('#') ? newTechCode.trim() : `#${newTechCode.trim()}`,
      role: newTechRole,
      roleBadge: newTechIsAdmin ? 'ADMIN' : 'TÉCNICO',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      pin: newTechPin || '1234',
      specialty: newTechSpecialty || 'Reparaciones Generales & Diagnóstico',
      station: newTechStation,
      activeOrdersCount: 0,
      email: `${newTechName.toLowerCase().replace(/\s+/g, '.')}@quickui.tech`,
      isAdmin: newTechIsAdmin,
    };

    onAddNewUser?.(created);
    setShowAddTechModal(false);
    setNewTechName('');
    setNewTechCode('');
    setNewTechSpecialty('');
    setNewTechIsAdmin(false);
    showNotice(`Técnico ${created.name} (${created.code}) dado de alta.`);
  };

  const handleRequestDelete = (user: TechnicianUser) => {
    soundFX.playClick();
    if (!hasAdminAccess) {
      setShowAdminAuthModal(true);
      return;
    }

    if (user.isAdmin && adminUsers.length <= 1) {
      soundFX.playErrorBeep();
      showNotice('⚠️ No puedes eliminar al único Administrador del taller.');
      return;
    }

    setConfirmDeleteUser(user);
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteUser || !onDeleteUser) return;
    const deletedUser = confirmDeleteUser;
    soundFX.playSuccessChime();
    onDeleteUser(deletedUser.id);
    setConfirmDeleteUser(null);
    showNotice(`Técnico ${deletedUser.name} (${deletedUser.code}) eliminado del taller.`);
  };

  const handleToggleAdmin = (user: TechnicianUser) => {
    soundFX.playClick();
    if (!hasAdminAccess) {
      setShowAdminAuthModal(true);
      return;
    }

    if (user.isAdmin && adminUsers.length <= 1) {
      soundFX.playErrorBeep();
      showNotice('⚠️ Debe existir al menos un Administrador en el taller.');
      return;
    }

    onToggleAdminUser?.(user.id);
  };
  const allMovements = parts
    .flatMap((p) =>
      p.moveHistory.map((m) => ({
        ...m,
        partName: p.name,
        sku: p.sku,
        drawer: p.drawer,
      }))
    )
    .sort((a, b) => b.id.localeCompare(a.id));

  const handleExportJSON = () => {
    soundFX.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(parts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `inventario-taller-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col justify-between pb-24">
      {/* TOP APP BAR */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md px-3 h-14 flex items-center justify-between border-b border-outline-variant/40 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div>
            <h1 className="font-headline-lg-mobile text-sm sm:text-base font-bold text-on-surface tracking-tight leading-tight">
              Ajustes &amp; Auditoría Técnica
            </h1>
            <p className="font-code-sm text-xs text-tertiary">Control de Banco de Trabajo</p>
          </div>
        </div>
        <button
          onClick={handleExportJSON}
          className="px-2.5 py-1.5 bg-surface-container text-primary rounded font-label-sm text-xs font-semibold hover:bg-surface-container-high active:scale-95 transition-all flex items-center gap-1 border border-outline-variant/50"
          title="Exportar inventario en JSON"
        >
          <span className="material-symbols-outlined text-base">download</span>
          <span>Exportar</span>
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full max-w-md mx-auto px-3 pt-3 space-y-3">
        {/* WORKBENCH & TECHNICIAN PROFILE CARD */}
        <section className="bg-surface-container-lowest rounded-lg p-3 border border-outline-variant/60 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
              <h2 className="font-headline-md text-sm font-semibold text-on-surface">
                Técnico en Sesión
              </h2>
            </div>
            {currentUser && (
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-code-sm font-bold">
                EN LÍNEA
              </span>
            )}
          </div>

          {currentUser ? (
            <div className="flex items-center gap-3 p-2 bg-surface rounded-lg border border-outline-variant/30">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary shrink-0 shadow-2xs"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-on-surface truncate">
                    {currentUser.name}
                  </h3>
                  <span className="text-xs font-code-sm font-bold text-primary bg-primary/10 px-1.5 py-0.2 rounded">
                    {currentUser.code}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant font-medium">
                  {currentUser.role}
                </p>
                <p className="text-[10px] text-tertiary font-code-sm truncate mt-0.5">
                  {currentUser.specialty}
                </p>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-surface rounded border border-outline-variant/30">
              <span className="font-label-sm text-[10px] text-tertiary block uppercase font-semibold">Ubicación / Puesto</span>
              <span className="font-code-sm text-xs font-bold text-primary truncate block">
                {currentUser?.station || 'Taller Central // Banco #04'}
              </span>
            </div>
            <div className="p-2 bg-surface rounded border border-outline-variant/30">
              <span className="font-label-sm text-[10px] text-tertiary block uppercase font-semibold">Repuestos en Catálogo</span>
              <span className="font-code-sm text-xs font-bold text-on-surface">{parts.length} referencias</span>
            </div>
            <div className="p-2 bg-surface rounded border border-outline-variant/30">
              <span className="font-label-sm text-[10px] text-tertiary block uppercase font-semibold">Órdenes de Trabajo</span>
              <span className="font-code-sm text-xs font-bold text-emerald-700">{workOrders.length} activas</span>
            </div>
            <div className="p-2 bg-surface rounded border border-outline-variant/30">
              <span className="font-label-sm text-[10px] text-tertiary block uppercase font-semibold">Gavetas Operativas</span>
              <span className="font-code-sm text-xs font-bold text-on-surface">{drawers.length} registradas</span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            {onSwitchUser && (
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  onSwitchUser();
                }}
                className="flex-1 py-1.5 px-2 bg-surface border border-outline-variant hover:border-primary rounded text-xs font-bold text-on-surface flex items-center justify-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">switch_account</span>
                <span>Cambiar Técnico</span>
              </button>
            )}

            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  onLogout();
                }}
                className="py-1.5 px-3 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Salir</span>
              </button>
            )}
          </div>
        </section>

        {/* CONTROL DE PERSONAL & PERMISOS DE ADMINISTRADOR */}
        <section className="bg-surface-container-lowest rounded-lg p-3 border border-outline-variant/60 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-[20px]">admin_panel_settings</span>
              <div>
                <h2 className="font-headline-md text-sm font-semibold text-on-surface">
                  Permisos &amp; Personal Técnico
                </h2>
                <p className="text-[10px] font-code-sm text-tertiary">Control de Altas y Bajas</p>
              </div>
            </div>
            {hasAdminAccess ? (
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-300 px-2 py-0.5 rounded font-code-sm font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">verified_user</span>
                ADMIN ACTIVO
              </span>
            ) : (
              <span className="text-[10px] bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded font-code-sm font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">lock</span>
                SOLO ADMIN
              </span>
            )}
          </div>

          {noticeMessage && (
            <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-semibold text-amber-700 flex items-center gap-1.5 animate-in fade-in">
              <span className="material-symbols-outlined text-base">info</span>
              <span>{noticeMessage}</span>
            </div>
          )}

          {hasAdminAccess ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-surface p-2.5 rounded-lg border border-outline-variant/40">
                <div>
                  <span className="text-xs font-bold text-on-surface block">
                    Plantilla de Técnicos ({users.length})
                  </span>
                  <span className="text-[10px] text-tertiary font-code-sm">
                    {adminUsers.length} Administrador{adminUsers.length > 1 ? 'es' : ''} con permisos completos
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddTech}
                  className="px-2.5 py-1.5 bg-primary text-on-primary rounded font-headline-md text-xs font-bold hover:bg-primary-container flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">person_add</span>
                  <span>+ Nuevo Técnico</span>
                </button>
              </div>

              <div className="space-y-2">
                {users.map((user) => {
                  const isLogged = currentUser?.id === user.id;
                  return (
                    <div
                      key={user.id}
                      className={`p-2.5 rounded-lg border flex items-center justify-between gap-2.5 transition-all ${
                        user.isAdmin
                          ? 'bg-amber-500/5 border-amber-500/30'
                          : 'bg-surface border-outline-variant/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className={`w-9 h-9 rounded-full object-cover border shrink-0 ${
                            user.isAdmin ? 'border-amber-500 ring-1 ring-amber-500/30' : 'border-outline-variant'
                          }`}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-on-surface truncate">
                              {user.name}
                            </h4>
                            <span className="text-[10px] font-code-sm font-bold text-primary bg-primary/10 px-1 py-0.2 rounded">
                              {user.code}
                            </span>
                            {isLogged && (
                              <span className="text-[9px] font-code-sm font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                                TÚ
                              </span>
                            )}
                            {user.isAdmin && (
                              <span className="text-[9px] font-code-sm font-bold text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-300 flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[10px]">shield</span>
                                ADMIN
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-tertiary truncate">{user.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {onToggleAdminUser && (
                          <button
                            type="button"
                            onClick={() => handleToggleAdmin(user)}
                            className={`px-2 py-1 rounded text-[10px] font-bold font-code-sm flex items-center gap-1 border transition-all ${
                              user.isAdmin
                                ? 'border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                : 'border-outline-variant bg-surface text-tertiary hover:text-amber-700 hover:border-amber-300'
                            }`}
                            title={user.isAdmin ? 'Revocar permisos de Administrador' : 'Conceder permisos de Administrador'}
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              {user.isAdmin ? 'verified_user' : 'add_moderator'}
                            </span>
                            <span className="hidden sm:inline">
                              {user.isAdmin ? 'Admin' : 'Hacer Admin'}
                            </span>
                          </button>
                        )}

                        {onDeleteUser && (
                          <button
                            type="button"
                            onClick={() => handleRequestDelete(user)}
                            className="w-7 h-7 rounded flex items-center justify-center text-tertiary hover:text-red-600 hover:bg-red-50 active:scale-95 transition-all border border-transparent hover:border-red-200"
                            title={`Eliminar técnico ${user.name}`}
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-amber-500/5 rounded-lg border border-amber-500/20 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-lg">lock</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-on-surface">
                    Permisos de Administrador Requeridos
                  </h3>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Tu sesión actual ({currentUser?.name || 'Técnico'}) tiene privilegios operativos de banco. Solo los Administradores autorizados pueden agregar o eliminar técnicos del taller.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setShowAdminAuthModal(true);
                }}
                className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded font-headline-md text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                <span>Desbloquear con PIN de Administrador</span>
              </button>
            </div>
          )}
        </section>


        {/* GAVETAS Y DISTRIBUCIÓN FÍSICA */}
        <section className="bg-surface-container-lowest rounded-lg p-3 border border-outline-variant/60 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">grid_view</span>
              <h2 className="font-headline-md text-sm font-semibold text-on-surface">Distribución de Gavetas ({drawers.length})</h2>
            </div>
            <span className="font-code-sm text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
              ACTIVO
            </span>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            Mapa de estanterías, módulos (A: Pantallas, B: Baterías, C: Conectividad, E: Microelectrónica, Caja Fuerte) y gavetas físicas indexadas con códigos QR de taller.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2 bg-surface rounded border border-outline-variant/30">
              <span className="font-label-sm text-[10px] text-tertiary block uppercase font-semibold">Gavetas Operativas</span>
              <span className="font-code-sm text-xs font-bold text-primary">{drawers.length} ubicaciones</span>
            </div>
            <div className="p-2 bg-surface rounded border border-outline-variant/30">
              <span className="font-label-sm text-[10px] text-tertiary block uppercase font-semibold">Módulos del Taller</span>
              <span className="font-code-sm text-xs font-bold text-on-surface">
                {new Set(drawers.map((d) => d.module)).size} zonas
              </span>
            </div>
          </div>

          {onOpenDrawersModal && (
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenDrawersModal();
              }}
              className="w-full mt-1 py-2 px-3 bg-primary text-on-primary rounded font-headline-md text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary-container active:scale-[0.98] transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-base">shelves</span>
              <span>Abrir Mapa &amp; Gestión de Gavetas</span>
            </button>
          )}
        </section>

        {/* WORK ORDERS ACTIVE */}
        <section className="bg-surface-container-lowest rounded-lg p-3 border border-outline-variant/60 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">assignment</span>
              <h2 className="font-headline-md text-sm font-semibold text-on-surface">Órdenes de Trabajo Taller</h2>
            </div>
            <span className="font-code-sm text-[10px] text-primary font-bold">LIVE OT</span>
          </div>
          <div className="space-y-1.5">
            {workOrders.map((wo) => (
              <div key={wo.id} className="p-2 rounded bg-surface border border-outline-variant/40 flex items-center justify-between text-xs">
                <div>
                  <div className="font-code-sm text-xs font-bold text-primary">{wo.id} - {wo.title}</div>
                  <p className="text-[11px] text-on-surface-variant">{wo.device} • {wo.technician}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-metric-badge font-semibold ${
                  wo.status === 'En Proceso' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-gray-100 text-gray-700'
                }`}>
                  {wo.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* AUDIT LOG MOVEMENTS */}
        <section className="bg-surface-container-lowest rounded-lg p-3 border border-outline-variant/60 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">history</span>
              <h2 className="font-headline-md text-sm font-semibold text-on-surface">Auditoría Global de Movimientos</h2>
            </div>
            <span className="font-code-sm text-[10px] text-tertiary">{allMovements.length} eventos</span>
          </div>

          <div className="space-y-2">
            {allMovements.slice(0, 10).map((mv, idx) => (
              <div key={idx} className="p-2 rounded bg-surface border border-outline-variant/40 flex items-start justify-between text-xs">
                <div className="flex items-start gap-2">
                  <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                    mv.type === 'salida' ? 'bg-rose-100 text-error' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    <span className="material-symbols-outlined text-[15px]">
                      {mv.type === 'salida' ? 'call_made' : 'call_received'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-on-surface text-xs">{mv.description}</div>
                    <p className="text-[11px] text-on-surface-variant font-code-sm">{mv.sku} • {mv.drawer}</p>
                    {mv.technician && <p className="text-[10px] text-tertiary">Resp: {mv.technician}</p>}
                  </div>
                </div>
                <span className="font-code-sm text-[10px] text-tertiary whitespace-nowrap">{mv.timestamp}</span>
              </div>
            ))}
          </div>
        </section>

        {/* MODAL: ADD NEW TECHNICIAN */}
        {showAddTechModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="bg-surface rounded-2xl border border-outline-variant p-5 w-full max-w-sm shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">person_add</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-sm font-bold text-on-surface">
                      Nuevo Perfil de Técnico
                    </h3>
                    <p className="text-[10px] font-code-sm text-amber-600 font-semibold">
                      Autorizado por Administrador
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddTechModal(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateTechnician} className="space-y-2.5 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block font-semibold text-on-surface-variant mb-0.5">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: David Silva"
                      value={newTechName}
                      onChange={(e) => setNewTechName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-on-surface-variant mb-0.5">
                      Código *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="#08"
                      value={newTechCode}
                      onChange={(e) => setNewTechCode(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline-variant rounded font-code-sm text-xs font-bold text-primary outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-on-surface-variant mb-0.5">
                      Rol / Puesto
                    </label>
                    <select
                      value={newTechRole}
                      onChange={(e) => setNewTechRole(e.target.value)}
                      className="w-full px-2 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs outline-none focus:border-primary"
                    >
                      <option value="Técnico de Banco">Técnico de Banco</option>
                      <option value="Técnico Senior">Técnico Senior</option>
                      <option value="Especialista Microsoldadura">Microsoldadura</option>
                      <option value="Control de Stock & Recepción">Control Stock</option>
                      <option value="Supervisor de Taller">Supervisor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-on-surface-variant mb-0.5">
                      PIN (4 dígitos)
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="1234"
                      value={newTechPin}
                      onChange={(e) => setNewTechPin(e.target.value)}
                      className="w-full px-2 py-1.5 bg-surface-container-lowest border border-outline-variant rounded font-code-sm text-xs font-bold text-center tracking-widest outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-0.5">
                    Especialidad Técnica
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Pantallas OLED, Conectores FPC"
                    value={newTechSpecialty}
                    onChange={(e) => setNewTechSpecialty(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-0.5">
                    Ubicación / Puesto Asignado
                  </label>
                  <input
                    type="text"
                    placeholder="Taller Central // Banco #06"
                    value={newTechStation}
                    onChange={(e) => setNewTechStation(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline-variant rounded font-code-sm text-xs outline-none focus:border-primary"
                  />
                </div>

                <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="newTechIsAdminCheck"
                    checked={newTechIsAdmin}
                    onChange={(e) => setNewTechIsAdmin(e.target.checked)}
                    className="mt-0.5 rounded border-outline-variant text-amber-600 focus:ring-amber-500 h-4 w-4 cursor-pointer accent-amber-600"
                  />
                  <label htmlFor="newTechIsAdminCheck" className="cursor-pointer text-xs">
                    <span className="font-bold text-on-surface flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-amber-600">verified_user</span>
                      Conceder Permisos de Administrador
                    </span>
                    <span className="block text-[10px] text-tertiary mt-0.5">
                      Podrá dar de alta/baja técnicos y gestionar permisos en el taller.
                    </span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant">
                  <button
                    type="button"
                    onClick={() => setShowAddTechModal(false)}
                    className="px-3 py-1.5 bg-surface border border-outline-variant rounded text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-primary text-on-primary rounded text-xs font-headline-md font-bold hover:bg-primary-container shadow"
                  >
                    Guardar Técnico
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CONFIRM DELETE TECHNICIAN */}
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
                    Acción de Administrador
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-surface-container rounded-xl flex items-center gap-3 border border-outline-variant/50">
                <img
                  src={confirmDeleteUser.avatar}
                  alt={confirmDeleteUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-outline-variant shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-on-surface truncate">
                    {confirmDeleteUser.name}
                  </p>
                  <p className="text-[11px] font-code-sm text-primary font-semibold">
                    {confirmDeleteUser.code} • {confirmDeleteUser.role}
                  </p>
                  <p className="text-[10px] text-tertiary truncate">
                    {confirmDeleteUser.station}
                  </p>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                El perfil de <strong>{confirmDeleteUser.name}</strong> será retirado del sistema. Si tenía órdenes de trabajo activas, deberán reasignarse.
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

        {/* ADMIN AUTH MODAL */}
        {showAdminAuthModal && (
          <AdminAuthModal
            adminUsers={adminUsers}
            title="Autorización de Administrador Requerida"
            reason="Se requiere verificar credenciales de Administrador para gestionar altas, bajas y permisos de técnicos."
            onSuccess={() => {
              setAdminUnlocked(true);
              setShowAdminAuthModal(false);
              showNotice('Permisos de Administrador concedidos para esta sesión.');
            }}
            onClose={() => setShowAdminAuthModal(false)}
          />
        )}
      </main>

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-3 py-1.5 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/40 shadow-[0_-2px_10px_rgba(11,28,48,0.06)]">
        <button
          onClick={onBack}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container px-3 py-1 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          <span className="text-[11px] font-label-sm leading-tight mt-0.5">Inventario</span>
        </button>

        <button
          onClick={onOpenScanner}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container px-3 py-1 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
          <span className="text-[11px] font-label-sm leading-tight mt-0.5">Escáner</span>
        </button>

        <button
          onClick={onOpenAddPart}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container px-3 py-1 active:scale-95 transition-transform -mt-2"
        >
          <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md hover:bg-primary-container">
            <span className="material-symbols-outlined text-[24px]">add_circle</span>
          </div>
          <span className="text-[11px] font-label-sm leading-tight mt-0.5">Añadir</span>
        </button>

        <button
          className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded px-3 py-1 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            sync_alt
          </span>
          <span className="text-[11px] font-label-sm font-semibold leading-tight mt-0.5">Ajustes</span>
        </button>
      </nav>
    </div>
  );
};
