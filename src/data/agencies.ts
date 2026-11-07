import type { Agency } from '../types';

// Registros y precios ficticios para el prototipo; no representan agencias verificadas.
export const agencies: Agency[] = [
  {
    id: 'ag-1', name: 'Recicladora Illimani Verde', city: 'La Paz', zone: 'Sopocachi / Cotahuma',
    address: 'Av. Mario Mercado N° 1420', materials: ['Plástico', 'Papel y Cartón', 'Metal'],
    referencePrices: { 'Plástico (PET)': '2.80 Bs/kg', Cartón: '1.20 Bs/kg', Aluminio: '8.50 Bs/kg' },
    schedule: 'Lun a Vie: 08:30 - 17:00 | Sáb: 08:30 - 13:00', minimumKg: 5,
    phone: '+591 71542890', whatsapp: '59171542890', serviceType: 'Recepción en planta y Recojo programado',
  },
  {
    id: 'ag-2', name: 'EcoValle Soluciones Limpias', city: 'Cochabamba', zone: 'Zona Norte / Cala Cala',
    address: 'Calle Teófilo Vargas N° 380', materials: ['Vidrio', 'Orgánico', 'Papel y Cartón'],
    referencePrices: { 'Vidrio entero': '0.70 Bs/kg', Compostable: 'Gratuito / Intercambio abono' },
    schedule: 'Lun a Sáb: 08:00 - 16:30', minimumKg: 3,
    phone: '+591 79781234', whatsapp: '59179781234', serviceType: 'Recepción en planta',
  },
  {
    id: 'ag-3', name: 'Metales & Residuos del Oriente', city: 'Santa Cruz', zone: 'Parque Industrial / 4to Anillo',
    address: 'PI-27 Manzano 12, Galpón 4', materials: ['Metal', 'Electrónico (RAEE)', 'Plástico'],
    referencePrices: { Cobre: '42.00 Bs/kg', Baterías: '15.00 Bs/unidad', Chatarra: '1.50 Bs/kg' },
    schedule: 'Lun a Vie: 07:30 - 18:00', minimumKg: 10,
    phone: '+591 76098765', whatsapp: '59176098765', serviceType: 'Recepción a granel y recojo industrial',
  },
  {
    id: 'ag-4', name: 'Punto Verde Alto Andino', city: 'El Alto', zone: 'Villa Adela / Cruce Viacha',
    address: 'Av. Bolivia N° 905', materials: ['Plástico', 'Papel y Cartón', 'Electrónico (RAEE)'],
    referencePrices: { 'PET Cristal': '2.90 Bs/kg', 'Papel bond blanco': '1.80 Bs/kg' },
    schedule: 'Lun a Sáb: 08:00 - 18:00', minimumKg: 2,
    phone: '+591 72019283', whatsapp: '59172019283', serviceType: 'Recepción en centro de acopio',
  },
];

export const cities = ['La Paz', 'El Alto', 'Cochabamba', 'Santa Cruz'];
export const materials = ['Plástico', 'Papel y Cartón', 'Vidrio', 'Metal', 'Electrónico (RAEE)', 'Orgánico'];
