const { MessageEmbed } = require("discord.js");

// Emitido quando um comando é bloqueado de ser executado
module.exports = async (usuarioId) => {
    const canalId = client.config.get("aniversarios")
    if (!canalId) return client.log("bot", "Nenhum canal para aniversários definido", "aviso");

    const canal = await client.channels.fetch(canalId);
    if (!canal) return client.log("bot", "Canal de aniversários não foi encontrado", "erro");


}