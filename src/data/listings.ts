import { LOCALITIES, LocalityName, localityByName } from './geo';

export type Deal = 'buy' | 'rent';
export type Furnishing = 'unfurnished' | 'semi' | 'full';
export type TenantType = 'family' | 'bachelor' | 'any';

export interface Review { name: string; rating: number; text: string; tenure: string }

export interface Listing {
  id: string;
  title: string;
  deal: Deal;
  kind: 'owner' | 'builder';
  society: string;
  builder?: string;
  locality: LocalityName;
  coord: [number, number];
  bhk: number;
  areaSqft: number;
  price: number; // asking: ₹ total (buy) or ₹/month (rent)
  truePrice: number; // sample model estimate
  deposit?: number;
  maintenance: number;
  furnishing: Furnishing;
  tenantType: TenantType;
  pets: boolean;
  verified: boolean;
  /** Pakka Proof tiers. T1 (required to list): phone OTP + live in-app video with GPS.
   *  T2 (optional "Verified Owner"): tax receipt OR electricity bill, name-matched, kept private.
   *  T3 (deal stage only): document check — by partner lawyers for sales. */
  verification: { otp: boolean; video: boolean; geotag: boolean; ownerDoc: boolean; verifiedOn?: string };
  /** Owner has opted in to Deposit Safe (optional; rentals only). */
  depositSafe: boolean;
  floor: string;
  facing: string;
  ageYears: number;
  possession?: string;
  rera?: string;
  amenities: string[];
  risk: { water: number; flooding: number; power: number; khata: number; rera?: number };
  khataType: 'e-Khata A' | 'e-Khata B' | 'A-Khata' | 'B-Khata';
  tankerPerMonth: number; // sample: water tanker deliveries in peak summer
  titleFlags: string[]; // sample legal/title observations
  reraDelayMonths?: number;
  reviews: Review[];
  postedDaysAgo: number;
  hue: number;
  description: string;
}

// tiny deterministic PRNG so the sample data is stable between builds
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

type Seed = [
  LocalityName, Deal, 'owner' | 'builder', number /*bhk*/, number /*sqft*/, Furnishing, TenantType, boolean /*pets*/,
  boolean /*verified*/, number /*ask delta %*/, string /*society*/, string? /*builder*/, string? /*possession*/,
];

const SEEDS: Seed[] = [
  ['Whitefield', 'rent', 'owner', 2, 1150, 'semi', 'family', true, true, -4, 'Ramagondanahalli Garden Flats'],
  ['Whitefield', 'rent', 'owner', 3, 1650, 'full', 'any', false, true, 12, 'Kundalahalli Gate Residency'],
  ['Whitefield', 'buy', 'builder', 3, 1720, 'unfurnished', 'any', true, true, 3, 'Demo Grove Whitefield', 'Sample Developers A', 'Dec 2027'],
  ['Whitefield', 'buy', 'owner', 2, 1240, 'semi', 'any', false, false, 18, 'Hope Farm Lane Homes'],
  ['Sarjapur Road', 'rent', 'owner', 2, 1210, 'semi', 'bachelor', true, true, 2, 'Kaikondrahalli Lake View'],
  ['Sarjapur Road', 'buy', 'builder', 2, 1180, 'unfurnished', 'any', true, true, -6, 'Demo Skyline Sarjapur', 'Sample Developers B', 'Jun 2027'],
  ['Sarjapur Road', 'buy', 'builder', 4, 2650, 'unfurnished', 'any', true, true, 8, 'Demo Banyan Court', 'Sample Developers C', 'Mar 2028'],
  ['Sarjapur Road', 'rent', 'owner', 3, 1580, 'full', 'family', false, true, -2, 'Dodsworth Layout Homes'],
  ['HSR Layout', 'rent', 'owner', 1, 650, 'full', 'bachelor', true, true, 5, 'Sector 2 Independent Floor'],
  ['HSR Layout', 'rent', 'owner', 2, 1100, 'semi', 'any', true, true, 0, '27th Main Residency'],
  ['HSR Layout', 'buy', 'owner', 3, 1600, 'semi', 'any', false, true, -9, 'Agara Lake Apartments'],
  ['HSR Layout', 'rent', 'owner', 3, 1750, 'full', 'family', false, false, 22, 'Sector 7 Villament'],
  ['Koramangala', 'rent', 'owner', 2, 1200, 'full', 'any', true, true, 6, '5th Block Garden Homes'],
  ['Koramangala', 'buy', 'owner', 3, 1850, 'semi', 'family', false, true, 4, '6th Block Corner House'],
  ['Koramangala', 'rent', 'owner', 1, 600, 'full', 'bachelor', true, true, -3, '8th Block Studio Suites'],
  ['Koramangala', 'buy', 'builder', 4, 3100, 'unfurnished', 'any', true, true, 11, 'Demo Signature Koramangala', 'Sample Developers A', 'Ready to move'],
  ['Electronic City', 'rent', 'owner', 2, 1050, 'semi', 'bachelor', true, true, -5, 'Neeladri Nagar Corner Flats'],
  ['Electronic City', 'buy', 'builder', 2, 1090, 'unfurnished', 'any', true, true, -2, 'Demo Meadows E-City Ph 2', 'Sample Developers B', 'Sep 2026 (delayed)'],
  ['Electronic City', 'buy', 'owner', 3, 1450, 'semi', 'any', false, true, 1, 'Hosa Road Residency'],
  ['Electronic City', 'rent', 'owner', 1, 580, 'unfurnished', 'any', true, false, 9, 'Doddathogur PG-style Flat'],
  ['Hebbal', 'rent', 'owner', 3, 1700, 'semi', 'family', false, true, 3, 'Hebbal Lake Road Flats'],
  ['Hebbal', 'buy', 'builder', 3, 1900, 'unfurnished', 'any', true, true, -4, 'Demo Lake Towers Hebbal', 'Sample Developers D', 'Dec 2026'],
  ['Hebbal', 'buy', 'builder', 2, 1250, 'unfurnished', 'any', true, true, 14, 'Demo Central Kempapura', 'Sample Developers C', 'Jan 2028'],
  ['Indiranagar', 'rent', 'owner', 2, 1150, 'full', 'any', true, true, 2, '12th Main Residences'],
  ['Indiranagar', 'buy', 'owner', 3, 1800, 'semi', 'family', false, true, -7, 'HAL 2nd Stage Villa Floor'],
  ['Indiranagar', 'rent', 'owner', 3, 1900, 'full', 'family', true, true, 15, 'Defence Colony Bungalow Floor'],
  ['Yelahanka', 'buy', 'builder', 3, 1680, 'unfurnished', 'any', true, true, -3, 'Demo Greens Yelahanka', 'Sample Developers D', 'Ready to move'],
  ['Yelahanka', 'rent', 'owner', 2, 1150, 'semi', 'family', true, true, -8, 'New Town Residency'],
  ['Yelahanka', 'buy', 'owner', 2, 1100, 'unfurnished', 'any', false, false, 6, 'Jakkur Plantation Homes'],
  ['Whitefield', 'rent', 'owner', 1, 700, 'full', 'bachelor', true, true, 1, 'Kundalahalli Studio Lofts'],
];

const FACINGS = ['East', 'North', 'North-East', 'West', 'South-East'];
const AMENITIES = ['24x7 Security', 'Power backup', 'Lift', 'Covered parking', 'Gym', 'Swimming pool', 'Clubhouse', 'Kids play area', 'Borewell + Cauvery', 'Rainwater harvesting', 'EV charging', 'Jogging track', 'Gas pipeline', 'Intercom'];
const REVIEWERS = ['Ananya R.', 'Karthik S.', 'Priya N.', 'Rahul M.', 'Deepa K.', 'Vikram P.', 'Sneha I.', 'Arjun B.', 'Meera G.', 'Suresh H.'];
const REVIEW_TEXT = [
  ['Very peaceful society, the association actually responds on WhatsApp.', 'Water tanker needed 2–3 times in peak summer, otherwise fine.'],
  ['Security is tight and the guards are courteous.', 'Traffic on the main road during peak hours is brutal.'],
  ['Great community for kids, lots of weekend events.', 'Maintenance charges went up last year without much notice.'],
  ['Power backup covers the full flat, no complaints.', 'Parking for guests is limited.'],
  ['Close to everything — groceries, hospitals, metro.', 'Some construction noise from the neighbouring plot.'],
];

// 7 of 16 (~44%) sample rentals have opted in to (optional) Deposit Safe
const DEPOSIT_SAFE_IDX = new Set([0, 4, 8, 12, 16, 20, 23]);

const r = rng(42);
const jitter = (n: number) => (r() - 0.5) * n;

export const LISTINGS: Listing[] = SEEDS.map((s, i) => {
  const [locality, deal, kind, bhk, areaSqft, furnishing, tenantType, pets, verified, delta, society, builder, possession] = s;
  const loc = localityByName(locality);
  const furnAdj = furnishing === 'full' ? 1.12 : furnishing === 'semi' ? 1.04 : 1;
  const base = deal === 'buy' ? loc.buyPerSqft * areaSqft * (kind === 'builder' ? 1.05 : 0.97) : loc.rentPerSqft * areaSqft * furnAdj;
  const round = deal === 'buy' ? 100000 : 500;
  const truePrice = Math.round(base / round) * round;
  const price = Math.round((truePrice * (1 + delta / 100)) / round) * round;
  const ageYears = kind === 'builder' ? 0 : Math.floor(2 + r() * 14);
  const amen = AMENITIES.filter(() => r() > 0.45).slice(0, 8);
  const clamp = (n: number) => Math.max(1, Math.min(10, Math.round(n)));
  const risk = {
    water: clamp(loc.risk.water + jitter(3)),
    flooding: clamp(loc.risk.flooding + jitter(3)),
    power: clamp(loc.risk.power + jitter(2)),
    khata: clamp(kind === 'builder' ? 8 + jitter(2) : loc.risk.khata + jitter(3)),
    ...(kind === 'builder' ? { rera: clamp(possession?.includes('delayed') ? 4 : 8 + jitter(2)) } : {}),
  };
  const rt = REVIEW_TEXT[i % REVIEW_TEXT.length];
  const reviews: Review[] = [0, 1, 2].slice(0, 2 + (i % 2)).map((k) => ({
    name: REVIEWERS[(i + k * 3) % REVIEWERS.length],
    rating: Math.min(5, Math.max(3, Math.round(3.6 + r() * 1.6))),
    text: rt[k % 2] + (k === 2 ? ' Overall a good place to live.' : ''),
    tenure: k === 0 ? 'Resident · 3 yrs' : k === 1 ? 'Tenant · 1 yr' : 'Owner · 6 yrs',
  }));
  const kindLabel = kind === 'builder' ? 'new launch' : 'owner listing';
  const id = `blr-${String(i + 1).padStart(3, '0')}`;
  const title = `${bhk} BHK ${kind === 'builder' ? 'Apartment' : areaSqft > 1700 ? 'Spacious Home' : 'Flat'} in ${society}`;
  return {
    id,
    title,
    deal,
    kind,
    society,
    builder,
    locality,
    coord: [loc.center[0] + jitter(0.03), loc.center[1] + jitter(0.03)],
    bhk,
    areaSqft,
    price,
    truePrice,
    deposit: deal === 'rent' ? price * (r() > 0.5 ? 6 : 5) : undefined,
    maintenance: Math.round((areaSqft * (kind === 'builder' ? 4 : 3)) / 100) * 100,
    furnishing,
    tenantType,
    pets,
    verified,
    verification: verified
      ? { otp: true, video: true, geotag: true, ownerDoc: kind === 'owner' && r() > 0.35, verifiedOn: `${1 + (i % 27)} Oct 2026` }
      : { otp: true, video: false, geotag: false, ownerDoc: false },
    depositSafe: deal === 'rent' && DEPOSIT_SAFE_IDX.has(i),
    floor: kind === 'builder' ? `${4 + (i % 14)} of 22` : `${1 + (i % 4)} of ${3 + (i % 5)}`,
    facing: FACINGS[i % FACINGS.length],
    ageYears,
    possession,
    rera: kind === 'builder' ? `SAMPLE-PRM/KA/RERA/1251/${300 + i}/PR/${String(200000 + i * 731).slice(0, 6)}/00${i % 9}` : undefined,
    amenities: amen.length ? amen : AMENITIES.slice(0, 4),
    risk,
    khataType: risk.khata >= 8 ? (i % 2 ? 'e-Khata A' : 'A-Khata') : risk.khata >= 6 ? 'e-Khata A' : (i % 2 ? 'e-Khata B' : 'B-Khata'),
    tankerPerMonth: Math.max(0, Math.round((10 - risk.water) * 1.6)),
    titleFlags: risk.khata >= 7 ? [] : risk.khata >= 5 ? ['Encumbrance certificate older than 12 months'] : ['B-Khata: limited loan eligibility', 'Pending conversion order (sample)'],
    reraDelayMonths: kind === 'builder' ? (possession?.includes('delayed') ? 33 : risk.rera && risk.rera < 7 ? 6 : 0) : undefined,
    reviews,
    postedDaysAgo: 1 + ((i * 7) % 20),
    hue: (i * 47) % 360,
    description: `Sample ${kindLabel}: a ${furnishing === 'full' ? 'fully furnished' : furnishing === 'semi' ? 'semi-furnished' : 'bare-shell'} ${bhk} BHK of ${areaSqft.toLocaleString('en-IN')} sqft in ${society}, ${locality}. ${loc.blurb} ${deal === 'rent' ? `Preferred tenants: ${tenantType === 'any' ? 'families or working professionals' : tenantType === 'family' ? 'families' : 'bachelors / working professionals'}.${pets ? ' Pet-friendly.' : ''}` : kind === 'builder' ? `Possession: ${possession}. RERA registered.` : 'Title documents shared with Pakka (sample).'}`,
  };
});

export const getListing = (id: string) => LISTINGS.find((l) => l.id === id);
export { LOCALITIES };
