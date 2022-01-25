// eslint-disable-next-line no-unused-vars
const { Queue, Playlist } = require("distube");
const { MessageButton, MessageEmbed, SnowflakeUtil } = require("discord.js");

// Emitido quando uma playlist é adicionada
module.exports = {
    nome: "addList",
    once: false, // Se deve ser executado apenas uma vez
    origem: client.distube,

    /**
     * 
     * @param {Queue} filaMusicas 
     * @param {Playlist} playlist 
     */
    async executar(filaMusicas, playlist) {
        console.debug(`${playlist.songs.length} músicas foram adicionadas em: ${filaMusicas.voiceChannel?.name}`)

        // Gera um id paras músicas
        playlist.metadata.id = SnowflakeUtil.generate();

        const iCmd = playlist.metadata.iCmd;
        if (iCmd) {
            const link = new MessageButton()
                .setLabel(`Ir para playlist`)
                .setStyle("LINK")
                .setURL(playlist.url)
            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.normal)
                .setTitle(`🎵 Playlist adicionada`)
                .setDescription(`${playlist.name}`)
                .addField("🎶 Músicas", `${playlist.songs.length}`, true)
                .addField("⏳ Duração", `${playlist.formattedDuration}`, true)
                .setImage(playlist.thumbnail)
                .setFooter({ text: `Adicionado por ${playlist.member.displayName}`, iconURL: playlist.member.displayAvatarURL({ dynamic: true, size: 32 }) });
            await iCmd.editReply({
                content: null,
                embeds: [Embed],
                components: [{ type: 'ACTION_ROW', components: [link] }]
            }).catch();
        }
    }
}