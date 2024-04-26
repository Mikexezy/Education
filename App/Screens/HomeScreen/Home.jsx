import { View, StyleSheet, StatusBar, ScrollView, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../../../assets/Colors/Color';
import Header from '../../Components/Header/Header';
import Level from '../../Components/Level/Level';
import { auth, db } from '../../../firebaseConfig';
import { get, ref as dbRef } from 'firebase/database';

const {height, width} = Dimensions.get('window');

export default function Home() {
  const [levelCount, setLevelCount] = useState([]);

  useEffect(() => {
    const fetchLevelCount = async () => {
      try {
        const userId = auth.currentUser.uid;
        const userRef = dbRef(db, `users/${userId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const levelNames = Object.keys(userData);
          levelNames.sort((a, b) => {
            const aNumber = parseInt(a.replace('Lvl', ''));
            const bNumber = parseInt(b.replace('Lvl', ''));
            return aNumber - bNumber;
          });
          setLevelCount(levelNames);
        } else {
          console.log("Nessun dato trovato nel nodo utente.");
        }
      } catch (error) {
        console.error("Si è verificato un errore durante il recupero del conteggio dei livelli:", error);
      }
    };
    fetchLevelCount();
  }, []);

  return (
      <View style={styles.container}>
        <Header showProfileButton={true}/>
        <View style={styles.lvlSection}>
          <ScrollView contentContainerStyle={styles.lvlList}>
            <View style={{height: (0.1*height) + StatusBar.currentHeight}}/>
            {levelCount.map((levelName, index) => (
              <Level key={index} progress={0} title={levelName}/>
            ))}
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
    backgroundColor: "transparent",
    flexDirection: "column",
    flexGrow: 1,
    alignItems: "center"
  }
});