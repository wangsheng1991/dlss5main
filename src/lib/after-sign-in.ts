/**
 * Where a visitor lands after signing in.
 *
 * A page that needs a signed-in reader links to `/login?next=<path>`, so the reader returns to what
 * they came for instead of the dashboard. The value comes from the URL, which means it is attacker
 * controlled: only a same-site absolute path is honoured, everything else falls back.
 *
 * Rejected on purpose:
 *  - anything that is not an absolute path (`https://evil.com`, `evil.com`)
 *  - a protocol-relative path (`//evil.com`) — the classic open redirect
 *  - a backslash (`/\evil.com`): browsers normalise `\` to `/`, so the path becomes protocol-relative
 *    the moment the URL reaches the address bar or a later reload
 *  - whitespace or a control character, which can smuggle the checks above past a naive look
 *
 * See `tests/after-sign-in.test.ts`.
 */

export const DEFAULT_AFTER_SIGN_IN = '/dashboard';

export function afterSignInPath(
  requested: string | null | undefined,
  fallback: string = DEFAULT_AFTER_SIGN_IN,
): string {
  const value = (requested || '').trim();
  const sameSite =
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.includes('\\') &&
    !/[\s\u0000-\u001f]/.test(value);
  return sameSite ? value : fallback;
}
