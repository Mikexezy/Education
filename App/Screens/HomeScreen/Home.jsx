import { View, StyleSheet, ScrollView, RefreshControl, Dimensions, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../../../assets/Colors/Color';
import Header from '../../Components/Header/Header';
import Level from '../../Components/Level/Level';
import { auth, db, st } from '../../../firebaseConfig';
import { get, ref } from 'firebase/database';
import { ref as storageRef, listAll } from 'firebase/storage';
import { logEvent } from 'firebase/analytics';

const {height} = Dimensions.get('window');

export default function Home() {
  const [levelData, setLevelData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLevelData();
  }, []);

  const fetchLevelData = async () => {
    try {
      const userId = auth.currentUser.uid;
      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const levels = await Promise.all(Object.entries(userData)
          .sort((a, b) => {
            const levelNumA = parseInt(a[0].replace("Lvl", ""));
            const levelNumB = parseInt(b[0].replace("Lvl", ""));
            return levelNumA - levelNumB;
          })
          .map(async ([title, progress]) => {
            let progressValue = 0; 
            if (progress !== null && typeof progress === 'object') {
              progressValue = Object.values(progress).reduce((acc, curr) => acc + curr, 0);
              if(progressValue != 0)progressValue /= 2;
            } else {
              progressValue = progress || 0; 
            }
            let stRef = storageRef(st, title);
            let elementList = await listAll(stRef);
            const elementListLength = elementList.prefixes.length;
            if(elementListLength > 0){
              stRef = storageRef(st, title+"/"+elementList.prefixes[0].name);
              elementList = await listAll(stRef);
              title = elementList.items[0].name;
            }else{
              title = elementList.items[0].name;
            }
            title = title.replace(/Lvl.+$/, '');
            title = title.split(/(?=[A-Z])/).join(' ');
            return { title, progress: progressValue };
          }));
        setLevelData(levels);
      } else {
        console.log("Nessun dato trovato nel nodo utente.");
      }
    } catch (error) {
      console.error("Si è verificato un errore durante il recupero dei dati dei livelli:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLevelData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Header showProfileButton={true} />
      <View style={styles.lvlSection}>
        <ScrollView
          contentContainerStyle={styles.lvlList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={(0.13*height) + StatusBar.currentHeight}/>}
          showsVerticalScrollIndicator={false}
        >
          <View style={{height: (0.1*height) + StatusBar.currentHeight}}/>
          {levelData.map((level, index) => (
            <Level key={index} title={level.title} progress={level.progress} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  lvlSection: {
    flex: 1,
    backgroundColor: "transparent",
  },
  lvlList: {
    backgroundColor: "transparent",
    flexDirection: "column",
    flexGrow: 1,
    alignItems: "center"
  }
});
