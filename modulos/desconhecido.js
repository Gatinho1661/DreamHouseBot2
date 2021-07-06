const { MessageEmbed } = require("discord.js");
const parece = require("string-similarity");


module.exports = (msg, nomeComando) => {

    const comandos = []
    client.comandos.each(cmd => {
        if (cmd.escondido) return;
        if (cmd.apenasDono) return;
        comandos.push(cmd.nome)
        comandos.concat(cmd.sinonimos)
    })

    if (comandos.length === 0) return client.log("aviso", "nenhum comando visível encontrado")

    // procurar por comandos similar
    const similar = parece.findBestMatch(nomeComando, comandos)

    if (similar.bestMatch.rating >= 0.3) {
        client.log("info", `Comando sugerido ${similar.bestMatch.target}`)

        const resposta = new MessageEmbed()
            .setColor(client.defs.corEmbed.aviso)
            .setTitle(`❓ Comando não encontrado`)
            .setDescription(`você quis dizer: \`${similar.bestMatch.target}\`?`)
        msg.channel.send({ content: null, embeds: [resposta], reply: { messageReference: msg } }).catch();
    } else {
        client.log("info", `Nenhum comando foi encontrado com o nome ${nomeComando}`)
    }

};