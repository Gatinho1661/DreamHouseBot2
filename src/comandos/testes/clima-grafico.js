const { MessageEmbed, MessageButton, MessageAttachment } = require("discord.js");
const fetch = require("node-fetch");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas")
const { formatarCanal } = require("../../modulos/utils")

module.exports = {
    //* Infomações do comando
    emoji: "🌤️",
    nome: "clima-grafico",
    sinonimos: ["climag"],
    descricao: "Faça uma competição de quem ta mais proximo do inferno ou do polo sul",
    exemplos: [
        { comando: "clima [lugar]", texto: "Veja o clima da cidade desejada" },
    ],
    args: "[lugar]",
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
    escondido: false,
    suporteBarra: false,
    testando: true,

    //* Comando
    async executar(msg, args) {
        if (!process.env.openweatherAPI) throw new Error("Key do Open Weather não definida");

        const clima = await fetch(
            "http://api.openweathermap.org/data/2.5/weather?"
            + `q=${args.join(" ")}`                     // String para procurar
            + `&lang=pt_br`                             // Linguagem
            + `&units=metric`                           // Unidades
            + `&mode=json`                              // modo
            + `&appid=${process.env.openweatherAPI}`    // Key da api
        ).then(resultado => resultado.json());

        console.debug(clima)

        if (clima.cod !== 200) return client.responder(msg, this, "bloqueado", "Lugar não encontrado", "Especifique um lugar que exista");

        const grafico = new MessageButton()
            .setCustomId(`grafico`)
            .setLabel(`Gráfico`)
            .setDisabled(false)
            .setStyle('SECONDARY');

        let botoes = [[grafico]]

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setAuthor('Previsão do tempo')
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
        const resposta = await msg.channel.send({ content: null, embeds: [Embed], components: botoes, reply: { messageReference: msg } }).catch();

        //* Coletor de interações
        const coletor = resposta.createMessageComponentCollector({ time: 60000 })
        client.log("info", `Coletor de botões iniciado em #${formatarCanal(msg.channel)} por @${msg.author.tag} id:${msg.id}`);

        //* Quando algum botão for apertado
        coletor.on("collect", async i => {
            if (i.user.id !== msg.author.id) {
                client.log("verbose", `@${i.user.tag} apertou "${i.customId}", mas foi bloqueado id:${msg.id}`);

                const cuidaEmbed = new MessageEmbed()
                    .setColor(client.defs.corEmbed.nao)
                    .setTitle(`⛔ Cuida da sua vida`)
                    .setDescription("essa mensagem não foi direcionada a você");
                return i.reply({ content: null, embeds: [cuidaEmbed], ephemeral: true })
            }

            try {
                client.log("verbose", `@${i.user.tag} apertou "${i.customId}" id:${msg.id}`)

                const previsao = await fetch(
                    "https://api.openweathermap.org/data/2.5/onecall?"
                    + `lat=${clima.coord.lat}`                  // Latitude
                    + `&lon=${clima.coord.lon}`                 // Longitude
                    + `&lang=pt_br`                             // Linguagem
                    + `&units=metric`                           // Unidades
                    + `&exclude=minutely,daily`                 //
                    + `&appid=${process.env.openweatherAPI}`    // Key da api
                ).then(resultado => resultado.json());

                console.debug(previsao);

                const temperaturas = []
                const horas = []
                let idx = 0
                let minima = Math.round(clima.main.temp_max)
                let maxima = Math.round(clima.main.temp_min)

                for (const x of previsao.hourly) {
                    if (idx >= 12) break
                    const temperatura = Math.round(x.temp);
                    //const hora = new Date(x.dt * 1000)

                    temperaturas.push(temperatura)
                    horas.push(new Date(x.dt * 1000))

                    if (temperatura < minima) minima = temperatura, console.debug(minima)
                    if (temperatura > maxima) maxima = temperatura, console.debug(maxima)

                    idx++
                }

                const canvas = new ChartJSNodeCanvas({ width: 512, height: 256 })

                const configuracao = {
                    type: "line",
                    data: {
                        labels: horas,
                        datasets: [
                            {
                                data: temperaturas,
                                borderColor: "#ffd11a",
                                backgroundColor: "#FFD11A69",
                                pointRadius: 3
                            },
                        ]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Custom Chart Title'
                        },
                        scales: {
                            yAxes: [{
                                title: {
                                    display: true,
                                    labelString: 'Temperatura'
                                },
                                ticks: {
                                    fontSize: 14,
                                    stepSize: 0,
                                    min: minima - 3,
                                    max: maxima + 3,
                                    callback: (value) => value + 'ºC'
                                },
                            }],
                            xAxes: [{
                                title: {
                                    display: true,
                                    labelString: 'Horas'
                                },
                                ticks: {
                                    fontSize: 14,
                                },
                                type: 'time',
                                time: {
                                    displayFormats: {
                                        hour: 'hh:mm'
                                    }
                                },
                            }]
                        }
                    }
                }

                const grafico = await canvas.renderToBuffer(configuracao)

                const imagem = new MessageAttachment(grafico, "clima.png")

                const Embed = new MessageEmbed()
                    .setColor(client.defs.corEmbed.normal)
                    .setTitle("Clima")
                    .setImage("attachment://clima.png")

                i.reply({
                    content: null,
                    embeds: [Embed],
                    files: [imagem]
                });
            } catch (err) {
                client.log("erro", err.stack)
                client.log("comando", `Ocorreu um erro em ${this.nome} ao ser executado por @${msg.author.tag}`, "erro");

                coletor.stop("erro")
            } finally {
                coletor.stop("respondido");
            }
        })

        //* Quando o coletor termina
        coletor.once('end', (coletado, razao) => {
            client.log("info", `Coletor de botões terminado por ${razao} em #${formatarCanal(msg.channel)}, coletando ${coletado.size} interações id:${msg.id}`);

            if (razao === "erro") {
                const erro = new MessageButton()
                    .setCustomId(`erro`)
                    .setLabel('Ocorreu um erro')
                    .setDisabled(true)
                    .setStyle('DANGER');
                botoes = [[erro]]

                resposta.edit({
                    content: resposta.content || null,
                    embeds: resposta.embeds,
                    components: botoes
                }).catch();
            }
            if (razao === "time") {
                const tempo = new MessageButton()
                    .setCustomId(`tempo`)
                    .setLabel("Tempo esgotado")
                    .setDisabled(true)
                    .setStyle('SECONDARY');
                botoes = [[tempo]];

                resposta.edit({
                    content: resposta.content || null,
                    embeds: resposta.embeds,
                    components: botoes
                }).catch();
            }
        });

    }
}


