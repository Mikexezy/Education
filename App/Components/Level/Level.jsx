import { Text, StyleSheet, Platform, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from '../../../assets/Colors/Color';
import * as Progress from 'react-native-progress';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Level({ title, progress }) {
  const styles = StyleSheet.create({
    container: {
        backgroundColor: progress == 100 ? "green" : colors.light,
        width: "95%",
        height: 180,
        borderRadius: 20,
        padding: 10,
        marginBottom: 7,
        ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 3,
            },
            android: {
              elevation: 5,
            },
          }),
    },
    titleStyle: {
      fontFamily: "OutfitEB",
      color: progress < 100? "black":"white",
    },
    header:{
      backgroundColor: "transparent",
      height: "20%",
      width: "100%",
      alignItems: "flex-start",
      justifyContent: "center"
    },
    object: {
      backgroundColor: "transparent",
      height: "50%",
      width: "100%",
      alignItems: "flex-end",
      justifyContent: "center",
      paddingRight: 20
    },
    footer: {
      backgroundColor: "transparent",
      height: "30%",
      width: "100%",
      alignItems: "flex-end",
      justifyContent: "center"
    },
    button: {
      width: "40%",
      height: "80%",
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: progress < 100 ? "black" : colors.light,
      borderRadius: 50,
      justifyContent: "space-around",
      alignItems: "center",
      flexDirection: "row"
    },
    buttonText:{
      color: progress < 100 ? "black" : colors.light ,
      fontFamily: "OutfitEB"
    }
  }); 

    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.titleStyle}> {title} </Text>
          </View>
          <View style={styles.object}>
            <Progress.Circle showsText={true} textStyle={{fontFamily: "OutfitEB"}} progress={progress/100} size={70} color={progress < 100 ? "#22ba22" : colors.light}/>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} disabled={progress == 100 ? true : false}>
              <Text style={styles.buttonText}> {progress == 100 ? "Completato": progress == 0 ? "Inizia" : "Continua"} </Text>
              {progress < 100 ? <FontAwesome5 name="arrow-right" size={20} color={progress < 100 ? "black" : colors.light} /> : null}
            </TouchableOpacity>
          </View>
        </View>
    );
};