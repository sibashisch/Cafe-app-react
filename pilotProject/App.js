import React from 'react';
import { Button, View, Text } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';

var currConvList = require ('./convView.js').Component;
var savedThreadList = require('./ThreadView.js').Component;
var historyList = require('./histView.js').Component;

const RootStack = createStackNavigator({
    Home: {
        screen: currConvList,
    },
    Hist: {
        screen: savedThreadList,
    },
    HistOne: {
        screen: historyList,
    }
},
{
    initialRouteName: 'Home',
    headerMode: 'none',
});

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
