import { View, Text, StyleSheet, TouchableOpacity, Platform, Vibration, Animated, Easing } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db, auth } from '../../../firebaseConfig';
import { get, ref } from 'firebase/database';

export default function Cards({ level, part, onAnswerCorrect }) {
    const [wordList, setWordList] = useState([]);
    const [finishFetch, setFinishFetch] = useState(false);
    const [completedWordList, setCompletedWordList] = useState([]);
    const [correct, setCorrect] = useState([]);
    const [wrong, setWrong] = useState([]);
    const [selected, setSelected] = useState([]);
    
    const [isFlipped, setIsFlipped] = useState(true);

    const [cardRotation] = useState(new Animated.Value(0));

    async function fetchWord(){
      let word = [];
      let userUid = auth.currentUser.uid;
      let path = "users/"+userUid+"/Lvl"+level;
      let dbRef = ref(db, path);
      let snapshot = await get(dbRef);
      if(snapshot.exists()){
        let data = snapshot.val();
        if(data.game != null && data.game != undefined){
          Object.keys(data.game).forEach(key => {
            if (key.startsWith("word")) {
              word.push(data.game[key]);
            }
          });
        }else{
          path += "/Part"+part;
          dbRef = ref(db, path);
          snapshot = await get(dbRef);
          if(snapshot.exists()){
            data = snapshot.val();
            if(data.game != null && data.game != undefined){
              Object.keys(data.game).forEach(key => {
                if (key.startsWith("word")) {
                  word.push(data.game[key]);
                }
              });
            }
          }
        }
      }
      setWordList(word);
    };

    useEffect(() => {
      fetchWord();
    }, []);

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    useEffect(() => {
      let word = generateFullList(wordList);
      setCompletedWordList(shuffleArray(word));
    }, [wordList]);

    useEffect(() => {
      setFinishFetch(true);
    }, [completedWordList])

    function generateFullList(){
      let newList = [];
      for(let i = 0; i < wordList.length; i++){
        newList.push(wordList[i]);
        newList.push(wordList[i]);
      }
      return newList;
    }

    const row1= finishFetch ? [
      completedWordList[0] != undefined ? {id:1 , text:completedWordList[0]} : null,
      completedWordList[1] != undefined ? {id:2 , text:completedWordList[1]} : null,
      completedWordList[2] != undefined ? {id:3 , text:completedWordList[2]} : null,
      completedWordList[3] != undefined ? {id:4 , text:completedWordList[3]} : null,
    ] : [];

    const row2= finishFetch ? [
      completedWordList[4] != undefined ? {id:5 , text:completedWordList[4]} : null,
      completedWordList[5] != undefined ? {id:6 , text:completedWordList[5]} : null,
      completedWordList[6] != undefined ? {id:7 , text:completedWordList[6]} : null,
      completedWordList[7] != undefined ? {id:8 , text:completedWordList[7]} : null,
    ] : [];

    const row3= finishFetch ? [
      completedWordList[8] != undefined ? {id:9 , text:completedWordList[8]} : null,
      completedWordList[9] != undefined ? {id:10 , text:completedWordList[9]} : null,
      completedWordList[10] != undefined ? {id:11 , text:completedWordList[10]} : null,
      completedWordList[11] != undefined ? {id:12 , text:completedWordList[11]} : null,
    ] : [];

    const funcStyles = StyleSheet.create({
      shadow: {
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
      },
      correctPair:{
        backgroundColor: 'green',
        transform: [
          { perspective: 1000 },
          { rotateY: "0deg" }
        ]
      },
      wrongPair: {
        backgroundColor: 'red',
        transform: [
          { perspective: 1000 },
          { rotateY: "0deg" }
        ]
      },
      selected:{
        opacity: 0.5,
        transform: [
          { perspective: 1000 },
          { rotateY: cardRotation.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] }) }
        ]
      },
      cardBox:{
        height:"50",
        width:"23%",
        backgroundColor: "white",
        alignItems:"center",
        justifyContent:"center",
        borderRadius: 10,
        padding: 5,
      }
    });

    function selectCard(id){
      if (selected.length < 2) {
        setSelected([...selected, id]);
        flipCard();
      }
    }

    useEffect(() => {
      console.log(selected);
      if(selected.length == 2){
        let word1, word2;
          for(let i=0; i<row1.length; i++){
            if(row1[i] != null){
              if (row1[i].id == selected[0]) {
                word1 = row1[i].text;
              }
              if (row1[i].id == selected[1]) {
                word2 = row1[i].text;
              }
            }
          }
          for(let i=0; i<row2.length; i++){
            if(row2[i] != null){
              if (row2[i].id == selected[0]) {
                word1 = row2[i].text;
              }
              if (row2[i].id == selected[1]) {
                word2 = row2[i].text;
              }
            }
          }
          for(let i=0; i<row3.length; i++){
            if(row3[i] != null){
              if (row3[i].id == selected[0]) {
                word1 = row3[i].text;
              }
              if (row3[i].id == selected[1]) {
                word2 = row3[i].text;
              }
            }
          }
        if(word1 == word2){
          setCorrect([...correct, ...selected]);
        }else{
          setWrong([...wrong, ...selected]);
          Vibration.vibrate(100);
        }
        setSelected([]);
      }
    }, [selected])

    useEffect(() => {
      if(correct.length == completedWordList.length && finishFetch){
        onAnswerCorrect(true);
      }else if(correct.length != 0){
        onAnswerCorrect(false);
      }else{
      }
    }, [correct]);

    useEffect(() => {
      if (wrong.length > 0) {
        setTimeout(() => {
          setWrong([]);
        }, 500);
      }
    }, [wrong]);

    const flipCard = () => {
      setIsFlipped(!isFlipped);
      Animated.timing(cardRotation, {
        toValue: isFlipped ? 180 : 0,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        setIsFlipped(true);
      });
    };

    useEffect(() => {
      console.log(isFlipped);
    }, [isFlipped]);

    return (
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
              Seleziona correttamente le coppie di parole coperte!
            </Text>
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.rowContainer}>
            {row2.map((card) => (
                card &&
                <Animated.View
                  key={card.id}
                  style={[
                    funcStyles.cardBox,
                    funcStyles.shadow, 
                    correct.includes(card.id) ? (funcStyles.correctPair) : null,
                    wrong.includes(card.id) ? (funcStyles.wrongPair) : null,
                    selected.includes(card.id) ? (funcStyles.selected) : {transform: [
                      { perspective: 1000 },
                      { rotateY: "180deg" }
                    ]}
                  ]}
                >
                  <TouchableOpacity style={{flex: 1}} onPress={() => selectCard(card.id)} disabled={correct.includes(card.id) ? true : (selected.includes(card.id)? true : false)}>
                      <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.cardText}>
                        {card.text}
                      </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            <View style={styles.rowContainer}>
              {row1.map((card) => (
                card &&
                <Animated.View
                  key={card.id}
                  style={[
                    funcStyles.cardBox,
                    funcStyles.shadow, 
                    correct.includes(card.id) ? (funcStyles.correctPair) : null,
                    wrong.includes(card.id) ? (funcStyles.wrongPair) : null,
                    selected.includes(card.id) ? (funcStyles.selected) : {transform: [
                      { perspective: 1000 },
                      { rotateY: "180deg" }
                    ]}
                  ]}
                >
                  <TouchableOpacity style={{flex: 1}} onPress={() => selectCard(card.id)} disabled={correct.includes(card.id) ? true : (selected.includes(card.id)? true : false)}>
                      <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.cardText}>
                        {card.text}
                      </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            <View style={styles.rowContainer}>
            {row3.map((card) => (
                card &&
                <Animated.View
                  key={card.id}
                  style={[
                    funcStyles.cardBox,
                    funcStyles.shadow, 
                    correct.includes(card.id) ? (funcStyles.correctPair) : null,
                    wrong.includes(card.id) ? (funcStyles.wrongPair) : null,
                    selected.includes(card.id) ? (funcStyles.selected) : {transform: [
                      { perspective: 1000 },
                      { rotateY: "180deg" }
                    ]}
                  ]}
                >
                  <TouchableOpacity style={{flex: 1}} onPress={() => selectCard(card.id)} disabled={correct.includes(card.id) ? true : (selected.includes(card.id)? true : false)}>
                      <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.cardText}>
                        {card.text}
                      </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        </View>
      )
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "transparent",
        alignItems: "center",
      },
      titleContainer: {
        width: "100%",
        height: "20%",
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center"
      },
      titleText: {
        width: "100%",
        height: "60%",
        backgroundColor: "transparent",
        textAlign: "center",
        textAlignVertical: "center",
        color: "black",
        fontFamily: "OutfitEB"
      },
      cardContainer: {
        width: "100%",
        height: "80%",
        backgroundColor: "transparent",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center"
      },
      rowContainer:{
        backgroundColor:"transparent",
        width:"100%",
        height:"33%",
        flexDirection:"row",
        justifyContent:"space-evenly"
      },
      cardText:{
        flex:1,
        backgroundColor:"transparent",
        color: "black",
        fontFamily: "OutfitM",
        textAlign:"center",
        textAlignVertical:"center",
      }
    });