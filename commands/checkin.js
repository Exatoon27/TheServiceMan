const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { formatDate } = require('../utils/dateFormatter');
const { db } = require('../DataBase');

function createButtonRow(creatorId, entryNumber, isCheckoutComplete = false) {
    return new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId(`checkout_${creatorId}_${entryNumber}`)
        .setLabel('CheckOut')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(isCheckoutComplete),
        new ButtonBuilder()
        .setCustomId(`newcheckin_${creatorId}`)
        .setLabel('New CheckIn')
        .setStyle(ButtonStyle.Success)
        .setDisabled(!isCheckoutComplete), // Disabled by default for new check-ins
        new ButtonBuilder()
        .setCustomId(`endday_${creatorId}`)
        .setLabel('EndDay')
        .setStyle(ButtonStyle.Danger)
    );
}

  module.exports = {
    data: new SlashCommandBuilder()
      .setName('checkin')
      .setDescription('Start a new check-in session'),
      
    async execute(interaction) {
      const now = new Date();
      const userId = interaction.user.id;
      const username = db.prepare('SELECT minecraft_nick FROM users WHERE discord_id = ?').get(userId).minecraft_nick;
      
      const embed = new EmbedBuilder()
        .setTitle(`Entrada 1`)
        .setColor('#0099ff')
        .addFields(
          { name: 'Usuario de Minecraft', value: username },
          { name: 'Hora de entrada', value: formatDate(now) + ' (UTC)' },
          { name: 'Hora de salida', value: '\u200B' },
          { name: 'Sanciones', value: '00', inline: true },
          { name: 'Tickets', value: '00', inline: true }
        );
      
      const embeds = [embed];
      
      // Create initial button row with NewCheckIn disabled
      const row = createButtonRow(userId, 1, false);
        
      await interaction.reply({
        embeds: embeds,
        components: [row]
      });
    },
  };
