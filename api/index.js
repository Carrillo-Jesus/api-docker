require('module-alias/register');
require('dotenv').config();
const synchronizeDatabase = require('@/database/synchronizeDatabase');
const app = require('@/router/app');
const port = process.env.APP_PORT || 4000;

synchronizeDatabase();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});