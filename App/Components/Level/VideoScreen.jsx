import { View, StyleSheet, Dimensions, TouchableOpacity, Platform, BackHandler, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { colors } from '../../../assets/Colors/Color';
import { db, auth } from '../../../firebaseConfig';
import { set, ref, get } from 'firebase/database';
import Cards from '../Game/Cards';
import Definition from '../Game/Definition';
import Related from '../Game/Related_Words';
import { useNavigation } from '@react-navigation/native';

import { Feather, FontAwesome } from '@expo/vector-icons';
import PopUp from '../PopUp/PopUp';

const{width, height} = Dimensions.get("window");

export default function VideoScreen({ route }) {
  const navigation = useNavigation();

  const[videoEnd, setVideoEnd] = useState(false);
  const[video_state, setvideo_state] = useState(true);
  const[answerCorrect, setAnswerCorrect] = useState(false);

  const [noAnswer, setNoAnswer] = useState(true);
  
  const[popUpVisible, setPopUpVisibile] = useState(false);

  useEffect(() => {
    const backAction = () => {
        setPopUpVisibile(true);
        return true;
    };

    const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
    );

    return () => backHandler.remove();
}, []);

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
    navigation.replace("Home");
  };

  const handleAnswerCorrect = (value) => {
    setNoAnswer(false);
    setAnswerCorrect(value);
  };

  const funcStyle = StyleSheet.create({
    shadow:{
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 3,
        },
        android: {
          elevation: 5,
        },
      }),
    }
  })

  function onClose(){
    setPopUpVisibile(false);
  }

  return (
    <View style={styles.container}>
      <PopUp visible={popUpVisible} onClose={onClose}/>
      <YoutubePlayer
        height={210}
        play={video_state}
        videoId={route.params.videoid}
        onChangeState={onStateChange}
        initialPlayerParams={{controls: true, modestbranding: 1, rel: 0}}
      />
      <View style={{flex:1, backgroundColor: "transparent", paddingHorizontal: 0.05 * width, flexDirection:"column", justifyContent:"space-around"}}>
        <View style={{height:0.4 * height, backgroundColor: "transparent"}}>
          {videoEnd == true ? (route.params.gameType == "Cards" ? <Cards level={route.params.levelId} part={route.params.part} onAnswerCorrect={handleAnswerCorrect}/> : (route.params.gameType == "Definition" ? <Definition level={route.params.levelId} part={route.params.part} onAnswerCorrect={handleAnswerCorrect}/> : (route.params.gameType == "Related-Words" ? <Related level={route.params.levelId} part={route.params.part} onAnswerCorrect={handleAnswerCorrect}/> : null))) : null}
        </View>
        <View style={{height:"20%", backgroundColor: "transparent", alignItems:"center", justifyContent:"center"}}>
          <TouchableOpacity style={[funcStyle.shadow, {height: height*0.12, width:height*0.12, backgroundColor:answerCorrect == true ? "green" : (noAnswer == true ? "white" : "red"), borderRadius:(height*0.13)/2, opacity: answerCorrect == true ? 1 : 0.5, justifyContent: "center", alignItems:"center"}]} disabled={!answerCorrect} onPress={completeLevel}>
            {answerCorrect == true ? 
              <Feather name="check" size={45} color="white" />:
              (noAnswer == true ? <FontAwesome name="hand-pointer-o" size={45} color="black" /> : <Feather name="x" size={45} color="white" />)
            }
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