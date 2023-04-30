import { getDirname, path } from '@vuepress/utils'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'

const __dirname = getDirname(import.meta.url)

export default {
  plugins: [
    registerComponentsPlugin({
      components: {
        WidgetBot: path.resolve(__dirname, './components/WidgetBot.vue'),
      },
    }),
  ],
}