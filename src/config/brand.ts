/**
 * Single source of truth for the (temporary) brand.
 * Change BRAND.name here and the whole site updates (feature names derive from it where branded).
 */
export const BRAND = {
  name: 'Pakka',
  tagline: 'Every home proven, every price true, every deposit safe. No brokers, no spam, no surprises.',
  shortTagline: 'Every home proven. Every price true. Every deposit safe.',
  city: 'Bangalore',
  domain: 'pakka.example',
  supportEmail: 'hello@pakka.example',
  supportPhone: '+91 80 0000 0000',
  legalEntity: 'Pakka Technologies Pvt. Ltd. (placeholder)',
} as const;

/** Product feature names (one place to rename). */
export const FEATURES = {
  proof: `${BRAND.name} Proof`, // verified video + GPS listings
  proofCredit: '₹1,000', // credit on top of fee refund if a Proof listing is fake
  spam: 'Zero-Spam Promise', // masked numbers, never resold
  price: 'True Price Engine',
  fairRent: 'Fair-Rent',
  truth: 'Home Truth Score',
  deposit: 'Deposit Safe', // bank escrow via regulated partner
} as const;
