import { View, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { st } from '../../../firebaseConfig';
import { ref as storageRef, getDownloadURL, listAll } from 'firebase/storage';
import YoutubePlayer from 'react-native-youtube-iframe';
import { colors } from '../../../assets/Colors/Color';

export default function VideoScreen({ route }) {
  return (
    <View style={styles.container}>
      <YoutubePlayer
        height={210}
        play={true}
        videoId={route.params.videoid}
      />
      <View style={{flex:1, backgroundColor: "transparent", padding:20}}>
        <View style={{flex:1, backgroundColor: "green"}}/>
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