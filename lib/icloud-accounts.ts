/**
 * Dummy iCloud accounts for Screen Time delegation.
 * Users attach one of these accounts so the Screen Time passcode
 * is recoverable only through Latch, not via their personal iCloud.
 *
 * Replace emails/labels with real accounts once created.
 */
export const ICLOUD_ACCOUNTS = [
  { email: "latch.lock1@icloud.com", label: "Lock Account 1" },
  { email: "latch.lock2@icloud.com", label: "Lock Account 2" },
  { email: "latch.lock3@icloud.com", label: "Lock Account 3" },
  { email: "latch.lock4@icloud.com", label: "Lock Account 4" },
  { email: "latch.lock5@icloud.com", label: "Lock Account 5" },
] as const;

/**
 * Assigns a random iCloud account from the pool.
 */
export function assignIcloudAccount(): (typeof ICLOUD_ACCOUNTS)[number] {
  const index = Math.floor(Math.random() * ICLOUD_ACCOUNTS.length);
  return ICLOUD_ACCOUNTS[index];
}
