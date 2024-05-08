import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Cards() {
    return (
        <View style={styles.container}>
          <Text>Cards</Text>
        </View>
      )
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
      },
    });