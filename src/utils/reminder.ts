import { Platform } from 'react-native';

type NotificationsModule = typeof import('expo-notifications');

// One fixed id, so rescheduling replaces the previous reminder instead of stacking a second.
const REMINDER_ID = 'daily-reminder';
const CHANNEL_ID = 'reminders';

let notificationsModule: NotificationsModule | null | undefined;

/**
 * Same defensive-require pattern as src/utils/premium.ts: expo-notifications links native
 * code that only exists in a custom dev/production build, so every call site here no-ops
 * (or reports "no permission") instead of throwing when it is missing.
 */
function loadNotifications(): NotificationsModule | null {
  if (notificationsModule !== undefined) return notificationsModule;
  if (Platform.OS === 'web') {
    notificationsModule = null;
    return notificationsModule;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    notificationsModule = require('expo-notifications') as NotificationsModule;
  } catch {
    notificationsModule = null;
  }
  return notificationsModule;
}

/** Android only: notifications need a channel, and Android 13+ asks for the permission only once one exists. */
async function ensureChannel(N: NotificationsModule, name: string): Promise<void> {
  if (Platform.OS !== 'android') return;
  await N.setNotificationChannelAsync(CHANNEL_ID, {
    name,
    importance: N.AndroidImportance.DEFAULT,
  });
}

/** Whether the OS currently lets the app show notifications. */
export async function hasReminderPermission(): Promise<boolean> {
  const N = loadNotifications();
  if (!N) return false;
  try {
    return (await N.getPermissionsAsync()).granted;
  } catch {
    return false;
  }
}

/**
 * Asks for the notification permission (system prompt, only if it can still be asked) —
 * called when the user switches the reminder on, never at launch. False when refused or
 * when notifications aren't available on this build.
 */
export async function requestReminderPermission(channelName: string): Promise<boolean> {
  const N = loadNotifications();
  if (!N) return false;
  try {
    await ensureChannel(N, channelName);
    const current = await N.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;
    const asked = await N.requestPermissionsAsync({ ios: { allowAlert: true, allowSound: true } });
    return asked.granted;
  } catch {
    return false;
  }
}

export interface ReminderConfig {
  enabled: boolean;
  hour: number;
  minute: number;
  channelName: string;
  title: string;
  body: string;
}

/**
 * Makes the scheduled notification match the settings: cancels it when the reminder is off
 * (or the permission is gone), otherwise (re)schedules the daily one at the chosen time.
 * Safe to call as often as needed — it never prompts.
 */
export async function syncReminder(config: ReminderConfig): Promise<void> {
  const N = loadNotifications();
  if (!N) return;
  try {
    await N.cancelScheduledNotificationAsync(REMINDER_ID);
    if (!config.enabled) return;
    if (!(await N.getPermissionsAsync()).granted) return;
    await ensureChannel(N, config.channelName);
    await N.scheduleNotificationAsync({
      identifier: REMINDER_ID,
      content: { title: config.title, body: config.body },
      trigger: {
        type: N.SchedulableTriggerInputTypes.DAILY,
        hour: config.hour,
        minute: config.minute,
        channelId: CHANNEL_ID,
      },
    });
  } catch {
    // A reminder that can't be scheduled is not worth surfacing an error for.
  }
}
