// Stop hook — keep docs/STATE.md regenerated from its sources at the end of
// every turn, so the "where are we right now" snapshot never drifts. STATE.md
// is a generated file (never hand-edited); the refresh is idempotent within a
// day, so quiet turns produce no change. Failures are swallowed — a stale STATE
// must never block the turn from ending.

try {
    const { refreshState } = await import('../scripts/refresh-state.mjs');
    refreshState();
} catch {
    // intentionally ignored, see header
}
process.exit(0);
