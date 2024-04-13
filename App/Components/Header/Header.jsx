import { View, StyleSheet, Image } from 'react-native'
import React from 'react'

export default function Header() {
  return (
    <View style={styles.header}>
        <Image source={require('../../../assets/headerLogo.png')} style={styles.logo}/>
    </View>
  )
};

const styles = StyleSheet.create({
    header: {
        height: "10%",
        width: "100%",
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        backgroundColor: "transparent",
        height: "70%",
        width: "60%",
        resizeMode: "contain"
    }
});