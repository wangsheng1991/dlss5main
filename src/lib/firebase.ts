/** The Firebase SDK's shape, taken from the one module that imports it — no runtime import here. */
export type Firebase = typeof import('./firebase-client');

let pending: Promise<Firebase> | null = null;

/**
 * Loads the Firebase SDK and initializes its app, once per page.
 *
 * Only signed-in visitors, uploaders and the sign-in pages need it, so the SDK is fetched when
 * something actually asks for it instead of riding along in the entry bundle.
 */
export function loadFirebase(): Promise<Firebase> {
  pending ??= import('./firebase-client');
  return pending;
}
