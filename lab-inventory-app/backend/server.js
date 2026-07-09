const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const barangRoutes = require('./routes/barangRoutes');
const peminjamanRoutes = require('./routes/peminjamanRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Sistem Peminjaman Inventaris Laboratorium aktif 🚀' });
});

app.use('/api/barang', barangRoutes);
app.use('/api/peminjaman', peminjamanRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Koneksi database berhasil.');
    await sequelize.sync({ alter: true });
    console.log('✅ Model tersinkronisasi dengan database.');
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Gagal terhubung ke database:', err.message);
    process.exit(1);
  }
}

start();
