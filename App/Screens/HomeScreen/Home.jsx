import { View, StyleSheet, StatusBar, ScrollView, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { colors } from '../../../assets/Colors/Color';
import Header from '../../Components/Header/Header';
import Level from '../../Components/Level/Level';
import { st } from '../../../firebaseConfig';
import { ref, listAll } from 'firebase/storage';

const {height, width} = Dimensions.get('window');

export default function Home() {
  const [folders, setFolders] = React.useState([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const storageRef = ref(st);
      const listResult = await listAll(storageRef);
      const folderUrls = listResult.prefixes.map((folderRef) => folderRef.fullPath);
        setFolders(folderUrls);
    };
  fetchFolders();
  } , []);

  return (
      <View style={styles.container}>
        <Header/>
        <View style={styles.lvlSection}>
          <ScrollView contentContainerStyle={styles.lvlList}>
            <View style={{height: (0.1*height) + StatusBar.currentHeight}}/>
            {folders.map((folderUrl, index) => (
              <Level key={index} progress={0} folderUrl={folderUrl} title={"ciao"} />
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