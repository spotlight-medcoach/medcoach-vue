import webpack from 'webpack'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.NAME || 'MedCoach',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    // ...
    'quill/dist/quill.core.css',
    // for snow theme
    'quill/dist/quill.snow.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/nuxt-quill-plugin', ssr: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],

  bootstrapVue: {
      bootstrapCSS: true, // Or `css: false`
      bootstrapVueCSS: true, // Or `bvCSS: false`
      icons: true // Install the IconsPlugin (in addition to BootStrapVue plugin
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: 'https://wup7ric684.execute-api.us-west-2.amazonaws.com/refinery/api',
    https: true
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: ['bootstrap-vue'],
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js'
      })
    ],
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
