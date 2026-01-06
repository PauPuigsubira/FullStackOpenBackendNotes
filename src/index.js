const config = require('./utils/config');
const { info } = require('./utils/logger');
const app = require('./app');

app.listen(config.PORT);
info(`Server running on port ${config.PORT} ${Date().toString()}`);
