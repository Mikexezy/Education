import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions, StatusBar, Animated } from 'react-native';
import { colors } from '../../../assets/Colors/Color';
import Header from '../../Components/Header/Header';
import Level from '../../Components/Level/Level';
import { auth, db, st } from '../../../firebaseConfig';
import { get, ref } from 'firebase/database';
import { ref as storageRef, listAll } from 'firebase/storage';

const { height } = Dimensions.get('window');
const HEADER_HEIGHT = (0.1 * height) + StatusBar.currentHeight;

export default function Home() {
  const [levelData, setLevelData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  const headerOpacity = useRef(new Animated.Value(1)).current;

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
              if (progressValue != 0) progressValue /= 2;
            } else {
              progressValue = progress || 0;
            }
            let stRef = storageRef(st, title);
            let elementList = await listAll(stRef);
            const elementListLength = elementList.prefixes.length;
            if (elementListLength > 0) {
              stRef = storageRef(st, title + "/" + elementList.prefixes[0].name);
              elementList = await listAll(stRef);
              title = elementList.items[0].name;
            } else {
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

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > 0 && currentOffset > scrollOffset ? 'down' : 'up';
    setScrollOffset(currentOffset);

    Animated.timing(headerOpacity, {
      toValue: direction === 'down' ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLevelData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <Header showProfileButton={true} />
      </Animated.View>
      <View style={styles.lvlSection}>
        <ScrollView
          contentContainerStyle={styles.lvlList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={HEADER_HEIGHT} />}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={{ height: HEADER_HEIGHT }} />
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
  },
  header: {
    height: HEADER_HEIGHT,
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex:10
  }
});
