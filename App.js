import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert, LogBox } from 'react-native';
import { auth } from './src/services/firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@firebase/auth';
import AuthScreen from './src/components/AuthScreen';
import HomeScreen from './src/components/HomeScreen';
import PlayScreen from './src/components/PlayScreen';
import ProfileScreen from './src/components/ProfileScreen';
import SettingsScreen from './src/components/SettingsScreen';
import * as SplashScreen from 'expo-splash-screen';
import RoundSettingsScreen from './src/components/RoundSettingsScreen';
import ResultScreen from './src/components/ResultScreen';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setIsLoading(false);
          if (user) {
            SplashScreen.hideAsync();
          } else {
            SplashScreen.hideAsync();
          }
        });
  
        // Cleanup
        return () => unsubscribe();
      } catch (error) {
        console.error('Error checking auth state:', error);
        setIsLoading(false);
        SplashScreen.hideAsync();
      }
    };
  
    checkAuthState();
  }, []);  

  const handleAuthentication = async () => {
    try {
      if (user) {
        // If user is logged in, sign them out
        await signOut(auth);
        setIsGuest(false);
        setUser(null);  // Clear user state
      } else {
        // Handle sign in or sign up based on isLogin state
        if (!/\S+@\S+\.\S+/.test(email)) {
          Alert.alert('Error', 'Please enter a valid email address.');
          return;
        }
  
        if (password.length < 6) {
          Alert.alert('Error', 'Password must be at least 6 characters long.');
          return;
        }
  
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Authentication error', error.message);
    }
  };  

  const handleGuestLogin = () => {
    setIsGuest(true);
    setUser({ displayName: 'Guest' });
  };

  const handleGuestLogout = () => {
    setIsGuest(false);
    setUser(null);  // Clear user state
    setIsLogin(true);  // Reset to login state
  };  

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
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
            <Stack.Screen name="RoundSettings" component={RoundSettingsScreen} />
            <Stack.Screen name="Play" component={PlayScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Result" component={ResultScreen} />
          </>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
