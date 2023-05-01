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
  // Get the user's memory
  let messages = []
  if (Memory.store[message.user.id]) {
    messages = Memory.store[message.user.id]
  }

  // show the user's memory
  await message.reply({content: 'Simulation Memory:',
    embeds: [
      new EmbedBuilder()
        .setTitle('Memory')
        .setDescription(messages.map(m => `${m?.role}: ${m?.content}`).join('\n'))
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