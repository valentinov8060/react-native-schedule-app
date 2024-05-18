import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Button, Alert } from 'react-native';

export default Home = () => {
  const [schedules, setSchedules] = useState([]);
  const [page, setPage] = useState(1);
  const [schedulePerPage] = useState(10);
  const [amountPage, setAmountPage] = useState(Math.ceil(schedules.length / schedulePerPage));
  const [schedulesToShow, setSchedulesToShow] = useState([]);

  const getSchedules = async () => {
    try {
      const response = await fetch('http://192.168.1.10:3000/schedule/list');
      const json = await response.json();
      setSchedules(json.data);
    } catch (error) {
      console.error(error);
    }
  };

  const schedulesPage = (schedules, page, schedulePerPage) => {
    if (page <= 0 || Math.ceil(schedules.length / schedulePerPage) < page) {
      console.error("Invalid page number lol");
      return;
    }
    const startIndex = (page - 1) * schedulePerPage;
    return schedules.slice(startIndex, startIndex + schedulePerPage);
  }
  
  const nextPage = () => {
    if (page == amountPage) {
      return;
    }
    setPage(page => page + 1);
  }

  const previousPage = () => {
    if (page == 1) {
      return;
    }
    setPage(page => page - 1);
  }

  useEffect(() => {
    if (schedules.length == 0){
      return
    }
    setSchedulesToShow(schedulesPage(schedules, page, schedulePerPage));
  }, [schedules, page]);

  const renderSchedulesContent = () => {
    if (schedulesToShow.length == 0) {
      return (
        <Text style={styles.alertNoSchedule}>
          Jadwal tidak tersedia
        </Text>
      )
    } else if (schedulesToShow.length > 0) {
      return (
        <View style={styles.schedulesContent}> 
          <ScrollView horizontal>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>Mata Kuliah</Text>
                <Text style={styles.tableHeaderCell}>Kelas</Text>
                <Text style={styles.tableHeaderCell}>SKS</Text>
                <Text style={styles.tableHeaderCell}>Hari</Text>
                <Text style={styles.tableHeaderCell}>Jam</Text>
                <Text style={styles.tableHeaderCell}>Ruangan</Text>
              </View>

              <FlatList
                data={schedulesToShow}
                renderItem={({ item }) => (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.mata_kuliah}</Text>
                    <Text style={styles.tableCell}>{item.nama_kelas}</Text>
                    <Text style={styles.tableCell}>{item.sks}</Text>
                    <Text style={styles.tableCell}>{item.hari}</Text>
                    <Text style={styles.tableCell}>{item.jam_mulai + " - " + item.jam_selesai}</Text>
                    <Text style={styles.tableCell}>{item.ruangan}</Text>
                  </View>
                )}
                keyExtractor={item => item.nama_kelas}
              />
            </View>
          </ScrollView>

          <View style={styles.paginationContainer}>
            <Button 
              style={styles.paginationButton} 
              title="<="
              onPress={() => previousPage()}
            />
            <Text style={styles.paginationButton}>{page}</Text>
            <Button 
              style={styles.paginationButton} 
              title="=>"
              onPress={() => nextPage()}
            />
          </View>
        </View>
      )
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Jadwal Kuliah
        </Text>

        <Button
          title="Refresh"
          onPress={() => getSchedules()}
        />
      </View>
      {renderSchedulesContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  // header
  header: {
    marginBottom: 15,
  },
  title: {
    color: 'black',
    padding: 5,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 28,
  }, 
  // schedules content
  schedulesContent: {
    flex: 1,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    minWidth: 700,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    padding: 10,
    flex: 1,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#ddd',
    width: 100,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tableCell: {
    padding: 10,
    flex: 1,
    textAlign: 'center',
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#ddd',
    width: 100,
  },

  // no schedule
  alertNoSchedule: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'red',
    backgroundColor: '#f4cccc',
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },

  // button pagination
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  paginationButton: {
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
});
