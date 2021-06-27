exports.traduzirPerms = function (perms) {
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
        if (perm in permsTraduzidas) {
            listaPerms.push(permsTraduzidas[perm]);
        } else {
            client.log("aviso", `Permissão ${perm} não encontrada na lista`);
            listaPerms.push(perm.toString());
        }
    });

    return listaPerms
}