const dataDummy = [
  { id_mata_kuliah : "2cd28e07-1e80-468e-ac06-623e94dabf55", mata_kuliah: 'Metodologi Penelitian', nama_kelas: 'A', sks: 3, hari: 'Senin', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 101', user: '2115061073' },
  { id_mata_kuliah : "2cd28e07-1e80-468e-ac06-623e94dabf55", mata_kuliah: 'Sistem Informasi Geografis', nama_kelas: 'B', sks: 3, hari: 'Selasa', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 102', user: '2115061073' },
  { id_mata_kuliah : "2cd28e07-1e80-468e-ac06-623e94dabf55", mata_kuliah: 'Komputasi Awan', nama_kelas: 'C', sks: 2, hari: 'Rabu', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 103', user: '2115061073' },
  { id_mata_kuliah : "2cd28e07-1e80-468e-ac06-623e94dabf55", mata_kuliah: 'Software Development', nama_kelas: 'A', sks: 3, hari: 'Kamis', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 104', user: '2115061073' },
  { id_mata_kuliah : "2cd28e07-1e80-468e-ac06-623e94dabf55", mata_kuliah: 'Software Testing and Quality Assurance', nama_kelas: 'B', sks: 3, hari: 'Jumat', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 105', user: '2115061073' },
  { id_mata_kuliah : "2cd28e07-1e80-468e-ac06-623e94dabf55", mata_kuliah: 'Augmented Reality', nama_kelas: 'C', sks: 2, hari: 'Senin', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 106', user: '2115061073' },
  { id_mata_kuliah : "2cd28e07-1e80-468e-ac06-623e94dabf55", mata_kuliah: 'Virtual Reality', nama_kelas: 'A', sks: 2, hari: 'Selasa', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 107', user: '2115061073' },
  { id_mata_kuliah : "2cd28e07-1e80-468e-ac06-623e94dabf55", mata_kuliah: 'KKN', nama_kelas: 'B', sks: 1, hari: 'Rabu', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 108', user: '2115061073' },
  { id_mata_kuliah : "2cd28e07-1e80-468e-ac06-623e94dabf55", mata_kuliah: 'Jaringan Komputer', nama_kelas: 'C', sks: 3, hari: 'Kamis', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 201', user: '2115061073' },
  { id_mata_kuliah : "2cd28e07-1e80-468e-ac06-623e94dabf55", mata_kuliah: 'Basis Data', nama_kelas: 'A', sks: 3, hari: 'Jumat', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 202', user: '2115061073' },
  { id_mata_kuliah : "2cd28e07-1e80-468e-ac06-623e94dabf55", mata_kuliah: 'Pemrograman Web', nama_kelas: 'B', sks: 3, hari: 'Senin', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 203', user: '2115061073' },
  { id_mata_kuliah : "2cd28e07-1e80-468e-ac06-623e94dabf55", mata_kuliah: 'Sistem Keamanan Informasi', nama_kelas: 'C', sks: 2, hari: 'Selasa', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 204', user: '2115061073' },
  { id_mata_kuliah : "2cd28e07-1e80-468e-ac06-623e94dabf55", mata_kuliah: 'Manajemen Proyek TI', nama_kelas: 'A', sks: 3, hari: 'Rabu', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 205', user: '2115061073' },
  { id_mata_kuliah : "2cd28e07-1e80-468e-ac06-623e94dabf55", mata_kuliah: 'Interaksi Manusia dan Komputer', nama_kelas: 'B', sks: 3, hari: 'Kamis', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 206', user: '2115061073' },
  { id_mata_kuliah : "2cd28e07-1e80-468e-ac06-623e94dabf55", mata_kuliah: 'Etika Profesi TI', nama_kelas: 'C', sks: 2, hari: 'Jumat', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 207', user: '2115061073' },
]
dataDummy.forEach(e => {
  e.jam_mulai = e.jam_mulai.substring(0, 2) + ':' + e.jam_mulai.substring(2, 4);
  e.jam_selesai = e.jam_selesai.substring(0, 2) + ':' + e.jam_selesai.substring(2, 4);
})

export default dataDummy