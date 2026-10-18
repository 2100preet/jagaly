export type LocalityName =
  | 'Whitefield' | 'Sarjapur Road' | 'HSR Layout' | 'Koramangala'
  | 'Electronic City' | 'Hebbal' | 'Indiranagar' | 'Yelahanka';

export interface LocalityInfo {
  name: LocalityName;
  center: [number, number];
  buyPerSqft: number; // sample market rate ₹/sqft
  rentPerSqft: number; // sample ₹/sqft/month
  blurb: string;
  risk: { water: number; flooding: number; power: number; khata: number }; // 0-10, higher = safer (sample)
}

export const LOCALITIES: LocalityInfo[] = [
  { name: 'Whitefield', center: [12.9698, 77.75], buyPerSqft: 8600, rentPerSqft: 32, blurb: 'IT corridor around ITPL with metro Purple Line access.', risk: { water: 5, flooding: 7, power: 7, khata: 6 } },
  { name: 'Sarjapur Road', center: [12.9105, 77.6855], buyPerSqft: 8100, rentPerSqft: 30, blurb: 'Fast-growing gated-community belt near the Outer Ring Road tech corridor.', risk: { water: 4, flooding: 4, power: 6, khata: 5 } },
  { name: 'HSR Layout', center: [12.9116, 77.6474], buyPerSqft: 12800, rentPerSqft: 42, blurb: 'Planned BDA layout, startup hub, great food and parks.', risk: { water: 6, flooding: 5, power: 8, khata: 9 } },
  { name: 'Koramangala', center: [12.9352, 77.6245], buyPerSqft: 15200, rentPerSqft: 48, blurb: 'Premium central neighbourhood with cafés and offices.', risk: { water: 7, flooding: 5, power: 8, khata: 9 } },
  { name: 'Electronic City', center: [12.8452, 77.6602], buyPerSqft: 5900, rentPerSqft: 22, blurb: 'Affordable homes next to Infosys, Wipro and the elevated expressway.', risk: { water: 5, flooding: 7, power: 7, khata: 6 } },
  { name: 'Hebbal', center: [13.0358, 77.597], buyPerSqft: 11200, rentPerSqft: 36, blurb: 'North Bangalore gateway, close to the Nagawara tech corridor and the airport road.', risk: { water: 7, flooding: 6, power: 8, khata: 8 } },
  { name: 'Indiranagar', center: [12.9784, 77.6408], buyPerSqft: 17500, rentPerSqft: 55, blurb: 'Leafy, upscale and on the metro. 100 Ft Road nightlife.', risk: { water: 7, flooding: 7, power: 8, khata: 9 } },
  { name: 'Yelahanka', center: [13.1007, 77.5963], buyPerSqft: 7300, rentPerSqft: 26, blurb: 'Calm, green and airport-adjacent with large plots.', risk: { water: 6, flooding: 8, power: 7, khata: 7 } },
];

// Commute destinations: neutral area labels, approximate coordinates.
export const TECH_PARKS: { name: string; short: string; coord: [number, number] }[] = [
  { name: 'Nagawara tech corridor (ORR North)', short: 'Nagawara', coord: [13.0475, 77.6206] },
  { name: 'ITPL Whitefield', short: 'ITPL', coord: [12.9866, 77.7366] },
  { name: 'ORR tech corridor (Devarabisanahalli)', short: 'ORR', coord: [12.9328, 77.695] },
  { name: 'Electronic City Ph 1', short: 'E-City', coord: [12.8456, 77.6603] },
  { name: 'CV Raman Nagar tech hub', short: 'CV Raman Ngr', coord: [12.9817, 77.6627] },
];

export const localityByName = (n: string) => LOCALITIES.find((l) => l.name === n)!;

/* ------------------------------------------------------------------ */
/* Locality directory for search / typeahead.                          */
/* Coordinates are APPROXIMATE neighbourhood centres (for map centering */
/* and rough commute estimates only). Rates are sample tier estimates.  */
/* ------------------------------------------------------------------ */
export interface Area {
  name: string;
  coord: [number, number]; // approximate
  zone: 'Central' | 'East' | 'South' | 'North' | 'West' | 'South-East' | 'North-East';
  tier: 1 | 2 | 3 | 4; // 1 = premium … 4 = affordable (sample)
  aliases?: string[];
}

// prettier-ignore
export const AREAS: Area[] = [
  // Central
  { name: 'MG Road', coord: [12.9756, 77.6066], zone: 'Central', tier: 1, aliases: ['Mahatma Gandhi Road'] },
  { name: 'Richmond Town', coord: [12.9622, 77.6006], zone: 'Central', tier: 1 },
  { name: 'Langford Town', coord: [12.9568, 77.6046], zone: 'Central', tier: 1 },
  { name: 'Shanti Nagar', coord: [12.9567, 77.5966], zone: 'Central', tier: 2 },
  { name: 'Ulsoor', coord: [12.9817, 77.6194], zone: 'Central', tier: 1, aliases: ['Halasuru'] },
  { name: 'Frazer Town', coord: [12.9986, 77.6136], zone: 'Central', tier: 2, aliases: ['Pulikeshi Nagar'] },
  { name: 'Cox Town', coord: [12.9969, 77.6214], zone: 'Central', tier: 2 },
  { name: 'Benson Town', coord: [13.0045, 77.6033], zone: 'Central', tier: 1 },
  { name: 'Cooke Town', coord: [13.0016, 77.6283], zone: 'Central', tier: 2 },
  { name: 'Shivaji Nagar', coord: [12.9857, 77.6057], zone: 'Central', tier: 2 },
  { name: 'Vasanth Nagar', coord: [12.9895, 77.5948], zone: 'Central', tier: 1 },
  { name: 'Sadashiva Nagar', coord: [13.0068, 77.5813], zone: 'Central', tier: 1 },
  { name: 'Seshadripuram', coord: [12.9893, 77.5722], zone: 'Central', tier: 2 },
  { name: 'Malleshwaram', coord: [13.0035, 77.5709], zone: 'Central', tier: 1, aliases: ['Malleswaram'] },
  { name: 'Wilson Garden', coord: [12.9488, 77.5968], zone: 'Central', tier: 2 },
  { name: 'Domlur', coord: [12.9609, 77.6387], zone: 'Central', tier: 1 },
  // East
  { name: 'Indiranagar', coord: [12.9784, 77.6408], zone: 'East', tier: 1, aliases: ['Indira Nagar', 'HAL 2nd Stage', '100 Feet Road'] },
  { name: 'HAL Old Airport Road', coord: [12.9592, 77.6618], zone: 'East', tier: 2, aliases: ['Old Airport Road', 'Murugeshpalya'] },
  { name: 'Jeevan Bima Nagar', coord: [12.9719, 77.6599], zone: 'East', tier: 2, aliases: ['JB Nagar'] },
  { name: 'CV Raman Nagar', coord: [12.9858, 77.6631], zone: 'East', tier: 2, aliases: ['C V Raman Nagar'] },
  { name: 'Kaggadasapura', coord: [12.9845, 77.6788], zone: 'East', tier: 3 },
  { name: 'Mahadevapura', coord: [12.9916, 77.7066], zone: 'East', tier: 3, aliases: ['ORR Mahadevapura'] },
  { name: 'KR Puram', coord: [13.0075, 77.6959], zone: 'East', tier: 3, aliases: ['Krishnarajapuram', 'K R Puram'] },
  { name: 'Marathahalli', coord: [12.9569, 77.7011], zone: 'East', tier: 3, aliases: ['ORR Marathahalli'] },
  { name: 'Brookefield', coord: [12.9653, 77.7181], zone: 'East', tier: 2 },
  { name: 'Kundalahalli', coord: [12.9667, 77.7156], zone: 'East', tier: 3 },
  { name: 'Whitefield', coord: [12.9698, 77.75], zone: 'East', tier: 3, aliases: ['ITPL', 'WF'] },
  { name: 'Hoodi', coord: [12.9925, 77.7155], zone: 'East', tier: 3 },
  { name: 'Varthur', coord: [12.9406, 77.7470], zone: 'East', tier: 4 },
  { name: 'Kadugodi', coord: [12.9986, 77.7612], zone: 'East', tier: 4 },
  { name: 'Hope Farm', coord: [12.9840, 77.7535], zone: 'East', tier: 3, aliases: ['Channasandra'] },
  { name: 'Budigere Cross', coord: [13.0240, 77.7660], zone: 'East', tier: 4 },
  { name: 'Ramamurthy Nagar', coord: [13.0124, 77.6777], zone: 'East', tier: 3 },
  { name: 'Banaswadi', coord: [13.0104, 77.6482], zone: 'East', tier: 3 },
  { name: 'Kalyan Nagar', coord: [13.0280, 77.6390], zone: 'North-East', tier: 2, aliases: ['Kalyananagar'] },
  { name: 'HRBR Layout', coord: [13.0186, 77.6432], zone: 'North-East', tier: 2, aliases: ['HRBR'] },
  { name: 'Kammanahalli', coord: [13.0157, 77.6378], zone: 'North-East', tier: 2 },
  { name: 'Horamavu', coord: [13.0270, 77.6600], zone: 'North-East', tier: 3 },
  // South-East / ORR
  { name: 'Koramangala', coord: [12.9352, 77.6245], zone: 'South-East', tier: 1, aliases: ['Kormangala', 'KMG', 'Koramangala 5th Block'] },
  { name: 'Ejipura', coord: [12.9450, 77.6280], zone: 'South-East', tier: 2, aliases: ['Viveknagar'] },
  { name: 'HSR Layout', coord: [12.9116, 77.6474], zone: 'South-East', tier: 1, aliases: ['HSR', 'Agara'] },
  { name: 'Bellandur', coord: [12.9260, 77.6762], zone: 'South-East', tier: 2, aliases: ['ORR Bellandur', 'Outer Ring Road'] },
  { name: 'Kadubeesanahalli', coord: [12.9380, 77.6950], zone: 'South-East', tier: 2, aliases: ['ORR', 'Outer Ring Road', 'Kadubisanahalli'] },
  { name: 'Sarjapur Road', coord: [12.9105, 77.6855], zone: 'South-East', tier: 3, aliases: ['Sarjapura Road', 'Sarjapur Rd'] },
  { name: 'Haralur Road', coord: [12.9050, 77.6650], zone: 'South-East', tier: 3, aliases: ['Haralur'] },
  { name: 'Kasavanahalli', coord: [12.9050, 77.6780], zone: 'South-East', tier: 3 },
  { name: 'Carmelaram', coord: [12.9070, 77.7060], zone: 'South-East', tier: 3 },
  { name: 'Dommasandra', coord: [12.8820, 77.7530], zone: 'South-East', tier: 4 },
  { name: 'Sarjapur', coord: [12.8600, 77.7860], zone: 'South-East', tier: 4, aliases: ['Sarjapura'] },
  { name: 'BTM Layout', coord: [12.9166, 77.6101], zone: 'South-East', tier: 2, aliases: ['BTM', 'BTM 2nd Stage'] },
  { name: 'Madiwala', coord: [12.9226, 77.6174], zone: 'South-East', tier: 2 },
  { name: 'Bommanahalli', coord: [12.9030, 77.6240], zone: 'South-East', tier: 3 },
  { name: 'Hongasandra', coord: [12.8960, 77.6260], zone: 'South-East', tier: 3 },
  { name: 'Electronic City', coord: [12.8452, 77.6602], zone: 'South-East', tier: 4, aliases: ['E City', 'E-City', 'Ecity', 'Electronics City', 'EC'] },
  { name: 'Hosa Road', coord: [12.8770, 77.6630], zone: 'South-East', tier: 4 },
  { name: 'Begur Road', coord: [12.8800, 77.6290], zone: 'South-East', tier: 4, aliases: ['Begur'] },
  { name: 'Chandapura', coord: [12.8000, 77.7050], zone: 'South-East', tier: 4 },
  { name: 'Attibele', coord: [12.7790, 77.7700], zone: 'South-East', tier: 4 },
  { name: 'Bommasandra', coord: [12.8170, 77.6950], zone: 'South-East', tier: 4, aliases: ['Bommasandra Industrial Area', 'Hosur Road'] },
  { name: 'Hoskote', coord: [13.0707, 77.7982], zone: 'East', tier: 4, aliases: ['Hosakote', 'Old Madras Road', 'NH-75'] },
  // South
  { name: 'Jayanagar', coord: [12.9299, 77.5826], zone: 'South', tier: 1, aliases: ['Jaya Nagar', '4th Block Jayanagar'] },
  { name: 'JP Nagar', coord: [12.9063, 77.5857], zone: 'South', tier: 2, aliases: ['J P Nagar', 'Jayaprakash Nagar'] },
  { name: 'Basavanagudi', coord: [12.9417, 77.5755], zone: 'South', tier: 1 },
  { name: 'Banashankari', coord: [12.9255, 77.5468], zone: 'South', tier: 2, aliases: ['BSK'] },
  { name: 'Padmanabhanagar', coord: [12.9160, 77.5560], zone: 'South', tier: 2 },
  { name: 'Uttarahalli', coord: [12.9050, 77.5440], zone: 'South', tier: 3 },
  { name: 'Kanakapura Road', coord: [12.8800, 77.5600], zone: 'South', tier: 3, aliases: ['Kanakpura Road'] },
  { name: 'Bannerghatta Road', coord: [12.8880, 77.5970], zone: 'South', tier: 3, aliases: ['BG Road', 'Bannerghata Road'] },
  { name: 'Arekere', coord: [12.8870, 77.6010], zone: 'South', tier: 3 },
  { name: 'Hulimavu', coord: [12.8780, 77.6020], zone: 'South', tier: 3 },
  { name: 'Gottigere', coord: [12.8560, 77.5880], zone: 'South', tier: 4 },
  { name: 'Wilson Garden South', coord: [12.9420, 77.5990], zone: 'South', tier: 2, aliases: ['Lakkasandra'] },
  { name: 'Girinagar', coord: [12.9420, 77.5380], zone: 'South', tier: 3 },
  // West
  { name: 'Rajajinagar', coord: [12.9915, 77.5543], zone: 'West', tier: 2 },
  { name: 'Basaveshwaranagar', coord: [12.9860, 77.5390], zone: 'West', tier: 2, aliases: ['Basaveshwara Nagar'] },
  { name: 'Vijayanagar', coord: [12.9719, 77.5350], zone: 'West', tier: 2, aliases: ['Vijaya Nagar'] },
  { name: 'Nagarbhavi', coord: [12.9600, 77.5100], zone: 'West', tier: 3 },
  { name: 'Kengeri', coord: [12.9081, 77.4826], zone: 'West', tier: 4, aliases: ['Kengeri Satellite Town'] },
  { name: 'RR Nagar', coord: [12.9274, 77.5155], zone: 'West', tier: 3, aliases: ['Rajarajeshwari Nagar', 'R R Nagar'] },
  { name: 'Mysore Road', coord: [12.9500, 77.5300], zone: 'West', tier: 4, aliases: ['Mysuru Road'] },
  { name: 'Yeshwanthpur', coord: [13.0280, 77.5400], zone: 'West', tier: 2, aliases: ['Yeshwantpur', 'Yesvantpur'] },
  { name: 'Peenya', coord: [13.0285, 77.5197], zone: 'West', tier: 4 },
  { name: 'Mathikere', coord: [13.0330, 77.5630], zone: 'North', tier: 2 },
  // North
  { name: 'Hebbal', coord: [13.0358, 77.597], zone: 'North', tier: 2, aliases: ['Hebbal Flyover'] },
  { name: 'RT Nagar', coord: [13.0213, 77.5946], zone: 'North', tier: 2, aliases: ['R T Nagar'] },
  { name: 'Sanjaynagar', coord: [13.0360, 77.5760], zone: 'North', tier: 2, aliases: ['Sanjay Nagar'] },
  { name: 'Nagawara', coord: [13.0440, 77.6200], zone: 'North', tier: 3, aliases: ['ORR North'] },
  { name: 'Hennur Road', coord: [13.0450, 77.6400], zone: 'North-East', tier: 3, aliases: ['Hennur'] },
  { name: 'Thanisandra', coord: [13.0560, 77.6330], zone: 'North', tier: 3, aliases: ['Thanisandra Main Road'] },
  { name: 'Jakkur', coord: [13.0780, 77.6060], zone: 'North', tier: 3 },
  { name: 'Yelahanka', coord: [13.1007, 77.5963], zone: 'North', tier: 3, aliases: ['Yelahanka New Town'] },
  { name: 'Sahakar Nagar', coord: [13.0620, 77.5870], zone: 'North', tier: 2, aliases: ['Sahakara Nagar'] },
  { name: 'Vidyaranyapura', coord: [13.0780, 77.5560], zone: 'North', tier: 3 },
  { name: 'Jalahalli', coord: [13.0450, 77.5450], zone: 'North', tier: 3 },
  { name: 'Devanahalli', coord: [13.2470, 77.7120], zone: 'North', tier: 4, aliases: ['Airport Road', 'KIA'] },
  { name: 'Bagalur', coord: [13.1350, 77.6680], zone: 'North', tier: 4 },
  { name: 'Hunasamaranahalli', coord: [13.1460, 77.6130], zone: 'North', tier: 4 },
];

const TIER_RATES: Record<Area['tier'], { buy: number; rent: number }> = {
  1: { buy: 16000, rent: 50 }, 2: { buy: 11500, rent: 38 }, 3: { buy: 8200, rent: 29 }, 4: { buy: 5800, rent: 21 },
};

/** Sample ₹/sqft rates for any area: detailed sample data where we have it, tier estimate otherwise. */
export function areaRates(name: string) {
  const d = LOCALITIES.find((l) => l.name === name);
  if (d) return { buy: d.buyPerSqft, rent: d.rentPerSqft };
  const a = AREAS.find((x) => x.name === name);
  return a ? TIER_RATES[a.tier] : TIER_RATES[3];
}

export const areaByName = (n: string) => AREAS.find((a) => a.name.toLowerCase() === n.toLowerCase());

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const squash = (s: string) => norm(s).replace(/ /g, '');

export interface AreaMatch { area: Area; via?: string; score: number }

/** Typeahead search: name prefix > word prefix > alias > substring (spaces / hyphens ignored). */
export function searchAreas(q: string, limit = 8): AreaMatch[] {
  const nq = norm(q), sq = squash(q);
  if (!sq) return [];
  const out: AreaMatch[] = [];
  for (const area of AREAS) {
    const n = norm(area.name), sn = squash(area.name);
    let score = 0, via: string | undefined;
    if (sn === sq) score = 100;
    else if (sn.startsWith(sq)) score = 80;
    else if (n.split(' ').some((w) => w.startsWith(nq))) score = 65;
    for (const al of area.aliases ?? []) {
      const sa = squash(al);
      const s = sa === sq ? 90 : sa.startsWith(sq) ? 60 : norm(al).split(' ').some((w) => w.startsWith(nq)) && nq.length >= 2 ? 45 : sa.includes(sq) && sq.length >= 3 ? 30 : 0;
      if (s > score) { score = s; via = al; }
    }
    if (!score && sq.length >= 3 && sn.includes(sq)) score = 35;
    if (sn.startsWith(sq)) via = undefined; // the name itself matches; no alias hint needed
    if (score) out.push({ area, via, score });
  }
  return out.sort((a, b) => b.score - a.score || a.area.name.localeCompare(b.area.name)).slice(0, limit);
}

/** Resolve free text to an area (exact name or exact alias), e.g. "BTM" → BTM Layout. */
export function resolveArea(q: string): Area | undefined {
  const sq = squash(q);
  if (!sq) return undefined;
  return AREAS.find((a) => squash(a.name) === sq) ?? AREAS.find((a) => (a.aliases ?? []).some((al) => squash(al) === sq));
}
