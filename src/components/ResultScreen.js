// ResultScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ResultScreen = ({ route, navigation }) => {
  const { result } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.result}>{result}</Text>
      <Button title="Play Again" onPress={() => navigation.navigate('RoundSettings')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  result: {
    fontSize: 20,
    marginVertical: 20,
  },
});

export default ResultScreen;