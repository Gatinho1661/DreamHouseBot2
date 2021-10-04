const { MessageEmbed } = require("discord.js");
const cron = require('node-cron');

module.exports = (id, canal, membro, mencoes, texto, tempo) => {

    var lembrete = cron.schedule(`${tempo.getSeconds()} ${tempo.getMinutes()} ${tempo.getHours()} ${tempo.getDate()} ${tempo.getMonth() + 1} *`, () => {
        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`⏰ ${mencoes.length > 0 ? `Rolê de ${membro.displayName}` : "Lembrete"}`)
            .setDescription(`${texto}`);
        canal.send({ content: `> <@!${membro.user.id}> ${mencoes.join(" ")}`, embeds: [Embed] }).catch();
        lembrete.destroy();
        console.info(`lembrete finalizado id:${id}`)
        client.lembretes.delete(id)
    });
}