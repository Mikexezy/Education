import { View, Text, StyleSheet, TouchableOpacity, Platform, Vibration } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db, auth } from '../../../firebaseConfig';
import { ref, get } from 'firebase/database';
import { colors } from '../../../assets/Colors/Color';

export default function Related({ level, part, onAnswerCorrect }) {
  const [wordList, setWordList] = useState([]);
  const [correctWord, setCorrectWord] = useState([]);
  const [correct, setCorrect] = useState([]);
  const [wrong, setWrong] = useState([]);
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    async function fetchWord() {
      setKeyPressed(false);
      setWordList([]);
      setCorrectWord([]);
      setCorrect([]);
      setWrong([]);

      let userUid = auth.currentUser.uid;
      let path = "users/" + userUid + "/Lvl" + level;
      let dbRef = ref(db, path);
      let snapshot = await get(dbRef);
      let word = [];

      if (snapshot.exists()) {
        let data = snapshot.val();
        if (data.game != null && data.game != undefined) {
          Object.keys(data.game).forEach(key => {
            if (key.startsWith("word")) {
              word.push(data.game[key]);
            }
          });
        } else {
          path += "/Part" + part;
          dbRef = ref(db, path);
          snapshot = await get(dbRef);
          if (snapshot.exists()) {
            data = snapshot.val();
            Object.keys(data.game).forEach(key => {
              if (key.startsWith("word")) {
                word.push(data.game[key]);
              }
            });
          }
        }
      }

      setCorrectWord(word.slice(0, 4));

      while (word.length < 6) {
        const seed = Math.floor(Math.random() * 1000);
        let casualLevel = 0;
        while (casualLevel === level || casualLevel === 0) {
          casualLevel = Math.floor(Math.random() * (15 - 1) + 1);
        }

        path = "users/" + userUid + "/Lvl" + casualLevel;
        dbRef = ref(db, path);
        snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.game != null && data.game != undefined) {
            Object.keys(data.game).forEach(key => {
              if (key.startsWith("word") && !word.includes(data.game[key]) && word.length < 6) {
                word.push(data.game[key]);
              }
            });
          } else {
            Object.keys(data.Part1.game).forEach(key => {
              if (key.startsWith("word") && !word.includes(data.Part1.game[key]) && word.length < 6) {
                word.push(data.Part1.game[key]);
              }
            });
            Object.keys(data.Part2.game).forEach(key => {
              if (key.startsWith("word") && !word.includes(data.Part2.game[key]) && word.length < 6) {
                word.push(data.Part2.game[key]);
              }
            });
          }
        }
      }

      word = shuffleArray(word);
      setWordList(word);
    };

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    fetchWord();
  }, []);

  useEffect(() => {
    console.log(correct.length, correctWord.length, wrong.length, keyPressed)
    if(correct.length == correctWord.length && correct.length != 0 && wrong.length == 0){
      onAnswerCorrect(true);
      console.log("ciao");
    }else if(!keyPressed){
    }else{
      onAnswerCorrect(false);
    }
  }, [correct, wrong]);


  const row1 = wordList.length >= 3 ? [
    { id: 1, text: wordList[0] },
    { id: 2, text: wordList[1] },
    { id: 3, text: wordList[2] },
  ] : [];

  const row2 = wordList.length >= 6 ? [
    { id: 4, text: wordList[3] },
    { id: 5, text: wordList[4] },
    { id: 6, text: wordList[5] },
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
    correctSelection: {
      backgroundColor: "green"
    },
    wrongSelection: {
      backgroundColor: "red"
    }
  });

  function selectCard(id) {
    setKeyPressed(true);
    for (let i = 0; i < 3; i++) {
      if (row1[i].id === id) {
        if (correctWord.includes(row1[i].text)) {
          if (correct.includes(id)) {
            setCorrect(prevCorrect => prevCorrect.filter(item => item !== id));
          } else {
            setCorrect(prevCorrect => [...prevCorrect, id]);
          }
        } else {
          if (wrong.includes(id)) {
            setWrong(prevWrong => prevWrong.filter(item => item !== id));
          } else {
            setWrong(prevWrong => [...prevWrong, id]);
            Vibration.vibrate(100);
          }
        }
      }
      if (row2[i].id === id) {
        if (correctWord.includes(row2[i].text)) {
          if (correct.includes(id)) {
            setCorrect(prevCorrect => prevCorrect.filter(item => item !== id));
          } else {
            setCorrect(prevCorrect => [...prevCorrect, id]);
          }
        } else {
          if (wrong.includes(id)) {
            setWrong(prevWrong => prevWrong.filter(item => item !== id));
          } else {
            setWrong(prevWrong => [...prevWrong, id]);
            Vibration.vibrate(100);
          }
        }
      }
    }
  }  

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Seleziona tutte le parole trattate nel video!</Text>
      </View>
      <View style={styles.answerContainer}>
        <View style={styles.row}>
          {row1.map((card) => (
            <TouchableOpacity
              style={[funcStyles.shadow, styles.card, correct.includes(card.id)? funcStyles.correctSelection : null, wrong.includes(card.id)? funcStyles.wrongSelection : null]}
              key={card.id}
              onPress={() => selectCard(card.id)}
            >
              <Text style={styles.cardText}>{card.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.row}>
          {row2.map((card) => (
            <TouchableOpacity
              style={[funcStyles.shadow, styles.card, correct.includes(card.id)? funcStyles.correctSelection : null, wrong.includes(card.id)? funcStyles.wrongSelection : null]}
              key={card.id}
              onPress={() => selectCard(card.id)}
            >
              <Text style={styles.cardText}>{card.text}</Text>
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
  titleContainer: {
    width: "100%",
    height: "25%",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center"
  },
  titleText: {
    color: "black",
    fontFamily: "OutfitEB",
    width: "90%",
    height: "80%",
    backgroundColor: "transparent",
    textAlignVertical: "center",
    textAlign: "center"
  },
  answerContainer: {
    backgroundColor: "transparent",
    width: "100%",
    height: "75%",
    flexDirection: "column",
    alignItems: "center"
  },
  row: {
    width: "100%",
    height: "50%",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  card: {
    width: "30%",
    height: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  cardText: {
    height: "50%",
    width: "90%",
    backgroundColor: "transparent",
    textAlign: "center",
    textAlignVertical: "center",
    fontFamily: "OutfitM"
  }
});
