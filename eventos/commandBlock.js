const { MessageEmbed } = require("discord.js");

// Emitido quando um comando é bloqueado de ser executado
module.exports = async (client, msg, razao, data) => {
    try {
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return client.log("aviso", "A mensagem de erro não foi enviada por falta de permissões")

        switch (razao) {
            case "permission":
                if (msg.command.ownerOnly) return;
                client.log("comando", `${msg.command.name} foi bloqueado de ser executado por falta de permissão do usuário`);
                const userPemrsEmbed = new MessageEmbed()
                    .setColor(client.config.corEmbed.nao)
                    .setTitle(`📛 Permissão necessária`)
                    .setDescription(`você precisa ter permissões de \`${traduzirPerms(msg.command.userPermissions).join(", ")}\` para fazer isso`);
                return await msg.channel.send({ content: null, embeds: [userPemrsEmbed], reply: { messageReference: msg } });

            case "clientPermissions":
                client.log("comando", `${msg.command.name} foi bloqueado de ser executado por falta de permissão do bot`);
                const clientPemrsEmbed = new MessageEmbed()
                    .setColor(client.config.corEmbed.nao)
                    .setTitle(`📛 Permissão necessária`)
                    .setDescription(`eu não tenho permissões de \`${traduzirPerms(data.missing).join(", ")}\` para fazer isso`)
                    .setImage("https://i.imgur.com/E63t0VD.png");
                return await msg.channel.send({ content: null, embeds: [clientPemrsEmbed], reply: { messageReference: msg } });

            case "throttling":
                client.log("comando", `${msg.command.name} foi bloqueado de ser executado por delay`);
                const limiteEmbed = new MessageEmbed()
                    .setColor(client.config.corEmbed.nao)
                    .setTitle(`🕑 Calma aí!`)
                    .setDescription(`você precisa esperar \`${data.remaining.toFixed(1)} segundos\` para poder executar esse comando`);
                const resposta = await msg.channel.send({ content: null, embeds: [limiteEmbed], reply: { messageReference: msg } });
                return client.setTimeout(() => resposta.delete(), 3000); // apagar a msg enviada depois de 3 segundos

            case "guildOnly":
                client.log("comando", `${msg.command.name} foi bloqueado de ser executado por ser um comando de apenas server`);
                const guildEmbed = new MessageEmbed()
                    .setColor(client.config.corEmbed.nao)
                    .setTitle(`❌ Aqui não`)
                    .setDescription(`você precisa está em um \`servidor\` para fazer isso`);
                return await msg.channel.send({ content: null, embeds: [guildEmbed], reply: { messageReference: msg } });

            case "nsfw":
                client.log("comando", `${msg.command.name} foi bloqueado de ser executado por ser um comando NSFW fora do canal`);
                const nsfwEmbed = new MessageEmbed()
                    .setColor(client.config.corEmbed.nao)
                    .setTitle(`❌ Aqui não`)
                    .setDescription(`você precisa está em um canal \`NSFW\` para fazer isso`);
                return await msg.channel.send({ content: null, embeds: [nsfwEmbed], reply: { messageReference: msg } });

            default:
                client.log("comando", `${msg.command.name} foi bloqueado de ser executado`);
                const Embed = new MessageEmbed()
                    .setColor(client.config.corEmbed.nao)
                    .setTitle(`❌ Ops`)
                    .setDescription(`não consegui executar esse comando`);
                return await msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } });
        }
    } catch (err) {
        client.log("erro", err.stack)
    }
}



function traduzirPerms(perms) {
    let listaPerms = []

    let permsTraduzidas = {
        "ADMINISTRATOR": "Administrador",
        "CREATE_INSTANT_INVITE": "Criar convite",
        "KICK_MEMBERS": "Expulsar membros",
        "BAN_MEMBERS": "Banir membros",
        "MANAGE_CHANNELS": "Gerenciar canais",
        "MANAGE_GUILD": "Gerenciar servidor",
        "ADD_REACTIONS": "Adicionar reações",
        "VIEW_AUDIT_LOG": "Ver o registro de auditoria",
        "PRIORITY_SPEAKER": "Voz prioritária",
        "STREAM": "Vídeo",
        "VIEW_CHANNEL": "Ver canal",
        "SEND_MESSAGES": "Enviar mensagens",
        "SEND_TTS_MESSAGES": "Enviar mensagens em Texto-para-voz",
        "MANAGE_MESSAGES": "Gerenciar mensagens",
        "EMBED_LINKS": "Inserir links",
        "ATTACH_FILES": "Anexar arquivos",
        "READ_MESSAGE_HISTORY": "Ver histórico de mensagens",
        "MENTION_EVERYONE": "Mencionar @everyone, @here e todos os cargos",
        "USE_EXTERNAL_EMOJIS": "Usar emojis externos",
        "VIEW_GUILD_INSIGHTS": "Visualizar análises do Servidor.",
        "CONNECT": "Conectar",
        "SPEAK": "Falar",
        "MUTE_MEMBERS": "Silenciar membros",
        "DEAFEN_MEMBERS": "Ensurdecer membros",
        "MOVE_MEMBERS": "Mover membros",
        "USE_VAD": "Usar detecção de voz",
        "CHANGE_NICKNAME": "Alterar apelido",
        "MANAGE_NICKNAMES": "Gerencir apelidos",
        "MANAGE_ROLES": "Gerenciar cargos",
        "MANAGE_WEBHOOKS": "Gerenciar webhooks",
        "MANAGE_EMOJIS": "Gerenciar emojis",
        "USE_APPLICATION_COMMANDS": "Usar comandos /",
        "REQUEST_TO_SPEAK": "Pedir para falar"
    }

    perms.forEach(perm => {
        if (!permsTraduzidas.hasOwnProperty(perm)) {
            client.console("erro", "Permissão não encontrada");
            listaPerms.push("???");
        } else {
            listaPerms.push(permsTraduzidas[perm]);
        }
    });

    return listaPerms
}