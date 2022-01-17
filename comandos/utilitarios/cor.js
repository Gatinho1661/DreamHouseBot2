const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "🎨",
    nome: "cor",
    sinonimos: [],
    descricao: "Mostra informações de cor",
    exemplos: [
        { comando: "cor pessoal", texto: "Mostra a sua cor de exibição" },
        { comando: "cor usuario [usuario]", texto: "Mostra a cor de exibição de uma pessoa" },
        { comando: "cor cargo [cargo]", texto: "Mostra a cor de um cargo" },
        { comando: "cor info [cor]", texto: "Mostra as informações de uma cor" }
    ],
    args: "",
    opcoes: [
        {
            name: "pessoal",
            description: "Mostra a sua cor de exibição",
            type: client.defs.tiposOpcoes.SUB_COMMAND,
            options: []
        },
        {
            name: "usuario",
            description: "Mostra a cor de exibição de uma pessoa",
            type: client.defs.tiposOpcoes.SUB_COMMAND,
            options: [
                {
                    name: "usuario",
                    description: "Pessoa para ver a cor",
                    type: client.defs.tiposOpcoes.USER,
                    required: true,
                },
            ]
        },
        {
            name: "cargo",
            description: "Mostra a cor de um cargo",
            type: client.defs.tiposOpcoes.SUB_COMMAND,
            options: [
                {
                    name: "cargo",
                    description: "Cargo para ver a cor",
                    type: client.defs.tiposOpcoes.ROLE,
                    required: true,
                },
            ]
        },
        {
            name: "info",
            description: "Mostra as informações de uma cor",
            type: client.defs.tiposOpcoes.SUB_COMMAND,
            options: [
                {
                    name: "cor",
                    description: "Cor para ver",
                    type: client.defs.tiposOpcoes.STRING,
                    required: true,
                },
            ]
        },
    ],
    canalVoz: false,
    contaPrimaria: false,
    apenasServidor: true,
    apenasDono: false,
    nsfw: false,
    permissoes: {
        usuario: [],
        bot: ["SEND_MESSAGES"]
    },
    cooldown: 1,
    suporteBarra: true,
    testando: false,

    //* Comando
    async executar(iCmd, opcoes) {
        let cor; // Cor em Hex
        const Embed = new MessageEmbed();

        switch (opcoes.subComando) {
            case "pessoal": {
                cor = iCmd.member.displayHexColor;
                if (!cor) return client.responder(iCmd, "bloqueado", "Nenhuma cor", `Você não tem uma cor definida`);

                Embed.setTitle(`🎨 Cor pessoal`);
                Embed.setDescription(`Cargo de cor ${iCmd.member.roles.color.toString()}`);
                break;
            }

            case "usuario": {
                const usuario = opcoes.usuario.usuario.membro;

                cor = opcoes.usuario.usuario.membro.displayHexColor;
                if (!cor) return client.responder(iCmd, "bloqueado", "Nenhuma cor", `Essa pessoa não tem uma cor definida`);

                Embed.setTitle(`🎨 Cor de ${usuario.displayName}`);
                Embed.setDescription(`Cargo de cor ${usuario.roles.color.toString()}`);
                break;
            }

            case "cargo": {
                cor = opcoes.cargo.cargo.hexColor;
                if (!cor) return client.responder(iCmd, "bloqueado", "Nenhuma cor", `Esse cargo não tem uma cor definida`);

                Embed.setTitle(`🎨 Cor de ${opcoes.cargo.cargo.name}`);
                break;
            }

            case "info": {
                cor = opcoes.info.cor;
                if (!/^#([a-fA-F0-9]{6})$/.test(cor)) return client.responder(iCmd, "bloqueado", "Hex inválido", "Você deve enviar um hex válido\n(ex: `#aacbff`, `#faff6b`, `#7e6add`)");

                Embed.setTitle(`🎨 Cor`);
                break;
            }

            default: throw new Error("Sub comando não encontrado");
        }

        // Transforma Hex em RGB
        const hexParaRgb = (hex) => hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g)
            .map(x => parseInt(x, 16));

        Embed.setColor(cor);
        Embed.setImage(`https://serux.pro/rendercolour?hex=${cor.replace("#", "")}&height=100&width=200`);
        Embed.addFields(
            { name: 'Hex', value: cor, inline: true },
            { name: 'RGB', value: `${hexParaRgb(cor)}`, inline: true },
        );
        await iCmd.reply({ content: null, embeds: [Embed] }).catch();
    },

    //* Comandos de menu contextual
    nomeCtx: "Cor",
    tipoCtx: client.defs.tiposComando.USER,
    async executarCtx(iCtx) {
        const opcoes = {
            subComando: "usuario",
            usuario: {
                usuario: {
                    membro: iCtx.targetMember
                }
            }
        }
        await this.executar(iCtx, opcoes);
    }
};
