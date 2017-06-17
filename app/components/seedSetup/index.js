import React from "react";
import styled from "styled-components/native";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image
} from "react-native";

import Iota from "../../libs/iota";
import { InitialiseSeed, OpenBox, randSeed, hashPwd } from "../../libs/crypto";
import { NavigationActions } from "react-navigation";

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seed: "", first: "", second: "" };
  }

  nextRoute = (account, pass, node) => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: "Main",
          params: { account: account, pwd: pass, node: node }
        })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  };

  setup = async (seed, password) => {
    if (this.state.first === this.state.second) {
      this.props.loading("Encrypting Seed");
      // Setup Bool for this
      const node = await Iota.node();

      const passHash = hashPwd(password);
      await InitialiseSeed(seed, passHash);
      const clearSeed = await OpenBox("seed", passHash);
      this.props.loading("Getting Wallet");
      const account = await Iota.getAccount(clearSeed);
      if (!account) {
        this.props.loading();
        return alert("Couldn't fetch wallet");
      }
      this.setState({ seed: "", first: "", second: "" });
      // Push to new page
      this.nextRoute(account, passHash, node);
    } else {
      alert("Your passwords didn't match");
      this.setState({ first: "", second: "" });
    }
  };

  render() {
    return (
      <Col>
        <EmptyCol>
          <Row>
            <BottomBorder full>
              <TInput
                value={this.state.seed}
                autoCorrect={false}
                placeholder={"Enter Seed"}
                placeholderTextColor={"white"}
                selectTextOnFocus={true}
                onChangeText={seed => this.setState({ seed })}
              />
            </BottomBorder>
            {/*<Button onPress={() => console.log("Get Camera")}>
              <ImageButton source={require("../../assets/scan.png")} />
            </Button>*/}
          </Row>
          <Button onPress={() => this.setState({ seed: randSeed(81) })}>
            <AppText>Click to generate a seed</AppText>
          </Button>
        </EmptyCol>
        <EmptyCol>
          <Row>
            <BottomBorder full>
              <TInput
                value={this.state.first}
                autoCorrect={false}
                placeholder={"Enter Password"}
                placeholderTextColor={"white"}
                secureTextEntry={true}
                onChangeText={first => this.setState({ first })}
              />
            </BottomBorder>
          </Row>

          <Row>
            <BottomBorder full>
              <TInput
                value={this.state.second}
                autoCorrect={false}
                placeholder={"Confirm Password"}
                placeholderTextColor={"white"}
                secureTextEntry={true}
                onSubmitEditing={() =>
                  this.setup(this.state.seed, this.state.first)}
                onChangeText={second => this.setState({ second })}
              />
            </BottomBorder>
          </Row>
          <Button onPress={() => this.setup(this.state.seed, this.state.first)}>
            <AppText>Login with Seed</AppText>
          </Button>
        </EmptyCol>

      </Col>
    );
  }
}

const Row = styled.View`
    display: flex;
    flex-direction: row;   
    justify-content: center;
    align-items: center;
    padding: 20px 0;
`;
const Col = styled.View`
    display: flex;
    height:80%;
    width:80%;
    flex-direction: column;   
    justify-content: space-around;
    align-items: flex-end;
`;
const EmptyCol = styled.View`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const BottomBorder = styled.View`
    flex: 1;
    border-bottom-width: 3px;
    border-bottom-color: white;
`;
const TInput = styled.TextInput`
    height: 40px;
    color: white;
    text-align: center;
    border-bottom-width: 3px;
    border-bottom-color: white;    
`;

const AppText = styled.Text`
    color: white;
`;

const ImageButton = styled.Image`
    width:25px;
    height: 25px;
`;

const Button = styled.TouchableOpacity`
    justify-content: center;
    padding: 10px;
    margin:20px 0px;
    margin-bottom: -5px;
    background-color: rgba(255,255,255,.3);
    width: ${props => (props.full ? "100%" : "auto")};
`;
