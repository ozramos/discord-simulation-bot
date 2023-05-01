import { getDirname, path } from '@vuepress/utils'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { defaultTheme } from '@vuepress/theme-default'
import * as dotenv from 'dotenv'

dotenv.config()
const __dirname = getDirname(import.meta.url)

export default {
  title: 'Discord Simulation Bot',
  description: 'A single Discord bot that can simulate an entire server of interactive users',
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }]
  ],
  
  theme: defaultTheme({
    repo: '0xozram/discord-simulation-bot',
    logo: '/favicon.png',

    // Config
    colorMode: 'dark',
    navbar: [
      {
        text: 'Home',
        link: '/',
      },
    ],

  }),
  
  // Environment variables
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