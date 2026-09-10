export type PartCategory = 'todos' | 'pantallas' | 'baterias' | 'flex' | 'camaras' | 'placas';

export type StockFilter = 'todo' | 'bajo' | 'agotado';

export type PartCondition = 'nuevo' | 'segunda_mano';

export type ConditionFilter = 'todos' | 'nuevos' | 'segunda_mano';

export type ConditionGrade =
  | 'Grado A+ (Impoluto / Como Nuevo)'
  | 'Grado A (Excelente / Mínimas marcas)'
  | 'Grado B (Buen estado / Uso visible)'
  | 'Despiece Original Testeado 100%'
  | 'Reacondicionado (Lente/Cristal Renovado)'
  | 'Para Reparar / Donante de ICs';

export interface DrawerLocation {
  id: string;
  code: string;
  name: string;
  module: string;
  bayRack: string;
  workshop: string;
  category?: PartCategory;
  description?: string;
  capacity?: number;
  maxCapacity?: number;
}

export interface MovementHistoryItem {
  id: string;
  type: 'salida' | 'entrada';
  quantity: number;
  description: string;
  orderRef?: string;
  technician?: string;
  timestamp: string;
}

export interface SparePart {
  id: string;
  name: string;
  subtitle: string;
  brand: 'Apple' | 'Samsung' | 'Xiaomi' | 'Huawei' | 'Google' | 'Motorola' | string;
  category: PartCategory;
  sku: string;
  barcode: string;
  drawer: string;
  bayRack: string;
  locationHierarchy: {
    workshop: string;
    module: string;
    drawer: string;
  };
  stock: number;
  minStockAlert: number;
  costPrice: number;
  pvpPrice: number;
  qualityBadge: string;
  qualityCategory: 'Genuino' | 'Ensamblado' | 'Aftermarket';
  warranty: string;
  images: {
    url: string;
    caption: string;
    tag?: string;
    icon?: string;
  }[];
  thumbnailTag?: string;
  hardwareCompatibility: string[];
  panelSpecs: string;
  supplier: string;
  lastEntryDate: string;
  technicalNotes: string;
  condition?: PartCondition;
  conditionGrade?: string;
  donorDevice?: string;
  testedStatus?: string;
  batteryCycles?: number;
  healthPercentage?: number;
  moveHistory: MovementHistoryItem[];
}


export interface WorkOrder {
  id: string;
  title: string;
  technician: string;
  device: string;
  status: 'En Proceso' | 'Pendiente' | 'Completado';
  date: string;
}

export interface RecentScan {
  id: string;
  partId: string;
  partName: string;
  sku: string;
  refCode: string;
  type: 'salida' | 'entrada';
  qty: number;
  dotColor: string;
}

export interface TechnicianUser {
  id: string;
  name: string;
  code: string; // e.g. '#04'
  role: string;
  roleBadge: string;
  avatar: string;
  pin: string;
  specialty: string;
  station: string;
  activeOrdersCount: number;
  email?: string;
  isAdmin: boolean;
}
