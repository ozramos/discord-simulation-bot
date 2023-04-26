require('dotenv').config()
const fs = require('node:fs')
const path = require('node:path')
const {Client, Collection, Events, GatewayIntentBits} = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds] })



/**
* Load commands
* - Loads all commands in ./commands
*/
client.commands = new Collection()
client.cooldowns = new Collection()

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder)
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command)
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
  }
}


/**
* Respond to events
*/
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return
  
  // Bail if no command
  const command = interaction.client.commands.get(interaction.commandName)
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }
  
  // Cooldowns
  const {cooldowns} = client
  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection())
  }	
  const now = Date.now()
  const timestamps = cooldowns.get(command.data.name)
  const defaultCooldownDuration = 3
  const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000
  
  // Bail if on cooldown
  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount
    
    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000)
      return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true })
    }
  }	
  
  // Add to cooldowns...and remove after cooldown
  timestamps.set(interaction.user.id, now)
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)	
  
  // Run the command
  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
  }  
  
  console.log(interaction)
})




/**
* Called after the client is ready
* @param c {Client} The client
*/
client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`)
})

client.login(process.env.DISCORD_TOKEN)