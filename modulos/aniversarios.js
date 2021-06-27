const cron = require('node-cron');

module.exports = async () => {
    const usuarios = client.usuarios.array();
    if (usuario.length === 0) return client.log("bot", "Nenhum usuário encontrado no banco de dados", "aviso");

    const canalId = client.config.get("aniversarios")
    if (!canalId) return client.log("bot", "Nenhum canal para aniversários definido", "aviso");

    const canal = await client.channels.fetch(canalId);
    if (!canal) return client.log("bot", "Canal de aniversários não foi encontrado", "erro");

    const aniversariantes = [];
    for (const usuario of usuarios) {
        if (usuario.aniversario === null) return client.log("verbose", `${usuario.nome} não tem um aniversário definido`);

        const membro = await canal.guild.members.fetch(usuario.id);
        if (!membro) return client.log("bot", `${usuario.nome} não foi encontrado`, "erro");

        aniversariantes.push(membro);
    }

    /*
    * TODO Fazer aniversarios
    * labels: coisa nova, em desenvolvimento
    */
}