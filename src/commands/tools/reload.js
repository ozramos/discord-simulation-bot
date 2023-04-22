// Reloads a command. This is useful for development.
// https://discordjs.guide/additional-features/reloading-commands.html#resulting-code
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption(option => option.setName('command')
      .setDescription('The command to reload.')
      .setRequired(true)
    ),
	
  async execute(interaction) {
    const commandPath = interaction.options.getString('command', true).toLowerCase();
		const commandName = commandPath.split('/').pop();
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			return interaction.reply(`There is no command with name \`${commandName}\`!`);
		}

    // Delete and re-require the command file
    delete require.cache[require.resolve(`../${commandPath}.js`)];
    try {
      interaction.client.commands.delete(command.data.name);
      const newCommand = require(`../${commandPath}.js`);
      interaction.client.commands.set(newCommand.data.name, newCommand);
      await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
    } catch (error) {
      console.error(error);
      await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
    }    
  },
};