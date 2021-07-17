const { MessageEmbed } = require("discord.js");
const fs = require("fs");

module.exports = {
    //* Infomações do comando
    emoji: "",
    nome: "recarregar",
    sinonimos: ["r", "reload"],
    descricao: "Recarrega comandos",
    exemplos: [],
    args: "",
    canalVoz: false,
    contaPrimaria: false,
    apenasServidor: false,
    apenasDono: true,
    nsfw: false,
    permissoes: {
        usuario: [],
        bot: ["SEND_MESSAGES"]
    },
    cooldown: 1,
    escondido: true,

    //* Comando
    async executar(msg, args) {

        if (!args[0]) {
            const semArgs = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle(`⛔ Faltando argumentos`)
                .setDescription(`Qual comando você quer recarregar ?`);
            await msg.channel.send({ content: null, embeds: [semArgs], reply: { messageReference: msg } }).catch();
            return;
        }

        const comando = client.comandos.get(args[0].toLowerCase())
            || client.comandos.find(cmd => cmd.sinonimos.includes(args[0].toLowerCase()));

        if (comando) {
            const pasta = fs.readdirSync(client.dir + "/comandos")
                .find(pasta => fs.readdirSync(client.dir + `/comandos/${pasta}`).includes(`${comando.nome}.js`));

            delete require.cache[require.resolve(client.dir + `/comandos/${pasta}/${comando.nome}.js`)];

            const comandoNovo = require(client.dir + `/comandos/${pasta}/${comando.nome}.js`);

            //* Definir a categoria do comando
            if (client.defs.categorias[pasta]) {
                comandoNovo.categoria = pasta
                comandoNovo.escondido = comandoNovo.categoria.escondido
            } else throw new Error(`Comando sem categoria`);

            client.comandos.set(comando.nome, comandoNovo);

            const embedCmd = new MessageEmbed()
                .setColor(client.defs.corEmbed.sim)
                .setTitle(`✅ Comando recarregado`)
                .setDescription(`\`${comando.nome}\` foi recarregado`);
            await msg.channel.send({ content: null, embeds: [embedCmd], reply: { messageReference: msg } }).catch();

        } else {
            const falhaEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle('❌ Comando não encontrado')
                .setDescription(`${args[0]} não foi encontrado`)
            await msg.channel.send({ content: null, embeds: [falhaEmbed], reply: { messageReference: msg } }).catch();
        }

        //? Poder recerregar todos os comandos
        //? Poder recarregar um grupo inteiro
    }
};