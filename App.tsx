/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import type { PropsWithChildren } from 'react';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

import { DataStore } from 'aws-amplify/datastore';  


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  
  // const saveToDB = async () => {
  //   try {
  //     const todoRes = await DataStore.save(
  //       new Todo({
  //         name:'Test todo'
  //       })
  //     );
  //     console.log('TodoRes retrieved successfully!', JSON.stringify(todoRes, null, 2));
  //   } catch (error) {
  //     console.log('Error retrieving todoRes', error);
  //   }
  // }
  // const getData = async () => {
  //   try {
  //     const todoRes = await DataStore.query(Todo);
  //     console.log('Todo retrieved successfully!', JSON.stringify(todoRes, null, 2));
  //   } catch (error) {
  //     console.log('Error retrieving posts', error);
  //   }
  // }
  
  
  return (
    <SafeAreaView style={{flex:1}}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{gap:20,padding:20}}>
        <Text>Hii</Text>
      {/* <Pressable onPress={saveToDB}><Text>SAVE</Text></Pressable>
      <Pressable onPress={getData}><Text>GET</Text></Pressable> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
