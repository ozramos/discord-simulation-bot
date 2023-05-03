require('dotenv').config()
const {openai} = require('../../openai')
const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')

// In the form {userID: [{role: 'user', content: 'message'}, ...]}
const memory = {}

module.exports = {
  cooldown: 1,
  
  // Definition
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Prompt the bot to get a text response')
		.addStringOption(option => option.setName('prompt')
      .setDescription('The message to send to the bot.')
      .setRequired(true)
    ),
  
  // Execution
  async execute(interaction) {
    // Get the user's memory
    let messages = []
    if (memory[interaction.user.id]) {
      messages = memory[interaction.user.id]
    }
    
    await interaction.deferReply()
    messages.push({role: 'user', content: interaction.options.getString('prompt', true)})
    memory[interaction.user.id] = messages

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages
    })

    try {
      // Show an embed, with the users avatar and original prompt
      // Uses the description field to display the bot's response
      // Uses the footer field to show the time taken to generate the response
      const embed = new EmbedBuilder()
        .setAuthor({name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL()})
        .setDescription(interaction.options.getString('prompt', true))
        
      await interaction.editReply({embeds: [embed]})
      await interaction.followUp({content: completion.data.choices[0].message.content})

      // Add to memory
      if (memory[interaction.user.id]) {
        memory[interaction.user.id].push({role: 'user', content: interaction.options.getString('prompt', true)})
        memory[interaction.user.id].push({role: 'assistant', content: completion.data.choices[0].message.content})
      } else {
        memory[interaction.user.id] = [
          {role: 'user', content: interaction.options.getString('prompt', true)},
          {role: 'assistant', content: completion.data.choices[0].message.content}
        ]
      }
    } catch (e) {
      console.error(e)
      await interaction.editReply('Something went wrong!')
    }
  }
}