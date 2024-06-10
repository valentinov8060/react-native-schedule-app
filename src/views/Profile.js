import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Icon } from 'react-native-elements';

import { 
  checkTokenOnLoad, 
  loginButton,
} from '../controllers/Profile-controller';

const logoUnila = require('../../assets/images/logo-unila.png');

export default Profile = () => {
  const isFocused = useIsFocused();

  const [loginPage, setLoginPage] = useState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Login page
  useEffect(() => {
    checkTokenOnLoad(setLoginPage);
  },[isFocused]);

  useEffect(() => {
    console.log('Login page: ', loginPage);
  },[loginPage]);

  // Profile page view
  const pageView = () => {
    if (loginPage === true) {
      return (
        <View style={styles.loginPage}>
          <Image
            source={logoUnila}
            style={styles.logo}
          />
          
          <View style={styles.inputContainer}>
            <Icon name="person" type="material" size={24} style={styles.icon} />
            <TextInput
              style={styles.textInput}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" type="material" size={24} style={styles.icon} />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>

          <Button title="Login" onPress={() => loginButton(username, password, setErrorMessage)} style={styles.loginButton} />
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        </View>
      )
    } else if (loginPage === false) {
      return (
        <View style={styles.profilePage}>
          <Text>Profile Page {username}</Text>
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
  loginButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  errorText: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'red',
    backgroundColor: '#f4cccc',
    color: 'red',
    textAlign: 'center',
  },
});