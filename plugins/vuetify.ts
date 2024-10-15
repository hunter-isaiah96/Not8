import "@mdi/font/css/materialdesignicons.css"

import "vuetify/styles"
import { createVuetify, type ThemeDefinition } from "vuetify"

const myCustomDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: "#040B1B",
    surface: "#1C222E",
    primary: "#5B52FE",
  },
}

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "myCustomDarkTheme",
      themes: {
        myCustomDarkTheme,
      },
    },
  })
  app.vueApp.use(vuetify)
})
