const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/dbContext');

const collections = [
    'khach_hang',
    'thu_cung',
    'nhan_vien',
    'dich_vu',
    'thuoc',
    'lich_hen',
    'benh_an',
    'chi_tiet_benh_an',
    'hoa_don',
    'chi_tiet_hoa_don'
];

collections.forEach((collection) => {
    
    router.get(`/${collection}`, (req, res) => {
        const data = readData(collection);
        res.json(data);
    });

    router.get(`/${collection}/:id`, (req, res) => {
        const data = readData(collection);
        const item = data.find(x => x.id == req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.json(item);
    });

    router.post(`/${collection}`, (req, res) => {
        const data = readData(collection);
        const newId = data.length > 0 ? Math.max(...data.map(x => x.id)) + 1 : 1;
        const newItem = { id: newId, ...req.body };
        data.push(newItem);
        writeData(collection, data);
        res.status(201).json(newItem);
    });

    router.put(`/${collection}/:id`, (req, res) => {
        const data = readData(collection);
        const index = data.findIndex(x => x.id == req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Not found' });
        
        data[index] = { ...data[index], ...req.body, id: Number(req.params.id) };
        writeData(collection, data);
        res.json(data[index]);
    });

    router.delete(`/${collection}/:id`, (req, res) => {
        let data = readData(collection);
        const index = data.findIndex(x => x.id == req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Not found' });

        data = data.filter(x => x.id != req.params.id);
        writeData(collection, data);
        res.json({ message: 'Deleted successfully' });
    });
});

router.get('/bac_si', (req, res) => {
    const nhanVien = readData('nhan_vien');
    const bacSi = nhanVien.filter(nv => 
        nv.chuc_vu && (nv.chuc_vu.toLowerCase().includes('bác sĩ') || nv.chuc_vu.toLowerCase().includes('bac si'))
    );
    res.json(bacSi);
});

module.exports = router;