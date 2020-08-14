export default function auth ({ redirect, route, store }) {
  console.log('PATH', route.path)
  if (route.path !== '/' && route.path !== '/welcome' && route.path !== '/reset_password') {
    if (!store.state.token) {
      redirect({ path: '/', query: { invalid_token: 'Debe iniciar sesión' } })
    } else if (!store.state.studentInfo) {
      store.dispatch('initialize')
    }
  }
  return true
}
