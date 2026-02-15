import type { ServiceRate } from '../backend';

export interface Service {
  id: string;
  name: string;
  priceText: string;
  description: string;
  iconPath: string;
  imagePath: string;
  imageAlt: string;
  rateKey?: keyof ServiceRate;
  defaultRate?: number;
  isInspectionBased?: boolean;
}

export const SERVICES: Service[] = [
  {
    id: 'POP & Gypsum',
    name: 'POP & Gypsum False Ceiling',
    priceText: 'Starting at ₹65 per sq.ft',
    description: 'Elegant and cost-effective ceiling designs for homes and offices.',
    iconPath: '/assets/generated/icon-pop-gypsum.dim_256x256.png',
    imagePath: '/images/service1.jpg',
    imageAlt: 'Modern POP and Gypsum false ceiling installation in a residential space',
    rateKey: 'popGypsum',
    defaultRate: 65,
  },
  {
    id: 'PVC',
    name: 'PVC Ceiling Installation',
    priceText: 'Starting at ₹110 per sq.ft',
    description: 'Durable, waterproof and low maintenance ceiling solutions.',
    iconPath: '/assets/generated/icon-pvc.dim_256x256.png',
    imagePath: '/images/service2.jpg',
    imageAlt: 'Waterproof PVC ceiling panels installed in a modern interior',
    rateKey: 'pvc',
    defaultRate: 110,
  },
  {
    id: 'Wall Molding',
    name: 'Wall Molding & Decorative Panels',
    priceText: 'Starting at ₹100 per sq.ft',
    description: 'Modern decorative wall molding for premium interiors.',
    iconPath: '/assets/generated/icon-wall-molding.dim_256x256.png',
    imagePath: '/images/service3.jpg',
    imageAlt: 'Elegant decorative wall molding and panels in a luxury home',
    rateKey: 'wallMolding',
    defaultRate: 100,
  },
  {
    id: 'Gypsum Repair',
    name: 'Gypsum Ceiling Repairing',
    priceText: 'Inspection based pricing',
    description: 'Crack repair, redesign and ceiling restoration services.',
    iconPath: '/assets/generated/icon-gypsum-repair.dim_256x256.png',
    imagePath: '/images/service4.jpg',
    imageAlt: 'Professional gypsum ceiling repair and restoration work',
    isInspectionBased: true,
  },
];

export function getServiceRate(serviceId: string, serviceRates?: ServiceRate): number | null {
  const service = SERVICES.find((s) => s.id === serviceId);
  if (!service) return null;
  if (service.isInspectionBased) return null;
  if (!service.rateKey) return service.defaultRate || null;

  if (serviceRates) {
    return Number(serviceRates[service.rateKey]);
  }

  return service.defaultRate || null;
}
