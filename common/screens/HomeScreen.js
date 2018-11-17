import React, { Component } from "react";
import {
    StyleSheet,
    WebView ,
    View,
    AsyncStorage
} from "react-native";
import { Container, Spinner, Button, Text,Content} from 'native-base';
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions } from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import Global from "../constants/Global";

export default class HomeScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
        }
    }
    componentDidMount() {
        setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
    }
    sendBill = async () =>{
        var KEY = await AsyncStorage.getItem('userToken');
        
        if(false){
                  
        }else{
            fetch(Global.API_URL+'SendBill', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization':'Bearer '+KEY,
                },
                body: JSON.stringify({
                    'BillList':'ksdj',
                    'req_id':'ksdjf',
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if(responseJson.error != undefined){
                    alert("Internal Server error 5004");
                    this.setState({SendBillVisible:true});
                    return;
                }
                if(responseJson.success == 'yes'){
                    alert("data sent");
                    return;
                }else{
                    alert("Invalid Email or Password");
                }
                }).catch((error) => {
                    alert("slow network");
                    console.log("on error featching:"+error);
            });
        }
    }
    render() {
        const {renderCoponentFlag} = this.state;
        if(renderCoponentFlag){
            return(
                <Container>
                    <Content>
                        <Button bordered dark onPress={this.sendBill}>
                            <Text>HomeScreen</Text>
                        </Button>
                    </Content>
                </Container>
            );
        }else{
            return (
                <View style={styles.loder}>
                <Spinner  color='blue'/>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    loder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});