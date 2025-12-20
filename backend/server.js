const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Cho phép Frontend truy cập
app.use(cors());

// Xử lý dữ liệu JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Đường dẫn API chính
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Server đang chạy với JSON Database!');
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});