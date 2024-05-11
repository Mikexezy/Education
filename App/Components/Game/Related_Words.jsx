import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Related() {
  return (
    <View style={styles.container}>
      <Text>Related_Words</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red"
  },
});