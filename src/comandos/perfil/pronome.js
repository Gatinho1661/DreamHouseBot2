const { MessageSelectMenu, MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");
const { coletorICCmd } = require("../../utilidades/coletores");

module.exports = {
  //* Infomações do comando
  emoji: "⚧",
  nome: "pronome",
  sinonimos: [],
  descricao: "Escolha um pronome no qual se identifica",
  exemplos: [
    { comando: "pronome", texto: "Escolha um pronome no qual se identifica" }
  ],
  args: "",
  opcoes: [],
  canalVoz: false,
  contaPrimaria: false,
  apenasServidor: false,
  apenasDono: false,
  nsfw: false,
  permissoes: {
    usuario: [],
    bot: ["SEND_MESSAGES"]
  },
  cooldown: 1,
  escondido: false,
  suporteBarra: true,
  testando: false,

  //* Comando
  async executar(iCmd) {
    //* Pegar dados do usuário
    const Usuario = mongoose.model("Usuario");
    const usuarioPerfil = await Usuario.findOne({ "contas": iCmd.user.id });

    //* TODO define os dados do usuário da pessoa caso nao tenha
    if (!usuarioPerfil) {
      return client.responder(
        iCmd,
        "bloqueado",
        "Você não tem um perfil",
        "você não criou seu perfil ainda"
      );
    }

    const formatosPronomes = { "ele": "Ele/Dele", "ela": "Ela/Dela", "elu": "Elu/Delu" };
    const pronomes = formatosPronomes[usuarioPerfil.pronomes] || "Não especificado";

    const opcoesSelectMenu = [
      {
        label: "Ele/Dele",
        value: "ele",
        default: usuarioPerfil.pronomes === "ele"
      },
      {
        label: "Ela/Dela",
        value: "ela",
        default: usuarioPerfil.pronomes === "ela"
      },
      {
        label: "Elu/Delu",
        value: "elu",
        default: usuarioPerfil.pronomes === "elu"
      }
    ];

    const selecione = new MessageSelectMenu()
      .setCustomId("selecione")
      .setPlaceholder("Selecione seu pronome")
      .setOptions(opcoesSelectMenu)
      .setMaxValues(1)
      .setMinValues(0);
    const Embed = new MessageEmbed()
      .setColor(client.defs.corEmbed.carregando)
      .setTitle("⚧ Editar seu pronome")
      .setDescription(`"${pronomes}"`)
      .setFooter({
        text: "Adicione ou remova um pronome nesse menu",
        iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 })
      });
    const resposta = await iCmd.reply({
      content: null,
      embeds: [Embed],
      components: [{ type: "ACTION_ROW", components: [selecione] }],
      fetchReply: true,
      ephemeral: true
    }).catch();

    //* Respostas para cada botão apertado
    const respostas = {
      async selecione(iCMsg) {
        const pronomeNovo = iCMsg.values[0] || null;
        const pronomeFormatado = formatosPronomes[pronomeNovo] || "Não especificado";

        usuarioPerfil.pronomes = pronomeNovo;
        await usuarioPerfil.save();

        client.log(
          "info",
          `Pronome de ${iCmd.user.tag} foi definido para ${pronomeFormatado}`
        );

        Embed
          .setColor(client.defs.corEmbed.sim)
          .setTitle("⚧ Pronome editado")
          .setDescription(`"${pronomeFormatado}"`)
          .setFooter(null);
        await iCMsg.update({ embeds: [Embed] });

        return true;
      },
    };

    //* Coletor de interações
    const filtro = (i) => i.user.id !== iCmd.user.id;
    coletorICCmd(iCmd, resposta, respostas, filtro);
  }
};