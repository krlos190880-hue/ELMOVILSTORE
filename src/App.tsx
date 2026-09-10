import { useState } from 'react';
import { SparePart, RecentScan, DrawerLocation, TechnicianUser } from './types';
import { INITIAL_PARTS, WORK_ORDERS, INITIAL_RECENT_SCANS, INITIAL_DRAWERS } from './data/mockData';
import { INITIAL_USERS } from './data/mockUsers';
import { LoginScreen } from './components/LoginScreen';
import { InventoryScreen } from './components/InventoryScreen';
import { ScannerScreen } from './components/ScannerScreen';
import { PartDetailScreen } from './components/PartDetailScreen';
import { RegisterPartScreen } from './components/RegisterPartScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ThermalLabelModal } from './components/ThermalLabelModal';
import { WorkOrderModal } from './components/WorkOrderModal';
import { DrawersModal } from './components/DrawersModal';
import { soundFX } from './utils/audio';

type ScreenType = 'inventory' | 'scanner' | 'detail' | 'register' | 'settings';

export default function App() {
  const [users, setUsers] = useState<TechnicianUser[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<TechnicianUser | null>(INITIAL_USERS[0]);

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('register');
  const [parts, setParts] = useState<SparePart[]>(INITIAL_PARTS);
  const [drawers, setDrawers] = useState<DrawerLocation[]>(INITIAL_DRAWERS);
  const [selectedDrawerFilter, setSelectedDrawerFilter] = useState<string | null>(null);
  const [isDrawersModalOpen, setIsDrawersModalOpen] = useState(false);
  const [drawerForNewPart, setDrawerForNewPart] = useState<string | null>(null);
  const [workOrders] = useState(WORK_ORDERS);
  const [recentScans, setRecentScans] = useState<RecentScan[]>(INITIAL_RECENT_SCANS);
  const [selectedPartId, setSelectedPartId] = useState<string>(INITIAL_PARTS[0].id);

  // Modals
  const [thermalModalPart, setThermalModalPart] = useState<SparePart | null>(null);
  const [workOrderModalPart, setWorkOrderModalPart] = useState<SparePart | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleAddNewDrawer = (newDrawer: DrawerLocation) => {
    setDrawers((prev) => [newDrawer, ...prev]);
    showToast(`Gaveta ${newDrawer.code} agregada con éxito`);
  };

  const handleLogout = () => {
    soundFX.playClick();
    setCurrentUser(null);
    showToast('Sesión de técnico finalizada');
  };

  const handleSwitchUser = () => {
    soundFX.playClick();
    setCurrentUser(null);
  };

  const handleAddNewUser = (newUser: TechnicianUser) => {
    setUsers((prev) => [...prev, newUser]);
    showToast(`Técnico ${newUser.name} (${newUser.code}) registrado`);
  };

  const handleDeleteUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const adminCount = users.filter((u) => u.isAdmin).length;
    if (target.isAdmin && adminCount <= 1) {
      soundFX.playErrorBeep();
      showToast('No puedes eliminar al único Administrador del taller');
      return;
    }

    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast(`Técnico ${target.name} dado de baja`);

    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  const handleToggleAdminUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const willBeAdmin = !target.isAdmin;
    if (!willBeAdmin) {
      const adminCount = users.filter((u) => u.isAdmin).length;
      if (adminCount <= 1) {
        soundFX.playErrorBeep();
        showToast('Debe existir al menos un Administrador en el taller');
        return;
      }
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              isAdmin: willBeAdmin,
              roleBadge: willBeAdmin ? 'ADMIN' : 'TÉCNICO',
            }
          : u
      )
    );

    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              isAdmin: willBeAdmin,
              roleBadge: willBeAdmin ? 'ADMIN' : 'TÉCNICO',
            }
          : null
      );
    }

    showToast(
      willBeAdmin
        ? `Permisos de Administrador concedidos a ${target.name}`
        : `Permisos de Administrador revocados a ${target.name}`
    );
  };

  const selectedPart = parts.find((p) => p.id === selectedPartId) || parts[0];

  // Stock Delta adjustment
  const handleUpdateStock = (partId: string, delta: number) => {
    setParts((prevParts) =>
      prevParts.map((p) => {
        if (p.id === partId) {
          const newStock = Math.max(0, p.stock + delta);
          const type: 'entrada' | 'salida' = delta >= 0 ? 'entrada' : 'salida';
          const newMove = {
            id: `mv-${Date.now()}`,
            type,
            quantity: Math.abs(delta),
            description: delta >= 0 ? `Ajuste manual (+${delta} uds)` : `Ajuste manual (-${Math.abs(delta)} uds)`,
            technician: currentUser ? `${currentUser.name} (${currentUser.code})` : 'Carlos M. (#04)',
            timestamp: 'Hace un momento',
          };
          return {
            ...p,
            stock: newStock,
            moveHistory: [newMove, ...p.moveHistory],
          };
        }
        return p;
      })
    );

    showToast(delta >= 0 ? `Stock actualizado (+${delta})` : `Stock actualizado (-${Math.abs(delta)})`);
  };

  // Confirm Movement from Scanner Screen
  const handleConfirmMovement = (partId: string, type: 'salida' | 'entrada', qty: number, orderRef: string) => {
    const part = parts.find((p) => p.id === partId);
    if (!part) return;

    if (type === 'salida' && part.stock < qty) {
      alert(`No hay stock suficiente para ${part.name} (Stock: ${part.stock})`);
      return;
    }

    const delta = type === 'salida' ? -qty : qty;
    handleUpdateStock(partId, delta);

    // Add to recent scans
    const newScan: RecentScan = {
      id: `scan-${Date.now()}`,
      partId,
      partName: part.name,
      sku: part.sku,
      refCode: type === 'salida' ? `${orderRef} (-${qty})` : `${orderRef} (+${qty})`,
      type,
      qty,
      dotColor: type === 'salida' ? 'bg-primary' : 'bg-secondary-container',
    };
    setRecentScans((prev) => [newScan, ...prev.slice(0, 4)]);

    showToast(`Movimiento registrado: ${type === 'salida' ? '-' : '+'}${qty} ud para ${orderRef}`);
  };

  // Assign to work order from WorkOrderModal
  const handleAssignWorkOrder = (partId: string, orderId: string, technician: string) => {
    const part = parts.find((p) => p.id === partId);
    if (!part || part.stock <= 0) return;

    const assignedTechnician = currentUser
      ? `${currentUser.name} (${currentUser.code})`
      : technician || 'Carlos M. (#04)';

    setParts((prev) =>
      prev.map((p) => {
        if (p.id === partId) {
          const newStock = Math.max(0, p.stock - 1);
          const newMove = {
            id: `mv-${Date.now()}`,
            type: 'salida' as const,
            quantity: 1,
            description: `-1 ud para Orden #${orderId}`,
            orderRef: orderId,
            technician: assignedTechnician,
            timestamp: 'Hace un momento',
          };
          return {
            ...p,
            stock: newStock,
            moveHistory: [newMove, ...p.moveHistory],
          };
        }
        return p;
      })
    );

    const newScan: RecentScan = {
      id: `scan-${Date.now()}`,
      partId,
      partName: part.name,
      sku: part.sku,
      refCode: `${orderId} (-1)`,
      type: 'salida',
      qty: 1,
      dotColor: 'bg-green-600',
    };
    setRecentScans((prev) => [newScan, ...prev.slice(0, 4)]);

    setWorkOrderModalPart(null);
    showToast(`Asignado con éxito a ${orderId} (-1 ud)`);
  };

  // Save newly registered part
  const handleSavePart = (newPart: SparePart) => {
    setParts((prev) => [newPart, ...prev]);
    setSelectedPartId(newPart.id);
    // Keep user on the register screen as home screen, and show label modal
    setCurrentScreen('register');
    setThermalModalPart(newPart);
    showToast(`✓ Repuesto ${newPart.sku} registrado en ${newPart.drawer}`);
  };

  // IF NO USER LOGGED IN, SHOW INITIAL LOGIN SCREEN
  if (!currentUser) {
    return (
      <div className="min-h-full bg-surface text-on-surface flex flex-col justify-between font-body-md antialiased relative">
        <LoginScreen
          users={users}
          onLogin={(user) => {
            setCurrentUser(user);
            showToast(`Bienvenido al taller, ${user.name} (${user.code})`);
          }}
          onAddNewUser={handleAddNewUser}
          onDeleteUser={handleDeleteUser}
        />

        {/* TOAST NOTIFICATION */}

        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-inverse-surface text-inverse-on-surface rounded-full shadow-2xl border border-secondary-container/40 flex items-center gap-2 font-code-sm text-xs animate-in fade-in slide-in-from-top-3 duration-200">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
            <span className="font-semibold">{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-full bg-surface text-on-surface flex flex-col justify-between font-body-md antialiased relative">
      {/* Active Screen View */}
      {currentScreen === 'inventory' && (
        <InventoryScreen
          parts={parts}
          drawers={drawers}
          selectedDrawerFilter={selectedDrawerFilter}
          currentUser={currentUser}
          onLogout={handleLogout}
          onSwitchUser={handleSwitchUser}
          onSetDrawerFilter={(drawerCode) => setSelectedDrawerFilter(drawerCode)}
          onOpenDrawersModal={() => setIsDrawersModalOpen(true)}
          onSelectPart={(part) => {
            soundFX.playClick();
            setSelectedPartId(part.id);
            setCurrentScreen('detail');
          }}
          onOpenScanner={() => {
            setCurrentScreen('scanner');
          }}
          onOpenAddPart={() => {
            setDrawerForNewPart(null);
            setCurrentScreen('register');
          }}
          onOpenSettings={() => {
            setCurrentScreen('settings');
          }}
          onUpdateStock={handleUpdateStock}
          onQuickRepairExit={(part) => {
            soundFX.playClick();
            setWorkOrderModalPart(part);
          }}
        />
      )}

      {currentScreen === 'scanner' && (
        <ScannerScreen
          parts={parts}
          workOrders={workOrders}
          recentScans={recentScans}
          onClose={() => setCurrentScreen('inventory')}
          onConfirmMovement={handleConfirmMovement}
          onOpenDetail={(part) => {
            setSelectedPartId(part.id);
            setCurrentScreen('detail');
          }}
        />
      )}

      {currentScreen === 'detail' && selectedPart && (
        <PartDetailScreen
          part={selectedPart}
          onBack={() => setCurrentScreen('inventory')}
          onOpenScanner={() => setCurrentScreen('scanner')}
          onUpdateStock={handleUpdateStock}
          onAssignWorkOrder={(part) => {
            soundFX.playClick();
            setWorkOrderModalPart(part);
          }}
          onPrintThermalLabel={(part) => {
            soundFX.playClick();
            setThermalModalPart(part);
          }}
        />
      )}

      {currentScreen === 'register' && (
        <RegisterPartScreen
          onClose={() => setCurrentScreen('inventory')}
          onSavePart={handleSavePart}
          drawers={drawers}
          initialDrawer={drawerForNewPart || undefined}
          currentUser={currentUser}
          onAddNewDrawer={handleAddNewDrawer}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenDrawersModal={() => setIsDrawersModalOpen(true)}
          totalPartsCount={parts.length}
          onSwitchUser={handleSwitchUser}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen
          parts={parts}
          workOrders={workOrders}
          drawers={drawers}
          currentUser={currentUser}
          users={users}
          onAddNewUser={handleAddNewUser}
          onDeleteUser={handleDeleteUser}
          onToggleAdminUser={handleToggleAdminUser}
          onLogout={handleLogout}
          onSwitchUser={handleSwitchUser}
          onOpenDrawersModal={() => setIsDrawersModalOpen(true)}
          onBack={() => setCurrentScreen('inventory')}
          onOpenScanner={() => setCurrentScreen('scanner')}
          onOpenAddPart={() => {
            setDrawerForNewPart(null);
            setCurrentScreen('register');
          }}
        />
      )}


      {/* MODAL: Gestion y Mapa de Gavetas */}
      <DrawersModal
        isOpen={isDrawersModalOpen}
        onClose={() => setIsDrawersModalOpen(false)}
        drawers={drawers}
        parts={parts}
        onSelectDrawerFilter={(drawerCode) => {
          setSelectedDrawerFilter(drawerCode);
          setIsDrawersModalOpen(false);
          setCurrentScreen('inventory');
          showToast(`Filtrando inventario por ${drawerCode}`);
        }}
        onAddNewDrawer={handleAddNewDrawer}
        onRegisterInDrawer={(drawerCode) => {
          setDrawerForNewPart(drawerCode);
          setIsDrawersModalOpen(false);
          setCurrentScreen('register');
        }}
      />

      {/* MODAL: Thermal Label Preview & Print */}
      {thermalModalPart && (
        <ThermalLabelModal
          part={thermalModalPart}
          onClose={() => setThermalModalPart(null)}
        />
      )}

      {/* MODAL: Assign to Work Order */}
      {workOrderModalPart && (
        <WorkOrderModal
          part={workOrderModalPart}
          workOrders={workOrders}
          onAssign={handleAssignWorkOrder}
          onClose={() => setWorkOrderModalPart(null)}
        />
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-inverse-surface text-inverse-on-surface rounded-full shadow-2xl border border-secondary-container/40 flex items-center gap-2 font-code-sm text-xs animate-in fade-in slide-in-from-top-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
