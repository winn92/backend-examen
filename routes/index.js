const express = require('express');
const router = express.Router();


router.get('/all', (req, res) => {
    const data = require('../public/data.json');
    res.json(data);
});

router.post('/obtener-un-atributo-json', (req, res) => {
    const { campo } = req.body;
    const array = require('../public/data.json').reduce((acc, val) => [...acc, val[campo]], []);
    res.json([...new Set(array)]);
});

router.post('/all', (req, res) => {
    const { ciudad, tipo, from, to } = req.body;
    let data = require('../public/data.json');
    if (ciudad !== "") { data = data.filter(d => d.Ciudad == ciudad) };
    if (tipo !== "") { data = data.filter(d => d.Tipo == tipo) };
    data = data.filter(d => {
        return parseInt(d.Precio.substring(1).replace(',', "")) >= from && parseInt(d.Precio.substring(1).replace(',', "")) <= to;
    });
    res.json(data);
});

module.exports = router;