require('dotenv').config();
const { sequelize, Barang, Peminjaman } = require('./models');

async function seed() {
  try {
    await sequelize.sync({ force: true });

    const barangList = await Barang.bulkCreate([
      {
        kode_barang: 'LAB-001',
        nama_barang: 'Osiloskop Digital',
        kategori: 'Alat Ukur',
        kondisi: 'Baik',
        stok_total: 5,
        stok_tersedia: 5,
        deskripsi: 'Osiloskop 2 channel untuk praktikum elektronika',
        lokasi_rak: 'Rak A1',
      },
      {
        kode_barang: 'LAB-002',
        nama_barang: 'Laptop Praktikum',
        kategori: 'Komputer',
        kondisi: 'Baik',
        stok_total: 10,
        stok_tersedia: 10,
        deskripsi: 'Laptop untuk praktikum pemrograman',
        lokasi_rak: 'Rak B2',
      },
      {
        kode_barang: 'LAB-003',
        nama_barang: 'Multimeter Digital',
        kategori: 'Alat Ukur',
        kondisi: 'Rusak Ringan',
        stok_total: 8,
        stok_tersedia: 8,
        deskripsi: 'Multimeter untuk pengukuran tegangan dan arus',
        lokasi_rak: 'Rak A2',
      },
      {
        kode_barang: 'LAB-004',
        nama_barang: 'Proyektor Mini',
        kategori: 'Elektronik',
        kondisi: 'Baik',
        stok_total: 3,
        stok_tersedia: 3,
        deskripsi: 'Proyektor portabel untuk presentasi',
        lokasi_rak: 'Rak C1',
      },
    ]);

    await Peminjaman.bulkCreate([
      {
        barang_id: barangList[0].id,
        nama_peminjam: 'Ahmad Fauzi',
        nim_nip: '10122001',
        jumlah_pinjam: 1,
        tanggal_pinjam: '2026-07-01',
        tanggal_rencana_kembali: '2026-07-08',
        status: 'Dipinjam',
        catatan: 'Untuk praktikum elektronika dasar',
      },
    ]);

    // Sesuaikan stok karena ada 1 barang sedang dipinjam
    barangList[0].stok_tersedia -= 1;
    await barangList[0].save();

    console.log('✅ Seed data berhasil dimasukkan.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Gagal seed data:', err.message);
    process.exit(1);
  }
}

seed();
