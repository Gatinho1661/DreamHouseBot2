const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    //* Infomações do comando
    emoji: "🌤️",
    nome: "clima",
    sinonimos: [],
    descricao: "Faça uma competição de quem ta mais proximo do inferno ou do polo sul",
    exemplos: [
        { comando: "clima [lugar]", texto: "Veja o clima da cidade desejada" },
    ],
    args: "{lugar}",
    opcoes: [
        {
            name: "lugar",
            description: "Nome de uma cidade",
            type: client.defs.tiposOpcoes.STRING,
            required: true,
        },
        {
            name: "pais",
            description: "Código do país (ex:BR,US,JP)",
            type: client.defs.tiposOpcoes.STRING,
            required: false,
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
    suporteBarra: "ambos",

    //* Comando
    async executar(iCmd, opcoes) {
        if (!process.env.openweatherAPI) throw new Error("Key do Open Weather não definida");

        client.log("info", `Procurando clima de "${opcoes.lugar}, ${opcoes.pais}"`)

        const pingApi = new Date()
        const clima = await fetch(
            "http://api.openweathermap.org/data/2.5/weather?"
            + `q=${encodeURI(opcoes.lugar)},`           // Cidade para procurar
            + `${encodeURI(opcoes.pais)}`               // Pais para procurar
            + `&lang=pt`                                // Linguagem (pt_br não traduz os nomes das cidades)
            + `&units=metric`                           // Unidades
            + `&mode=json`                              // modo
            + `&appid=${process.env.openweatherAPI}`    // Key da api
        ).then(resultado => resultado.json());

        client.log("api", `Open Weather Map: ${new Date().getTime() - pingApi.getTime()}ms, ${clima.cod}, ${clima.message}`)

        if (clima.cod === '404') return client.responder(iCmd, "bloqueado", "Lugar não encontrado", "Especifique um lugar que exista");
        if (clima.cod !== 200) return client.responder(iCmd, "erro", "Erro", "Ocorreu um erro na api", "tente novamente mais tarde");

        client.log("info", `Clima de "${clima.name}, ${clima.sys.country}" recebido`)

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setAuthor({ name: 'Previsão do tempo' })
            .setTitle(`${clima.name}, ${clima.sys.country}`)
            .setDescription(
                `${clima.weather[0].description}\n`
                + `🌡️ **Atual:** ${clima.main.temp}ºC\n`
                + `💨 **Sensação:** ${clima.main.feels_like}ºC\n`
                + `🔥 **Máxima:** ${clima.main.temp_max}ºC\n`
                + `❄️ **Mínima:** ${clima.main.temp_min}ºC\n\n`

                + `💦 **Umidade:** ${clima.main.humidity}%\n`
                + `🗜️ **Pressão:** ${clima.main.pressure} hPa\n`
                + `☁️ **Nuvens:** ${clima.clouds.all}%\n`
                + `🌬️ **Vento:** ${clima.wind.speed} m/s`
            )
            .setThumbnail(client.defs.imagens.clima[clima.weather[0].icon] || client.defs.imagens.emojis.interrogacao)
            .setTimestamp(clima.dt * 1000);
        await iCmd.reply({ content: null, embeds: [Embed] }).catch();
    },

    //* Comando como mensagem
    async executarMsg(msg, args) {
        if (!process.env.openweatherAPI) throw new Error("Key do Open Weather não definida");
        if (!args[0]) return client.responder(msg, this, "uso", "Faltando argumentos", "Digite uma cidade ou país que exista para que eu lhe de o clima");

        client.log("info", `Procurando clima de "${args.join(" ")}"`)

        const pingApi = new Date()
        const clima = await fetch(
            "http://api.openweathermap.org/data/2.5/weather?"
            + `q=${encodeURI(args.join(" "))}`          // String para procurar
            + `&lang=pt`                                // Linguagem (pt_br não traduz os nomes das cidades)
            + `&units=metric`                           // Unidades
            + `&mode=json`                              // modo
            + `&appid=${process.env.openweatherAPI}`    // Key da api
        ).then(resultado => resultado.json());

        client.log("api", `Open Weather Map: ${new Date().getTime() - pingApi.getTime()}ms, ${clima.cod}, ${clima.message}`)

        if (clima.cod === '404') return client.responder(msg, this, "bloqueado", "Lugar não encontrado", "Especifique um lugar que exista");
        if (clima.cod !== 200) return client.responder(msg, this, "erro", "Erro", "Ocorreu um erro na api, tente novamente mais tarde");

        client.log("info", `Clima de "${clima.name}, ${clima.sys.country}" recebido`)

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setAuthor({ name: 'Previsão do tempo' })
            .setTitle(`${clima.name}, ${clima.sys.country}`)
            .setDescription(
                `${clima.weather[0].description}\n`
                + `🌡️ **Atual:** ${clima.main.temp}ºC\n`
                + `💨 **Sensação:** ${clima.main.feels_like}ºC\n`
                + `🔥 **Máxima:** ${clima.main.temp_max}ºC\n`
                + `❄️ **Mínima:** ${clima.main.temp_min}ºC\n\n`

                + `💦 **Umidade:** ${clima.main.humidity}%\n`
                + `🗜️ **Pressão:** ${clima.main.pressure} hPa\n`
                + `☁️ **Nuvens:** ${clima.clouds.all}%\n`
                + `🌬️ **Vento:** ${clima.wind.speed} m/s`
            )
            .setThumbnail(client.defs.imagens.clima[clima.weather[0].icon] || client.defs.imagens.emojis.interrogacao)
            .setTimestamp(clima.dt * 1000);
        await msg.channel.send({ content: "> Teste esse comando usando /", embeds: [Embed], reply: { messageReference: msg } }).catch();
    }
}


