const { MessageButton, MessageEmbed } = require("discord.js");
const { coletorICCmd } = require("../../utilidades/coletores");

module.exports = {
  //* Infomações do comando
  emoji: "💍",
  nome: "casar",
  sinonimos: [],
  descricao: "Case com aquela pessoa do seus sonhos",
  exemplos: [
    { comando: "casar [usuario]", texto: "Casar-se com uma pessoa mencionada" },
  ],
  args: "{usuario}",
  opcoes: [
    {
      name: "usuario",
      description: "Pessoa do seus sonhos",
      type: client.defs.tiposOpcoes.USER,
      required: true,
    },
  ],
  canalVoz: false,
  contaPrimaria: false,
  apenasServidor: true,
  apenasDono: false,
  nsfw: false,
  permissoes: {
    usuario: [],
    bot: ["SEND_MESSAGES"]
  },
  cooldown: 1,
  suporteBarra: true,
  testando: false,

  //* Comando
  async executar(iCmd, opcoes) {
    const proposto = opcoes.usuario.usuario;

    if (proposto.id === client.user.id) return client.responder(iCmd, "bloqueado", "Ewww", "Não.");
    if (proposto.bot) {
      return client.responder(
        iCmd,
        "bloqueado",
        "Você não pode se casar com um bot",
        "Eles não tem sentimentos, acredita em mim..."
      );
    }

    if (proposto.id === iCmd.user.id) {
      return client.responder(
        iCmd,
        "bloqueado",
        "Você não pode ser casar com você mesmo",
        "Isso seria muito triste..."
      );
    }

    // Define o relacionamento da pessoa caso nao tenha
    client.relacionamentos.ensure(`${iCmd.user.id}`, {
      usuario: iCmd.user.username,
      conjugeId: null,
      conjugeNome: null,
      dataCasamento: null,
      amantes: [],
    });

    // Define o relacionamento do proposto caso nao tenha
    client.relacionamentos.ensure(`${proposto.id}`, {
      usuario: proposto.username,
      conjugeId: null,
      conjugeNome: null,
      dataCasamento: null,
      amantes: [],
    });

    var usuRelacao = client.relacionamentos.get(iCmd.user.id);
    var propostoRelacao = client.relacionamentos.get(proposto.id);

    // Verificar se algum dos 2 é casado
    if (usuRelacao.conjugeId) {
      return client.responder(
        iCmd,
        "bloqueado",
        "Você já está casado com uma pessoa",
        "Se você já esqueceu disso, provavelmente não ta indo muito bem as coisas..."
      );
    }

    if (propostoRelacao.conjugeId) {
      return client.responder(
        iCmd,
        "bloqueado",
        "Essa pessoa já está casado com uma pessoa",
        "Você não pode se casar com alguém que já está comprometida"
      );
    }
    const saoAmantes = usuRelacao.amantes.includes(proposto.id);

    const aceitar = new MessageButton()
      .setCustomId("aceitar")
      .setLabel("Aceitar")
      .setDisabled(false)
      .setStyle("SUCCESS");
    const rejeitar = new MessageButton()
      .setCustomId("rejeitar")
      .setLabel("Rejeitar")
      .setDisabled(false)
      .setStyle("DANGER");
    let botoes = [aceitar, rejeitar];

    //* Aceitas?
    const Embed = new MessageEmbed()
      .setColor(client.defs.corEmbed.carregando)
      .setTitle("💍 Proposta de casamento!")
      .setDescription(
        `${iCmd.user.toString()} está pedindo `
        + `${saoAmantes ? "seu amante " : ""}${proposto.toString()} em casamento`
      )
      .setFooter({
        text: "Escolha clicando nos botões",
        iconURL: proposto.displayAvatarURL({ dynamic: true, size: 32 })
      });
    const resposta = await iCmd.reply({
      content: null,
      embeds: [Embed],
      components: [{ type: "ACTION_ROW", components: botoes }],
      fetchReply: true
    }).catch();

    //* Respostas para cada botão apertado
    const respostas = {
      async aceitar(iBto) {
        usuRelacao = client.relacionamentos.get(iCmd.user.id);
        propostoRelacao = client.relacionamentos.get(proposto.id);

        // Verificar novamente para não ter erro
        if (usuRelacao.conjugeId) throw new Error("Usuário já casado com outra pessoa");
        if (propostoRelacao.conjugeId) throw new Error("Proposto já casado com outra pessoa");

        //* Casar
        const dataCasamento = new Date().toISOString();
        client.relacionamentos.set(iCmd.user.id, proposto.id, "conjugeId");
        client.relacionamentos.set(proposto.id, iCmd.user.id, "conjugeId");

        client.relacionamentos.set(iCmd.user.id, proposto.username, "conjugeNome");
        client.relacionamentos.set(proposto.id, iCmd.user.username, "conjugeNome");

        client.relacionamentos.set(iCmd.user.id, dataCasamento, "dataCasamento");
        client.relacionamentos.set(proposto.id, dataCasamento, "dataCasamento");

        if (saoAmantes) { // remover status de amantes
          client.relacionamentos.remove(iCmd.user.id, proposto.id, "amantes");
          client.relacionamentos.remove(proposto.id, iCmd.user.id, "amantes");
        }

        Embed
          .setColor(client.defs.corEmbed.sim)
          .setTitle("🎉 Felicidades ao casal!")
          .setDescription(`${iCmd.user.toString()} e ${proposto.toString()} agora estão casados`)
          .setFooter(null);
        await iBto.update({ embeds: [Embed] });

        client.log("info", `${iCmd.user.username} e ${proposto.username} agora estão casados`);

        return true;
      },
      async rejeitar(iBto) {
        Embed
          .setColor(client.defs.corEmbed.nao)
          .setTitle("💔 Ainda há muito peixe no mar")
          .setDescription(
            `${iCmd.user.toString()} teve seu pedido de casamento rejeitado por ${proposto.toString()}`
          )
          .setFooter(null);
        await iBto.update({ embeds: [Embed] });

        client.log(
          "info",
          `${iCmd.user.username} teve seu pedido de casamento rejeitado por ${proposto.username}`
        );

        return true;
      }
    };

    //* Coletor de interações
    const filtro = (iBto) => iBto.user.id !== proposto.id;
    coletorICCmd(iCmd, resposta, respostas, filtro);
  }
};
