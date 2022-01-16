const Tweet = require('../models/tweets');
const {validationResult} = require('express-validator');
const logger = require('../helper/log').log();

module.exports = {
    async getList(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const count = req.query.limit | 10;
        const offset = req.query.offset | 0;
        try {
            const total = await Tweet.count();
            const pages = Math.ceil(total / count)
            const list = await Tweet.findAll({
                limit: count,
                offset: offset,
                order: [['token_id', 'DESC']]
            });
            return res.status(200).json({
                list,
                pages
            }).end();
        } catch (err) {
            logger.error(err);
            return res.status(200).json({error: true, msg: err}).end();
        }
    },

    async getMyList(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const owner = req.query.from;
        const count = req.query.limit | 10;
        const offset = req.query.offset | 0;

        try {
            const list = await Tweet.findAll({
                where: {owner},
                limit: count,
                offset: offset,
                order: [['token_id', 'DESC']]
            });
            return res.status(200).json(list).end();
        } catch (err) {
            logger.error(err);
            return res.status(200).json({error: true, msg: err}).end();
        }
    },
}
