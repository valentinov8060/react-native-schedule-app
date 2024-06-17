import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Image, Modal, TouchableOpacity, Alert, TextInput, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';

import { 
  checkTokenOnLoad, 
  loginButton,
  logoutButton,
  submitButton,
  getUserSchedules
} from '../controllers/Profile-controller';

const logoUnila = require('../../assets/images/logo-unila.png');

export default Profile = () => {
  const isFocused = useIsFocused();

  // Login 
  const [loginPage, setLoginPage] = useState();
  const [reqBodyLogin, setReqBodyLogin] = useState({
    user: '',
    password: ''
  });
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  // Input jadwal modal
  const [modalVisible, setModalVisible] = useState(false);
  const [reqBodyScheduleCreate, setReqBodyScheduleCreate] = useState({
    mata_kuliah: '',
    nama_kelas: '',
    sks: '',
    hari: '',
    jam_mulai: '',
    jam_selesai: '',
    ruangan: ''
  });
  const [selectedHourJamMulai, setSelectedHourJamMulai] = useState('00');
  const [selectedMinuteJamMulai, setSelectedMinuteJamMulai] = useState('00');
  const [selectedHourJamSelesai, setSelectedHourJamSelesai] = useState('00');
  const [selectedMinuteJamSelesai, setSelectedMinuteJamSelesai] = useState('00');
  const hours = Array.from({ length: 12 }, (_, i) => (i + 7).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  // User schedules
  const [userSchedules, setUserSchedules] = useState([]);

  // Function
  const handleInput = (setter, name, value) => {
    setter(prevValue => ({
      ...prevValue,
      [name]: value
    }));
  };

  // useEffect
  useEffect(() => {
    checkTokenOnLoad(setLoginPage);
    
    if (loginPage === false) {
      getUserSchedules(setUserSchedules);
    }
  },[isFocused]);

  useEffect(() => {
    if (modalVisible === true) {
      if (selectedHourJamMulai > selectedHourJamSelesai || (selectedHourJamMulai === selectedHourJamSelesai && selectedMinuteJamMulai > selectedMinuteJamSelesai) || (selectedHourJamMulai === selectedHourJamSelesai && selectedMinuteJamMulai === selectedMinuteJamSelesai)) {
        Alert.alert('Error', 'Jam mulai harus lebih kecil dari jam selesai');
        return;
      } 
      handleInput(setReqBodyScheduleCreate, 'jam_mulai', `${selectedHourJamMulai}${selectedMinuteJamMulai}00`);
      handleInput(setReqBodyScheduleCreate, 'jam_selesai', `${selectedHourJamSelesai}${selectedMinuteJamSelesai}00`);
    }
  }, [selectedHourJamMulai, selectedMinuteJamMulai, selectedHourJamSelesai, selectedMinuteJamSelesai]);

  // Page view
  const userSchedulesView = () => {
    const userSchedulesNotAvailable = (
      <Text style={styles.noSchedule}>
        Tidak ada jadwal
      </Text>
    )
    const userSchedulesAvailable = (
      <View style={styles.schedule}> 
        <ScrollView Vertical>

          <ScrollView horizontal>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>Mata Kuliah</Text>
                <Text style={styles.tableHeaderCell}>Kelas</Text>
                <Text style={styles.tableHeaderCell}>SKS</Text>
                <Text style={styles.tableHeaderCell}>Hari</Text>
                <Text style={styles.tableHeaderCell}>Jam</Text>
                <Text style={styles.tableHeaderCell}>Ruangan</Text>
                <Text style={styles.tableHeaderCell}>Tools</Text>
              </View>
              <FlatList
                data={userSchedules}
                renderItem={({ item }) => (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.mata_kuliah}</Text>
                    <Text style={styles.tableCell}>{item.nama_kelas}</Text>
                    <Text style={styles.tableCell}>{item.sks}</Text>
                    <Text style={styles.tableCell}>{item.hari}</Text>
                    <Text style={styles.tableCell}>{item.jam_mulai + " - " + item.jam_selesai}</Text>
                    <Text style={styles.tableCell}>{item.ruangan}</Text>
                    <Text style={styles.tableCell}>Tombol Delete</Text>
                  </View>
                )}
                keyExtractor={item => item.nama_kelas}
              />
            </View>
          </ScrollView>

        </ScrollView>
      </View>
    )

    return (
      <View style={styles.content}>
        {userSchedules.length == 0 ? userSchedulesNotAvailable : userSchedulesAvailable}
      </View>
    )
  };

  const pageView = () => {
    if (loginPage === true) {
      return (
        // Login page
        <View style={styles.loginPage}>
          <Image
            source={logoUnila}
            style={styles.logo}
          />
          
          <View style={styles.inputContainer}>
            <Icon name="person" type="material" size={24} style={styles.icon} />
            <TextInput
              style={styles.textInput}
              placeholder="User"
              value={reqBodyLogin.user}
              onChangeText={(value) => handleInput(setReqBodyLogin, 'user', value)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" type="material" size={24} style={styles.icon} />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              value={reqBodyLogin.password}
              onChangeText={(value) => handleInput(setReqBodyLogin, 'password', value)}
              secureTextEntry={true}
            />
          </View>

          <Button 
            title="Login" 
            onPress={() => loginButton(reqBodyLogin, setLoginPage, setLoginErrorMessage)}
          />
          {loginErrorMessage && <Text style={styles.errorText}>{loginErrorMessage}</Text>}
        </View>
      )
    } else if (loginPage === false) {
      return (
        // Profile page
        <View style={styles.profilePage}>
          <Text style={styles.titleHeader}>
            Jadwal Kuliah Anda
          </Text>
          <View style={styles.buttonHeader}>
            <Button 
              color="#00ff7f"
              title="Input Jadwal" 
              onPress={() => setModalVisible(true)}
            />
            <Button 
              color="red"
              title="Logout" 
              onPress={() => logoutButton(setLoginPage)} 
            />
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <ScrollView contentContainerStyle={styles.modalScrollView}>
                  <Text style={styles.modalText}>Form Jadwal Kuliah</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Mata Kuliah"
                    value={reqBodyScheduleCreate.mata_kuliah}
                    onChangeText={(value) => handleInput(setReqBodyScheduleCreate, 'mata_kuliah', value)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Nama Kelas"
                    value={reqBodyScheduleCreate.nama_kelas}
                    onChangeText={(value) => handleInput(setReqBodyScheduleCreate, 'nama_kelas', value)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="SKS"
                    value={reqBodyScheduleCreate.sks}
                    keyboardType="numeric"
                    onChangeText={(value) => handleInput(setReqBodyScheduleCreate, 'sks', value)}
                  />
                  <Text>
                    {'Pilih Hari : '}
                  </Text>
                  <Picker
                    mode="dropdown"
                    selectedValue={reqBodyScheduleCreate.hari}
                    style={styles.input}
                    onValueChange={(itemValue, itemIndex) =>
                      handleInput(setReqBodyScheduleCreate, 'hari', itemValue)
                    }
                  >
                    <Picker.Item label="Senin" value="Senin" />
                    <Picker.Item label="Selasa" value="Selasa" />
                    <Picker.Item label="Rabu" value="Rabu" />
                    <Picker.Item label="Kamis" value="Kamis" />
                    <Picker.Item label="Jumat" value="Jumat" />
                    <Picker.Item label="Sabtu" value="Sabtu" />
                  </Picker>
                  <Text>Jam Mulai : {`${selectedHourJamMulai}:${selectedMinuteJamMulai}`}</Text>
                  <View style={styles.pickerJamContainer}>
                    <Picker
                      selectedValue={selectedHourJamMulai}
                      style={styles.jamPicker}
                      onValueChange={(itemValue) => setSelectedHourJamMulai(itemValue)}
                    >
                      {hours.map((hour) => (
                        <Picker.Item key={hour} label={hour} value={hour} />
                      ))}
                    </Picker>
                    <Text style={styles.separatorJam}>:</Text>
                    <Picker
                      selectedValue={selectedMinuteJamMulai}
                      style={styles.jamPicker}
                      onValueChange={(itemValue) => setSelectedMinuteJamMulai(itemValue)}
                    >
                      {minutes.map((minute) => (
                        <Picker.Item key={minute} label={minute} value={minute} />
                      ))}
                    </Picker>
                  </View>
                  <Text>Jam Selesai : {`${selectedHourJamSelesai}:${selectedMinuteJamSelesai}`}</Text>
                  <View style={styles.pickerJamContainer}>
                    <Picker
                      selectedValue={selectedHourJamSelesai}
                      style={styles.jamPicker}
                      onValueChange={(itemValue) => setSelectedHourJamSelesai(itemValue)}
                    >
                      {hours.map((hour) => (
                        <Picker.Item key={hour} label={hour} value={hour} />
                      ))}
                    </Picker>
                    <Text style={styles.separatorJam}>:</Text>
                    <Picker
                      selectedValue={selectedMinuteJamSelesai}
                      style={styles.jamPicker}
                      onValueChange={(itemValue) => setSelectedMinuteJamSelesai(itemValue)}
                    >
                      {minutes.map((minute) => (
                        <Picker.Item key={minute} label={minute} value={minute} />
                      ))}
                    </Picker>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Ruangan"
                    value={reqBodyScheduleCreate.ruangan}
                    onChangeText={(value) => handleInput(setReqBodyScheduleCreate, 'ruangan', value)}
                  />

                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonSubmit]}
                      onPress={() => submitButton(reqBodyScheduleCreate, setModalVisible)}
                    >
                      <Text style={styles.textStyle}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonCancel]}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.textStyle}>Cancel</Text>
                    </TouchableOpacity>
                  </View>

                </ScrollView>
              </View>
            </View>
          </Modal>

          {userSchedulesView()}
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      {pageView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  // page
  loginPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePage: {
    flex: 1,
  },
  // login page
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  errorText: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'red',
    backgroundColor: '#f4cccc',
    color: 'black',
    textAlign: 'center',
  },
  // profile page
  titleHeader: {
    color: 'black',
    padding: 5,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 28,
  },
  buttonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  // modal input jadwal kuliah
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalScrollView: {
    flexGrow: 1,
  },
  modalButtonContainer: {
    minWidth: 150, 
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  modalButtonSubmit: {
    backgroundColor: '#2196F3',
  },
  modalButtonCancel: {
    backgroundColor: 'red',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: 250,
  },
  // jam input modal
  pickerJamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jamPicker: {
    height: 50,
    width: 100,
  },
  separatorJam: {
    fontSize: 24,
    marginHorizontal: 5,
  },

  // content
  content: {
    flex: 1,
  },
  // schedules content
  schedule: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    minWidth: 700,
    height: 550,
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
});