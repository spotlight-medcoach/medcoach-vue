export default async function auth ({ redirect, route, store }) {
  const timer = store.state.custom_test.timer;
  if (timer) {
    clearInterval(timer);
  }

  // Rutas que no requieren autenticación
  const publicRoutes = [
    'index',
    'new_login',
    'welcome',
    'reset_password',
    'sign_up',
    'complete_registration',
  ];

  // Rutas que requieren autenticación pero no validan suscripción activa
  const routesWithoutSubscriptionCheck = [
    'diagnostic_test',
    'after_diagnostic_test',
    'settings',
  ];

  if (!publicRoutes.includes(route.name)) {
    if (!store.state.token) {
      redirect({
        path: '/',
        query: {
          invalid_token: 'Debe iniciar sesión',
        },
      });
      return;
    }

    // Si no hay studentInfo, cargar la información del estudiante
    if (!store.state.studentInfo) {
      await store.dispatch('initialize');
    }

    // Validar suscripción activa solo para rutas que lo requieren
    if (
      !routesWithoutSubscriptionCheck.includes(route.name) &&
      !store.state.activeSubscription
    ) {
      redirect({
        path: '/settings',
        query: {
          invalid_token: 'Suscripción Inactiva',
        },
      });
      return;
    }
  }
  return true;
}
