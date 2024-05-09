import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from 'react-native';

// React Native Paper 
import { DataTable, Text, PaperProvider } from 'react-native-paper';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState(null);

  const getSchedules = async () => {
    try {
      const response = await fetch('http://192.168.50.196:3000/schedule/list');
      const json = await response.json();
      setSchedules(json.data); // Set the actual data object
    } catch (error) {
      console.error(error);
      setError(error); // Store the error for handling
    } finally {
      setLoading(false); // Always set loading to false after fetching
    }
  };

  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 20, 30]);
  const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, schedules.length);

  useEffect(() => {
    getSchedules();
    setPage(0);
  }, [itemsPerPage]);

  return (
    <PaperProvider>
      {loading ? (
        <ActivityIndicator size="large" style={styles.loading} />
      ) : error ? (
        <Text style={styles.error}>Error fetching schedules: {error.message}</Text>
      ) : (
        <DataTable>
          <DataTable.Header key={schedules.length}>
            <DataTable.Title>Mata Kuliah</DataTable.Title>
            <DataTable.Title>Nama Kelas</DataTable.Title>
            <DataTable.Title>SKS</DataTable.Title>
            <DataTable.Title>Hari</DataTable.Title>
            <DataTable.Title>Jam</DataTable.Title>
            <DataTable.Title>Ruangan</DataTable.Title>
          </DataTable.Header>

          {schedules.slice(from, to).map((item) => (
            <DataTable.Row key={item.key}>
              <DataTable.Cell>{item.mata_kuliah}</DataTable.Cell>
              <DataTable.Cell>{item.nama_kelas}</DataTable.Cell>
              <DataTable.Cell>{item.sks}</DataTable.Cell>
              <DataTable.Cell>{item.hari}</DataTable.Cell>
              <DataTable.Cell>{item.jam_mulai + " - " + item.jam_selesai}</DataTable.Cell>
              <DataTable.Cell>{item.ruangan}</DataTable.Cell>
            </DataTable.Row>
          ))}

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(schedules.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            showFastPaginationControls
            selectPageDropdownLabel={'Baris per halaman'}
          />
        </DataTable>
      )}
    </PaperProvider>
  );
}

const styles = StyleSheet.
create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});