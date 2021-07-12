const fs = require("fs");

module.exports = () => {
    for (const pasta of fs.readdirSync(client.dir + `/comandos/`)) {
        //? adicionar grupos

        for (const arquivo of fs.readdirSync(client.dir + `/comandos/${pasta}`)) {
            if (!arquivo.endsWith(".js")) continue
            client.log("verbose", `Carregando comando ${pasta}/${arquivo}`);

            try {
                const comando = require(client.dir + `/comandos/${pasta}/${arquivo}`);

                if (client.comandos.some(cmd => cmd.nome === comando.nome)) {
                    throw new Error(`Um comando com o nome "${comando.nome}" já está registrado`);
                }
                for (const sinonimos of comando.sinonimos) {
                    if (client.comandos.some(cmd => cmd.nome === sinonimos || cmd.sinonimos.includes(sinonimos))) {
                        throw new Error(`Um comando com o sinonimo "${sinonimos}" já está registrado`)
                    }
                }

                comando.grupo = pasta;
                client.comandos.set(comando.nome, comando);
                //client.log("bot", `Comando "${comando.nome}" carregado`);
            } catch (err) {
                client.log("critico", `${err.message}, o comando "${pasta}/${arquivo}" será ignorado`);
            }
        }
    }
    client.log("bot", `Comandos:`, null, true);
    console.table(client.comandos.array(), ["grupo", "nome", "sinonimos"]);
}