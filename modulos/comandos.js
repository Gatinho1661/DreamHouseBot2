const fs = require("fs");

module.exports = () => {
    for (const pasta of fs.readdirSync(client.dir + `/comandos/`)) {
        client.log("verbose", `Carregando comandos de ${pasta}`);
        //? adicionar grupos

        for (const arquivo of fs.readdirSync(client.dir + `/comandos/${pasta}`)) {
            if (!arquivo.endsWith(".js")) continue
            client.log("verbose", `Carregando comandos ${arquivo}...`);

            const comando = require(client.dir + `/comandos/${pasta}/${arquivo}`);
            client.comandos.set(comando.nome, comando);
            client.log("verbose", `Comando carregado ${arquivo}`);
        }
    }
}