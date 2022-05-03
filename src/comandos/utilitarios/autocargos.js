const { MessageEmbed, MessageSelectMenu } = require("discord.js");
const { coletorICCmd } = require("../../utilidades/coletores");

module.exports = {
  //* Infomações do comando
  emoji: "📋",
  nome: "autocargos",
  sinonimos: [],
  descricao: "Cargos autoaplicáveis",
  exemplos: [],
  args: "",
  opcoes: [],
  canalVoz: false,
  contaPrimaria: false,
  apenasServidor: true,
  apenasDono: false,
  nsfw: false,
  permissoes: {
    usuario: [],
    bot: ["SEND_MESSAGES", "MANAGE_ROLES"]
  },
  cooldown: 1,
  escondido: false,
  suporteBarra: true,
  testando: false,

  //* Comando
  async executar(iCmd) {
    const cargosUsuario = iCmd.member.roles.cache;
    const cargosLista = [];
    const cargosAtuais = [];
    const cargosDisponiveis = [];
    const opcoesSelectMenu = [];

    for (const cargoId of client.autoCargos.indexes) {
      const cargo = client.autoCargos.get(cargoId);
      cargosLista.push(cargoId);

      const temCargo = cargosUsuario.has(cargoId);
      if (temCargo) cargosAtuais.push(cargoId);
      else cargosDisponiveis.push(cargoId);

      opcoesSelectMenu.push({
        label: cargo.nome,
        value: cargoId,
        emoji: {
          id: null,
          name: cargo.emoji
        },
        default: temCargo
      });
    }

    if (!opcoesSelectMenu.length) {
      return client.responder(
        iCmd,
        "bloqueado",
        "Nenhum cargo autoaplicável",
        "Nenhum cargo disponível"
      );
    }


    const selecione = new MessageSelectMenu()
      .setCustomId("selecione")
      .setPlaceholder("Selecione alguem para remover")
      .setOptions(opcoesSelectMenu)
      .setMaxValues(opcoesSelectMenu.length)
      .setMinValues(0);
    const Embed = new MessageEmbed()
      .setColor(client.defs.corEmbed.normal)
      .setTitle("📋 Cargos autoaplicáveis")
      .setDescription(
        "Selecione os cargos que você quer ter,\n"
        + "e deselecione os cargos que você quer remover"
      )
      .setFields(
        {
          name: "Cargos atuais",
          value: cargosAtuais.length
            ? `• <@&${cargosAtuais.join(">\n• <@&")}>`
            : "Nenhum",
          inline: true
        },
        {
          name: "Cargos disponíveis",
          value: cargosDisponiveis.length
            ? `• <@&${cargosDisponiveis.join(">\n• <@&")}>`
            : "Nenhum",
          inline: true
        },
      )
      .setFooter({
        text: "Adicine ou remova um cargo nesse menu",
        iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 })
      });
    const resposta = await iCmd.reply({
      content: null,
      embeds: [Embed],
      fetchReply: true,
      components: [{ type: "ACTION_ROW", components: [selecione] }],
      ephemeral: true
    }).catch();

    //* Respostas para cada botão apertado
    const respostas = {
      async selecione(iCMsg) {
        const cargosSelecionados = cargosLista.filter(c => iCMsg.values.includes(c));
        const cargosDeselecionados = cargosLista.filter(c => !iCMsg.values.includes(c));

        await iCmd.member.roles.add(cargosSelecionados, "Cargo autoaplicado");
        await iCmd.member.roles.remove(cargosDeselecionados, "Cargo autoremovido");

        Embed
          .setFields(
            {
              name: "Cargos atuais",
              value: cargosSelecionados.length
                ? `• <@&${cargosSelecionados.join(">\n• <@&")}>`
                : "Nenhum",
              inline: true
            },
            {
              name: "Cargos disponíveis",
              value: cargosDeselecionados.length
                ? `• <@&${cargosDeselecionados.join(">\n• <@&")}>`
                : "Nenhum",
              inline: true
            },
          )
          .setFooter(null);

        await iCMsg.update({ embeds: [Embed] });

        return true;
      },
    };

    //* Coletor de interações
    const filtro = (i) => i.user.id !== iCmd.user.id;
    coletorICCmd(iCmd, resposta, respostas, filtro);
  },
};