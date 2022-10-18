const { MessageButton, MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");
const { coletorICCmd } = require("../../utilidades/coletores");

module.exports = {
  //* Infomações do comando
  emoji: "💕",
  nome: "amante",
  sinonimos: [],
  descricao: "Tenha uma ou mais amantes para apimentar seu relacionamento",
  exemplos: [
    { comando: "amante namorar [usuario]", texto: "Pedir para a pessoa mencionada ser seu amante" },
    { comando: "amante terminar [usuario]", texto: "Terminar com um amante mencionado" },
  ],
  args: "{usuario}",
  opcoes: [
    {
      name: "namorar",
      description: "Pedir para a pessoa mencionada ser seu amante",
      type: client.defs.tiposOpcoes.SUB_COMMAND,
      options: [
        {
          name: "usuario",
          description: "Pessoa para ser seu amante",
          type: client.defs.tiposOpcoes.USER,
          required: true
        },
      ]
    },
    {
      name: "terminar",
      description: "Terminar com um amante mencionado",
      type: client.defs.tiposOpcoes.SUB_COMMAND,
      options: [
        {
          name: "usuario",
          description: "Pessoa para terminar",
          type: client.defs.tiposOpcoes.USER,
          required: true
        },
      ]
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
    switch (opcoes.subComando) {
      case "namorar": {
        const proposto = opcoes.namorar.usuario.usuario;

        if (proposto.id === client.user.id) return client.responder(iCmd, "bloqueado", "Ewww", "Não.");
        if (proposto.bot) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Você não pode ser amante com um bot",
            "Eles não tem sentimentos... acredita em mim..."
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

        const Usuario = mongoose.model("Usuario");

        //* Pegar dados do usuário
        const usuarioPerfil = await Usuario.findOne({ "contas": iCmd.user.id })
          .populate("relacao.conjuge", "contas")
          .populate("relacao.amantes", "contas");
        const usuarioConjugePerfil = usuarioPerfil.relacao.conjuge;

        //* Pegar dados do proposto
        const propostoPerfil = await Usuario.findOne({ "contas": proposto.id })
          .populate("relacao.conjuge", "contas")
          .populate("relacao.amantes", "contas");
        const propostoConjugePerfil = usuarioPerfil.relacao.conjuge;

        //* TODO Define os dados do usuário caso nao tenha
        if (!usuarioPerfil) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Você não tem um perfil",
            "você não criou seu perfil ainda"
          );
        }

        //* TODO Define os dados do propostocaso nao tenha
        if (!propostoPerfil) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Proposto não tem um perfil",
            "o proposto não criou seu perfil ainda"
          );
        }

        if (usuarioConjugePerfil.contaPrincipal === proposto.id) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Você não pode ser amante com seu próprio cônjuge",
            "Isso não faria sentido nenhum"
          );
        }
        if (usuarioPerfil.relacao.amantes.length > 9) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Você não pode ter mais que 10 amantes",
            `Remova um amante com \`/${this.nome} terminar\``
          );
        }
        if (propostoPerfil.relacao.amantes.length > 9) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Essa pessoa atingiu o limite de amantes",
            "Chegou atrasado no role..."
          );
        }
        if (usuarioPerfil.relacao.amantes.find(amante => amante.id === propostoPerfil.id)) {
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
          .setDescription(
            `${iCmd.user.toString()} está pedindo ${proposto.toString()} para ser seu amante`
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
          async aceitar(i) {
            //* Adicionar amante
            usuarioPerfil.relacao.amantes.push(propostoPerfil.id);
            propostoPerfil.relacao.amantes.push(usuarioPerfil.id);

            await Usuario.bulkSave([usuarioPerfil, propostoPerfil]);

            client.log("info", `${iCmd.user.username} e ${proposto.username} agora são amantes`);

            if (!usuarioConjugePerfil) {
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

            return true;
          },
          async rejeitar(i) {

            if (!usuarioConjugePerfil) {
              Embed
                .setColor(client.defs.corEmbed.nao)
                .setTitle("💔 Isso que da não ser fiel")
                .setDescription(
                  `${iCmd.user.toString()} foi rejeitado por ${proposto.toString()} `
                  + "para ser seu amante"
                )
                .setFooter(null);
            } else if (!propostoConjugePerfil) {
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

        break;
      }

      case "terminar": {
        const amante = opcoes.terminar.usuario.usuario;

        if (amante.id === client.user.id) return client.responder(
          iCmd,
          "bloqueado",
          "Ewww",
          "A gente não está nem namorando, não me faz imaginar sobre esse pesadelo"
        );

        if (amante.bot) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Huh?",
            "Desde quando você está namorando com um bot?\n"
            + "Isso é impossível, eles não tem sentimentos... acredita em mim..."
          );
        }

        if (amante.id === iCmd.user.id) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Você não pode terminar com você mesmo",
            "Se você estiver tendo um problema de autoestima é so me falar, posso ser sua terapeuta"
          );
        }

        const Usuario = mongoose.model("Usuario");

        //* Pegar dados do usuário
        const usuarioPerfil = await Usuario.findOne({ "contas": iCmd.user.id })
          .populate("relacao.conjuge", "contas")
          .populate("relacao.amantes", "contas");

        //* Pegar dados do proposto
        const amantePerfil = await Usuario.findOne({ "contas": amante.id })
          .populate("relacao.conjuge", "contas")
          .populate("relacao.amantes", "contas");

        //* TODO Define os dados do usuário caso nao tenha
        if (!usuarioPerfil) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Você não tem um perfil",
            "você não criou seu perfil ainda"
          );
        }

        //* TODO Define os dados do propostocaso nao tenha
        if (!amantePerfil) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Proposto não tem um perfil",
            "o proposto não criou seu perfil ainda"
          );
        }

        if (!usuarioPerfil.relacao.amantes.find(amante => amante.id === amantePerfil.id)) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Essa pessoa não é sua amante",
            "Se você já esqueceu disso, provavelmente não ta indo muito bem as coisas..."
          );
        }

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

        //* Terminar?
        const Embed = new MessageEmbed()
          .setColor(client.defs.corEmbed.carregando)
          .setTitle("💔 Termino!")
          .setDescription(
            `Tem certeza que quer terminar com ${amante.toString()}?`
          )
          .setFooter({
            text: "Escolha clicando nos botões",
            iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 })
          });
        const resposta = await iCmd.reply({
          content: null,
          embeds: [Embed],
          components: [{ type: "ACTION_ROW", components: botoes }],
          fetchReply: true
        }).catch();

        //* Respostas para cada botão apertado
        const respostas = {
          async terminar(iBtn) {
            //* Terminar

            usuarioPerfil.relacao.amantes.find((amante, idx) => {
              if (amante.id === amantePerfil.id) {
                usuarioPerfil.relacao.amantes.splice(idx, 1);
                return true;
              }
              return false;
            });

            amantePerfil.relacao.amantes.find((amante, idx) => {
              if (amante.id === usuarioPerfil.id) {
                amantePerfil.relacao.amantes.splice(idx, 1);
                return true;
              }
              return false;
            });

            await Usuario.bulkSave([usuarioPerfil, amantePerfil]);

            client.log("info", `${iCmd.user.username} e ${amante.username} terminaram`);

            Embed
              .setColor(client.defs.corEmbed.nao)
              .setTitle("💔 A fila anda...")
              .setDescription(
                `${iCmd.user.toString()} e ${amante.toString()} terminaram`
              )
              .setFooter(null);
            await iBtn.update({ embeds: [Embed] });

            return true;
          },

          async cancelar(iBtn) {

            client.log("info", `${iCmd.user.username} cancelou o termino com ${amante.username}`);

            Embed
              .setColor(client.defs.corEmbed.normal)
              .setTitle("💕 Essa foi por pouco")
              .setDescription(
                `${iCmd.user.toString()} cancelou o termino com ${amante.toString()}`
              )
              .setFooter(null);
            await iBtn.update({ embeds: [Embed] });

            return true;
          }
        };

        //* Coletor de interações
        const filtro = (iBtn) => iBtn.user.id !== iCmd.user.id;
        coletorICCmd(iCmd, resposta, respostas, filtro);

        break;
      }

      default: throw new Error("Sub comando não encontrado");
    }
  }
};
