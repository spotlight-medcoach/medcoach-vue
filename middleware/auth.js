// Configuración de rutas públicas (no requieren autenticación)
const PUBLIC_ROUTES = [
  'index',
  'new_login',
  'welcome',
  'reset_password',
  'sign_up',
  'complete_registration',
];

// Rutas que no requieren validación de suscripción activa
const ROUTES_WITHOUT_SUBSCRIPTION_CHECK = [
  'diagnostic_test',
  'after_diagnostic_test',
  'settings',
];

// Rutas que nunca deben redirigir a settings
const ROUTES_NEVER_REDIRECT_TO_SETTINGS = [
  'diagnostic_test',
  'after_diagnostic_test',
];

/**
 * Determina qué acciones deben ejecutarse según el estado del usuario y la ruta
 * @param {Object} studentState - Estado del estudiante
 * @param {string} routeName - Nombre de la ruta actual
 * @returns {Object} Configuración de acciones a ejecutar
 */
function getActionsForRoute (studentState, routeName) {
  const { phase = 0, isFreeTrial = false } = studentState;

  // Rutas de diagnóstico: no cargar syllabus ni infographics
  const isDiagnosticRoute = [
    'diagnostic_test',
    'after_diagnostic_test',
  ].includes(routeName);

  // Determinar qué acciones ejecutar
  const shouldLoadSyllabus =
    !isDiagnosticRoute && // No en rutas de diagnóstico
    phase > 0 && // Usuario completó diagnóstico
    !isFreeTrial; // No es free trial

  const shouldLoadInfographics = !isDiagnosticRoute; // Cargar en todas las rutas excepto diagnóstico

  const shouldLoadNotifications =
    !isDiagnosticRoute && // No en rutas de diagnóstico
    phase > 0 && // Usuario completó diagnóstico
    !isFreeTrial; // No es free trial

  return {
    loadSyllabus: shouldLoadSyllabus,
    loadInfographics: shouldLoadInfographics,
    loadNotifications: shouldLoadNotifications,
  };
}

export default async function auth ({ redirect, route, store }) {
  const { name: routeName } = route;

  // Limpiar timer de custom_test si existe
  if (store.state.custom_test.timer) {
    clearInterval(store.state.custom_test.timer);
  }

  // Si es una ruta pública, permitir acceso sin autenticación
  if (PUBLIC_ROUTES.includes(routeName)) {
    return true;
  }

  // Verificar autenticación
  if (!store.state.token) {
    redirect({
      path: '/',
      query: {
        invalid_token: 'Debe iniciar sesión',
      },
    });
    return;
  }

  // Cargar información del estudiante si no está disponible
  if (!store.state.studentInfo) {
    // Primero cargar studentInfo básico para determinar el estado
    await store.dispatch('fetchStudentInfo');
  }

  // Determinar qué acciones ejecutar según el estado del usuario y la ruta
  const studentState = {
    phase: store.state.studentInfo?.phase || 0,
    isFreeTrial: store.state.isFreeTrial || false,
  };

  const actions = getActionsForRoute(studentState, routeName);

  // Usar initialize con las acciones determinadas por el estado
  if (!store.state.studentInfo) {
    await store.dispatch('initialize', {
      skipSyllabus: !actions.loadSyllabus,
      skipInfographics: !actions.loadInfographics,
    });

    // Cargar notificaciones si corresponde (initialize no lo hace automáticamente)
    if (actions.loadNotifications) {
      store.dispatch('notifications/loopFetchData');
    }
  } else if (actions.loadSyllabus && !store.state.syllabus) {
    // Si ya tenemos studentInfo pero falta syllabus, cargarlo
    await store.dispatch('fetchSyllabus');
  }

  // Validar suscripción activa
  const shouldCheckSubscription =
    !ROUTES_NEVER_REDIRECT_TO_SETTINGS.includes(routeName) &&
    !ROUTES_WITHOUT_SUBSCRIPTION_CHECK.includes(routeName) &&
    !store.state.activeSubscription;

  if (shouldCheckSubscription) {
    redirect({
      path: '/settings',
      query: {
        invalid_token: 'Suscripción Inactiva',
      },
    });
    return;
  }

  return true;
}
