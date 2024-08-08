import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Button } from 'react-native';
import ResultScreen from './ResultScreen';

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
  const [modalVisible, setModalVisible] = useState(false);

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
        duration: 700, // Adjust duration for fade-in effect
        useNativeDriver: true,
      }).start(() => setModalVisible(true));
    }
  }, [currentRound, rounds, userScore, botScore]);

  const handlePlayRound = (userMove) => {
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

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

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
          duration: 700, // Adjust duration for fade-in effect
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
    }
  };

  const images = {
    rock: require('../../assets/rock.png'),
    paper: require('../../assets/paper.png'),
    scissors: require('../../assets/scissors.png'),
  };

  return (
    <View style={styles.container}>
      {currentRound <= rounds && (
        <Text style={styles.roundText}>Round: {currentRound}</Text>
      )}
      {userChoice && botChoice && (
        <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
          <View style={styles.choiceContainer}>
            <Text style={styles.choiceLabel}>You</Text>
            <Image source={images[userChoice]} style={styles.choiceImage} />
            <Text style={styles.scoreText}>{result}</Text>
            <Text style={styles.scoreText}>{userScore} - {botScore}</Text>
          </View>
          <View style={styles.choiceContainer}>
            <Text style={styles.choiceLabel}>Bot</Text>
            <Image source={images[botChoice]} style={styles.choiceImage} />
          </View>
        </Animated.View>
      )}
      {currentRound <= rounds && !userChoice && (
        <Text style={styles.title}>Choose Your Move</Text>
      )}
      {currentRound <= rounds && !userChoice && (
        <View style={styles.choicesContainer}>
          <TouchableOpacity onPress={() => handlePlayRound('rock')}>
            <View style={styles.choiceItem}>
              <Image source={images.rock} style={styles.choiceImage} />
              <Text style={styles.choiceText}>Rock</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePlayRound('paper')}>
            <View style={styles.choiceItem}>
              <Image source={images.paper} style={styles.choiceImage} />
              <Text style={styles.choiceText}>Paper</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePlayRound('scissors')}>
            <View style={styles.choiceItem}>
              <Image source={images.scissors} style={styles.choiceImage} />
              <Text style={styles.choiceText}>Scissors</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {userChoice && botChoice && currentRound < rounds && (
        <Button title="Next Round" onPress={handleNextRound} />
      )}
      {modalVisible && (
        <Animated.View style={[styles.centeredView, { opacity: fadeAnim }]}>
          <ResultScreen
            route={{ params: { result: finalResult } }}
            navigation={navigation}
            setModalVisible={setModalVisible}
          />
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
  },
  roundText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  choiceContainer: {
    alignItems: 'center',
  },
  choiceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  choiceImage: {
    width: 100,
    height: 100,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  choicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  choiceItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  choiceText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
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
});

export default PlayScreen;
