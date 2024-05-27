const { Sequelize } = require('sequelize');
let dbInstance = null;
function getDbInstance() {
    if (!dbInstance) {
        dbInstance = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT,
            logging:  process.env.DEBUG_MODE == 'true' ? console.log : false,
        });
    }
    return dbInstance;
}

module.exports = getDbInstance;