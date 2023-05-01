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
  // Clear and update the memory
  Memory.clear()
  Memory.push({role: 'user', content: `The following contains your core memory for this prompt session:\n\n` + message.options.getString('prompt', true)})

  // show the user's memory
  await message.reply({content: 'Memory updated'})
  // Trigger the /memory command
  // await client.commands.get('memory').execute(message)
}

module.exports = {
  execute,
  cooldown: 0.5,
  data: new SlashCommandBuilder()
    .setName('memoryupdate')
    .setDescription('Update the bots memory')
    .addStringOption(option => option.setName('prompt')
      .setDescription('The full memory to update the bot with')
      .setRequired(true))
}