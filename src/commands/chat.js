require('dotenv').config()
const {openai} = require('../openai')
const {SlashCommandBuilder, EmbedBuilder, Client, Events, GatewayIntentBits} = require('discord.js')
const {MessageType} = require('discord-api-types/v10')
const client = require('../client.js')
const Memory = require('../memory.js')

/**
 * Handle replies to /chat embeds
 */
client.on(Events.MessageCreate, async message => {
  if (message.type === MessageType.Reply) {
    const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
    // check if the replied message was sent by the bot
    if (repliedMessage.embeds?.[0] && repliedMessage.author.bot && repliedMessage.author.id === client.user.id) {
      // get the original poster's id from the embed
      const origPosterName = repliedMessage.embeds[0].author.name

      // reply to the original poster with a mention
      if (message.author.username + '#' + message.author.discriminator !== origPosterName && message.author.id !== client.user.id) {
        message.channel.send(`<@${message.author.id}>`)
      }
    }

    /**
     * User replied to the bot, so we need to:
     * 1. Get the user's memory
     * 2. Add the user's message to their memory
     * 3. Add the bot's response to their memory
     * 4. Reply to the user with the bot's response
     */
    if (repliedMessage.author.id === client.user.id) {
      // Get the user's memory
      let messages = []
      if (Memory.store[repliedMessage.author.name]) {
        messages = Memory.store[repliedMessage.author.name]
      }
      
      // Add the user's message to their memory
      messages.push({role: 'user', content: message.content})
      Memory.store[repliedMessage.author.name] = messages

      // Generate a response
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages
      })

      // Add the bot's response to the user's memory
      if (Memory.store[repliedMessage.author.name]) {
        Memory.store[repliedMessage.author.name].push({role: 'assistant', content: completion.data.choices[0].message.content})
      } else {
        Memory.store[repliedMessage.author.name] = [
          {role: 'assistant', content: completion.data.choices[0].message.content}
        ]
      }

      // Reply to the user with the bot's response
      await message.reply({content: completion.data.choices[0].message.content})
    }
  }
})




/**
 * Handle slash command
 */
async function execute (message) {
  // Get the user's memory
  let messages = []
  if (Memory.store[message.user.id]) {
    messages = Memory.store[message.user.id]
  }
  
  await message.deferReply()
  messages.push({role: 'user', content: message.options.getString('prompt', true)})
  Memory.store[message.user.id] = messages

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages
  })

  try {
    // Show an embed, with the users avatar and original prompt
    // Uses the description field to display the bot's response
    // Uses the footer field to show the time taken to generate the response
    const embed = new EmbedBuilder()
      .setAuthor({name: `${message.user.username}#${message.user.discriminator}`, iconURL: message.user.displayAvatarURL()})
      .setDescription(message.options.getString('prompt', true))
      
    await message.editReply({embeds: [embed]})
    await message.followUp({content: completion.data.choices[0].message.content})

    // Add to memory
    if (Memory.store[message.user.id]) {
      Memory.store[message.user.id].push({role: 'user', content: message.options.getString('prompt', true)})
      Memory.store[message.user.id].push({role: 'assistant', content: completion.data.choices[0].message.content})
    } else {
      Memory.store[message.user.id] = [
        {role: 'user', content: message.options.getString('prompt', true)},
        {role: 'assistant', content: completion.data.choices[0].message.content}
      ]
    }
  } catch (e) {
    console.error(e)
    await message.editReply('Something went wrong!')
  }
}


/**
 * Handle slash command
 */
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
  execute
}