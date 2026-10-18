export interface ProjectDelay {
  name: string;
  builder: string;
  locality: string;
  rera: string;
  units: number;
  launched: string;
  promised: string;
  revised: string;
  delayMonths: number;
  progress: number; // % construction complete (sample)
  complaints: number;
  status: 'On track' | 'Minor delay' | 'Delayed' | 'Stalled' | 'Delivered';
  lastUpdate: string;
}

// SAMPLE, fictional data styled after Karnataka RERA disclosures.
export const PROJECTS: ProjectDelay[] = [
  { name: 'Demo Grove Whitefield', builder: 'Sample Developers A', locality: 'Whitefield', rera: 'SAMPLE-PRM/KA/RERA/1251/446/PR/210923/006112', units: 420, launched: 'Mar 2024', promised: 'Dec 2027', revised: 'Dec 2027', delayMonths: 0, progress: 46, complaints: 2, status: 'On track', lastUpdate: 'Sep 2026' },
  { name: 'Demo Skyline Sarjapur', builder: 'Sample Developers B', locality: 'Sarjapur Road', rera: 'SAMPLE-PRM/KA/RERA/1251/308/PR/220114/004871', units: 610, launched: 'Jan 2023', promised: 'Dec 2026', revised: 'Jun 2027', delayMonths: 6, progress: 71, complaints: 14, status: 'Minor delay', lastUpdate: 'Aug 2026' },
  { name: 'Demo Meadows E-City Ph 2', builder: 'Sample Developers B', locality: 'Electronic City', rera: 'SAMPLE-PRM/KA/RERA/1251/310/PR/200611/003355', units: 380, launched: 'Jun 2020', promised: 'Dec 2023', revised: 'Sep 2026', delayMonths: 33, progress: 88, complaints: 61, status: 'Delayed', lastUpdate: 'Sep 2026' },
  { name: 'Demo Banyan Court', builder: 'Sample Developers C', locality: 'Sarjapur Road', rera: 'SAMPLE-PRM/KA/RERA/1251/446/PR/240302/006540', units: 96, launched: 'Mar 2024', promised: 'Mar 2028', revised: 'Mar 2028', delayMonths: 0, progress: 22, complaints: 0, status: 'On track', lastUpdate: 'Sep 2026' },
  { name: 'Demo Lake Towers Hebbal', builder: 'Sample Developers D', locality: 'Hebbal', rera: 'SAMPLE-PRM/KA/RERA/1251/309/PR/210820/004402', units: 540, launched: 'Aug 2021', promised: 'Jun 2025', revised: 'Dec 2026', delayMonths: 18, progress: 92, complaints: 23, status: 'Delayed', lastUpdate: 'Oct 2026' },
  { name: 'Demo Central Kempapura', builder: 'Sample Developers C', locality: 'Hebbal', rera: 'SAMPLE-PRM/KA/RERA/1251/309/PR/230915/006021', units: 320, launched: 'Sep 2023', promised: 'Jan 2028', revised: 'Jan 2028', delayMonths: 0, progress: 35, complaints: 1, status: 'On track', lastUpdate: 'Jul 2026' },
  { name: 'Demo Greens Yelahanka', builder: 'Sample Developers D', locality: 'Yelahanka', rera: 'SAMPLE-PRM/KA/RERA/1251/309/PR/190402/002611', units: 450, launched: 'Apr 2019', promised: 'Mar 2023', revised: 'Feb 2026', delayMonths: 35, progress: 100, complaints: 40, status: 'Delivered', lastUpdate: 'Feb 2026' },
  { name: 'Demo Signature Koramangala', builder: 'Sample Developers A', locality: 'Koramangala', rera: 'SAMPLE-PRM/KA/RERA/1251/310/PR/200105/003012', units: 64, launched: 'Jan 2020', promised: 'Dec 2024', revised: 'Jun 2025', delayMonths: 6, progress: 100, complaints: 3, status: 'Delivered', lastUpdate: 'Jun 2025' },
  { name: 'Demo Oak Court Sarjapur', builder: 'Sample Developers E', locality: 'Sarjapur Road', rera: 'SAMPLE-PRM/KA/RERA/1251/446/PR/180712/001933', units: 720, launched: 'Jul 2018', promised: 'Dec 2021', revised: '—', delayMonths: 58, progress: 54, complaints: 212, status: 'Stalled', lastUpdate: 'Nov 2025' },
  { name: 'Demo Bay Whitefield Ph 1', builder: 'Sample Developers E', locality: 'Whitefield', rera: 'SAMPLE-PRM/KA/RERA/1251/446/PR/190930/002780', units: 300, launched: 'Sep 2019', promised: 'Sep 2023', revised: 'Mar 2027', delayMonths: 42, progress: 63, complaints: 97, status: 'Delayed', lastUpdate: 'Aug 2026' },
  { name: 'Demo Heights Hosa Road', builder: 'Sample Developers B', locality: 'Electronic City', rera: 'SAMPLE-PRM/KA/RERA/1251/310/PR/250110/007003', units: 260, launched: 'Jan 2025', promised: 'Dec 2028', revised: 'Dec 2028', delayMonths: 0, progress: 12, complaints: 0, status: 'On track', lastUpdate: 'Sep 2026' },
  { name: 'Demo Lakeside Jakkur', builder: 'Sample Developers D', locality: 'Yelahanka', rera: 'SAMPLE-PRM/KA/RERA/1251/309/PR/220505/005144', units: 180, launched: 'May 2022', promised: 'Dec 2025', revised: 'Mar 2026', delayMonths: 3, progress: 100, complaints: 4, status: 'Delivered', lastUpdate: 'Apr 2026' },
];
