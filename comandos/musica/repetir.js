const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "🔁",
    nome: "repetir",
    sinonimos: [],
    descricao: "Repetir uma música ou a fila de músicas",
    exemplos: [
        { comando: "repetir [modo]", texto: "Repete uma música ou a fila de músicas" },
    ],
    args: "",
    opcoes: [
        {
            name: "modo",
            description: "Modo de repetição",
            type: client.defs.tiposOpcoes.STRING,
            required: true,
            choices: [
                {
                    name: "Desativar",
                    value: "desativar"
                },
                {
                    name: "Música",
                    value: "musica"
                },
                /* Distube não funciona direito
                {
                    name: "Fila",
                    value: "fila"
                }
                */
            ]
        },
    ],
    canalVoz: true,
    contaPrimaria: false,
    apenasServidor: true,
    apenasDono: false,
    nsfw: false,
    permissoes: {
        usuario: [],
        bot: ["SEND_MESSAGES"]
    },
    cooldown: 1,
    escondido: false,
    suporteBarra: true,
    testando: false,

    //* Comando
    async executar(iCmd, opcoes) {
        // Pegar fila de músicas do servidor
        const filaMusicas = client.distube.getQueue(iCmd.guild);
        if (!filaMusicas) return client.responder(iCmd, "bloqueado", "Está bem quieto aqui...", "Nenhuma música está sendo tocada nesse servidor")

        const modoRepeticao = {
            desativar: 0,
            musica: 1,
            fila: 2
        }[opcoes.modo];
        if (!modoRepeticao) return client.responder(iCmd, "bloqueado", "Modo inválido", "O modo de repetição escolhido é inválido");

        const textoRepeticao = {
            0: "Repetição desligada",
            1: "Repetindo música",
            2: "Repetindo fila"
        }[modoRepeticao]

        filaMusicas.setRepeatMode(modoRepeticao);
        client.log("musica", `${textoRepeticao} em: ${filaMusicas.voiceChannel?.name}`);

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`${this.emoji} ${textoRepeticao}`)
        await iCmd.reply({ content: null, embeds: [Embed] }).catch();
    }
}