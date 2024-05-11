import { View, Text, StyleSheet, Platform, TouchableOpacity, Vibration } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db, auth } from '../../../firebaseConfig';
import { get, ref } from 'firebase/database';

export default function Definition({level, part, onAnswerCorrect}) {
  const [definition, setDefinition] = useState("");
  const [wordsList, setWordsList] = useState([]);
  const [buttonId, setButtonId] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const fetchDefinition = async () => {
    let word = [];

    const currentUserUid = auth.currentUser.uid;
    const dbRef = ref(db, "users/"+currentUserUid+"/Lvl"+level);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      if(data.game != null && data.game != undefined){
        setDefinition(data.game.definition);
        word.push(data.game.word1);
        setCorrectAnswer(data.game.word1);
      }else{
        if(part == 1){
          setDefinition(data.Part1.game.definition);
          word.push(data.Part1.game.word1);
          setCorrectAnswer(data.Part1.game.word1);
        }else{
          setDefinition(data.Part2.game.definition);
          word.push(data.Part2.game.word1);
          setCorrectAnswer(data.Part2.game.word1);
        }
      }
      const defaultPath = "users/"+currentUserUid+"/Lvl";
      for (let i = 0; i < 3; i++) {
        const seed = Math.floor(Math.random() * 1000);
        let casualLevel = 0;
      
        while (casualLevel == level || casualLevel == 0) {
          casualLevel = Math.floor(Math.random() * (15 - 1) + 1);
        }
      
        let casualWordRef = ref(db, defaultPath + casualLevel);
        const wordSnap = await get(casualWordRef);
        const dat = wordSnap.val();
        
        if (dat.game != null && dat.game != undefined) {
          for(element in word){
            if(dat.game.word1 == element){
              continue;
            }
          }
          if(word.length < 4){
            word.push(dat.game.word1);
          }
        }else{
          for(element in word){
            if(dat.Part1.game.word1 == element || dat.Part2.game.word1 == element){
              continue;
            }
          }
          if(word.length < 4){
            word.push(dat.Part1.game.word1);
          }
          if(word.length < 4){
            word.push(dat.Part2.game.word1);
          }
        }
      }
      const shuffledArray = shuffleArray(word);
      setWordsList(shuffledArray);
    }
  }

  useEffect(() =>{
    fetchDefinition();
  }, []);

  const row1 = wordsList.length >= 2 ? [
    { id: 1, text: wordsList[0] },
    { id: 2, text: wordsList[1] },
  ] : [];

  const row2 = wordsList.length >= 4 ? [
    { id: 3, text: wordsList[2] },
    { id: 4, text: wordsList[3] }
  ] : [];

  function buttonPressed(id) {
    setButtonDisabled(true);
    let correct = false;
  
    for (let i = 0; i < 2; i++) {
      if (row1[i].id === id && row1[i].text === correctAnswer) {
        correct = true;
        break;
      }
    }
  
    if (!correct) {
      for (let i = 0; i < 2; i++) {
        if (row2[i].id === id && row2[i].text === correctAnswer) {
          correct = true;
          break;
        }
      }
    }
  
    setIsCorrect(correct);
    onAnswerCorrect(correct);
    setButtonId(id);
  
    if (!correct) {
      Vibration.vibrate(100);
      setTimeout(() => {
        fetchDefinition();
        setTimeout(() => {
          setButtonId(0);
          setButtonDisabled(false);
        }, 900);
      }, 500);
    }
  }

  const functStyles = StyleSheet.create({
    button:{
      backgroundColor: isCorrect == true ? "green" : "red"
    }
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.definitionContainer}>
        <Text style={styles.definitionText}>{definition}</Text>
      </View>

      <View style={styles.answerContainer}>
        <View style={styles.rowContainer}>
          {row1.map((button) => (
            <TouchableOpacity key={button.id} style={[styles.button, buttonId == button.id ? functStyles.button : null]} onPress={() => buttonPressed(button.id)} disabled={buttonDisabled? true : false}>
              <Text style={styles.answerText}>{button.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.rowContainer}>
          {row2.map((button) => (
            <TouchableOpacity key={button.id} style={[styles.button, buttonId == button.id ? functStyles.button : null]} onPress={() => buttonPressed(button.id)} disabled={buttonDisabled? true : false}>
              <Text style={styles.answerText}>{button.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent"
  },
  definitionContainer: {
    alignItems: "center",
    backgroundColor: "transparent",
    height: "30%",
    width: "100%",
    justifyContent: "center",
  },
  answerContainer: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    flexDirection: "column"
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    height: "50%",
    backgroundColor: "transparent",
    alignItems: "center"
  },
  button: {
    backgroundColor: "white",
    width: "45%",
    height: "85%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
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
  definitionText: {
    backgroundColor: "transparent",
    width:"100%",
    height:"80%",
    color: "black",
    fontFamily: "OutfitEB",
    textAlign: "center",
    textAlignVertical: "center"
  },
  answerText: {
    color: "black",
    fontFamily: "OutfitM",
    backgroundColor: "transparent",
    height: "80%",
    width: "90%",
    textAlign: "center",
    textAlignVertical: "center"
  },
});