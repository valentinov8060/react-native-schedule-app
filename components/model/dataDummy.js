const data = [
  { key: '1', mata_kuliah: 'Metodologi Penelitian', nama_kelas: 'A', sks: 3, hari: 'Senin', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 101' },
  { key: '2', mata_kuliah: 'Sistem Informasi Geografis', nama_kelas: 'B', sks: 3, hari: 'Selasa', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 102' },
  { key: '3', mata_kuliah: 'Komputasi Awan', nama_kelas: 'C', sks: 2, hari: 'Rabu', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 103' },
  { key: '4', mata_kuliah: 'Software Development', nama_kelas: 'A', sks: 3, hari: 'Kamis', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 104' },
  { key: '5', mata_kuliah: 'Software Testing and Quality Assurance', nama_kelas: 'B', sks: 3, hari: 'Jumat', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 105' },
  { key: '6', mata_kuliah: 'Augmented Reality', nama_kelas: 'C', sks: 2, hari: 'Senin', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 106' },
  { key: '7', mata_kuliah: 'Virtual Reality', nama_kelas: 'A', sks: 2, hari: 'Selasa', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 107' },
  { key: '8', mata_kuliah: 'KKN', nama_kelas: 'B', sks: 1, hari: 'Rabu', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 108' },
  { key: '9', mata_kuliah: 'Jaringan Komputer', nama_kelas: 'C', sks: 3, hari: 'Kamis', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 201' },
  { key: '10', mata_kuliah: 'Basis Data', nama_kelas: 'A', sks: 3, hari: 'Jumat', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 202' },
  { key: '11', mata_kuliah: 'Pemrograman Web', nama_kelas: 'B', sks: 3, hari: 'Senin', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 203' },
  { key: '12', mata_kuliah: 'Sistem Keamanan Informasi', nama_kelas: 'C', sks: 2, hari: 'Selasa', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 204' },
  { key: '13', mata_kuliah: 'Manajemen Proyek TI', nama_kelas: 'A', sks: 3, hari: 'Rabu', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 205' },
  { key: '14', mata_kuliah: 'Interaksi Manusia dan Komputer', nama_kelas: 'B', sks: 3, hari: 'Kamis', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 206' },
  { key: '15', mata_kuliah: 'Etika Profesi TI', nama_kelas: 'C', sks: 2, hari: 'Jumat', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 207' },
]
data.forEach(e => {
  e.jam_mulai = e.jam_mulai.substring(0, 2) + ':' + e.jam_mulai.substring(2, 4);
  e.jam_selesai = e.jam_selesai.substring(0, 2) + ':' + e.jam_selesai.substring(2, 4);
})

export default data