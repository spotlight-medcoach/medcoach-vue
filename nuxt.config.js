import webpack from 'webpack'

export default {
  env: {
    BASE_PATH: process.env.BASE_PATH
  },
  mode: 'spa',
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
      { rel: 'icon', type: 'image/x-icon', href: 'https://s3.amazonaws.com/appforest_uf/f1579284400919x190003394063938080/Stripe.png' },
      { rel: 'stylesheet', href:"https://fonts.googleapis.com/css2?family=Montserrat&display=swap"}
    ],
    script: [
      { src: 'https://kit.fontawesome.com/b9fa278f43.js', crossorigin:'anonymous' }
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
    'quill/dist/quill.snow.css',
    // main css
    '@assets/css/main.css',
    // dashboard css
    '@assets/css/dashboard.scss',
    // settings css
    '@assets/css/settings.scss',
    // diagnostic_test css
    '@assets/css/diagnostic_test.scss',
    // manual css
    '@assets/css/manual.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/nuxt-quill-plugin', ssr: false },
    { src: '~plugins/vue-event-calendar-plugin', ssr:false },
    { src: '~plugins/vue-simple-context-menu-plugin', ssr:false },
    { src: '~plugins/vue-toastr-plugin', ssr:false },
    { src: '~plugins/vue-html-to-paper-plugin', ssr:false },
    { src: '~plugins/vue-flip-plugin', ssr:false },
    { src: '~/plugins/axios'}
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
  },
  /*
  ** Middlewares
  */
  router: {
    middleware: ['auth']
  }
}
