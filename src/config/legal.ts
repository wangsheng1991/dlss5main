import { SITE_PROFILE } from './profile';
import { SITE_HOST, SUPPORT_EMAIL } from './site';

/**
 * Values the legal pages have to state in one place, so the Terms, the Privacy Policy and the
 * Refund Policy can never contradict each other (or the pricing page) after an edit.
 *
 * `contactEmail` must match the mailbox the billing API advertises (`MEMBERSHIP_CONTACT_EMAIL`,
 * defaulting to the deployment's own support address), because that is where buyers are told to write.
 */
export const LEGAL = {
  /** Brand the subscription is sold under. Replace with the registered entity name if there is one. */
  operator: SITE_PROFILE.operatorName,
  website: SITE_HOST,
  contactEmail: SUPPORT_EMAIL,
  refundWindowDays: 14,
  /** Jurisdiction whose courts hear disputes — change if the operating entity is registered elsewhere. */
  governingLaw: "the People's Republic of China",
  updatedAt: 'September 20, 2026',
} as const;
