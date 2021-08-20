const fs = require("fs");

module.exports = () => {
    const listaComandos = [];
    for (const pasta of fs.readdirSync(client.dir + `/comandos/`)) {
        //? adicionar categoria

        for (const arquivo of fs.readdirSync(client.dir + `/comandos/${pasta}`)) {
            if (!arquivo.endsWith(".js")) continue
            client.log("verbose", `Carregando comando ${pasta}/${arquivo}`);

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

                //* Definir a categoria do comando
                if (client.defs.categorias[pasta]) {
                    comando.categoria = pasta
                    comando.escondido = comando.categoria.escondido
                } else throw new Error(`Comando sem categoria`);

                client.comandos.set(comando.nome, comando);
                listaComandos.push(comando);
                client.log("verbose", `${comando.nome} foi registrado`);
            } catch (err) {
                client.log("critico", `${err.message}, o comando "${pasta}/${arquivo}" será ignorado`);
            }
        }
    }
    client.log("bot", `Comandos:`, null, true);
    console.log(listaComandos)
    console.table(listaComandos, ["categoria", "nome", "sinonimos"]);
}