const config = require('../config');
const Tweet = require('../models/tweets');
const Web3 = require('web3');
const logger = require('./log').log();
const msg = require('../../contracts/MSG.json');

class Parser {
    constructor() {
        Parser.web3 = new Web3(new Web3.providers.WebsocketProvider(config.node, config.nodeOptions));
    }

    //todo: все адреса в lowerCase перегонять и юзать!
    async start() {
        const networkId = await Parser.web3.eth.net.getId();
        Parser.msgContractAddress = msg.networks[networkId].address;
        Parser.msgContract = new Parser.web3.eth.Contract(msg.abi, Parser.msgContractAddress);

        this.subscribeLogEvent(Parser.msgContract, 'SetName', async (err, res) => {
            if (err) logger.warn(err);
            try {
                if (typeof res.data === 'undefined' || !res.data.length) return;
                const inputs = msg.abi.filter(item => item.name === 'SetName' && item.type === 'event')[0].inputs;
                const data = Parser.web3.eth.abi.decodeParameters(inputs, res.data);

                const tokens = await Tweet.findAll({where: {owner_address: data.writer}});
                for (let token of tokens) {
                    token.owner_name = data.name;
                    await token.save();
                }
            } catch (erro) {
                logger.warn('SetName subscribe error => ' + erro);
            }
        });

        this.subscribeLogEvent(Parser.msgContract, 'Message', async (err, res) => {
            if (err) logger.warn(err);
            try {
                if (typeof res.data === 'undefined' || !res.data.length) return;
                const inputs = msg.abi.filter(item => item.name === 'Message' && item.type === 'event')[0].inputs;
                const data = Parser.web3.eth.abi.decodeParameters(inputs, res.data);

                let token = await Tweet.findOne({where: {token_id: data.Id}});

                if (!token) {
                    await Tweet.create({
                        token_id: data.Id,
                        owner_address: data.writer,
                        owner_name: data.name,
                        tweet: data.message,
                        created_at: data.time
                    });
                }
            } catch (erro) {
                logger.warn('Message subscribe error => ' + erro);
            }
        });

        this.parseNft();
    }

    async parseNft() {
        const maxTweetId = await Parser.msgContract.methods.id().call();
        let tokens = await Tweet.findAll();
        const existsTweets = tokens.map(item => item.token_id);
        // const
        let missing = [];
        for (let i = 0; i < maxTweetId; i++) {
            if (existsTweets.indexOf(i) !== -1) continue;
            missing.push(i);
        }

        for (let tid of missing) {
            try {
                const msg = await Parser.msgContract.methods.read(tid).call();

                await Tweet.create({
                    token_id: tid,
                    owner_address: msg.writer,
                    owner_name: msg._name,
                    tweet: msg.message,
                    created_at: msg._time
                });

            } catch (exc) {
                logger.warn('Error parse tweets => ' + exc);
            }
        }

    }

    // Subscriber method
    subscribeLogEvent(contract, eventName, cb) {
        const eventJsonInterface = Parser.web3.utils._.find(
            contract._jsonInterface,
            o => o.name === eventName && o.type === 'event',
        )
        Parser.web3.eth.subscribe('logs', {
            address: contract.options.address,
            topics: [eventJsonInterface.signature]
        }, cb)
    }
}

module.exports = new Parser();
