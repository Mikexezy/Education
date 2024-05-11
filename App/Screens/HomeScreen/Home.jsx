import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions, StatusBar, Animated, ActivityIndicator } from 'react-native';
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
  const [loading, setLoading] = useState(true);

  const headerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    fetchLevelData();
  }, []);

  const fetchLevelData = async () => {
    const userUid = auth.currentUser.uid;
    const databaseRef = ref(db, `users/${userUid}`);

    try {
      const snapshot = await get(databaseRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const id = Object.keys(data).map((element) => ({
          level: element,
          title: data[element].name,
          progress: data[element].progress != undefined || data[element].progress != null ? data[element].progress : [data[element].Part1.progress, data[element].Part2.progress],
          videoid: data[element].videoid != undefined || data[element].videoid != null ? data[element].videoid : [data[element].Part1.videoid, data[element].Part2.videoid],
          gameType: data[element].game != undefined || data[element].game != null ? data[element].game.type : [data[element].Part1.game.type, data[element].Part2.game.type]
        }));

        id.sort((a, b) => parseInt(a.level.slice(3)) - parseInt(b.level.slice(3)));
        setLevelData(id);
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
          {loading == false ? 
            (levelData.map((item, index) => (
              <Level
                key={index}
                id={index}
                title={item.title}
                progress={item.progress}
                reallyProgress={Array.isArray(item.progress) ? ((item.progress[0] + item.progress[1])/2) : item.progress}
                videoid={item.videoid}
                op={index == 0 ? 1 : (Array.isArray(levelData[index - 1].progress) ? (((levelData[index-1].progress[0] + levelData[index-1].progress[1])/2) == 100 ? 1 : 0.5) : (levelData[index-1].progress == 100 ? 1 : 0.5))}
                gameType={item.gameType}
              />
            ))) : (<View style={{backgroundColor:"transparent", alignItems:"center", justifyContent:"center", height: height-(height*0.3), width: "100%"}}><ActivityIndicator size="large" color={"black"} /></View>)
          }
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
