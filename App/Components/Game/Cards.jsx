import { View, Text, StyleSheet, TouchableOpacity, Platform, Vibration, Animated, Easing, Image } from 'react-native'
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
    
    const [isFlipped1, setIsFlipped1] = useState(true);
    const [isFlipped2, setIsFlipped2] = useState(true);
    let [cardRotation1] = useState(new Animated.Value(180));
    let [cardRotation2] = useState(new Animated.Value(180));

    let word1, word2;

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
        elevation: 5
      },
      correctPair:{
        elevation: 5,
        backgroundColor: 'green',
        transform: [
          { perspective: 1000 },
          { rotateY: "0deg" }
        ]
      },
      wrongPair: {
        elevation: 5,
        backgroundColor: 'red',
        transform: [
          { perspective: 1000 },
          { rotateY: "0deg" }
        ]
      },
      selected1:{
        opacity: 0.5,
        transform: [
          { perspective: 1000 },
          { rotateY: cardRotation1.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] }) }
        ]
      },
      selected2:{
        opacity: 0.5,
        transform: [
          { perspective: 1000 },
          { rotateY: cardRotation2.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] }) }
        ]
      },
    });

    function selectCard(id){
      if (selected.length < 2) {
        setSelected([...selected, id]);
      }
    }

    useEffect(() => {
      if(selected.length == 2){
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
      }
      if(selected.length > 0){
        flipCard();
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
      if(selected.length == 1){
        Animated.timing(cardRotation1, {
        toValue: isFlipped1 == true ? 0 : 180,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
        }).start(() => {
          setIsFlipped1(!isFlipped1);
        });
      }else{
        Animated.timing(cardRotation2, {
          toValue: isFlipped2 == true ? 0 : 180,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          if(word1 == word2){
            setCorrect([...correct, ...selected]);
          }else{
            setWrong([...wrong, ...selected]);
            Vibration.vibrate(100);
          }
          setIsFlipped1(true);
          setIsFlipped2(true);
          cardRotation1.setValue(180);
          cardRotation2.setValue(180);
          console.log(cardRotation1, cardRotation2);
          setSelected([]);
        });
      }
    };

    return (
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
              Seleziona correttamente le coppie di parole coperte!
            </Text>
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.rowContainer}>
              {row1.map((card) => (
                card &&
                <Animated.View
                  key={card.id}
                  style={[
                    styles.cardBox, 
                    correct.includes(card.id) ? (funcStyles.correctPair) : null,
                    wrong.includes(card.id) ? (funcStyles.wrongPair) : null,
                    selected.includes(card.id) ? (selected.indexOf(card.id) == 0 ? funcStyles.selected1 : (selected.indexOf(card.id) == 1 ? funcStyles.selected2 : null)) : (correct.includes(card.id) ? null : (wrong.includes(card.id) ? null : {transform: [
                      { perspective: 1000 },
                      { rotateY: "180deg" }
                    ], elevation: 5}))
                  ]}
                >
                  <TouchableOpacity style={{height:"100%", width:"100%", alignItems:"center", justifyContent:"center"}} onPress={() => selectCard(card.id)} disabled={correct.includes(card.id) ? true : (selected.includes(card.id)? true : false)}>
                    <View style={[{height: "100%", width:"100%", backgroundColor: "white", position:"absolute", zIndex: 10, alignItems:"center", justifyContent:"center"}, correct.includes(card.id) ? {opacity: 0} : (wrong.includes(card.id) ? {opacity: 0} : null)]}>
                      <Image source={require('../../../assets/headerLogo.png')} style={[{width:"70%", resizeMode:"contain", transform:[{perspective: 1000}, {rotateY: "180deg"}]}, selected.includes(card.id) ? {opacity:0} : null]}/>
                    </View>  
                    <View style={{height:"100%", width:"100%", padding: 5}}>
                      <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[styles.cardText]}>
                        {card.text}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            <View style={styles.rowContainer}>
              {row2.map((card) => (
                card &&
                <Animated.View
                  key={card.id}
                  style={[
                    styles.cardBox, 
                    correct.includes(card.id) ? (funcStyles.correctPair) : null,
                    wrong.includes(card.id) ? (funcStyles.wrongPair) : null,
                    selected.includes(card.id) ? (selected.indexOf(card.id) == 0 ? funcStyles.selected1 : (selected.indexOf(card.id) == 1 ? funcStyles.selected2 : null)) : (correct.includes(card.id) ? null : (wrong.includes(card.id) ? null : {transform: [
                      { perspective: 1000 },
                      { rotateY: "180deg" }
                    ], elevation: 5}))
                  ]}
                >
                  <TouchableOpacity style={{height:"100%", width:"100%", alignItems:"center", justifyContent:"center"}} onPress={() => selectCard(card.id)} disabled={correct.includes(card.id) ? true : (selected.includes(card.id)? true : false)}>
                    <View style={[{height: "100%", width:"100%", backgroundColor: "white", position:"absolute", zIndex: 10, alignItems:"center", justifyContent:"center"}, correct.includes(card.id) ? {opacity: 0} : (wrong.includes(card.id) ? {opacity: 0} : null)]}>
                      <Image source={require('../../../assets/headerLogo.png')} style={[{width:"70%", resizeMode:"contain", transform:[{perspective: 1000}, {rotateY: "180deg"}]}, selected.includes(card.id) ? {opacity:0} : null]}/>
                    </View>  
                    <View style={{height:"100%", width:"100%", padding: 5}}>
                      <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[styles.cardText]}>
                        {card.text}
                      </Text>
                    </View>
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
                    styles.cardBox, 
                    correct.includes(card.id) ? (funcStyles.correctPair) : null,
                    wrong.includes(card.id) ? (funcStyles.wrongPair) : null,
                    selected.includes(card.id) ? (selected.indexOf(card.id) == 0 ? funcStyles.selected1 : (selected.indexOf(card.id) == 1 ? funcStyles.selected2 : null)) : (correct.includes(card.id) ? null : (wrong.includes(card.id) ? null : {transform: [
                      { perspective: 1000 },
                      { rotateY: "180deg" }
                    ], elevation: 5}))
                  ]}
                >
                  <TouchableOpacity style={{height:"100%", width:"100%", alignItems:"center", justifyContent:"center"}} onPress={() => selectCard(card.id)} disabled={correct.includes(card.id) ? true : (selected.includes(card.id)? true : false)}>
                    <View style={[{height: "100%", width:"100%", backgroundColor: "white", position:"absolute", zIndex: 10, alignItems:"center", justifyContent:"center"}, correct.includes(card.id) ? {opacity: 0} : (wrong.includes(card.id) ? {opacity: 0} : null)]}>
                      <Image source={require('../../../assets/headerLogo.png')} style={[{width:"70%", resizeMode:"contain", transform:[{perspective: 1000}, {rotateY: "180deg"}]}, selected.includes(card.id) ? {opacity:0} : null]}/>
                    </View>  
                    <View style={{height:"100%", width:"100%", padding: 5}}>
                      <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[styles.cardText]}>
                        {card.text}
                      </Text>
                    </View>
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
      },
      cardBox:{
        height:"90%",
        width:"23%",
        backgroundColor: "white",
        alignItems:"center",
        justifyContent:"center",
        borderRadius: 10,
        overflow:"hidden"
      }
    });