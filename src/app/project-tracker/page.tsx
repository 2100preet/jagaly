import type { Metadata } from 'next';
import TrackerClient from './TrackerClient';
export const metadata: Metadata = { title: 'Builder project delay tracker' };
export default function Page() { return <TrackerClient />; }
