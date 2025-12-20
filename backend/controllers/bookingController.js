const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

// Lấy danh sách lịch hẹn (Kèm thông tin Khách, Thú, Bác sĩ)
exports.getBookings = async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query(`
            SELECT L.*, K.HoTen as TenKhach, T.TenTC, N.HoTen as TenBacSi 
            FROM LICHHEN L
            JOIN KHACHHANG K ON L.MaKH = K.MaKH
            JOIN THUCUNG T ON L.MaTC = T.MaTC
            LEFT JOIN NHANVIEN N ON L.MaBS = N.MaNV
            ORDER BY L.NgayGioHen DESC
        `);
        res.json(result.recordset);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// Tạo lịch hẹn mới
exports.createBooking = async (req, res) => {
    const { MaKH, MaTC, MaBS, NgayGioHen, LoaiHen, GhiChu } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('MaKH', sql.Int, MaKH)
            .input('MaTC', sql.Int, MaTC)
            .input('MaBS', sql.Int, MaBS)
            .input('NgayGioHen', sql.DateTime, NgayGioHen)
            .input('LoaiHen', sql.NVarChar, LoaiHen)
            .input('GhiChu', sql.NVarChar, GhiChu)
            .query(`
                INSERT INTO LICHHEN (MaKH, MaTC, MaBS, NgayGioHen, LoaiHen, TrangThai, GhiChu)
                VALUES (@MaKH, @MaTC, @MaBS, @NgayGioHen, @LoaiHen, N'ChoKham', @GhiChu)
            `);
        res.status(201).json({ message: 'Đặt lịch thành công' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};