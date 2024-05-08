// React Native
import React, { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, FlatList, View } from 'react-native';

// React Native Paper 
import { DataTable, Text, PaperProvider } from 'react-native-paper';

import {API_URL, API_KEY} from '@env'


export default function App() {

  const [isLoading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);

  const getSchedules = async () => {
    try {
      const response = await fetch('http://192.168.1.36:3000/schedule/list?page=1');
      const json = await response.json();
      setSchedules(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSchedules();
  }, []);
  return (
    <PaperProvider> 
      <View style={styles.container}>
        <Text>
          {JSON.stringify(schedules.schedules)}
        </Text>

        <Text>React Native Paper</Text>
        <Text>Logo UNILA</Text>
        <Text>API: {API_URL}</Text>
      </View>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

