import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions, StatusBar, Animated } from 'react-native';
import { colors } from '../../../assets/Colors/Color';
import Header from '../../Components/Header/Header';
import Level from '../../Components/Level/Level';
import { auth, db, st } from '../../../firebaseConfig';
import { get, ref } from 'firebase/database';

const { height } = Dimensions.get('window');
const HEADER_HEIGHT = (0.1 * height) + StatusBar.currentHeight;

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [levelData, setLevelData] = useState([]);

  const headerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetchLevelData();
  }, []);

  const fetchLevelData = async () => {
    const userUid = auth.currentUser.uid;
    const databaseRef = ref(db, `users/${userUid}`);

    try {
      const snapshot = await get(databaseRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const id = Object.keys(data).map((element, index) => ({
          level: element,
          title: data[element].name,
          progress: data[element].progress != undefined && data[element].progress != null ? data[element].progress : (data[element].Part1.progress + data[element].Part2.progress) / 2,
          videoid: data[element].videoid != undefined && data[element].videoid != null ? data[element].videoid : [data[element].Part1.videoid, data[element].Part2.videoid]
        }));

        id.sort((a, b) => parseInt(a.level.slice(3)) - parseInt(b.level.slice(3)));

        setLevelData(id);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching level data:', error);
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
          {levelData.map((item, index) => (
            <Level
              key={index}
              title={item.title}
              progress={item.progress}
              videoid={item.videoid}
              op={index == 0 ? 1 : (levelData[index - 1].progress == 100 ? 1 : 0.5)}
            />
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
