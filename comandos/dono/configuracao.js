const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "",
    nome: "configuracao",
    sinonimos: ["config", "configuração"],
    descricao: "Define as configurações do bot",
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
    async executarMsg(msg, args) {
        if (!args[0]) if (!args[0]) {
            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle(`⛔ Faltando argumentos`)
                .setDescription('Qual configuração você deseja alterar?')
            return msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch();
        }
        if (!args[1]) {
            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle(`⛔ Faltando argumentos`)
                .setDescription('Defina um valor da configuração que você deseja alterar')
            return msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch();
        }

        const configNome = args.shift();
        const configValor = args.join(" ");

        const config = client.config.get(configNome);
        //? Adicionar confirmação

        client.config.set(configNome, JSON.parse(configValor));
        client.log("bot", `Configuração "${configNome}" atualizada para ${configValor}`);

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.sim)
            .setTitle(`✅ Configuração "${configNome}" atualizada`)
            .addField(`Antes`, `${config}`, false)
            .addField(`Depois`, `${configValor}`, false);
        await msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch();
    }
};