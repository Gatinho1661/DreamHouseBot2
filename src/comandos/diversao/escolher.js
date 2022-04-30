const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "🤔",
    nome: "escolher",
    sinonimos: [],
    descricao: "Precisa de ajuda para escolher alguma coisa? Deixa comigo",
    exemplos: [
        { comando: "escolher [escolha1] [escolha1] ...", texto: "Escolha entre 2 ou + escolhas" },
    ],
    args: "",
    opcoes: [
        {
            name: "escolha1",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: true
        },
        {
            name: "escolha2",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: true
        },
        {
            name: "escolha3",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha4",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha5",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha6",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha7",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha8",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha9",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha10",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha11",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha12",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha13",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha14",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha15",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha16",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha17",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha18",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha19",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha20",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha21",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha22",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha23",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha24",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
        {
            name: "escolha25",
            description: "Lista de opções para escolher para você",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        }
    ],
    canalVoz: false,
    contaPrimaria: false,
    apenasServidor: false,
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
        //* Pegar todas as opcoes
        const escolhas = Object.values(opcoes).filter(e => e);
        const escolha = escolhas[Math.floor(Math.random() * escolhas.length)];

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle("🤔 Eu escolho")
            .setDescription(`${escolha}`)
        iCmd.reply({ content: null, embeds: [Embed] }).catch();
    }
}