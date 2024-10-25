import React, { useRef, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import {
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable, 
    ScrollView, 
    StatusBar, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View } from 'react-native';
import { onBoardingData } from '@/configs/constants';
import { scale, verticalScale } from 'react-native-size-matters';
import { useFonts } from 'expo-font';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';



export default function onBoardingScreen() {   

 const  [fontsLoaded, fontError] = useFonts({
  SegoeUI: require('../assets/fonts/Segoe.UI.ttf'),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(
      contentOffsetX / (event.nativeEvent.layoutMeasurement.width)
      );
      setActiveIndex(currentIndex);
  }

  const handleSkip = async () => {
    const nextIndex = activeIndex + 1;
    if (nextIndex < onBoardingData.length) {
      scrollViewRef.current?.scrollTo({
        x: Dimensions.get('window').width  * nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
      // console.log(Dimensions.get('window').width  * nextIndex, 'nextIndex');
    }else {  
      await AsyncStorage.setItem('onboarding', 'true');
      router.push('/(routes)/home');
    } 
   
  }    


  return (
    <LinearGradient
    colors={['#250152',  '#000000']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.container}
    >

    <StatusBar barStyle="light-content" />
    
    <TouchableOpacity
    onPress={handleSkip}
    style={styles.skipContainer}
    >
      <Text style={styles.skipText}>Skip</Text>
      <AntDesign name="right" size={scale(16)} color="white" style={{top:4}} />
    </TouchableOpacity>

    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      ref={scrollViewRef}
    >
        {onBoardingData.map((item: onBoardingDataType, index: number) => (
          <View  key={index} style ={styles.slide}
          >
            {item.image}
            <Text style = {styles.title }>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
         
        ))}

    </ScrollView>
    <View 
     style={styles.paginationContainer}>
      {onBoardingData.map((_, index) => (
        <View
          key={index}
          style={[styles.dot, {opacity: activeIndex === index ? 1 : 0.3}]}
        />
      ))}
     </View>
    </LinearGradient>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  slide: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: scale(24),
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'SegoeUI',
    color: 'white',
    // marginBottom: 20,
  },
  subtitle: {
    width: scale(300),
    marginHorizontal: 'auto',
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: '400',
    fontFamily: 'SegoeUI',
    paddingTop: verticalScale(10),
  },
  paginationContainer: {
    // position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:  'center',
    bottom: verticalScale(70),
    marginHorizontal: scale(150),
    gap: scale(10),
  },
  dot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(100),
    backgroundColor: 'white',
    marginHorizontal: scale(2),
  },
  skipContainer: {
    flex: 1,
    // justifyContent: 'center',
    top: verticalScale(45),
    flexDirection: 'row',
    gap: scale(8),
    justifyContent: 'flex-end',
    marginRight: scale(20),
  },
  skipText: {
    color: 'white',
    fontSize: scale(16),
    fontFamily: 'SegoeUI',
    fontWeight: '400',
  },
});