require('dotenv').config()
const {openai} = require('../openai')
const {SlashCommandBuilder, EmbedBuilder, Client, Events, GatewayIntentBits} = require('discord.js')
const {MessageType} = require('discord-api-types/v10')
const client = require('../client.js')
const Memory = require('../memory.js')

/**
 * Handle slash commanda
 */
async function execute (message) {
  // Update the memory
  const messages = Memory.get()

  // show the user's memory
  await message.reply({content: 'Update Memory:',
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
    .setName('memoryupdate')
    .setDescription('Update the bots memory')
    .addStringOption(option => option.setName('memory')
      .setDescription('The full memory to update the bot with')
      .setRequired(true))
}