const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

// Emitido quando o usuário é respondido por uma mensagem
module.exports = async (client, excTempo, cmd, msg, args) => {
    client.log("comando", `${client.commandPrefix}${cmd.name} foi respondido em ${(new Date().getTime() - excTempo.getTime())}ms`);
}