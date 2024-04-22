import { View, StyleSheet, StatusBar, ScrollView, Dimensions } from 'react-native'
import React from 'react'
import { colors } from '../../../assets/Colors/Color';
import Header from '../../Components/Header/Header';
import Level from '../../Components/Level/Level';

const {height, width} = Dimensions.get('window');

export default function Home() {
  return (
      <View style={styles.container}>
        <Header/>
        <View style={styles.lvlSection}>
          <ScrollView contentContainerStyle={styles.lvlList}>
            <Level progress={100}/>
            <Level progress={10}/>
            <Level progress={10}/>
            <Level progress={10}/>
            <Level progress={10}/>
          </ScrollView>
        </View>
      </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  lvlSection: {
    flex:1,
    backgroundColor: "transparent",
  },
  lvlList: {
    marginTop: (0.1*height) + StatusBar.currentHeight,
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "column",
  }
});