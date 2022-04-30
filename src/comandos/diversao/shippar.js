const { MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require("canvas");

module.exports = {
    //* Infomações do comando
    emoji: "💘",
    nome: "shippar",
    sinonimos: [],
    descricao: "Ver suas chances com a pessoa do seus sonhos",
    exemplos: [
        { comando: "ship [usuario]", texto: "Shippar você com alguem" },
        { comando: "ship [usuario] [usuario]", texto: "Shippar 2 pessoas" },
    ],
    args: "{usuario}",
    opcoes: [
        {
            name: "voce",
            description: "Shippar você com alguem",
            type: client.defs.tiposOpcoes.SUB_COMMAND,
            options: [
                {
                    name: "usuario",
                    description: "Pessoa para shippar com você",
                    type: client.defs.tiposOpcoes.USER,
                    required: true
                },
            ]
        },
        {
            name: "outros",
            description: "Shippar 2 pessoas",
            type: client.defs.tiposOpcoes.SUB_COMMAND,
            options: [
                {
                    name: "usuario1",
                    description: "Primeira pessoa para ser shippada",
                    type: client.defs.tiposOpcoes.USER,
                    required: true
                },
                {
                    name: "usuario2",
                    description: "Segunda pessoa para ser shippada",
                    type: client.defs.tiposOpcoes.USER,
                    required: true
                }
            ]
        }
    ],
    canalVoz: false,
    contaPrimaria: false,
    apenasServidor: true,
    apenasDono: false,
    nsfw: false,
    permissoes: {
        usuario: [],
        bot: ["SEND_MESSAGES", "ATTACH_FILES"]
    },
    cooldown: 1,
    escondido: false,
    suporteBarra: true,
    testando: false,

    //* Comando
    async executar(iCmd, opcoes) {
        //* Define os usuarios
        const usuario1 = opcoes.voce.usuario?.usuario || opcoes.outros.usuario1?.usuario;
        const usuario2 = opcoes.outros.usuario2?.usuario || iCmd.user;

        //* Criar o canvas
        const canvas = Canvas.createCanvas(512, 256);
        const ctx = canvas.getContext("2d");

        //* Desenha o avatar na imagem
        const avatar1 = await Canvas.loadImage(usuario1.displayAvatarURL({ format: "png", size: 256 }));
        ctx.drawImage(avatar1, 0, 0, 256, canvas.height);

        const avatar2 = await Canvas.loadImage(usuario2.displayAvatarURL({ format: "png", size: 256 }));
        ctx.drawImage(avatar2, 256, 0, 256, canvas.height);

        //* Define a imagem finalizada para ser enviada
        const imagem = new MessageAttachment(canvas.toBuffer(), "shippar.png");

        //* Define o amor do casal com esse algoritmo foda
        const amor = Math.floor(Math.random() * 100);
        const amorPorce = Math.floor(amor);
        const amorIndex = Math.floor(amor / 10);
        const amorLevel = amorIndex === 10 ? "💗".repeat(10) : "❤️".repeat(amorIndex) + "💔".repeat(10 - amorIndex);

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setDescription(`${usuario1.id === usuario2.id ? (usuario1.toString() + " se ama") : (usuario1.toString() + " ama " + usuario2.toString())} esse tanto:\n**${amorPorce}%** │ ${amorLevel}`)
            .setImage("attachment://shippar.png");
        iCmd.reply({ content: null, embeds: [Embed], files: [imagem] }).catch();
    },

    //* Comandos de menu contextual
    nomeCtx: "Shippar",
    tipoCtx: client.defs.tiposComando.USER,
    async executarCtx(iCtx) {
        const opcoes = {
            subComando: "voce",
            voce: {
                usuario: {
                    usuario: iCtx.targetUser
                }
            },
            outros: {
                usuario1: null,
                usuario2: null,
            }
        }
        await this.executar(iCtx, opcoes);
    }
}