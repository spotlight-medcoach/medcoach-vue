export default function ({ $axios, redirect, store }) {
  // Base URL
  $axios.setBaseURL(process.env.BASE_PATH)
  // Content Type
  $axios.setHeader('Content-Type', 'application/json')
  // Interceptors
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 403 || code === 402) {
      store.dispatch('killSession')
      redirect({ path: '/', query: { invalid_token: 'Su token ha expirado' } })
    }
  })
}
