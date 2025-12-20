const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

// Lấy danh sách chỉ bao gồm Bác sĩ
exports.getDoctors = async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query(`
            SELECT MaNV, HoTen, ChuyenKhoa 
            FROM NHANVIEN 
            WHERE ChucVu = 'BacSi'
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};