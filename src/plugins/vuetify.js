import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#D4A5A5',
          secondary: '#9CAF88',
          accent: '#E8B4B8',
          background: '#FDF2F8',
        },
      },
    },
  },
})
