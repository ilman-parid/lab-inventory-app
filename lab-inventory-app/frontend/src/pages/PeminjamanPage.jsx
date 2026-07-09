import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Search, RotateCcw } from 'lucide-react';
import api from '../api/axios';
import Badge from '../components/Badge';
import ConfirmModal from '../components/ConfirmModal';

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = {
  barang_id: '',
  nama_peminjam: '',
  nim_nip: '',
  jumlah_pinjam: 1,
  tanggal_pinjam: today(),
  tanggal_rencana_kembali: '',
  catatan: '',
};

export default function PeminjamanPage() {
  const [list, setList] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resPeminjaman, resBarang] = await Promise.all([
        api.get('/peminjaman'),
        api.get('/barang'),
      ]);
      setList(resPeminjaman.data.data);
      setBarangList(resBarang.data.data);
    } catch (err) {
      setError('Gagal memuat data peminjaman.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
  };

  const openEdit = (item) => {
    setForm({
      barang_id: item.barang_id,
      nama_peminjam: item.nama_peminjam,
      nim_nip: item.nim_nip,
      jumlah_pinjam: item.jumlah_pinjam,
      tanggal_pinjam: item.tanggal_pinjam,
      tanggal_rencana_kembali: item.tanggal_rencana_kembali,
      catatan: item.catatan || '',
    });
    setEditingId(item.id);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/peminjaman/${editingId}`, form);
      } else {
        await api.post('/peminjaman', form);
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data.');
    }
  };

  const handleReturn = async (item) => {
    try {
      await api.put(`/peminjaman/${item.id}`, { status: 'Dikembalikan' });
      fetchData();
    } catch (err) {
      setError('Gagal memproses pengembalian.');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/peminjaman/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      setError('Gagal menghapus data.');
      setDeleteTarget(null);
    }
  };

  const filtered = list.filter(
    (p) =>
      p.nama_peminjam.toLowerCase().includes(search.toLowerCase()) ||
      p.Barang?.nama_barang.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Peminjaman</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola transaksi peminjaman barang laboratorium.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Tambah Peminjaman
        </button>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}

      <div className="card p-4 mb-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="input pl-9"
            placeholder="Cari peminjam atau barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr className="text-left">
              <th className="px-5 py-3 font-medium">Peminjam</th>
              <th className="px-5 py-3 font-medium">Barang</th>
              <th className="px-5 py-3 font-medium">Jumlah</th>
              <th className="px-5 py-3 font-medium">Tgl Pinjam</th>
              <th className="px-5 py-3 font-medium">Rencana Kembali</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="px-5 py-8 text-center text-slate-400">Memuat data...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="7" className="px-5 py-8 text-center text-slate-400">Tidak ada data peminjaman.</td></tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="border-t border-slate-50 hover:bg-slate-50/60">
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-700">{item.nama_peminjam}</p>
                    <p className="text-xs text-slate-400">{item.nim_nip}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{item.Barang?.nama_barang || '-'}</td>
                  <td className="px-5 py-3 text-slate-500">{item.jumlah_pinjam}</td>
                  <td className="px-5 py-3 text-slate-500">{item.tanggal_pinjam}</td>
                  <td className="px-5 py-3 text-slate-500">{item.tanggal_rencana_kembali}</td>
                  <td className="px-5 py-3"><Badge value={item.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      {item.status === 'Dipinjam' && (
                        <button onClick={() => handleReturn(item)} title="Tandai Dikembalikan"
                          className="p-2 rounded-lg hover:bg-green-50 text-green-600">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(item)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 px-4">
          <div className="card w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-semibold text-slate-800 mb-4">
              {editingId ? 'Edit Peminjaman' : 'Tambah Peminjaman Baru'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Barang</label>
                <select required className="input" value={form.barang_id} disabled={!!editingId}
                  onChange={(e) => setForm({ ...form, barang_id: e.target.value })}>
                  <option value="">-- Pilih Barang --</option>
                  {barangList.map((b) => (
                    <option key={b.id} value={b.id} disabled={b.stok_tersedia < 1 && !editingId}>
                      {b.nama_barang} (tersedia: {b.stok_tersedia})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Nama Peminjam</label>
                  <input required className="input" value={form.nama_peminjam}
                    onChange={(e) => setForm({ ...form, nama_peminjam: e.target.value })} />
                </div>
                <div>
                  <label className="label">NIM/NIP</label>
                  <input required className="input" value={form.nim_nip}
                    onChange={(e) => setForm({ ...form, nim_nip: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Jumlah Pinjam</label>
                  <input required type="number" min="1" className="input" value={form.jumlah_pinjam}
                    onChange={(e) => setForm({ ...form, jumlah_pinjam: parseInt(e.target.value) || 1 })} />
                </div>
                <div>
                  <label className="label">Tanggal Pinjam</label>
                  <input required type="date" className="input" value={form.tanggal_pinjam}
                    onChange={(e) => setForm({ ...form, tanggal_pinjam: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label">Rencana Tanggal Kembali</label>
                <input required type="date" className="input" value={form.tanggal_rencana_kembali}
                  onChange={(e) => setForm({ ...form, tanggal_rencana_kembali: e.target.value })} />
              </div>
              <div>
                <label className="label">Catatan</label>
                <textarea className="input" rows="2" value={form.catatan}
                  onChange={(e) => setForm({ ...form, catatan: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Batal</button>
                <button type="submit" className="btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus Peminjaman"
        message={`Yakin ingin menghapus data peminjaman oleh "${deleteTarget?.nama_peminjam}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
