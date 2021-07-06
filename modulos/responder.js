//const { traduzirPerms } = require("./utils");
const { MessageEmbed } = require("discord.js");

// Usado para responder rapidamente mensagens
module.exports = (msg, cmd, motivo, titulo, descricao) => {

    if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return client.log("aviso", "A mensagem de uso não foi enviada por falta de permissões")

    switch (motivo) {
        case "uso": {
            /*
            const usoEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.aviso)
                .setTitle(titulo ? titulo : "⚠️ Comando escrito errado")
                .setDescription(
                    `${descricao}\n\n`
                    + `❓ **Uso:** \`${client.commandPrefix}${cmd.name}${cmd.format ? " " + cmd.format : ""}\``
                )
            if (cmd.examples) usoEmbed.addField("📖 Exemplos", cmd.examples.join(`\n`).replace(/{prefixo}/g, client.commandPrefix));
            if (cmd.aliases.length > 0) usoEmbed.addField("🔀 Sinônimos", `\`${cmd.aliases.join(", ")}\``);
            if (cmd.userPermissions.length > 0) usoEmbed.addField("📛 Permissão necessária", `\`${traduzirPerms(cmd.userPermissions).join(", ")}\``);*/
            msg.channel.send({ content: "Respostas rapidas ainda em desenvolvimento", /*embeds: [usoEmbed],*/ reply: { messageReference: msg } }).catch(console.error);
            break;
        }
        case "erro": {
            const erroEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.erro)
                .setTitle(titulo || "❗ Ocorreu um erro")
                .setDescription(descricao || `Fale com o <@${client.owners[0].id}> para arrumar isso`);
            msg.channel.send({ content: null, embeds: [erroEmbed], reply: { messageReference: msg } }).catch(console.error);
            break;
        }
        case "bloqueado": {
            const blockEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle(titulo || "🚫 Você não pode fazer isso")
                .setDescription(descricao || `Você não consegue fazer isso`);
            msg.channel.send({ content: null, embeds: [blockEmbed], reply: { messageReference: msg } }).catch(console.error);
            break;
        }
        default: {
            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.normal)
                .setTitle(titulo)
                .setDescription(descricao);
            msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch(console.error);
            break;
        }
    }

    //return client.emit("respondido", excTempo, this, msg, args);
}
/*
✅ = sim
❌ = Nao
🚫 = Bloqueado
📛 = sem perm
⛔ = Faltando coisa
❓ = tem certeza?
❗ = ERRO
⚠️ = AVISO
*/
