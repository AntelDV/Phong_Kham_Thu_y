const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, 
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // true nếu dùng Azure, false nếu local
        trustServerCertificate: true // true cho môi trường dev
    }
};

module.exports = config;
