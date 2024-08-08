import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const AuthScreen = ({
  email,
  setEmail,
  password,
  setPassword,
  isLogin,
  setIsLogin,
  handleAuthentication,
  handleGuestLogin,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../../assets/Logo (3).png')} />
      </View>
      <View style={styles.authContainer}>
        <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <TouchableOpacity style={styles.authButton} onPress={handleAuthentication}>
          <Text style={styles.authButtonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.toggleText}>
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </Text>
        </TouchableOpacity>
        {isLogin && (
          <>
            <Text style={styles.orText}>OR</Text>
            <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin}>
              <Text style={styles.guestButtonText}>Play as Guest</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  logoContainer: {
    backgroundColor: '#ffc53d',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  logo: {
    width: '150%',
    height: height * 0.3,
    resizeMode: 'contain',
    position: 'absolute',
    top: 0
  },
  authContainer: {
    width: '100%',
    height: height*0.70,
    padding: 30,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  guestText: {
    marginTop: 10,
    color: '#007BFF',
    textAlign: 'center',
  },
  toggleText: {
    marginTop: 20,
    color: '#007BFF',
    textAlign: 'center',
    fontFamily: 'Nunito-Regular',
  },
  orText: {
    marginTop: 20,
    color: '#555',
    textAlign: 'center',
    fontSize: 16,
  },
  guestButton: {
    width: "60%",
    alignSelf: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#007BFF',
    backgroundColor: 'white',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestButtonText: {
    color: '#007BFF',
    fontSize: 16,
    fontFamily: 'Nunito-Regular'
  },
  authButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#722ED1',
    backgroundColor: '#722ED1',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Nunito-Bold'
  },
});

export default AuthScreen;
