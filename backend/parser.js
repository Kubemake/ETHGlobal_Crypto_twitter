const express = require('express');
const bodyParser = require('body-parser');
const MySQLConnection = require('./helper/mysql');
const db = new MySQLConnection();
const router = require('./routes');
const path = require('path');
const config = require('./config');
const port = config.apiPort;
const logger = require('./helper/log').log();
const Parser = require('./helper/parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({origin: '*'}));
app.use('/api', router);

db
    .connect()
    .then(() => db.importDb())
    .then(() => {
        Parser.start();
        app.listen(port, () => logger.info('Server listening on ' + port))
    })
    .catch(err => logger.error(err));

module.exports = app;
