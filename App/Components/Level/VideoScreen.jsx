import { View, StyleSheet, Dimensions } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { colors } from '../../../assets/Colors/Color';
import { db, auth } from '../../../firebaseConfig';
import { set, ref, get } from 'firebase/database';
import Coppie from '../Game/Coppie';

const{width, height} = Dimensions.get("window");

export default function VideoScreen({ route }) {
  const[videoEnd, setVideoEnd] = useState(false);
  const[video_state, setvideo_state] = useState(true);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
        setVideoEnd(true);

        let userUid = auth.currentUser.uid;

        if(route.params.part == 1){
          databaseRef = ref(db, 'users/'+userUid+"/Lvl"+route.params.levelId+"/Part1");

        }else if(route.params.part == 2){
          databaseRef = ref(db, 'users/'+userUid+"/Lvl"+route.params.levelId+"/Part2");
          
        }else{
          databaseRef = ref(db, 'users/'+userUid+"/Lvl"+route.params.levelId);
        }

        set(databaseRef, {
          progress: 50,
          videoid: route.params.videoid
        });
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
        <View style={{height:0.4 * height, backgroundColor: "red"}}>
          {videoEnd == true ? (<Coppie height={0.4 * height} width={width - (0.1 * width)} row={3} column={3}/>) : null}
        </View>
        <View style={{height:"20%", backgroundColor: "green"}}/>
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