import { View, Image, StyleSheet, StatusBar } from 'react-native'
import React from 'react'
import { colors } from '../../../assets/Colors/Color';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.statusBarPadding}/>
      <Image style={styles.logo} source={require('../../../assets/splash.png')}/>
    </View>
  )
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: colors.light,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width:"80%",
        height: "50%",
        resizeMode: "contain",
    },
    statusBarPadding: {
      height: StatusBar.currentHeight,
      backgroundColor: colors.light,
    }
});