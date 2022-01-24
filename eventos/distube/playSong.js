// eslint-disable-next-line no-unused-vars
const { Queue, Song } = require("distube");
const { MessageButton, MessageEmbed } = require("discord.js");

// Emitido quando uma música começa a tocar
module.exports = {
    nome: "playSong",
    once: false, // Se deve ser executado apenas uma vez
    origem: client.distube,

    /**
     * 
     * @param {Queue} filaMusicas 
     * @param {Song} musica 
     */
    async executar(filaMusicas, musica) {
        console.debug(`Tocando música: ${musica.name} em: ${filaMusicas.voiceChannel?.name}`)

        const metadata = musica.metadata;

        // Fila com músicas anteriores e próximas
        const filaCompleta = filaMusicas.previousSongs.concat(filaMusicas.songs);

        const link = new MessageButton()
            .setLabel("Ir para música")
            .setStyle("LINK")
            .setURL(musica.url);
        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`▶️ Tocando música`)
            .setDescription(`${musica.name}`)
            .setImage(musica.thumbnail)
            .addField("👤 Autor", `[${musica.uploader.name}](${musica.uploader.url} 'Ir para autor')`, true)
            .addField("⏳ Duração", `${musica.formattedDuration}`, true)
            .addField("🔢 Posição", `${filaMusicas.previousSongs.length + 1}/${filaCompleta.length}`, true)
            .setFooter({ text: `Adicionado por ${musica.member.displayName}`, iconURL: musica.member.displayAvatarURL({ dynamic: true, size: 32 }) });
        const msg = {
            content: null,
            embeds: [Embed],
            components: [{ type: 'ACTION_ROW', components: [link] }]
        }

        // Responde o comando se tiver apenas uma música adicionada a lista
        // se não envia uma mensagem separada
        if (filaCompleta.length > 1) {
            if (metadata?.resposta) await metadata.resposta.reply(msg).catch();
            else await filaMusicas.textChannel.send(msg).catch(); // Caso a música não seja adicionada por ninguém
        } else await metadata.iCmd.editReply(msg).catch();

    }
}