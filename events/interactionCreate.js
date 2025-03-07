const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require('discord.js');
const { formatDate } = require('../utils/dateFormatter');
const { db } = require('../DataBase');

function createButtonRow(creatorId, entryNumber, isCheckoutComplete = false) {
    return new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
          .setCustomId(`checkout_${creatorId}_${entryNumber}`)
          .setLabel('CheckOut')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(isCheckoutComplete), // Disable if checkout is complete
        new ButtonBuilder()
          .setCustomId(`newcheckin_${creatorId}`)
          .setLabel('New CheckIn')
          .setStyle(ButtonStyle.Success)
          .setDisabled(!isCheckoutComplete), // Only enable if checkout is complete
        new ButtonBuilder()
          .setCustomId(`endday_${creatorId}`)
          .setLabel('EndDay')
          .setStyle(ButtonStyle.Danger)
    );
}
  
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
  

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
        const isAllowedUser = db.prepare('SELECT * FROM users WHERE discord_id = ?').get(interaction.user.id);
        if (!isAllowedUser) {
            return await interaction.reply({
                content: 'You are not authorized to use this command.',
                flags: MessageFlags.Ephemeral
            });
        }

      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
      }
      return;
    }

    // Handle button interactions
    if (interaction.isButton()) {
      // Extract the user ID and potentially entry number from the button ID
      const parts = interaction.customId.split('_');
      const action = parts[0];
      const creatorId = parts[1];
      const entryNumber = parts[2] ? parseInt(parts[2]) : null;
      
      // Security check: Only the creator can use the buttons
      if (interaction.user.id != creatorId) {
        return await interaction.reply({ 
          content: "You cannot interact with someone else's session.", 
          flags: MessageFlags.Ephemeral
        });
      }
      
      // Get the original message and its embeds
      const message = interaction.message;
      const currentEmbeds = [...message.embeds.map(embed => EmbedBuilder.from(embed))]; // Create a copy of the embeds
      
      if (action === 'checkout') {
        // 1. Set the exit time on the specific embed
        const now = new Date();
        
        // 2. Show modal for sanctions and tickets
        const modal = new ModalBuilder()
          .setCustomId(`checkoutmodal_${creatorId}_${entryNumber}_${(formatDate(now) + ' (UTC)').replace(" ", "-")}`)
          .setTitle(`Session Details - Entry ${entryNumber}`);
          
        const sanctionsInput = new TextInputBuilder()
          .setCustomId('sanctions')
          .setLabel('Number of Sanctions')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('00')
          .setMaxLength(2);
          //.setRequired(true);
          
        const ticketsInput = new TextInputBuilder()
          .setCustomId('tickets')
          .setLabel('Number of Tickets')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('00')
          .setMaxLength(2);
          //.setRequired(true);
          
        const sanctionsRow = new ActionRowBuilder().addComponents(sanctionsInput);
        const ticketsRow = new ActionRowBuilder().addComponents(ticketsInput);
        
        modal.addComponents(sanctionsRow, ticketsRow);
        
        await interaction.showModal(modal);
        return;
      }
      
      else if (action === 'newcheckin') {
        const newEntryNumber = currentEmbeds.length + 1;
        const now = new Date();
        const username = interaction.user.username;
        
        const newEmbed = new EmbedBuilder()
          .setTitle(`Entrada ${newEntryNumber}`)
          .setColor(getRandomColor())
          .addFields(
            { name: 'Usuario de Minecraft', value: username },
            { name: 'Hora de entrada', value: formatDate(now) + ' (UTC)' },
            { name: 'Hora de salida', value: '\u200B' },
            { name: 'Sanciones', value: '00', inline: true },
            { name: 'Tickets', value: '00', inline: true }
          );
        
        currentEmbeds.push(newEmbed);
        
        // Create button row with NewCheckIn disabled for the new entry
        const row = createButtonRow(creatorId, newEntryNumber, false);
          
        await interaction.update({ 
          embeds: currentEmbeds,
          components: [row]
        });
      }
      
      else if (action === 'endday') {
        // Finalize the report and remove the buttons
        await interaction.update({ 
          embeds: currentEmbeds, 
          components: [] 
        });
      }
    }

    // Handle modal submissions for sanctions and tickets
    if (interaction.isModalSubmit()) {
      // Extract information from the modal ID
      const parts = interaction.customId.split('_');
      const modalBase = parts[0];
      const creatorId = parts[1];
      const entryNumber = parseInt(parts[2]);
      const exitTime = parts[3].replace("-", " ");
      
      // Security check: Only the creator can submit the modal
      if (interaction.user.id !== creatorId) {
        return await interaction.reply({ 
          content: "You cannot submit details for someone else's session.", 
          flags: MessageFlags.Ephemeral
        });
      }
      
      if (modalBase === 'checkoutmodal') {
        const sanctions = interaction.fields.getTextInputValue('sanctions').padStart(2, "0") || '00';
        const tickets = interaction.fields.getTextInputValue('tickets').padStart(2, "0") || '00';
        
        const message = interaction.message;
        const currentEmbeds = [...message.embeds.map(embed => EmbedBuilder.from(embed))];
        
        // Update exit time, sanctions and tickets
        currentEmbeds[entryNumber-1].data.fields[2] = { name: 'Hora de salida', value: exitTime };
        currentEmbeds[entryNumber-1].data.fields[3] = { name: 'Sanciones', value: ""+sanctions, inline: true };
        currentEmbeds[entryNumber-1].data.fields[4] = { name: 'Tickets', value: ""+tickets, inline: true };
        
        // Create updated button row with NewCheckIn enabled
        const updatedRow = createButtonRow(creatorId, entryNumber, true);
        
        await interaction.update({ 
          embeds: currentEmbeds,
          components: [updatedRow]
        });
      }
    }
  },
};
