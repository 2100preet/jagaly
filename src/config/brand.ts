/**
 * Single source of truth for the (temporary) brand.
 * Change BRAND.name here and the whole site updates (feature names derive from it where branded).
 */
export const BRAND = {
  name: 'Jagaly',
  tagline: 'Every home proven, every price true, your deposit protected if you choose. No brokers, no spam, no surprises.',
  shortTagline: 'Every home proven. Every price true. Your deposit protected, if you choose.',
  city: 'Bangalore',
  domain: 'jagaly.example',
  supportEmail: 'hello@jagaly.example',
  supportPhone: '+91 80 0000 0000',
  legalEntity: 'Jagaly Technologies Pvt. Ltd. (placeholder)',
} as const;

/** Product feature names (one place to rename). */
export const FEATURES = {
  proof: `${BRAND.name} Proof`, // verified video + GPS listings
  proofCredit: '₹1,000', // credit on top of fee refund if a Proof listing is fake
  spam: 'Zero-Spam Promise', // masked numbers, never resold
  price: 'True Price Engine',
  fairRent: 'Fair-Rent',
  truth: 'Home Truth Score',
  deposit: 'Deposit Safe', // OPTIONAL bank escrow via regulated partner (owner opt-in)
  tenant: 'Verified Tenant', // optional KYC via licensed partner
  nri: `${BRAND.name} NRI`, // planned NRI add-on
} as const;
