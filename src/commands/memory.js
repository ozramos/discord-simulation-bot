require('dotenv').config()
const {openai} = require('../openai')
const {SlashCommandBuilder, EmbedBuilder, Client, Events, GatewayIntentBits} = require('discord.js')
const {MessageType} = require('discord-api-types/v10')
const client = require('../client.js')
const Memory = require('../memory.js')

/**
 * Handle slash command
 */
async function execute (message) {
  // Get memory
  const messages = Memory.get()

  // show the user's memory
  await message.reply({embeds: [
      new EmbedBuilder()
        .setTitle('Memory')
        .setDescription(messages.length ? messages.map(m => `${m?.role}: ${m?.content}`).join('\n') : 'No memory yet')
    ]
  })
}

module.exports = {
  execute,
  cooldown: 0.5,
  data: new SlashCommandBuilder()
    .setName('memory')
    .setDescription('Interactively tinker with the bots memory'),
}