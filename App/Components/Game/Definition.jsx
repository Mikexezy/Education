import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Definition() {
  return (
    <View style={styles.container}>
      <View style={styles.definitionContainer}>

      </View>

      <View style={styles.answerContainer}>
        
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red"
  },
  definitionContainer: {
    alignItems: "center",
    backgroundColor: "blue",
    height: "30%",
    width: "100%"
  },
  answerContainer: {
    flex: 1,
    backgroundColor: "green",
    alignItems: "center",
    flexDirection: "column"
  }
});