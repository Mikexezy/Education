import React, { useState } from 'react';
import { BackHandler, View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { colors } from '../../../assets/Colors/Color';

export default function PopUp({visible, onClose}) {
  return (
    <Modal
            visible={visible}
            onRequestClose={onClose}
            transparent={true}
            animationType="fade"
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Sei sicuro di voler chiudere l'app?</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, {borderWidth: 1}]} onPress={BackHandler.exitApp}>
                            <Text style={styles.buttonText}>Sì</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {borderWidth:1, borderColor:"green"}]} onPress={onClose}>
                            <Text style={[styles.buttonText, {color:"green"}]}>Annulla</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
  )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3   )',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: colors.light,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        fontFamily: "OutfitEB",
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    buttonText: {
        fontFamily: "OutfitEB",
        fontSize: 16,
    },
});