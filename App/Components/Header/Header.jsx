import { View, StyleSheet, Image, StatusBar, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../../../assets/Colors/Color';
import { AntDesign } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const {height} = Dimensions.get('window');

export default function Header({showProfileButton, headerHeight}) {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Si è verificato un errore durante il logout:', error);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.statusBarPadding}/>
      <View style={{height:"65%", width:"100%", backgroundColor:"transparent", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
        <View style={{width:"20%", height:"100%"}}/>
        <Image source={require('../../../assets/headerLogo.png')} style={styles.logo}/>
        {showProfileButton == true ? 
          <TouchableOpacity onPress={handleLogout} style={{width:"20%", height:"100%", backgroundColor:"transparent", justifyContent:"center", alignItems:"center"}}>
            <AntDesign name="user" size={30} color="black" />
          </TouchableOpacity>
          :
          <View style={{width:"20%", height:"100%"}}/>
        }
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
    header: {
        height: headerHeight,
        width: "100%",
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        zIndex: 10
    },
    logo: {
        backgroundColor: "transparent",
        height: "100%",
        width: "50%",
        resizeMode: "contain"
    },
    statusBarPadding: {
      height: StatusBar.currentHeight,
      backgroundColor: colors.light
    }
});