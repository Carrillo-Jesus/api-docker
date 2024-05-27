const sequelize = require('./db');

//sincronizar base de datos para que coincida con los modelos
function synchronizeDatabase() {
    sequelize().sync({ alter: true })
    .then(() => {
        console.log('Base de datos sincronizada');
    })
    .catch((err) => {
        console.error('Error al sincronizar la base de datos:', err);
    });
}

module.exports = synchronizeDatabase;
