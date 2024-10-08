import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert, LogBox, ActivityIndicator, View } from 'react-native';
import { auth } from './src/services/firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@firebase/auth';
import AuthScreen from './src/components/AuthScreen';
import HomeScreen from './src/components/HomeScreen';
import PlayScreen from './src/components/PlayScreen';
import AboutUsScreen from './src/components/AboutUsScreen';
import SettingsScreen from './src/components/SettingsScreen';
import * as SplashScreen from 'expo-splash-screen';
import RoundSettingsScreen from './src/components/RoundSettingsScreen';
import * as Font from 'expo-font';

const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
        'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
        'Nunito-Light': require('./assets/fonts/Nunito-Light.ttf'),
        'Nunito-Black': require('./assets/fonts/Nunito-Black.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();

    const checkAuthState = async () => {
      try {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setIsLoading(false);
          SplashScreen.hideAsync(); // Hide splash screen when auth state is checked
        });
  
        // Cleanup
        return () => unsubscribe();
      } catch (error) {
        console.error('Error checking auth state:', error);
        setIsLoading(false);
        SplashScreen.hideAsync(); // Hide splash screen in case of error
      }
    };
  
    checkAuthState();
  }, []);  

  const handleAuthentication = async () => {
    try {
      if (user) {
        await signOut(auth);
        setIsGuest(false);
        setUser(null);  // Clear user state
      } else {
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

  if (isLoading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
            <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
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
