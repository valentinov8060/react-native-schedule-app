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
  getUserSchedules,
  deleteButton,
  editButton
} from '../services/Profile-services';
import { handleInput } from '../utils/form';

const logoUnila = require('../../assets/images/logo-unila.png');

const Profile = () => {
  const isFocused = useIsFocused();

  // Login 
  const [loginPage, setLoginPage] = useState();
  const [reqBodyLogin, setReqBodyLogin] = useState({
    user: '',
    password: ''
  });
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  // Input jadwal modal
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [reqBodyScheduleCreate, setReqBodyScheduleCreate] = useState({
    mata_kuliah: '',
    nama_kelas: '',
    sks: '',
    hari: '',
    jam_mulai: '',
    jam_selesai: '',
    ruangan: ''
  });
  const [selectedHourJamMulai, setSelectedHourJamMulai] = useState('07');
  const [selectedMinuteJamMulai, setSelectedMinuteJamMulai] = useState('00');
  const [selectedHourJamSelesai, setSelectedHourJamSelesai] = useState('00');
  const [selectedMinuteJamSelesai, setSelectedMinuteJamSelesai] = useState('00');
  const hours = Array.from({ length: 12 }, (_, i) => (i + 7).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  // Edit jadwal modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [reqBodyScheduleEdit, setReqBodyScheduleEdit] = useState({
    mata_kuliah: '',
    nama_kelas: '',
    sks: '',
    hari: '',
    jam_mulai: '',
    jam_selesai: '',
    ruangan: ''
  });

  // User schedules
  const [userSchedules, setUserSchedules] = useState([]);

  // useEffect
  useEffect(() => {
    checkTokenOnLoad(setLoginPage);
  },[isFocused]);

  useEffect(() => {
    if (loginPage === false) {
      getUserSchedules(setUserSchedules);
      setLoginErrorMessage('');
    }
  }, [loginPage]);

  useEffect(() => {
    if (inputModalVisible === true) {
      if (selectedHourJamMulai > selectedHourJamSelesai || (selectedHourJamMulai === selectedHourJamSelesai && selectedMinuteJamMulai > selectedMinuteJamSelesai) || (selectedHourJamMulai === selectedHourJamSelesai && selectedMinuteJamMulai === selectedMinuteJamSelesai)) {
        Alert.alert('Error', 'Jam mulai harus lebih kecil dari jam selesai');
        return;
      } 
      handleInput(setReqBodyScheduleCreate, 'jam_mulai', `${selectedHourJamMulai}${selectedMinuteJamMulai}00`);
      handleInput(setReqBodyScheduleCreate, 'jam_selesai', `${selectedHourJamSelesai}${selectedMinuteJamSelesai}00`);
    }
    if (editModalVisible === true) {
      if (selectedHourJamMulai > selectedHourJamSelesai || (selectedHourJamMulai === selectedHourJamSelesai && selectedMinuteJamMulai > selectedMinuteJamSelesai) || (selectedHourJamMulai === selectedHourJamSelesai && selectedMinuteJamMulai === selectedMinuteJamSelesai)) {
        Alert.alert('Error', 'Jam mulai harus lebih kecil dari jam selesai');
        return;
      }
      handleInput(setReqBodyScheduleEdit, 'jam_mulai', `${selectedHourJamMulai}${selectedMinuteJamMulai}00`);
      handleInput(setReqBodyScheduleEdit, 'jam_selesai', `${selectedHourJamSelesai}${selectedMinuteJamSelesai}00`);
    }
  }, [selectedHourJamMulai, selectedMinuteJamMulai, selectedHourJamSelesai, selectedMinuteJamSelesai]);

  // Table user schedule view
  const userSchedulesView = () => {
    const userSchedulesNotAvailable = (
      <Text style={styles.noSchedule}>
        Tidak ada jadwal
      </Text>
    )
    const userSchedulesAvailable = (
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
              <Text style={styles.tableHeaderCell}>Edit</Text>
              <Text style={styles.tableHeaderCell}>Remove</Text>
            </View>
            
            <FlatList
              data={userSchedules}
              renderItem={({ item }) => (
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.mata_kuliah}</Text>
                  <Text style={styles.tableCell}>{item.nama_kelas}</Text>
                  <Text style={styles.tableCell}>{item.sks}</Text>
                  <Text style={styles.tableCell}>{item.hari}</Text>
                  <Text style={styles.tableCell}>{`${item.jam_mulai} - ${item.jam_selesai}`}</Text>
                  <Text style={styles.tableCell}>{item.ruangan}</Text>
                  <Text style={styles.tableCell}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditModalVisible(true);
                        setReqBodyScheduleEdit(item); // Set the item to edit
                        setSelectedHourJamMulai(item.jam_mulai.split(":")[0]);
                        setSelectedMinuteJamMulai(item.jam_mulai.split(":")[1]);
                        setSelectedHourJamSelesai(item.jam_selesai.split(":")[0]);
                        setSelectedMinuteJamSelesai(item.jam_selesai.split(":")[1]);
                      }}
                    >
                      <Icon name="edit" type="material" size={24} />
                    </TouchableOpacity>
                  </Text>
                  <Text style={styles.tableCell}>
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert(
                          "Konfirmasi",
                          "Apakah Anda yakin ingin menghapus jadwal ini?",
                          [
                            { text: "Batal", style: "cancel" },
                            { text: "OK", onPress: () => {
                              deleteButton(item.id_mata_kuliah) 
                              getUserSchedules(setUserSchedules)
                            }
                          },
                          ],
                          { cancelable: false }
                        )
                      }
                    >
                      <Icon name="delete" type="material" size={24} />
                    </TouchableOpacity>
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.id_mata_kuliah.toString()}
            />
          </View>
        </ScrollView>

        {/* Modal Edit Schedule */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ScrollView contentContainerStyle={styles.modalScrollView}>
                <Text style={styles.modalText}>Form Edit Jadwal Kuliah</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mata Kuliah"
                  value={reqBodyScheduleEdit.mata_kuliah}
                  onChangeText={(value) => handleInput(setReqBodyScheduleEdit, 'mata_kuliah', value)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nama Kelas"
                  value={reqBodyScheduleEdit.nama_kelas}
                  onChangeText={(value) => handleInput(setReqBodyScheduleEdit, 'nama_kelas', value)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="SKS"
                  value={reqBodyScheduleEdit.sks}
                  keyboardType="numeric"
                  onChangeText={(value) => handleInput(setReqBodyScheduleEdit, 'sks', value)}
                />
                <Picker
                  style={styles.input}
                  mode="dropdown"
                  selectedValue={reqBodyScheduleEdit.hari}
                  onValueChange={(itemValue) => handleInput(setReqBodyScheduleEdit, 'hari', itemValue)}
                >
                  <Picker.Item label="Pilih Hari:" />
                  <Picker.Item label="Senin" value="Senin" />
                  <Picker.Item label="Selasa" value="Selasa" />
                  <Picker.Item label="Rabu" value="Rabu" />
                  <Picker.Item label="Kamis" value="Kamis" />
                  <Picker.Item label="Jumat" value="Jumat" />
                  <Picker.Item label="Sabtu" value="Sabtu" />
                </Picker>
                <Text>Jam Mulai : {`${selectedHourJamMulai}:${selectedMinuteJamMulai}`}</Text>
                <View style={styles.pickerClockContainer}>
                  <Picker
                    selectedValue={selectedHourJamMulai}
                    style={styles.clockPicker}
                    onValueChange={(itemValue) => setSelectedHourJamMulai(itemValue)}
                  >
                    {hours.map((hour) => (
                      <Picker.Item key={hour} label={hour} value={hour} />
                    ))}
                  </Picker>
                  <Text style={styles.separatorJam}>:</Text>
                  <Picker
                    selectedValue={selectedMinuteJamMulai}
                    style={styles.clockPicker}
                    onValueChange={(itemValue) => setSelectedMinuteJamMulai(itemValue)}
                  >
                    {minutes.map((minute) => (
                      <Picker.Item key={minute} label={minute} value={minute} />
                    ))}
                  </Picker>
                </View>
                <Text>Jam Selesai : {`${selectedHourJamSelesai}:${selectedMinuteJamSelesai}`}</Text>
                <View style={styles.pickerClockContainer}>
                  <Picker
                    selectedValue={selectedHourJamSelesai}
                    style={styles.clockPicker}
                    onValueChange={(itemValue) => setSelectedHourJamSelesai(itemValue)}
                  >
                    {hours.map((hour) => (
                      <Picker.Item key={hour} label={hour} value={hour} />
                    ))}
                  </Picker>
                  <Text style={styles.separatorJam}>:</Text>
                  <Picker
                    selectedValue={selectedMinuteJamSelesai}
                    style={styles.clockPicker}
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
                  value={reqBodyScheduleEdit.ruangan}
                  onChangeText={(value) => handleInput(setReqBodyScheduleEdit, 'ruangan', value)}
                />
                
                {/* Buttons for Edit Modal */}
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSubmit]}
                    onPress={() => {
                      editButton(reqBodyScheduleEdit, reqBodyScheduleEdit.id_mata_kuliah, setEditModalVisible);
                      getUserSchedules(setUserSchedules);
                    }}
                  >
                    <Text style={styles.textStyle}>Submit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => setEditModalVisible(false)}
                  >
                    <Text style={styles.textStyle}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    )

    return (
      <View style={styles.tabelUserSchedules}>
        {userSchedules.length == 0 ? userSchedulesNotAvailable : userSchedulesAvailable}
      </View>
    )
  };

  const pageView = () => {
    if (loginPage === true) {
      // Login page view
      return (
        <View style={styles.loginPage}>
          <Image
            source={logoUnila}
            style={styles.logo}
          />

          <View style={styles.inputContainer}>
            <Icon name="person" type="material" size={24} style={styles.iconLogin} />
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
            <Icon name="lock" type="material" size={24} style={styles.iconLogin} />
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
          {Boolean(loginErrorMessage) && <Text style={styles.errorText}>{loginErrorMessage}</Text>}
        </View>
      )
    } else if (loginPage === false) {
      // Profile page view
      return (
        <View style={styles.profilePage}>
          <Text style={styles.titleHeader}>
            Jadwal Kuliah Anda
          </Text>
          <View style={styles.buttonHeader}>
            <Button 
              color="#00ff7f"
              title="Input Jadwal" 
              onPress={() => setInputModalVisible(true)}
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
            visible={inputModalVisible}
            onRequestClose={() => {
              setInputModalVisible(false);
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
                  <Picker
                    style={styles.input}
                    mode="dropdown"
                    selectedValue={reqBodyScheduleCreate.hari}
                    onValueChange={(itemValue, itemIndex) =>
                      handleInput(setReqBodyScheduleCreate, 'hari', itemValue)
                    }
                  >
                    <Picker.Item label="Pilih Hari:" />
                    <Picker.Item label="Senin" value="Senin" />
                    <Picker.Item label="Selasa" value="Selasa" />
                    <Picker.Item label="Rabu" value="Rabu" />
                    <Picker.Item label="Kamis" value="Kamis" />
                    <Picker.Item label="Jumat" value="Jumat" />
                    <Picker.Item label="Sabtu" value="Sabtu" />
                  </Picker>
                  <Text>Jam Mulai : {`${selectedHourJamMulai}:${selectedMinuteJamMulai}`}</Text>
                  <View style={styles.pickerClockContainer}>
                    <Picker
                      style={styles.clockPicker}
                      selectedValue={selectedHourJamMulai}
                      onValueChange={(itemValue) => setSelectedHourJamMulai(itemValue)}
                    >
                      {hours.map((hour) => (
                        <Picker.Item key={hour} label={hour} value={hour} />
                      ))}
                    </Picker>
                    <Text style={styles.separatorJam}>:</Text>
                    <Picker
                      selectedValue={selectedMinuteJamMulai}
                      style={styles.clockPicker}
                      onValueChange={(itemValue) => setSelectedMinuteJamMulai(itemValue)}
                    >
                      {minutes.map((minute) => (
                        <Picker.Item key={minute} label={minute} value={minute} />
                      ))}
                    </Picker>
                  </View>
                  <Text>Jam Selesai : {`${selectedHourJamSelesai}:${selectedMinuteJamSelesai}`}</Text>
                  <View style={styles.pickerClockContainer}>
                    <Picker
                      selectedValue={selectedHourJamSelesai}
                      style={styles.clockPicker}
                      onValueChange={(itemValue) => setSelectedHourJamSelesai(itemValue)}
                    >
                      {hours.map((hour) => (
                        <Picker.Item key={hour} label={hour} value={hour} />
                      ))}
                    </Picker>
                    <Text style={styles.separatorJam}>:</Text>
                    <Picker
                      selectedValue={selectedMinuteJamSelesai}
                      style={styles.clockPicker}
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
                      onPress={() => {
                        submitButton(reqBodyScheduleCreate, setInputModalVisible, setReqBodyScheduleCreate)
                        getUserSchedules(setUserSchedules)
                      }}
                    >
                      <Text style={styles.textStyle}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonCancel]}
                      onPress={() => setInputModalVisible(false)}
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
export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  // login page
  loginPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePage: {
    flex: 1,
  },
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
  iconLogin: {
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
    padding: 7,
    borderRadius: 7,
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
  // modal input schedule
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
  pickerClockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockPicker: {
    height: 50,
    width: 100,
  },
  separatorJam: {
    fontSize: 24,
    marginHorizontal: 5,
  },

  // user schedules
  tabelUserSchedules: {
    flex: 1,
  },
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
    flex: 1,
    textAlign: 'center',
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#ddd',
    width: 100,
  },
  // no user schedule
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