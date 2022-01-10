const Duration = require('duration');
var lt = require('long-timeout');
const { proximoAniversario } = require("../modulos/utils");

module.exports = async () => {
    const usuIdxs = client.usuarios.indexes//client.usuarios.filterArray(u => u.aniversario !== null);
    if (usuIdxs.length === 0) return client.log("bot", "Nenhum usuário encontrado no banco de dados", "aviso");

    // Juntar os aniversariantes com o mesmo aniversario
    const listaAniver = {}
    for (const usuarioId of usuIdxs) {
        const usuario = client.usuarios.get(usuarioId);

        if (!usuario.aniversario) continue;

        // Data do proximo aniversario
        const dataAniver = proximoAniversario(new Date(usuario.aniversario));

        const dataAniverIOS = dataAniver.toISOString();

        listaAniver[dataAniverIOS]
            ? listaAniver[dataAniverIOS].push(usuarioId)
            : listaAniver[dataAniverIOS] = [usuarioId]
    }

    //* Esperar até o aniversário, e enviar um evento quanto for
    for (const dataAniver in listaAniver) {
        if (Object.hasOwnProperty.call(listaAniver, dataAniver)) {
            const aniversariantes = listaAniver[dataAniver];

            // Tempo que falta para o aniversario
            const duracaoAniver = new Duration(new Date(), new Date(dataAniver));

            // Tempo em millisegundos para o aniversario
            const msAniversario = Number(duracaoAniver.toString("%Ls"));

            if (msAniversario < 0) {
                client.log("erro", `Aniversário de ${aniversariantes.join(", ")} definido no passado: ${msAniversario}`)
            }

            // long-timeout permite definir um timeout maior que 24.8 dias
            lt.setTimeout(() => client.emit("aniversario", aniversariantes), msAniversario);
        }
    }
}