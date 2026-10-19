/** The Bengaluru-first features shown on /features/, the homepage and property pages. Describe benefits only. */
export type DiffId = 'flood' | 'water' | 'power' | 'commute' | 'cost' | 'deposit' | 'agreement' | 'voice';
export const DIFFERENTIATORS: { id: DiffId; title: string; line: string; data: string; where: string }[] = [
  { id: 'flood', title: 'Flood & Monsoon Check', line: 'See how many BBMP-listed flood-prone, vulnerable and low-lying spots sit within 500 m, 1 km and 2 km of a home before you sign.', data: 'Real public data (BBMP / KSRSAC)', where: 'Every property page · search filter' },
  { id: 'water', title: 'Water Reality', line: 'Cauvery, borewell or tanker? Summer tanker trips and what they cost you each month, as reported by residents.', data: 'Sample data', where: 'Every property page · search filter' },
  { id: 'power', title: 'Power & Internet Reality', line: 'Hours of power cuts a month, what the backup actually runs, and how many fibre providers serve the building.', data: 'Sample data', where: 'Every property page · WFH filter' },
  { id: 'commute', title: 'Peak-Hour Commute', line: '9 AM and 6 PM door-to-office times, not straight-line distance, with known bottlenecks and hours lost per month.', data: 'Estimate', where: 'Every property page · this page' },
  { id: 'cost', title: 'True Monthly Cost', line: 'Rent or EMI plus maintenance, tankers, power backup, electricity, parking, internet and commute, in one number you can edit.', data: 'Sample estimate', where: 'Every property page' },
  { id: 'deposit', title: 'Deposit Fairness Meter', line: 'Compare the deposit asked with what is typical in the locality, then send a polite counter-offer on WhatsApp in one tap.', data: 'Sample locality norms', where: 'Rental property pages · this page' },
  { id: 'agreement', title: 'Agreement Red-Flag Scan', line: 'Paste a draft rental agreement and get plain-language flags: 10-month deposits, full repaint charges, one-sided exits, missing refund dates.', data: 'Runs in your browser', where: 'This page · before you sign' },
  { id: 'voice', title: 'Voice-Note Listing', line: 'Owners list by sending a WhatsApp voice note in Kannada, Hindi or English; the AI fills the listing and asks only for what is missing.', data: 'Demo (planned)', where: 'Post property · this page' },
];
