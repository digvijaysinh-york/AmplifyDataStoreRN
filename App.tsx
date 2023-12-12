/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {AuthError, getCurrentUser, signIn, signOut} from '@aws-amplify/auth';
import {Amplify} from 'aws-amplify';
import {DataStore, OpType, Predicates} from 'aws-amplify/datastore';
import {Todo} from './src/models';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [username, setusername] = useState('digvijaysinh@york.ie');
  const [password, setPassword] = useState('idencia01');
  const [todo, settodo] = useState('');
  const [todoList, settodoList] = useState<Todo[]>();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const subscription = DataStore.observe(Todo).subscribe(msg => {
    if (msg.opType === OpType.INSERT)
      console.log('Ele : ' + Platform.OS, JSON.stringify(msg.condition?.type));
  });  
  
  useEffect(() => {
    
    DataStore.query(Todo, Predicates.ALL)
      .then(todo => {
        console.log('TODOOO', todo);
      })
      .catch((err: any) => {
        console.log('Errrr', err);
      });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginUser = () => {
    signIn({username, password, options: {clientMetadata: {}}})
      .then(({isSignedIn, nextStep}) => {
        console.log('isSignedIn:', isSignedIn);
        console.log('Fething details:', JSON.stringify(nextStep));
        currentAuthenticatedUser();
      })
      .catch((error: AuthError) => {
        console.log('ERRRR', JSON.stringify(error));
      });
  };
  const logout = () => {
    try {
      signOut().then(result => {
        console.log('SignedOut success');
      });
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };

  async function currentAuthenticatedUser() {
    try {
      const user = await getCurrentUser();
      console.log('USER :', JSON.stringify(user));
    } catch (err) {
      console.log(err);
    }
  }
  const saveToDB = async () => {
    try {
      const todoRes = await DataStore.save(
        new Todo({
          name: todo + Platform.OS,
        }),
      )
        .then(() => {
          console.log('Saved  rrrrr!', JSON.stringify(todo, null, 2));
          settodo('');
        })
        .catch(err => {
          console.log('TodoRes rrrrr!', JSON.stringify(err, null, 2));
        });
    } catch (error) {
      console.log('Error retrieving todoRes', error);
    }
  };
  const getData = async () => {
    try {
      console.log("FETCHING")
      const todoRes = await DataStore.query(Todo).then((todoRes)=>{
        
        settodoList(todoRes);
      }).catch((reason)=>{
        console.log('Error retrieving posts', reason);
      });
      console.log(
        'Todo retrieved successfully!',
        JSON.stringify(todoRes, null, 2),
      );
    } catch (error) {
      console.log('Error retrieving posts2', error);
    }
  };
  const renderItem = (item: ListRenderItemInfo<Todo>) => {
    return <Text>{item.item.name}</Text>;
  };
  const sync = async () => {
    await DataStore.start().then(() => {
      console.log('Sync started !');
    });
  };
  const clearLocal = async () => {
    await DataStore.clear()
  }
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
      // barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      // backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{padding: 20}}>
        <TextInput
          value={username}
          placeholder="Enter username"
          onChangeText={val => setusername(val)}
          style={styles.textInput}
        />
        <TextInput
          value={password}
          placeholder="Enter Password"
          onChangeText={val => setPassword(val)}
          style={styles.textInput}
        />
        <View
          style={{flexDirection: 'row', paddingHorizontal: 10, marginTop: 10}}>
          <Pressable style={[styles.button,{backgroundColor:'orange'}]} onPress={currentAuthenticatedUser}>
            <Text style={{color:'black'}}>Status cognito</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={loginUser}>
            <Text>Sigin cognito</Text>
          </Pressable>
          <Pressable
            style={[styles.button, {backgroundColor: 'red'}]}
            onPress={logout}>
            <Text>Logout cognito</Text>
          </Pressable>
        </View>

        <TextInput
          value={todo}
          placeholder="Enter Todo"
          style={styles.textInput}
          onChangeText={val => settodo(val)}
        />
        <View
          style={{flexDirection: 'row', paddingHorizontal: 20, marginTop: 10}}>
          <Pressable style={styles.button} onPress={saveToDB}>
            <Text>SAVE</Text>
          </Pressable>
          <Pressable
            style={[styles.button, {backgroundColor: 'green'}]}
            onPress={getData}>
            <Text>Refresh</Text>
          </Pressable>
        </View>
        <View style={{flexDirection:'row'}}>
        <Pressable
          style={[
            styles.button,
            {backgroundColor: 'green', marginTop: 20},
          ]}
          onPress={sync}>
          <Text>Start Sync</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            {backgroundColor: 'red', marginTop: 20},
          ]}
          onPress={clearLocal}>
          <Text>Clear local</Text>
        </Pressable>
        </View>
        <FlatList
          data={todoList}
          renderItem={renderItem}
          style={{marginTop: 20}}
        />
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
  button: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 5,
    borderRadius: 20,
  },
  textInput: {borderWidth: 1, borderColor: 'gray', padding: 5, marginTop: 10},
});

export default App;
