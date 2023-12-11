/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import type { PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

import { DataStore } from 'aws-amplify/datastore';  
import { Todo } from './src/models';
import { AuthError, getCurrentUser, signIn,signOut } from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [username, setusername] = useState("digvijaysinh@york.ie");
  const [password, setPassword] = useState("idencia01");
  const [todo, settodo] = useState('')
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  useEffect(() => {   
    
    setTimeout(() => {
      console.log("CONFIGGG",JSON.stringify(Amplify.getConfig()))
    }, 1000);
  }, [])
  
  const loginUser = () => {
    signIn({ username, password, options: { clientMetadata: {} } })
    .then(({ isSignedIn, nextStep }) => {
      console.log("isSignedIn:", isSignedIn);
      console.log("Fething details:", JSON.stringify(nextStep));
      currentAuthenticatedUser();
    })
    .catch((error: AuthError) => {      
      console.log("ERRRR",JSON.stringify(error))
    });
  }
  const logout = () => {
    try {
      signOut().then((result) => {
        console.log("SignedOut success");        
      });
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }
  
  async function currentAuthenticatedUser() {
    try {
      const user = await getCurrentUser();
      console.log("USER :",JSON.stringify(user))
    } catch (err) {      
      console.log(err);
    }
  }
  const saveToDB = async () => {
    try {
      const todoRes = await DataStore.save(
        new Todo({
          name:todo+Platform.OS,
        })
      ).then(()=>{
        console.log('Saved  rrrrr!', JSON.stringify(todo, null, 2));  
        settodo('')
      }).catch(err=>{
        console.log('TodoRes rrrrr!', JSON.stringify(err, null, 2));  
      });
      console.log('TodoRes retrieved successfully!', Platform.OS, JSON.stringify(todoRes, null, 2));
    } catch (error) {
      console.log('Error retrieving todoRes', error);
    }    
  }
  const getData = async () => {
    try {
      const todoRes = await DataStore.query(Todo);
      console.log('Todo retrieved successfully!', JSON.stringify(todoRes, null, 2));
    } catch (error) {
      console.log('Error retrieving posts', error);
    }
  }
  
  
  return (
    <SafeAreaView style={{flex:1}}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{gap:20,padding:20}}>
      <Pressable onPress={loginUser}><Text>Login cognito</Text></Pressable>
      <Pressable onPress={logout}><Text>Logout cognito</Text></Pressable>

      <TextInput value={todo} placeholder='Enter Todo' onChangeText={(val)=>settodo(val)}/>
      <Pressable onPress={saveToDB}><Text>SAVE</Text></Pressable>
      <Pressable onPress={getData}><Text>GET</Text></Pressable>
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
