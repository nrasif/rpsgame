import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
const { width, height } = Dimensions.get('window');

const PlayScreen = ({ route, navigation }) => {
  const { rounds } = route.params;
  const [currentRound, setCurrentRound] = useState(1);
  const [userScore, setUserScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [userChoice, setUserChoice] = useState(null);
  const [botChoice, setBotChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [shakeAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeChoiceAnim] = useState(new Animated.Value(0));
  const [buttonPressSound, setButtonPressSound] = useState(null); // Initialize state

  useEffect(() => {
    if (currentRound > rounds) {
      let finalResult;
      if (userScore > botScore) {
        finalResult = 'You Win!';
      } else if (userScore < botScore) {
        finalResult = 'You Lose!';
      } else {
        finalResult = 'It\'s a Draw!';
      }
      setFinalResult(finalResult);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start(() => setModalVisible(true));
    }
  }, [currentRound, rounds, userScore, botScore]);

  useEffect(() => {
    loadButtonPressSound();
  }, []);

  const loadButtonPressSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(require('../../assets/button-press.mp3'));
      setButtonPressSound(sound);
      await sound.setVolumeAsync(1.0);
    } catch (error) {
      console.error('Error loading sound', error);
    }
  };

  const playButtonPressSound = async () => {
    if (buttonPressSound) {
      try {
        await buttonPressSound.replayAsync();
      } catch (error) {
        console.error('Error playing sound', error);
      }
    }
  };

  const handlePlayRound = (userMove) => {
    playButtonPressSound();
    
    if (currentRound > rounds) return;

    const choices = ['rock', 'paper', 'scissors'];
    const botMove = choices[Math.floor(Math.random() * 3)];

    setUserChoice(userMove);
    setBotChoice(botMove);

    let roundResult;
    if (userMove === botMove) {
      roundResult = 'Draw';
    } else if (
      (userMove === 'rock' && botMove === 'scissors') ||
      (userMove === 'paper' && botMove === 'rock') ||
      (userMove === 'scissors' && botMove === 'paper')
    ) {
      roundResult = 'Win';
      setUserScore(userScore + 1);
    } else {
      roundResult = 'Lose';
      setBotScore(botScore + 1);
    }

    setResult(roundResult);

    fadeChoiceAnim.setValue(0);
    Animated.timing(fadeChoiceAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start(() => rotateAnim.setValue(0));

    if (roundResult === 'Lose' || roundResult === 'Win') {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }

    if (currentRound === rounds) {
      setTimeout(() => {
        let finalResult;
        if (userScore > botScore) {
          finalResult = 'You Win!';
        } else if (userScore < botScore) {
          finalResult = 'You Lose!';
        } else {
          finalResult = 'It\'s a Draw!';
        }
        setFinalResult(finalResult);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }).start(() => setModalVisible(true));
      }, 1000);
    }
  };

  const handleNextRound = () => {
    if (currentRound < rounds) {
      setCurrentRound(currentRound + 1);
      setUserChoice(null);
      setBotChoice(null);
      setResult(null);
      fadeAnim.setValue(0);
      scaleAnim.setValue(1);
      fadeChoiceAnim.setValue(0);
    }
  };

  const getScoreColor = (scoreType) => {
    if (result === 'Win' && scoreType === 'user') return 'green';
    if (result === 'Lose' && scoreType === 'bot') return 'green';
    if (result === 'Lose' && scoreType === 'user') return 'red';
    if (result === 'Win' && scoreType === 'bot') return 'red';
    return 'grey';
  };

  const getResultColor = () => {
    if (finalResult === 'You Win!') return '#4CAF50';
    if (finalResult === 'You Lose!') return '#E74C3C';
    return '#9E9E9E';
  };

  const images = {
    rock: require('../../assets/rock.png'),
    paper: require('../../assets/paper.png'),
    scissors: require('../../assets/scissors.png'),
  };

  return (
    <View style={styles.container}>
      <View style={styles.roundContainer}>
        <Text style={styles.roundText}>Round {currentRound}</Text>
      </View>

      {!userChoice && !botChoice && (
        <>
          <Text style={styles.title}>Choose your move!</Text>

          <View style={styles.choicesContainer}>
            <TouchableOpacity onPress={() => handlePlayRound('rock')}>
              <Animated.View style={[styles.choiceItem, { transform: [{ scale: scaleAnim }] }]}>
                <Image source={images.rock} style={styles.choiceImage} />
                <Text style={styles.choiceText}>Rock</Text>
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePlayRound('scissors')}>
              <Animated.View style={[styles.choiceItem, { transform: [{ scale: scaleAnim }] }]}>
                <Image source={images.scissors} style={styles.choiceImage} />
                <Text style={styles.choiceText}>Scissors</Text>
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePlayRound('paper')}>
              <Animated.View style={[styles.choiceItem, { transform: [{ scale: scaleAnim }] }]}>
                <Image source={images.paper} style={styles.choiceImage} />
                <Text style={styles.choiceText}>Paper</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </>
      )}

      {userChoice && botChoice && (
        <>
          <Animated.Text
            style={[
              styles.resultText,
              { color: result === 'Win' ? 'green' : result === 'Lose' ? 'red' : 'grey' },
              { transform: [{ translateX: shakeAnim }] },
            ]}
          >
            {result}!
          </Animated.Text>

          <View style={styles.resultContainer}>
            <Animated.View style={[styles.choiceContainer, { opacity: fadeChoiceAnim, transform: [{ scale: scaleAnim }] }]}>
              <Text style={styles.choiceLabel}>You</Text>
              <Image source={images[userChoice]} style={styles.choiceImage} />
              <View style={[styles.scoreBox, { backgroundColor: getScoreColor('user') }]}>
                <Text style={styles.scoreText}>{userScore}</Text>
              </View>
            </Animated.View>
            <Animated.Text style={[styles.vsText, { transform: [{ rotate: rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            }) }] }]}>
              VS
            </Animated.Text>
            <Animated.View style={[styles.choiceContainer, { opacity: fadeChoiceAnim, transform: [{ scale: scaleAnim }] }]}>
              <Text style={styles.choiceLabel}>Bot</Text>
              <Image source={images[botChoice]} style={styles.choiceImage} />
              <View style={[styles.scoreBox, { backgroundColor: getScoreColor('bot') }]}>
                <Text style={styles.scoreText}>{botScore}</Text>
              </View>
            </Animated.View>
          </View>

          {currentRound < rounds && (
            <TouchableOpacity onPress={handleNextRound} style={styles.nextRoundButton}>
              <Text style={styles.nextRoundButtonText}>Next Round</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {modalVisible && (
        <Animated.View style={[styles.centeredView, { opacity: fadeAnim }]}>
          <View style={[styles.modalView, { borderColor: getResultColor(), borderWidth: 3 }]}>
            <Text style={[styles.modalTitle, { color: getResultColor() }]}>{finalResult}</Text>

            <View style={styles.scoreContainer}>
              <Text style={styles.scoreTitle}>Final Score</Text>
              <Text style={styles.scoreValue}>{userScore}</Text>
              <Text style={styles.scoreOutOf}>out of {rounds}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.logOutButton]}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('Home');
                }}
              >
                <Text style={styles.logOutButtonText}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.rematchButton]}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('RoundSettings');
                }}
              >
                <Text style={styles.rematchButtonText}>Rematch</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5E1FD',
    paddingHorizontal: width * 0.05,
  },
  roundContainer: {
    position: 'absolute',
    top: height * 0.15,
    alignSelf: 'center',
    backgroundColor: '#FFC53D',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 50,
    borderWidth: 3,
  },
  roundText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#000',
  },
  title: {
    fontSize: width * 0.07,
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
    marginBottom: height * 0.05,
    color: '#000',
  },
  choicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: height * 0.05,
  },
  choiceItem: {
    alignItems: 'center',
  },
  choiceImage: {
    width: width * 0.5,
    height: width * 0.3,
    resizeMode: 'contain',
  },
  choiceText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginTop: height * 0.02,
    color: '#000',
  },
  resultText: {
    fontSize: width * 0.1,
    fontWeight: 'bold',
    marginBottom: height * 0.05,
  },
  resultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: height * 0.05,
  },
  choiceContainer: {
    alignItems: 'center',
  },
  choiceLabel: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Bold',
    marginBottom: height * 0.01,
    color: '#000',
  },
  scoreBox: {
    marginTop: height * 0.015,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    borderRadius: 8,
    borderWidth: 3,
  },
  scoreText: {
    fontSize: width * 0.05,
    fontFamily: 'Nunito-Regular',
    fontWeight: 'bold',
    color: '#FFF',
  },
  vsText: {
    fontSize: width * 0.1,
    fontFamily: 'Nunito-Black',
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'center',
  },
  nextRoundButton: {
    backgroundColor: '#722ED1',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    borderRadius: 50,
    position: 'absolute',
    bottom: height * 0.1,
    borderWidth: 3,
  },
  nextRoundButtonText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Nunito-Bold',
  },
  centeredView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
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
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  scoreContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreTitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 18,
    color: '#000',
  },
  scoreValue: {
    fontFamily: 'Nunito-Bold',
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  scoreOutOf: {
    fontFamily: 'Nunito-Regular',
    fontSize: 18,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },
  logOutButton: {
    backgroundColor: '#fff',
  },
  rematchButton: {
    backgroundColor: '#722ED1',
  },
  logOutButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
    color: '#000',
  },
  rematchButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
    color: '#FFF',
  },
  finalResultText: {
    fontSize: width * 0.07,
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    color: '#000',
  },
});

export default PlayScreen;
