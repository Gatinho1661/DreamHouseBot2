const { traduzirPerms } = require("./utils");
const { MessageEmbed } = require("discord.js");

/**
 * @param i Interação de comando
 * @param {"uso"|"erro"|"bloqueado"|"mensagem"} motivo Motivo da resposta
 * @param {string} titulo Titulo da resposta
 * @param {string} descricao Descrição da resposta
 * @param {boolean} ephemeral Enviar a resposta apenas visível apenas para o usuário?
 */
module.exports = (i, motivo, titulo, descricao, ephemeral = true) => {

    const cmd = client.comandos.get(i.commandName)
    if (!cmd) throw new Error("Comando não encontrado");

    if (!i.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return client.log("aviso", "A mensagem de uso não foi enviada por falta de permissões")
    //TODO enviar DM para o usuario caso nao tenha perms para enviar no canal

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
            i.reply({ content: null, embeds: [Embed], ephemeral }).catch(console.error);
            break;
        }
        case "erro": {
            const erroEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.erro)
                .setTitle("❗ " + titulo || "Ocorreu um erro")
                .setDescription(descricao || `Fale com o <@${client.owners[0].id}> para arrumar isso`);
            i.reply({ content: null, embeds: [erroEmbed], ephemeral }).catch(console.error);
            break;
        }
        case "bloqueado": {
            const blockEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle("🚫 " + titulo || "🚫 Você não pode fazer isso")
                .setDescription(descricao || `Você não consegue fazer isso`);
            i.reply({ content: null, embeds: [blockEmbed], ephemeral }).catch(console.error);
            break;
        }
        case "mensagem": {
            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.normal)
                .setTitle(titulo)
                .setDescription(descricao);
            i.reply({ content: null, embeds: [Embed], ephemeral }).catch(console.error);
            break;
        }
        default: {
            throw new Error("Motivo não definido")
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
