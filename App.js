import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { auth } from './src/services/firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@firebase/auth';
import AuthScreen from './src/components/AuthScreen';
import AuthenticatedScreen from './src/components/AuthenticatedScreen';

import HomeScreen from './src/components/HomeScreen';
import PlayScreen from './src/components/PlayScreen';
import ProfileScreen from './src/components/ProfileScreen';
import SettingsScreen from './src/components/SettingsScreen';

const Stack = createStackNavigator();

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state
  const [isLogin, setIsLogin] = useState(true);
  const [isGuest, setIsGuest] = useState(false); // Track if the user is a guest

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthentication = async () => {
    try {
      // Validate email format
      if (!/\S+@\S+\.\S+/.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address.');
        return;
      }

      // Check if password is at least 6 characters
      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters long.');
        return;
      }

      if (user) {
        // If user is already authenticated, log out
        console.log('User logged out successfully!');
        await signOut(auth);
        setIsGuest(false);
      } else {
        // Sign in or sign up
        if (isLogin) {
          // Sign in
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
        } else {
          // Sign up
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
      Alert.alert('Authentication error', error.message);
    }
  };

  const handleGuestLogin = () => {
    setIsGuest(true);
    setUser({ displayName: 'Guest' }); // Set a mock user object with displayName 'Guest'
  };

  const handleGuestLogout = () => {
    setIsGuest(false);
    setUser(null);
    setIsLogin(true); // Ensure the login form is displayed
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name="Home">
            {(props) => (
              <HomeScreen
                {...props}
                user={user}
                handleAuthentication={handleAuthentication}
                isGuest={isGuest}
                handleGuestLogout={handleGuestLogout}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Auth">
            {(props) => (
              <AuthScreen
                {...props}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                handleAuthentication={handleAuthentication}
                handleGuestLogin={handleGuestLogin}
              />
            )}
          </Stack.Screen>
        )}
        <Stack.Screen name="Play" component={PlayScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
});

export default App;