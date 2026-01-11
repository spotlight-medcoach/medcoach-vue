export default function ({ $axios, redirect, store }) {
  // Base URL - ahora apunta a /api (sin /student)
  $axios.setBaseURL(
    process.env.BASE_PATH ||
      'https://wup7ric684.execute-api.us-west-2.amazonaws.com/refinery/api',
  );
  // Content Type
  $axios.setHeader('Content-Type', 'application/json');

  // Interceptor de request: Configurar token automáticamente en cada petición
  $axios.onRequest((config) => {
    if (process.client) {
      const token = localStorage.getItem('usertoken');
      if (token) {
        config.headers.common.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  // Interceptors de error
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status);
    if (code === 401) {
      // Token inválido o expirado
      if (process.client) {
        localStorage.removeItem('usertoken');
        store.dispatch('killSession');
        redirect({
          path: '/',
          query: { invalid_token: 'Su token ha expirado' },
        });
      }
    } else if (code === 403 || code === 402) {
      store.dispatch('killSession');
      redirect({ path: '/', query: { invalid_token: 'Su token ha expirado' } });
    }
  });
}
