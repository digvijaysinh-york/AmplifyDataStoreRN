/**
 * @format
 */
import 'core-js/full/symbol/async-iterator';
import {AppRegistry} from 'react-native';
import App from './App';
import App2 from './App2';
import {name as appName} from './app.json';
import { DataStore } from 'aws-amplify/datastore';
import { SQLiteAdapter } from '@aws-amplify/datastore-storage-adapter';
import { Amplify } from 'aws-amplify';
import awsmobile from './src/aws-exports';
import { Todo } from './src/models';
import { ConsoleLogger } from 'aws-amplify/utils';
Amplify.configure(awsmobile)
// ConsoleLogger.LOG_LEVEL = 'DEBUG';
DataStore.configure({
  storageAdapter: SQLiteAdapter,      
  fullSyncInterval: 1,    
});
AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent(appName, () => App2);
