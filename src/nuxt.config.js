module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'id',
    },
    title: "Stonary - Sebuah platform berbasis komunitas untuk membantu usaha mikro dan kecil berkembang.",
    meta: [
      {
        charset: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        "http-equiv": "X-UA-Compatible",
        "content": "ie=edge"
      },
      {
        name: "application-name",
        content: "Stonary"
      },
      {
        hid: "general",
        name: "description",
        content: "Stonary adalah sebuah platform berbasis komunitas (community-based), di mana siapapun dapat membantu bisnis mikro dan kecil untuk berkembang dengan cara berkontribusi untuk mengorganisir informasi secara publik."
      },
      {
        name: "keywords",
        content: "Stonary, Community, Komunitas, Business, Bisnis Mikro, Bisnis Kecil, Bisnis Lokal, Merchant, Product, Service, Item, Penjual, Pedagang, Produk, Jasa"
      },
    ],
    link: [
      {
        rel: "icon",
        href: "https://img.icons8.com/cotton/64/000000/network.png"
      },
      { // Roboto and Google Icons
        rel: "stylesheet",
        href: "//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons"
      },
      { // Font Awesome Icon Library
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      },
      { // CSS Shake
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/csshake/1.5.3/csshake-default.min.css"
      },
      { // UIKit
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/uikit@3.3.1/dist/css/uikit.min.css"
      }
    ],
    script: [
      {
        src: "https://code.jquery.com/jquery-3.3.1.min.js",
        integrity: "sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=",
        crossorigin: "anonymous"
      },
      // UIKit
      {
        src: "https://cdn.jsdelivr.net/npm/uikit@3.3.1/dist/js/uikit.min.js",
        crossorigin: "anonymous",
        defer: true
      },
      {
        src: "https://cdn.jsdelivr.net/npm/uikit@3.3.1/dist/js/uikit-icons.min.js",
        crossorigin: "anonymous",
        defer: true
      },
      { // Lodash
        src: "https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js",
        crossorigin: "anonymous",
        defer: true
      }
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#3f51b5', // Indigo
    height: '5px'
  },
  css: [
    {
      src: "@/assets/styles/main.css",
      lang: "css"
    }
  ],
  /*
   ** Build configuration
   */
  buildDir: "../prod/server/nuxt",
  build: {
    publicPath: "/assets/",
    extractCSS: true,
    transpile: [/^vue2-google-maps($|\/)/],
    // babel: {
    //   presets: [
    //     'es2015',
    //     'stage-0'
    //   ],
    //   plugins: [
    //     ["transform-runtime", {
    //       "polyfill": true,
    //       "regenerator": true
    //     }],
    //   ]
    // },
    /*
     ** Run ESLint on save
     */
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        // config.module.rules.push({
        //   enforce: 'pre',
        //   test: /\.(js|vue)$/,
        //   loader: 'eslint-loader',
        //   exclude: /(node_modules)/
        // })
      }
    },
    // postcss: {
    //   plugins: {
    //     "postcss-custom-properties": false
    //   }
    // }
  },
 
  plugins: [
    /* COMPONENTS */
    '~/plugins/vue-browser-geolocation'
  ],
  vendor: ['vue2-google-maps'],
  modules: [
    ['nuxt-vue-material', {
      theme: 'default-dark'
    }],
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    'nuxt-leaflet'
  ],
  
  axios: {
    proxy: true
    // proxyHeaders: false
  },

  proxy: {
    '/api/': { target: 'https://maps.googleapis.com/', pathRewrite: {'^/api/': ''}, changeOrigin: true }
  }
};
