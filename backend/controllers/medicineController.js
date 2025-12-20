const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

exports.getAllMedicines = async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT * FROM THUOC ORDER BY TenThuoc ASC');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.importMedicine = async (req, res) => {
    const { TenThuoc, DonViTinh, SoLuongTon, GiaNhap, GiaBan, HanSuDung } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('TenThuoc', sql.NVarChar, TenThuoc)
            .input('DonViTinh', sql.NVarChar, DonViTinh)
            .input('SoLuongTon', sql.Int, SoLuongTon)
            .input('GiaNhap', sql.Decimal, GiaNhap)
            .input('GiaBan', sql.Decimal, GiaBan)
            .input('HanSuDung', sql.Date, HanSuDung)
            .query(`
                INSERT INTO THUOC (TenThuoc, DonViTinh, SoLuongTon, GiaNhap, GiaBan, HanSuDung)
                VALUES (@TenThuoc, @DonViTinh, @SoLuongTon, @GiaNhap, @GiaBan, @HanSuDung)
            `);
        res.status(201).json({ message: 'Success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};