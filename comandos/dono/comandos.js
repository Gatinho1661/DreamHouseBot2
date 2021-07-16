const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "",
    nome: "cbarra",
    sinonimos: [],
    descricao: "Atualiza ou remove todos os comandos /",
    exemplos: ["!cbarra"],
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

        if (!args[0]) {
            const argsEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle(`⛔ Faltando argumentos`)
                .setDescription(`Qual comando ou grupo você quer recarregar ?`);
            await msg.channel.send({ content: null, embeds: [argsEmbed], reply: { messageReference: msg } }).catch();
            return;
        }

        if (args[0] === "deletar") {
            await client.application?.commands.set([])

            const semArgs = new MessageEmbed()
                .setColor(client.defs.corEmbed.sim)
                .setTitle(`✅ Comandos deletados`)
                .setDescription(`Todos os comandos / foram deletados globalmente`);
            await msg.channel.send({ content: null, embeds: [semArgs], reply: { messageReference: msg } }).catch();
            client.console("bot", "Todos os comandos / foram deletados globalmente")
        } else if (args[0] === "atualizar") {
            const server = "353942726389137428"

            const memesNomes = client.memes.indexes
            console.debug(memesNomes)

            let memes = []

            for (let i = 0; i < memesNomes.length; i++) {
                const meme = client.memes.get(memesNomes[i]);

                memes.push({
                    name: memesNomes[i],
                    description: `Meme criado por ${meme.usuario}`
                })
            }

            await client.application?.commands.set(memes, server);

            const atualizado = new MessageEmbed()
                .setColor(client.defs.corEmbed.sim)
                .setTitle(`✅ Comandos atualizados`)
                .setDescription(`Todos os comandos / foram atualizados globalmente`);
            await msg.channel.send({ content: null, embeds: [atualizado], reply: { messageReference: msg } }).catch();
            client.console("bot", "Todos os comandos / foram atualizados globalmente")

            ////console.debug(await client.application.commands.cache.map(cmd => cmd))
        } else {
            const erradoArgs = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle(`⛔ Faltando errados`)
                .setDescription(`Qual comando ou grupo você quer recarregar ?`);
            await msg.channel.send({ content: null, embeds: [erradoArgs], reply: { messageReference: msg } }).catch();
        }
    }
};