const { MessageEmbed } = require("discord.js");
const { traduzirPerms } = require("../modulos/utils");

// Emitido quando um comando é bloqueado de ser executado
module.exports = {
    nome: "comandoBloqueado",
    once: false, // Se deve ser executado apenas uma vez

    /**
     * 
     * @param {*} iCmd Interação de comando
     * @param {"desativado"|"permUsuario"|"permBot"|"cooldown"|"apenasServidor"|"nsfw"|"canalvoz"|"apenasDono"} razao Razão do comando ser bloqueado
     * @param {{motivo: tring, faltando: string[], restante: number}} data 
     * @returns Mensagem
     */
    async executar(iCmd, razao, data) {
        try {
            const cmd = client.comandos.get(iCmd.commandName)
            if (!cmd) throw new Error("Comando não encontrado");

            if (!iCmd.channel.guild.me.permissions.has('SEND_MESSAGES')) return client.log("aviso", "A mensagem de erro não foi enviada por falta de permissões")

            switch (razao) {
                case "desativado": {
                    client.log("comando", `${cmd.nome} foi bloqueado de ser executado por que o comando está desativado`);
                    if (!data.motivo) return

                    const desativadoEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`🚫 Comando desativado`)
                        .setDescription(`${data.motivo}`);
                    return await iCmd.reply({ content: null, embeds: [desativadoEmbed], ephemeral: true });
                }
                case "permUsuario": {
                    client.log("comando", `${cmd.nome} foi bloqueado de ser executado por falta de permissão do usuário`);
                    const userPemrsEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`📛 Permissão necessária`)
                        .setDescription(`você precisa ter permissões de \`${traduzirPerms(data.faltando).join(", ")}\` para fazer isso`);
                    return await iCmd.reply({ content: null, embeds: [userPemrsEmbed], ephemeral: true });
                }
                case "permBot": {
                    client.log("comando", `${cmd.nome} foi bloqueado de ser executado por falta de permissão do bot`, "erro");
                    const clientPemrsEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`📛 Permissão necessária`)
                        .setDescription(`eu não tenho permissões de \`${traduzirPerms(data.faltando).join(", ")}\` para fazer isso`)
                        .setImage(client.defs.imagens.anivesario);
                    return await iCmd.reply({ content: null, embeds: [clientPemrsEmbed], ephemeral: true });
                }
                case "cooldown": {
                    client.log("comando", `${cmd.nome} foi bloqueado de ser executado por delay`);
                    const limiteEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`🕑 Calma aí!`)
                        .setDescription(`você precisa esperar \`${data.remaining.toFixed(1)} segundos\` para poder executar esse comando`);
                    return await iCmd.reply({ content: null, embeds: [limiteEmbed], ephemeral: true });
                }
                case "apenasServidor": {
                    client.log("comando", `${cmd.nome} foi bloqueado de ser executado por ser um comando de apenas server`);
                    const guildEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`❌ Aqui não`)
                        .setDescription(`você precisa está em um \`servidor\` para fazer isso`);
                    return await iCmd.reply({ content: null, embeds: [guildEmbed], ephemeral: true });
                }
                case "nsfw": {
                    client.log("comando", `${cmd.nome} foi bloqueado de ser executado por ser um comando NSFW fora do canal`);
                    const nsfwEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`❌ Aqui não`)
                        .setDescription(`você precisa está em um canal \`NSFW\` para fazer isso`);
                    return await iCmd.reply({ content: null, embeds: [nsfwEmbed], ephemeral: true });
                }
                case "canalVoz": {
                    client.log("comando", `${cmd.nome} foi bloqueado de ser executado por ser um comando de voz`);
                    const nsfwEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`❌ Não consigo`)
                        .setDescription(`você precisa está em um canal de \`NSFW\` para fazer isso`);
                    return await iCmd.reply({ content: null, embeds: [nsfwEmbed], ephemeral: true });
                }
                case "apenasDono": {
                    client.log("comando", `${cmd.nome} foi bloqueado de ser executado por ser um comando de dono`);
                    return;
                }
                default: {
                    client.log("comando", `${cmd.nome} foi bloqueado de ser executado`);
                    const Embed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`❌ Ops`)
                        .setDescription(`eu não posso executar esse comando`);

                    return await iCmd.reply({ content: null, embeds: [Embed], ephemeral: true });
                }
            }
        } catch (err) {
            client.log("erro", err.stack)
        }
    }
}