const { MessageEmbed, MessageButton, Constants, MessageSelectMenu } = require("discord.js");
const Duration = require('duration');
const cron = require('node-cron');
const fg = require("fast-glob");

module.exports = {
    emoji: "🛠️",
    nome: "teste",
    sinonimos: ["t"],
    descricao: "Testa coisas.",
    exemplos: [],
    args: "",

    opcoes: [
        {
            name: "args",
            description: "Argumentos",
            type: client.defs.tiposOpcoes.SUB_COMMAND,
            options: [
                {
                    name: "string",
                    description: "Um argumento teste",
                    type: client.defs.tiposOpcoes.STRING,
                    required: false,
                },
                {
                    name: "numero",
                    description: "Outro argumento teste",
                    type: client.defs.tiposOpcoes.NUMBER,
                    required: false,
                },
                {
                    name: "intger",
                    description: "Outro argumento teste",
                    type: client.defs.tiposOpcoes.INTEGER,
                    required: false,
                },
                {
                    name: "boolean",
                    description: "Outro argumento teste",
                    type: client.defs.tiposOpcoes.BOOLEAN,
                    required: false,
                }
            ]
        },
        {
            name: "mencionaveis",
            description: "Argumentos mensionaveis",
            type: client.defs.tiposOpcoes.SUB_COMMAND_GROUP,
            options: [
                {
                    name: "usuarios",
                    description: "Argumentos Padroes",
                    type: client.defs.tiposOpcoes.SUB_COMMAND,
                    options: [
                        {
                            name: "usario",
                            description: "Outro argumento teste",
                            type: client.defs.tiposOpcoes.USER,
                            required: false,
                        },
                        {
                            name: "mencionavel",
                            description: "Outro argumento teste",
                            type: client.defs.tiposOpcoes.MENTIONABLE,
                            required: false,
                        }
                    ]
                },
                {
                    name: "servidor",
                    description: "Argumentos Padroes",
                    type: client.defs.tiposOpcoes.SUB_COMMAND,
                    options: [
                        {
                            name: "canal",
                            description: "Outro argumento teste",
                            type: client.defs.tiposOpcoes.CHANNEL,
                            required: false,
                        },
                        {
                            name: "cargo",
                            description: "Outro argumento teste",
                            type: client.defs.tiposOpcoes.ROLE,
                            required: false,
                        },
                    ]
                }
            ]
        }
    ],

    // Necessário
    canalVoz: false,        // está em um canal de voz
    contaPrimaria: false,   // ser uma conta primaria
    apenasServidor: false,  // está em um servidor
    apenasDono: true,       // ser o dono
    nsfw: false,            // ser um canal NSFW

    permissoes: {
        usuario: [],        // permissões do usuário
        bot: []             // permissões do bot
    },
    cooldown: 1,            // número em segundos de cooldown

    escondido: true,        // comando fica escondido do comando de ajuda

    suporteBarra: "ambos",
    testando: true,

    async executarMsg(msg, args) {
        msg.channel.send({ content: "ala", reply: { messageReference: "214458", failIfNotExists: false } });
    },

    async executar(iCmd, opcoes) {
        const comandoTeste = require('../../comandoTeste');

        console.log(comandoTeste)

        console.log("tala")
    },

    nomeCtx: "Fazer um teste",
    tipoCtx: client.defs.tiposComando.MESSAGE,
    async executarCtx(iCtx) {
        await iCtx.reply({ content: "Teste Feito ai o" });
    }
}