export default function auth ({ redirect, route, store }) {
  if (route.path !== '/' && route.path !== 'welcome') {
    if (!store.state.token) {
      redirect({ path: '/', query: { invalid_token: 'Debe iniciar sesión' } })
    } else if (!store.state.studentInfo) {
      store.dispatch('initialize')
    }
  }
  return true
}
