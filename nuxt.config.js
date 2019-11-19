
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Josefin+Sans|Sniglet|Ubuntu|Ubuntu+Mono&display=swap' }
    ],
    bodyAttrs: {
        style: 'margin: 0;padding: 0;font-family: "Josefin Sans";background-color: #F7F7FF;'
    },
    script: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js' },
        { src: 'https://cdn.jsdelivr.net/npm/chart.js@2.9.1/dist/Chart.min.js' },
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
      '~/assets/tailwind.min.css',
      '~/assets/modal.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/firebase.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
        if (ctx.isClient) {
            config.devtool = '#source-map';
        }
    }
  }
}
