const { Constants } = require("discord.js");
const fs = require("fs");

module.exports.carregar = () => {
    const listaComandos = [];
    for (const pasta of fs.readdirSync(client.dir + `/comandos/`)) {

        for (const arquivo of fs.readdirSync(client.dir + `/comandos/${pasta}`)) {
            if (!arquivo.endsWith(".js")) continue

            try {
                const comando = require(client.dir + `/comandos/${pasta}/${arquivo}`);

                //* Verificar se já existe um comando com esse nome
                if (client.comandos.some(cmd => cmd.sinonimos.includes(comando.nome))) {
                    throw new Error(`O nome "${comando.nome}" já está registrado como um sinônimo de um comando`);
                }
                if (client.comandos.some(cmd => cmd.nome === comando.nome)) {
                    throw new Error(`Um comando com o nome "${comando.nome}" já está registrado`);
                }

                //* Verificar se já existe algum sinônimo
                for (const sinonimo of comando.sinonimos) {
                    if (client.comandos.some(cmd => cmd.sinonimos.includes(sinonimo))) {
                        throw new Error(`Um comando com o sinônimo "${sinonimo}" já está registrado`);
                    }
                    if (client.comandos.some(cmd => cmd.nome === sinonimo)) {
                        throw new Error(`O sinônimo "${sinonimo}" já está registrado como o nome de um comando`);
                    }
                }

                //* Verificar se o comando é suportado
                if (!comando.suporteBarra) {
                    client.log("aviso", `Nível de suporte não definido em ${comando.nome}`);
                }

                //* Definir a categoria do comando
                if (client.defs.categorias[pasta]) {
                    comando.categoria = pasta
                    comando.escondido = comando.categoria.escondido
                } else throw new Error(`Categoria não definida em ${comando.nome}`);

                client.comandos.set(comando.nome, comando);
                listaComandos.push(comando); // serve so para dar log
                client.log("verbose", `Comando foi registrado: ${comando.nome} `);
            } catch (err) {
                client.log("critico", `${err.message}, o comando "${pasta}/${arquivo}" será ignorado`);
            }
        }
    }
    client.log("bot", `Comandos:`, null, true);
    console.table(listaComandos, ["categoria", "nome", "sinonimos"]);
}

module.exports.registrar = async () => {
    let comandos = [];
    let comandosTeste = [];

    client.comandos.each(comando => {
        if (comando.suporteBarra === true || comando.suporteBarra === "ambos") {
            if (comando.categoria === "testes" || comando.testando === true) {
                comandosTeste.push({
                    name: comando.nome,
                    description: `【Teste】${comando.descricao}`,
                    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
                    options: comando.opcoes
                })
            } else {
                comandos.push({
                    name: comando.nome,
                    description: `【${comando.emoji}】${comando.descricao}`,
                    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
                    options: comando.opcoes
                })
            }
        }
    })

    //TODO Remover consoles
    //* Definir comandos globalmente
    //await client.application?.commands.set(comandos);
    //console.debug(await client.application?.commands.fetch());

    // Definir comandos de teste
    if (process.env.SERVER_DE_TESTES) {
        await client.application?.commands.set(comandosTeste, process.env.SERVER_DE_TESTES);
        console.debug(await client.application?.commands.fetch({ guildId: process.env.SERVER_DE_TESTES }));
    }
}