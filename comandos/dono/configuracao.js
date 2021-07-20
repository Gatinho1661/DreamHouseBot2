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
        if (!args[0]) return client.responder(msg, this, "uso", "⛔ Faltando argumentos", "Qual configuração você deseja alterar?");
        if (!args[1]) return client.responder(msg, this, "uso", "⛔ Faltando argumentos", "Defina um valor da configuração que você deseja alterar");

        const config = client.config.get(args[0]);
        //? Adicionar confirmação

        client.config.set(args[0], args[1]);
        client.log("bot", `Configuração "${args[0]}" atualizada para ${args[1]}`);

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.sim)
            .setTitle(`✅ Configuração "${args[0]}" atualizada`)
            .addField(`Antes`, `${config}`, true)
            .addField(`Depois`, `${args[1]}`, true);
        await msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch();
    }
};