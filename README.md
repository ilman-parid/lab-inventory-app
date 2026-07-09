# SIPINJAM — Sistem Peminjaman Inventaris Laboratorium

## 📋 Deskripsi

SIPINJAM adalah aplikasi web full-stack untuk mengelola **inventaris barang laboratorium** dan **transaksi peminjamannya**. Aplikasi ini dibuat untuk memenuhi tugas UAS Pemograman Web 2, dengan tema **Sistem Manajemen Informasi**.

Aplikasi memiliki dua rumpun fitur CRUD yang saling berelasi:

1. **CRUD Barang** — mengelola data inventaris (kode barang, nama, kategori, kondisi, stok, lokasi rak).
2. **CRUD Peminjaman** — mengelola transaksi peminjaman barang oleh mahasiswa/staf, termasuk proses pengembalian. Setiap peminjaman terhubung ke satu barang (relasi `1 Barang : N Peminjaman`), dan stok barang otomatis berkurang/bertambah sesuai status peminjaman.

### Fitur Utama
- Dashboard ringkasan (jumlah jenis barang, unit tersedia, sedang dipinjam, berpotensi terlambat).
- CRUD Barang lengkap (tambah, lihat, ubah, hapus) dengan pencarian.
- CRUD Peminjaman lengkap, termasuk aksi cepat "Tandai Dikembalikan" yang otomatis mengembalikan stok barang.
- Validasi stok: barang yang stoknya habis tidak bisa dipinjam.
- Tampilan responsif dan modern menggunakan Tailwind CSS.

### Tech Stack
| Layer     | Teknologi                                   |
|-----------|----------------------------------------------|
| Frontend  | React 18, Vite, React Router, Tailwind CSS, Axios, Lucide Icons |
| Backend   | Node.js, Express.js, Sequelize ORM           |
| Database  | MySQL                                        |

### Struktur Folder

```
lab-inventory-app/
├── backend/
│   ├── config/db.js            # Koneksi Sequelize ke MySQL
│   ├── models/                 # Model Barang & Peminjaman + relasi
│   ├── controllers/            # Logika CRUD & bisnis stok
│   ├── routes/                 # Endpoint REST API
│   ├── seed.js                 # Script data contoh
│   └── server.js               # Entry point Express
└── frontend/
    ├── src/
    │   ├── api/axios.js         # Konfigurasi HTTP client
    │   ├── components/         # Layout, Badge, Modal
    │   ├── pages/               # Dashboard, Barang, Peminjaman
    │   └── App.jsx
    └── index.html
```

---

## 🚀 Panduan Menjalankan di Lokal

### Prasyarat
- Node.js v18+ dan npm
- MySQL Server (lokal atau melalui XAMPP/Laragon/Docker)

### 1. Clone Repository
```bash
git clone <url-repo-anda>
cd lab-inventory-app
```

### 2. Setup Database
Buat database baru di MySQL:
```sql
CREATE DATABASE lab_inventory;
```

### 3. Menjalankan Backend
```bash
cd backend
npm install
cp .env.example .env
```
Edit file `.env` sesuai kredensial MySQL Anda:
```
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=lab_inventory
DB_USER=root
DB_PASS=isi_password_anda
```

Isi database dengan data contoh (opsional tapi disarankan):
```bash
npm run seed
```

Jalankan server backend:
```bash
npm run dev
```
Backend akan berjalan di `http://localhost:5000`. Tabel akan otomatis dibuat oleh Sequelize saat server pertama kali dijalankan.

### 4. Menjalankan Frontend
Buka terminal baru:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend akan berjalan di `http://localhost:5173` dan otomatis terhubung ke backend di `http://localhost:5000/api`.

### 5. Akses Aplikasi
Buka browser ke `http://localhost:5173`.

---

## 🔌 Daftar Endpoint API

### Barang
| Method | Endpoint            | Keterangan            |
|--------|----------------------|------------------------|
| GET    | /api/barang           | Ambil semua barang    |
| GET    | /api/barang/:id        | Ambil detail barang + riwayat peminjaman |
| POST   | /api/barang           | Tambah barang baru    |
| PUT    | /api/barang/:id        | Ubah data barang       |
| DELETE | /api/barang/:id        | Hapus barang           |

### Peminjaman
| Method | Endpoint                | Keterangan                          |
|--------|--------------------------|--------------------------------------|
| GET    | /api/peminjaman           | Ambil semua data peminjaman         |
| GET    | /api/peminjaman/:id        | Ambil detail satu peminjaman        |
| POST   | /api/peminjaman           | Buat peminjaman baru (stok berkurang)|
| PUT    | /api/peminjaman/:id        | Ubah data / proses pengembalian (stok bertambah) |
| DELETE | /api/peminjaman/:id        | Hapus data peminjaman (stok dikembalikan jika masih dipinjam) |

---

## 👤 Pembuat
Tugas UAS Mata Kuliah Pemograman Web 2 — Program Studi Teknik Informatika, Universitas Teknologi Bandung.
Dosen Pengampu: Muhammad Reksa Ariansyah, S.Kom., M.Kom.
