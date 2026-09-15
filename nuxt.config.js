import webpack from 'webpack';

/**
 * Rutas que los correos de la API enlazan con una grafía que este SPA no tiene.
 * La API es la misma Lambda para V1 y V2, y sus plantillas arman los enlaces
 * con las rutas del app V2 (Next, kebab-case), mientras que aquí las páginas
 * son pages/*.vue con guion bajo. La grafía que no existe no degrada: el
 * alumno cae en el 404 del SPA con un token válido en la query.
 *
 * Se aceptan como alias en lugar de -o además de- corregir el correo, porque
 * los que ya están en las bandejas no se pueden reescribir.
 *
 * Tiene que ser `alias` y no una segunda ruta: el middleware auth autoriza por
 * nombre de ruta, y una ruta duplicada -que vue-router obliga a nombrar
 * distinto- quedaría fuera de PUBLIC_ROUTES y rebotaría al alumno al login,
 * cambiando un callejón sin salida por otro.
 *
 * Clave: nombre de la ruta de Nuxt (derivado de pages/). Valor: la grafía que
 * llega desde fuera.
 */
const EXTERNAL_LINK_ALIASES = {
  // Correo de bienvenida / invitación (admin/email.service.ts).
  complete_registration: '/complete-registration',
  // Correo de recuperación de contraseña (student/email.service.ts).
  reset_password: '/reset-password',
  // Correo de credenciales (student/email.service.ts) apunta a /login, que en
  // V1 no existe como página: el login vive en la landing, pages/index.vue.
  index: '/login',
};

export default {
  server: {
    port: 3003,
  },
  env: {
    BASE_PATH:
      process.env.BASE_PATH ||
      'https://1q66rzf5zl.execute-api.us-east-1.amazonaws.com/api',
    BASE_PATH_BUBBLE: process.env.BASE_PATH_BUBBLE,
    IN_MAINTENANCE: process.env.IN_MAINTENANCE || false,
    STORAGE_BASE_URL: process.env.STORAGE_BASE_URL || false,
    SIMULATORS_URL: process.env.SIMULATORS_URL || 'http://localhost:3008',
    DEVELOP: process.env.DEVELOP || false,
    NAME: process.env.NAME || 'MedCoach',
    CONEKTA_PUBLIC_KEY:
      process.env.DEVELOP === 'true'
        ? process.env.CONEKTA_PUBLIC_KEY
        : process.env.CONEKTA_PUBLIC_KEY_PROD,
  },
  ssr: false,
  // mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'MedCoach SpotlightMed',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Curso en línea para el Examen Nacional para Aspirantes a Residencias Médicas (ENARM). Usa nuestro calendario personalizado, manuales, guías, exámenes, simuladores, notas y asesorías para aumentar tus posibilidades de pasar. Entra a la especialidad a la primera.',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: 'https://s3.amazonaws.com/appforest_uf/f1579284400919x190003394063938080/Stripe.png',
      },
      {
        href: './assets/fonts/AvenirLTStd/AvenirLTStd-Black.otf',
        crossorigin: 'anonymous',
      },
      {
        href: './assets/fonts/AvenirLTStd/AvenirLTStd-BlackOblique.otf',
        crossorigin: 'anonymous',
      },
      {
        href: './assets/fonts/AvenirLTStd/AvenirLTStd-Book.otf',
        crossorigin: 'anonymous',
      },
      {
        href: './assets/fonts/AvenirLTStd/AvenirLTStd-BookOblique.otf',
        crossorigin: 'anonymous',
      },
      {
        href: './assets/fonts/AvenirLTStd/AvenirLTStd-Heavy.otf',
        crossorigin: 'anonymous',
      },
      {
        href: './assets/fonts/AvenirLTStd/AvenirLTStd-HeavyOblique.otf',
        crossorigin: 'anonymous',
      },
      {
        href: './assets/fonts/AvenirLTStd/AvenirLTStd-Light.otf',
        crossorigin: 'anonymous',
      },
      {
        href: './assets/fonts/AvenirLTStd/AvenirLTStd-LightOblique.otf',
        crossorigin: 'anonymous',
      },
      {
        href: './assets/fonts/AvenirLTStd/AvenirLTStd-Medium.otf',
        crossorigin: 'anonymous',
      },
      {
        href: './assets/fonts/AvenirLTStd/AvenirLTStd-MediumOblique.otf',
        crossorigin: 'anonymous',
      },
      {
        href: './assets/fonts/AvenirLTStd/AvenirLTStd-Oblique.otf',
        crossorigin: 'anonymous',
      },
      {
        href: './assets/fonts/AvenirLTStd/AvenirLTStd-Roman.otf',
        crossorigin: 'anonymous',
      },
      { href: './assets/lotties/85744-success.json', crossorigin: 'anonymous' },
    ],
    script: [
      {
        src: 'https://kit.fontawesome.com/b9fa278f43.js',
        crossorigin: 'anonymous',
      },
      { src: 'https://pay.conekta.com/v1.0/js/conekta-checkout.min.js' },
      {
        src: 'https://unpkg.com/@lottiefiles/lottie-player@0.4.0/dist/lottie-player.js',
      },
      {
        src:
          process.env.DEVELOP === 'true'
            ? '/js/userback-test.js'
            : '/js/userback.js',
      },
    ],
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
    '@assets/css/shadows.scss',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~plugins/nuxt-quill-plugin', ssr: false },
    { src: '~plugins/vue-event-calendar-plugin', ssr: false },
    { src: '~plugins/vue-simple-context-menu-plugin', ssr: false },
    { src: '~plugins/vue-toastr-plugin', ssr: false },
    { src: '~plugins/vue-flip-plugin', ssr: false },
    { src: '~/plugins/axios' },
    { src: '~/plugins/vee-validate-plugin.js' },
    { src: '~/plugins/vue-phone-number-input.js' },
    { src: '~/plugins/heartbeat.js', mode: 'client' },
    { src: '~/plugins/report-widget.js', mode: 'client' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/google-analytics',
    // Módulo de Google Tag Manager
    ['@nuxtjs/google-tag-manager', { id: 'GTM-5VLX7QB' }],
  ],
  googleAnalytics: {
    id: 'UA-166259562-2',
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
    '@nuxtjs/dotenv',
  ],

  bootstrapVue: {
    bootstrapCSS: true, // Or `css: false`
    bootstrapVueCSS: true, // Or `bvCSS: false`
    icons: true, // Install the IconsPlugin (in addition to BootStrapVue plugin
  },
  /*
   ** Build configuration
   */
  build: {
    transpile: ['bootstrap-vue'],
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        Quill: 'quill/dist/quill.js',
      }),
    ],
    /*
     ** You can extend webpack config here
     */
    extend (config, ctx) {},
  },
  /*
   ** Middlewares
   */
  router: {
    middleware: ['auth'],
    extendRoutes (routes) {
      for (const [name, alias] of Object.entries(EXTERNAL_LINK_ALIASES)) {
        const route = routes.find((r) => r.name === name);
        if (route) {
          route.alias = alias;
        }
      }
    },
  },
};
