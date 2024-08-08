import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions, PixelRatio } from 'react-native';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

const scaleFont = (size) => {
  const screenRatio = PixelRatio.getFontScale();
  return size * screenRatio;
};

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
  const [buttonSound, setButtonSound] = useState();

  useEffect(() => {
    // Load the button press sound
    loadButtonSound();

    return () => {
      // Unload the sound on component unmount
      if (buttonSound) {
        buttonSound.unloadAsync();
      }
    };
  }, []);

  const loadButtonSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require('../../assets/button-press.mp3'));
    setButtonSound(sound);
    await sound.setVolumeAsync(1.0); // Set volume to 100%
  };

  const playButtonSound = async () => {
    if (buttonSound) {
      await buttonSound.stopAsync(); // Ensure the sound is stopped before replaying
      await buttonSound.replayAsync();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../../assets/Logo.png')} />
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
        <TouchableOpacity 
          style={styles.authButton} 
          onPress={() => {
            playButtonSound();
            handleAuthentication();
          }}
        >
          <Text style={styles.authButtonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          playButtonSound();
          setIsLogin(!isLogin);
        }}>
          <Text style={styles.toggleText}>
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </Text>
        </TouchableOpacity>
        {isLogin && (
          <>
            <Text style={styles.orText}>OR</Text>
            <TouchableOpacity 
              style={styles.guestButton} 
              onPress={() => {
                playButtonSound();
                handleGuestLogin();
              }}
            >
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
    height: height * 0.70,
    padding: 30,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderWidth: 3,
    borderColor: '#000'
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
    fontFamily: 'Nunito-Black',
  },
  guestButton: {
    width: "60%",
    alignSelf: 'center',
    marginTop: 10,
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: 'white',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestButtonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Nunito-Bold'
  },
  authButton: {
    marginTop: 10,
    borderWidth: 3,
    borderColor: '#000',
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
