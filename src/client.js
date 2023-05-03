const {Client, GatewayIntentBits} = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })

module.exports = client