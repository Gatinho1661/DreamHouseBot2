const { traduzirPerms } = require("./../modulos/utils");
const { MessageEmbed } = require("discord.js");

module.exports = (msg, cmd, titulo, descricao) => {
    if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return client.log("aviso", "A mensagem de uso não foi enviada por falta de permissões")

    const Embed = new MessageEmbed()
        .setColor(config.corEmbed.aviso)
        .setTitle(titulo ? titulo : "⚠️ Comando escrito errado")
        .setDescription(`${cmd.details}\n\n❓ **Uso:** \`${client.commandPrefix}${cmd.name}${cmd.format ? " " + cmd.format : ""}\``)
    if (cmd.examples) Embed.addField("📖 Exemplos", "🔷 " + client.commandPrefix + cmd.examples.join(`\n🔸 ${client.commandPrefix}`));
    if (cmd.aliases.length > 0) Embed.addField("🔀 Sinônimos", `\`${cmd.aliases.join(", ")}\``);
    if (cmd.userPermissions.length > 0) Embed.addField("📛 Permissão necessária", `\`${traduzirPerms(cmd.userPermissions).join(", ")}\``);
    return msg.channel.send({
        content: null,
        embeds: [Embed],
        reply: { messageReference: msg }
    }).catch(console.error);
}
/*
✅ = sim
❌ = Nao
📛 = sem perm
⛔ = Faltando coisa
❓ = tem certeza?
❗ = ERRO
⚠️ = AVISO
*/
