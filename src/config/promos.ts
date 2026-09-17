/**
 * Promotional grants. Ids are part of the ledger key, so an existing promo id must never change:
 * that key is what makes a re-run of a grant a no-op instead of a second payout.
 */

/** Users who signed up in this window get a one-off top-up (they predate the current free allowance). */
export const WELCOME_BACK = {
  id: 'welcome-back-2026-09',
  credits: 5,
  registeredFrom: '2026-07-18T00:00:00.000Z',
  registeredTo: '2026-09-17T23:59:59.999Z',
} as const;

/** Posting about the site on a social platform and sending a screenshot is worth a larger top-up. */
export const SHARE_REWARD = {
  id: 'share-2026-09',
  credits: 30,
} as const;
