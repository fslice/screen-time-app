/**
 * Dummy iCloud accounts for Screen Time delegation.
 * Users attach one of these accounts so the Screen Time passcode
 * is recoverable only through Shutout, not via their personal iCloud.
 *
 * Replace emails/labels with real accounts once created.
 */
export const ICLOUD_ACCOUNTS = [
  { email: "shutout.lock1@icloud.com", label: "Lock Account 1" },
  { email: "shutout.lock2@icloud.com", label: "Lock Account 2" },
  { email: "shutout.lock3@icloud.com", label: "Lock Account 3" },
  { email: "shutout.lock4@icloud.com", label: "Lock Account 4" },
  { email: "shutout.lock5@icloud.com", label: "Lock Account 5" },
] as const;

/**
 * Assigns a random iCloud account from the pool.
 */
export function assignIcloudAccount(): (typeof ICLOUD_ACCOUNTS)[number] {
  const index = Math.floor(Math.random() * ICLOUD_ACCOUNTS.length);
  return ICLOUD_ACCOUNTS[index];
}
