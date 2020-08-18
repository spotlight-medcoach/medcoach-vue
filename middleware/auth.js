export default function auth ({ redirect, route, store }) {
  const timer = store.state.custom_test.timer
  if (timer) {
    clearInterval(timer)
  }
  if (route.name !== 'index' && route.name !== 'welcome' && route.name !== 'reset_password') {
    if (!store.state.token) {
      redirect({ path: '/', query: { invalid_token: 'Debe iniciar sesión' } })
    } else if (!store.state.studentInfo) {
      store.dispatch('initialize')
    }
  }
  return true
}
