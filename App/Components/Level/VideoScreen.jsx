import { View, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { st } from '../../../firebaseConfig';
import { ref as storageRef, getDownloadURL, listAll } from 'firebase/storage';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function VideoScreen({ route }) {
  return (
    <View>
      <YoutubePlayer
        height={300}
        play={true}
        videoId={'XzzdFaIOdyY'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
});