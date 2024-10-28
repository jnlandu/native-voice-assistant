import { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import Voice from '@react-native-voice/voice';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function HomeScreen() {
  const [result, setResult] = useState([]);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();


 const getMicrophonePermission = async () => {
  const { status } = await Audio.getPermissionsAsync()
  if ( !status){
    console.log("Permission not granted")
    return false
  }
  else{
    console.log("Permission granted")
    return true
  }
}


useEffect(() => {
  Voice.onSpeechStart = () => setIsRecording(true);
  Voice.onSpeechEnd = () => setIsRecording(false);
  Voice.onSpeechError = (err: any) => {
      console.log('err: ', err);
      setError(err.error.message);
     }
     Voice.onSpeechResults = (result:any) => { 
        console.log('result: ', result.value);
        setResult(result.value); 
      };

  return () => {
    // Cleanup the listeners when the component is unmounted
    Voice.destroy().then(Voice.removeAllListeners);
  };
}, []);

 const startRecording = async () => {
  const hasPermission = await getMicrophonePermission()
  if (!hasPermission){
    console.log(hasPermission)
    return
  } else {
    try {
      await Voice.start('en-US',
        {
          "RECOGNIZER_ENGINE": "GOOGLE",
          "EXTRA_PARTIAL_RESULTS": true
        }
      );
    } catch (error:any) {
      console.error('Failed to start recording:', error);
      setError(error);
    }
  }
}

  const stopRecording = async () => {
    try {
      await Voice.stop();
    } catch (error:any) {
      console.error('Failed to stop recording:', error);
      setError(error);
    }
  }

  return (
  <View style={{ alignItems: 'center', margin: 80}}>
    <Text style={{ fontSize: 20, color: 'green', fontWeight:'500' }}>
       Voice Input :
    </Text>
    <Text style={{ fontSize: 20, color: 'red', fontWeight:'500' }}>
      {result[0] || ""}
    </Text>
    <Text style={{ fontSize: 20, color: 'red', fontWeight:'500' }}>
      {error}
    </Text>
    <TouchableOpacity style={{marginTop: 30}} onPress={isRecording ? stopRecording : startRecording}>
      <Text style={{color: 'red'}}>{
        isRecording ? 'Stop Recording' : 'Start Recording'

      }</Text>
    </TouchableOpacity>
  </View>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});
