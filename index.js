/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { DataStore } from 'aws-amplify/datastore';
import { SQLiteAdapter } from '@aws-amplify/datastore-storage-adapter';
import { Amplify } from 'aws-amplify';
import awsmobile from './src/aws-exports';

Amplify.configure(awsmobile)
DataStore.configure({
  storageAdapter: SQLiteAdapter
});
AppRegistry.registerComponent(appName, () => App);
