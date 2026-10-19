/* Sample commercial spaces + land for the Jagaly prototype.
 * Every listing here is FICTIONAL sample data: building names, prices, scores and specs are illustrative only.
 * Coordinates are approximate neighbourhood points for the map. */
import type { Listing } from './listings';
import { AREAS } from './geo';

export type Segment = 'residential' | 'commercial';
export type PropertyType =
  | 'apartment' | 'res-plot'
  | 'office' | 'coworking' | 'retail' | 'showroom' | 'fnb' | 'warehouse' | 'industrial' | 'comm-land';
export type Condition = 'ready' | 'furnished' | 'warm' | 'bare';
export type Suitable = 'IT / office' | 'Clinic' | 'Retail' | 'F&B' | 'Showroom' | 'Warehouse' | 'Manufacturing' | 'Bank / ATM';

export const PROPERTY_TYPES: Record<PropertyType, { label: string; plural: string; segment: Segment; art: 'home' | 'tower' | 'shop' | 'shed' | 'land'; seats?: boolean; frontage?: boolean; land?: boolean }> = {
  apartment: { label: 'Apartment / house', plural: 'homes', segment: 'residential', art: 'home' },
  'res-plot': { label: 'Residential plot', plural: 'residential plots', segment: 'residential', art: 'land', land: true, frontage: true },
  office: { label: 'Office space', plural: 'office spaces', segment: 'commercial', art: 'tower', seats: true },
  coworking: { label: 'Co-working / managed office', plural: 'managed offices', segment: 'commercial', art: 'tower', seats: true },
  retail: { label: 'Retail shop', plural: 'retail shops', segment: 'commercial', art: 'shop', frontage: true },
  showroom: { label: 'Showroom', plural: 'showrooms', segment: 'commercial', art: 'shop', frontage: true },
  fnb: { label: 'Restaurant / F&B space', plural: 'F&B spaces', segment: 'commercial', art: 'shop', frontage: true },
  warehouse: { label: 'Warehouse / godown', plural: 'warehouses', segment: 'commercial', art: 'shed' },
  industrial: { label: 'Industrial shed', plural: 'industrial sheds', segment: 'commercial', art: 'shed' },
  'comm-land': { label: 'Commercial land / plot', plural: 'commercial plots', segment: 'commercial', art: 'land', land: true, frontage: true },
};
export const COMMERCIAL_TYPES = (Object.keys(PROPERTY_TYPES) as PropertyType[]).filter((k) => PROPERTY_TYPES[k].segment === 'commercial');
export const CONDITIONS: Record<Condition, string> = { ready: 'Ready to move', furnished: 'Furnished / plug-and-play', warm: 'Warm shell', bare: 'Bare shell' };
export const SUITABLE: Suitable[] = ['IT / office', 'Clinic', 'Retail', 'F&B', 'Showroom', 'Warehouse', 'Manufacturing', 'Bank / ATM'];

/** Extra specs for non-BHK listings (commercial spaces and plots). */
export interface SpaceInfo {
  carpetSqft?: number; // usable carpet area (not for land)
  superBuiltUpSqft: number; // chargeable area; plot area for land
  ratePsf: number; // asking: ₹/sqft (sale) or ₹/sqft/month (lease) on super built-up / plot area
  trueRatePsf: number; // sample model estimate on the same basis
  seats?: number;
  frontageFt?: number;
  powerKva?: number;
  carParking: number;
  parkingNote: string;
  lockInMonths?: number;
  depositMonths?: number;
  camPsf: number; // maintenance / CAM ₹/sqft/month (0 = included)
  escalationPct?: number; // yearly rent escalation
  condition?: Condition;
  zoning: string;
  zoningOk: boolean; // approved / converted for the intended use (sample)
  ocStatus: 'OC received' | 'CC received, OC pending' | 'OC pending' | 'Not applicable (land)';
  suitableFor: Suitable[];
  footfall?: number; // sample 1–10 (retail / F&B)
  /** Property Truth Score components, sample 1–10, higher = better */
  truth: { power: number; flooding: number; access: number; zoning: number; occc: number };
}

type Seed = {
  type: PropertyType; deal: 'rent' | 'buy'; locality: string; name: string; coord?: [number, number];
  carpet?: number; sba: number; rate: number; delta: number; kind?: 'owner' | 'builder';
  seats?: number; frontage?: number; kva?: number; car: number; parking: string; lockIn?: number; dep?: number; cam: number;
  cond?: Condition; zoning: string; zoningOk?: boolean; oc: SpaceInfo['ocStatus']; suit: Suitable[]; floor: string; footfall?: number;
  truth: [number, number, number, number, number]; amen: string[]; blurb: string; verified?: boolean; ownerDoc?: boolean;
};

// prettier-ignore
const SEEDS: Seed[] = [
  { type: 'office', deal: 'rent', locality: 'Kadubeesanahalli', name: 'Sample Tech Square, ORR', carpet: 7200, sba: 10000, rate: 98, delta: 3, seats: 110, kva: 150, car: 10, parking: '10 car + 30 two-wheeler', lockIn: 36, dep: 6, cam: 18, cond: 'warm', zoning: 'Commercial (sample)', oc: 'OC received', suit: ['IT / office'], floor: '5 of 9', truth: [9, 6, 7, 9, 9], amen: ['DG backup 100%', 'Central AC provision', 'Fire NOC', 'Food court', '24x7 access', 'Lifts (4)'], blurb: 'A warm-shell floor on the Outer Ring Road tech corridor, a short ride from Marathahalli and Bellandur.' },
  { type: 'coworking', deal: 'rent', locality: 'Bellandur', name: 'Demo Desk Hub Bellandur', carpet: 2400, sba: 3400, rate: 100, delta: -2, seats: 40, kva: 40, car: 4, parking: '4 car + 15 two-wheeler', lockIn: 12, dep: 3, cam: 0, cond: 'furnished', zoning: 'Commercial (sample)', oc: 'OC received', suit: ['IT / office'], floor: '3 of 6', truth: [9, 5, 7, 9, 9], amen: ['Plug-and-play desks', 'Meeting rooms (3)', 'Pantry', 'High-speed internet', 'Housekeeping', 'DG backup 100%'], blurb: 'Managed office for a 30–40 person team. Rent includes CAM, housekeeping and internet (about ₹8,500 per seat per month).' },
  { type: 'office', deal: 'rent', locality: 'Whitefield', name: 'Sample ITPL Road Business Park', carpet: 14000, sba: 20000, rate: 72, delta: -4, seats: 220, kva: 300, car: 25, parking: '25 car + 80 two-wheeler', lockIn: 36, dep: 6, cam: 16, cond: 'bare', zoning: 'Commercial (sample)', oc: 'OC received', suit: ['IT / office'], floor: '2 of 8', truth: [8, 7, 7, 9, 9], amen: ['DG backup 100%', 'Fire NOC', 'Cafeteria', 'EV charging', 'Shuttle to metro', '24x7 security'], blurb: 'Bare-shell floor plate near ITPL and the Purple Line metro, suited to a large IT or GCC team.' },
  { type: 'office', deal: 'buy', locality: 'Whitefield', name: 'Demo Commerce Tower Whitefield', carpet: 1850, sba: 2600, rate: 10500, delta: 6, seats: 28, kva: 25, car: 2, parking: '2 covered car', cam: 12, cond: 'warm', zoning: 'Commercial (sample)', oc: 'OC received', suit: ['IT / office', 'Clinic'], floor: '6 of 12', truth: [8, 7, 7, 9, 9], amen: ['DG backup', 'Lifts (3)', 'Fire NOC', 'Visitor parking'], blurb: 'Pre-leasable strata office unit for a small firm or an investor.', ownerDoc: true },
  { type: 'retail', deal: 'rent', locality: 'Whitefield', name: 'Hope Farm High Street (sample)', carpet: 650, sba: 850, rate: 125, delta: 0, frontage: 18, kva: 15, car: 0, parking: 'Shared visitor parking', lockIn: 24, dep: 6, cam: 15, cond: 'bare', zoning: 'Commercial (sample)', oc: 'OC received', suit: ['Retail', 'Clinic', 'Bank / ATM'], floor: 'Ground', footfall: 7, truth: [7, 7, 8, 9, 9], amen: ['Main-road frontage', 'Glass shopfront', 'Signage space', 'Washroom'], blurb: 'Ground-floor shop on a busy junction near Hope Farm.' },
  { type: 'retail', deal: 'rent', locality: 'Koramangala', name: '80 Ft Road Shopfront (sample)', carpet: 900, sba: 1100, rate: 210, delta: 12, frontage: 22, kva: 20, car: 2, parking: '2 car (front)', lockIn: 36, dep: 10, cam: 20, cond: 'warm', zoning: 'Commercial (sample)', oc: 'OC received', suit: ['Retail', 'F&B'], floor: 'Ground', footfall: 9, truth: [8, 5, 8, 9, 9], amen: ['Corner visibility', 'Signage space', 'Shutter + glass front', 'Washroom'], blurb: 'High-street retail on 80 Feet Road with strong evening footfall.' },
  { type: 'office', deal: 'rent', locality: 'Koramangala', name: 'Sample Startup Floor, 5th Block', carpet: 3000, sba: 3800, rate: 110, delta: 0, seats: 50, kva: 50, car: 4, parking: '4 car + 20 two-wheeler', lockIn: 24, dep: 6, cam: 14, cond: 'furnished', zoning: 'Commercial (sample)', oc: 'OC received', suit: ['IT / office'], floor: '2 of 4', truth: [8, 5, 7, 9, 9], amen: ['Workstations (50)', 'Cabins (3)', 'Conference room', 'Pantry', 'DG backup', 'Central AC'], blurb: 'Furnished floor for a 40–50 person startup in the 5th Block café district.', ownerDoc: true },
  { type: 'fnb', deal: 'rent', locality: 'Indiranagar', name: '100 Ft Road Corner F&B Space (sample)', coord: [12.9719, 77.6412], carpet: 2200, sba: 2600, rate: 260, delta: 8, frontage: 30, kva: 60, car: 4, parking: 'Valet bay + 4 car', lockIn: 36, dep: 10, cam: 22, cond: 'warm', zoning: 'Commercial (sample). Trade, FSSAI and excise licences are the tenant’s responsibility', oc: 'OC received', suit: ['F&B', 'Retail'], floor: 'Ground + 1', footfall: 9, truth: [8, 7, 8, 9, 9], amen: ['Gas bank provision', 'Exhaust shaft', 'Grease trap', 'Terrace seating', 'Signage space'], blurb: 'Corner unit on 100 Feet Road with a kitchen exhaust shaft and terrace, ready for a restaurant fit-out.' },
  { type: 'showroom', deal: 'rent', locality: 'Indiranagar', name: '100 Ft Road Showroom (sample)', coord: [12.9662, 77.6408], carpet: 3500, sba: 4200, rate: 240, delta: -3, frontage: 40, kva: 75, car: 6, parking: '6 car (front + basement)', lockIn: 60, dep: 10, cam: 18, cond: 'bare', zoning: 'Commercial (sample)', oc: 'OC received', suit: ['Showroom', 'Retail'], floor: 'Ground + 1', footfall: 8, truth: [8, 7, 8, 9, 9], amen: ['Double-height glass facade', '40 ft frontage', 'Goods lift', 'Signage rights'], blurb: 'Large-format showroom with a 40 ft glass frontage on 100 Feet Road.' },
  { type: 'office', deal: 'rent', locality: 'MG Road', name: 'Demo Heritage Business Centre, MG Road', carpet: 4500, sba: 6000, rate: 150, delta: 4, seats: 70, kva: 80, car: 6, parking: '6 car (basement)', lockIn: 36, dep: 6, cam: 25, cond: 'warm', zoning: 'Commercial (sample)', oc: 'OC received', suit: ['IT / office', 'Clinic', 'Bank / ATM'], floor: '7 of 10', truth: [9, 8, 7, 9, 9], amen: ['Metro at doorstep', 'DG backup 100%', 'Fire NOC', 'Concierge', 'Central AC'], blurb: 'Central business district office close to the MG Road metro station.' },
  { type: 'retail', deal: 'buy', locality: 'MG Road', name: 'Sample Arcade, MG Road', carpet: 420, sba: 600, rate: 28000, delta: 10, frontage: 12, kva: 10, car: 0, parking: 'Paid public parking nearby', cam: 30, cond: 'bare', zoning: 'Commercial (sample)', oc: 'OC received', suit: ['Retail', 'Bank / ATM'], floor: 'Ground', footfall: 8, truth: [8, 8, 6, 9, 9], amen: ['Arcade frontage', 'Shutter', 'Common washrooms'], blurb: 'Small strata shop in a CBD arcade, suited to an owner-operator or an investor.' },
  { type: 'office', deal: 'rent', locality: 'Hebbal', name: 'Sample Lakeside Offices, Hebbal', carpet: 9000, sba: 12500, rate: 88, delta: -6, seats: 150, kva: 200, car: 15, parking: '15 car + 50 two-wheeler', lockIn: 36, dep: 6, cam: 17, cond: 'bare', zoning: 'Commercial (sample)', oc: 'OC received', suit: ['IT / office'], floor: '4 of 7', truth: [9, 6, 8, 9, 9], amen: ['DG backup 100%', 'Fire NOC', 'Cafeteria', 'Airport road access', 'EV charging'], blurb: 'North Bengaluru office close to the airport road and the Nagawara tech corridor.' },
  { type: 'comm-land', deal: 'buy', locality: 'Hebbal', name: 'Bellary Road Commercial Plot (sample)', sba: 21780, rate: 11000, delta: 5, frontage: 80, car: 0, parking: 'Open plot', cam: 0, zoning: 'Converted for commercial use (sample conversion order)', oc: 'Not applicable (land)', suit: ['Showroom', 'Retail', 'IT / office'], floor: 'Plot · 0.5 acre', truth: [6, 6, 9, 8, 7], amen: ['80 ft road frontage', 'Corner plot', 'Compound wall', 'Water & power at boundary'], blurb: 'Half-acre plot on the airport corridor service road, converted for commercial use (sample).', kind: 'owner' },
  { type: 'office', deal: 'rent', locality: 'Electronic City', name: 'Demo Tech Enclave Ph 1', carpet: 25000, sba: 34000, rate: 52, delta: -2, seats: 380, kva: 500, car: 40, parking: '40 car + 150 two-wheeler', lockIn: 36, dep: 6, cam: 12, cond: 'warm', zoning: 'Commercial (sample)', oc: 'OC received', suit: ['IT / office'], floor: '1–2 of 6', truth: [9, 7, 8, 9, 9], amen: ['DG backup 100%', 'Fire NOC', 'Food court', 'Elevated expressway access', 'Crèche'], blurb: 'Two warm-shell floors near the Electronic City expressway exit, suited to a large delivery centre.' },
  { type: 'warehouse', deal: 'rent', locality: 'Electronic City', name: 'Neeladri Road Godown (sample)', sba: 12000, carpet: 11500, rate: 28, delta: 4, kva: 50, car: 2, parking: 'Truck turning yard + 2 car', lockIn: 24, dep: 6, cam: 2, cond: 'ready', zoning: 'Industrial / warehousing (sample)', oc: 'OC received', suit: ['Warehouse'], floor: 'Ground · 24 ft clear height', truth: [7, 6, 7, 8, 8], amen: ['24 ft clear height', '2 loading docks', 'Fire hydrants', 'Security cabin'], blurb: 'City-edge godown for last-mile e-commerce or FMCG distribution.' },
  { type: 'industrial', deal: 'rent', locality: 'Peenya', name: 'Peenya 2nd Stage Industrial Shed (sample)', sba: 15000, carpet: 14200, rate: 24, delta: 2, kva: 250, car: 6, parking: '6 car + truck bay', lockIn: 36, dep: 6, cam: 1.5, cond: 'ready', zoning: 'Industrial (KIADB-style estate, sample)', oc: 'CC received, OC pending', suit: ['Manufacturing', 'Warehouse'], floor: 'Ground · 30 ft clear height', truth: [8, 7, 7, 9, 6], amen: ['250 kVA sanctioned load', '5 T EOT crane provision', 'Three-phase supply', 'Effluent drain'], blurb: 'Fabrication-ready shed in Peenya Industrial Area with heavy power sanctioned.' },
  { type: 'warehouse', deal: 'rent', locality: 'Hoskote', name: 'NH-75 Logistics Park Bay (sample)', sba: 60000, carpet: 58000, rate: 21, delta: -5, kva: 100, car: 10, parking: 'Trailer yard (8) + 10 car', lockIn: 60, dep: 6, cam: 2.5, cond: 'ready', zoning: 'Industrial / warehousing, converted (sample)', oc: 'OC received', suit: ['Warehouse'], floor: 'Ground · 36 ft clear height', truth: [8, 8, 9, 9, 9], amen: ['Grade-A PEB structure', '6 dock levellers', 'FM2 floor', 'Sprinklers', '24x7 security'], blurb: 'Grade-A warehouse bay on the Old Madras Road highway corridor.' },
  { type: 'industrial', deal: 'buy', locality: 'Bommasandra', name: 'Bommasandra Industrial Area Shed (sample)', sba: 10000, carpet: 9500, rate: 5500, delta: 0, kva: 150, car: 6, parking: '6 car + loading bay', cam: 1, cond: 'ready', zoning: 'Industrial (KIADB-style estate, sample)', oc: 'OC received', suit: ['Manufacturing', 'Warehouse'], floor: 'Ground + mezzanine', truth: [8, 7, 8, 9, 9], amen: ['150 kVA sanctioned load', 'Office mezzanine', 'Borewell', 'Compound wall'], blurb: 'Freehold-style industrial unit off Hosur Road, near the Electronic City cluster (sample).' },
  { type: 'office', deal: 'rent', locality: 'HSR Layout', name: 'Sample 27th Main Office Floor', carpet: 2600, sba: 3200, rate: 105, delta: 15, seats: 45, kva: 40, car: 3, parking: '3 car + 15 two-wheeler', lockIn: 12, dep: 6, cam: 12, cond: 'furnished', zoning: 'Commercial (sample)', oc: 'OC received', suit: ['IT / office', 'Clinic'], floor: '3 of 4', truth: [8, 5, 6, 8, 8], amen: ['Workstations (45)', 'Cabins (2)', 'Pantry', 'DG backup', 'Lift'], blurb: 'Furnished office on 27th Main for a small product or design team.' },
  { type: 'retail', deal: 'rent', locality: 'HSR Layout', name: 'Sector 1 Clinic / Retail Space (sample)', carpet: 1200, sba: 1450, rate: 140, delta: -8, frontage: 20, kva: 20, car: 2, parking: '2 car', lockIn: 24, dep: 6, cam: 10, cond: 'ready', zoning: 'Mixed use. Commercial conversion applied, pending (sample)', zoningOk: false, oc: 'OC pending', suit: ['Clinic', 'Retail'], floor: '1 of 3', footfall: 6, truth: [7, 6, 7, 4, 4], amen: ['Lift', 'Ramp access', 'Washrooms (2)', 'Signage space'], blurb: 'First-floor unit on a sector road, fitted out earlier as a dental clinic.' },
  // residential plots / land (buy)
  { type: 'res-plot', deal: 'buy', locality: 'Yelahanka', name: 'Sample BDA-approved layout plot', sba: 2400, rate: 7800, delta: 4, frontage: 40, car: 0, parking: 'Plot (40 × 60 ft)', cam: 0, zoning: 'Residential, approved layout (sample)', oc: 'Not applicable (land)', suit: [], floor: 'Plot · 40 × 60 ft', truth: [7, 8, 8, 9, 7], amen: ['East-facing', '30 ft road', 'Underground drainage', 'Cauvery line in layout'], blurb: 'Approved-layout plot near Yelahanka New Town, ready to build.' },
  { type: 'res-plot', deal: 'buy', locality: 'Sarjapur Road', name: 'Demo Gated Plotted Development', sba: 1500, rate: 6500, delta: -3, frontage: 30, car: 0, parking: 'Plot (30 × 50 ft)', cam: 3, zoning: 'Residential, approved layout (sample)', oc: 'Not applicable (land)', suit: [], floor: 'Plot · 30 × 50 ft', truth: [7, 5, 7, 8, 7], amen: ['Gated layout', 'Clubhouse', 'Underground cabling', 'STP'], blurb: 'Plot in a gated plotted development off Sarjapur Road (sample).', kind: 'builder' },
  { type: 'res-plot', deal: 'buy', locality: 'Hoskote', name: 'Hoskote Plotted Layout (sample)', sba: 1200, rate: 3200, delta: 9, frontage: 30, car: 0, parking: 'Plot (30 × 40 ft)', cam: 0, zoning: 'Residential, conversion done (sample). Verify layout approval', oc: 'Not applicable (land)', suit: [], floor: 'Plot · 30 × 40 ft', truth: [6, 8, 6, 6, 7], amen: ['30 ft road', 'Street lights', 'Near NH-75'], blurb: 'Affordable plot in a growing layout off Old Madras Road.', verified: false },
];

function rng(seed: number) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
const r = rng(7);

export const COMMERCIAL_LISTINGS: Listing[] = SEEDS.map((s, i) => {
  const area = AREAS.find((a) => a.name === s.locality)!;
  const meta = PROPERTY_TYPES[s.type];
  const trueRate = s.rate;
  const ask = s.deal === 'rent' ? Math.round(trueRate * (1 + s.delta / 100) * 2) / 2 : Math.round((trueRate * (1 + s.delta / 100)) / 50) * 50;
  const round = s.deal === 'rent' ? 1000 : 100000;
  const price = Math.round((ask * s.sba) / round) * round;
  const truePrice = Math.round((trueRate * s.sba) / round) * round;
  const verified = s.verified ?? true;
  const kind = s.kind ?? 'owner';
  const [power, flooding, access, zoning, occc] = s.truth;
  const isPlot = !!meta.land;
  const coord: [number, number] = s.coord ?? [area.coord[0] + (r() - 0.5) * 0.02, area.coord[1] + (r() - 0.5) * 0.02];
  const space: SpaceInfo = {
    carpetSqft: s.carpet, superBuiltUpSqft: s.sba, ratePsf: ask, trueRatePsf: trueRate, seats: s.seats, frontageFt: s.frontage, powerKva: s.kva,
    carParking: s.car, parkingNote: s.parking, lockInMonths: s.lockIn, depositMonths: s.dep, camPsf: s.cam, escalationPct: s.deal === 'rent' ? 5 : undefined,
    condition: s.cond, zoning: s.zoning, zoningOk: s.zoningOk ?? true, ocStatus: s.oc, suitableFor: s.suit, footfall: s.footfall,
    truth: { power, flooding, access, zoning, occc },
  };
  const dealWord = s.deal === 'rent' ? 'for lease' : 'for sale';
  return {
    id: `blr-${meta.segment === 'commercial' ? 'c' : 'p'}${String(i + 1).padStart(2, '0')}`,
    title: `${meta.label} in ${s.name}`,
    deal: s.deal,
    segment: meta.segment,
    propertyType: s.type,
    space,
    kind,
    society: s.name,
    builder: kind === 'builder' ? 'Sample Developers E' : undefined,
    locality: s.locality,
    coord,
    bhk: 0,
    areaSqft: s.sba,
    price,
    truePrice,
    deposit: s.deal === 'rent' && s.dep ? price * s.dep : undefined,
    maintenance: Math.round(s.cam * s.sba),
    furnishing: s.cond === 'furnished' ? 'full' : s.cond === 'warm' || s.cond === 'ready' ? 'semi' : 'unfurnished',
    tenantType: 'any',
    pets: false,
    verified,
    verification: verified
      ? { otp: true, video: true, geotag: true, ownerDoc: !!s.ownerDoc || (kind === 'owner' && i % 3 === 0), verifiedOn: `${2 + (i % 25)} Oct 2026` }
      : { otp: true, video: false, geotag: false, ownerDoc: false },
    depositSafe: false,
    floor: s.floor,
    facing: ['East', 'North', 'North-East', 'West'][i % 4],
    ageYears: isPlot ? 0 : 3 + (i % 9),
    amenities: s.amen,
    risk: { water: 6, flooding, power, khata: zoning },
    khataType: zoning >= 8 ? 'e-Khata A' : 'e-Khata B',
    tankerPerMonth: 0,
    titleFlags: space.zoningOk ? (occc < 7 ? ['Occupancy certificate pending (sample)'] : []) : ['Commercial conversion pending (sample)', 'Occupancy certificate pending (sample)'],
    reviews: [],
    postedDaysAgo: 1 + ((i * 5) % 18),
    hue: (i * 53 + 20) % 360,
    description: `Sample ${kind === 'builder' ? 'developer' : 'owner'} listing: ${meta.label.toLowerCase()} ${dealWord} in ${s.name}, ${s.locality}. ${s.blurb} ${isPlot ? `Plot area ${s.sba.toLocaleString('en-IN')} sq ft.` : `Carpet ${s.carpet?.toLocaleString('en-IN')} sq ft, super built-up ${s.sba.toLocaleString('en-IN')} sq ft.`}${s.deal === 'rent' && s.lockIn ? ` Lock-in ${s.lockIn} months, ${s.dep} months’ deposit, 5% yearly escalation.` : ''} All details are fictional sample data.`,
  } satisfies Listing;
});

/* ---------- helpers ---------- */
export const typeMeta = (l: Pick<Listing, 'propertyType'>) => PROPERTY_TYPES[l.propertyType];
export const isSpace = (l: Listing) => !!l.space;
export function dealLabel(l: Pick<Listing, 'deal' | 'segment'>) {
  return l.deal === 'buy' ? 'For sale' : l.segment === 'commercial' ? 'For lease' : 'For rent';
}
/** Short configuration label, e.g. "2 BHK" or "Office space · 50 seats". */
export function configLabel(l: Listing) {
  if (!l.space) return `${l.bhk} BHK`;
  const m = typeMeta(l);
  return m.seats && l.space.seats ? `${m.label} · ${l.space.seats} seats` : m.label;
}
export function psfLabel(l: Listing) {
  if (!l.space) return `₹${Math.round(l.price / l.areaSqft).toLocaleString('en-IN')}/sqft`;
  return l.deal === 'rent' ? `₹${l.space.ratePsf}/sqft/mo` : `₹${l.space.ratePsf.toLocaleString('en-IN')}/sqft`;
}

/** Sample ₹/sqft estimate for the post-property price check (tier-based, not market data). */
const TIER_OFFICE_LEASE: Record<number, number> = { 1: 130, 2: 95, 3: 70, 4: 50 };
const TYPE_FACTOR: Partial<Record<PropertyType, number>> = { office: 1, coworking: 1.05, retail: 1.7, showroom: 1.6, fnb: 1.8 };
export function commercialRate(type: PropertyType, tier: 1 | 2 | 3 | 4, deal: 'rent' | 'buy', resBuyPsf: number) {
  if (type === 'res-plot') return resBuyPsf * 0.9;
  if (type === 'comm-land') return { 1: 22000, 2: 12000, 3: 6500, 4: 3000 }[tier]!;
  if (type === 'warehouse' || type === 'industrial') return deal === 'rent' ? { 1: 32, 2: 30, 3: 26, 4: 23 }[tier]! : { 1: 8000, 2: 7000, 3: 6000, 4: 5000 }[tier]!;
  const lease = TIER_OFFICE_LEASE[tier] * (TYPE_FACTOR[type] ?? 1);
  return deal === 'rent' ? lease : lease * 125; // ~9.6% gross yield assumption (sample)
}
