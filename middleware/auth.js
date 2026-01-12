// Configuración de rutas públicas (no requieren autenticación)
const PUBLIC_ROUTES = [
  'index',
  'new_login',
  'welcome',
  'reset_password',
  'sign_up',
  'complete_registration',
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

  // Para la ruta dashboard, siempre actualizar studentInfo para obtener el phase más reciente
  // Esto es importante porque después de completar el diagnóstico, el phase puede cambiar
  if (routeName === 'dashboard') {
    try {
      const student = await store.dispatch('fetchStudentInfo');
      // Verificar que el estado se haya actualizado
      if (!store.state.studentInfo && student) {
        // Si por alguna razón el commit no se ejecutó, hacerlo manualmente
        store.commit('setStudentInfo', student);
      }
    } catch (error) {
      console.error('Error fetching student info in dashboard:', error);
    }
  } else if (!store.state.studentInfo) {
    // Para otras rutas, solo cargar si no está disponible
    try {
      await store.dispatch('fetchStudentInfo');
    } catch (error) {
      console.error('Error fetching student info:', error);
    }
  }

  // Determinar qué acciones ejecutar según el estado del usuario y la ruta
  // Usar directamente los valores de studentInfo para asegurar que estén actualizados
  const studentState = {
    phase: store.state.studentInfo?.phase || 0,
    isFreeTrial:
      store.state.studentInfo?.is_free_trial !== undefined
        ? store.state.studentInfo.is_free_trial
        : store.state.isFreeTrial || false,
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
  } else if (routeName === 'dashboard') {
    // Para dashboard, siempre verificar y cargar lo necesario
    // Activar el estado de carga
    store.commit('http_request/setOnHttpRequest', true);

    // Cargar topics e infographics si no se han cargado
    const promises = [store.dispatch('topics/fetchTopics')];

    if (actions.loadInfographics) {
      promises.push(store.dispatch('infographics/fetchInfographics'));
    }

    // Cargar syllabus si corresponde
    // Verificar condiciones directamente desde studentInfo para asegurar que se cargue
    const shouldLoadSyllabusForDashboard =
      studentState.phase > 0 &&
      !studentState.isFreeTrial &&
      store.state.studentInfo;

    if (shouldLoadSyllabusForDashboard) {
      // Siempre recargar el syllabus en dashboard para asegurar que esté actualizado
      promises.push(
        store.dispatch('fetchSyllabus').catch((error) => {
          console.error('Error loading syllabus in dashboard:', error);
          // No fallar completamente si el syllabus no se puede cargar
          return null;
        }),
      );
    }

    // Cargar notificaciones si corresponde
    if (actions.loadNotifications) {
      store.dispatch('notifications/loopFetchData');
    }

    // Ejecutar todas las promesas, pero no fallar si alguna falla
    await Promise.allSettled(promises);

    // Desactivar el estado de carga después de un breve delay
    setTimeout(() => {
      store.commit('http_request/setOnHttpRequest', false);
    }, 1500);
  } else if (actions.loadSyllabus && !store.state.syllabus) {
    // Si ya tenemos studentInfo pero falta syllabus, cargarlo
    await store.dispatch('fetchSyllabus').catch((error) => {
      console.error('Error loading syllabus:', error);
    });
  }

  return true;
}
