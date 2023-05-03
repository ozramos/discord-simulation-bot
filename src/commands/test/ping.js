const {SlashCommandBuilder} = require('discord.js')

module.exports = {
  cooldown: 5,
  
  // Definition
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  
  // Execution
  async execute(interaction) {
    await interaction.reply('Pong!')
  }
}