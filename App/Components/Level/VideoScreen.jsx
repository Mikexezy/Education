import { View, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { colors } from '../../../assets/Colors/Color';

export default function VideoScreen({ route }) {
  const[videoEnd, setVideoEnd] = useState(false);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setVideoEnd(true);
      if(route.params.videoid){
        //perc to 25 per ogni video e 25 per ogni gioco
        console.log("1 parte sola")
      }else{
        //perc to 50
        console.log("più parti")
      }
    }
  }, []);

  useEffect(() =>{
    console.log(route.params.videoid)
    if(Array.isArray(route.params.videoid)){
      //perc to 25 per ogni video e 25 per ogni gioco
      console.log("più parti")
    }else{
      //perc to 50
      console.log("1 parte sola")

    }
  })

  return (
    <View style={styles.container}>
      <YoutubePlayer
        height={210}
        play={true}
        videoId={route.params.videoid}
        onChangeState={onStateChange}
        initialPlayerParams={{controls: false, modestbranding: 1, rel: 0}}
      />
      <View style={{flex:1, backgroundColor: "transparent", padding:20}}>
        {videoEnd == true ? (<View style={{flex:1, backgroundColor: "green"}}/>) : null}
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