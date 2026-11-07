export type View =
  | 'home'
  | 'scanner'
  | 'agencies'
  | 'guide'
  | 'requests'
  | 'create-request'
  | 'receipt';

export interface Agency {
  id: string;
  name: string;
  city: string;
  zone: string;
  address: string;
  materials: string[];
  referencePrices: Record<string, string>;
  schedule: string;
  minimumKg: number;
  phone: string;
  whatsapp: string;
  serviceType: string;
}

export type AnalysisStatus = 'identified' | 'uncertain' | 'not_recyclable' | 'not_relevant' | 'poor_image' | 'error';

export interface WasteObjectAnalysis {
  object: string | null;
  material: string | null;
  evidence: string | null;
  resinCode: string | null;
  visibleCondition: string | null;
  recyclable: boolean;
}

export interface WasteAnalysis {
  status: AnalysisStatus;
  items?: WasteObjectAnalysis[];
  object: string | null;
  material: string | null;
  specific: string | null;
  resinCode: string | null;
  visibleCondition: string | null;
  confidence: string | null;
  recyclable: boolean;
  explanation: string;
  recommendations: string[];
  reuseIdeas: string[];
  warnings: string[];
  preparation?: string;
  reuse?: string;
  precautions?: string;
  disposal?: string;
  environmentalImpact?: string;
  isDemo?: boolean;
  demoNote?: string;
}

export interface WasteSample {
  id: string;
  name: string;
  imageUrl: string;
  analysis: Omit<WasteAnalysis, 'isDemo' | 'demoNote'>;
}

export type RequestStatus = 'Pendiente' | 'Recibida' | 'Atendida';

export interface RecyclingRequest {
  id: string;
  date: string;
  material: string;
  quantityKg: string;
  agency: string;
  status: RequestStatus;
  photoUrl: string;
  notes: string;
}

export interface RequestFormValues {
  material: string;
  quantityKg: string;
  agencyId: string;
  notes: string;
  photoUrl: string;
}
