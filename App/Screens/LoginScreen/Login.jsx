import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, TextInput, Text, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { Feather, AntDesign, FontAwesome } from '@expo/vector-icons';
import { colors } from '../../../assets/Colors/Color';

import Animated, {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

import Header from '../../Components/Header/Header';

import {auth} from '../../../firebaseConfig'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const { width, height } = Dimensions.get('window');
const circleDiameter = 0.1 * height;

export default function Login() {
  const navigation = useNavigation();

  const login_button_scale_progress = useSharedValue(circleDiameter);
  const icon_scale_progress = useSharedValue(circleDiameter);
  const icon_opacity_progress = useSharedValue(1);
  const color_icon_scale_animation = useSharedValue("transparent");

  const [name_text, onChangeNameText] = useState('');
  const [email_text, onChangeEmailText] = useState('');
  const [password_text, onChangePasswordText] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const [change_text, onChangeModeSign] = useState('Hai già un account? Accedi');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isLoginButtonPressed, setIsLoginButtonPressed] = useState(1);

  useEffect(() => {
    if(!isSignUpMode){
      if (name_text && email_text && password_text) {
        setIsButtonDisabled(false);
      } else {
        setIsButtonDisabled(true);
      }
    }else if(isSignUpMode){
      if (email_text && password_text) {
        setIsButtonDisabled(false);
      } else {
        setIsButtonDisabled(true);
      }
    }
  }, [name_text, email_text, password_text, isSignUpMode]); 

  const toggleSignMode = () => {
    onChangeModeSign(prevMode => {
      setIsSignUpMode(!isSignUpMode);
      return prevMode === 'Hai già un account? Accedi' ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi';
    });
  };

  const loginButtonStyle = useAnimatedStyle(() => {
    return {
      width: login_button_scale_progress.value,
      height: login_button_scale_progress.value,
      borderRadius: login_button_scale_progress.value / 2,
      backgroundColor: "black",
      alignItems: "center",
      justifyContent: "center"
    };
  });

  const iconContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: color_icon_scale_animation.value,
      width: icon_scale_progress.value,
      height: icon_scale_progress.value,
      opacity: icon_opacity_progress.value,
      borderRadius: icon_scale_progress.value /2,
      justifyContent: "center",
      alignItems: "center"
    };
  });

  const onLoginButtonPress = async () => {
    try {
      setIsLoginButtonPressed(0);
      setIsButtonDisabled(true);
      if (!isSignUpMode) {
        await createUserWithEmailAndPassword(auth, email_text, password_text);
      } else {
        await signInWithEmailAndPassword(auth, email_text, password_text);
      }

      setIsButtonDisabled(false);

      login_button_scale_progress.value = withTiming(100 * circleDiameter, { duration: 500 });
      
      icon_opacity_progress.value = withTiming(0, { duration: 200 });
        
      setTimeout(() => {
        color_icon_scale_animation.value = colors.light;
        icon_opacity_progress.value = withTiming(1, { duration: 200 });
        icon_scale_progress.value = withTiming(100 * circleDiameter, { duration: 500 });
      }, 200);

      setTimeout(() => {
        navigation.navigate('Home');
      }, 500);
    }catch (error){
      setIsLoginButtonPressed(1);
      setIsButtonDisabled(false);
      console.error(error);
    };
  };
  

  return (
      <View style={styles.container}>
        <Header/>
        <View style={styles.login}>
          <View style={styles.login_box}>
            <Text style={styles.login_title}>
              Fai la scelta giusta.
            </Text>

            <View style={styles.sign_box}>
              <View style={styles.sign_box_title_box}>
                <Text style={styles.sign_box_title}>
                  {isSignUpMode ? 'Accedi' : 'Registrati'}
                </Text>
              </View>

              <TextInput
                style={[styles.text_input, isSignUpMode ? styles.disabledTextInput : null]}
                placeholder='Username'
                placeholderTextColor={"black"}
                editable={!isSignUpMode}
                value={name_text}
                onChangeText={onChangeNameText}
              />
              <TextInput
                style={styles.text_input}
                placeholder='Email'
                placeholderTextColor={"black"}
                value={email_text}
                onChangeText={onChangeEmailText}
              />
              <TextInput
                style={styles.text_input}
                placeholder='Password'
                placeholderTextColor={"black"}
                value={password_text}
                onChangeText={onChangePasswordText}
              />

              <TouchableOpacity style={styles.change_sign_mode} onPress={toggleSignMode}>
                <Text style={styles.change_sign_mode_text}> {change_text} </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fast_sign_in_box}>
              <View style={styles.fast_sign_in_title}>
                <Text style={styles.fast_sign_in_title_text}>
                  Accesso diretto con
                </Text>
              </View>
              <View style={styles.fast_sign_in_social_section}>
                <TouchableOpacity style={styles.social_button}>
                  <Feather name="instagram" size={0.07 * width} color="black" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.social_button}>
                  <AntDesign name="google" size={0.07 * width} color="black" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.social_button}>
                  <FontAwesome name="facebook" size={0.07 * width} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={[styles.login_button, isButtonDisabled ? styles.disabled_login_button : null]} disabled={isButtonDisabled} onPress={onLoginButtonPress}>
              <Animated.View style={loginButtonStyle}>
                <Animated.View style={iconContainerStyle}>
                  {isLoginButtonPressed ? (
                    <Feather name="arrow-right" size={0.05 * height} color={"white"}/>
                  ) : (
                    <ActivityIndicator size="large" color="white" />
                  )}
                </Animated.View>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    height: "8%",
    width: "100%",
    backgroundColor: "transparent"
  },
  login: {
    height: "92%",
    width: "100%",
    backgroundColor: "transparent",
    alignItems: "center",
  },
  login_box: {
    width: "90%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "transparent",
    justifyContent: "space-evenly"
  },
  login_title: {
    height: "10%",
    width: "100%",
    backgroundColor: "transparent",
    color: "black",
    fontFamily: "OutfitEB",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 0.1*width
  },
  sign_box: {
    height: "40%",
    width: "100%",
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 50,
    paddingHorizontal: "5%",
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
  fast_sign_in_box: {
    height: "15%",
    width: "100%",
    backgroundColor: "transparent",
  },
  login_button: {
    height: circleDiameter,
    width: circleDiameter,
    borderRadius: circleDiameter / 2,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center"
  },
  disabled_login_button: {
    opacity: 0.2
  },
  text_input: {
    width: "95%",
    height: "20%",
    backgroundColor: colors.light,
    borderRadius: 50,
    marginBottom: 5,
    padding: 15,
    fontFamily: "OutfitR"
  },
  disabledTextInput: {
    opacity: 0.2,
  },
  sign_box_title_box: {
    width: "100%",
    height: "20%",
    backgroundColor: "transparent",
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  sign_box_title: {
    color: "black",
    textAlign: "center",
    fontFamily: "OutfitEB",
    fontSize: height*0.04
  },
  change_sign_mode: {
    height: "5%",
    width: "90%",
    backgroundColor: "transparent",
  },
  change_sign_mode_text: {
    textAlign: "right",
    color: "black",
    fontFamily: "OutfitM"
  },
  social_button: {
    width: 0.15 * width,
    height: 0.15 * width,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: (0.15 * width) / 2
  },
  fast_sign_in_title: {
    width: "100%",
    height: "25%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    justifyContent: "flex-end"
  },
  fast_sign_in_social_section: {
    height: "75%",
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  fast_sign_in_title_text: {
    width: "100%",
    color: "black",
    textAlign: "center",
    fontFamily: "OutfitM",
    backgroundColor: "transparent"
  }
});