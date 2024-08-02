import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AuthenticatedScreen = ({ user, handleAuthentication, isGuest, handleGuestLogout }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.emailText}>{isGuest ? 'Guest' : user.email}</Text>
      {isGuest ? (
        <Button title="Login" onPress={handleGuestLogout} color="#3498db" />
      ) : (
        <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  authContainer: {
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

export default AuthenticatedScreen;
