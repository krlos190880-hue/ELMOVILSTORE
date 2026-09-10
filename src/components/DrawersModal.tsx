import React, { useState } from 'react';
import { DrawerLocation, SparePart, PartCategory } from '../types';
import { soundFX } from '../utils/audio';

interface DrawersModalProps {
  isOpen: boolean;
  onClose: () => void;
  drawers: DrawerLocation[];
  parts: SparePart[];
  onSelectDrawerFilter: (drawerCode: string) => void;
  onAddNewDrawer: (newDrawer: DrawerLocation) => void;
  onRegisterInDrawer: (drawerCode: string) => void;
}

export const DrawersModal: React.FC<DrawersModalProps> = ({
  isOpen,
  onClose,
  drawers,
  parts,
  onSelectDrawerFilter,
  onAddNewDrawer,
  onRegisterInDrawer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('todos');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Drawer Form State
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newModule, setNewModule] = useState('Módulo A (Pantallas)');
  const [newBayRack, setNewBayRack] = useState('BAY-01 // RACK-A');
  const [newCategory, setNewCategory] = useState<PartCategory>('pantallas');
  const [newCapacity, setNewCapacity] = useState<number>(20);
  const [newDescription, setNewDescription] = useState('');
  const [customModuleInput, setCustomModuleInput] = useState('');

  if (!isOpen) return null;

  // Extract unique modules
  const modules = Array.from(new Set(drawers.map((d) => d.module))).filter(Boolean);

  // Filtered drawers
  const filteredDrawers = drawers.filter((d) => {
    const matchesSearch =
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.bayRack.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesModule = selectedModuleFilter === 'todos' || d.module === selectedModuleFilter;

    return matchesSearch && matchesModule;
  });

  // Calculate drawer occupancy
  const getDrawerStats = (drawerCode: string) => {
    const partsInDrawer = parts.filter((p) => p.drawer.trim().toLowerCase() === drawerCode.trim().toLowerCase());
    const totalUnits = partsInDrawer.reduce((acc, p) => acc + p.stock, 0);
    return { count: partsInDrawer.length, totalUnits, partsInDrawer };
  };

  const handleSaveDrawer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    soundFX.playSuccessChime();

    const resolvedModule = customModuleInput.trim() ? customModuleInput.trim() : newModule;

    const createdDrawer: DrawerLocation = {
      id: `gw-${Date.now()}`,
      code: newCode.trim(),
      name: newName.trim(),
      module: resolvedModule,
      bayRack: newBayRack.trim() || 'BAY-01 // RACK-A',
      workshop: 'Taller Central',
      category: newCategory,
      capacity: newCapacity || 20,
      description: newDescription.trim() || undefined,
    };

    onAddNewDrawer(createdDrawer);
    setIsAddingNew(false);
    // Reset form
    setNewCode('');
    setNewName('');
    setCustomModuleInput('');
    setNewDescription('');
  };

  const totalOccupied = drawers.filter((d) => getDrawerStats(d.code).count > 0).length;
  const totalFree = drawers.length - totalOccupied;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-surface border border-outline-variant/70 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* MODAL TOP HEADER */}
        <div className="px-5 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">grid_view</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                  Catálogo y Mapa de Gavetas
                </h2>
                <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/30 rounded font-code-sm text-xs font-bold">
                  {drawers.length} Gavetas registradas
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Localización física por módulos, bahías y estanterías en Taller Central
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFX.playClick();
                setIsAddingNew(!isAddingNew);
              }}
              className={`px-3 py-1.5 rounded text-xs font-headline-md font-bold flex items-center gap-1.5 transition-all ${
                isAddingNew
                  ? 'bg-surface-container-highest text-on-surface'
                  : 'bg-primary text-on-primary shadow hover:bg-primary-container'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {isAddingNew ? 'close' : 'add_circle'}
              </span>
              <span>{isAddingNew ? 'Cancelar' : '+ Agregar Gaveta'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
              title="Cerrar ventana"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* METRICS BAR */}
        <div className="grid grid-cols-3 divide-x divide-outline-variant/40 bg-surface-container-lowest border-b border-outline-variant/60 px-5 py-2.5 text-center text-xs">
          <div>
            <span className="text-on-surface-variant font-medium">Total Gavetas</span>
            <p className="font-metric-badge font-bold text-sm text-on-surface">{drawers.length} bins</p>
          </div>
          <div>
            <span className="text-on-surface-variant font-medium">Ocupadas con Stock</span>
            <p className="font-metric-badge font-bold text-sm text-primary">{totalOccupied} activas</p>
          </div>
          <div>
            <span className="text-on-surface-variant font-medium">Libres / Disponibles</span>
            <p className="font-metric-badge font-bold text-sm text-green-700">{totalFree} disponibles</p>
          </div>
        </div>

        {/* CONDITIONAL: FORM TO ADD NEW DRAWER */}
        {isAddingNew && (
          <form
            onSubmit={handleSaveDrawer}
            className="p-4 sm:p-5 bg-surface-container-low border-b border-outline-variant space-y-4 animate-in slide-in-from-top-4 duration-150"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-sm font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">domain_add</span>
                <span>Registrar Nueva Gaveta o Compartimento en Taller</span>
              </h3>
              <span className="text-xs text-on-surface-variant font-code-sm">ID: gw-{Date.now().toString().slice(-4)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-label-sm font-semibold text-on-surface-variant mb-1">
                  Código de Gaveta * (Ej: Gaveta B-11, Caja D-07)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Gaveta C-08"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface border border-outline-variant rounded text-xs text-on-surface font-code-sm focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-label-sm font-semibold text-on-surface-variant mb-1">
                  Nombre descriptivo del repuesto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Módulos FaceID & Sensores iPhone 14"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface border border-outline-variant rounded text-xs text-on-surface focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-label-sm font-semibold text-on-surface-variant mb-1">
                  Bahía / Rack
                </label>
                <input
                  type="text"
                  placeholder="Ej: BAY-02 // RACK-B"
                  value={newBayRack}
                  onChange={(e) => setNewBayRack(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface border border-outline-variant rounded text-xs text-on-surface font-code-sm focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-label-sm font-semibold text-on-surface-variant mb-1">
                  Módulo / Estantería
                </label>
                <select
                  value={newModule}
                  onChange={(e) => setNewModule(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface border border-outline-variant rounded text-xs text-on-surface focus:border-primary outline-none"
                >
                  <option value="Módulo A (Pantallas)">Módulo A (Pantallas)</option>
                  <option value="Módulo B (Alimentación)">Módulo B (Alimentación)</option>
                  <option value="Módulo C (Conectividad)">Módulo C (Conectividad)</option>
                  <option value="Estantería 2">Estantería 2 (Estructura y Chasis)</option>
                  <option value="Módulo E (Microelectrónica)">Módulo E (Microelectrónica)</option>
                  <option value="Caja Fuerte Seguridad">Caja Fuerte Seguridad</option>
                  <option value="Banco Técnico Rápido">Banco Técnico Rápido</option>
                  <option value="OTRO">Otro módulo personalizado...</option>
                </select>
                {newModule === 'OTRO' && (
                  <input
                    type="text"
                    placeholder="Escribe el nombre del módulo nuevo..."
                    value={customModuleInput}
                    onChange={(e) => setCustomModuleInput(e.target.value)}
                    className="w-full mt-1.5 px-3 py-1.5 bg-surface border border-outline-variant rounded text-xs text-on-surface focus:border-primary outline-none"
                  />
                )}
              </div>

              <div>
                <label className="block text-[11px] font-label-sm font-semibold text-on-surface-variant mb-1">
                  Categoría recomendada
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as PartCategory)}
                  className="w-full px-3 py-1.5 bg-surface border border-outline-variant rounded text-xs text-on-surface focus:border-primary outline-none"
                >
                  <option value="pantallas">Pantallas</option>
                  <option value="baterias">Baterías</option>
                  <option value="flex">Flex / Conectores</option>
                  <option value="camaras">Cámaras</option>
                  <option value="placas">Placas / ICs</option>
                  <option value="todos">Miscelánea / Todos</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-label-sm font-semibold text-on-surface-variant mb-1">
                  Capacidad máxima estimada
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(parseInt(e.target.value) || 20)}
                  className="w-full px-3 py-1.5 bg-surface border border-outline-variant rounded text-xs text-on-surface focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-label-sm font-semibold text-on-surface-variant mb-1">
                Descripción o notas de ubicación física
              </label>
              <input
                type="text"
                placeholder="Ej: Fila 3 compartimento central con protección antiestática ESD..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-3 py-1.5 bg-surface border border-outline-variant rounded text-xs text-on-surface focus:border-primary outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 bg-surface border border-outline-variant rounded text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                Descartar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-primary text-on-primary rounded text-xs font-headline-md font-bold hover:bg-primary-container shadow"
              >
                Guardar Gaveta en Taller
              </button>
            </div>
          </form>
        )}

        {/* SEARCH AND FILTER BAR */}
        <div className="p-3 sm:px-5 bg-surface-container-lowest border-b border-outline-variant/50 flex flex-col sm:flex-row gap-2.5 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-on-surface-variant text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar gaveta, código o repuesto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-surface border border-outline-variant rounded text-xs text-on-surface focus:border-primary outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs text-on-surface-variant font-medium shrink-0">Módulo:</span>
            <button
              onClick={() => setSelectedModuleFilter('todos')}
              className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedModuleFilter === 'todos'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Todos ({drawers.length})
            </button>
            {modules.map((mod) => (
              <button
                key={mod}
                onClick={() => setSelectedModuleFilter(mod)}
                className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedModuleFilter === mod
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {mod.replace(' (Pantallas)', '').replace(' (Alimentación)', '').replace(' (Conectividad)', '').replace(' (Microelectrónica)', '')}
              </button>
            ))}
          </div>
        </div>

        {/* DRAWERS GRID LIST */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-surface-container-lowest">
          {filteredDrawers.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
              <p className="font-semibold text-sm">No se encontraron gavetas con ese criterio.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedModuleFilter('todos');
                }}
                className="mt-2 text-xs text-primary font-bold hover:underline"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDrawers.map((drawer) => {
                const stats = getDrawerStats(drawer.code);
                const isOccupied = stats.count > 0;
                const capacityPercent = Math.min(100, Math.round((stats.totalUnits / (drawer.capacity || 20)) * 100));

                return (
                  <div
                    key={drawer.id}
                    className="p-3.5 bg-surface border border-outline-variant/60 rounded-lg hover:border-primary/50 transition-all flex flex-col justify-between group shadow-xs hover:shadow-sm"
                  >
                    <div>
                      {/* TOP BADGES */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="px-2 py-0.5 rounded font-code-sm text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                          {drawer.code}
                        </span>
                        <span className="font-code-sm text-[10px] text-tertiary bg-surface-container px-1.5 py-0.5 rounded">
                          {drawer.bayRack}
                        </span>
                      </div>

                      {/* DRAWER NAME & MODULE */}
                      <h4 className="font-headline-md text-xs sm:text-sm font-bold text-on-surface line-clamp-1">
                        {drawer.name}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                        {drawer.module}
                      </p>

                      {drawer.description && (
                        <p className="text-[10px] text-on-surface-variant/80 italic mt-1 line-clamp-1">
                          {drawer.description}
                        </p>
                      )}

                      {/* STOCK STATUS IN THIS DRAWER */}
                      <div className="mt-3 p-2 rounded bg-surface-container-low border border-outline-variant/40">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[11px] font-semibold text-on-surface-variant">
                            {isOccupied ? `${stats.count} pieza(s) (${stats.totalUnits} uds)` : 'Sin repuestos'}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              isOccupied
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {isOccupied ? `${capacityPercent}% capacidad` : 'Libre'}
                          </span>
                        </div>

                        {/* Capacity progress bar */}
                        <div className="w-full h-1.5 bg-outline-variant/40 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              capacityPercent > 80
                                ? 'bg-amber-500'
                                : capacityPercent > 0
                                ? 'bg-primary'
                                : 'bg-transparent'
                            }`}
                            style={{ width: `${capacityPercent}%` }}
                          ></div>
                        </div>

                        {/* Stored parts preview */}
                        {isOccupied && (
                          <div className="mt-2 pt-1.5 border-t border-outline-variant/30 space-y-0.5">
                            {stats.partsInDrawer.slice(0, 2).map((p) => (
                              <div key={p.id} className="flex items-center justify-between text-[10px]">
                                <span className="text-on-surface truncate max-w-[140px] font-medium">{p.name}</span>
                                <span className="text-primary font-bold">{p.stock} ud</span>
                              </div>
                            ))}
                            {stats.partsInDrawer.length > 2 && (
                              <span className="text-[9px] text-tertiary">
                                +{stats.partsInDrawer.length - 2} repuestos más
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="mt-3 pt-2 border-t border-outline-variant/30 flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          onSelectDrawerFilter(drawer.code);
                          onClose();
                        }}
                        className="flex-1 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                        title="Filtrar inventario por esta gaveta"
                      >
                        <span className="material-symbols-outlined text-xs">filter_alt</span>
                        <span>Filtrar</span>
                      </button>

                      <button
                        onClick={() => {
                          soundFX.playClick();
                          onRegisterInDrawer(drawer.code);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                        title="Registrar nuevo repuesto en esta gaveta"
                      >
                        <span className="material-symbols-outlined text-xs">add</span>
                        <span>Asignar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-5 py-3 bg-surface-container-low border-t border-outline-variant/60 flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">
            Usa el botón <strong>Filtrar</strong> para ver los repuestos exactos asignados a cualquier gaveta física.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-surface border border-outline-variant rounded font-semibold text-on-surface hover:bg-surface-container-high"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
