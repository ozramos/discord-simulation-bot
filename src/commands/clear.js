require('dotenv').config()
const {SlashCommandBuilder} = require('discord.js')
const Memory = require('../memory.js')

/**
 * Handle slash command
 */
module.exports = {
  cooldown: .5,
  
  // Definition
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear the bot\'s memory.'),
  
  // Execution
  async execute(interaction) {
    Memory.clear()
    await interaction.reply('Memory cleared.')
  }
}