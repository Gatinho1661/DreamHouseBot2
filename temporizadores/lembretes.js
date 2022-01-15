// eslint-disable-next-line no-unused-vars
const { MessageEmbed, MessageButton, CommandInteraction, Role } = require("discord.js");
const cron = require('node-cron');

/**
 * Criar um lembrete
 * @param {CommandInteraction} iCmd Interação de comando
 * @param {Message} resposta Mensagem enviada para o usuario
 * @param {Date} tempo Tempo para o lembrete
 * @param {String} sobre Sobre o que é o lembrete
 * @param {Role} cargo Cargo para mencionar junto
 */
module.exports = (iCmd, resposta, tempo, sobre, cargo) => {

    cron.schedule(`${tempo.getSeconds()} ${tempo.getMinutes()} ${tempo.getHours()} ${tempo.getDate()} ${tempo.getMonth() + 1} *`, () => {
        const link = new MessageButton()
            .setLabel(`Lembrete`)
            .setDisabled(false)
            .setStyle(`LINK`)
            .setURL(resposta.url);

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`⏰ ${cargo ? `Rolê de ${iCmd.member.displayName}` : "Lembrete"}`)
        if (sobre) Embed.setDescription(`${sobre}`);

        iCmd.channel.send({
            content: cargo ? `> ${iCmd.user} ${cargo}` : `> ${iCmd.user}`,
            embeds: [Embed],
            components: [{ type: 'ACTION_ROW', components: [link] }],
        }).catch();

        client.log("servidor", `Lembrete de ${iCmd.user.tag} finalizado id:${resposta.id}`);
        this.destroy()
    });
}