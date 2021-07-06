const { MessageEmbed } = require("discord.js");
const { traduzirPerms } = require("../modulos/utils");

// Emitido quando um comando é bloqueado de ser executado
module.exports = {
    nome: "comandoBloqueado",
    once: false, // Se deve ser executado apenas uma vez

    async executar(msg, razao, data) {
        try {
            if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return client.log("aviso", "A mensagem de erro não foi enviada por falta de permissões")

            switch (razao) {
                case "permUsuario": {
                    if (msg.command.ownerOnly) return;
                    client.log("comando", `${msg.command.name} foi bloqueado de ser executado por falta de permissão do usuário`);
                    const userPemrsEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`📛 Permissão necessária`)
                        .setDescription(`você precisa ter permissões de \`${traduzirPerms(msg.command.userPermissions).join(", ")}\` para fazer isso`);
                    return await msg.channel.send({ content: null, embeds: [userPemrsEmbed], reply: { messageReference: msg } });
                }
                case "permBot": {
                    client.log("comando", `${msg.command.name} foi bloqueado de ser executado por falta de permissão do bot`, "erro");
                    const clientPemrsEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`📛 Permissão necessária`)
                        .setDescription(`eu não tenho permissões de \`${traduzirPerms(data.missing).join(", ")}\` para fazer isso`)
                        .setImage(client.defs.imagens.anivesario);
                    return await msg.channel.send({ content: null, embeds: [clientPemrsEmbed], reply: { messageReference: msg } });
                }
                case "cooldown": {
                    client.log("comando", `${msg.command.name} foi bloqueado de ser executado por delay`);
                    const limiteEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`🕑 Calma aí!`)
                        .setDescription(`você precisa esperar \`${data.remaining.toFixed(1)} segundos\` para poder executar esse comando`);
                    const resposta = await msg.channel.send({ content: null, embeds: [limiteEmbed], reply: { messageReference: msg } });
                    return client.setTimeout(() => resposta.delete(), 3000); // apagar a msg enviada depois de 3 segundos
                }
                case "apenasServidor": {
                    client.log("comando", `${msg.command.name} foi bloqueado de ser executado por ser um comando de apenas server`);
                    const guildEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`❌ Aqui não`)
                        .setDescription(`você precisa está em um \`servidor\` para fazer isso`);
                    return await msg.channel.send({ content: null, embeds: [guildEmbed], reply: { messageReference: msg } });
                }
                case "nsfw": {
                    client.log("comando", `${msg.command.name} foi bloqueado de ser executado por ser um comando NSFW fora do canal`);
                    const nsfwEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`❌ Aqui não`)
                        .setDescription(`você precisa está em um canal \`NSFW\` para fazer isso`);
                    return await msg.channel.send({ content: null, embeds: [nsfwEmbed], reply: { messageReference: msg } });
                }
                case "canalVoz": {
                    client.log("comando", `${msg.command.name} foi bloqueado de ser executado por ser um comando de voz`);
                    const nsfwEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`❌ Não consigo`)
                        .setDescription(`você precisa está em um canal de \`NSFW\` para fazer isso`);
                    return await msg.channel.send({ content: null, embeds: [nsfwEmbed], reply: { messageReference: msg } });
                }
                case "apenasDono": {
                    client.log("comando", `${msg.command.name} foi bloqueado de ser executado por ser um comando de dono`);
                    return;
                }
                default: {
                    client.log("comando", `${msg.command.name} foi bloqueado de ser executado`);
                    const Embed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`❌ Ops`)
                        .setDescription(`eu não posso executar esse comando`);

                    return await msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } });
                }
            }
        } catch (err) {
            client.log("erro", err.stack)
        }
    }
}