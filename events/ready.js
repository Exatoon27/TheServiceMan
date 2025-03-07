const { ActivityType, Client } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
      client.user.setStatus('dnd');
      console.log(`Ready! Logged in as ${client.user.tag}`);
    },
  };
  