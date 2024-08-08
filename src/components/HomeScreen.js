import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation, user, handleAuthentication, isGuest, handleGuestLogout }) => {
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [backgroundSound, setBackgroundSound] = useState();
  const [buttonSound, setButtonSound] = useState();

  useEffect(() => {
    // Load and play the background music and button sound on component mount
    loadAndPlayBackgroundMusic();
    loadButtonSound();

    return () => {
      // Unload the sounds on component unmount
      if (backgroundSound) {
        backgroundSound.unloadAsync();
      }
      if (buttonSound) {
        buttonSound.unloadAsync();
      }
    };
  }, []);

  const loadAndPlayBackgroundMusic = async () => {
    const { sound } = await Audio.Sound.createAsync(require('../../assets/music.mp3'));
    setBackgroundSound(sound);
    await sound.setVolumeAsync(0.1); // Set background music volume to 30%
    await sound.playAsync();
    sound.setIsLoopingAsync(true); // Loop the music
  };

  const loadButtonSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require('../../assets/button-press.mp3'));
    setButtonSound(sound);
    await sound.setVolumeAsync(1.0); // Set button click sound volume to full (100%)
  };

  const toggleMusic = async () => {
    if (isMusicOn) {
      await backgroundSound.pauseAsync();
    } else {
      await backgroundSound.playAsync();
    }
    setIsMusicOn(!isMusicOn);
  };

  const fadeOutAndStopMusic = async () => {
    if (backgroundSound) {
      await backgroundSound.setVolumeAsync(0); // Fade out volume to 0
      await backgroundSound.pauseAsync(); // Pause the music after fading out
    }
  };

  const handleLogout = async () => {
    await fadeOutAndStopMusic();
    if (isGuest) {
      handleGuestLogout();
    } else {
      handleAuthentication();
    }
  };

  const playButtonSound = async () => {
    if (buttonSound) {
      await buttonSound.stopAsync(); // Ensure any previous playback is stopped
      await buttonSound.replayAsync(); // Replay the sound
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMusic} style={styles.soundButton}>
        <Image
          source={isMusicOn ? require('../../assets/sound-on.png') : require('../../assets/sound-off.png')}
          style={styles.soundIcon}
        />
      </TouchableOpacity>

      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>
        Feeling lucky today? Let's see if you can outsmart me on rock paper scissors game!
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          playButtonSound();
          navigation.navigate('RoundSettings');
        }}
      >
        <Text style={styles.buttonText}>Play</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          playButtonSound();
          navigation.navigate('AboutUsScreen');
        }}
      >
        <Text style={styles.buttonText}>About Us</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={async () => {
          playButtonSound();
          await handleLogout();
        }}
      >
        <Text style={styles.buttonText}>
          {isGuest ? 'Login' : 'Log Out'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
    backgroundColor: '#F5E1FD',
  },
  soundButton: {
    position: 'absolute',
    top: height * 0.1,
    left: width * 0.1,
  },
  soundIcon: {
    width: width * 0.08,
    height: height * 0.05,
    resizeMode: 'contain'
  },
  title: {
    fontSize: width * 0.09,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
  button: {
    width: '80%',
    backgroundColor: '#ffffff',
    padding: height * 0.02,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: height * 0.02,
    borderWidth: 3,
    borderColor: '#000000',
  },
  buttonText: {
    color: '#000', // Black text
    fontSize: width * 0.045,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#e74c3c', 
  },
});

export default HomeScreen;
