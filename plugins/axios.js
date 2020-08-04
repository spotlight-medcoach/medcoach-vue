export default function ({ $axios, redirect, store }) {
  // Base URL
  $axios.setBaseURL('https://wup7ric684.execute-api.us-west-2.amazonaws.com/refinery/api')
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
