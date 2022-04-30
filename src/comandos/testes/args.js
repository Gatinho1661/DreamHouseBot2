const { MessageEmbed } = require("discord.js");
//const { Command } = require('discord.js-commando');
//const chrono = require('chrono-node');
//const cron = require('node-cron');
//const fetch = require("node-fetch");

module.exports = {
    emoji: "",
    nome: "args",
    sinonimos: [],
    descricao: "Testa coisas.",
    exemplos: [],
    args: "",
    opcoes: [
        {
            name: "padroes",
            description: "Argumentos Padroes",
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

    suporteBarra: true,

    async executar(iCmd) {
        //console.debug(iCmd.options.data);
        // console.debug(iCmd.options.resolved);

        // const opcoes = {}
        // for (const opcao of iCmd.options.data) {
        //     switch (opcao.type) {
        //         case "USER": {
        //             opcoes[opcao.name] = { usario: opcao.user, membro: opcao.member };
        //             break;
        //         }

        //         case "CHANNEL": {
        //             opcoes[opcao.name] = opcao.channel;
        //             break;
        //         }

        //         case "ROLE": {
        //             opcoes[opcao.name] = opcao.role;
        //             break;
        //         }

        //         case "MENTIONABLE": {
        //             opcoes[opcao.name] = { usario: opcao.user, membro: opcao.member };
        //             break;
        //         }

        //         default: {
        //             opcoes[opcao.name] = opcao.value;
        //             break;
        //         }
        //     }
        // }

        const opcoes = {
            subComandoGrupo: iCmd.options.getSubcommandGroup(false),
            subComando: iCmd.options.getSubcommand(false)
        }

        const definirValor = (opcao) => {
            const valor = iCmd.options.get(opcao.name, opcao.required);

            // Se não tiver valor ou opcoes pula
            if (!valor && !opcao.options?.length) return null;

            switch (opcao.type) {
                //* Usuario
                case client.defs.tiposOpcoes.USER:
                    return {
                        usuario: valor.user || null,
                        membro: valor.member || null
                    };

                //* Mencionável
                case client.defs.tiposOpcoes.MENTIONABLE:
                    return {
                        usuario: valor.user || null,
                        membro: valor.member || null,
                        cargo: valor.role || null
                    };

                //* Canal
                case client.defs.tiposOpcoes.CHANNEL:
                    return valor.channel;

                //* Cargo
                case client.defs.tiposOpcoes.ROLE:
                    return valor.role;

                //* Sub Comando
                // Passa por todos as opcoes do sub comando
                case client.defs.tiposOpcoes.SUB_COMMAND: {
                    const valoresDeGrupo = {}
                    for (const subOpcao of opcao.options) {
                        valoresDeGrupo[subOpcao.name] = definirValor(subOpcao) || null;
                    }
                    return valoresDeGrupo;
                }

                //* Grupo Sub Comandos
                // Passa por todos os sub comandos, para passar por todas as opcoes
                case client.defs.tiposOpcoes.SUB_COMMAND_GROUP: {
                    const subOpcoes = {}
                    for (const subGrupo of opcao.options) {
                        subOpcoes[subGrupo.name] = definirValor(subGrupo) || null;
                    }
                    return subOpcoes;
                }

                //* String, Numero, Boolean, Integer
                default:
                    return valor.value;
            }
        }

        for (const opcao of this.opcoes) {
            opcoes[opcao.name] = definirValor(opcao);
        }

        console.debug(iCmd.options.data);
        console.debug(opcoes);

        const pingando = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(`Args enviados`)
            .setDescription(Object.values(opcoes).join(", "));
        await iCmd.reply({ content: null, embeds: [pingando] }).catch();
    }
}