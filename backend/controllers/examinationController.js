const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

exports.createMedicalRecord = async (req, res) => {
    const { MaLH, MaTC, MaBS, TrieuChung, ChanDoan, KetLuan, Medicines } = req.body;
    
    const pool = await sql.connect(dbConfig);
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const request = new sql.Request(transaction);
        
        const baResult = await request
            .input('MaLH', sql.Int, MaLH || null)
            .input('MaTC', sql.Int, MaTC)
            .input('MaBS', sql.Int, MaBS)
            .input('TrieuChung', sql.NVarChar, TrieuChung)
            .input('ChanDoan', sql.NVarChar, ChanDoan)
            .input('KetLuan', sql.NVarChar, KetLuan)
            .query(`
                INSERT INTO BENHAN (MaLH, MaTC, MaBS, TrieuChung, ChanDoan, KetLuan, NgayKham)
                OUTPUT INSERTED.MaBA
                VALUES (@MaLH, @MaTC, @MaBS, @TrieuChung, @ChanDoan, @KetLuan, GETDATE())
            `);

        const newMaBA = baResult.recordset[0].MaBA;

        if (MaLH) {
            await request.query(`UPDATE LICHHEN SET TrangThai = N'HoanThanh' WHERE MaLH = ${MaLH}`);
        }

        if (Medicines && Medicines.length > 0) {
            for (const item of Medicines) {
                const checkStock = await new sql.Request(transaction)
                    .query(`SELECT SoLuongTon FROM THUOC WHERE MaThuoc = ${item.MaThuoc}`);
                
                if (checkStock.recordset[0].SoLuongTon < item.SoLuong) {
                    throw new Error(`Thuốc ID ${item.MaThuoc} không đủ tồn kho`);
                }

                await new sql.Request(transaction)
                    .input('MaBA', sql.Int, newMaBA)
                    .input('MaThuoc', sql.Int, item.MaThuoc)
                    .input('SoLuong', sql.Int, item.SoLuong)
                    .input('CachDung', sql.NVarChar, item.CachDung)
                    .query(`
                        INSERT INTO TOATHUOC (MaBA, MaThuoc, SoLuong, CachDung)
                        VALUES (@MaBA, @MaThuoc, @SoLuong, @CachDung)
                    `);

                await new sql.Request(transaction)
                    .query(`
                        UPDATE THUOC 
                        SET SoLuongTon = SoLuongTon - ${item.SoLuong} 
                        WHERE MaThuoc = ${item.MaThuoc}
                    `);
            }
        }

        await transaction.commit();
        res.status(201).json({ message: 'Examination completed & Stock updated' });

    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ error: err.message });
    }
};