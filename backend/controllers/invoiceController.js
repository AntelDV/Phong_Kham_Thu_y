const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

exports.getAllInvoices = async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query(`
            SELECT H.*, K.HoTen as TenKhach, N.HoTen as TenNhanVien
            FROM HOADON H
            JOIN KHACHHANG K ON H.MaKH = K.MaKH
            LEFT JOIN NHANVIEN N ON H.MaNV = N.MaNV
            ORDER BY H.NgayTao DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createInvoice = async (req, res) => {
    const { MaKH, MaNV, MaBA, TongTien, HinhThucTT } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('MaKH', sql.Int, MaKH)
            .input('MaNV', sql.Int, MaNV)
            .input('MaBA', sql.Int, MaBA)
            .input('TongTien', sql.Decimal, TongTien)
            .input('HinhThucTT', sql.NVarChar, HinhThucTT)
            .query(`
                INSERT INTO HOADON (MaKH, MaNV, MaBA, TongTien, TrangThai, HinhThucTT, NgayTao)
                VALUES (@MaKH, @MaNV, @MaBA, @TongTien, N'DaThanhToan', @HinhThucTT, GETDATE())
            `);
        res.status(201).json({ message: 'Success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        
        // Thống kê tổng quan
        const incomeRes = await pool.request().query("SELECT SUM(TongTien) as Total FROM HOADON");
        const income = incomeRes.recordset[0].Total || 0;

        const customerRes = await pool.request().query("SELECT COUNT(*) as Total FROM KHACHHANG");
        const customers = customerRes.recordset[0].Total;

        const bookingRes = await pool.request().query("SELECT COUNT(*) as Total FROM LICHHEN WHERE TrangThai = 'ChoKham'");
        const pending = bookingRes.recordset[0].Total;

        // Dữ liệu biểu đồ
        const chartRes = await pool.request().query(`
            SELECT FORMAT(NgayTao, 'dd/MM') as Date, SUM(TongTien) as Revenue 
            FROM HOADON 
            GROUP BY FORMAT(NgayTao, 'dd/MM')
            ORDER BY Date ASC
        `);

        // Lấy hoạt động gần đây (3 Lịch hẹn + 3 Hóa đơn mới nhất)
        const recentBookings = await pool.request().query(`
            SELECT TOP 3 L.NgayGioHen, K.HoTen, 'Booking' as Type 
            FROM LICHHEN L JOIN KHACHHANG K ON L.MaKH = K.MaKH 
            ORDER BY L.NgayGioHen DESC
        `);
        
        const recentInvoices = await pool.request().query(`
            SELECT TOP 3 H.NgayTao, K.HoTen, H.TongTien, 'Invoice' as Type 
            FROM HOADON H JOIN KHACHHANG K ON H.MaKH = K.MaKH 
            ORDER BY H.NgayTao DESC
        `);

        // Gộp và sắp xếp lại theo thời gian
        const activities = [...recentBookings.recordset, ...recentInvoices.recordset]
            .sort((a, b) => new Date(b.NgayGioHen || b.NgayTao) - new Date(a.NgayGioHen || a.NgayTao))
            .slice(0, 5); // Lấy 5 cái mới nhất

        res.json({
            income,
            customers,
            pending,
            chartData: chartRes.recordset,
            recentActivity: activities
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};