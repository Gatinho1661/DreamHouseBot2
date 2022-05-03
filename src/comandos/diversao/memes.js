const { MessageEmbed, MessageButton } = require("discord.js");
const { coletorICCmd } = require("../../utilidades/coletores");

module.exports = {
  //* Infomações do comando
  emoji: "😂",
  nome: "memes",
  sinonimos: [],
  descricao: "Salva seus memes para enviar depois",
  exemplos: [
    { comando: "meme adicionar [nome] [link] [descricao]", texto: "Adiciona seu meme" },
    { comando: "meme editar [nome] [link] [descricao]", texto: "Edita o seu meme" },
    { comando: "meme remover [nome]", texto: "Remove o seu meme" },
    { comando: "meme lista", texto: "Mostra a lista de memes" }
  ],
  args: "",
  opcoes: [
    {
      name: "adicionar",
      description: "Adiciona seu meme",
      type: client.defs.tiposOpcoes.SUB_COMMAND,
      options: [
        {
          name: "nome",
          description: "Nome do seu meme",
          type: client.defs.tiposOpcoes.STRING,
          required: true,
        },
        {
          name: "link",
          description: "Link com uma foto ou video do seu meme",
          type: client.defs.tiposOpcoes.STRING,
          required: true,
        },
        {
          name: "descricao",
          description: "Uma descrição simples do seu meme",
          type: client.defs.tiposOpcoes.STRING,
          required: true,
        },
      ]
    },
    {
      name: "editar",
      description: "Edita o seu meme",
      type: client.defs.tiposOpcoes.SUB_COMMAND,
      options: [
        {
          name: "nome",
          description: "Nome do seu meme",
          type: client.defs.tiposOpcoes.STRING,
          required: true,
        },
        {
          name: "link",
          description: "Link do seu meme",
          type: client.defs.tiposOpcoes.STRING,
          required: true,
        },
        {
          name: "descricao",
          description: "Uma descrição simples do seu meme",
          type: client.defs.tiposOpcoes.STRING,
          required: false,
        },
      ]
    },
    {
      name: "remover",
      description: "Remove o seu meme",
      type: client.defs.tiposOpcoes.SUB_COMMAND,
      options: [
        {
          name: "nome",
          description: "Nome do seu meme",
          type: client.defs.tiposOpcoes.STRING,
          required: true,
        },
      ]
    },
    {
      name: "lista",
      description: "Mostra a lista de memes",
      type: client.defs.tiposOpcoes.SUB_COMMAND,
    }
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

  //* Comando
  async executar(iCmd, opcoes) {
    switch (opcoes.subComando) {
      case "adicionar": {
        if (!/^[a-zA-Zà-úÀ-Ú]{1,15}$/.test(opcoes.adicionar.nome)) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Nome inválido",
            "O nome só pode conter letras com o máximo de 15 caracteres"
          );
        }

        if (!/^[a-zA-Zà-úÀ-Ú ]{1,50}$/.test(opcoes.adicionar.descricao)) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Descrição inválida",
            "O descrição só pode conter letras com o máximo de 50 caracteres"
          );
        }

        //* Pegar meme, caso exista
        const meme = client.memes.get(opcoes.adicionar.nome);
        if (meme) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Esse meme já existe",
            `Já tem um meme com esse nome, se você deseja editar um meme use \`/${this.nome} editar\``
          );
        }

        // eslint-disable-next-line max-len
        const regex = /^https?:\/\/(?:[a-z0-9-]+\.)+[a-z]{2,6}(?:\/[^/#?]+)+(\.|-)(?:jpg|jpeg|png|gif|webm|webp|mp4|wav|mp3|ogg)/;
        if (!regex.test(opcoes.adicionar.link)) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Arquivo ou link inválido",
            "Arquivos validos: `jpg, jpeg, png, gif, webm, webp, mp4, wav, mp3, ogg`"
          );
        }

        //* Salvar meme
        client.memes.set(opcoes.adicionar.nome, {
          usuario: iCmd.user.username,
          usuarioID: iCmd.user.id,
          meme: opcoes.adicionar.link,
          descricao: opcoes.adicionar.descricao
        });

        const Embed = new MessageEmbed()
          .setColor(client.defs.corEmbed.sim)
          .setTitle("😂👌 Meme salvo")
          .setDescription(`Você pode usar esse meme usando \`/meme ${opcoes.adicionar.nome}\``);
        iCmd.reply({ content: null, embeds: [Embed] }).catch();
        break;
      }

      case "editar": {
        // Verificar descrição apenas se foi enviado uma
        if (opcoes.editar.descricao && !/^[a-zA-Zà-úÀ-Ú ]{1,50}$/.test(opcoes.editar.descricao)) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Descrição inválida",
            "O descrição só pode conter letras com o máximo de 50 caracteres"
          );
        }

        //* Pegar meme, caso exista
        const meme = client.memes.get(opcoes.editar.nome);
        if (!meme) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Esse meme não existe",
            "Não tem um meme com esse nome, "
            + `se você deseja adicionar um meme use \`/${this.nome} adicionar\``
          );
        }

        if (meme.usuarioID !== iCmd.user.id && iCmd.user.id !== client.application.owner.id) {
          return client.responder(
            iCmd,
            "permissao",
            "Permissão necessária",
            "Você não tem permissão para editar esse meme, ele não é seu"
          );
        }

        // eslint-disable-next-line max-len
        const regex = /^https?:\/\/(?:[a-z0-9-]+\.)+[a-z]{2,6}(?:\/[^/#?]+)+(\.|-)(?:jpg|jpeg|png|gif|webm|webp|mp4|wav|mp3|ogg)/;
        if (!regex.test(opcoes.editar.link)) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Arquivo ou link inválido",
            "Arquivos validos: `jpg, jpeg, png, gif, webm, webp, mp4, wav, mp3, ogg`"
          );
        }

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
        let botoes = [editar, cancelar];

        const Embed = new MessageEmbed()
          .setColor(client.defs.corEmbed.carregando)
          .setTitle("😂 Editar meme?")
          .setDescription(`Você tem um meme salvo como \`${opcoes.remover.nome}\`, deseja editar ele?`)
          .setFooter({
            text: "Escolha clicando nos botões",
            iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 })
          });
        const resposta = await iCmd.reply({
          content: null,
          embeds: [Embed],
          components: [{ type: "ACTION_ROW", components: botoes }],
          fetchReply: true,
          ephemeral: true
        }).catch();

        //* Respostas para cada botão apertado
        const respostas = {
          async editar(iCMsg) {
            //* Editar meme
            client.memes.set(opcoes.editar.nome, {
              usuario: iCmd.user.username,
              usuarioID: iCmd.user.id,
              meme: opcoes.editar.link,
              descricao: opcoes.editar.descricao || meme.descricao
            });

            Embed
              .setColor(client.defs.corEmbed.normal)
              .setTitle("😂 Meme editado")
              .setFooter(null);
            await iCMsg.update({ embeds: [Embed] });

            return true;
          },
          async cancelar(iCMsg) {
            client.log("info", "Cancelado");

            Embed
              .setColor(client.defs.corEmbed.nao)
              .setFooter(null);
            await iCMsg.update({ embeds: [Embed] });

            return true;
          }
        };

        //* Coletor de interações
        const filtro = (i) => i.user.id !== iCmd.user.id;
        coletorICCmd(iCmd, resposta, respostas, filtro);

        break;
      }

      case "remover": {
        //* Pegar meme, caso exista
        const meme = client.memes.get(opcoes.remover.nome);
        if (!meme) {
          return client.responder(
            iCmd,
            "bloqueado",
            "Esse meme não existe",
            "Não tem um meme com esse nome, "
            + `se você deseja adicionar um meme use \`/${this.nome} adicionar\``
          );
        }

        if (meme.usuarioID !== iCmd.user.id && iCmd.user.id !== client.application.owner.id) {
          return client.responder(
            iCmd,
            "permissao",
            "Permissão necessária",
            "Você não tem permissão para editar esse meme, ele não é seu"
          );
        }

        const remover = new MessageButton()
          .setCustomId("remover")
          .setLabel("Remover")
          .setDisabled(false)
          .setStyle("DANGER");
        const cancelar = new MessageButton()
          .setCustomId("cancelar")
          .setLabel("Cancelar")
          .setDisabled(false)
          .setStyle("PRIMARY");
        let botoes = [remover, cancelar];

        const Embed = new MessageEmbed()
          .setColor(client.defs.corEmbed.carregando)
          .setTitle("😂 Remover meme?")
          .setDescription(`Você tem um meme salvo como \`${opcoes.remover.nome}\`, deseja remover ele?`)
          .setFooter({
            text: "Escolha clicando nos botões",
            iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 })
          });
        const resposta = await iCmd.reply({
          content: null,
          embeds: [Embed],
          components: [{ type: "ACTION_ROW", components: botoes }],
          fetchReply: true,
          ephemeral: true
        }).catch();

        //* Respostas para cada botão apertado
        const respostas = {
          async remover(iCMsg) {
            //* Remover meme
            client.memes.delete(opcoes.remover.nome);

            Embed
              .setColor(client.defs.corEmbed.nao)
              .setTitle("😂 Meme removido")
              .setFooter(null);
            await iCMsg.update({ embeds: [Embed] });

            return true;
          },
          async cancelar(iCMsg) {
            client.log("info", "Cancelado");

            Embed
              .setColor(client.defs.corEmbed.normal)
              .setFooter(null);
            await iCMsg.update({ embeds: [Embed] });

            return true;
          }
        };

        //* Coletor de interações
        const filtro = (i) => i.user.id !== iCmd.user.id;
        coletorICCmd(iCmd, resposta, respostas, filtro);

        break;
      }

      case "lista": {
        //* Lista de memes
        const memesArray = [];
        for (const memeNome of client.memes.indexes) {
          const meme = client.memes.get(memeNome);
          memesArray.push({ nome: memeNome, descricao: meme.descricao });
        }

        //* Separar memes em grupos de 10
        const gruposDe = 10; // Define qual é o tamanho do grupo
        const memes = [];
        for (let i = 0, tamanho = memesArray.length; i < tamanho; i += gruposDe) {
          memes.push(memesArray.slice(i, i + gruposDe));
        }

        //* Criar paginas com a lista de memes
        let embedsArray = [];
        for (const memesLista of memes) {
          const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle("😂 Lista de memes");
          for (const meme of memesLista) {
            Embed.addField(
              `• ${meme.nome}`,
              `${meme.descricao}`
            );
          }
          embedsArray.push(Embed);
        }

        var paginaAtual = 0;
        const paginaTotal = embedsArray.length - 1;

        const voltar = new MessageButton()
          .setCustomId("voltar")
          .setLabel("<<")
          .setDisabled(true)
          .setStyle("SECONDARY");
        const menu = new MessageButton()
          .setCustomId("menu")
          .setLabel("O")
          .setDisabled(true)
          .setStyle("PRIMARY");
        const progredir = new MessageButton()
          .setCustomId("progredir")
          .setLabel(">>")
          .setDisabled(false)
          .setStyle("SECONDARY");
        let botoes = [voltar, menu, progredir];

        const resposta = await iCmd.reply({
          content: null,
          embeds: [embedsArray[0].setFooter({
            text: `Veja outras páginas, clicando nos botões • Página ${paginaAtual}/${paginaTotal}`,
            iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 })
          })],
          components: [{ type: "ACTION_ROW", components: botoes }],
          fetchReply: true,
          ephemeral: true
        }).catch();

        const respostas = {
          async voltar(iBto) {
            if (paginaAtual <= 0) {
              return client.log(
                "aviso",
                `Comando "${module.exports.nome}" com paginas dessincronizadas (${resposta.id})`
              );
            }

            --paginaAtual;

            botoes = [
              voltar.setDisabled(paginaAtual <= 0),
              menu.setDisabled(paginaAtual <= 0),
              progredir.setDisabled(paginaTotal <= paginaAtual)
            ];
            await iBto.update({
              embeds: [embedsArray[paginaAtual].setFooter({
                text: `Veja outras páginas, clicando nos botões • Página ${paginaAtual}/${paginaTotal}`,
                iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 })
              })],
              components: [{ type: "ACTION_ROW", components: botoes }]
            }).catch();

            return false;
          },
          async menu(iBto) {
            if (paginaAtual === 0) {
              return client.log(
                "aviso",
                `Comando "${module.exports.nome}" com paginas dessincronizadas (${resposta.id})`
              );
            }

            paginaAtual = 0;

            botoes = [
              voltar.setDisabled(paginaAtual <= 0),
              menu.setDisabled(paginaAtual <= 0),
              progredir.setDisabled(paginaTotal <= paginaAtual)
            ];
            await iBto.update({
              embeds: [embedsArray[paginaAtual].setFooter({
                text: `Veja outras páginas, clicando nos botões • Página ${paginaAtual}/${paginaTotal}`,
                iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 })
              })],
              components: [{ type: "ACTION_ROW", components: botoes }]
            }).catch();

            return false;
          },
          async progredir(iBto) {
            if (paginaTotal <= paginaAtual) {
              return client.log(
                "aviso",
                `Comando "${module.exports.nome}" com paginas dessincronizadas (${resposta.id})`
              );
            }

            ++paginaAtual;

            botoes = [
              voltar.setDisabled(paginaAtual <= 0),
              menu.setDisabled(paginaAtual <= 0),
              progredir.setDisabled(paginaTotal <= paginaAtual)
            ];
            await iBto.update({
              embeds: [embedsArray[paginaAtual].setFooter({
                text: `Veja outras páginas, clicando nos botões • Página ${paginaAtual}/${paginaTotal}`,
                iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 })
              })],
              components: [{ type: "ACTION_ROW", components: botoes }]
            }).catch();

            return false;
          }
        };

        //* Coletor de interações
        const filtro = (i) => i.user.id !== iCmd.user.id;
        coletorICCmd(iCmd, resposta, respostas, filtro);

        break;
      }

      default: throw new Error("Sub comando não encontrado");
    }

  }
};