const { MessageEmbed } = require("discord.js");

// Emitido quando um comando e bloqueado de ser executado
module.exports = async (cmd, err, msg) => { //args
    try {
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return client.log("aviso", "A mensagem de erro não foi enviada por falta de permissões")

        client.log("erro", err.stack)
        client.log("comando", `Ocorreu um erro em ${cmd.name} ao ser executado por @${msg.author.tag}`, "erro");

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.erro)
            .setTitle('❗ Ocorreu um erro ao executar esse comando')
            .setDescription('fale com o <@252902151469137922> para arrumar isso.');
        msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch();
    } catch (err) {
        client.log("erro", err.stack)
    }
}