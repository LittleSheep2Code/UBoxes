module.exports = function () {
  return {
    supportTS: false,
    boot: [
      "i18n",
      "axios",
    ],

    css: [
      "app.scss"
    ],

    extras: [
      "mdi-v5",

      "roboto-font",
      "material-icons",
    ],

    build: {
      vueRouterMode: "history",
    },

    devServer: {
      https: false,
      port: 8080,
      open: true
    },

    framework: {
      iconSet: "material-icons",
      lang: "en-us",

      config: {},
      importStrategy: "auto",

      plugins: [
        "Cookies"
      ]
    },

    animations: "all",

    ssr: {
      pwa: false
    },

    pwa: {
      workboxPluginMode: "GenerateSW",
      workboxOptions: {},
      manifest: {
        name: `UBoxes`,
        short_name: `UBoxes`,
        description: `A powerful programmer toolbox`,
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#027be3",
        icons: [
          {
            src: "icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    },

    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      bundler: "builder",
      builder: {
        appId: "UBoxes"
      },

      nodeIntegration: true,
    }
  }
}
