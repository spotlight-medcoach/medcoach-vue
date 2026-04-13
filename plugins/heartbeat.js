/**
 * Heartbeat plugin — sends a ping every 60 s while the student is active.
 * "Active" means: tab visible AND user interacted in the last 2 minutes.
 *
 * Endpoint: POST /student/activity/ping  Body: { s: "<section>", u: "<path>" }
 */

const INTERVAL_MS = 60_000;
const IDLE_TIMEOUT_MS = 300_000; // 5 min without interaction → idle

/**
 * Section → list of page name prefixes that belong to it.
 * A page matches if its name equals a prefix or starts with "<prefix>_".
 */
const SECTION_PAGES = {
  manuals: [
    'manuals',
    'manual', // cubre manual, manual2
    'extra_manuals',
  ],
  simulator: [
    'introduction_simulator',
    'simulators',
    'simulator', // cubre simulator, simulator_block1/2, simulator_break, simulator_feedback, simulator_results, simulator_retro
    'test_simulator',
  ],
  custom_test: [
    'custom_test', // cubre custom_test, custom_test_config, custom_test_retro
  ],
  flashcards: [
    'flashcards',
  ],
  infographics: [
    'infographics',
    'manage_infographics',
  ],
  diagnostic: [
    'diagnostic_test', // cubre diagnostic_test, after_diagnostic_test (prefijo más largo primero por el sort)
    'after_diagnostic_test',
  ],
  dashboard: [
    'dashboard',
    'analysis',
    'calendar',
    'settings',
    'notifications',
    'payment',
    'congrats',
    'welcome',
  ],
  notes: [
    'notes',
    'review',
  ],
};

// Build a flat lookup: prefix → section (longer prefixes first to avoid partial matches)
const _prefixMap = Object.entries(SECTION_PAGES)
  .flatMap(([section, prefixes]) => prefixes.map((p) => [p, section]))
  .sort(([a], [b]) => b.length - a.length);

function getSection (path) {
  const segment = (path || '/').split('/').find(Boolean) || '';
  for (const [prefix, section] of _prefixMap) {
    if (segment === prefix || segment.startsWith(prefix + '_')) {
      return section;
    }
  }
  return 'dashboard';
}

export default ({ app, $axios, store }) => {
  if (!process.client) {
    return;
  }

  let timer = null;
  let lastActivity = Date.now();

  // Any of these events counts as user activity
  const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];

  function onActivity () {
    lastActivity = Date.now();
  }

  ACTIVITY_EVENTS.forEach((evt) => {
    window.addEventListener(evt, onActivity, { passive: true });
  });

  function isIdle () {
    return Date.now() - lastActivity > IDLE_TIMEOUT_MS;
  }

  function localDateString () {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function sendPing () {
    if (document.visibilityState === 'hidden' || isIdle()) {
      return;
    }
    const path = app.router.currentRoute.path;
    const section = getSection(path);
    $axios.$post('/student/activity/ping', { s: section, u: path, d: localDateString() }).catch(() => {});
  }

  function startTimer () {
    if (timer) {
      return;
    }
    timer = setInterval(sendPing, INTERVAL_MS);
  }

  function stopTimer () {
    clearInterval(timer);
    timer = null;
  }

  // Pause/resume when the tab visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && store.state.token) {
      startTimer();
    } else {
      stopTimer();
    }
  });

  // Start/stop based on auth state
  store.watch(
    (state) => state.token,
    (token) => {
      if (token) {
        startTimer();
      } else {
        stopTimer();
      }
    },
    { immediate: true },
  );
};
