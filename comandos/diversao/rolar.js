const { MessageEmbed } = require("discord.js");
const { DiceRoller } = require("@dice-roller/rpg-dice-roller"); // TODO fazer o meu proprio, pois esse é confuso e horrivel de implementar

module.exports = {
    //* Infomações do comando
    emoji: "🎲",
    nome: "rolar",
    sinonimos: [],
    descricao: "Rola um dado",
    exemplos: [
        { comando: "rolar [dado]", texto: "Rola um dado" },
    ],
    args: "",
    opcoes: [
        {
            name: "dado",
            description: "Número de dados e lados, você pode usar \"1d20\"",
            type: client.defs.tiposOpcoes.STRING,
            required: false
        },
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
        const rolar = new DiceRoller();

        const resultado = rolar.roll(opcoes.dado || "1d100");

        if (resultado.toString().length > 2048) return client.responder(iCmd, "bloqueado", "Grande demais", "Escolha uns números menores tente novamente");

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle("🎲 Rolar")
            .setDescription(resultado.toString())
        iCmd.reply({ content: null, embeds: [Embed] }).catch();
    }
}