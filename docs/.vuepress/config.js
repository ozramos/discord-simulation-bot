import { getDirname, path } from '@vuepress/utils'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import * as dotenv from 'dotenv'

dotenv.config()
const __dirname = getDirname(import.meta.url)

export default {
  // previous configuration
  define: {
    ...process.env,
  },

  plugins: [
    registerComponentsPlugin({
      components: {
        WidgetBot: path.resolve(__dirname, './components/WidgetBot.vue'),
      },
    }),
  ],
}