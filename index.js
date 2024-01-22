/**
 * @format
 */
import 'core-js/full/symbol/async-iterator';
import {AppRegistry} from 'react-native';
import App from './App';
import App2 from './App2';
import {name as appName} from './app.json';
import {AuthModeStrategyType, DataStore} from 'aws-amplify/datastore';
// import {SQLiteAdapter} from '@aws-amplify/datastore-storage-adapter';
import {Amplify} from 'aws-amplify';
import awsmobile from './src/aws-exports';
import {Todo} from './src/models';
import {ConsoleLogger, defaultStorage} from 'aws-amplify/utils';
import {fetchAuthSession,getCurrentUser} from 'aws-amplify/auth';
import { Auth } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito'

cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);
ConsoleLogger.LOG_LEVEL = 'DEBUG';  

Amplify.configure(awsmobile);
fetchAuthSession()
  .then(async session => {
    console.log("JSON::",session.tokens.accessToken)
    
    DataStore.configure({
      // storageAdapter: SQLiteAdapter,
      fullSyncInterval: 1,
      authProviders: {
        functionAuthProvider: async () => {
          return {
            token: session.tokens.idToken,
          };
        },
      },
    });
  })
  .catch((error) => {    
    console.log("ERRR",error)
    DataStore.configure({
      // storageAdapter: SQLiteAdapter,
    });
  });

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent(appName, () => App2);
