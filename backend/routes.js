const express = require('express');
const router = new express.Router();
const nft = require('./controllers/nft');
const {query} = require('express-validator');

router.get('/list',
    query('limit').isInt(),
    query('offset').isInt(),
    nft.getList);

router.get('/list-my',
    query('from').isEthereumAddress(),
    nft.getMyList);

module.exports = router;
