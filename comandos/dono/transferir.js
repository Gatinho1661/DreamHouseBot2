//const { MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "",
    nome: "transferir",
    sinonimos: [],
    descricao: "Tranferir banco de dados para nova versão",
    exemplos: [],
    args: "",
    canalVoz: false,
    contaPrimaria: false,
    apenasServidor: false,
    apenasDono: true,
    nsfw: false,
    permissoes: {
        usuario: [],
        bot: ["SEND_MESSAGES"]
    },
    cooldown: 1,
    escondido: true,
    suporteBarra: false,

    //* Comando
    async executarMsg(msg) {

        //* Transferir usuarios
        const usuIdxs = client.usuarioOld.indexes
        for (let i = 0; i < usuIdxs.length; i++) {
            const usuarioId = usuIdxs[i];

            let data = client.usuarioOld.get(usuarioId);

            delete data.textinho;

            data.nome = data.usuario;
            delete data.usuario;
            client.log("verbose", `nome foi definido ${data.nome}`);

            if (data.aniversario !== null) {
                const time = new Date(`${2021 - data.idade} ${data.aniversario.mes} ${data.aniversario.dia} 00:00:00`);
                data.aniversario = time.toISOString();
                client.log("verbose", `o aniversario de ${data.nome} foi definido para ${new Date(data.aniversario)}`);
            } else {
                client.log("verbose", `${data.nome} não tem aniversario`);
            }

            console.debug(data.pronome);
            if (data.pronome) data.pronome = data.pronome.toLowerCase();
            console.debug(data.pronome);

            client.usuarios.set(usuarioId, data);
        }

        //* Transferir relacionamentos
        const relaIdxs = client.relacionamentoOld.indexes
        for (const relacionamentoId of relaIdxs) {
            const data = client.relacionamentoOld.get(relacionamentoId);

            delete data.textinho;

            data.conjugeId = data.conjuge || null;
            delete data.conjuge;
            client.log("verbose", `${data.usuario} foi definido ${data.conjugeId}`);

            const conjuge = client.relacionamentoOld.get(data.conjugeId);

            data.conjugeNome = conjuge?.usuario || null;

            if (data.timestamp) {
                const time = new Date(data.timestamp);
                data.dataCasamento = time.toISOString();
                client.log("verbose", `o aniversario de ${data.usuario} foi definido para ${new Date(data.dataCasamento)}`);
            } else {
                data.dataCasamento = null;
                client.log("verbose", `${data.usuario} não tem timestamp`);
            }
            delete data.timestamp;

            client.relacionamentos.set(relacionamentoId, data);
        }

        //* Transferir relacionamentos
        const memeIdxs = client.memes.indexes
        for (const memeId of memeIdxs) {
            const meme = client.memes.get(memeId);

            client.memes.set(memeId, `Meme criado por ${meme.usuario}`, "descricao");
        }

        client.config.ensure("primeiraVez", false);
        client.config.ensure("salvarMsgs", true);
        client.config.ensure("todosComandosDesativado", false);
        client.config.ensure("comandosDesativado", []);
        client.config.ensure("autoCargos", []);
        client.config.ensure("fixados", "");
        client.config.ensure("bichinhos", "");
        client.config.ensure("aniversarios", {
            "ativado": true,
            "alterarTop": true,
            "canal": null
        });
        client.config.ensure("msgCargos", {
            "canal": null,
            "id": null,
            "servidor": null
        });
        client.config.ensure("chegou", {
            "canalID": null,
            "gif": "",
            "msg": "Chegou sem escândalo ✨"
        });
        client.config.ensure("saida", {
            "canalID": null,
            "gif": "",
            "msg": "Saiu do server 😢"
        });
        client.config.ensure("log", {
            "normal": false,
            "custom": true,
            "log": true,
            "verbose": true,
            "info": true,
            "servidor": true,
            "meme": true,
            "comando": true,
            "aviso": true,
            "erro": true,
            "critico": true,
            "api": true,
            "bot": true
        });

        msg.react("👍");
    }
};