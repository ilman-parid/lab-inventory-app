import React, { useEffect, useState } from 'react';
import { Package, ClipboardList, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import Badge from '../components/Badge';

export default function Dashboard() {
  const [barang, setBarang] = useState([]);
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [resBarang, resPeminjaman] = await Promise.all([
          api.get('/barang'),
          api.get('/peminjaman'),
        ]);
        setBarang(resBarang.data.data);
        setPeminjaman(resPeminjaman.data.data);
      } catch (err) {
        setError('Gagal memuat data. Pastikan backend berjalan.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalStok = barang.reduce((sum, b) => sum + b.stok_total, 0);
  const totalTersedia = barang.reduce((sum, b) => sum + b.stok_tersedia, 0);
  const sedangDipinjam = peminjaman.filter((p) => p.status === 'Dipinjam').length;
  const terlambat = peminjaman.filter((p) => {
    if (p.status !== 'Dipinjam') return false;
    return new Date(p.tanggal_rencana_kembali) < new Date();
  }).length;

  const stats = [
    { label: 'Jenis Barang', value: barang.length, icon: Package, color: 'bg-primary-50 text-primary-600' },
    { label: 'Total Unit Barang', value: totalStok, icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
    { label: 'Sedang Dipinjam', value: sedangDipinjam, icon: ClipboardList, color: 'bg-blue-50 text-blue-600' },
    { label: 'Berpotensi Terlambat', value: terlambat, icon: AlertCircle, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Ringkasan inventaris dan aktivitas peminjaman laboratorium.</p>
      </div>

      {error && <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{loading ? '...' : value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Aktivitas Peminjaman Terbaru</h2>
        {loading ? (
          <p className="text-sm text-slate-400">Memuat data...</p>
        ) : peminjaman.length === 0 ? (
          <p className="text-sm text-slate-400">Belum ada data peminjaman.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="pb-2 font-medium">Peminjam</th>
                <th className="pb-2 font-medium">Barang</th>
                <th className="pb-2 font-medium">Tgl Pinjam</th>
                <th className="pb-2 font-medium">Rencana Kembali</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {peminjaman.slice(0, 5).map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5 font-medium text-slate-700">{p.nama_peminjam}</td>
                  <td className="py-2.5 text-slate-500">{p.Barang?.nama_barang}</td>
                  <td className="py-2.5 text-slate-500">{p.tanggal_pinjam}</td>
                  <td className="py-2.5 text-slate-500">{p.tanggal_rencana_kembali}</td>
                  <td className="py-2.5"><Badge value={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
