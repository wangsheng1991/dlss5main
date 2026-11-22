/** Production sells through Waffo only. Legacy clients remain usable in isolated
 * local/preview testing, but an env/key change cannot re-enable them in production. */
export const legacyPaymentsAllowed = (env: Record<string, string | undefined> = process.env): boolean => env.VERCEL_ENV !== 'production';

const legacyRoutes = new Set(['checkout', 'change', 'webhook', 'paypal-checkout', 'paypal-confirm', 'paypal-webhook', 'dodo-checkout', 'dodo-webhook']);
export const disabledProductionBillingRoute = (route: string, env: Record<string, string | undefined> = process.env): boolean => !legacyPaymentsAllowed(env) && legacyRoutes.has(route);

/** Do not delete or reinterpret old financial records. Only a known sandbox
 * PayPal binding which has never been approved may cease blocking a real Waffo
 * purchase. Active, approved and unknown bindings still need manual resolution. */
export function legacyBindingBlocksWaffo(account: Record<string, unknown>, environment: 'prod' | 'test', env: Record<string, string | undefined> = process.env): boolean {
  for (const provider of ['stripe', 'paypal', 'dodo']) {
    if (!account[`${provider}SubscriptionId`]) continue;
    const raw = account[`${provider}SubscriptionStatus`] ?? account.subscriptionStatus;
    const status = typeof raw === 'string' ? raw.toLowerCase() : '';
    if (['canceled', 'cancelled', 'expired', 'incomplete_expired'].includes(status)) continue;
    if (provider === 'paypal' && typeof account.paypalSubscriptionStatus === 'string' && account.paypalSubscriptionStatus.toLowerCase() === 'approval_pending' && environment === 'prod' && !legacyPaymentsAllowed(env) && env.PAYPAL_ENV?.toLowerCase() === 'sandbox') continue;
    return true;
  }
  return false;
}
