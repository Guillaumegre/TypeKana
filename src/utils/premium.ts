/**
 * Stubbed until the RevenueCat subscription is wired up: no premium tier exists yet,
 * so ads always show. Swap the implementation here once purchases are live — every
 * ad-gating call site already reads through this single function.
 */
export function isPremiumUser(): boolean {
  return false;
}
