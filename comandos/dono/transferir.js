//const { MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "",
    nome: "transferir",
    sinonimos: [],
    descricao: "Tranferir banco de dados para nova versão",
    exemplos: ["!transferir"],
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
    async executar(msg) {

        const indexes = client.usuarioOld.indexes

        for (let i = 0; i < indexes.length; i++) {
            const usuarioId = indexes[i];

            let data = client.usuarioOld.get(usuarioId)

            data.nome = data.usuario
            delete data.usuario
            client.log("verbose", `nome foi definido ${data.nome} `)

            data.id = usuarioId
            client.log("verbose", `${data.nome} teve seu id definido ${data.id}`)

            if (data.aniversario !== null) {
                data.aniversario = `${2021 - data.idade} ${data.aniversario.mes} ${data.aniversario.dia} 00:00:00`
                client.log("verbose", `o aniversario de ${data.nome} foi definido para ${new Date(data.aniversario)}`)
            } else {
                client.log("verbose", `${data.nome} não tem aniversario`)
            }

            client.usuarios.set(usuarioId, data)
        }

        msg.react("👍");
    }
};