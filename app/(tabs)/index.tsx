import { useState, useEffect } from 'react';

import { Image, StyleSheet, Button } from 'react-native';
import * as Location from 'expo-location';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [locations, setLocations] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('locations').then((value) => {
      console.log('value', value)
      setLocations(JSON.parse(value))
    })
  }, [])
  

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log('status', status)
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let { coords } = await Location.getCurrentPositionAsync({});
    console.log('location', coords)
    let locObj = {
      lat: coords.latitude,
      long: coords.longitude
    } 
    console.log([...locations, locObj])
    console.log(JSON.stringify(locations))
    setLocations([...locations, locObj]);
    try {
      await AsyncStorage.setItem('locations', JSON.stringify(locations));
    } catch (e) {
      // saving error
    }

  }
  

  // #1D3D47
  return (
    <ParallaxScrollView
       headerBackgroundColor={{ light: '#A1CEDC', dark: 'rgb(42 65 73 / 50%)' }}
       headerImage={
         <Image
           source={require('@/assets/images/arlequin-icon.png')}
           style={styles.reactLogo}
         />
       }>
       <ThemedView style={styles.titleContainer}>
         <ThemedText type="title">Bienvenido!</ThemedText>
         <HelloWave />
       </ThemedView>
          <Button
             title="Press me" 
            onPress={() => getLocation()} />
            
       <ThemedView style={styles.titleContainer}>
         {
           locations.map((loc, i) => (
            <ThemedView style={styles.coorsContainer}  key={i}>
              <ThemedText type="default">latitude:{loc.lat}</ThemedText>
              <ThemedText type="default">latitude:{loc.long}</ThemedText>
            </ThemedView>
          ))
         }
       </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: '100%',
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  coorsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderColor: '#ffffff'
  }
});
