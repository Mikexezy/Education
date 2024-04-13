import { View, Image, StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
import { colors } from '../../../assets/Colors/Color';

export default function SplashScreen() {
  return (
    <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../../../assets/splash.png')}/>
        </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: colors.light,
        alignItems: "center",
        justifyContent: "center"
    },
    logo: {
        width:"80%",
        height: "50%",
        resizeMode: "contain",
    }
});