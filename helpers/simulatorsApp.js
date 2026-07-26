/**
 * Handoff hacia la app externa de simuladores (Next.js).
 *
 * La sección de simuladores vive en una app aparte (SIMULATORS_URL, p. ej.
 * https://simulador.spotlightmed.com). Se entra por /auth/handoff con el JWT
 * de esta app como query param; allá se intercambia por un token propio (vía
 * /student/auth/refresh, que reutiliza la sesión, así que la sesión de esta
 * app sigue viva) y se guarda en cookie con un redirect limpio.
 */
export function simulatorsAppUrl() {
  const token = localStorage.getItem('usertoken');
  const base = process.env.SIMULATORS_URL || 'http://localhost:3008';
  if (!token) return base;
  return `${base}/auth/handoff?token=${encodeURIComponent(token)}`;
}

export function goToSimulatorsApp() {
  window.location.href = simulatorsAppUrl();
}
