import { CloudRain, Droplets, Zap, Clock, Calculator, Scale, FileSearch, Mic } from 'lucide-react';
import type { DiffId } from '@/config/differentiators';
export const DIFF_ICONS: Record<DiffId, typeof CloudRain> = { flood: CloudRain, water: Droplets, power: Zap, commute: Clock, cost: Calculator, deposit: Scale, agreement: FileSearch, voice: Mic };
