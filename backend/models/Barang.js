const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Barang = sequelize.define('Barang', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  kode_barang: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nama_barang: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kategori: {
    type: DataTypes.ENUM('Elektronik', 'Alat Ukur', 'Peralatan Praktikum', 'Komputer', 'Lainnya'),
    allowNull: false,
    defaultValue: 'Lainnya',
  },
  kondisi: {
    type: DataTypes.ENUM('Baik', 'Rusak Ringan', 'Rusak Berat'),
    allowNull: false,
    defaultValue: 'Baik',
  },
  stok_total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  stok_tersedia: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  lokasi_rak: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'barang',
  timestamps: true,
});

module.exports = Barang;
