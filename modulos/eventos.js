const fs = require("fs");

module.exports = () => {
    for (const arquivo of fs.readdirSync(client.dir + `/eventos/`)) {
        if (!arquivo.endsWith(".js")) continue

        try {
            //  client.log("verbose", `Carregando evento ${arquivo}...`)
            const evento = require(client.dir + `/eventos/${arquivo}`);

            if (evento.once) {
                client.once(evento.nome, (...args) => evento.executar(...args));
            } else {
                client.on(evento.nome, (...args) => evento.executar(...args));
            }

            client.log("verbose", `Evento foi carregado: ${evento.nome}`)
        } catch (err) {
            client.log("critico", err.stack)
        }
    }

    //* Eventos de música
    //TODO Remover os debugs e fazer algo descente com isso
    client.player.on("trackStart", (filaMusicas, musica) => {
        console.debug(`Música iniciada: ${musica.title} em: ${filaMusicas.guild.me.voice.channel.name}`)

        console.debug(filaMusicas.current)
    });

    client.player.on("trackAdd", (filaMusicas, musica) => {
        console.debug(`Música adicionada: ${musica.title} em: ${filaMusicas.guild.me.voice.channel.name}`)
    });

    client.player.on("tracksAdd", (filaMusicas, musica) => {
        console.debug(`${musica.length} músicas foram adicionadas em: ${filaMusicas.guild.me.voice.channel.name}`)
    });

    client.player.on("trackEnd", (filaMusicas, musica) => {
        console.debug(`Música finalizada: ${musica.title} em: ${filaMusicas.guild.me.voice.channel.name}`)
    });

    client.player.on("queueEnd", (filaMusicas) => {
        console.debug(`Fila de música finalizada em: ${filaMusicas.guild.me.voice.channel.name}`)
    });

    client.player.on("botDisconnect", (filaMusicas) => {
        console.debug(`Bot desconectado de: ${filaMusicas.guild.me.voice.channel.name}`)
    });

    client.player.on("channelEmpty", (filaMusicas) => {
        console.debug(`Canal vazio em: ${filaMusicas.guild.me.voice.channel.name}`)
    });

    client.player.on("connectionCreate", (filaMusicas) => {
        console.debug(`Bot conectado em: ${filaMusicas.guild.me.voice.channel.name}`)
    });

    client.player.on("connectionError", (filaMusicas, erro) => {
        console.debug(`Erro de conexão em: ${filaMusicas.guild.me.voice.channel.name}`)
        console.error(erro.stack);
    });
}