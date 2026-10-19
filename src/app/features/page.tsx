import type { Metadata } from 'next';
import FeaturesClient from './FeaturesClient';

export const metadata: Metadata = {
  title: 'What makes Jagaly different — Bengaluru reality checks before you sign',
  description: 'Flood & Monsoon Check from BBMP data, water and power reality, peak-hour commute, true monthly cost, deposit fairness, agreement red-flag scan and voice-note listing in Kannada, Hindi and English.',
};
export default function Page() { return <FeaturesClient />; }
