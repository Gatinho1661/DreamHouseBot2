const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "",
    nome: "cbarra",
    sinonimos: [],
    descricao: "Atualiza ou remove todos os comandos /",
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

        if (!args[0]) return client.responder(msg, this, "uso", "Faltando argumentos", "Você quer atualizar ou deletar os comandos?")

        if (args[0] === "deletar") {
            await client.application?.commands.set([])

            const semArgs = new MessageEmbed()
                .setColor(client.defs.corEmbed.sim)
                .setTitle(`✅ Comandos deletados`)
                .setDescription(`Todos os comandos / foram deletados globalmente`);
            await msg.channel.send({ content: null, embeds: [semArgs], reply: { messageReference: msg } }).catch();
            client.console("bot", "Todos os comandos / foram deletados globalmente")
        } else if (args[0] === "atualizar") {
            const server = msg.guildId //"353942726389137428"

            const memesNomes = client.memes.indexes
            console.debug(memesNomes) //TODO Remover isso

            let memes = []

            for (let i = 0; i < memesNomes.length; i++) {
                const meme = client.memes.get(memesNomes[i]);

                memes.push({
                    name: memesNomes[i],
                    description: `Meme criado por ${meme.usuario}`, //TODO Criar descrições para cada meme
                    type: 1,
                    "options": [
                        {
                            "name": "usuario",
                            "description": "Usuário para eu marcar com esse meme",
                            "type": 6,
                            "required": false
                        }
                    ]
                })
            }

            await client.application?.commands.set(memes, server);

            const atualizado = new MessageEmbed()
                .setColor(client.defs.corEmbed.sim)
                .setTitle(`✅ Comandos atualizados`)
                .setDescription(`Todos os comandos / foram atualizados globalmente`);
            await msg.channel.send({ content: null, embeds: [atualizado], reply: { messageReference: msg } }).catch();
            client.log("bot", "Todos os comandos / foram atualizados globalmente")

            ////console.debug(await client.application.commands.cache.map(cmd => cmd))
        } else {
            client.responder(msg, this, "uso", "Argumentos errados", "Você quer atualizar ou deletar os comandos?")
        }
    }
};