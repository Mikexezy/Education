import { Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../../../assets/Colors/Color';

export default function Level({ id, title, progress }) {

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
        }
    }); 

    return (
        <TouchableOpacity style={styles.container}>
          <Text style={styles.titleStyle}> {title} </Text>
        </TouchableOpacity>
    );
};
