const sequelize = require('../config/db');
const Barang = require('./Barang');
const Peminjaman = require('./Peminjaman');

module.exports = {
  sequelize,
  Barang,
  Peminjaman,
};
