const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Barang = require('./Barang');

const Peminjaman = sequelize.define('Peminjaman', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  barang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Barang,
      key: 'id',
    },
  },
  nama_peminjam: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nim_nip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jumlah_pinjam: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  tanggal_pinjam: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  tanggal_rencana_kembali: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  tanggal_kembali_aktual: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Dipinjam', 'Dikembalikan', 'Terlambat'),
    allowNull: false,
    defaultValue: 'Dipinjam',
  },
  catatan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'peminjaman',
  timestamps: true,
});

// Relasi: satu Barang bisa punya banyak Peminjaman
Barang.hasMany(Peminjaman, { foreignKey: 'barang_id', onDelete: 'CASCADE' });
Peminjaman.belongsTo(Barang, { foreignKey: 'barang_id' });

module.exports = Peminjaman;
