import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import {AuthError, getCurrentUser, signIn, signOut} from '@aws-amplify/auth';
import {DataStore, OpType} from 'aws-amplify/datastore';
import {Hub} from 'aws-amplify/utils';
import {Todo} from './src/models';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [username, setusername] = useState('digvijaysinh@york.ie');
  const [password, setPassword] = useState('idencia01');
  const [todo, settodo] = useState('');
  const [todoList, settodoList] = useState<Todo[]>([]);

  useEffect(() => {
    // Create listener for datastore sync events
    const listener = Hub.listen('datastore', async hubData => {
      const {event, data} = hubData.payload;
      console.log('Hub listener Datastore event: ' + event);
    });

    // Remove listener
    return () => {
      listener();
    };
  }, []);

  useEffect(() => {
    const subscription = DataStore.observe(Todo).subscribe(value => {
      switch (value.opType) {
        case OpType.INSERT:
          settodoList(prev => [...prev, value.element]);
          break;
        case OpType.DELETE:
          settodoList(prev =>
            prev.filter(item => item.id !== value.element.id),
          );
          break;
        case OpType.UPDATE:
          settodoList(prev =>
            prev.map(item =>
              item.id === value.element.id ? value.element : item,
            ),
          );
          break;
        default:
          break;
      }
    });
    DataStore.start()
      .then(todo => {
        console.log('Datastore has been start', todo);
        getData()
      })
      .catch((err: any) => {
        console.log('Error datastore to start', err);
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
          todoName: todo,
        }),
      )
        .then(() => {
          console.log('Saved !', JSON.stringify(todo, null, 2));
          settodo('');
        })
        .catch(err => {
          console.log('Error on save :', JSON.stringify(err, null, 2));
        });
    } catch (error) {
      console.log('Catch : error on save todo', error);
    }
  };
  const getData = async () => {
    try {
      console.log('Fetching');
      const todoRes = await DataStore.query(Todo);
      console.log(
        'Todo retrieved successfully!',
        JSON.stringify(todoRes, null, 2),
      );
      settodoList(todoRes);
    } catch (error) {
      console.log('Error retrieving todos', error);
    }
  };

  const deleteItem = (todo: Todo) => {
    DataStore.delete(Todo, item => item.id.eq(todo.id))
      .then(value => {
        console.log('DELETED : ', todo.todoName);
      })
      .catch(err => {
        console.log('error on delete: ', err);
      });
  };

  const updateItem = async (todo: Todo) => {
    console.log('TO SAVE:', todo);
    const original = await DataStore.query(Todo, todo.id);
    if (original) {
      DataStore.save(
        Todo.copyOf(original, updated => {
          updated.todoName = todo.todoName;
        }),
      )
        .then(value => {
          console.log('Updated : ', value.todoName);
        })
        .catch(err => {
          console.log('error on update: ', err);
        });
    }
  };

  const renderItem = (item: ListRenderItemInfo<Todo>) => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center',marginTop:20}}>
        <TextInput
          onChangeText={val => {
            let todoListCopy = [...todoList];
            todoListCopy[item.index] = Todo.copyOf(item.item, updated => {
              updated.todoName = val;
            });
            settodoList(todoListCopy);
          }}
          onSubmitEditing={() => {
            updateItem(todoList[item.index]);
          }}
          value={item.item.todoName}
          style={{flex: 1,padding:10,borderBottomWidth:1,borderBottomColor:'grey'}}></TextInput>
        <Text
          onPress={() => {
            deleteItem(item.item);
          }}
          style={{color: 'red',margin:10}}>
          Delete
        </Text>
      </View>
    );
  };
  const sync = async () => {
    await DataStore.clear();
    await DataStore.start().then(() => {
      console.log('Sync started !');
    });
  };
  const clearLocal = async () => {
    await DataStore.clear();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar />
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
          <TouchableOpacity
            style={[styles.button, {backgroundColor: 'orange'}]}
            onPress={currentAuthenticatedUser}>
            <Text style={{color: 'black'}}>Status cognito</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={loginUser}>
            <Text>Sigin cognito</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: 'red'}]}
            onPress={logout}>
            <Text>Logout cognito</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          value={todo}
          placeholder="Enter Todo"
          style={styles.textInput}
          onChangeText={val => settodo(val)}
        />
        <View
          style={{flexDirection: 'row', paddingHorizontal: 20, marginTop: 10}}>
          <TouchableOpacity style={styles.button} onPress={saveToDB}>
            <Text>SAVE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: 'green'}]}
            onPress={getData}>
            <Text>Refresh</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: 'green', marginTop: 20}]}
            onPress={sync}>
            <Text>Force Sync</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: 'red', marginTop: 20}]}
            onPress={clearLocal}>
            <Text>Clear local</Text>
          </TouchableOpacity>
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
