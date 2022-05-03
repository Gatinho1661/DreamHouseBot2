const { MessageEmbed } = require("discord.js");
const Duration = require("duration");
const { proximoAniversario } = require("../../modulos/utils");

module.exports = {
  //* Infomações do comando
  emoji: "👤",
  nome: "perfil",
  sinonimos: [],
  descricao: "Veja as informações de perfil",
  exemplos: [
    { comando: "perfil", texto: "Veja seu perfil" },
    { comando: "perfil [usuario]", texto: "Veja o perfil de outra pessoa" }
  ],
  args: "",
  opcoes: [
    {
      name: "usuario",
      description: "O usuário que você quer ver o perfil",
      type: client.defs.tiposOpcoes.USER,
      required: false,
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
  escondido: false,
  suporteBarra: true,
  testando: false,

  async executar(iCmd, opcoes) {
    const usuario = opcoes.usuario?.membro || iCmd.member;

    if (usuario.bot) {
      return client.responder(iCmd, "bloqueado", "Bots não tem perfis", "Porque eles teriam um?");
    }

    // define os dados do usuario da pessoa caso nao tenha
    client.usuarios.ensure(usuario.user.id, {
      nome: usuario.user.username,
      aniversario: null,
      idade: null,
      orientacao: null,
      pronome: null
    });

    const perfil = client.usuarios.get(usuario.user.id);
    const relacionamento = client.relacionamentos.get(usuario.user.id);

    const numeros = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    let amantesLista = [];

    for (let i = 0; i < relacionamento.amantes.length; i++) {
      const amante = relacionamento.amantes[i];
      const usuario = await client.users.fetch(amante);
      amantesLista.push(`${numeros[i]} - ${usuario?.username || "Usuário não encontrado"}`);
    }

    const nascimento = new Date(perfil.aniversario);
    const nasceu = perfil.aniversario ? nascimento.toLocaleDateString() : "??/??/????";
    const idade = perfil.idade ? `${new Duration(nascimento).years} anos` : "?? anos";
    const aniversario = perfil.aniversario
      ? `<t:${proximoAniversario(nascimento).getTime() / 1000}:R>`
      : "???";

    const orientacao = perfil.orientacao || "Não especificado";
    const pronomes = { "ele": "Ele/Dele", "ela": "Ela/Dela", "elu": "Elu/Delu" };
    const pronome = pronomes[perfil.pronome] || "Não especificado";


    //TODO utilitario q coisa os timestamps do discord
    const conjuge = relacionamento.conjugeId
      ? `(\`<@${relacionamento.conjugeId}>\`) \
        <t:${Math.round(new Date(relacionamento.dataCasamento).getTime() / 1000)}:R>`
      : "Ninguém";
    const amantes = amantesLista.length > 0 ? amantesLista.join("\n") : "Nenhum amante";

    const Embed = new MessageEmbed()
      .setColor(usuario.displayColor ? usuario.displayHexColor : client.defs.corEmbed.normal)
      .setAuthor({
        name: `Perfil de ${usuario.user.username}`,
        iconURL: usuario.user.displayAvatarURL({ dynamic: true, size: 32 })
      })
      .addFields(
        { name: "🍼 Nasceu", value: nasceu, inline: true },
        { name: "🎂 Idade", value: idade, inline: true },
        { name: "🎉 Aniversário", value: aniversario, inline: true },
        { name: "🏳️‍🌈 Orientação sexual", value: orientacao, inline: true },
        { name: "⚧ Pronome", value: pronome, inline: true },
        { name: "💍 Casou-se com", value: conjuge },
        { name: "💕 Amantes", value: amantes }
      )
      .setThumbnail(usuario.user.displayAvatarURL({ dynamic: true, size: 1024 }));
    await iCmd.reply({ content: null, embeds: [Embed] }).catch();
  },

  //* Comandos de menu contextual
  nomeCtx: "Perfil",
  tipoCtx: client.defs.tiposComando.USER,
  async executarCtx(iCtx) {
    const opcoes = {
      usuario: {
        membro: iCtx.targetMember
      }
    };
    await this.executar(iCtx, opcoes);
  }
};