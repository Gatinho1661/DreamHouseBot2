const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

// Emitido quando um comando é executado
module.exports = async (client, excTempo, cmd, msg, args) => {
    client.log("comando", `${client.commandPrefix}${cmd.name} foi executado em ${(new Date().getTime() - excTempo.getTime())}ms`);
}