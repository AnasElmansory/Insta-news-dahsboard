export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'insta-news',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=yes' },
      {
        name: 'google-signin-client_id',
        content:
          '470992764007-gqf838puqn68v9k528ft9u9d5e4hgsgp.apps.googleusercontent.com',
      },
    ],
    script: [
      {
        src: 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v11.0&appId=371234107550950&autoLogAppEvents=1',
        defer: true,
        async: true,
        crossorigin: 'anonymous',
        nonce: 'g4LQY4f5',
      },
      // <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v11.0&appId=237869291357835&autoLogAppEvents=1" nonce="g4LQY4f5"></script>
    ],
    link: [{ rel: 'icon', type: 'image/png', href: '/favicon-32x32.png' }],
  },

  target: 'static',
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@mdi/font/css/materialdesignicons.min.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    './plugins/bootstrap-icons',
    { src: './plugins/responsive.ts', mode: 'client' },
    { src: './plugins/vue-google-oauth2.ts', mode: 'client' },
    { src: './plugins/auth/facebook.ts', mode: 'client' },
  ],
  transpileDependencies: ['vuex-module-decorators'],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    ['@nuxtjs/vuetify', { iconfont: 'mdi' }],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      compact: true,
    },
  },
}
