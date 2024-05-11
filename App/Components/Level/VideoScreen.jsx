import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { colors } from '../../../assets/Colors/Color';
import { db, auth } from '../../../firebaseConfig';
import { set, ref, get } from 'firebase/database';
import Cards from '../Game/Cards';
import Definition from '../Game/Definition';
import Related from '../Game/Related_Words';
import { useNavigation } from '@react-navigation/native';

const{width, height} = Dimensions.get("window");

export default function VideoScreen({ route }) {
  const navigation = useNavigation();

  const[videoEnd, setVideoEnd] = useState(false);
  const[video_state, setvideo_state] = useState(true);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
        setVideoEnd(true);

        let userUid = auth.currentUser.uid;

        if(route.params.part == 1){
          databaseRef = ref(db, 'users/'+userUid+"/Lvl"+route.params.levelId+"/Part1/progress");

        }else if(route.params.part == 2){
          databaseRef = ref(db, 'users/'+userUid+"/Lvl"+route.params.levelId+"/Part2/progress");
          
        }else{
          databaseRef = ref(db, 'users/'+userUid+"/Lvl"+route.params.levelId+"/progress");
        }

        set(databaseRef, 50);
      }}
    , []);

  const videoState = async () => {
    let userUid = auth.currentUser.uid;

    if(route.params.part == 1){
      databaseRef = ref(db, 'users/' + userUid + "/Lvl" + route.params.levelId + "/Part1");
    }else if(route.params.part == 2){
      databaseRef = ref(db, 'users/' + userUid + "/Lvl" + route.params.levelId + "/Part2");
    }else{
      databaseRef = ref(db, 'users/'+userUid+"/Lvl"+route.params.levelId);
    }

    const snapshot = await get(databaseRef);

    if(snapshot.exists()){
      const data = snapshot.val();
      if(data.progress == 50){
        setvideo_state(false);
        setVideoEnd(true);
      }
    }
  };

  useEffect(() => {
    videoState();
  }, []);

  function completeLevel(){
    let userUid = auth.currentUser.uid;

    if(route.params.part == 1){
      databaseRef = ref(db, 'users/' + userUid + "/Lvl" + route.params.levelId + "/Part1/progress");
    }else if(route.params.part == 2){
      databaseRef = ref(db, 'users/' + userUid + "/Lvl" + route.params.levelId + "/Part2/progress");
    }else{
      databaseRef = ref(db, 'users/'+userUid+"/Lvl"+route.params.levelId+"/progress");
    }
    set(databaseRef, 100);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <YoutubePlayer
        height={210}
        play={video_state}
        videoId={route.params.videoid}
        onChangeState={onStateChange}
        initialPlayerParams={{controls: true, modestbranding: 1, rel: 0}}
      />
      <View style={{flex:1, backgroundColor: "transparent", paddingHorizontal: 0.05 * width, flexDirection:"column", justifyContent:"space-around"}}>
        <View style={{height:0.4 * height, backgroundColor: "transparent"}}>
          {videoEnd == true ? (route.params.gameType == "Cards" ? <Cards level={route.params.levelId} part={route.params.part}/> : (route.params.gameType == "Definition" ? <Definition level={route.params.levelId} part={route.params.part}/> : (route.params.gameType == "Related-Words" ? <Related level={route.params.levelId} part={route.params.part}/> : null))) : null}
        </View>
        <View style={{height:"20%", backgroundColor: "transparent", alignItems:"center", justifyContent:"center"}}>
          <TouchableOpacity style={{height: height*0.12, width:height*0.12, backgroundColor:"green", borderRadius:(height*0.13)/2}} onPress={completeLevel}>

          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: colors.light,
    flexDirection: "column"
  },
  text: {
    color: 'white',
  },
});