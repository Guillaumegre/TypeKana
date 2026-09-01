import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'typekana:quota';

/** Sessions a free player can start per day before being offered a rewarded ad. */
export const FREE_SESSIONS_PER_DAY = 5;

interface Quota {
  /** Local calendar day the counters belong to. */
  day: string;
  /** Sessions started today. */
  used: number;
  /** Extra sessions earned today by watching rewarded ads. */
  extra: number;
}

/**
 * Local calendar day rather than UTC: a day that flipped at 1am would feel broken to a
 * player in France finishing a late session.
 */
function today(): string {
  const d = new Date();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

const EMPTY: Quota = { day: today(), used: 0, extra: 0 };

async function read(): Promise<Quota> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Quota;
    // A stored day that isn't today means the allowance has reset.
    if (parsed?.day !== today()) return { ...EMPTY };
    return {
      day: parsed.day,
      used: Number(parsed.used) || 0,
      extra: Number(parsed.extra) || 0,
    };
  } catch {
    return { ...EMPTY };
  }
}

async function write(quota: Quota): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(quota));
  } catch {
    // A quota we can't persist just means a more generous day for the player.
  }
}

export interface QuotaState {
  used: number;
  allowed: number;
  remaining: number;
}

export async function getQuota(): Promise<QuotaState> {
  const q = await read();
  const allowed = FREE_SESSIONS_PER_DAY + q.extra;
  return { used: q.used, allowed, remaining: Math.max(0, allowed - q.used) };
}

/** Records a started session. Returns the state after consumption. */
export async function consumeSession(): Promise<QuotaState> {
  const q = await read();
  const next = { ...q, used: q.used + 1 };
  await write(next);
  const allowed = FREE_SESSIONS_PER_DAY + next.extra;
  return { used: next.used, allowed, remaining: Math.max(0, allowed - next.used) };
}

/** Adds one session to today's allowance, after a rewarded ad was actually watched. */
export async function grantExtraSession(): Promise<void> {
  const q = await read();
  await write({ ...q, extra: q.extra + 1 });
}
