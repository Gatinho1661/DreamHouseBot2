const { MessageEmbed } = require("discord.js");

// Emitido quando um membro entra no servidor
module.exports = {
  nome: "guildMemberRemove",
  once: false, // Se deve ser executado apenas uma vez
  origem: client,

  async executar(membro) {
    try {
      const config = client.config.get("saida");

      if (!config) return client.log("servidor", "Config de saida não encontrada", "erro");
      if (!config.msg) return client.log("servidor", "Mensagem de saida não encontrada", "erro");
      if (!config.gif) return client.log("servidor", "Gif de saida não encontrada", "erro");
      if (!config.canalID) return client.log("servidor", "Canal de saida não encontrada", "erro");

      const canal = await client.channels.fetch(config.canalID);
      if (!canal) return client.log("servidor", "Canal de saida não encontrada", "erro");

      //* Enviar aviso
      const Embed = new MessageEmbed()
        .setColor(client.defs.corEmbed.saida)
        .setAuthor({
          name: `${membro.user.tag}`,
          iconURL: membro.user.displayAvatarURL({ dynamic: true, size: 32 })
        })
        .setTitle(config.msg)
        .setImage(config.gif)
        .setTimestamp();
      canal.send({ content: `> <@!${membro.user.id}> Até mais tarde...`, embeds: [Embed] }).catch();

      client.log("servidor", `${membro.user.username} saiu do servidor`);

      const posicaoBot = membro.guild.me.roles.highest.position;
      let cargos = membro.roles.cache;
      let cargosPerdidos = [];

      //* Filtrar para os cargos que eu posso adicionar
      cargos = cargos.filter(cargo => {
        if (cargo.position > posicaoBot || cargo.managed === true || cargo.name === "@everyone") {
          if (cargo.name !== "@everyone") cargosPerdidos.unshift(cargo.name);
          return false;
        }
        return true;
      });

      //* Salvar cargos
      client.cargosSalvos.set(membro.id, { cargos, cargosPerdidos });
    } catch (err) {
      client.log("servidor", "Ocorreu um erro ao enviar a mensagem de saida", "erro");
      client.log("erro", err.stack);
    }
  }
};