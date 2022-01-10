// eslint-disable-next-line no-unused-vars
const { TextChannel, Message } = require("discord.js");

/**
 * Traduz as permissões
 * @param {String[]} perms Permissões para traduzir
 * @returns {String[]} Permissões traduzidas
 */
exports.traduzirPerms = function (perms) {
    let listaPerms = [];

    perms.forEach(perm => {
        if (perm in client.defs.permissoes) {
            listaPerms.push(client.defs.permissoes[perm]);
        } else {
            client.log("aviso", `Permissão ${perm} não encontrada na lista`);
            listaPerms.push(perm.toString());
        }
    });

    return listaPerms;
}

/**
 * Formata o nome do canal
 * @param {TextChannel} canal Canal ter o nome formatado
 * @returns {String} Nome formatado
 */
exports.formatarCanal = function (canal) {
    if (typeof canal === TextChannel) throw new Error("Isso não é um canal");

    return /store|news|text/i.test(canal.type) ? (canal.name.includes("│") ? canal.name.split("│")[1] : canal.name) : "DM"
}

/**
 * Dar fetch em todas as mensagens do canal
 * @param {TextChannel} canal
 * @param {Object} opcoes
 * @param {Number} opcoes.limiteReq Limite de requests
 * @param {Number} opcoes.limiteMsg Limite de mensagens
 * @param {Boolean} opcoes.invertido Receber a lista invertida
 * @param {Boolean} opcoes.apenasUsuario Receber apenas as mensagens de usuário
 * @param {Boolean} opcoes.apenasBot Receber apenas as mensagens de bots
 * @param {Boolean} opcoes.fixados Receber apenas as mensagens fixadas
 * @returns {Message[]} Mensagens recebidas
 */
exports.fetchAll = async function (canal, opcoes = { limiteReq: 10, limiteMsg: 100, invertido: false, apenasUsuario: false, apenasBot: false, fixados: false }) {
    const inicio = new Date();

    const delay = async (ms) => new Promise(res => setTimeout(res, ms)); // eslint-disable-line no-promise-executor-return
    const { limiteReq: limite, limiteMsg: msgLimite, invertido, apenasUsuario, apenasBot, fixados } = opcoes;
    let mensagens = [];
    let ultimoId = null;

    /**
     * Finalizar fetchAll
     * @param {Message[]} mensagens Mensagens recebidas
     * @param {String} razao Razão para finalizar o fetch
     * @returns {Message[]} Mensagens recebidas
     */
    const finalizar = (mensagens, razao) => {
        if (invertido) mensagens.reverse();
        if (apenasUsuario) mensagens.filter(m => !m.author.bot);
        if (apenasBot) mensagens.filter(m => m.author.bot);
        if (fixados) mensagens.filter(m => m.pinned);

        client.log("verbose", `O fetchAll foi finalizado em ${new Date().getTime() - inicio.getTime()}ms pois ${razao} e recebeu ${mensagens.length} mensagens`);
        return mensagens;
    }

    for (var i = 1; true; ++i) {
        const mensagensRecebidas = await canal.messages.fetch({
            limit: msgLimite,
            cache: false,
            ...(ultimoId && { before: ultimoId })
        })

        //* Caso não receba nenhum outra msg ou atinja
        if (mensagensRecebidas.size === 0) return finalizar(mensagens, "acabou as mensagens");

        //* Adicionar as mensagens recebidas
        mensagens = mensagens.concat(Array.from(mensagensRecebidas.values()));
        ultimoId = mensagensRecebidas.lastKey();

        //* Caso atinja o limite
        if (i === limite) return finalizar(mensagens, "atingiu o limite");

        client.log("verbose", `${mensagens.length} mensagens ${i}/${limite} requests`);

        //* Pro discord não comer meu cu
        if (i % 5 === 0) client.log("verbose", `Esperando para não dar rate limit...`), await delay(5000);
    }
}

/**
 * Calcular a data do próximo aniversário
 * @param {Date} nascimentoData 
 * @returns {Date} Próximo aniversário
 */
exports.proximoAniversario = (nascimentoData) => {
    const hoje = new Date();
    nascimentoData.setYear(hoje.getFullYear());

    if (nascimentoData.getTime() <= hoje.getTime()) {
        nascimentoData.setYear(hoje.getFullYear() + 1);
    }

    return nascimentoData;
}