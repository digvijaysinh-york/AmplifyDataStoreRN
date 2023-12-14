/**
 * React Native DataStore Sample App
 */

import React, {Component} from 'react';
import {Text, StyleSheet, ScrollView} from 'react-native';

import {Amplify} from 'aws-amplify';
import {DataStore, Predicates} from 'aws-amplify/datastore';
import {signIn,signOut} from '@aws-amplify/auth';
import {Todo} from './src/models';

import awsmobile from './src/aws-exports';

Amplify.configure(awsmobile);
let subscription;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    this.loginUser();
  }

  loginUser = () => {
    signIn({
      username: 'digvijaysinh@york.ie',
      password: 'idencia01',
      options: {clientMetadata: {}},
    })
      .then(({isSignedIn, nextStep}) => {
        console.log('isSignedIn:', isSignedIn);
        console.log('Fething details:', JSON.stringify(nextStep));
        this.onQuery();
        subscription = DataStore.observe(Todo).subscribe(msg => {
          console.log('SUBSCRIPTION_UPDATE', msg);
          this.onQuery();
        });
      })
      .catch(error => {
        console.log('ERRRR', JSON.stringify(error));
      });
  };
  logout=()=>{
    signOut().then(()=>{
      console.log("SIginout")
    })
  }
  componentWillUnmount() {
    subscription.unsubscribe();
  }

  onCreatePost() {
    DataStore.save(
      new Todo({
        name: `New Post ${Date.now()}`,
      }),
    );
  }

  async onCreatePostAndComments() {
    const post = new Todo({
      name: `New Post with comments ${Date.now()}`,
    });

    await DataStore.save(post);
  }

  onQuery = async () => {
    const posts = await DataStore.query(Todo,Predicates.ALL);
    console.log('QUERY_POSTS_RESULT', posts);
  };

  onDelete = async () => {
    const deletedPosts = await DataStore.delete(Todo, Predicates.ALL);
    console.log('DELETE_RESULT', deletedPosts);
  };

  render() {
    return (
      <ScrollView
        style={styles.scrollview}
        contentContainerStyle={styles.container}>
          <Text style={styles.text} onPress={this.loginUser}>
          Login
        </Text>  
        <Text style={styles.text} onPress={this.logout}>
          Logout
        </Text>  
        <Text style={styles.text} onPress={this.onCreatePost}>
          Create Post
        </Text>
        <Text style={styles.text} onPress={this.onCreatePostAndComments}>
          Create Post & Comments
        </Text>
        <Text style={styles.text} onPress={this.onQuery}>
          Query Posts
        </Text>
        <Text style={styles.text} onPress={this.onDelete}>
          Delete All Posts
        </Text>
        {this.state.posts.map((post, i) => (
          <Text key={i}>{`${post.name} ${post.rating}`}</Text>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollview: {
    paddingTop: 40,
    flex: 1,
  },
  container: {
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default App;
