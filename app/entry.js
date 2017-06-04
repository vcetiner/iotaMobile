import React, { Component } from "react";
import styled from "styled-components/native";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import { StackNavigator, DrawerNavigator } from "react-navigation";

import InitialScreen from "./routes/initial";
import HomeScreen from "./routes/home";

import Iota from "./libs/iota";

const MainScreenNavigator = DrawerNavigator({
  Home: { screen: HomeScreen }
});

export default (SimpleApp = StackNavigator(
  {
    Initial: { screen: InitialScreen },
    Main: { screen: MainScreenNavigator }
  },
  { headerMode: "screen" }
));
