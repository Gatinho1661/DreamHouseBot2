const { MessageButton, MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");
const chrono = require("chrono-node");
const { coletorICCmd } = require("../../utilidades/coletores");
const { criarTimestamp } = require("../../modulos/utils");

module.exports = {
  //* Infomações do comando
  emoji: "🎂",
  nome: "aniversario",
  sinonimos: ["aniversário"],
  descricao: "Edite sua data de aniversário e sua idade",
  exemplos: [
    { comando: "aniversario [data]", texto: "Define seu aniversário e sua idade" }
  ],
  args: "",
  opcoes: [
    {
      name: "data",
      description: "A data em que você nasceu",
      type: client.defs.tiposOpcoes.STRING,
      required: true,
    },
  ],
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
  async executar(iCmd, opcoes) {

    //* Transformar texto em data
    let data = chrono.pt.strict.parseDate(opcoes.data);
    if (!data) {
      return client.responder(
        iCmd,
        "uso",
        "Argumentos errados",
        "Você tem que enviar sua data de nascimento"
      );
    }
    data.setHours(0, 0, 0);

    //* Calcular idade
    const idade = new Date().getFullYear() - data.getFullYear();
    if (idade <= 1) {
      return client.responder(
        iCmd,
        "uso",
        "Argumentos errados",
        "Você tem que enviar sua data de nascimento"
      );
    }

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

    if (usuarioPerfil.dataNascimento?.getTime() === data.getTime()) {
      return client.responder(
        iCmd,
        "bloqueado",
        "Data inválida",
        "Sua data de nascimento já está definido para esse dia"
      );
    }

    const sim = new MessageButton()
      .setCustomId("sim")
      .setLabel("Sim")
      .setDisabled(false)
      .setStyle("SUCCESS");
    const editar = new MessageButton()
      .setCustomId("editar")
      .setLabel("Editar")
      .setDisabled(false)
      .setStyle("PRIMARY");
    const cancelar = new MessageButton()
      .setCustomId("cancelar")
      .setLabel("Cancelar")
      .setDisabled(false)
      .setStyle("DANGER");
    const adicionando = usuarioPerfil.dataNascimento === null;
    let botoes = adicionando ? [sim, cancelar] : [editar, cancelar];

    const Embed = new MessageEmbed()
      .setColor(client.defs.corEmbed.carregando)
      .setTitle(adicionando ? "🎂 Adicionar aniversário" : "🎂 Editar aniversário")
      .setFooter({
        text: "Escolha clicando nos botões",
        iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 })
      });
    adicionando
      ? Embed.addFields([
        {
          name: "Você nasceu em",
          value: `${criarTimestamp(data, "d")} ${criarTimestamp(data, "R")}`,
          inline: false
        },
      ])
      : Embed.addFields([
        {
          name: "Você nasceu em",
          value: `${criarTimestamp(usuarioPerfil.dataNascimento, "d")} `
            + `${criarTimestamp(usuarioPerfil.dataNascimento, "R")}`,
          inline: false
        },
        {
          name: "Você deseja editar para",
          value: `${criarTimestamp(data, "d")} ${criarTimestamp(data, "R")}`,
          inline: false
        },
      ]);
    const resposta = await iCmd.reply({
      content: null,
      embeds: [Embed],
      components: [{ type: "ACTION_ROW", components: botoes }],
      fetchReply: true,
      ephemeral: true
    }).catch();

    //* Respostas para cada botão apertado
    const respostas = {
      async sim(iCMsg) {
        usuarioPerfil.dataNascimento = data;
        usuarioPerfil.idade = idade;
        await usuarioPerfil.save();

        client.log(
          "info",
          `Aniversário de ${iCmd.user.tag} foi definido para ${data.toLocaleDateString()} `
          + `e com ${idade} anos`
        );

        Embed
          .setColor(client.defs.corEmbed.sim)
          .setTitle("🎂 Aniversário adicionado")
          .setFooter(null);
        await iCMsg.update({ embeds: [Embed] });

        return true;
      },
      async editar(iCMsg) {
        usuarioPerfil.dataNascimento = data;
        usuarioPerfil.idade = idade;
        await usuarioPerfil.save();

        client.log(
          "info",
          `Aniversário de ${iCmd.user.tag} foi definido para ${data.toLocaleDateString()} `
          + `e com ${idade} anos`
        );

        Embed
          .setColor(client.defs.corEmbed.normal)
          .setTitle("🎂 Aniversário editado")
          .setFooter(null);
        await iCMsg.update({ embeds: [Embed] });

        return true;
      },
      async cancelar(iCMsg) {
        client.log("info", "Cancelado");

        Embed
          .setColor(client.defs.corEmbed.nao)
          .setTitle("❌ Cancelado")
          .setFooter(null);
        await iCMsg.update({ embeds: [Embed] });

        return true;
      }
    };

    //* Coletor de interações
    const filtro = (i) => i.user.id !== iCmd.user.id;
    coletorICCmd(iCmd, resposta, respostas, filtro);
  }
};