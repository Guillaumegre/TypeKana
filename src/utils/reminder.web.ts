/**
 * Web build of src/utils/reminder.ts — see src/utils/ads.web.ts for why this override file
 * exists: expo-notifications must never appear in the web bundle's module graph. The web
 * build is only a development preview, so the switch behaves as if permission were granted
 * (lets the settings UI be exercised there) while nothing is ever scheduled.
 */
export interface ReminderConfig {
  enabled: boolean;
  hour: number;
  minute: number;
  channelName: string;
  title: string;
  body: string;
}

export function hasReminderPermission(): Promise<boolean> {
  return Promise.resolve(true);
}

export function requestReminderPermission(_channelName: string): Promise<boolean> {
  return Promise.resolve(true);
}

export function syncReminder(_config: ReminderConfig): Promise<void> {
  return Promise.resolve();
}
