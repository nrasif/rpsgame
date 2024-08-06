import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const PlayScreen = ({ route, navigation }) => {
  const { rounds } = route.params;
  const [currentRound, setCurrentRound] = useState(1);
  const [userScore, setUserScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [userChoice, setUserChoice] = useState(null);
  const [botChoice, setBotChoice] = useState(null);
  const [result, setResult] = useState(null);

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
      navigation.navigate('Result', { result: finalResult });
    }
  }, [currentRound, rounds, userScore, botScore, navigation]);

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

    if (currentRound < rounds) {
      setCurrentRound(currentRound + 1);
    } else {
      setCurrentRound(currentRound + 1);  // Trigger the useEffect to navigate to Result screen
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
        <View style={styles.resultContainer}>
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
        </View>
      )}
      {currentRound <= rounds && (
        <Text style={styles.title}>Choose Your Move</Text>
      )}
      {currentRound <= rounds && (
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
});

export default PlayScreen;
