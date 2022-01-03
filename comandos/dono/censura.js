const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "",
    nome: "censura",
    sinonimos: ["censurar"],
    descricao: "Censura apagando todos os snipes",
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

        const canalId = args[0] || msg.channel.id

        // apaga os snipes do canal
        client.snipes.delete(canalId);
        // apaga os edit snipes do canal
        client.editSnipes.delete(canalId);

        client.log("bot", `Snipes de ${canalId} apagados`);

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.sim)
            .setTitle('✅ Censurado')
            .setDescription(`Snipes de <#${canalId}> apagados`)
        await msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch();
    }
};