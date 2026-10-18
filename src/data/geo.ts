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
  { name: 'Sarjapur Road', center: [12.9105, 77.6855], buyPerSqft: 8100, rentPerSqft: 30, blurb: 'Fast-growing gated-community belt near Embassy Tech Village.', risk: { water: 4, flooding: 4, power: 6, khata: 5 } },
  { name: 'HSR Layout', center: [12.9116, 77.6474], buyPerSqft: 12800, rentPerSqft: 42, blurb: 'Planned BDA layout, startup hub, great food and parks.', risk: { water: 6, flooding: 5, power: 8, khata: 9 } },
  { name: 'Koramangala', center: [12.9352, 77.6245], buyPerSqft: 15200, rentPerSqft: 48, blurb: 'Premium central neighbourhood with cafés and offices.', risk: { water: 7, flooding: 5, power: 8, khata: 9 } },
  { name: 'Electronic City', center: [12.8452, 77.6602], buyPerSqft: 5900, rentPerSqft: 22, blurb: 'Affordable homes next to Infosys, Wipro and the elevated expressway.', risk: { water: 5, flooding: 7, power: 7, khata: 6 } },
  { name: 'Hebbal', center: [13.0358, 77.597], buyPerSqft: 11200, rentPerSqft: 36, blurb: 'North Bangalore gateway, close to Manyata and the airport road.', risk: { water: 7, flooding: 6, power: 8, khata: 8 } },
  { name: 'Indiranagar', center: [12.9784, 77.6408], buyPerSqft: 17500, rentPerSqft: 55, blurb: 'Leafy, upscale and on the metro. 100 Ft Road nightlife.', risk: { water: 7, flooding: 7, power: 8, khata: 9 } },
  { name: 'Yelahanka', center: [13.1007, 77.5963], buyPerSqft: 7300, rentPerSqft: 26, blurb: 'Calm, green and airport-adjacent with large plots.', risk: { water: 6, flooding: 8, power: 7, khata: 7 } },
];

export const TECH_PARKS: { name: string; short: string; coord: [number, number] }[] = [
  { name: 'Manyata Tech Park', short: 'Manyata', coord: [13.0475, 77.6206] },
  { name: 'ITPL Whitefield', short: 'ITPL', coord: [12.9866, 77.7366] },
  { name: 'Embassy Tech Village', short: 'ETV', coord: [12.9328, 77.695] },
  { name: 'Electronic City Ph 1', short: 'E-City', coord: [12.8456, 77.6603] },
  { name: 'Bagmane Tech Park', short: 'Bagmane', coord: [12.9817, 77.6627] },
];

export const localityByName = (n: string) => LOCALITIES.find((l) => l.name === n)!;
