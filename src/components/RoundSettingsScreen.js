import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const RoundSettingsScreen = ({ navigation }) => {
  const [rounds, setRounds] = useState(5);

  const handleStartGame = () => {
    navigation.navigate('Play', { rounds });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Number of Rounds</Text>
      <Slider
        style={{ width: 300, height: 40 }}
        minimumValue={1}
        maximumValue={11}
        step={2}
        value={rounds}
        onValueChange={value => setRounds(value)}
        minimumTrackTintColor="#1EB1FC"
        maximumTrackTintColor="#1EB1FC"
        thumbTintColor="#1EB1FC"
      />
      <Text style={styles.roundsText}>{rounds} Rounds</Text>
      <Button title="Start Game" onPress={handleStartGame} />
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
  roundsText: {
    fontSize: 20,
    marginVertical: 20,
  },
});

export default RoundSettingsScreen;
