import React, { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { AntDesign } from '@expo/vector-icons';

import Login from './App/Screens/LoginScreen/Login';
import Home from './App/Screens/HomeScreen/Home';
import VideoScreen from './App/Components/Level/VideoScreen';

import SplashScreen from './App/Screens/SplashScreen/SplashScreen';

import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { colors } from './assets/Colors/Color';
import { TouchableOpacity } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  const [fontsLoaded] = useFonts({
    'OutfitEB': require('./assets/fonts/Outfit-ExtraBold.ttf'),
    'OutfitM': require('./assets/fonts/Outfit-Medium.ttf'),
    'OutfitR': require('./assets/fonts/Outfit-Regular.ttf'),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setShowSplash(false);
    });

    return () => unsubscribe();
  }, []);

  if (!fontsLoaded || showSplash) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={auth.currentUser ? 'Home' : 'Login'}>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false, animationEnabled: false, }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false, animationEnabled: false, }} />
        <Stack.Screen
          name="VideoScreen"
          component={VideoScreen}
          options={({ route, navigation }) => ({
            title: route.params.title + (route.params.part === 0 ? "" : " Parte " + route.params.part),
            headerShown: true,  
            headerTitleAlign: "center", 
            headerTitleStyle: { fontFamily: "OutfitEB" }, 
            headerStyle: { backgroundColor: colors.light },
            animationEnabled: false,
            headerLeft: () => (
              <TouchableOpacity style={{flex:1, alignItems: "center", justifyContent: "center"}} onPress={() => navigation.navigate('Home')}>
                <AntDesign 
                  name="arrowleft" 
                  size={24} 
                  color="black" 
                  style={{ marginLeft: 10 }} 
                />
              </TouchableOpacity>
            )
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
