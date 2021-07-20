//* Traduz as permissões
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
//* Formata o nome do canal
exports.formatarCanal = function (canal) {
    if (!canal) throw new Error("Isso não é um canal")

    return /store|news|text/i.test(canal.type) ? (canal.name.includes("│") ? canal.name.split("│")[1] : canal.name) : "DM"
}
//* Dar fetch em todas as mensagens do canal
exports.fetchAll = async function (canal, opcoes = { limite: 10, msgLimite: 100, invertido: false, apenasUsuario: false, apenasBot: false, fixados: false }) {
    const inicio = new Date();

    const delay = async (ms) => new Promise(res => setTimeout(res, ms)); // eslint-disable-line no-promise-executor-return
    const { limite, msgLimite, invertido, apenasUsuario, apenasBot, fixados } = opcoes;
    let mensagens = [];
    let ultimoId = null;

    const finalizar = (mensagens, razao) => {
        if (invertido) mensagens.reverse();
        if (apenasUsuario) mensagens.filter(m => !m.author.bot);
        if (apenasBot) mensagens.filter(m => m.author.bot);
        if (fixados) mensagens.filter(m => m.pinned);

        client.log("verbose", `O fetchAll foi finalizado em ${new Date().getTime() - inicio.getTime()}ms pois ${razao} e recebeu ${mensagens.length} mensagens`);
        return mensagens;
    }

    for (var i = 1; true; ++i) {
        const mensagensRecebidas = await canal.messages.fetch({ // eslint-disable-line no-await-in-loop
            limit: msgLimite,
            cache: false,
            ...(ultimoId && { before: ultimoId })
        })

        //* Caso não receba nenhum outra msg ou atinja
        if (mensagensRecebidas.size === 0) return finalizar(mensagens, "acabou as mensagens")

        //* Adicionar as mensagens recebidas
        mensagens = mensagens.concat(Array.from(mensagensRecebidas.values()));
        ultimoId = mensagensRecebidas.lastKey();

        //* Caso atinja o limite
        if (i === limite) return finalizar(mensagens, "atingiu o limite")

        client.log("verbose", `${mensagens.length} mensagens ${i}/${limite} requests`);

        //* Pro discord não comer meu cu
        if (i % 5 === 0) client.log("verbose", `Esperando para não dar rate limit...`), await delay(5000); // eslint-disable-line no-await-in-loop
    }
}