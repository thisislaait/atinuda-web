// src/lib/checkinsStore.ts
export type CheckinsMap = Map<string, number>;

/**
 * One global in-memory store (dev/prod single process).
 * If you redeploy or restart, this resets (by design).
 */
declare global {
  // eslint-disable-next-line no-var
  var __ATINUDA_CHECKINS__: CheckinsMap | undefined;
}

if (!global.__ATINUDA_CHECKINS__) {
  global.__ATINUDA_CHECKINS__ = new Map<string, number>();
}

export const checkinsStore: CheckinsMap = global.__ATINUDA_CHECKINS__!;
