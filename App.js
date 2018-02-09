/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Realm from 'realm';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import ExampleBridgeNativeModule from './ExampleBridgeNativeModule';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    const CarSchema = {
      name: 'Car',
      properties: {
        make:  'string',
        model: 'string',
        miles: {type: 'int', default: 0},
      }
    };
    const PersonSchema = {
      name: 'Person',
      properties: {
        name:     'string',
        birthday: 'date',
        cars:     'Car[]',
        options: 'string[]',
        dates: 'date[]',
        picture:  'data?' // optional property
      }
    };

    Realm.open({schema: [CarSchema, PersonSchema]})
    .then(realm => {
      // Create Realm objects and write to local storage
      realm.write(() => {
        const myCar = realm.create('Car', {
          make: 'Honda',
          model: 'Civic',
          miles: 1000,
        });
        myCar.miles += 20; // Update a property value
      });

      // Query Realm for all cars with a high mileage
      const cars = realm.objects('Car').filtered('miles > 1000');

      // Will return a Results object with our 1 car
      cars.length // => 1

      // Add another car
      realm.write(() => {
        const myCar = realm.create('Car', {
          make: 'Ford',
          model: 'Focus',
          miles: 2000,
        });

        const newPerson = realm.create('Person', {
          name: 'Yu',
          birthday: '2018-01-20',
          cars: [myCar],
          options: ['abc', 'def'],
        })
      });

      // Query results are updated in realtime
      cars.length // => 2
    })
    .catch(error => {
      console.log(error);
    });

    ExampleBridgeNativeModule.exampleMethod();
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
