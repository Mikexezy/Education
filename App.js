import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './App/Screens/LoginScreen/Login';
import Home from './App/Screens/HomeScreen/Home';
import SplashScreen from './App/Screens/SplashScreen/SplashScreen';

const Stack = createStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const [fontsLoaded] = useFonts({
    'OutfitEB': require('./assets/fonts/Outfit-ExtraBold.ttf'),
    'OutfitM': require('./assets/fonts/Outfit-Medium.ttf'),
    'OutfitR': require('./assets/fonts/Outfit-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      setTimeout(() => {
        setShowSplash(false);
      }, 2000);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || showSplash) {
    return <SplashScreen/>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
