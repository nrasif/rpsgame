import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';

// Get the window dimensions
const { width, height } = Dimensions.get('window');

const AboutUsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image
          source={require('../../assets/arrow-back.png')}
          style={styles.backIcon}
          resizeMode="contain" // Ensures the image is fully visible
        />
      </TouchableOpacity>

      <Text style={styles.title}>Who are we?</Text>
      <Text style={styles.subtitle}>
        We are Group 3 from Rakamin and BSI. A dedicated team that designed this game from scratch
      </Text>

      <ScrollView contentContainerStyle={styles.teamContainer}>
        {teamMembers.map((member, index) => (
          <View key={index} style={styles.member}>
            <Text style={styles.memberTitle}>{member.name}</Text>
            <Text style={styles.memberRole}>{member.role}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Example team members array
const teamMembers = [
  { name: 'Nahari Rasif', role: 'Team Lead and our beloved back-end developer' },
  { name: 'Faisal Deli', role: 'Project Manager' },
  { name: 'M Zikri Firnanda', role: 'Front-end Engineer' },
  { name: 'Fauzia Nur Fitria', role: 'Front-end Engineer' },
  { name: 'Salma Nurul', role: 'UI/UX Designer' },
  { name: 'Haya Ayu Fauziyyah', role: 'UI/UX Designer' },
  { name: 'Salsabilla Putri', role: 'UI/UX Designer' },
  { name: 'M Amiruddin', role: 'Front-end Engineer' },
  { name: 'Zaidan M Shidqy', role: 'Back-end Engineer' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.1,
    backgroundColor: '#F5E1FD',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.09,
    left: width * 0.10,
  },
  backIcon: {
    width: width * 0.08,
    height: height * 0.05,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#000',
    marginTop: height * 0.13,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width * 0.045,
    color: '#7f8c8d',
    textAlign: 'left',
    marginTop: height * 0.02,
    marginBottom: height * 0.07,
  },
  teamContainer: {
    flexGrow: 1,
    alignItems: 'left',
  },
  member: {
    marginBottom: height * 0.02,
    alignItems: 'left',
  },
  memberTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#000',
  },
  memberRole: {
    fontSize: width * 0.04,
    color: '#7f8c8d',
    textAlign: 'left',
  },
});

export default AboutUsScreen;
