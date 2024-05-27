const redisClient = require('@/database/redis');
const Emitter = require('@/events/mails/events');
let procesarCorreos = true;
let client = null;

async function processConfirmationMailQueue() {

    if(!client) {
        client = await redisClient();
    }

    const correo = await client.rPop('correos_confirmar_usuarios');
    if (!correo) return;
    
    const user = JSON.parse(correo);

    // console.log('Procesando correo para el usuario: ', user.email);
    Emitter.emit('user.registered', user);

    await processConfirmationMailQueue();
    
}

module.exports = processConfirmationMailQueue;