import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation, user, handleAuthentication, isGuest, handleGuestLogout }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.emailText}>{isGuest ? 'Guest' : user.email}</Text>
      <Button title="Play" onPress={() => navigation.navigate('Play')} />
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
      <Button title={isGuest ? 'Login' : 'Logout'} onPress={isGuest ? handleGuestLogout : handleAuthentication} color="#e74c3c" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emailText: {
    fontSize: 18,
    marginBottom: 16,
  },
});

export default HomeScreen;
