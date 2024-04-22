import { View, StyleSheet, Image, StatusBar, Dimensions } from 'react-native'
import React from 'react'
import { colors } from '../../../assets/Colors/Color';

const {height} = Dimensions.get('window');

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.statusBarPadding}/>
      <Image source={require('../../../assets/headerLogo.png')} style={styles.logo}/>
    </View>
  )
};

const styles = StyleSheet.create({
    header: {
        height: (0.1*height) + StatusBar.currentHeight,
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
        height: "65%",
        width: "60%",
        resizeMode: "contain"
    },
    statusBarPadding: {
      height: StatusBar.currentHeight,
      backgroundColor: colors.light
    }
});