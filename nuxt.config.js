import webpack from 'webpack'

export default {
  server: {
    port: 8000
  },
  env: {
    BASE_PATH: process.env.BASE_PATH,
    BASE_PATH_BUBBLE: process.env.BASE_PATH_BUBBLE,
    IN_MAINTENANCE: process.env.IN_MAINTENANCE || false,
    DEVELOP: process.env.DEVELOP || false
  },
  ssr: false,
  // mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.NAME || 'MedCoach',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', 
        name: 'description', 
        content: 'Curso en línea para el Examen Nacional para Aspirantes a Residencias Médicas (ENARM). Usa nuestro calendario personalizado, manuales, guías, exámenes, simuladores, notas y asesorías para aumentar tus posibilidades de pasar. Entra a la especialidad a la primera.'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'https://s3.amazonaws.com/appforest_uf/f1579284400919x190003394063938080/Stripe.png' },
      { href: './assets/fonts/AvenirLTStd/AvenirLTStd-Black.otf', crossorigin: 'anonymous' },
      { href: './assets/fonts/AvenirLTStd/AvenirLTStd-BlackOblique.otf', crossorigin: 'anonymous' },
      { href: './assets/fonts/AvenirLTStd/AvenirLTStd-Book.otf', crossorigin: 'anonymous' },
      { href: './assets/fonts/AvenirLTStd/AvenirLTStd-BookOblique.otf', crossorigin: 'anonymous' },
      { href: './assets/fonts/AvenirLTStd/AvenirLTStd-Heavy.otf', crossorigin: 'anonymous' },
      { href: './assets/fonts/AvenirLTStd/AvenirLTStd-HeavyOblique.otf', crossorigin: 'anonymous' },
      { href: './assets/fonts/AvenirLTStd/AvenirLTStd-Light.otf', crossorigin: 'anonymous' },
      { href: './assets/fonts/AvenirLTStd/AvenirLTStd-LightOblique.otf', crossorigin: 'anonymous' },
      { href: './assets/fonts/AvenirLTStd/AvenirLTStd-Medium.otf', crossorigin: 'anonymous' },
      { href: './assets/fonts/AvenirLTStd/AvenirLTStd-MediumOblique.otf', crossorigin: 'anonymous' },
      { href: './assets/fonts/AvenirLTStd/AvenirLTStd-Oblique.otf', crossorigin: 'anonymous' },
      { href: './assets/fonts/AvenirLTStd/AvenirLTStd-Roman.otf', crossorigin: 'anonymous' },
      { href: './assets/lotties/85744-success.json', crossorigin: 'anonymous' }
    ],
    script: [
      { src: 'https://kit.fontawesome.com/b9fa278f43.js', crossorigin:'anonymous' },
      { src: 'https://pay.conekta.com/v1.0/js/conekta-checkout.min.js' },
      { src: 'https://unpkg.com/@lottiefiles/lottie-player@0.4.0/dist/lottie-player.js' }
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
    // theme fonts css
    '@assets/css/variables/fonts.scss',
    // theme font styles css
    '@assets/css/variables/font-styles.scss',
    // color-palette
    '@assets/css/_custom_theme.scss',
    // dashboard css
    '@assets/css/main.css',
    // settings css
    '@assets/css/settings.scss',
    // diagnostic_test css
    '@assets/css/diagnostic_test.scss',
    // index/reset_password css
    '@assets/css/index.css',
    // simulator scss
    '@assets/css/simulator.scss',
    // margins utilities
    '@assets/css/margins.scss',
    // navigation sidenar
    '@assets/css/navigation.scss',
    // buttons styles
    '@assets/css/buttons.scss',
    // text styles
    '@assets/css/text.scss',
    // link styles
    '@assets/css/links.scss',
    // overrided shadows styles
    '@assets/css/shadows.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/nuxt-quill-plugin', ssr: false },
    { src: '~plugins/vue-event-calendar-plugin', ssr:false },
    { src: '~plugins/vue-simple-context-menu-plugin', ssr:false },
    { src: '~plugins/vue-toastr-plugin', ssr:false },
    { src: '~plugins/vue-flip-plugin', ssr:false },
    { src: '~/plugins/axios'},
    { src: '~/plugins/vee-validate-plugin.js' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/google-analytics',
    // Módulo de Google Tag Manager
    ['@nuxtjs/google-tag-manager', { id: 'GTM-5VLX7QB' }]
  ],
  googleAnalytics: {
    id: 'UA-166259562-2'
  },
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
