const Sequelize = require('sequelize');
const config = require('../config');
const logger = require('./log').log();
const fs = require('fs');
const path = require('path');
const modelDir = path.join(__dirname, '../models');
const opts = {
  host: config.mysql.host,
  dialect: 'mysql',
  logging: config.mysql.logging
};

class MySQLConnection {
  constructor() {
    if (MySQLConnection._instance) {
      return MySQLConnection._instance;
    }

    this.client = new Sequelize(config.mysql.db, config.mysql.user, config.mysql.password, opts);
    MySQLConnection._instance = this;
  }

  async connect() {
    await this.client.authenticate();
    logger.info('Connection to MySQL has been established successfully');
    // await this.importDb();
  }

  getClient() {
    return this.client;
  }

  async importDb(orderPriority) {
    if (orderPriority) {
      for (let i in orderPriority) {
        let item = orderPriority[i];
        const name = path.join(modelDir, item);
        await require(name).sync();
      }
    }
    fs.readdirSync(modelDir)
      .forEach(file => {
        if (!orderPriority || !orderPriority.includes(file)) {
          const name = path.join(modelDir, file);
          require(name).sync();
        }
      });
  }
}

module.exports = MySQLConnection;
