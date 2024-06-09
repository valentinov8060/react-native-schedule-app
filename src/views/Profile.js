import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, Image } from 'react-native';
import { Icon } from 'react-native-elements';

const logoUnila = require('../../assets/images/logo-unila.png');

export default Profile = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    // Implement login logic here (e.g., API calls, authentication)
    // Update errorMessage based on login success or failure
  };

  return (
    <View style={styles.container}>
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

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <Button title="Login" onPress={handleLogin} style={styles.loginButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
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
    color: 'red',
    marginBottom: 10,
  },
});
