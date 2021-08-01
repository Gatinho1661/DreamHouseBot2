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

    //* Comando
    async executar(msg, args) {
        if (!args[0]) return client.responder(msg, this, "uso", "Faltando argumentos", "Qual configuração você deseja alterar?");
        if (!args[1]) return client.responder(msg, this, "uso", "Faltando argumentos", "Defina um valor da configuração que você deseja alterar");

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