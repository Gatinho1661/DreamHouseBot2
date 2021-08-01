const { traduzirPerms } = require("./utils");
const { MessageEmbed } = require("discord.js");

// Usado para responder rapidamente mensagens
module.exports = (msg, cmd, motivo, titulo, descricao) => {

    if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return client.log("aviso", "A mensagem de uso não foi enviada por falta de permissões")

    switch (motivo) {
        case "uso": {

            const regex = new RegExp(`{(${Object.keys(client.defs.tiposArgs).join("|")})}`, "g");
            const uso = cmd.args.replace(regex, e => client.defs.tiposArgs[e.replace(/{|}/g, "")]);

            const formatarExemplos = (exemplosArray) => {
                let exemplos = "";

                for (const exemplo of exemplosArray) {
                    exemplos += `\n[\`${client.prefixo}${exemplo.comando}\`](https://nao.clique/de-hover-sobre '${exemplo.texto}')`
                }
                return exemplos;
            }

            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.normal)
                .setTitle("⛔ " + titulo || "Comando escrito errado")
                .setDescription(descricao || cmd.descricao)
                .addField('❓ Uso', `${client.prefixo}${cmd.nome} ${uso}`)
            if (cmd.exemplos.length > 0) Embed.addField("📖 Exemplos", formatarExemplos(cmd.exemplos));
            if (cmd.sinonimos.length > 0) Embed.addField("🔀 Sinônimos", `\`${cmd.sinonimos.join("`\n`")}\``);
            if (cmd.permissoes.usuario > 0) Embed.addField("📛 Permissão necessária", `\`${traduzirPerms(cmd.permissoes.usuario).join("`\n`")}\``);
            msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch(console.error);
            break;
        }
        case "erro": {
            const erroEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.erro)
                .setTitle("❗ " + titulo || "Ocorreu um erro")
                .setDescription(descricao || `Fale com o <@${client.owners[0].id}> para arrumar isso`);
            msg.channel.send({ content: null, embeds: [erroEmbed], reply: { messageReference: msg } }).catch(console.error);
            break;
        }
        case "bloqueado": {
            const blockEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle("🚫 " + titulo || "🚫 Você não pode fazer isso")
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
