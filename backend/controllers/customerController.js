const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

exports.getAllCustomers = async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT * FROM KHACHHANG ORDER BY MaKH DESC');
        res.json(result.recordset);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createCustomer = async (req, res) => {
    const { HoTen, SDT, Email, DiaChi, TenDangNhap, MatKhau } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('HoTen', sql.NVarChar, HoTen).input('SDT', sql.VarChar, SDT).input('Email', sql.VarChar, Email)
            .input('DiaChi', sql.NVarChar, DiaChi).input('TenDangNhap', sql.NVarChar, TenDangNhap).input('MatKhau', sql.NVarChar, MatKhau)
            .query("INSERT INTO KHACHHANG (HoTen, SDT, Email, DiaChi, TenDangNhap, MatKhau, NgayDK) VALUES (@HoTen, @SDT, @Email, @DiaChi, @TenDangNhap, @MatKhau, GETDATE())");
        res.status(201).json({ message: 'Success' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request().input('id', sql.Int, id).query("DELETE FROM KHACHHANG WHERE MaKH = @id");
        res.json({ message: 'Đã xóa khách hàng' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { HoTen, SDT, Email, DiaChi } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('id', sql.Int, id).input('HoTen', sql.NVarChar, HoTen).input('SDT', sql.VarChar, SDT)
            .input('Email', sql.VarChar, Email).input('DiaChi', sql.NVarChar, DiaChi)
            .query("UPDATE KHACHHANG SET HoTen=@HoTen, SDT=@SDT, Email=@Email, DiaChi=@DiaChi WHERE MaKH=@id");
        res.json({ message: 'Cập nhật thành công' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};