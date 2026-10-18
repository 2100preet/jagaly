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
  { name: 'Aranya Greens', builder: 'Vasudha Developers', locality: 'Whitefield', rera: 'PRM/KA/RERA/1251/446/PR/210923/006112', units: 420, launched: 'Mar 2024', promised: 'Dec 2027', revised: 'Dec 2027', delayMonths: 0, progress: 46, complaints: 2, status: 'On track', lastUpdate: 'Sep 2026' },
  { name: 'Neelgiri Skyline', builder: 'Kaveri Habitat', locality: 'Sarjapur Road', rera: 'PRM/KA/RERA/1251/308/PR/220114/004871', units: 610, launched: 'Jan 2023', promised: 'Dec 2026', revised: 'Jun 2027', delayMonths: 6, progress: 71, complaints: 14, status: 'Minor delay', lastUpdate: 'Aug 2026' },
  { name: 'Tech Meadows Phase 2', builder: 'Kaveri Habitat', locality: 'Electronic City', rera: 'PRM/KA/RERA/1251/310/PR/200611/003355', units: 380, launched: 'Jun 2020', promised: 'Dec 2023', revised: 'Sep 2026', delayMonths: 33, progress: 88, complaints: 61, status: 'Delayed', lastUpdate: 'Sep 2026' },
  { name: 'The Banyan Estates', builder: 'Sahyadri Constructions', locality: 'Sarjapur Road', rera: 'PRM/KA/RERA/1251/446/PR/240302/006540', units: 96, launched: 'Mar 2024', promised: 'Mar 2028', revised: 'Mar 2028', delayMonths: 0, progress: 22, complaints: 0, status: 'On track', lastUpdate: 'Sep 2026' },
  { name: 'Skyward Lake Towers', builder: 'Nandi Infra', locality: 'Hebbal', rera: 'PRM/KA/RERA/1251/309/PR/210820/004402', units: 540, launched: 'Aug 2021', promised: 'Jun 2025', revised: 'Dec 2026', delayMonths: 18, progress: 92, complaints: 23, status: 'Delayed', lastUpdate: 'Oct 2026' },
  { name: 'Kempapura Central', builder: 'Sahyadri Constructions', locality: 'Hebbal', rera: 'PRM/KA/RERA/1251/309/PR/230915/006021', units: 320, launched: 'Sep 2023', promised: 'Jan 2028', revised: 'Jan 2028', delayMonths: 0, progress: 35, complaints: 1, status: 'On track', lastUpdate: 'Jul 2026' },
  { name: 'Airport Greens', builder: 'Nandi Infra', locality: 'Yelahanka', rera: 'PRM/KA/RERA/1251/309/PR/190402/002611', units: 450, launched: 'Apr 2019', promised: 'Mar 2023', revised: 'Feb 2026', delayMonths: 35, progress: 100, complaints: 40, status: 'Delivered', lastUpdate: 'Feb 2026' },
  { name: 'Raintree Signature', builder: 'Vasudha Developers', locality: 'Koramangala', rera: 'PRM/KA/RERA/1251/310/PR/200105/003012', units: 64, launched: 'Jan 2020', promised: 'Dec 2024', revised: 'Jun 2025', delayMonths: 6, progress: 100, complaints: 3, status: 'Delivered', lastUpdate: 'Jun 2025' },
  { name: 'Silver Oak Residences', builder: 'Meghana Builders', locality: 'Sarjapur Road', rera: 'PRM/KA/RERA/1251/446/PR/180712/001933', units: 720, launched: 'Jul 2018', promised: 'Dec 2021', revised: '—', delayMonths: 58, progress: 54, complaints: 212, status: 'Stalled', lastUpdate: 'Nov 2025' },
  { name: 'Lotus Bay Phase 1', builder: 'Meghana Builders', locality: 'Whitefield', rera: 'PRM/KA/RERA/1251/446/PR/190930/002780', units: 300, launched: 'Sep 2019', promised: 'Sep 2023', revised: 'Mar 2027', delayMonths: 42, progress: 63, complaints: 97, status: 'Delayed', lastUpdate: 'Aug 2026' },
  { name: 'Hosa Road Heights', builder: 'Kaveri Habitat', locality: 'Electronic City', rera: 'PRM/KA/RERA/1251/310/PR/250110/007003', units: 260, launched: 'Jan 2025', promised: 'Dec 2028', revised: 'Dec 2028', delayMonths: 0, progress: 12, complaints: 0, status: 'On track', lastUpdate: 'Sep 2026' },
  { name: 'Jakkur Lakeside', builder: 'Nandi Infra', locality: 'Yelahanka', rera: 'PRM/KA/RERA/1251/309/PR/220505/005144', units: 180, launched: 'May 2022', promised: 'Dec 2025', revised: 'Mar 2026', delayMonths: 3, progress: 100, complaints: 4, status: 'Delivered', lastUpdate: 'Apr 2026' },
];
