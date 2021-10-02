const { MessageEmbed } = require("discord.js");

module.exports = async (i, id) => {
    if (!i.channel.permissionsFor(client.user).has(['SEND_MESSAGES', 'MANAGE_ROLES'])) return client.log("aviso", "Não consigo adicionar cargo por falta de permissão")

    const cargo = await i.guild.roles.fetch(id);

    //* Adicionar cargo
    if (!i.member.roles.cache.find(c => c.id === cargo.id)) {
        i.member.roles.add(cargo, "Cargo autoaplicado")

        const embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.sim)
            .setTitle("✅ Cargo adicionado")
            .setDescription(`${cargo.toString()} foi adicionado`)
        i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();

        //* Remover cargo
    } else {
        i.member.roles.remove(cargo, "Cargo autoremovido")

        const embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.nao)
            .setTitle("❌ Cargo removido")
            .setDescription(`${cargo.toString()} foi removido`)
        i.reply({ content: null, embeds: [embed], ephemeral: true }).catch();
    }
}