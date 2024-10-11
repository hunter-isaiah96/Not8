import "@mdi/font/css/materialdesignicons.css"

import "vuetify/styles"
import { createVuetify, type ThemeDefinition } from "vuetify"

const myCustomDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: "#040B1B",
    surface: "#1C222E",
    primary: "#5B52FE",
    "primary-darken-1": "#20222B",
    secondary: "#03DAC6",
    "secondary-darken-1": "#018786",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
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
