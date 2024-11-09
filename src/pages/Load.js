import React from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';

const logoUnila = require('../../assets/images/logo-unila.png');

const Load = () => {
  return (
    <View style={styles.container}>
      <Image
        source={logoUnila}
        style={styles.logoUnila}
      />
      <Text style={styles.title}>Schedule App</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};
export default Load;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
  },
  logoUnila: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
});