import React from 'react';
import { View, Text, Button, StyleSheet, Modal } from 'react-native';

const ResultScreen = ({ route, navigation, setModalVisible }) => {
  const { result } = route.params;

  const handlePlayAgain = () => {
    setModalVisible(false); // Close the modal
    navigation.navigate('RoundSettings');
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={() => {
        setModalVisible(false); // Close the modal
        navigation.navigate('RoundSettings');
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Game Over</Text>
          <Text style={styles.result}>{result}</Text>
          <Button title="Play Again" onPress={handlePlayAgain} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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