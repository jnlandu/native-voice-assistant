import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Voice from '@react-native-voice/voice';

export default function HomeScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners).catch(e => console.error('Error cleaning up Voice:', e));
    };
  }, []);

  const onSpeechResults = (result:any) => {
    setResults(result.value);
  };

  const onSpeechError = (error:any) => {
    console.error('Speech Error:', error);
    Alert.alert('Speech Error', error.message);
  };

  // Handlers for recording
  const startRecording = async () => {
    try {
      await Voice.start('en-US');
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording.');
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to stop recording.');
    }
  };

  return (
    <View style={styles.container}>
      {!isRecording ? <Button title="Start Recording" onPress={startRecording} /> : null}
      {isRecording ? <Button title="Stop Recording" onPress={stopRecording} /> : null}
      {results.map((result, index) => (
        <Text key={index}>{result}</Text>
      ))}
      <StatusBar barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
