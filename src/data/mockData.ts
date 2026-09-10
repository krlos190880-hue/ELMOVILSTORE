import { SparePart, WorkOrder, RecentScan, DrawerLocation } from '../types';

export const INITIAL_DRAWERS: DrawerLocation[] = [
  // Módulo A - Pantallas & Displays
  { id: 'gw-a01', code: 'Gaveta A-01', name: 'Pantallas iPhone 11/12', module: 'Módulo A (Pantallas)', bayRack: 'BAY-01 // RACK-A', workshop: 'Taller Central', category: 'pantallas', maxCapacity: 15, description: 'Paneles LCD y OLED para iPhone 11, 12, 12 Pro' },
  { id: 'gw-a02', code: 'Gaveta A-02', name: 'Pantallas iPhone 13/14', module: 'Módulo A (Pantallas)', bayRack: 'BAY-01 // RACK-A', workshop: 'Taller Central', category: 'pantallas', maxCapacity: 15, description: 'Paneles OLED Super Retina iPhone 13 y 14' },
  { id: 'gw-a03', code: 'Gaveta A-03', name: 'Pantallas iPhone 15/16 Pro', module: 'Módulo A (Pantallas)', bayRack: 'BAY-01 // RACK-A', workshop: 'Taller Central', category: 'pantallas', maxCapacity: 12, description: 'Paneles ProMotion Dynamic Island 120Hz' },
  { id: 'gw-a04', code: 'Gaveta A-04', name: 'Pantallas Samsung S-Series', module: 'Módulo A (Pantallas)', bayRack: 'BAY-01 // RACK-B', workshop: 'Taller Central', category: 'pantallas', maxCapacity: 12, description: 'Dynamic AMOLED 2X Galaxy S22/S23/S24' },
  { id: 'gw-a05', code: 'Gaveta A-05', name: 'Pantallas Samsung Serie A/M', module: 'Módulo A (Pantallas)', bayRack: 'BAY-01 // RACK-B', workshop: 'Taller Central', category: 'pantallas', maxCapacity: 20, description: 'Displays Service Pack A53, A54, A34, A14' },
  { id: 'gw-a06', code: 'Gaveta A-06', name: 'Pantallas Xiaomi / Redmi', module: 'Módulo A (Pantallas)', bayRack: 'BAY-01 // RACK-C', workshop: 'Taller Central', category: 'pantallas', maxCapacity: 18, description: 'Paneles AMOLED Xiaomi 12, 13, Note 12/13 Pro' },
  { id: 'gw-a07', code: 'Gaveta A-07', name: 'Baterías iPhone 13/14', module: 'Módulo A (Baterías)', bayRack: 'BAY-01 // RACK-A', workshop: 'Taller Central', category: 'baterias', maxCapacity: 25, description: 'Celdas Li-Ion con conector FPC original' },
  { id: 'gw-a08', code: 'Gaveta A-08', name: 'Pantallas Google Pixel 7/8/9', module: 'Módulo A (Pantallas)', bayRack: 'BAY-01 // RACK-C', workshop: 'Taller Central', category: 'pantallas', maxCapacity: 12, description: 'Displays OLED Actua Display con lector óptico' },
  { id: 'gw-a12', code: 'Gaveta A-12', name: 'Baterías Samsung Service Pack', module: 'Módulo A (Baterías)', bayRack: 'BAY-01 // RACK-B', workshop: 'Taller Central', category: 'baterias', maxCapacity: 20, description: 'Módulos de batería con precinto oficial' },

  // Módulo B - Baterías, Óptica y Sensores
  { id: 'gw-b01', code: 'Gaveta B-01', name: 'Baterías iPhone 11/12 OEM', module: 'Módulo B (Alimentación)', bayRack: 'BAY-02 // RACK-A', workshop: 'Taller Central', category: 'baterias', maxCapacity: 30, description: 'Celdas grado A+ 0 ciclos BMS' },
  { id: 'gw-b02', code: 'Gaveta B-02', name: 'Baterías High-Capacity 0 Cycles', module: 'Módulo B (Alimentación)', bayRack: 'BAY-02 // RACK-A', workshop: 'Taller Central', category: 'baterias', maxCapacity: 25, description: 'Capacidad extendida certificada CE/RoHS' },
  { id: 'gw-b04', code: 'Gaveta B-04', name: 'Displays iPhone 14 Pro Max', module: 'Módulo B (Displays)', bayRack: 'BAY-02 // RACK-B', workshop: 'Taller Central', category: 'pantallas', maxCapacity: 10, description: 'Paneles OEM ProMotion 120Hz para reacondicionamiento' },
  { id: 'gw-b05', code: 'Gaveta B-05', name: 'Cámaras Frontales & Sensores FaceID', module: 'Módulo B (Óptica)', bayRack: 'BAY-02 // RACK-B', workshop: 'Taller Central', category: 'camaras', maxCapacity: 20, description: 'Módulos TrueDepth y cables flex con sensor flood' },
  { id: 'gw-b08', code: 'Gaveta B-08', name: 'Altavoces Auricular & Taptic', module: 'Módulo B (Audio)', bayRack: 'BAY-02 // RACK-C', workshop: 'Taller Central', category: 'flex', maxCapacity: 35, description: 'Buzzer inferior y motores de vibración háptica' },
  { id: 'gw-b09', code: 'Gaveta B-09', name: 'Cámaras Principales Dual/Triple', module: 'Módulo B (Óptica)', bayRack: 'BAY-02 // RACK-B', workshop: 'Taller Central', category: 'camaras', maxCapacity: 15, description: 'Sensores OIS y teleobjetivos originales' },
  { id: 'gw-b10', code: 'Gaveta B-10', name: 'Módulos Telefoto & Gran Angular', module: 'Módulo B (Óptica)', bayRack: 'BAY-02 // RACK-B', workshop: 'Taller Central', category: 'camaras', maxCapacity: 15, description: 'Periscopios y lentes zoom periscópico' },

  // Módulo C - Flex, Subplacas y Conectores
  { id: 'gw-c01', code: 'Caja C-01', name: 'Flex Subplaca Carga Xiaomi', module: 'Módulo C (Conectividad)', bayRack: 'BAY-03 // RACK-C', workshop: 'Taller Central', category: 'flex', maxCapacity: 40, description: 'Puertos USB-C HyperCharge y micrófonos' },
  { id: 'gw-c02', code: 'Gaveta C-02', name: 'Flex Subplaca Carga Samsung', module: 'Módulo C (Conectividad)', bayRack: 'BAY-03 // RACK-A', workshop: 'Taller Central', category: 'flex', maxCapacity: 40, description: 'Placas inferiores USB-C con soporte Super Fast' },
  { id: 'gw-c03', code: 'Gaveta C-03', name: 'Flex Puerto Lightning Apple', module: 'Módulo C (Conectividad)', bayRack: 'BAY-03 // RACK-B', workshop: 'Taller Central', category: 'flex', maxCapacity: 30, description: 'Flex con micrófonos y conector de carga' },
  { id: 'gw-c04', code: 'Gaveta C-04', name: 'Antenas 5G, Wi-Fi & NFC', module: 'Módulo C (Conectividad)', bayRack: 'BAY-03 // RACK-B', workshop: 'Taller Central', category: 'flex', maxCapacity: 50, description: 'Coaxiales de RF y bobinas de carga inductiva Qi' },
  { id: 'gw-c05', code: 'Gaveta C-05', name: 'Flex Botones Encendido/Volumen', module: 'Módulo C (Mecánica)', bayRack: 'BAY-03 // RACK-C', workshop: 'Taller Central', category: 'flex', maxCapacity: 45, description: 'Pulsadores metálicos táctiles y flex interconexión' },
  { id: 'gw-c06', code: 'Gaveta C-06', name: 'Flex Interconexión Main-Sub', module: 'Módulo C (Conectividad)', bayRack: 'BAY-03 // RACK-A', workshop: 'Taller Central', category: 'flex', maxCapacity: 40, description: 'Puentes flex de placa base a placa de carga' },

  // Estantería 2 / Módulo D - Estructura y Chasis
  { id: 'gw-d01', code: 'Estantería 2, Gaveta D-01', name: 'Chasis Centrales Titanio/Aluminio', module: 'Estantería 2', bayRack: 'BAY-04 // TIER-1', workshop: 'Taller Central', category: 'todos', maxCapacity: 8, description: 'Marcos medios con botoneras y bandejas SIM' },
  { id: 'gw-d02', code: 'Estantería 2, Gaveta D-02', name: 'Cristales Traseros Back Glass', module: 'Estantería 2', bayRack: 'BAY-04 // TIER-1', workshop: 'Taller Central', category: 'todos', maxCapacity: 25, description: 'Tapas traseras con lente y adhesivo térmico' },
  { id: 'gw-d03', code: 'Estantería 2, Gaveta D-03', name: 'Pantallas OLED iPhone 15 Pro Max', module: 'Estantería 2', bayRack: 'BAY-04 // TIER-2', workshop: 'Taller Central', category: 'pantallas', maxCapacity: 12, description: 'Original Service Pack Dynamic Island' },
  { id: 'gw-d04', code: 'Estantería 2, Gaveta D-04', name: 'Pantallas Serie iPhone 15 Estándar', module: 'Estantería 2', bayRack: 'BAY-04 // TIER-2', workshop: 'Taller Central', category: 'pantallas', maxCapacity: 15, description: 'Paneles Super Retina XDR OLED' },
  { id: 'gw-d05', code: 'Estantería 2, Gaveta D-05', name: 'Baterías iPhone 15 / 15 Plus', module: 'Estantería 2', bayRack: 'BAY-04 // TIER-2', workshop: 'Taller Central', category: 'baterias', maxCapacity: 20, description: 'Baterías 3349mAh y 4383mAh USB-C gen' },

  // Módulo E / Microelectrónica & ICs
  { id: 'gw-e01', code: 'Gaveta E-01', name: 'ICs de Gestión PMIC & Tristar', module: 'Módulo E (Microelectrónica)', bayRack: 'BAY-05 // CLEAN-ROOM', workshop: 'Taller Central', category: 'placas', maxCapacity: 100, description: 'Chips BGA en cinta termosellada antiestática' },
  { id: 'gw-e02', code: 'Gaveta E-02', name: 'Conectores FPC Soldadura SMD', module: 'Módulo E (Microelectrónica)', bayRack: 'BAY-05 // CLEAN-ROOM', workshop: 'Taller Central', category: 'placas', maxCapacity: 80, description: 'Pines de pantalla, batería y cámara para soldar' },
  { id: 'gw-e03', code: 'Gaveta E-03', name: 'Stencils Reballing & Estaño BGA', module: 'Módulo E (Microelectrónica)', bayRack: 'BAY-05 // CLEAN-ROOM', workshop: 'Taller Central', category: 'placas', maxCapacity: 50, description: 'Mallas de acero térmico japonés para microsoldadura' },

  // Caja Fuerte / Seguridad
  { id: 'gw-sec01', code: 'Caja Fuerte ICs Seguros B-01', name: 'Placas Madre Swap & Baseband', module: 'Caja Fuerte Seguridad', bayRack: 'VAULT-01', workshop: 'Taller Central', category: 'placas', maxCapacity: 10, description: 'Placas base desvinculadas para trasplante' },
  { id: 'gw-sec02', code: 'Caja Fuerte B-02', name: 'Piezas Self-Repair Program', module: 'Caja Fuerte Seguridad', bayRack: 'VAULT-01', workshop: 'Taller Central', category: 'todos', maxCapacity: 15, description: 'Kits oficiales de reparación con número de serie' },

  // Banco Rápido / Miscelánea
  { id: 'gw-r01', code: 'Gaveta R-01 (Banco Rápido)', name: 'Tornillería & Blindajes EMI', module: 'Banco Técnico Rápido', bayRack: 'WORKBENCH-01', workshop: 'Taller Central', category: 'todos', maxCapacity: 200, description: 'Tornillos pentalobe, tri-point y blindajes' },
  { id: 'gw-r02', code: 'Gaveta R-02 (Banco Rápido)', name: 'Adhesivos Estancos IP68', module: 'Banco Técnico Rápido', bayRack: 'WORKBENCH-01', workshop: 'Taller Central', category: 'todos', maxCapacity: 100, description: 'Juntas de estanqueidad perimetral pre-troqueladas' }
];

export const INITIAL_PARTS: SparePart[] = [
  {
    id: 'apl-ip14pm-scr',
    name: 'Pantalla OLED Super Retina iPhone 14 Pro Max',
    subtitle: 'Grado OEM Original • Flex ribbon intacto',
    brand: 'Apple',
    category: 'pantallas',
    sku: 'APL-IP14PM-SCR',
    barcode: '8439201948201',
    drawer: 'Gaveta B-04',
    bayRack: 'BAY-02 // RACK-B',
    locationHierarchy: {
      workshop: 'Taller Central',
      module: 'Módulo B',
      drawer: 'Gaveta 04'
    },
    stock: 8,
    minStockAlert: 3,
    costPrice: 115.00,
    pvpPrice: 185.00,
    qualityBadge: 'OEM Refurbished Grado A+',
    qualityCategory: 'Ensamblado',
    warranty: 'Garantía 6 meses',
    thumbnailTag: 'OEM SPEC',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD33gWPUD5XcR0BnXaHaVnRWGfCibjnJLdUsJPA8z9r1EmSuAdidF2fVnKbA6bq5jblhP5oQ6k2iLjpEFHlE64U9E86gUzE8NSeVD2G5pjL4eXe1jeXoNE8pyQ1xdb29FxPOgEwXHlzjVX5eSGAoFqWk3591JW6XxxYIijIecSSjPz2ONmcl1RVQ3JuTPA29ajv9rGhBRfrGqqfSez3Lriq0W9YWRhn5OaFfA8T_J660xlAUofoFtT42A',
        caption: 'Vista Frontal // Escala 1:1',
        icon: 'straighten'
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeHjnpY37oUgdfva2yz3Cr92iRmPXDif1XR7s3KKRwRvT0betmR4foibwpwLAcXjWIaIkpK3n0EvHUKMLph5aN8cBCxTDz-JYWAtcaa_GvEvvXq8O3MtogzCkLxAEUVcpUQNiJs67y1fmNXHFFCPm8t2XP5kchfl1Y-qVP4RUiDE9rJI6RRQgBUlff1HM0OXRbBVM1stDZrT6kb16dsKWWhHsH2v-DFSbLU_QqaXfVFGWBNBb9Ct4Hvw',
        caption: 'Reverso // Flex & IC Shield',
        icon: 'memory'
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0qfitLLtGuY6Zdx3A5IHy9Q4WPP9-6JLPT4izXjAuaephCQZg34WKamJCil45aqlcCNqsvW-cb59qWY38aSNEVjPBMK5hUvz_UmblYNOuIMQ3mnPGc0Dfbv_81JQ6pg6GHAkxHgOBNuaHHvB_dGbip73a3KrS5gY63pa_ikuPiT83bpoGpqaCSRvTtPBVhPhe8HkQt22NjW813hq9sfa-sSnSHxWZZEfzzf9CA1Ra7xJ5qw7w_rjYEA',
        caption: 'Micro-Pinout FPC // 40X',
        icon: 'zoom_in'
      }
    ],
    hardwareCompatibility: ['A2894 (Global)', 'A2651 (USA)', 'A2893 (Canadá)', 'A2895 (China)'],
    panelSpecs: 'OLED 120Hz ProMotion con soporte TrueTone transferible mediante reprogramador EEPROM.',
    supplier: 'EuroParts Mobile S.L.',
    lastEntryDate: '14/05/2024',
    technicalNotes: 'Probar consumo en fuente antes del cierre final. Aplicar adhesivo perimetral estanco IP68 homologado.',
    condition: 'segunda_mano',
    conditionGrade: 'Reacondicionado (Lente/Cristal Renovado)',
    donorDevice: 'Terminal Donante A2651 - Marco y OLED Original',
    testedStatus: 'OLED 120Hz ProMotion sin quemaduras, TrueTone grabado',
    moveHistory: [
      {
        id: 'mv-1',
        type: 'salida',
        quantity: 1,
        description: '-1 ud para Orden #OR-2849',
        orderRef: 'OR-2849',
        technician: 'Carlos M.',
        timestamp: 'Hace 2 horas'
      },
      {
        id: 'mv-2',
        type: 'entrada',
        quantity: 5,
        description: '+5 uds Albarán Proveedor #AL-9921',
        orderRef: 'AL-9921',
        technician: 'Recepción bancal Módulo B',
        timestamp: 'Hace 3 días'
      }
    ]
  },
  {
    id: 'apl-ip13-bat',
    name: 'Batería Li-Ion iPhone 13',
    subtitle: 'Capacidad nominal 3227mAh // Conector FPC Original',
    brand: 'Apple',
    category: 'baterias',
    sku: 'APL-IP13-BAT-901',
    barcode: '8439201948305',
    drawer: 'Gaveta A-07',
    bayRack: 'BAY-01 // RACK-A',
    locationHierarchy: {
      workshop: 'Taller Central',
      module: 'Módulo A',
      drawer: 'Gaveta 07'
    },
    stock: 6,
    minStockAlert: 2,
    costPrice: 22.50,
    pvpPrice: 55.00,
    qualityBadge: 'OEM Original New 0 Cycles',
    qualityCategory: 'Genuino',
    warranty: 'Garantía 12 meses',
    thumbnailTag: 'OEM',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5Nd839m58Z4dAmhPdXjzBCRocpJuHYBRbKLE-fzvFx_LusPMMd8SoHTIxZwM_SEftmuSSaORYfNTOmhYb_9mByIqcfRsTZCHRJDRpn0tw06eiYUkv3M4J9dMoUy6w-bCjTI87YNwYf2lKAWzuy8QJSGiZQ7IdfZi5EWPDPSCH_9sxBX1IoJqJDnuy1B6-mWl1VP_k37wemu8a2WBFRjxj-cfiMO9atADoqZ3lEW5t4_pf7JCBwtLh9Q',
        caption: 'Batería OEM Vista Cenital',
        icon: 'straighten'
      }
    ],
    hardwareCompatibility: ['A2633 (Global)', 'A2482 (USA)', 'A2631 (Canadá)', 'A2634 (China)'],
    panelSpecs: '3227 mAh // 12.41 Wh // Tensión nominal 3.84V // BMS reprogramable con iCopy Plus.',
    supplier: 'EuroParts Mobile S.L.',
    lastEntryDate: '02/06/2024',
    technicalNotes: 'Requiere trasplante de BMS para evitar mensaje de pieza desconocida en iOS 15 o superior.',
    moveHistory: [
      {
        id: 'mv-bat-1',
        type: 'salida',
        quantity: 1,
        description: '-1 ud para Orden #OT-1042',
        orderRef: 'OT-1042',
        technician: 'Carlos M.',
        timestamp: 'Hoy 11:30'
      },
      {
        id: 'mv-bat-2',
        type: 'entrada',
        quantity: 10,
        description: '+10 uds Albarán #REC-8842',
        orderRef: 'REC-8842',
        technician: 'Recepción Central',
        timestamp: 'Ayer'
      }
    ]
  },
  {
    id: 'sam-s23u-bat',
    name: 'Módulo Batería Samsung Galaxy S23 Ultra',
    subtitle: 'Calidad Original Service Pack • Precintado',
    brand: 'Samsung',
    category: 'baterias',
    sku: 'SAM-S23U-BAT',
    barcode: '8806094726190',
    drawer: 'Gaveta A-12',
    bayRack: 'BAY-01 // RACK-B',
    locationHierarchy: {
      workshop: 'Taller Central',
      module: 'Módulo A',
      drawer: 'Gaveta 12'
    },
    stock: 2,
    minStockAlert: 3,
    costPrice: 19.80,
    pvpPrice: 34.50,
    qualityBadge: 'Original Service Pack',
    qualityCategory: 'Genuino',
    warranty: 'Garantía 12 meses',
    thumbnailTag: '5000 mAh',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsfpBPFGsuleZEykf36Noy2VIjtc_UXWA6NNw2gQam_CJ2a1coaKkhibvBZeSDEhnzAeSx5x3gQ9MlT2wfhCUouklrlOhdQKADrs_CyzJxwYpOUbp0nqM_YB8y1-t2naNwpaH5DD37fz1xs82BjDNgTlad-8zcawNpf-SisSDkk6cnrUkqwRDNj8WXtwpYX-LKe6FBEy6G4H-3Iq6k2VXVGA07CmSUaNuY5gcQXlesgxf7EdM1uujwfg',
        caption: 'Módulo Service Pack Original con Precinto',
        icon: 'verified'
      }
    ],
    hardwareCompatibility: ['SM-S918B/DS (Global)', 'SM-S918U (USA)', 'SM-S918W (Canadá)'],
    panelSpecs: 'Capacidad 5000 mAh (19.4 Wh), Carga rápida 45W compatible Power Delivery 3.0.',
    supplier: 'Samsung Parts Distributor Europa',
    lastEntryDate: '28/05/2024',
    technicalNotes: 'Retirar con alcohol isopropílico al 99% sin perforar el encapsulado.',
    moveHistory: [
      {
        id: 'mv-s23-1',
        type: 'salida',
        quantity: 1,
        description: '-1 ud para Orden #OT-1038',
        orderRef: 'OT-1038',
        technician: 'Laura S.',
        timestamp: 'Ayer 17:15'
      }
    ]
  },
  {
    id: 'xmi-13p-flx',
    name: 'Puerto Flex Carga c/ Micrófono Xiaomi 13 Pro',
    subtitle: 'Conector USB-C + IC Carga Rápida',
    brand: 'Xiaomi',
    category: 'flex',
    sku: 'XMI-13P-FLX',
    barcode: '6941812704812',
    drawer: 'Caja C-01',
    bayRack: 'BAY-03 // RACK-C',
    locationHierarchy: {
      workshop: 'Taller Central',
      module: 'Módulo C',
      drawer: 'Caja 01'
    },
    stock: 0,
    minStockAlert: 2,
    costPrice: 5.20,
    pvpPrice: 12.90,
    qualityBadge: 'Componente OEM con IC',
    qualityCategory: 'Ensamblado',
    warranty: 'Garantía 3 meses',
    thumbnailTag: 'USB-C IC',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcCiJtged0IdHOF2aUEd3_JbVVZdcQrh0eOj5ZVoAeuFQG8KIj46gyP0inskJItorJ4F62kkgA_7Ilyt6t_yHxIKfvPDISnEXD7BuKzfOWIWMJURTTH51N-QNU0xVk2iD4gnCAC5-FffqCiTEWOo4hcfuMWg2VIVOnJoh8CEZwprHkWWNU439vis_GzEZwbtsUbisp12eaSgthUY8Rv24VIAcGKVnCVPjc2yP6ogUMtHuLYKLpfA8O9Q',
        caption: 'Sub-placa y conector USB-C',
        icon: 'memory'
      }
    ],
    hardwareCompatibility: ['2210132G (Global)', '2210132C (China)'],
    panelSpecs: 'Soporte HyperCharge 120W, conector FPC 30 pines bañado en oro, micrófono MEMS integrado.',
    supplier: 'EuroParts Mobile S.L.',
    lastEntryDate: '10/05/2024',
    technicalNotes: 'Comprobar microfono secundario con grabadora antes de cerrar el chasis.',
    moveHistory: [
      {
        id: 'mv-xmi-1',
        type: 'salida',
        quantity: 1,
        description: '-1 ud para Orden #OT-1031 (Agotado stock)',
        orderRef: 'OT-1031',
        technician: 'Marcos T.',
        timestamp: 'Hace 4 días'
      }
    ]
  },
  {
    id: 'apl-ip13-cam',
    name: 'Módulo Cámara Principal iPhone 13',
    subtitle: 'Sensores Gran Angular & Ultra Angular',
    brand: 'Apple',
    category: 'camaras',
    sku: 'APL-IP13-CAM',
    barcode: '8439201948893',
    drawer: 'Gaveta B-09',
    bayRack: 'BAY-02 // RACK-B',
    locationHierarchy: {
      workshop: 'Taller Central',
      module: 'Módulo B',
      drawer: 'Gaveta 09'
    },
    stock: 5,
    minStockAlert: 2,
    costPrice: 42.00,
    pvpPrice: 68.00,
    qualityBadge: 'Genuino Original Despiece A+',
    qualityCategory: 'Genuino',
    warranty: 'Garantía 6 meses',
    thumbnailTag: '4K 60FPS',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAP923XEEbq-_LMKoMKBBWXz2SgxVgEkXboXnT7u2dhQTwbrm1tYZvhMOeEjFJiOp8ISogOArXrlGPtDSP1BKPMSeR-6nHivAVMvRekEtBLm_uG3TEEFyqFUWxErSidflykWGCiQt-xjYbSdG9chLQh5p3roSUrTBCbqGR7qzuGBFdVH39H4ZsGRKkmnKwX-dGZ3uE8kbftp3XXsQylBdaMJKJ6BdWIxBGjjLbVt4JgdQaBOjYVmi_fvQ',
        caption: 'Módulo Dual Sensor con estabilización óptica sensor-shift',
        icon: 'camera'
      }
    ],
    hardwareCompatibility: ['A2633', 'A2482', 'A2631', 'A2634'],
    panelSpecs: 'Sensor principal 12MP f/1.6 con Sensor-Shift OIS + Ultra gran angular 12MP 120° f/2.4.',
    supplier: 'EuroParts Mobile S.L.',
    lastEntryDate: '01/06/2024',
    technicalNotes: 'Lente de zafiro calibrada. Desconectar batería antes de manipular conector FPC.',
    condition: 'segunda_mano',
    conditionGrade: 'Despiece Original Testeado 100%',
    donorDevice: 'iPhone 13 128GB Azul (Placa base averiada, módulo óptico impoluto)',
    testedStatus: 'Enfoque OIS y Ultra Gran Angular 100% calibrados en banco',
    moveHistory: [
      {
        id: 'mv-cam-1',
        type: 'entrada',
        quantity: 5,
        description: 'Stock Rec (+5) Albarán #REC-8840',
        orderRef: 'REC-8840',
        technician: 'Recepción Central',
        timestamp: 'Hoy 09:15'
      }
    ]
  },
  {
    id: 'apl-ip15pm-oled-01',
    name: 'Pantalla Completa OLED iPhone 15 Pro Max',
    subtitle: 'Original Service Pack • Dynamic Island ProMotion',
    brand: 'Apple',
    category: 'pantallas',
    sku: 'APL-IP15PM-OLED-01',
    barcode: '8439201948201',
    drawer: 'Estantería 2, Gaveta D-03',
    bayRack: 'BAY-04 // TIER-2',
    locationHierarchy: {
      workshop: 'Taller Central',
      module: 'Estantería 2',
      drawer: 'Gaveta D-03'
    },
    stock: 10,
    minStockAlert: 2,
    costPrice: 89.50,
    pvpPrice: 145.00,
    qualityBadge: 'Original Service Pack',
    qualityCategory: 'Genuino',
    warranty: 'Garantía 12 meses',
    thumbnailTag: 'OLED 120Hz',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWCNTFesoL5kVaF2ojKh0zPxrXspiKxDa8BQQKRQyvWY3jN3zxh9TejHvnP7aaTzgTNH82ks0QqbN9rd4S_zLj2cARDnVBuNHuXYG3mFS8CRjDVrF7clL3BlWApQEb9W7XmTZBw5H2PyWP-BPCVhsLMmxxWR4DiuG6RhwT2zTBrChj9MdoSSPtl-EpdT7fXSoOT9yvjdT2EGTT0uqAAodWrh69gdWDslGyQ8sqIj_2_SmswCw79JcPgA',
        caption: 'Panel OLED con cable flex 1mm escala',
        icon: 'straighten'
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrPIFBD_XYynbqv8oYesC4ZTpfAATyZ4mf2HX5qKfEKs4OS9BqTbSo-NH1CNYi_Uh-dg82WlxViDqCUu05eX235e8jSsfZMavwAsbu-Fc20dMUf8m_vokfcZR2Zad5NylyqXMqPjSL6qI17AazxdO05s_n16rA3SJyEdDfTQKuWjSEWm8xbuqtv7hJ5nhUUpMxIuMv-hrg8VTqbhQvAWNtLCUPgPVm676GWpEIg54hgzjijv0HQ8ZUdw',
        caption: 'Vista Frontal Cristales y Dynamic Island',
        icon: 'visibility'
      }
    ],
    hardwareCompatibility: ['A2849 (USA)', 'A3106 (Global)', 'A3105 (Japón)', 'A3108 (China)'],
    panelSpecs: 'Super Retina XDR OLED 6.7", 2796 x 1290 px, 460 ppi, 120Hz ProMotion, 2000 nits brillo pico.',
    supplier: 'EuroParts Mobile S.L.',
    lastEntryDate: '08/06/2024',
    technicalNotes: 'Compatible con transferencia de serial IC y programador JCID V1SE. Conserva función TrueTone.',
    moveHistory: [
      {
        id: 'mv-ip15-1',
        type: 'entrada',
        quantity: 10,
        description: 'Recepción inicial Lote #LOT-4412',
        orderRef: 'LOT-4412',
        technician: 'Carlos M.',
        timestamp: 'Hoy 08:30'
      }
    ]
  },
  {
    id: 'sam-s24u-scr',
    name: 'Pantalla Dynamic AMOLED 2X Galaxy S24 Ultra',
    subtitle: 'Marco Titanio Integrado • 2600 nits Corning Armor',
    brand: 'Samsung',
    category: 'pantallas',
    sku: 'SAM-S24U-SCR-SP',
    barcode: '8806095321045',
    drawer: 'Gaveta A-04',
    bayRack: 'BAY-01 // RACK-B',
    locationHierarchy: {
      workshop: 'Taller Central',
      module: 'Módulo A (Pantallas)',
      drawer: 'Gaveta A-04'
    },
    stock: 4,
    minStockAlert: 2,
    costPrice: 195.00,
    pvpPrice: 289.00,
    qualityBadge: 'Original Service Pack GH82',
    qualityCategory: 'Genuino',
    warranty: 'Garantía 12 meses',
    thumbnailTag: 'AMOLED 2X',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD33gWPUD5XcR0BnXaHaVnRWGfCibjnJLdUsJPA8z9r1EmSuAdidF2fVnKbA6bq5jblhP5oQ6k2iLjpEFHlE64U9E86gUzE8NSeVD2G5pjL4eXe1jeXoNE8pyQ1xdb29FxPOgEwXHlzjVX5eSGAoFqWk3591JW6XxxYIijIecSSjPz2ONmcl1RVQ3JuTPA29ajv9rGhBRfrGqqfSez3Lriq0W9YWRhn5OaFfA8T_J660xlAUofoFtT42A',
        caption: 'Módulo Service Pack Ensamblado',
        icon: 'verified'
      }
    ],
    hardwareCompatibility: ['SM-S928B/DS', 'SM-S928U', 'SM-S9280'],
    panelSpecs: 'Pantalla plana 6.8", QHD+ 3120x1440, soporte S-Pen y sensor ultrasónico calibrado.',
    supplier: 'Samsung Parts Distributor Europa',
    lastEntryDate: '05/06/2024',
    technicalNotes: 'Requiere calibración biométrica con software oficial Samsung tras el montaje.',
    moveHistory: [
      {
        id: 'mv-s24-1',
        type: 'entrada',
        quantity: 4,
        description: 'Albarán Proveedor #AL-9980',
        orderRef: 'AL-9980',
        technician: 'Carlos M.',
        timestamp: 'Hace 2 días'
      }
    ]
  },
  {
    id: 'ic-hydra-ip13',
    name: 'Circuito Integrado IC Hydra USB / Tristar U2',
    subtitle: 'Gestor de Carga BGA 1610A3 para iPhone Series',
    brand: 'Apple',
    category: 'placas',
    sku: 'IC-HYDRA-1610A3',
    barcode: '8439201988112',
    drawer: 'Gaveta E-01',
    bayRack: 'BAY-05 // CLEAN-ROOM',
    locationHierarchy: {
      workshop: 'Taller Central',
      module: 'Módulo E (Microelectrónica)',
      drawer: 'Gaveta E-01'
    },
    stock: 24,
    minStockAlert: 10,
    costPrice: 4.80,
    pvpPrice: 22.00,
    qualityBadge: 'Nuevo Sellado BGA con Bolas',
    qualityCategory: 'Genuino',
    warranty: 'Garantía Funcional',
    thumbnailTag: 'BGA IC',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0qfitLLtGuY6Zdx3A5IHy9Q4WPP9-6JLPT4izXjAuaephCQZg34WKamJCil45aqlcCNqsvW-cb59qWY38aSNEVjPBMK5hUvz_UmblYNOuIMQ3mnPGc0Dfbv_81JQ6pg6GHAkxHgOBNuaHHvB_dGbip73a3KrS5gY63pa_ikuPiT83bpoGpqaCSRvTtPBVhPhe8HkQt22NjW813hq9sfa-sSnSHxWZZEfzzf9CA1Ra7xJ5qw7w_rjYEA',
        caption: 'Microscopio IC BGA con bolas de estaño',
        icon: 'memory'
      }
    ],
    hardwareCompatibility: ['iPhone 12/13/14 Series', 'iPad Pro 11'],
    panelSpecs: 'Controlador de protocolo USB Lightning/USB-C y detección de accesorios 36-ball BGA.',
    supplier: 'Shenzhen MicroChip Pro',
    lastEntryDate: '01/06/2024',
    technicalNotes: 'Soldadura a 230°C con flux no-clean de bajo residuo. No recalentar el PCB.',
    moveHistory: [
      {
        id: 'mv-ic-1',
        type: 'entrada',
        quantity: 25,
        description: 'Lote importación microelectrónica',
        orderRef: 'IMP-7721',
        technician: 'Marcos T.',
        timestamp: 'Hace 5 días'
      }
    ]
  },
  {
    id: 'apl-ip14-bat-hi',
    name: 'Batería High-Capacity iPhone 14 (3450 mAh)',
    subtitle: 'Capacidad +6% Celda Cobalto Puro Grado A+',
    brand: 'Apple',
    category: 'baterias',
    sku: 'APL-IP14-BATHI-02',
    barcode: '8439201949980',
    drawer: 'Gaveta B-02',
    bayRack: 'BAY-02 // RACK-A',
    locationHierarchy: {
      workshop: 'Taller Central',
      module: 'Módulo B (Alimentación)',
      drawer: 'Gaveta B-02'
    },
    stock: 14,
    minStockAlert: 5,
    costPrice: 24.00,
    pvpPrice: 59.00,
    qualityBadge: 'High-Capacity Cobalto',
    qualityCategory: 'Ensamblado',
    warranty: 'Garantía 12 meses',
    thumbnailTag: '3450 mAh',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5Nd839m58Z4dAmhPdXjzBCRocpJuHYBRbKLE-fzvFx_LusPMMd8SoHTIxZwM_SEftmuSSaORYfNTOmhYb_9mByIqcfRsTZCHRJDRpn0tw06eiYUkv3M4J9dMoUy6w-bCjTI87YNwYf2lKAWzuy8QJSGiZQ7IdfZi5EWPDPSCH_9sxBX1IoJqJDnuy1B6-mWl1VP_k37wemu8a2WBFRjxj-cfiMO9atADoqZ3lEW5t4_pf7JCBwtLh9Q',
        caption: 'Celda de alto rendimiento con flex tag-on',
        icon: 'straighten'
      }
    ],
    hardwareCompatibility: ['A2882', 'A2649', 'A2881', 'A2884'],
    panelSpecs: '3450 mAh (+171 mAh sobre estándar) // Incluye cinta adhesiva doble cara preaplicada.',
    supplier: 'EuroParts Mobile S.L.',
    lastEntryDate: '07/06/2024',
    technicalNotes: 'Compatible con flex tag-on para eliminar notificación de mensaje importante de batería.',
    moveHistory: [
      {
        id: 'mv-bat14-1',
        type: 'entrada',
        quantity: 15,
        description: 'Recepción pedido #REC-8891',
        orderRef: 'REC-8891',
        technician: 'Carlos M.',
        timestamp: 'Hoy 10:00'
      }
    ]
  },
  {
    id: 'apl-ip12-bat-used',
    name: 'Batería Original Recuperada iPhone 12 / 12 Pro',
    subtitle: 'Segunda Mano // Salud 93% • 138 ciclos testeados',
    brand: 'Apple',
    category: 'baterias',
    sku: 'APL-IP12-BAT-USED',
    barcode: '8439201949112',
    drawer: 'Gaveta B-01',
    bayRack: 'BAY-02 // RACK-A',
    locationHierarchy: {
      workshop: 'Taller Central',
      module: 'Módulo B (Alimentación)',
      drawer: 'Gaveta B-01'
    },
    stock: 4,
    minStockAlert: 1,
    costPrice: 11.50,
    pvpPrice: 28.00,
    qualityBadge: '2ª Mano Testeada 93%',
    qualityCategory: 'Genuino',
    warranty: 'Garantía 3 meses',
    thumbnailTag: '2ª MANO 93%',
    condition: 'segunda_mano',
    conditionGrade: 'Grado A+ (Impoluto / Como Nuevo)',
    donorDevice: 'iPhone 12 128GB Negro (Donante de despiece taller)',
    testedStatus: 'Capacidad residual 2618 mAh (93.1%), resistencia interna 41mΩ',
    batteryCycles: 138,
    healthPercentage: 93,
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5Nd839m58Z4dAmhPdXjzBCRocpJuHYBRbKLE-fzvFx_LusPMMd8SoHTIxZwM_SEftmuSSaORYfNTOmhYb_9mByIqcfRsTZCHRJDRpn0tw06eiYUkv3M4J9dMoUy6w-bCjTI87YNwYf2lKAWzuy8QJSGiZQ7IdfZi5EWPDPSCH_9sxBX1IoJqJDnuy1B6-mWl1VP_k37wemu8a2WBFRjxj-cfiMO9atADoqZ3lEW5t4_pf7JCBwtLh9Q',
        caption: 'Batería Original Recuperada Testeada en Banco',
        icon: 'battery_charging_full'
      }
    ],
    hardwareCompatibility: ['A2403 (Global)', 'A2172 (USA)', 'A2402 (Canadá)', 'A2404 (China)'],
    panelSpecs: '2815 mAh nominal // BMS Original Apple intacto sin manipular // Conector FPC excelente.',
    supplier: 'Despiece Interno de Taller // Donante Certificado',
    lastEntryDate: '09/06/2024',
    technicalNotes: 'Batería desmontada con tiras elásticas originales. Probada curva de descarga completa en medidor.',
    moveHistory: [
      {
        id: 'mv-bat12-used-1',
        type: 'entrada',
        quantity: 4,
        description: 'Ingreso lote despiece terminales donantes (+4)',
        orderRef: 'SALVAGE-012',
        technician: 'Carlos M.',
        timestamp: 'Ayer 15:30'
      }
    ]
  },
  {
    id: 'sam-s22-scr-used',
    name: 'Pantalla Dynamic AMOLED Galaxy S22 5G (Despiece)',
    subtitle: 'Segunda Mano Original • Con Marco Phantom Black',
    brand: 'Samsung',
    category: 'pantallas',
    sku: 'SAM-S22-SCR-USED',
    barcode: '8806094726888',
    drawer: 'Gaveta A-04',
    bayRack: 'BAY-01 // RACK-B',
    locationHierarchy: {
      workshop: 'Taller Central',
      module: 'Módulo A (Pantallas)',
      drawer: 'Gaveta A-04'
    },
    stock: 3,
    minStockAlert: 1,
    costPrice: 48.00,
    pvpPrice: 89.00,
    qualityBadge: '2ª Mano Despiece Grado A',
    qualityCategory: 'Genuino',
    warranty: 'Garantía 6 meses',
    thumbnailTag: '2ª MANO OEM',
    condition: 'segunda_mano',
    conditionGrade: 'Grado A (Excelente / Mínimas marcas)',
    donorDevice: 'Galaxy S22 SM-S901B (Donante chasis/pantalla - Placa rota)',
    testedStatus: 'Panel 120Hz libre de quemados, táctil y huella ultrasónica 100% OK',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWCNTFesoL5kVaF2ojKh0zPxrXspiKxDa8BQQKRQyvWY3jN3zxh9TejHvnP7aaTzgTNH82ks0QqbN9rd4S_zLj2cARDnVBuNHuXYG3mFS8CRjDVrF7clL3BlWApQEb9W7XmTZBw5H2PyWP-BPCVhsLMmxxWR4DiuG6RhwT2zTBrChj9MdoSSPtl-EpdT7fXSoOT9yvjdT2EGTT0uqAAodWrh69gdWDslGyQ8sqIj_2_SmswCw79JcPgA',
        caption: 'Módulo pantalla con marco original integrado',
        icon: 'display_settings'
      }
    ],
    hardwareCompatibility: ['SM-S901B/DS', 'SM-S901U', 'SM-S901W'],
    panelSpecs: 'Dynamic AMOLED 2X 6.1" FHD+, 120Hz adaptativo, marco de aluminio blindado Armor Aluminum.',
    supplier: 'Despiece Taller // Donante #09',
    lastEntryDate: '08/06/2024',
    technicalNotes: 'Montaje directo sin adhesivos líquidos. Incluye botones y cable flex de antena integrados.',
    moveHistory: [
      {
        id: 'mv-s22-used-1',
        type: 'entrada',
        quantity: 3,
        description: 'Recuperación de terminal donante con placa dañada (+3)',
        orderRef: 'SALVAGE-009',
        technician: 'Laura S.',
        timestamp: 'Hace 2 días'
      }
    ]
  }
];


export const WORK_ORDERS: WorkOrder[] = [
  {
    id: 'OT #1042',
    title: 'Cambio de batería',
    technician: 'Carlos M.',
    device: 'iPhone 13 (A2633)',
    status: 'En Proceso',
    date: 'Hoy 10:15'
  },
  {
    id: 'OT #1045',
    title: 'Reacondicionamiento',
    technician: 'Marcos T.',
    device: 'iPhone 14 Pro Max (A2894)',
    status: 'En Proceso',
    date: 'Hoy 11:40'
  },
  {
    id: 'OT #1048',
    title: 'Prueba de laboratorio',
    technician: 'Laura S.',
    device: 'Samsung Galaxy S23 Ultra',
    status: 'Pendiente',
    date: 'Hoy 13:00'
  },
  {
    id: 'OT #1039',
    title: 'Sustitución Pantalla OLED',
    technician: 'Carlos M.',
    device: 'iPhone 14 Pro',
    status: 'Completado',
    date: 'Ayer'
  },
  {
    id: 'OT #1038',
    title: 'Cambio Flex Carga',
    technician: 'Laura S.',
    device: 'Samsung S22 Ultra',
    status: 'Completado',
    date: 'Ayer'
  }
];

export const INITIAL_RECENT_SCANS: RecentScan[] = [
  {
    id: 'sc-1',
    partId: 'apl-ip14pm-scr',
    partName: 'AMOLED Panel iPhone 14 Pro',
    sku: '#DIS-IP14P',
    refCode: 'OT #1039 (-1)',
    type: 'salida',
    qty: 1,
    dotColor: 'bg-green-600'
  },
  {
    id: 'sc-2',
    partId: 'xmi-13p-flx',
    partName: 'Flex Carga Samsung S22 Ultra',
    sku: '#FLX-SM-S908',
    refCode: 'OT #1038 (-1)',
    type: 'salida',
    qty: 1,
    dotColor: 'bg-primary'
  },
  {
    id: 'sc-3',
    partId: 'apl-ip13-cam',
    partName: 'Cámara Trasera iPhone 12',
    sku: '#CAM-IP12-MAIN',
    refCode: 'Stock Rec (+5)',
    type: 'entrada',
    qty: 5,
    dotColor: 'bg-secondary-container'
  }
];
