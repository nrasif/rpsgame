import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

const RoundSettingsScreen = ({ navigation }) => {
  const [rounds, setRounds] = useState(5);
  const [buttonSound, setButtonSound] = useState();

  useEffect(() => {
    // Load the button sound on component mount
    loadButtonSound();

    return () => {
      // Unload the button sound on component unmount
      if (buttonSound) {
        buttonSound.unloadAsync();
      }
    };
  }, []);

  const loadButtonSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require('../../assets/button-press.mp3'));
    setButtonSound(sound);
    await sound.setVolumeAsync(1.0); // Set button click sound volume to full (100%)
  };

  const playButtonSound = async () => {
    if (buttonSound) {
      await buttonSound.stopAsync(); // Ensure any previous playback is stopped
      await buttonSound.replayAsync(); // Replay the sound
    }
  };

  const handleStartGame = () => {
    playButtonSound();
    navigation.navigate('Play', { rounds });
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => {
        playButtonSound();
        navigation.goBack();
      }} style={styles.backButton}>
        <Image source={require('../../assets/arrow-back.png')} style={styles.backImage} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Pick your round</Text>

      {/* Round Selection */}
      <View style={styles.roundContainer}>
        {[3, 5, 7, 9].map((round) => (
          <TouchableOpacity 
            key={round} 
            style={[styles.roundButton, rounds === round && styles.selectedRoundButton]}
            onPress={() => {
              playButtonSound();
              setRounds(round);
            }}
          >
            <Text style={styles.roundText}>{round}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Start Button */}
      <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.05,
    backgroundColor: '#F5E1FD',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.09,
    left: width * 0.10,
    zIndex: 1,
    padding: 10,
  },
  backImage: {
    width: width * 0.08,
    height: height * 0.05,
    resizeMode: 'contain',
  },
  title: {
    fontSize: width * 0.07,
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    textAlign: 'center',
    color: '#000'
  },
  roundContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: height * 0.03, // 5% of the screen height
  },
  roundButton: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderColor: '#000',
  },
  selectedRoundButton: {
    backgroundColor: '#FFC53D', // Change color when selected
  },
  roundText: {
    fontSize: width * 0.045,
    fontFamily: 'Nunito-Regular',
    fontWeight: 'bold',
    color: '#000',
  },
  startButton: {
    backgroundColor: '#722ED1',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    borderRadius: 40,
    borderWidth: 3,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: width * 0.045,
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RoundSettingsScreen;
