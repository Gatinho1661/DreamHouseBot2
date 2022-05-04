// eslint-disable-next-line no-unused-vars
const { MessageEmbed, CommandInteraction } = require("discord.js");
const { traduzirPerms } = require("./utils");

/**
 * @param {CommandInteraction} iCmd Interação de comando
 * @param {"uso"|"erro"|"bloqueado"|"permissao"|"mensagem"} motivo Motivo da resposta
 * @param {string} titulo Titulo da resposta
 * @param {string} descricao Descrição da resposta
 * @param {boolean} ephemeral Enviar a resposta apenas visível apenas para o usuário?
 */
module.exports = (iCmd, motivo, titulo, descricao, ephemeral = true) => {
  const cmd = client.comandos.get(iCmd.commandName);
  if (!cmd) throw new Error("Comando não encontrado");

  if (!iCmd.channel.permissionsFor(client.user).has("SEND_MESSAGES")) {
    return client.log("aviso", "A mensagem de uso não foi enviada por falta de permissões");
  }
  //TODO enviar DM para o usuario caso nao tenha perms para enviar no canal

  switch (motivo) {
    case "uso": {
      const formatarExemplos = (exemplosArray) => {
        let exemplos = "";

        for (const exe of exemplosArray) {
          exemplos += `\n[\`/${exe.comando}\`](https://nao.clique/de-hover-sobre '${exe.texto}')`;
        }
        return exemplos;
      };

      const Embed = new MessageEmbed()
        .setColor(client.defs.corEmbed.normal)
        .setTitle("⛔ " + titulo || "Comando escrito errado")
        .setDescription(descricao || cmd.descricao)
        .addField("📖 Exemplos", formatarExemplos(cmd.exemplos));
      if (cmd.sinonimos.length > 0) {
        Embed.addField("🔀 Sinônimos", `\`${cmd.sinonimos.join("`\n`")}\``);
      }
      if (cmd.permissoes.usuario > 0) {
        Embed.addField(
          "📛 Permissão necessária",
          `\`${traduzirPerms(cmd.permissoes.usuario).join("`\n`")}\``
        );
      }

      if (iCmd.replied) iCmd.followUp({ content: null, embeds: [Embed], ephemeral }).catch();
      if (iCmd.deferred) iCmd.editReply({ content: null, embeds: [Embed], ephemeral }).catch();
      else iCmd.reply({ content: null, embeds: [Embed], ephemeral }).catch();
      break;
    }
    case "erro": {
      const Embed = new MessageEmbed()
        .setColor(client.defs.corEmbed.erro)
        .setTitle("❗ " + titulo || "Ocorreu um erro")
        .setDescription(descricao || `Fale com o <@${client.owners[0].id}> para arrumar isso`);
      if (iCmd.replied) iCmd.followUp({ content: null, embeds: [Embed], ephemeral }).catch();
      if (iCmd.deferred) iCmd.editReply({ content: null, embeds: [Embed], ephemeral }).catch();
      else iCmd.reply({ content: null, embeds: [Embed], ephemeral }).catch();
      break;
    }
    case "bloqueado": {
      const Embed = new MessageEmbed()
        .setColor(client.defs.corEmbed.nao)
        .setTitle("🚫 " + titulo || "🚫 Você não pode fazer isso")
        .setDescription(descricao || "Você não consegue fazer isso");
      if (iCmd.replied) iCmd.followUp({ content: null, embeds: [Embed], ephemeral }).catch();
      if (iCmd.deferred) iCmd.editReply({ content: null, embeds: [Embed], ephemeral }).catch();
      else iCmd.reply({ content: null, embeds: [Embed], ephemeral }).catch();
      break;
    }
    case "permissao": {
      const Embed = new MessageEmbed()
        .setColor(client.defs.corEmbed.nao)
        .setTitle("📛 " + titulo || "📛 Você não tem permissão")
        .setDescription(descricao || "Você não pode fazer isso");
      if (iCmd.replied) iCmd.followUp({ content: null, embeds: [Embed], ephemeral }).catch();
      if (iCmd.deferred) iCmd.editReply({ content: null, embeds: [Embed], ephemeral }).catch();
      else iCmd.reply({ content: null, embeds: [Embed], ephemeral }).catch();
      break;
    }
    case "mensagem": {
      const Embed = new MessageEmbed()
        .setColor(client.defs.corEmbed.normal)
        .setTitle(titulo)
        .setDescription(descricao);
      if (iCmd.replied) iCmd.followUp({ content: null, embeds: [Embed], ephemeral }).catch();
      if (iCmd.deferred) iCmd.editReply({ content: null, embeds: [Embed], ephemeral }).catch();
      else iCmd.reply({ content: null, embeds: [Embed], ephemeral }).catch();
      break;
    }
    default: {
      throw new Error("Motivo não definido");
    }
  }

  //return client.emit("respondido", excTempo, this, msg, args);
};
/*
✅ = sim
❌ = Nao
🚫 = Bloqueado
📛 = sem perm
⛔ = Faltando coisa
❓ = tem certeza?
❗ = ERRO
⚠️ = AVISO
*/
