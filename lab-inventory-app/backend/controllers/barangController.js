const { Barang, Peminjaman } = require('../models');

// GET semua barang
exports.getAllBarang = async (req, res) => {
  try {
    const data = await Barang.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET satu barang beserta riwayat peminjamannya
exports.getBarangById = async (req, res) => {
  try {
    const barang = await Barang.findByPk(req.params.id, {
      include: [{ model: Peminjaman }],
    });
    if (!barang) {
      return res.status(404).json({ success: false, message: 'Barang tidak ditemukan' });
    }
    res.json({ success: true, data: barang });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE barang
exports.createBarang = async (req, res) => {
  try {
    const { kode_barang, nama_barang, kategori, kondisi, stok_total, deskripsi, lokasi_rak } = req.body;
    if (!kode_barang || !nama_barang || !stok_total) {
      return res.status(400).json({ success: false, message: 'Kode, nama, dan stok wajib diisi' });
    }
    const barang = await Barang.create({
      kode_barang,
      nama_barang,
      kategori,
      kondisi,
      stok_total,
      stok_tersedia: stok_total,
      deskripsi,
      lokasi_rak,
    });
    res.status(201).json({ success: true, data: barang });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE barang
exports.updateBarang = async (req, res) => {
  try {
    const barang = await Barang.findByPk(req.params.id);
    if (!barang) {
      return res.status(404).json({ success: false, message: 'Barang tidak ditemukan' });
    }
    const { kode_barang, nama_barang, kategori, kondisi, stok_total, deskripsi, lokasi_rak } = req.body;

    // Jika stok_total berubah, sesuaikan stok_tersedia secara proporsional
    if (stok_total !== undefined && stok_total !== barang.stok_total) {
      const selisih = stok_total - barang.stok_total;
      barang.stok_tersedia = Math.max(0, barang.stok_tersedia + selisih);
      barang.stok_total = stok_total;
    }

    barang.kode_barang = kode_barang ?? barang.kode_barang;
    barang.nama_barang = nama_barang ?? barang.nama_barang;
    barang.kategori = kategori ?? barang.kategori;
    barang.kondisi = kondisi ?? barang.kondisi;
    barang.deskripsi = deskripsi ?? barang.deskripsi;
    barang.lokasi_rak = lokasi_rak ?? barang.lokasi_rak;

    await barang.save();
    res.json({ success: true, data: barang });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE barang
exports.deleteBarang = async (req, res) => {
  try {
    const barang = await Barang.findByPk(req.params.id);
    if (!barang) {
      return res.status(404).json({ success: false, message: 'Barang tidak ditemukan' });
    }
    await barang.destroy();
    res.json({ success: true, message: 'Barang berhasil dihapus' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
