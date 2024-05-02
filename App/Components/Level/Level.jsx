import { Text, StyleSheet, Platform, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { colors } from '../../../assets/Colors/Color';
import * as Progress from 'react-native-progress';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Level({ id, title, progress, reallyProgress, videoid, op }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('VideoScreen', {levelId: id+1, videoid: Array.isArray(progress) ? (progress[0] < 100 ? videoid[0] : videoid[1]) : videoid , title: title, part: Array.isArray(progress) ? (progress[0] < 100 ? 1 : 2) : 0});
  };

  const styles = StyleSheet.create({
    container: {
        backgroundColor: reallyProgress == 100 ? "green" : colors.light,
        width: "95%",
        height: 180,
        borderRadius: 20,
        padding: 10,
        marginBottom: 7,
        opacity: op,
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
      color: reallyProgress < 100? "black":"white",
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
      borderColor: reallyProgress < 100 ? "black" : colors.light,
      borderRadius: 50,
      justifyContent: "space-around",
      alignItems: "center",
      flexDirection: "row"
    },
    buttonText:{
      color: reallyProgress < 100 ? "black" : colors.light ,
      fontFamily: "OutfitEB"
    }
  }); 

    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.titleStyle}> {title} </Text>
          </View>
          <View style={styles.object}>
            <Progress.Circle showsText={true} textStyle={{fontFamily: "OutfitEB"}} progress={reallyProgress/100} size={70} color={reallyProgress < 100 ? "#22ba22" : colors.light}/>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} disabled={(reallyProgress == 100) ||  op != 1 ? true : false} onPress={handlePress}>
              <Text style={styles.buttonText}> {reallyProgress == 100 ? "Completato": reallyProgress == 0 ? "Inizia" : "Continua"} </Text>
              {reallyProgress < 100 ? <FontAwesome5 name="arrow-right" size={20} color={reallyProgress < 100 ? "black" : colors.light} /> : null}
            </TouchableOpacity>
          </View>
        </View>
    );
};