const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

exports.getAllPets = async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query(`
            SELECT T.*, K.HoTen as TenChu 
            FROM THUCUNG T 
            LEFT JOIN KHACHHANG K ON T.MaKH = K.MaKH
        `);
        res.json(result.recordset);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createPet = async (req, res) => {
    const { MaKH, TenTC, Loai, Giong, Tuoi, CanNang, GioiTinh, TieuSuBenh } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('MaKH', sql.Int, MaKH).input('TenTC', sql.NVarChar, TenTC)
            .input('Loai', sql.NVarChar, Loai).input('Giong', sql.NVarChar, Giong)
            .input('Tuoi', sql.Float, Tuoi).input('CanNang', sql.Float, CanNang)
            .input('GioiTinh', sql.NVarChar, GioiTinh).input('TieuSuBenh', sql.NVarChar, TieuSuBenh)
            .query(`INSERT INTO THUCUNG (MaKH, TenTC, Loai, Giong, Tuoi, CanNang, GioiTinh, TieuSuBenh) 
                    VALUES (@MaKH, @TenTC, @Loai, @Giong, @Tuoi, @CanNang, @GioiTinh, @TieuSuBenh)`);
        res.status(201).json({ message: 'Success' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getPetHistory = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().input('MaTC', sql.Int, id).query(`
            SELECT B.NgayKham, B.ChanDoan, B.KetLuan, N.HoTen as TenBacSi
            FROM BENHAN B
            JOIN LICHHEN L ON B.MaLH = L.MaLH
            LEFT JOIN NHANVIEN N ON B.MaBS = N.MaNV
            WHERE L.MaTC = @MaTC
            ORDER BY B.NgayKham DESC
        `);
        res.json(result.recordset);
    } catch (err) { res.status(500).json({ error: err.message }); }
};