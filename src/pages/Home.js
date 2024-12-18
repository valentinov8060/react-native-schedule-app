import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Button } from 'react-native';

import { 
  getSchedulesOnFirstLoad,
  schedulesPage,
  getSchedulesFromServerButton,
  nextPageScheduleButton,
  previousPageScheduleButton
} from '../services/Home-services';

const Home = () => {
  // schedules
  const [schedules, setSchedules] = useState([]);
  /* dapat diubah untuk mengatur jumlah schedule yang muncul pada setiap page nya */
  const [schedulePerPage] = useState(10);
  const [schedulesToShow, setSchedulesToShow] = useState([]);
  const [page, setPage] = useState(1);
  const [amountPage, setAmountPage] = useState(1);
  const [getSchedulesErrorMessage, setGetSchedulesErrorMessage] = useState('');

  useEffect(() => {
    getSchedulesOnFirstLoad(setSchedules);
  }, []);

  useEffect(() => {
    if (schedules.length == 0){
      return
    }
    setSchedulesToShow(schedulesPage(schedules, page, schedulePerPage));
  }, [schedules, page]);

  const schedulesView = () => {
    const schedulesNotAvailable = (
      <Text style={styles.noSchedule}>
        Tidak ada jadwal
      </Text>
    )
    const schedulesAvailable = (
      <View style={styles.schedule}> 
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
              title="<="
              onPress={() => previousPageScheduleButton(setPage, page)}
            />
            <Text style={styles.paginationNumber}>{page}</Text>
            <Button 
              title="=>"
              onPress={() => nextPageScheduleButton(setAmountPage, amountPage, setPage, page, schedules, schedulePerPage)}
            />
          </View>
      </View>
    )

    return (
      <View style={styles.content}>
        <Button
          title="Get schedules from server"
          onPress={() => getSchedulesFromServerButton(setSchedules, setGetSchedulesErrorMessage)}
        />
        {schedules.length == 0 ? schedulesNotAvailable : schedulesAvailable}
        {Boolean(getSchedulesErrorMessage) && <Text style={styles.errorText}>{getSchedulesErrorMessage}</Text>}
      </View>
    )
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.titleHeader}>
          Jadwal Kuliah
        </Text>
      </View>

      {schedulesView()}
    </View>
  );
};
export default Home;

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
  titleHeader: {
    color: 'black',
    padding: 5,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 28,
  }, 
  // content
  content: {
    flex: 1,
  },
  // schedules content
  schedule: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
  },
  tableContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
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
    flex: 1,
    textAlign: 'center',
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#ddd',
    width: 100,
  },
  // no schedule content
  noSchedule: {
    marginTop: 20,
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
  },
  paginationNumber: {
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  errorText: {
    borderWidth: 1,
    padding: 7,
    borderRadius: 7,
    borderColor: 'red',
    backgroundColor: '#f4cccc',
    color: 'black',
    textAlign: 'center',
  },
});