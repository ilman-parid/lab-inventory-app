import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BarangPage from './pages/BarangPage';
import PeminjamanPage from './pages/PeminjamanPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/barang" element={<BarangPage />} />
        <Route path="/peminjaman" element={<PeminjamanPage />} />
      </Routes>
    </Layout>
  );
}
