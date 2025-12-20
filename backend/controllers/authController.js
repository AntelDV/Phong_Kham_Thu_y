const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

let otpStore = {};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        let user = null;
        let role = '';

        const staffResult = await pool.request()
            .input('user', sql.NVarChar, username)
            .input('pass', sql.NVarChar, password)
            .query("SELECT MaNV, HoTen, SDT, ChucVu, TenDangNhap FROM NHANVIEN WHERE TenDangNhap = @user AND MatKhau = @pass");

        if (staffResult.recordset.length > 0) {
            user = staffResult.recordset[0];
            role = user.ChucVu;
        } else {
            const customerResult = await pool.request()
                .input('user', sql.NVarChar, username)
                .input('pass', sql.NVarChar, password)
                .query("SELECT MaKH, HoTen, SDT, Email, DiaChi, TenDangNhap FROM KHACHHANG WHERE TenDangNhap = @user AND MatKhau = @pass");
            
            if (customerResult.recordset.length > 0) {
                user = customerResult.recordset[0];
                role = 'KhachHang';
            }
        }

        if (user) {
            res.json({ 
                success: true, 
                user: { ...user, ChucVu: role } 
            });
        } else {
            res.status(401).json({ success: false, message: 'Sai thông tin đăng nhập' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.register = async (req, res) => {
    const { hoTen, sdt, email, username, password, diaChi } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        const checkExist = await pool.request().input('user', sql.NVarChar, username).query("SELECT TOP 1 * FROM KHACHHANG WHERE TenDangNhap = @user");
        if (checkExist.recordset.length > 0) return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });

        await pool.request()
            .input('HoTen', sql.NVarChar, hoTen).input('SDT', sql.VarChar, sdt).input('Email', sql.VarChar, email)
            .input('DiaChi', sql.NVarChar, diaChi).input('TenDangNhap', sql.NVarChar, username).input('MatKhau', sql.NVarChar, password)
            .query("INSERT INTO KHACHHANG (HoTen, SDT, Email, DiaChi, TenDangNhap, MatKhau, NgayDK) VALUES (@HoTen, @SDT, @Email, @DiaChi, @TenDangNhap, @MatKhau, GETDATE())");

        res.json({ success: true, message: 'Đăng ký thành công' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateProfile = async (req, res) => {
    const { id, role, hoTen, sdt, email, diaChi } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        if (role === 'KhachHang') {
            await pool.request()
                .input('ID', sql.Int, id).input('HoTen', sql.NVarChar, hoTen).input('SDT', sql.VarChar, sdt)
                .input('Email', sql.VarChar, email).input('DiaChi', sql.NVarChar, diaChi)
                .query("UPDATE KHACHHANG SET HoTen=@HoTen, SDT=@SDT, Email=@Email, DiaChi=@DiaChi WHERE MaKH=@ID");
        } else {
            await pool.request()
                .input('ID', sql.Int, id).input('HoTen', sql.NVarChar, hoTen).input('SDT', sql.VarChar, sdt)
                .query("UPDATE NHANVIEN SET HoTen=@HoTen, SDT=@SDT WHERE MaNV=@ID");
        }
        res.json({ success: true, message: 'Cập nhật hồ sơ thành công' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.forgotPassword = async (req, res) => {
    const { username } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        const checkUser = await pool.request().input('user', sql.NVarChar, username)
            .query("SELECT TenDangNhap FROM KHACHHANG WHERE TenDangNhap = @user UNION SELECT TenDangNhap FROM NHANVIEN WHERE TenDangNhap = @user");

        if (checkUser.recordset.length === 0) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[username] = otp;
        console.log(`[OTP] Mã OTP cho user '${username}': ${otp}`);
        res.json({ success: true, message: 'Mã OTP đã gửi (Check Terminal)' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.verifyOTPAndReset = async (req, res) => {
    const { username, otp, newPassword } = req.body;
    if (!otpStore[username] || otpStore[username] !== otp) return res.status(400).json({ message: 'Mã OTP không chính xác' });

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request().input('pass', sql.NVarChar, newPassword).input('user', sql.NVarChar, username).query("UPDATE KHACHHANG SET MatKhau = @pass WHERE TenDangNhap = @user");
        await pool.request().input('pass', sql.NVarChar, newPassword).input('user', sql.NVarChar, username).query("UPDATE NHANVIEN SET MatKhau = @pass WHERE TenDangNhap = @user");
        delete otpStore[username];
        res.json({ success: true, message: 'Đổi mật khẩu thành công' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};