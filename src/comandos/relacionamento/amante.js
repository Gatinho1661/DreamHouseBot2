const { MessageButton, MessageEmbed, MessageSelectMenu } = require("discord.js");
const { coletorICCmd } = require("../../utilidades/coletores");

module.exports = {
  //* Infomações do comando
  emoji: "💕",
  nome: "amante",
  sinonimos: [],
  descricao: "Seja amante com uma pessoa do seus sonhos",
  exemplos: [
    { comando: "amante [usuario]", texto: "Seja amante com uma pessoa mencionada" },
    { comando: "amante", texto: "Veja a lista de seus amantes" },

  ],
  args: "{usuario}",
  opcoes: [
    {
      name: "usuario",
      description: "Pessoa para ser sua amante",
      type: client.defs.tiposOpcoes.USER,
      required: false
    }
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
    const proposto = opcoes.usuario?.usuario;

    // Define o relacionamento da pessoa caso nao tenha
    client.relacionamentos.ensure(`${iCmd.user.id}`, {
      usuario: iCmd.user.username,
      conjugeId: null,
      conjugeNome: null,
      dataCasamento: null,
      amantes: []
    });

    //* Executar caso não tenha usuario
    if (!proposto) {
      const usuRelacao = client.relacionamentos.get(iCmd.user.id);

      if (!usuRelacao.amantes.length) {
        if (usuRelacao.conjugeId) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Você não tem nenhum amante",
            "Vejo que continua fiel"
          );
        }

        return client.responder(
          iCmd,
          "bloqueado",
          "Você não tem nenhum amante",
          "Sei que é complicado a realidade, mas você tem que aceitar..."
        );
      }

      const numeros = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
      let amantesLista = [];
      const opcoesSelectMenu = [];

      for (let i = 0; i < usuRelacao.amantes.length; i++) {
        const amante = usuRelacao.amantes[i];
        const usuario = await client.users.fetch(amante);
        amantesLista.push(`${numeros[i]} - ${usuario?.username || "Usuário não encontrado"}`);

        opcoesSelectMenu.push({
          label: usuario?.username || "Usuário não encontrado",
          value: usuario?.id || amante,
          emoji: {
            id: null,
            name: numeros[i]
          },
          default: false
        });
      }

      const selecione = new MessageSelectMenu()
        .setCustomId("selecione")
        .setPlaceholder("Selecione alguem para remover")
        .setOptions(opcoesSelectMenu);
      const terminar = new MessageButton()
        .setCustomId("terminar")
        .setLabel("Terminar")
        .setDisabled(false)
        .setStyle("DANGER");
      const cancelar = new MessageButton()
        .setCustomId("cancelar")
        .setLabel("Cancelar")
        .setDisabled(false)
        .setStyle("PRIMARY");
      let botoes = [terminar, cancelar];

      const Embed = new MessageEmbed()
        .setColor(client.defs.corEmbed.normal)
        .setTitle("💕 Seus amantes")
        .setDescription(amantesLista.join("\n"))
        .setFooter({
          text: "Remova um amante nesse menu",
          iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 })
        });
      const resposta = await iCmd.reply({
        content: null,
        embeds: [Embed],
        fetchReply: true,
        components: [{ type: "ACTION_ROW", components: [selecione] }]
      }).catch();

      //* Respostas para cada botão apertado
      const respostas = {
        selecionado: null,

        async selecione(iCMsg) {
          this.selecionado = iCMsg.values[0];

          for (const opcao of selecione.options) {
            if (iCMsg.values.includes(opcao.value)) opcao.default = true;
            else opcao.default = false;
          }

          Embed
            .setColor(client.defs.corEmbed.carregando)
            .setTitle("💔 Termino")
            .setDescription("Deseja terminar com o amante selecionado?")
            .setFooter(null);
          await iCMsg.update({
            embeds: [Embed],
            components: [
              { type: "ACTION_ROW", components: [selecione] },
              { type: "ACTION_ROW", components: botoes }
            ],
          });

          return false;
        },
        async terminar(iCMsg) {
          const usuario = await client.users.fetch(this.selecionado);

          client.relacionamentos.remove(iCmd.user.id, this.selecionado, "amantes"); // remover amante
          client.relacionamentos.remove(this.selecionado, iCmd.user.id, "amantes"); // remover amante

          Embed
            .setColor(client.defs.corEmbed.nao)
            .setTitle("💔 A fila anda...")
            .setDescription(
              `${iCmd.user.toString()} e ${usuario?.toString() || "`Usuário não encontrado`"} `
              + "não são mais amantes"
            )
            .setFooter(null);
          await iCMsg.update({ embeds: [Embed] });

          client.log(
            "info",
            `${iCmd.user.username} divorciou-se de ${usuario?.toString() || this.selecionado}`
          );

          return true;
        },
        async cancelar(iCMsg) {

          Embed
            .setColor(client.defs.corEmbed.normal)
            .setTitle("💕 Essa foi por pouco")
            .setDescription("Você cancelou o termino")
            .setFooter(null);
          await iCMsg.update({ embeds: [Embed] });

          client.log("info", `${iCmd.user.username} cancelou o termino`);

          return true;
        }
      };

      //* Coletor de interações
      const filtro = (i) => i.user.id !== iCmd.user.id;
      coletorICCmd(iCmd, resposta, respostas, filtro);

      return;
    }

    if (proposto.id === client.user.id) return client.responder(iCmd, "bloqueado", "Ewww", "Não.");
    if (proposto.bot) {
      return client.responder(
        iCmd,
        "bloqueado",
        "Você não pode ser amante com um bot",
        "Eles não tem sentimentos, acredita em mim..."
      );
    }

    if (proposto.id === iCmd.user.id) {
      return client.responder(
        iCmd,
        "bloqueado",
        "Você não pode ser amante com você mesmo",
        "Isso seria muito triste..."
      );
    }

    // Define o relacionamento do proposto caso nao tenha
    client.relacionamentos.ensure(`${proposto.id}`, {
      usuario: proposto.username,
      conjugeId: null,
      conjugeNome: null,
      dataCasamento: null,
      amantes: []
    });

    var usuRelacao = client.relacionamentos.get(iCmd.user.id);
    var propostoRelacao = client.relacionamentos.get(proposto.id);

    if (usuRelacao.conjugeId === proposto.id) {
      return client.responder(
        iCmd,
        "bloqueado",
        "Você não pode ser amante com seu proprio cônjuge",
        "Isso não faria sentido nenhum"
      );
    }
    if (usuRelacao.amantes.length > 9) {
      return client.responder(
        iCmd,
        "bloqueado",
        "Você não pode ter mais que 10 amantes",
        `Remova um amante com /${this.nome}`
      );
    }
    if (propostoRelacao.amantes.length > 9) {
      return client.responder(
        iCmd,
        "bloqueado",
        "Essa pessoa atingiu o limite de amantes",
        "Chegou atrasado no role..."
      );
    }
    if (propostoRelacao.amantes.includes(proposto.id)) {
      return client.responder(
        iCmd,
        "bloqueado",
        "Essa pessoa já é sua amante",
        "Se você já esqueceu disso, provavelmente não ta indo muito bem as coisas..."
      );
    }

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
      .setTitle("💕 Amantes!")
      .setDescription(`${iCmd.user.toString()} está pedindo ${proposto.toString()} para ser seu amante`)
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
      async aceitar(i) {
        // Confirmar novamente para não ter erro
        if (usuRelacao.conjugeId === proposto.id) {
          throw new Error("Usuário tentado ser amante com seu proprio cônjuge");
        }
        if (usuRelacao.amantes.length > 9) {
          throw new Error("Usuário já atingiu o limite de amantes");
        }
        if (propostoRelacao.amantes.length > 9) {
          throw new Error("Amante já atingiu o limite de amantes");
        }
        if (propostoRelacao.amantes.includes(proposto.id)) {
          throw new Error("Usuário já é amante com essa pessoa");
        }

        //* Adicionar amante
        client.relacionamentos.push(iCmd.user.id, proposto.id, "amantes");
        client.relacionamentos.push(proposto.id, iCmd.user.id, "amantes");

        if (!usuRelacao.conjugeId) {
          Embed
            .setColor(client.defs.corEmbed.sim)
            .setTitle("🎉 Felicidades aos amantes!")
            .setDescription(`${iCmd.user.toString()} e ${proposto.toString()} agora são amantes`)
            .setFooter(null);
        } else {
          Embed
            .setColor(client.defs.corEmbed.sim)
            .setTitle(`💍 Parece que ${iCmd.user.username} não é tão fiel assim...`)
            .setDescription(`${iCmd.user.toString()} e ${proposto.toString()} agora são amantes`)
            .setFooter(null);
        }

        await i.update({ embeds: [Embed] });

        client.log("info", `${iCmd.user.username} e ${proposto.username} agora são amantes`);

        return true;
      },
      async rejeitar(i) {

        //const uConjuge = client.relacionamentos.get(proposto.id, 'conjuge');

        if (!usuRelacao.conjugeId) {
          Embed
            .setColor(client.defs.corEmbed.nao)
            .setTitle("💔 Isso que da não ser fiel")
            .setDescription(
              `${iCmd.user.toString()} foi rejeitado por ${proposto.toString()} `
              + "para ser seu amante"
            )
            .setFooter(null);
        } else if (!propostoRelacao.conjugeId) {
          Embed
            .setColor(client.defs.corEmbed.nao)
            .setTitle(`💍 Parece que ${proposto.username} é muito fiel a seu casamento`)
            .setDescription(
              `${iCmd.user.toString()} foi rejeitado por ${proposto.toString()} `
              + "para ser seu amante"
            )
            .setFooter(null);
        } else {
          Embed
            .setColor(client.defs.corEmbed.nao)
            .setTitle("💔 Ainda há muito peixe no mar")
            .setDescription(
              `${iCmd.user.toString()} foi rejeitado por ${proposto.toString()} `
              + "para ser seu amante"
            )
            .setFooter(null);
        }

        await i.update({ embeds: [Embed] });

        return true;
      }
    };

    //* Coletor de interações
    const filtro = (i) => i.user.id !== proposto.id;
    coletorICCmd(iCmd, resposta, respostas, filtro);
  }
};
