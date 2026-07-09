const { Peminjaman, Barang } = require('../models');

// GET semua peminjaman (join dengan barang)
exports.getAllPeminjaman = async (req, res) => {
  try {
    const data = await Peminjaman.findAll({
      include: [{ model: Barang, attributes: ['id', 'nama_barang', 'kode_barang', 'kategori'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET satu peminjaman
exports.getPeminjamanById = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.findByPk(req.params.id, {
      include: [{ model: Barang }],
    });
    if (!peminjaman) {
      return res.status(404).json({ success: false, message: 'Peminjaman tidak ditemukan' });
    }
    res.json({ success: true, data: peminjaman });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE peminjaman -> mengurangi stok_tersedia barang terkait
exports.createPeminjaman = async (req, res) => {
  try {
    const { barang_id, nama_peminjam, nim_nip, jumlah_pinjam, tanggal_pinjam, tanggal_rencana_kembali, catatan } = req.body;

    if (!barang_id || !nama_peminjam || !nim_nip || !tanggal_pinjam || !tanggal_rencana_kembali) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
    }

    const barang = await Barang.findByPk(barang_id);
    if (!barang) {
      return res.status(404).json({ success: false, message: 'Barang tidak ditemukan' });
    }

    const jumlah = jumlah_pinjam || 1;
    if (barang.stok_tersedia < jumlah) {
      return res.status(400).json({ success: false, message: `Stok tersedia hanya ${barang.stok_tersedia}` });
    }

    const peminjaman = await Peminjaman.create({
      barang_id,
      nama_peminjam,
      nim_nip,
      jumlah_pinjam: jumlah,
      tanggal_pinjam,
      tanggal_rencana_kembali,
      catatan,
      status: 'Dipinjam',
    });

    barang.stok_tersedia -= jumlah;
    await barang.save();

    res.status(201).json({ success: true, data: peminjaman });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE peminjaman (misal ubah tanggal / catatan, atau proses pengembalian)
exports.updatePeminjaman = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.findByPk(req.params.id);
    if (!peminjaman) {
      return res.status(404).json({ success: false, message: 'Peminjaman tidak ditemukan' });
    }

    const { nama_peminjam, nim_nip, tanggal_rencana_kembali, tanggal_kembali_aktual, status, catatan } = req.body;
    const statusSebelumnya = peminjaman.status;

    peminjaman.nama_peminjam = nama_peminjam ?? peminjaman.nama_peminjam;
    peminjaman.nim_nip = nim_nip ?? peminjaman.nim_nip;
    peminjaman.tanggal_rencana_kembali = tanggal_rencana_kembali ?? peminjaman.tanggal_rencana_kembali;
    peminjaman.tanggal_kembali_aktual = tanggal_kembali_aktual ?? peminjaman.tanggal_kembali_aktual;
    peminjaman.catatan = catatan ?? peminjaman.catatan;
    peminjaman.status = status ?? peminjaman.status;

    // Jika status berubah menjadi Dikembalikan, kembalikan stok barang
    if (statusSebelumnya !== 'Dikembalikan' && peminjaman.status === 'Dikembalikan') {
      const barang = await Barang.findByPk(peminjaman.barang_id);
      if (barang) {
        barang.stok_tersedia = Math.min(barang.stok_total, barang.stok_tersedia + peminjaman.jumlah_pinjam);
        await barang.save();
      }
      if (!peminjaman.tanggal_kembali_aktual) {
        peminjaman.tanggal_kembali_aktual = new Date().toISOString().slice(0, 10);
      }
    }

    await peminjaman.save();
    res.json({ success: true, data: peminjaman });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE peminjaman -> kembalikan stok jika masih berstatus Dipinjam
exports.deletePeminjaman = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.findByPk(req.params.id);
    if (!peminjaman) {
      return res.status(404).json({ success: false, message: 'Peminjaman tidak ditemukan' });
    }

    if (peminjaman.status === 'Dipinjam') {
      const barang = await Barang.findByPk(peminjaman.barang_id);
      if (barang) {
        barang.stok_tersedia = Math.min(barang.stok_total, barang.stok_tersedia + peminjaman.jumlah_pinjam);
        await barang.save();
      }
    }

    await peminjaman.destroy();
    res.json({ success: true, message: 'Peminjaman berhasil dihapus' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
