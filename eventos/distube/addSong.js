const { MessageButton, MessageEmbed, SnowflakeUtil } = require("discord.js");
const { Queue, Song } = require("distube"); // eslint-disable-line no-unused-vars
const { encontrarPosicao } = require("../../modulos/utils");

// Emitido quando uma música é adicionada
module.exports = {
    nome: "addSong",
    once: false, // Se deve ser executado apenas uma vez
    origem: client.distube,

    /**
     * 
     * @param {Queue} filaMusicas 
     * @param {Song} musica 
     */
    async executar(filaMusicas, musica) {
        client.log("musica", `Música adicionada: "${musica.name}" em: ${filaMusicas.voiceChannel?.name}`);

        // Gera um id para música
        musica.metadata.id = SnowflakeUtil.generate();

        const iCmd = musica.metadata.iCmd;
        if (iCmd) {
            const posicao = encontrarPosicao(filaMusicas, musica);

            const link = new MessageButton()
                .setLabel("Ir para música")
                .setStyle("LINK")
                .setURL(musica.url)
            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.normal)
                .setTitle(`🎵 Música adicionada`)
                .setDescription(`[${musica.uploader.name}](${musica.uploader.url} 'Ir para autor') - ${musica.name}`)
                .addField("🔢 Posição", `${posicao.posicaoMusica}/${posicao.tamanhoFila}`, true)
                .addField("⏳ Duração", `${musica.formattedDuration}`, true)
                .setImage(musica.thumbnail);
            await iCmd.editReply({
                content: null,
                embeds: [Embed],
                components: [{ type: 'ACTION_ROW', components: [link] }]
            }).catch();
        }
    }
}