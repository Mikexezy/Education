import { View, StyleSheet, Text, Dimensions } from 'react-native'
import React from 'react'

export default function Coppie({height, width, row, column}) {
    elementPadding = 10;

    elementHeight = (height-(elementPadding*(row*2)))/column;
    elementWidth = (width-(elementPadding*(column*2)))/row;

    const styles = StyleSheet.create({
        container:{
            width: width,
            height: height,
            alignItems: "center",
            justifyContent: "center",
            flexDirection:"column"
        },
        element: {
            height: height/row,
            backgroundColor: "yellow",
            flexDirection: "row"
        }
    }) 
  return (
    <View style={styles.container}>
      <View style={styles.element}>
        <View style={{height: elementHeight, width: elementWidth, margin: elementPadding, backgroundColor: "red"}}/>
        <View style={{height: elementHeight, width: elementWidth, margin: elementPadding, backgroundColor: "red"}}/>
        <View style={{height: elementHeight, width: elementWidth, margin: elementPadding, backgroundColor: "red"}}/>
      </View>
      <View style={styles.element}>
        <View style={{height: elementHeight, width: elementWidth, margin: elementPadding, backgroundColor: "red"}}/>
        <View style={{height: elementHeight, width: elementWidth, margin: elementPadding, backgroundColor: "red"}}/>
        <View style={{height: elementHeight, width: elementWidth, margin: elementPadding, backgroundColor: "red"}}/>
      </View>
      <View style={styles.element}>
        <View style={{height: elementHeight, width: elementWidth, margin: elementPadding, backgroundColor: "red"}}/>
        <View style={{height: elementHeight, width: elementWidth, margin: elementPadding, backgroundColor: "red"}}/>
        <View style={{height: elementHeight, width: elementWidth, margin: elementPadding, backgroundColor: "red"}}/>
      </View>
    </View>
  )
};