const Sequelize = require('sequelize');
const MySQLConnection = require('./../helper/mysql');
const Connection = new MySQLConnection();
const sequelize = Connection.getClient();

const tweetSchema = {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    token_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    owner_address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    owner_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tweet: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    created_at: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
};

const Token = sequelize.define('tweets', tweetSchema, {timestamps: false});

Token.attr = Object.keys(tweetSchema);

module.exports = Token;
