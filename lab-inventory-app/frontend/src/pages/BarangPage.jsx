import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';
import api from '../api/axios';
import Badge from '../components/Badge';
import ConfirmModal from '../components/ConfirmModal';

const emptyForm = {
  kode_barang: '',
  nama_barang: '',
  kategori: 'Lainnya',
  kondisi: 'Baik',
  stok_total: 1,
  deskripsi: '',
  lokasi_rak: '',
};

const kategoriOptions = ['Elektronik', 'Alat Ukur', 'Peralatan Praktikum', 'Komputer', 'Lainnya'];
const kondisiOptions = ['Baik', 'Rusak Ringan', 'Rusak Berat'];

export default function BarangPage() {
  const [list, setList] = useState([]);
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
      const res = await api.get('/barang');
      setList(res.data.data);
    } catch (err) {
      setError('Gagal memuat data barang.');
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
      kode_barang: item.kode_barang,
      nama_barang: item.nama_barang,
      kategori: item.kategori,
      kondisi: item.kondisi,
      stok_total: item.stok_total,
      deskripsi: item.deskripsi || '',
      lokasi_rak: item.lokasi_rak || '',
    });
    setEditingId(item.id);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/barang/${editingId}`, form);
      } else {
        await api.post('/barang', form);
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data.');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/barang/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus data.');
      setDeleteTarget(null);
    }
  };

  const filtered = list.filter(
    (b) =>
      b.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
      b.kode_barang.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventaris Barang</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola data barang laboratorium.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Tambah Barang
        </button>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}

      <div className="card p-4 mb-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="input pl-9"
            placeholder="Cari nama atau kode barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr className="text-left">
              <th className="px-5 py-3 font-medium">Kode</th>
              <th className="px-5 py-3 font-medium">Nama Barang</th>
              <th className="px-5 py-3 font-medium">Kategori</th>
              <th className="px-5 py-3 font-medium">Kondisi</th>
              <th className="px-5 py-3 font-medium">Stok</th>
              <th className="px-5 py-3 font-medium">Lokasi</th>
              <th className="px-5 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="px-5 py-8 text-center text-slate-400">Memuat data...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="7" className="px-5 py-8 text-center text-slate-400">Tidak ada data barang.</td></tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="border-t border-slate-50 hover:bg-slate-50/60">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{item.kode_barang}</td>
                  <td className="px-5 py-3 font-medium text-slate-700">{item.nama_barang}</td>
                  <td className="px-5 py-3 text-slate-500">{item.kategori}</td>
                  <td className="px-5 py-3"><Badge value={item.kondisi} /></td>
                  <td className="px-5 py-3 text-slate-600">
                    <span className="font-semibold">{item.stok_tersedia}</span> / {item.stok_total}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{item.lokasi_rak || '-'}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
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
              {editingId ? 'Edit Barang' : 'Tambah Barang Baru'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Kode Barang</label>
                  <input required className="input" value={form.kode_barang}
                    onChange={(e) => setForm({ ...form, kode_barang: e.target.value })} />
                </div>
                <div>
                  <label className="label">Stok Total</label>
                  <input required type="number" min="1" className="input" value={form.stok_total}
                    onChange={(e) => setForm({ ...form, stok_total: parseInt(e.target.value) || 1 })} />
                </div>
              </div>
              <div>
                <label className="label">Nama Barang</label>
                <input required className="input" value={form.nama_barang}
                  onChange={(e) => setForm({ ...form, nama_barang: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Kategori</label>
                  <select className="input" value={form.kategori}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
                    {kategoriOptions.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Kondisi</label>
                  <select className="input" value={form.kondisi}
                    onChange={(e) => setForm({ ...form, kondisi: e.target.value })}>
                    {kondisiOptions.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Lokasi Rak</label>
                <input className="input" value={form.lokasi_rak}
                  onChange={(e) => setForm({ ...form, lokasi_rak: e.target.value })} />
              </div>
              <div>
                <label className="label">Deskripsi</label>
                <textarea className="input" rows="3" value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
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
        title="Hapus Barang"
        message={`Yakin ingin menghapus "${deleteTarget?.nama_barang}"? Semua riwayat peminjaman terkait juga akan terhapus.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
