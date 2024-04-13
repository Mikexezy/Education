import { View, StyleSheet, StatusBar } from 'react-native'
import React from 'react'
import { colors } from '../../../assets/Colors/Color';
import Header from '../../Components/Header/Header';

export default function Home() {
  return (
      <View style={styles.container}>
        <Header/>
      </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    marginTop: StatusBar.currentHeight
  }
});