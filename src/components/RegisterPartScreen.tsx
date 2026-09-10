import React, { useState } from 'react';
import { SparePart, PartCategory, DrawerLocation, TechnicianUser, PartCondition, ConditionGrade } from '../types';
import { soundFX } from '../utils/audio';

interface RegisterPartScreenProps {
  onClose?: () => void;
  onSavePart: (part: SparePart) => void;
  drawers?: DrawerLocation[];
  initialDrawer?: string;
  currentUser?: TechnicianUser | null;
  onAddNewDrawer?: (newDrawer: DrawerLocation) => void;
  onNavigate?: (screen: 'inventory' | 'scanner' | 'settings') => void;
  onOpenDrawersModal?: () => void;
  totalPartsCount?: number;
  onSwitchUser?: () => void;
  onLogout?: () => void;
}

export const RegisterPartScreen: React.FC<RegisterPartScreenProps> = ({
  onClose,
  onSavePart,
  drawers = [],
  initialDrawer,
  currentUser = null,
  onAddNewDrawer,
  onNavigate,
  onOpenDrawersModal,
  totalPartsCount = 10,
  onSwitchUser,
  onLogout,
}) => {
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('iPhone 15 Pro Max');
  const [partType, setPartType] = useState('Pantalla Completa OLED / LCD');
  const [quality, setQuality] = useState<'Original Service Pack' | 'OEM / Grado A+' | 'Compatible'>('Original Service Pack');
  const [sku, setSku] = useState('APL-IP15PM-OLED-01');
  const [barcode, setBarcode] = useState('8439201948201');
  const [quantity, setQuantity] = useState(10);
  const [drawer, setDrawer] = useState(initialDrawer || (drawers[0]?.code ?? 'Gaveta A-01'));
  const [showAddDrawerModal, setShowAddDrawerModal] = useState(false);
  const [newDrawerCode, setNewDrawerCode] = useState('');
  const [newDrawerName, setNewDrawerName] = useState('');
  const [newDrawerModule, setNewDrawerModule] = useState('Módulo A (Pantallas)');
  const [newDrawerRack, setNewDrawerRack] = useState('BAY-01 // RACK-A');
  const [costPrice, setCostPrice] = useState(89.50);
  const [pvpPrice, setPvpPrice] = useState(145.00);
  const [techNotes, setTechNotes] = useState('Compatible con transferencia de serial IC y programador JCID V1SE. Conserva función TrueTone.');
  
  const [condition, setCondition] = useState<PartCondition>('nuevo');
  const [conditionGrade, setConditionGrade] = useState<ConditionGrade>('Grado A+ (Impoluto / Como Nuevo)');
  const [donorDevice, setDonorDevice] = useState('');
  const [batteryHealth, setBatteryHealth] = useState(92);
  const [batteryCyclesCount, setBatteryCyclesCount] = useState(145);
  const [testTouchPassed, setTestTouchPassed] = useState(true);
  const [testPowerDrawPassed, setTestPowerDrawPassed] = useState(true);
  const [testSensorPassed, setTestSensorPassed] = useState(true);

  // Photo verification slots
  const [slotFlexCaptured, setSlotFlexCaptured] = useState(false);
  const [slotSerialCaptured, setSlotSerialCaptured] = useState(false);
  const [captureFlash, setCaptureFlash] = useState(false);

  // Dynamic calculations
  const grossMargin = pvpPrice - costPrice;
  const roiPercentage = costPrice > 0 ? ((grossMargin / costPrice) * 100).toFixed(1) : '0.0';

  const handleTakePhoto = () => {
    soundFX.playClick();
    setCaptureFlash(true);
    setTimeout(() => setCaptureFlash(false), 200);
    if (!slotFlexCaptured) {
      setSlotFlexCaptured(true);
    } else if (!slotSerialCaptured) {
      setSlotSerialCaptured(true);
    }
  };

  const handleBrandChange = (newBrand: string) => {
    soundFX.playClick();
    setBrand(newBrand);
    const prefix = newBrand.slice(0, 3).toUpperCase();
    const modelCode = model.replace(/\s+/g, '').slice(0, 6).toUpperCase();
    setSku(`${prefix}-${modelCode}-01`);
  };

  const handleModelSuggestion = (sug: string) => {
    soundFX.playClick();
    setModel((prev) => `${prev} (${sug})`);
  };

  const applyPreset = (preset: 'iphone15' | 'iphone12_used' | 'samsung_s22' | 'xiaomi_flex' | 'blank') => {
    soundFX.playClick();
    if (preset === 'iphone15') {
      setBrand('Apple');
      setModel('iPhone 15 Pro Max');
      setPartType('Pantalla Completa OLED / LCD');
      setQuality('Original Service Pack');
      setSku('APL-IP15PM-OLED-01');
      setBarcode(`8439201${Math.floor(100000 + Math.random() * 900000)}`);
      setQuantity(5);
      setCostPrice(89.50);
      setPvpPrice(145.00);
      setCondition('nuevo');
      setDrawer(drawers[0]?.code ?? 'Gaveta A-01');
      setTechNotes('Compatible con IC serial y TrueTone.');
    } else if (preset === 'iphone12_used') {
      setBrand('Apple');
      setModel('iPhone 12');
      setPartType('Batería Ion-Litio');
      setQuality('OEM / Grado A+');
      setSku('APL-IP12-BAT-USED-01');
      setBarcode(`8439202${Math.floor(100000 + Math.random() * 900000)}`);
      setQuantity(1);
      setCostPrice(14.00);
      setPvpPrice(35.00);
      setCondition('segunda_mano');
      setConditionGrade('Grado A+ (Impoluto / Como Nuevo)');
      setDonorDevice('iPhone 12 Chasis Donante (Placa rota)');
      setBatteryHealth(94);
      setBatteryCyclesCount(118);
      setTestPowerDrawPassed(true);
      setTestSensorPassed(true);
      setDrawer(drawers[1]?.code ?? 'Gaveta B-03');
      setTechNotes('Batería original recuperada de terminal donante con 94% SOH verificado.');
    } else if (preset === 'samsung_s22') {
      setBrand('Samsung');
      setModel('Galaxy S22 Ultra');
      setPartType('Pantalla Completa Dynamic AMOLED');
      setQuality('Original Service Pack');
      setSku('SAM-S22U-AMOLED-USED-01');
      setBarcode(`8439203${Math.floor(100000 + Math.random() * 900000)}`);
      setQuantity(1);
      setCostPrice(95.00);
      setPvpPrice(185.00);
      setCondition('segunda_mano');
      setConditionGrade('Grado A (Excelente / Mínimas marcas)');
      setDonorDevice('Galaxy S22 Ultra despiece taller');
      setTestTouchPassed(true);
      setTestPowerDrawPassed(true);
      setTestSensorPassed(true);
      setDrawer(drawers[0]?.code ?? 'Gaveta A-01');
      setTechNotes('Panel AMOLED original sin marcas ni quemados.');
    } else if (preset === 'xiaomi_flex') {
      setBrand('Xiaomi');
      setModel('Redmi Note 12 Pro');
      setPartType('Flex Carga USB-C & Micrófono');
      setQuality('OEM / Grado A+');
      setSku('XIA-RN12P-FLX-01');
      setBarcode(`8439204${Math.floor(100000 + Math.random() * 900000)}`);
      setQuantity(8);
      setCostPrice(6.50);
      setPvpPrice(18.00);
      setCondition('nuevo');
      setDrawer(drawers[2]?.code ?? 'Gaveta C-07');
      setTechNotes('Sub-placa de carga con soporte de carga rápida Turbo 67W.');
    } else if (preset === 'blank') {
      setBrand('Apple');
      setModel('');
      setPartType('Pantalla Completa OLED / LCD');
      setQuality('Original Service Pack');
      setSku('');
      setBarcode(`${Math.floor(1000000000000 + Math.random() * 9000000000000)}`);
      setQuantity(1);
      setCostPrice(0);
      setPvpPrice(0);
      setCondition('nuevo');
      setDonorDevice('');
      setTechNotes('');
    }
  };

  const handleSubmit = () => {
    soundFX.playSuccessChime();

    // Determine category
    let cat: PartCategory = 'pantallas';
    const lowerType = partType.toLowerCase();
    if (lowerType.includes('batería')) cat = 'baterias';
    else if (lowerType.includes('flex') || lowerType.includes('puerto')) cat = 'flex';
    else if (lowerType.includes('cámara')) cat = 'camaras';
    else if (lowerType.includes('placa')) cat = 'placas';

    const isSecondHand = condition === 'segunda_mano';
    const qualityCategory: 'Genuino' | 'Ensamblado' | 'Aftermarket' =
      quality === 'Original Service Pack' ? 'Genuino' : quality === 'OEM / Grado A+' ? 'Ensamblado' : 'Aftermarket';

    const matchedDrawer = drawers.find((d) => d.code === drawer);
    const resolvedModule = matchedDrawer ? matchedDrawer.module : (drawer.split(',')[0] || 'Estantería 2');
    const resolvedBay = matchedDrawer ? matchedDrawer.bayRack : 'BAY-04 // TIER-2';

    const testSummaryItems: string[] = [];
    if (testTouchPassed) testSummaryItems.push('Touch OK');
    if (testPowerDrawPassed) testSummaryItems.push('Consumo OK');
    if (testSensorPassed) testSummaryItems.push('Sensores OK');
    const benchSummary = testSummaryItems.length > 0 ? testSummaryItems.join(' • ') : 'Testeado Banco';

    const subtitleText = isSecondHand
      ? `Segunda Mano // ${conditionGrade.split('(')[0].trim()} • ${benchSummary}`
      : `${quality} • Verificado en Banco`;

    const thumbnailTagText = isSecondHand
      ? (lowerType.includes('batería') ? `2ªM ${batteryHealth}%` : '2ª MANO')
      : 'CALIB-OK';

    const warrantyText = isSecondHand
      ? 'Garantía 3 meses (Pieza Recuperada / 2ª Mano)'
      : (quality === 'Original Service Pack' ? 'Garantía 12 meses' : 'Garantía 6 meses');

    const supplierText = isSecondHand
      ? (donorDevice ? `Despiece: ${donorDevice}` : 'Terminal Donante Taller')
      : 'EuroParts Mobile S.L.';

    const newPart: SparePart = {
      id: sku.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: `${partType} ${model}${isSecondHand ? ' (Segunda Mano)' : ''}`,
      subtitle: subtitleText,
      brand,
      category: cat,
      sku,
      barcode,
      drawer,
      bayRack: resolvedBay,
      locationHierarchy: {
        workshop: 'Taller Central',
        module: resolvedModule,
        drawer: matchedDrawer?.name || drawer
      },
      stock: quantity,
      minStockAlert: 2,
      costPrice,
      pvpPrice,
      qualityBadge: isSecondHand ? `2ª Mano ${conditionGrade.split('(')[0].trim()}` : quality,
      qualityCategory,
      warranty: warrantyText,
      thumbnailTag: thumbnailTagText,
      condition,
      conditionGrade: isSecondHand ? conditionGrade : undefined,
      donorDevice: isSecondHand && donorDevice ? donorDevice : undefined,
      testedStatus: isSecondHand
        ? `${benchSummary} // Donante: ${donorDevice || 'Terminal Donante Interno'}`
        : 'Nuevo Precintado / Service Pack',
      healthPercentage: isSecondHand && lowerType.includes('batería') ? batteryHealth : undefined,
      batteryCycles: isSecondHand && lowerType.includes('batería') ? batteryCyclesCount : undefined,
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWCNTFesoL5kVaF2ojKh0zPxrXspiKxDa8BQQKRQyvWY3jN3zxh9TejHvnP7aaTzgTNH82ks0QqbN9rd4S_zLj2cARDnVBuNHuXYG3mFS8CRjDVrF7clL3BlWApQEb9W7XmTZBw5H2PyWP-BPCVhsLMmxxWR4DiuG6RhwT2zTBrChj9MdoSSPtl-EpdT7fXSoOT9yvjdT2EGTT0uqAAodWrh69gdWDslGyQ8sqIj_2_SmswCw79JcPgA',
          caption: isSecondHand ? 'Verificación y Calibración en Banco' : 'Inspección Micro-Componente 1mm Escala',
          icon: isSecondHand ? 'published_with_changes' : 'straighten'
        },
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrPIFBD_XYynbqv8oYesC4ZTpfAATyZ4mf2HX5qKfEKs4OS9BqTbSo-NH1CNYi_Uh-dg82WlxViDqCUu05eX235e8jSsfZMavwAsbu-Fc20dMUf8m_vokfcZR2Zad5NylyqXMqPjSL6qI17AazxdO05s_n16rA3SJyEdDfTQKuWjSEWm8xbuqtv7hJ5nhUUpMxIuMv-hrg8VTqbhQvAWNtLCUPgPVm676GWpEIg54hgzjijv0HQ8ZUdw',
          caption: 'Vista Frontal Cristales',
          icon: 'visibility'
        }
      ],
      hardwareCompatibility: ['A2849', 'A3106', 'A3105'],
      panelSpecs: isSecondHand
        ? `Pieza recuperada testeada en banco. Procedencia: ${donorDevice || 'Despiece de taller'}.`
        : 'Inspección óptica de micro-componente conforme al protocolo técnico de banco.',
      supplier: supplierText,
      lastEntryDate: new Date().toLocaleDateString('es-ES'),
      technicalNotes: isSecondHand
        ? `${techNotes} [2ª Mano // ${conditionGrade} // Donante: ${donorDevice || 'N/A'}]`
        : techNotes,
      moveHistory: [
        {
          id: `mv-${Date.now()}`,
          type: 'entrada',
          quantity,
          description: isSecondHand
            ? `Alta de pieza 2ª Mano / Despiece (+${quantity} uds)`
            : `Alta de repuesto nuevo (+${quantity} uds)`,
          orderRef: barcode,
          technician: currentUser ? `${currentUser.name} (${currentUser.code})` : 'Técnico #04',
          timestamp: 'Ahora'
        }
      ]
    };

    onSavePart(newPart);
  };


  const brands = ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Google', 'Motorola'];

  return (
    <div className="min-h-full flex flex-col justify-between antialiased selection:bg-primary-container selection:text-on-primary-container pb-36 bg-surface">
      {/* TOP APP BAR - PANTALLA DE INICIO */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur shadow-xs px-3 h-14 flex items-center justify-between border-b border-outline-variant/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold shadow-xs">
            <span className="material-symbols-outlined text-[20px]">add_box</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-headline-lg-mobile text-sm font-bold text-primary tracking-tight">
                PANTALLA DE INICIO
              </span>
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-code-sm text-[9px] font-bold rounded uppercase">
                Solo Registro
              </span>
            </div>
            <span className="font-code-sm text-[10px] text-outline block leading-none">
              Alta y Catalogación Rápida • Taller Central
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => applyPreset('blank')}
            className="flex items-center gap-1 text-on-surface-variant font-label-sm text-xs px-2 py-1.5 rounded hover:bg-surface-container active:scale-[0.98] transition-transform duration-150 border border-outline-variant/60"
            type="button"
            title="Limpiar campos para un nuevo registro en blanco"
          >
            <span className="material-symbols-outlined text-outline text-[16px]">restart_alt</span>
            <span className="hidden sm:inline">Limpiar</span>
          </button>

          <button
            onClick={handleSubmit}
            className="bg-primary text-on-primary px-3 py-1.5 rounded font-label-sm text-xs font-semibold hover:bg-primary-container active:scale-[0.98] transition-transform duration-150 flex items-center gap-1 shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>Guardar</span>
          </button>
        </div>
      </header>

      {/* MAIN CANVAS */}
      <main className="w-full max-w-lg mx-auto px-3 pt-3 space-y-3 pb-8">
        {/* TECHNICAL BENCH & TECHNICIAN STATUS BANNER */}
        <div className="bg-surface-container-low rounded-lg border border-outline-variant/40 p-2.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-base">precision_manufacturing</span>
              </span>
              <div>
                <p className="font-label-sm text-xs font-bold text-on-surface leading-tight">
                  Estación de Entrada & Codificación QR
                </p>
                <p className="font-code-sm text-[10px] text-tertiary">
                  Técnico: <strong className="text-on-surface">{currentUser ? `${currentUser.name} (${currentUser.code})` : 'Carlos M. (#04)'}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-code-sm text-[10px] px-2 py-0.5 rounded font-bold">
                EN SERVICIO
              </span>
              {onSwitchUser && (
                <button
                  type="button"
                  onClick={onSwitchUser}
                  className="text-[10px] text-primary hover:underline font-semibold"
                  title="Cambiar técnico activo"
                >
                  Cambiar
                </button>
              )}
            </div>
          </div>

          {/* PLANTILLAS RÁPIDAS DE ALTA */}
          <div className="pt-1 border-t border-outline-variant/40">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">
                Carga Rápida de Plantillas:
              </span>
              <span className="text-[10px] text-tertiary font-code-sm">
                Total en Taller: {totalPartsCount}
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              <button
                type="button"
                onClick={() => applyPreset('iphone15')}
                className="px-2 py-1 bg-surface border border-outline-variant/80 rounded font-medium text-on-surface hover:border-primary hover:text-primary shrink-0 transition-colors"
              >
                + iPhone 15 OLED
              </button>
              <button
                type="button"
                onClick={() => applyPreset('iphone12_used')}
                className="px-2 py-1 bg-amber-50 border border-amber-300 rounded font-medium text-amber-950 hover:bg-amber-100 shrink-0 transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[12px] text-amber-800">recycling</span>
                + Batería 2ª Mano (94%)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('samsung_s22')}
                className="px-2 py-1 bg-amber-50 border border-amber-300 rounded font-medium text-amber-950 hover:bg-amber-100 shrink-0 transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[12px] text-amber-800">recycling</span>
                + S22 Ultra (Despiece)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('xiaomi_flex')}
                className="px-2 py-1 bg-surface border border-outline-variant/80 rounded font-medium text-on-surface hover:border-primary hover:text-primary shrink-0 transition-colors"
              >
                + Flex USB-C Xiaomi
              </button>
              <button
                type="button"
                onClick={() => applyPreset('blank')}
                className="px-2 py-1 bg-surface border border-dashed border-outline-variant rounded font-medium text-tertiary hover:text-on-surface shrink-0 transition-colors"
              >
                + En Blanco
              </button>
            </div>
          </div>
        </div>

        {/* SECCIÓN FOTOGRÁFICA / SPECIMEN CAPTURE BENCH */}
        <section className="bg-surface-container-lowest rounded p-3 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-lg">photo_camera</span>
              <h2 className="font-headline-md text-sm font-semibold text-on-surface">Captura Fotográfica</h2>
            </div>
            <span className="font-code-sm text-xs text-primary font-bold">
              {1 + (slotFlexCaptured ? 1 : 0) + (slotSerialCaptured ? 1 : 0)} / 3 REQUERIDAS
            </span>
          </div>

          {/* Live Viewport / Active Photo Canvas */}
          <div className="relative w-full aspect-[4/3] rounded bg-surface-container-low overflow-hidden flex flex-col justify-between p-2.5 group">
            {captureFlash && (
              <div className="absolute inset-0 bg-white z-30 animate-out fade-out duration-200"></div>
            )}

            {/* Technical Measurement HUD Overlay */}
            <div className="flex items-center justify-between z-10">
              <span className="font-code-sm text-[10px] bg-inverse-surface/80 text-inverse-on-surface px-2 py-0.5 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse"></span>
                1X MACRO • 48MP
              </span>
              <span className="font-code-sm text-[10px] bg-inverse-surface/80 text-inverse-on-surface px-2 py-0.5 rounded">
                SCALE: 1.0mm/div
              </span>
            </div>

            {/* Captured Image Sample */}
            <div className="absolute inset-0 flex items-center justify-center p-3">
              <img
                className="w-full h-full object-contain filter drop-shadow-md rounded"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWCNTFesoL5kVaF2ojKh0zPxrXspiKxDa8BQQKRQyvWY3jN3zxh9TejHvnP7aaTzgTNH82ks0QqbN9rd4S_zLj2cARDnVBuNHuXYG3mFS8CRjDVrF7clL3BlWApQEb9W7XmTZBw5H2PyWP-BPCVhsLMmxxWR4DiuG6RhwT2zTBrChj9MdoSSPtl-EpdT7fXSoOT9yvjdT2EGTT0uqAAodWrh69gdWDslGyQ8sqIj_2_SmswCw79JcPgA"
                alt="Repuesto a registrar"
              />
            </div>

            {/* Optical Alignment Crosshairs */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-32 h-32 border border-dashed border-primary/40 rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
              </div>
            </div>

            {/* Controls */}
            <div className="z-10 grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleTakePhoto}
                className="flex items-center justify-center gap-1.5 bg-primary text-on-primary py-2 px-2 rounded font-title-sm text-xs font-semibold active:scale-95 transition-transform shadow"
                type="button"
              >
                <span className="material-symbols-outlined text-base">photo_camera</span>
                <span>Tomar Foto</span>
              </button>
              <button
                onClick={handleTakePhoto}
                className="flex items-center justify-center gap-1.5 bg-surface-container-lowest text-on-surface py-2 px-2 rounded font-title-sm text-xs font-semibold hover:bg-surface-container active:scale-95 transition-transform"
                type="button"
              >
                <span className="material-symbols-outlined text-outline text-base">photo_library</span>
                <span>Galería</span>
              </button>
            </div>
          </div>

          {/* Technical Inspection Tip */}
          <div className="flex items-start gap-2 bg-surface-container-low p-2 rounded text-xs">
            <span className="material-symbols-outlined text-secondary text-base mt-0.5">lightbulb</span>
            <p className="font-body-md text-on-surface-variant leading-tight">
              <strong className="font-semibold text-on-surface">Consejo de banco:</strong> Asegura buena iluminación cenital directa para verificar legibilidad del número de pines y micro-componentes del cable flex.
            </p>
          </div>

          {/* Photo Inspection Thumbnails & Slots */}
          <div className="space-y-1">
            <p className="font-label-sm text-[10px] text-outline uppercase tracking-wider font-semibold">
              Vistas de Verificación Obligatorias
            </p>
            <div className="grid grid-cols-3 gap-2">
              {/* Thumbnail 1: Vista Frontal */}
              <div className="relative bg-surface-container rounded p-1.5 flex flex-col items-center justify-between text-center">
                <div className="absolute top-1 right-1 bg-surface-container-lowest rounded-full p-0.5 shadow">
                  <span className="material-symbols-outlined text-primary text-sm font-bold">check_circle</span>
                </div>
                <div className="w-12 h-12 my-1 rounded bg-surface-container-lowest flex items-center justify-center overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrPIFBD_XYynbqv8oYesC4ZTpfAATyZ4mf2HX5qKfEKs4OS9BqTbSo-NH1CNYi_Uh-dg82WlxViDqCUu05eX235e8jSsfZMavwAsbu-Fc20dMUf8m_vokfcZR2Zad5NylyqXMqPjSL6qI17AazxdO05s_n16rA3SJyEdDfTQKuWjSEWm8xbuqtv7hJ5nhUUpMxIuMv-hrg8VTqbhQvAWNtLCUPgPVm676GWpEIg54hgzjijv0HQ8ZUdw"
                    alt="Frontal"
                  />
                </div>
                <span className="font-code-sm text-[11px] text-on-surface font-semibold truncate w-full">Vista Frontal</span>
                <span className="font-code-sm text-[9px] text-primary font-bold">CAPTURA OK</span>
              </div>

              {/* Thumbnail 2: Conector / Flex */}
              <button
                onClick={() => {
                  soundFX.playClick();
                  setSlotFlexCaptured(!slotFlexCaptured);
                }}
                className={`rounded p-1.5 flex flex-col items-center justify-between text-center active:scale-95 transition-transform ${
                  slotFlexCaptured ? 'bg-surface-container' : 'bg-surface-container-lowest border border-outline-variant/60'
                }`}
                type="button"
              >
                {slotFlexCaptured ? (
                  <>
                    <div className="w-12 h-12 my-1 rounded bg-surface-container-lowest flex items-center justify-center overflow-hidden">
                      <span className="material-symbols-outlined text-primary text-xl">verified</span>
                    </div>
                    <span className="font-code-sm text-[11px] text-on-surface font-semibold truncate w-full">Conector/Flex</span>
                    <span className="font-code-sm text-[9px] text-primary font-bold">CAPTURA OK</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 my-1 rounded bg-surface-container-high/50 flex flex-col items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-lg">add_a_photo</span>
                    </div>
                    <span className="font-code-sm text-[11px] text-on-surface font-semibold truncate w-full">Conector/Flex</span>
                    <span className="font-code-sm text-[9px] text-error font-medium">PENDIENTE</span>
                  </>
                )}
              </button>

              {/* Thumbnail 3: Etiqueta / Serial */}
              <button
                onClick={() => {
                  soundFX.playClick();
                  setSlotSerialCaptured(!slotSerialCaptured);
                }}
                className={`rounded p-1.5 flex flex-col items-center justify-between text-center active:scale-95 transition-transform ${
                  slotSerialCaptured ? 'bg-surface-container' : 'bg-surface-container-lowest border border-outline-variant/60'
                }`}
                type="button"
              >
                {slotSerialCaptured ? (
                  <>
                    <div className="w-12 h-12 my-1 rounded bg-surface-container-lowest flex items-center justify-center overflow-hidden">
                      <span className="material-symbols-outlined text-primary text-xl">qr_code</span>
                    </div>
                    <span className="font-code-sm text-[11px] text-on-surface font-semibold truncate w-full">Etiqueta/Serial</span>
                    <span className="font-code-sm text-[9px] text-primary font-bold">CAPTURA OK</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 my-1 rounded bg-surface-container flex flex-col items-center justify-center text-outline">
                      <span className="material-symbols-outlined text-lg">qr_code_2</span>
                    </div>
                    <span className="font-code-sm text-[11px] text-on-surface-variant font-semibold truncate w-full">Etiqueta/Serial</span>
                    <span className="font-code-sm text-[9px] text-outline font-semibold">AÑADIR</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* FORMULARIO DE ESPECIFICACIONES */}
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          {/* SELECTOR DE MARCA */}
          <div className="bg-surface-container-lowest rounded p-3 space-y-1.5 shadow-xs">
            <label className="block font-label-sm text-[10px] text-on-surface tracking-wider uppercase font-semibold">
              Marca del Dispositivo
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => handleBrandChange(b)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded font-title-sm text-xs font-semibold shrink-0 transition-all ${
                    brand === b
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                  type="button"
                >
                  {b === 'Apple' && <span className="material-symbols-outlined text-sm">phone_iphone</span>}
                  <span>{b}</span>
                </button>
              ))}
            </div>
          </div>

          {/* MODELO Y TIPO DE PIEZA */}
          <div className="bg-surface-container-lowest rounded p-3 space-y-3 shadow-xs">
            {/* Modelo Compatible */}
            <div>
              <label className="block font-label-sm text-[10px] text-on-surface tracking-wider uppercase mb-1 font-semibold">
                Modelo Compatible
              </label>
              <div className="relative">
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded font-body-lg text-xs sm:text-sm text-on-surface px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-primary"
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="ej. iPhone 15 Pro Max"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary material-symbols-outlined text-base">
                  verified
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                <span className="font-code-sm text-[10px] text-outline">Sugerencias:</span>
                {['A2849', 'A3106', 'IP15-PM'].map((sug) => (
                  <button
                    key={sug}
                    onClick={() => handleModelSuggestion(sug)}
                    className="font-code-sm text-[10px] bg-surface-container text-on-surface px-1.5 py-0.5 rounded hover:bg-primary-fixed"
                    type="button"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo de Repuesto */}
            <div>
              <label className="block font-label-sm text-[10px] text-on-surface tracking-wider uppercase mb-1 font-semibold">
                Tipo de Repuesto
              </label>
              <div className="relative">
                <select
                  value={partType}
                  onChange={(e) => setPartType(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded font-body-lg text-xs sm:text-sm text-on-surface px-3 py-2 pr-10 appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Pantalla Completa OLED / LCD">Pantalla Completa OLED / LCD</option>
                  <option value="Batería de Alta Densidad">Batería de Alta Densidad</option>
                  <option value="Módulo Puerto de Carga USB-C">Módulo Puerto de Carga USB-C</option>
                  <option value="Cámara Principal Teleobjetivo">Cámara Principal Teleobjetivo</option>
                  <option value="Altavoz Auricular + Sensor Proximidad">Altavoz Auricular + Sensor Proximidad</option>
                  <option value="Flex Antena 5G / Wi-Fi">Flex Antena 5G / Wi-Fi</option>
                  <option value="Chasis / Cristal Trasero">Chasis / Cristal Trasero</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-base">
                  expand_more
                </span>
              </div>
            </div>

            {/* Calidad de la Pieza */}
            <div>
              <label className="block font-label-sm text-[10px] text-on-surface tracking-wider uppercase mb-1.5 font-semibold">
                Calidad de la Pieza
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setQuality('Original Service Pack');
                  }}
                  className={`p-2 rounded text-center transition-all ${
                    quality === 'Original Service Pack'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="block text-[9px] opacity-80 uppercase tracking-widest font-code-sm">Genuino</span>
                  <span className="font-title-sm text-xs font-semibold block leading-tight">Original Service Pack</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setQuality('OEM / Grado A+');
                  }}
                  className={`p-2 rounded text-center transition-all ${
                    quality === 'OEM / Grado A+'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="block text-[9px] text-outline uppercase tracking-widest font-code-sm">Ensamblado</span>
                  <span className="font-title-sm text-xs font-semibold block leading-tight">OEM / Grado A+</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setQuality('Compatible');
                  }}
                  className={`p-2 rounded text-center transition-all ${
                    quality === 'Compatible'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="block text-[9px] text-outline uppercase tracking-widest font-code-sm">Aftermarket</span>
                  <span className="font-title-sm text-xs font-semibold block leading-tight">Compatible</span>
                </button>
              </div>
            </div>

            {/* CONDICIÓN DE LA PIEZA: NUEVO VS SEGUNDA MANO */}
            <div className="pt-2 border-t border-outline-variant/60 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-label-sm text-[10px] text-on-surface tracking-wider uppercase font-semibold">
                  Condición del Repuesto
                </label>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    condition === 'segunda_mano'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-green-100 text-green-900 border-green-300'
                  }`}
                >
                  {condition === 'segunda_mano' ? '2ª MANO / DESPIECE' : 'NUEVO A ESTRENAR'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setCondition('nuevo');
                    const prefix = brand.slice(0, 3).toUpperCase();
                    const modelCode = model.replace(/\s+/g, '').slice(0, 6).toUpperCase();
                    setSku(`${prefix}-${modelCode}-01`);
                  }}
                  className={`p-2.5 rounded text-left border transition-all flex items-start gap-2 ${
                    condition === 'nuevo'
                      ? 'bg-primary/10 border-primary text-primary shadow-xs ring-1 ring-primary/40'
                      : 'bg-surface-container border-outline-variant/60 text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-xl mt-0.5 ${
                      condition === 'nuevo' ? 'text-primary' : 'text-tertiary'
                    }`}
                  >
                    new_releases
                  </span>
                  <div>
                    <div className="font-title-sm text-xs font-bold text-on-surface">Pieza Nueva</div>
                    <p className="text-[10px] text-tertiary leading-tight mt-0.5">
                      Precintada o directa de distribuidor oficial.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setCondition('segunda_mano');
                    const prefix = brand.slice(0, 3).toUpperCase();
                    const modelCode = model.replace(/\s+/g, '').slice(0, 6).toUpperCase();
                    setSku(`${prefix}-${modelCode}-USED-01`);
                    if (costPrice > 40) {
                      setCostPrice(Math.round(costPrice * 0.55 * 100) / 100);
                      setPvpPrice(Math.round(pvpPrice * 0.65 * 100) / 100);
                    }
                  }}
                  className={`p-2.5 rounded text-left border transition-all flex items-start gap-2 ${
                    condition === 'segunda_mano'
                      ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs ring-1 ring-amber-500/40'
                      : 'bg-surface-container border-outline-variant/60 text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-xl mt-0.5 ${
                      condition === 'segunda_mano' ? 'text-amber-700' : 'text-tertiary'
                    }`}
                  >
                    recycling
                  </span>
                  <div>
                    <div className="font-title-sm text-xs font-bold text-on-surface flex items-center gap-1">
                      <span>Segunda Mano</span>
                      <span className="text-[9px] bg-amber-200 text-amber-900 px-1 rounded font-bold">Despiece</span>
                    </div>
                    <p className="text-[10px] text-tertiary leading-tight mt-0.5">
                      Recuperada de terminal donante, testeada en banco.
                    </p>
                  </div>
                </button>
              </div>

              {/* PANEL ESPECÍFICO DE SEGUNDA MANO */}
              {condition === 'segunda_mano' && (
                <div className="mt-2 p-3 bg-amber-50/80 border border-amber-300 rounded space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                    <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-amber-800">verified</span>
                      Detalles de Recuperación & Banco
                    </span>
                    <span className="text-[9px] font-code-sm text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded font-bold">
                      Control Taller
                    </span>
                  </div>

                  {/* Grado cosmético y técnico */}
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-amber-950 mb-1">
                      Grado de Condición
                    </label>
                    <div className="relative">
                      <select
                        value={conditionGrade}
                        onChange={(e) => setConditionGrade(e.target.value as ConditionGrade)}
                        className="w-full bg-white border border-amber-300 rounded text-xs text-amber-950 px-2.5 py-1.5 pr-8 font-medium appearance-none focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="Grado A+ (Impoluto / Como Nuevo)">Grado A+ (Impoluto / Como Nuevo)</option>
                        <option value="Grado A (Excelente / Mínimas marcas)">Grado A (Excelente / Mínimas micro-marcas)</option>
                        <option value="Grado B (Buen estado / Uso visible)">Grado B (Buen estado funcional / Marcas de uso)</option>
                        <option value="Despiece Original Testeado 100%">Despiece Original Testeado 100% (Salvage)</option>
                        <option value="Reacondicionado (Lente/Cristal Renovado)">Reacondicionado (Cristal exterior sustituido)</option>
                        <option value="Para Reparar / Donante de ICs">Para Reparar / Donante de Componentes</option>
                      </select>
                      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-700 material-symbols-outlined text-sm">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Dispositivo donante / Procedencia */}
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-amber-950 mb-1">
                      Terminal Donante / Procedencia
                    </label>
                    <input
                      type="text"
                      value={donorDevice}
                      onChange={(e) => setDonorDevice(e.target.value)}
                      placeholder="Ej: iPhone 14 Pro Max Oro donante (Placa rota, pantalla intacta)"
                      className="w-full bg-white border border-amber-300 rounded text-xs text-amber-950 px-2.5 py-1.5 placeholder-amber-700/50 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Si es batería: salud y ciclos */}
                  {partType.toLowerCase().includes('batería') && (
                    <div className="grid grid-cols-2 gap-2 bg-amber-100/70 p-2 rounded border border-amber-200">
                      <div>
                        <label className="block text-[10px] font-bold text-amber-950 mb-0.5">
                          Salud Batería (% SOH)
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="60"
                            max="100"
                            value={batteryHealth}
                            onChange={(e) => setBatteryHealth(Number(e.target.value))}
                            className="w-full bg-white border border-amber-300 rounded px-2 py-1 text-xs font-bold text-amber-950 text-right focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                          <span className="text-xs font-bold text-amber-950">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-amber-950 mb-0.5">
                          Ciclos de Carga
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="1"
                            max="2000"
                            value={batteryCyclesCount}
                            onChange={(e) => setBatteryCyclesCount(Number(e.target.value))}
                            className="w-full bg-white border border-amber-300 rounded px-2 py-1 text-xs font-bold text-amber-950 text-right focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                          <span className="text-[10px] text-amber-900 font-semibold">ciclos</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Checklist técnico verificado en banco */}
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-amber-950 mb-1">
                      Checklist de Pruebas en Banco
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setTestTouchPassed(!testTouchPassed)}
                        className={`px-2 py-1 rounded text-[10px] font-semibold border flex items-center justify-center gap-1 transition-all ${
                          testTouchPassed
                            ? 'bg-green-100 text-green-900 border-green-400 font-bold'
                            : 'bg-white text-gray-500 border-gray-300'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[12px]">
                          {testTouchPassed ? 'check_circle' : 'cancel'}
                        </span>
                        <span>Touch / Digitalizador</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTestPowerDrawPassed(!testPowerDrawPassed)}
                        className={`px-2 py-1 rounded text-[10px] font-semibold border flex items-center justify-center gap-1 transition-all ${
                          testPowerDrawPassed
                            ? 'bg-green-100 text-green-900 border-green-400 font-bold'
                            : 'bg-white text-gray-500 border-gray-300'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[12px]">
                          {testPowerDrawPassed ? 'check_circle' : 'cancel'}
                        </span>
                        <span>Consumo Fuente</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTestSensorPassed(!testSensorPassed)}
                        className={`px-2 py-1 rounded text-[10px] font-semibold border flex items-center justify-center gap-1 transition-all ${
                          testSensorPassed
                            ? 'bg-green-100 text-green-900 border-green-400 font-bold'
                            : 'bg-white text-gray-500 border-gray-300'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[12px]">
                          {testSensorPassed ? 'check_circle' : 'cancel'}
                        </span>
                        <span>Sensores / IC</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* IDENTIFICACIÓN: SKU Y BARCODE */}
          <div className="bg-surface-container-lowest rounded p-3 space-y-2 shadow-xs">
            <label className="block font-label-sm text-[10px] text-on-surface tracking-wider uppercase font-semibold">
              Identificación y Código SKU
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded font-code-sm text-xs font-bold text-primary px-3 py-2 tracking-wider focus:outline-none"
                  readOnly
                  type="text"
                  value={sku}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary font-code-sm text-[9px] bg-surface-container px-1 py-0.5 rounded font-bold">
                  AUTO
                </span>
              </div>
              <button
                onClick={() => {
                  soundFX.playScanBeep();
                  setBarcode(`843920${Math.floor(1000000 + Math.random() * 9000000)}`);
                }}
                className="flex items-center gap-1 bg-surface-container px-3 py-2 rounded text-on-surface font-label-sm text-xs font-semibold hover:bg-surface-container-high active:scale-95 transition-transform shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined text-primary text-base">barcode_scanner</span>
                <span>Escanear Caja</span>
              </button>
            </div>
            <p className="font-code-sm text-[11px] text-outline">
              Código de barras caja: <span className="text-on-surface font-semibold">{barcode}</span>
            </p>
          </div>

          {/* INVENTARIO, UBICACIÓN Y COSTES */}
          <div className="bg-surface-container-lowest rounded p-3 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="font-label-sm text-[10px] text-on-surface tracking-wider uppercase font-semibold">
                Stock &amp; Ubicación en Almacén
              </label>
              <span className="font-code-sm text-xs text-primary font-bold">BAY-04 // TIER-2</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cantidad Recibida */}
              <div>
                <span className="block font-body-md text-xs text-on-surface-variant mb-1">Cantidad recibida</span>
                <div className="flex items-center border border-outline-variant rounded">
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setQuantity((q) => Math.max(1, q - 1));
                    }}
                    className="w-9 h-9 bg-surface-container text-on-surface flex items-center justify-center hover:bg-surface-container-high active:scale-95"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">remove</span>
                  </button>
                  <div className="flex-1 text-center font-headline-md text-sm font-code-sm font-bold text-primary">
                    {quantity}
                  </div>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setQuantity((q) => q + 1);
                    }}
                    className="w-9 h-9 bg-surface-container text-on-surface flex items-center justify-center hover:bg-surface-container-high active:scale-95"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                  </button>
                </div>
              </div>

              {/* Ubicación en Almacén */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-body-md text-xs text-on-surface-variant font-semibold">
                    Gaveta / Bin
                  </label>
                  {onAddNewDrawer && (
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playClick();
                        setNewDrawerCode(`Gaveta ${String.fromCharCode(65 + Math.floor(Math.random() * 4))}-${Math.floor(10 + Math.random() * 20)}`);
                        setNewDrawerName(`${partType.split(' ')[0]} ${brand}`);
                        setShowAddDrawerModal(true);
                      }}
                      className="text-[11px] font-headline-md text-primary font-bold hover:underline flex items-center gap-0.5"
                    >
                      <span className="material-symbols-outlined text-[13px]">add_circle</span>
                      <span>+ Nueva Gaveta</span>
                    </button>
                  )}
                </div>
                <div className="relative">
                  <select
                    value={drawer}
                    onChange={(e) => setDrawer(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded font-code-sm text-xs text-on-surface px-2.5 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                  >
                    {drawers && drawers.length > 0 ? (
                      Array.from(new Set(drawers.map((d) => d.module))).map((mod) => (
                        <optgroup key={mod} label={mod}>
                          {drawers
                            .filter((d) => d.module === mod)
                            .map((d) => (
                              <option key={d.id} value={d.code}>
                                {d.code} — {d.name}
                              </option>
                            ))}
                        </optgroup>
                      ))
                    ) : (
                      <>
                        <option value="Gaveta A-01">Gaveta A-01</option>
                        <option value="Gaveta B-04">Gaveta B-04</option>
                      </>
                    )}
                  </select>
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-base">
                    inventory
                  </span>
                </div>
              </div>
            </div>

            {/* Costes y PVP */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-body-md text-xs text-on-surface-variant mb-1">Coste unitario (€)</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded font-code-sm text-xs text-on-surface px-3 py-2 pl-7 focus:outline-none focus:ring-1 focus:ring-primary"
                    type="number"
                    step="0.5"
                    value={costPrice}
                    onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-code-sm text-xs text-outline">€</span>
                </div>
              </div>

              <div>
                <label className="block font-body-md text-xs text-on-surface-variant mb-1">PVP Taller (€)</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded font-code-sm text-xs font-bold text-primary px-3 py-2 pl-7 focus:outline-none focus:ring-1 focus:ring-primary"
                    type="number"
                    step="0.5"
                    value={pvpPrice}
                    onChange={(e) => setPvpPrice(parseFloat(e.target.value) || 0)}
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-code-sm text-xs text-outline">€</span>
                </div>
              </div>
            </div>

            {/* Margen calculado */}
            <div className="bg-surface-container-low rounded p-2 flex items-center justify-between">
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">
                Margen Bruto Calculado:
              </span>
              <span className="font-code-sm text-xs font-bold text-primary">
                +{grossMargin.toFixed(2)} € ({roiPercentage}% ROI)
              </span>
            </div>
          </div>

          {/* NOTAS TÉCNICAS */}
          <div className="bg-surface-container-lowest rounded p-3 space-y-1 shadow-xs">
            <label className="block font-label-sm text-[10px] text-on-surface tracking-wider uppercase font-semibold">
              Notas Técnicas de Banco
            </label>
            <textarea
              value={techNotes}
              onChange={(e) => setTechNotes(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded font-body-md text-xs text-on-surface px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              rows={2}
            />
          </div>
        </form>
      </main>

      {/* STICKY BOTTOM: ACTION DECK + NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(11,28,48,0.08)] z-50 border-t border-outline-variant/40">
        <div className="max-w-lg mx-auto px-3 pt-2 pb-1.5 flex items-center gap-2">
          <button
            onClick={() => {
              soundFX.playClick();
              alert('Imprimiendo borrador técnico de orden de entrada...');
            }}
            className="w-10 h-10 bg-surface-container text-on-surface rounded flex items-center justify-center hover:bg-surface-container-high active:scale-95 transition-transform shrink-0"
            title="Imprimir borrador técnico"
            type="button"
          >
            <span className="material-symbols-outlined text-outline text-lg">print</span>
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-primary text-on-primary py-2.5 px-3 rounded font-headline-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow active:scale-[0.98] transition-transform hover:bg-primary-container"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">qr_code_2</span>
            <span>Registrar y Generar Etiqueta QR</span>
          </button>
        </div>

        {/* BOTTOM NAVIGATION TABS */}
        <nav className="flex justify-around items-center px-3 py-1 border-t border-outline-variant/30">
          <button
            type="button"
            className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded px-2.5 py-1 active:scale-95 transition-transform duration-100"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              add_box
            </span>
            <span className="text-[10px] font-label-sm font-bold leading-tight mt-0.5">Inicio (Registro)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              if (onNavigate) onNavigate('inventory');
              else if (onClose) onClose();
            }}
            className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface px-2 py-1 active:scale-95 transition-transform duration-100"
          >
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            <span className="text-[10px] font-label-sm leading-tight mt-0.5">Inventario</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playScanBeep();
              if (onNavigate) onNavigate('scanner');
            }}
            className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface px-2 py-1 active:scale-95 transition-transform duration-100"
          >
            <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
            <span className="text-[10px] font-label-sm leading-tight mt-0.5">Escáner</span>
          </button>

          <button
            type="button"
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
            type="button"
            onClick={() => {
              soundFX.playClick();
              if (onNavigate) onNavigate('settings');
            }}
            className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface px-2 py-1 active:scale-95 transition-transform duration-100"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            <span className="text-[10px] font-label-sm leading-tight mt-0.5">Ajustes</span>
          </button>
        </nav>
      </div>

      {/* MODAL INLINE: AGREGAR NUEVA GAVETA */}
      {showAddDrawerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-xl border border-outline-variant p-4 w-full max-w-sm shadow-2xl space-y-3 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">inventory_2</span>
                <h3 className="font-headline-md text-sm font-bold text-on-surface">Nueva Gaveta en Taller</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDrawerModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">Código de Gaveta *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Gaveta C-09"
                  value={newDrawerCode}
                  onChange={(e) => setNewDrawerCode(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded font-code-sm text-xs font-bold text-primary outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">Nombre / Contenido *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Flex Carga USB-C Xiaomi 13"
                  value={newDrawerName}
                  onChange={(e) => setNewDrawerName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">Módulo / Estantería</label>
                <select
                  value={newDrawerModule}
                  onChange={(e) => setNewDrawerModule(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs outline-none focus:border-primary"
                >
                  <option value="Módulo A (Pantallas)">Módulo A (Pantallas)</option>
                  <option value="Módulo B (Alimentación)">Módulo B (Alimentación)</option>
                  <option value="Módulo C (Conectividad)">Módulo C (Conectividad)</option>
                  <option value="Estantería 2">Estantería 2 (Chasis y Estructura)</option>
                  <option value="Módulo E (Microelectrónica)">Módulo E (Microelectrónica)</option>
                  <option value="Caja Fuerte Seguridad">Caja Fuerte Seguridad</option>
                  <option value="Banco Técnico Rápido">Banco Técnico Rápido</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">Bahía / Rack</label>
                <input
                  type="text"
                  placeholder="BAY-02 // RACK-B"
                  value={newDrawerRack}
                  onChange={(e) => setNewDrawerRack(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded font-code-sm text-xs outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant">
              <button
                type="button"
                onClick={() => setShowAddDrawerModal(false)}
                className="px-3 py-1.5 bg-surface border border-outline-variant rounded text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newDrawerCode.trim() || !newDrawerName.trim()) return;
                  soundFX.playSuccessChime();
                  const createdDrawer: DrawerLocation = {
                    id: `gw-${Date.now()}`,
                    code: newDrawerCode.trim(),
                    name: newDrawerName.trim(),
                    module: newDrawerModule,
                    bayRack: newDrawerRack.trim() || 'BAY-01 // RACK-A',
                    workshop: 'Taller Central',
                    capacity: 25,
                  };
                  if (onAddNewDrawer) {
                    onAddNewDrawer(createdDrawer);
                  }
                  setDrawer(createdDrawer.code);
                  setShowAddDrawerModal(false);
                }}
                className="px-4 py-1.5 bg-primary text-on-primary rounded text-xs font-headline-md font-bold hover:bg-primary-container shadow"
              >
                Crear y Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
