import React, { useState, useMemo } from 'react';
import { SparePart, PartCategory, StockFilter, DrawerLocation, TechnicianUser, ConditionFilter } from '../types';
import { soundFX } from '../utils/audio';

interface InventoryScreenProps {
  parts: SparePart[];
  drawers?: DrawerLocation[];
  selectedDrawerFilter?: string | null;
  currentUser?: TechnicianUser | null;
  onLogout?: () => void;
  onSwitchUser?: () => void;
  onSetDrawerFilter?: (drawerCode: string | null) => void;
  onOpenDrawersModal?: () => void;
  onSelectPart: (part: SparePart) => void;
  onOpenScanner: () => void;
  onOpenAddPart: () => void;
  onOpenSettings: () => void;
  onUpdateStock: (partId: string, delta: number) => void;
  onQuickRepairExit: (part: SparePart) => void;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({
  parts,
  drawers = [],
  selectedDrawerFilter = null,
  currentUser = null,
  onLogout,
  onSwitchUser,
  onSetDrawerFilter,
  onOpenDrawersModal,
  onSelectPart,
  onOpenScanner,
  onOpenAddPart,
  onOpenSettings,
  onUpdateStock,
  onQuickRepairExit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PartCategory>('todos');
  const [selectedStockFilter, setSelectedStockFilter] = useState<StockFilter>('todo');
  const [selectedConditionFilter, setSelectedConditionFilter] = useState<ConditionFilter>('todos');
  const [selectedBranch, setSelectedBranch] = useState('Taller Central // Gaveta A');
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(
    currentUser ? `Hoy 14:32 (${currentUser.code})` : 'Hoy 14:32 (Técnico #04)'
  );

  const categoryCounts = useMemo(() => {
    return {
      todos: parts.length,
      pantallas: parts.filter((p) => p.category === 'pantallas').length,
      baterias: parts.filter((p) => p.category === 'baterias').length,
      flex: parts.filter((p) => p.category === 'flex').length,
      camaras: parts.filter((p) => p.category === 'camaras').length,
      placas: parts.filter((p) => p.category === 'placas').length,
    };
  }, [parts]);

  const stockBajoCount = useMemo(() => parts.filter((p) => p.stock > 0 && p.stock <= p.minStockAlert).length, [parts]);
  const agotadosCount = useMemo(() => parts.filter((p) => p.stock === 0).length, [parts]);
  const segundaManoCount = useMemo(() => parts.filter((p) => p.condition === 'segunda_mano').length, [parts]);
  const nuevosCount = useMemo(() => parts.filter((p) => p.condition !== 'segunda_mano').length, [parts]);

  const totalValuation = useMemo(() => {
    return parts.reduce((acc, p) => acc + p.stock * p.pvpPrice, 0);
  }, [parts]);

  const filteredParts = useMemo(() => {
    return parts.filter((p) => {
      if (selectedDrawerFilter && p.drawer.trim().toLowerCase() !== selectedDrawerFilter.trim().toLowerCase()) {
        return false;
      }
      if (selectedCategory !== 'todos' && p.category !== selectedCategory) {
        return false;
      }
      if (selectedStockFilter === 'bajo' && (p.stock === 0 || p.stock > p.minStockAlert)) {
        return false;
      }
      if (selectedStockFilter === 'agotado' && p.stock !== 0) {
        return false;
      }
      if (selectedConditionFilter === 'segunda_mano' && p.condition !== 'segunda_mano') {
        return false;
      }
      if (selectedConditionFilter === 'nuevos' && p.condition === 'segunda_mano') {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const isSecondHandSearch =
          p.condition === 'segunda_mano' &&
          (query.includes('segunda') ||
            query.includes('mano') ||
            query.includes('usad') ||
            query.includes('despiece') ||
            query.includes('salvage') ||
            query.includes('reacond'));

        const matchesName = p.name.toLowerCase().includes(query);
        const matchesSku = p.sku.toLowerCase().includes(query);
        const matchesDrawer = p.drawer.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesGrade = p.conditionGrade?.toLowerCase().includes(query) ?? false;
        const matchesDonor = p.donorDevice?.toLowerCase().includes(query) ?? false;

        if (!matchesName && !matchesSku && !matchesDrawer && !matchesBrand && !matchesGrade && !matchesDonor && !isSecondHandSearch) {
          return false;
        }
      }
      return true;
    });
  }, [parts, selectedCategory, selectedStockFilter, selectedConditionFilter, searchQuery, selectedDrawerFilter]);


  const handleSync = () => {
    soundFX.playClick();
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      setLastSyncTime(`Hoy ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} (Técnico #04)`);
    }, 600);
  };

  const branches = [
    'Taller Central // Gaveta A',
    'Taller Central // Gaveta B',
    'Taller Central // Módulo C (Placas)',
    'Taller Norte // Almacén 1',
  ];

  return (
    <div className="bg-surface text-on-surface antialiased min-h-full pb-24 selection:bg-primary selection:text-on-primary font-body-md">
      {/* TOP APP BAR */}
      <header className="bg-surface sticky top-0 z-40 w-full px-3 h-14 flex justify-between items-center bg-surface-container-lowest/90 backdrop-blur-md shadow-xs border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">warehouse</span>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-headline-md font-bold text-primary tracking-tight leading-none">
              Inventario Taller
            </h1>
            <div
              className="flex items-center gap-1 mt-0.5 cursor-pointer relative"
              onClick={() => setShowBranchDropdown(!showBranchDropdown)}
            >
              <span className="text-[10px] font-label-sm text-tertiary">SUCURSAL:</span>
              <span className="text-xs font-code-sm text-primary font-semibold">{selectedBranch}</span>
              <span className="material-symbols-outlined text-[14px] text-tertiary">arrow_drop_down</span>

              {showBranchDropdown && (
                <div className="absolute left-0 top-full mt-1 w-64 bg-surface-container-lowest rounded-lg border border-outline-variant shadow-xl py-1 z-50 animate-in fade-in">
                  {branches.map((b) => (
                    <div
                      key={b}
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFX.playClick();
                        setSelectedBranch(b);
                        setShowBranchDropdown(false);
                      }}
                      className={`px-3 py-2 text-xs font-code-sm cursor-pointer hover:bg-surface-container ${
                        selectedBranch === b ? 'text-primary font-bold bg-primary-fixed/20' : 'text-on-surface'
                      }`}
                    >
                      {b}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              soundFX.playClick();
              alert('Notificaciones: 2 repuestos con stock bajo y 1 orden de trabajo pendiente.');
            }}
            className="w-9 h-9 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant active:scale-95 transition-transform relative"
            title="Notificaciones de taller"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-2 ring-surface"></span>
          </button>

          {/* USER PROFILE CHIP & SWITCH MENU */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setShowUserDropdown(!showUserDropdown);
                }}
                className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full bg-surface-container border border-outline-variant/60 hover:border-primary active:scale-95 transition-all text-xs"
                title={`Sesión activa: ${currentUser.name}`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-primary"
                />
                <span className="font-code-sm font-bold text-on-surface text-[11px] hidden sm:inline">
                  {currentUser.code}
                </span>
                <span className="material-symbols-outlined text-[16px] text-tertiary">
                  arrow_drop_down
                </span>
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-outline-variant/40">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-primary shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-on-surface truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] font-code-sm text-primary font-bold">
                        {currentUser.code} • {currentUser.roleBadge}
                      </p>
                      <p className="text-[9px] text-tertiary truncate">
                        {currentUser.station}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 space-y-1 text-xs">
                    {onSwitchUser && (
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          setShowUserDropdown(false);
                          onSwitchUser();
                        }}
                        className="w-full px-2.5 py-1.5 rounded text-left hover:bg-surface-container text-on-surface flex items-center gap-2 font-medium"
                      >
                        <span className="material-symbols-outlined text-[18px] text-primary">
                          switch_account
                        </span>
                        <span>Cambiar de Técnico</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        soundFX.playClick();
                        setShowUserDropdown(false);
                        onOpenSettings();
                      }}
                      className="w-full px-2.5 py-1.5 rounded text-left hover:bg-surface-container text-on-surface flex items-center gap-2 font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px] text-tertiary">
                        manage_accounts
                      </span>
                      <span>Configurar Puesto &amp; Perfil</span>
                    </button>

                    {onLogout && (
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          setShowUserDropdown(false);
                          onLogout();
                        }}
                        className="w-full px-2.5 py-1.5 rounded text-left hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium border-t border-outline-variant/30 mt-1 pt-1.5"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          logout
                        </span>
                        <span>Cerrar Sesión</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* SEARCH & RAPID ACCESS DOCK */}
      <section className="px-3 pt-2 pb-1 bg-surface">
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-tertiary text-[18px]">
              search
            </span>
            <input
              className="w-full pl-9 pr-8 py-2 bg-surface-container-lowest border border-outline-variant rounded text-xs sm:text-sm font-body-md text-on-surface placeholder:text-tertiary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs"
              placeholder="Buscar por modelo ej: iPhone 14, Galaxy S23, SKU..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
          <button
            onClick={() => {
              soundFX.playScanBeep();
              onOpenScanner();
            }}
            className="h-9 px-3 bg-surface-container-lowest border border-outline-variant hover:border-primary rounded text-primary flex items-center justify-center active:scale-95 transition-transform"
            title="Escanear Código de Barras / QR"
          >
            <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              if (selectedStockFilter === 'todo') setSelectedStockFilter('bajo');
              else if (selectedStockFilter === 'bajo') setSelectedStockFilter('agotado');
              else setSelectedStockFilter('todo');
            }}
            className="h-9 px-3 bg-surface-container-lowest border border-outline-variant hover:border-primary rounded text-on-surface flex items-center justify-center active:scale-95 transition-transform"
            title="Filtros rápidos"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 pb-1">
          <button
            onClick={() => {
              soundFX.playClick();
              setSelectedCategory('todos');
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded text-xs font-label-sm shadow-2xs flex items-center gap-1 transition-all ${
              selectedCategory === 'todos'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span>Todos</span>
            <span
              className={`px-1 rounded text-[10px] font-metric-badge font-bold ${
                selectedCategory === 'todos'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-tertiary bg-surface-container'
              }`}
            >
              {categoryCounts.todos}
            </span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setSelectedCategory('pantallas');
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded text-xs font-label-sm shadow-2xs flex items-center gap-1 transition-all ${
              selectedCategory === 'pantallas'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span>Pantallas</span>
            <span className="text-tertiary font-metric-badge text-[10px]">{categoryCounts.pantallas}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setSelectedCategory('baterias');
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded text-xs font-label-sm shadow-2xs flex items-center gap-1 transition-all ${
              selectedCategory === 'baterias'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span>Baterías</span>
            <span className="text-tertiary font-metric-badge text-[10px]">{categoryCounts.baterias}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setSelectedCategory('flex');
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded text-xs font-label-sm shadow-2xs flex items-center gap-1 transition-all ${
              selectedCategory === 'flex'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span>Flex Carga</span>
            <span className="text-tertiary font-metric-badge text-[10px]">{categoryCounts.flex}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setSelectedCategory('camaras');
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded text-xs font-label-sm shadow-2xs flex items-center gap-1 transition-all ${
              selectedCategory === 'camaras'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span>Cámaras</span>
            <span className="text-tertiary font-metric-badge text-[10px]">{categoryCounts.camaras}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setSelectedCategory('placas');
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded text-xs font-label-sm shadow-2xs flex items-center gap-1 transition-all ${
              selectedCategory === 'placas'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span>Placas</span>
          </button>

          {/* Botón Explorar Gavetas */}
          {onOpenDrawersModal && (
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenDrawersModal();
              }}
              className="whitespace-nowrap px-2.5 py-1 rounded text-xs font-label-sm shadow-2xs flex items-center gap-1.5 bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20 font-bold transition-all"
              title="Explorar y gestionar todas las gavetas del taller"
            >
              <span className="material-symbols-outlined text-[15px]">grid_view</span>
              <span>Gavetas ({drawers.length})</span>
            </button>
          )}
        </div>

        {/* Banner de filtro por gaveta activa */}
        {selectedDrawerFilter && (
          <div className="mt-1.5 px-2.5 py-1.5 bg-primary/10 border border-primary/30 rounded flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-outlined text-primary text-[17px] shrink-0">inventory_2</span>
              <div className="truncate">
                <span className="text-tertiary text-[10px] uppercase font-bold mr-1">Gaveta:</span>
                <strong className="text-primary font-code-sm">{selectedDrawerFilter}</strong>
                <span className="text-on-surface-variant ml-1.5 text-[11px]">({filteredParts.length} repuestos)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {onOpenDrawersModal && (
                <button
                  onClick={onOpenDrawersModal}
                  className="text-primary hover:underline text-[11px] font-bold"
                >
                  Cambiar
                </button>
              )}
              <button
                onClick={() => {
                  soundFX.playClick();
                  onSetDrawerFilter?.(null);
                }}
                className="w-5 h-5 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high active:scale-95"
                title="Quitar filtro de gaveta"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Stock Status Filter Chips */}
        <div className="flex items-center justify-between border-t border-outline-variant/60 pt-1.5 mt-1 text-xs">
          <span className="text-tertiary uppercase text-[10px] tracking-wider font-semibold">Estado Stock:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                soundFX.playClick();
                setSelectedStockFilter('todo');
              }}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                selectedStockFilter === 'todo'
                  ? 'bg-surface-container text-primary font-bold'
                  : 'text-tertiary hover:text-on-surface'
              }`}
            >
              Todo
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setSelectedStockFilter(selectedStockFilter === 'bajo' ? 'todo' : 'bajo');
              }}
              className={`px-2 py-0.5 rounded border font-medium text-[10px] flex items-center gap-1 transition-colors ${
                selectedStockFilter === 'bajo'
                  ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              Stock Bajo ({stockBajoCount})
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setSelectedStockFilter(selectedStockFilter === 'agotado' ? 'todo' : 'agotado');
              }}
              className={`px-2 py-0.5 rounded border font-medium text-[10px] flex items-center gap-1 transition-colors ${
                selectedStockFilter === 'agotado'
                  ? 'bg-red-100 text-red-900 border-red-400 font-bold'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              Agotados ({agotadosCount})
            </button>
          </div>
        </div>

        {/* Condition Filter Bar (Nuevos vs 2ª Mano / Despiece) */}
        <div className="flex items-center justify-between border-t border-outline-variant/60 pt-1.5 mt-1 text-xs">
          <span className="text-tertiary uppercase text-[10px] tracking-wider font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-amber-700">recycling</span>
            Condición:
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                soundFX.playClick();
                setSelectedConditionFilter('todos');
              }}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                selectedConditionFilter === 'todos'
                  ? 'bg-surface-container text-primary font-bold'
                  : 'text-tertiary hover:text-on-surface'
              }`}
            >
              Todos ({parts.length})
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setSelectedConditionFilter(selectedConditionFilter === 'nuevos' ? 'todos' : 'nuevos');
              }}
              className={`px-2 py-0.5 rounded border font-medium text-[10px] flex items-center gap-1 transition-colors ${
                selectedConditionFilter === 'nuevos'
                  ? 'bg-blue-100 text-blue-900 border-blue-400 font-bold'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Nuevos ({nuevosCount})
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setSelectedConditionFilter(selectedConditionFilter === 'segunda_mano' ? 'todos' : 'segunda_mano');
              }}
              className={`px-2 py-0.5 rounded border font-medium text-[10px] flex items-center gap-1 transition-colors ${
                selectedConditionFilter === 'segunda_mano'
                  ? 'bg-amber-100 text-amber-950 border-amber-500 font-bold shadow-2xs ring-1 ring-amber-400/40'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100/70'
              }`}
              title="Filtrar sólo repuestos de segunda mano y despiece"
            >
              <span className="material-symbols-outlined text-[12px] text-amber-700">recycling</span>
              2ª Mano / Despiece ({segundaManoCount})
            </button>
          </div>
        </div>
      </section>

      {/* LISTADO DE TARJETAS DE REPUESTOS */}
      <main className="px-3 py-2 space-y-2.5">
        {filteredParts.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-lowest rounded-lg border border-outline-variant space-y-2">
            <span className="material-symbols-outlined text-4xl text-tertiary">search_off</span>
            <p className="text-sm font-semibold text-on-surface">No se encontraron repuestos con los filtros aplicados</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('todos');
                setSelectedStockFilter('todo');
                setSelectedConditionFilter('todos');
              }}
              className="px-3 py-1 bg-primary text-on-primary rounded text-xs font-semibold"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          filteredParts.map((part) => {
            const isLowStock = part.stock > 0 && part.stock <= part.minStockAlert;
            const isOutOfStock = part.stock === 0;
            const isSecondHand = part.condition === 'segunda_mano';

            return (
              <article
                key={part.id}
                className={`border rounded p-2.5 shadow-2xs relative transition-all ${
                  isOutOfStock
                    ? 'bg-surface-container-lowest border-outline-variant opacity-90'
                    : isSecondHand
                    ? 'bg-amber-50/25 border-amber-300/80 hover:border-amber-400'
                    : isLowStock
                    ? 'bg-amber-50/20 border-amber-300'
                    : 'bg-surface-container-lowest border-outline-variant hover:border-primary/50'
                }`}
              >
                <div className="flex gap-2.5 cursor-pointer" onClick={() => onSelectPart(part)}>
                  <div className="relative w-24 h-24 shrink-0 bg-surface-container-low rounded border border-outline-variant overflow-hidden flex items-center justify-center">
                    <img
                      className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale-[35%]' : ''}`}
                      src={part.images[0]?.url}
                      alt={part.name}
                    />
                    {part.thumbnailTag && (
                      <div className={`absolute bottom-0 left-0 right-0 py-0.5 text-center backdrop-blur-xs ${
                        isSecondHand ? 'bg-amber-950/85 text-amber-200' : 'bg-inverse-surface/80 text-inverse-on-surface'
                      }`}>
                        <span className="text-code-sm text-[9px] font-bold">
                          {part.thumbnailTag}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isSecondHand ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-950 border border-amber-300 shrink-0">
                            <span className="material-symbols-outlined text-[11px] text-amber-700">recycling</span>
                            2ª MANO
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 shrink-0">
                            NUEVO
                          </span>
                        )}

                        {isSecondHand && part.conditionGrade && (
                          <span className="text-[9px] font-semibold text-amber-900 bg-amber-100/70 px-1 py-0.5 rounded border border-amber-200 shrink-0">
                            {part.conditionGrade.split('(')[0].trim()}
                          </span>
                        )}

                        {part.healthPercentage && (
                          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-1 py-0.5 rounded shrink-0">
                            SOH {part.healthPercentage}%
                          </span>
                        )}
                      </div>
                    </div>

                    <h2 className="text-xs sm:text-sm font-title-sm font-semibold text-on-surface line-clamp-1 leading-snug hover:text-primary mt-0.5">
                      {part.name}
                    </h2>
                    <p className="text-[11px] font-label-sm text-tertiary truncate">{part.subtitle}</p>

                    {part.donorDevice && (
                      <p className="text-[10px] text-tertiary truncate mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[11px] text-amber-700">swap_horiz</span>
                        <span><strong className="text-on-surface-variant font-medium">Donante:</strong> {part.donorDevice}</span>
                      </p>
                    )}

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-code-sm">
                      <span className="text-tertiary text-[11px]">
                        SKU: <strong className="text-on-surface font-semibold">{part.sku}</strong>
                      </span>
                      <span className="text-outline-variant">•</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundFX.playClick();
                          onSetDrawerFilter?.(part.drawer);
                        }}
                        className="text-primary font-semibold text-[11px] flex items-center gap-0.5 hover:underline bg-primary/5 hover:bg-primary/15 px-1.5 py-0.5 rounded border border-primary/20 transition-colors"
                        title={`Filtrar inventario por ${part.drawer}`}
                      >
                        <span className="material-symbols-outlined text-[13px]">inventory_2</span>
                        <span>{part.drawer}</span>
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-metric-badge font-bold bg-red-50 text-red-700 border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1"></span>
                          0 uds • Agotado
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-metric-badge font-bold bg-amber-50 text-amber-800 border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-1 animate-pulse"></span>
                          {part.stock} uds • Stock Bajo (Reponer)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-metric-badge font-bold bg-green-50 text-green-800 border border-green-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-1"></span>
                          {part.stock} uds • En Stock
                        </span>
                      )}
                      <span className="text-sm font-display-lg text-primary font-bold">{part.pvpPrice.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>


                {/* Quick Action Bar */}
                <div className="mt-2 pt-1.5 border-t border-outline-variant/60 flex items-center justify-between">
                  {isOutOfStock ? (
                    <span className="text-xs font-label-sm text-error font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">error_outline</span>
                      Sin stock físico
                    </span>
                  ) : isLowStock ? (
                    <span className="text-xs font-label-sm text-amber-800 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                      Umbral mín: {part.minStockAlert}
                    </span>
                  ) : (
                    <span className="text-xs font-label-sm text-tertiary">Ajuste rápido banco:</span>
                  )}

                  <div className="flex items-center gap-2">
                    {!isOutOfStock && (
                      <div className="inline-flex items-center border border-outline-variant rounded bg-surface">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            soundFX.playClick();
                            onUpdateStock(part.id, -1);
                          }}
                          className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-90 transition-transform font-bold text-sm"
                          title="Restar unidad"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-metric-badge text-xs font-bold text-on-surface">
                          {part.stock}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            soundFX.playClick();
                            onUpdateStock(part.id, 1);
                          }}
                          className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-90 transition-transform font-bold text-sm"
                          title="Sumar unidad"
                        >
                          +
                        </button>
                      </div>
                    )}

                    {isOutOfStock ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundFX.playClick();
                          alert(`Solicitud de reposición enviada al proveedor para el repuesto: ${part.sku}`);
                        }}
                        className="px-3 py-1 bg-surface-container text-primary border border-primary/40 rounded text-xs font-semibold hover:bg-surface-container-high active:scale-95 transition-transform flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">shopping_cart</span>
                        <span>Solicitar a Proveedor</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickRepairExit(part);
                        }}
                        className="px-2.5 py-1 bg-primary text-on-primary rounded text-xs font-semibold hover:bg-primary-container active:scale-95 transition-transform flex items-center gap-1 shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-[14px]">build</span>
                        <span>Salida a Taller</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </main>

      {/* QUICK SUMMARY CHIP BAR */}
      <aside className="mx-3 mb-4 p-2.5 bg-surface-container-low border border-outline-variant rounded flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">inventory</span>
          <div>
            <div className="text-xs font-label-sm text-on-surface font-semibold">
              Valoración en Gaveta: {totalValuation.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <div className="text-code-sm text-tertiary text-[10px]">
              Auditoría sincro: {lastSyncTime}
            </div>
          </div>
        </div>
        <button
          onClick={handleSync}
          className="px-2 py-1 bg-surface-container-lowest border border-outline-variant text-primary rounded text-xs font-semibold hover:border-primary active:scale-95 transition-transform flex items-center gap-1"
        >
          <span className={`material-symbols-outlined text-[13px] ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
          <span>Recargar</span>
        </button>
      </aside>

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-3 py-1 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/40 shadow-[0_-2px_10px_rgba(11,28,48,0.06)]">
        <button
          onClick={() => {
            soundFX.playClick();
            onOpenAddPart();
          }}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface px-2 py-1 active:scale-95 transition-transform duration-100"
        >
          <span className="material-symbols-outlined text-[20px]">add_box</span>
          <span className="text-[10px] font-label-sm leading-tight mt-0.5">Inicio (Registro)</span>
        </button>

        <button
          className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded px-2.5 py-1 active:scale-95 transition-transform duration-100"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            inventory_2
          </span>
          <span className="text-[10px] font-label-sm font-bold leading-tight mt-0.5">Inventario</span>
        </button>

        <button
          onClick={() => {
            soundFX.playScanBeep();
            onOpenScanner();
          }}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface px-2 py-1 active:scale-95 transition-transform duration-100"
        >
          <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
          <span className="text-[10px] font-label-sm leading-tight mt-0.5">Escáner</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            if (onOpenDrawersModal) onOpenDrawersModal();
          }}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface px-2 py-1 active:scale-95 transition-transform duration-100"
        >
          <span className="material-symbols-outlined text-[20px]">grid_view</span>
          <span className="text-[10px] font-label-sm leading-tight mt-0.5">Gavetas</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            onOpenSettings();
          }}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface px-2 py-1 active:scale-95 transition-transform duration-100"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
          <span className="text-[10px] font-label-sm leading-tight mt-0.5">Ajustes</span>
        </button>
      </nav>
    </div>
  );
};
