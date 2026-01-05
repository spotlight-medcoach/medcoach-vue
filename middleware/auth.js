export default function auth ({ redirect, route, store }) {
  const timer = store.state.custom_test.timer;
  if (timer) {
    clearInterval(timer);
  }
  if (
    route.name !== 'index' &&
    route.name !== 'new_login' &&
    route.name !== 'welcome' &&
    route.name !== 'reset_password' &&
    route.name !== 'sign_up' &&
    route.name !== 'complete_registration'
  ) {
    if (!store.state.token) {
      redirect({
        path: '/',
        query: {
          invalid_token: 'Debe iniciar sesión',
        },
      });
    } else if (!store.state.studentInfo) {
      store.dispatch('initialize');
      if (!store.state.activeSubscription && route.name !== 'settings') {
        redirect({
          path: '/settings',
          query: {
            invalid_token: 'Suscripción Inactiva',
          },
        });
      }
    }
  }
  return true;
}
