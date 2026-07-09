import React from 'react';

const colorMap = {
  Baik: 'bg-green-50 text-green-700',
  'Rusak Ringan': 'bg-amber-50 text-amber-700',
  'Rusak Berat': 'bg-red-50 text-red-700',
  Dipinjam: 'bg-blue-50 text-blue-700',
  Dikembalikan: 'bg-green-50 text-green-700',
  Terlambat: 'bg-red-50 text-red-700',
};

export default function Badge({ value }) {
  const classes = colorMap[value] || 'bg-slate-100 text-slate-600';
  return <span className={`badge ${classes}`}>{value}</span>;
}
