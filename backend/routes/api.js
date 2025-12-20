const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/dbContext');

const collections = [
    'khach_hang', 'thu_cung', 'nhan_vien', 'dich_vu', 'thuoc',
    'lich_hen', 'benh_an', 'chi_tiet_benh_an', 'hoa_don', 'chi_tiet_hoa_don'
];

// 1. API CRUD Tự động
collections.forEach((collection) => {
    router.get(`/${collection}`, (req, res) => {
        res.json(readData(collection));
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
        const data = readData(collection);
        const newData = data.filter(x => x.id != req.params.id);
        writeData(collection, newData);
        res.json({ message: 'Deleted' });
    });
});

// 2. API ĐĂNG NHẬP THẬT (Check trong file nhan_vien.json)
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const nhanVien = readData('nhan_vien');
    
    // Tìm người dùng có username VÀ mật khẩu khớp trong file JSON
    // Username có thể là SĐT hoặc tên đăng nhập
    const user = nhanVien.find(nv => 
        (nv.username === username || nv.sdt === username) && nv.mat_khau === password
    );

    if (user) {
        // Trả về thông tin user (trừ mật khẩu ra để bảo mật)
        const { mat_khau, ...userInfo } = user;
        res.json({ success: true, message: 'Đăng nhập thành công', user: userInfo });
    } else {
        res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
    }
});

// 3. API ĐĂNG KÝ THẬT (Ghi vào file nhan_vien.json)
router.post('/register', (req, res) => {
    const { fullName, phone, password, username } = req.body;
    const nhanVien = readData('nhan_vien');

    // Kiểm tra trùng
    if (nhanVien.some(nv => nv.sdt === phone || nv.username === username)) {
        return res.status(400).json({ success: false, message: 'Tài khoản hoặc SĐT đã tồn tại' });
    }

    const newId = nhanVien.length > 0 ? Math.max(...nhanVien.map(x => x.id)) + 1 : 1;
    const newUser = {
        id: newId,
        hoten: fullName,
        sdt: phone,
        username: username || phone, // Nếu không nhập username thì lấy sdt
        mat_khau: password, // Lưu mật khẩu vào JSON
        chuc_vu: 'Nhân viên mới', // Mặc định
        trang_thai: 'Chờ duyệt'
    };

    nhanVien.push(newUser);
    writeData('nhan_vien', nhanVien);
    
    res.json({ success: true, message: 'Đăng ký thành công' });
});

module.exports = router;