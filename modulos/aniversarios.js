const cron = require('node-cron');

module.exports = async () => {
    const usuarios = client.usuarios.filterArray(u => u.aniversario !== null);
    if (usuarios.length === 0) return client.log("bot", "Nenhum usuário encontrado no banco de dados", "aviso");

    const aniversariantes = {}
    for (const usuario of usuarios) {
        const data = new Date(usuario.aniversario)
        const a = `${data.getDate()}-${data.getMonth()}`

        aniversariantes[a] ? aniversariantes[a].push(usuario.id) : aniversariantes[a] = [usuario.id]
    }

    // eslint-disable-next-line guard-for-in
    for (var key in aniversariantes) {

        // eslint-disable-next-line no-loop-func
        var aviso = cron.schedule(`0 0 0 ${key.split("-")[0]} ${key.split("-")[1]} *`, () => {
            client.emit("aniversario", aniversariantes[key])
            aviso.destroy();
        });
    }
}