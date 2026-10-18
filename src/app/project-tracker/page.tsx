import type { Metadata } from 'next';
import TrackerClient from './TrackerClient';
export const metadata: Metadata = { title: 'RERA project completion tracker — Bengaluru Urban (public records)' };
export default function Page() { return <TrackerClient />; }
