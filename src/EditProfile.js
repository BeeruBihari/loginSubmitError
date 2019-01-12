import React, { Component } from "react";
import { 
    Dimensions,
    Picker,
    StyleSheet,
    View,
    NetInfo,
    ToastAndroid,
    AsyncStorage,
    ScrollView,
} from "react-native";
import { Container, Content, Form, Item, Label, Input, Textarea, Button,Text ,Spinner, Left, Right, Card, CardItem, Switch } from 'native-base'
import Global from '../common/constants/Global';
import { Rating } from 'react-native-elements';

const {height,width} = Dimensions.get('window');

export default class EditProfile extends Component {
    static navigationOptions = {
        title:"Edit Profile",
      };
        
    constructor(props) {
        super(props);
        
        this.state = {
            state:'',
            name:'',
            phoneno:'',
            city:'',
            pincode:'',
            address:'',
            renderComponentFlag:false,
            saveButtonDisable:false,
            visiblility:true,
            visiblility1:true,
            DCharge:'0',
        }
    }
    componentDidMount() {
        setTimeout(() => {this.setState({renderComponentFlag: true})}, 0);
        this._getData();
    }
    
    _handle_submit = async () =>{
        var KEY = await AsyncStorage.getItem('userToken_shop');
        var userID = await AsyncStorage.getItem('shop_id');
        console.log("userid:");
        console.log(userID);
        console.log(this.state.name);
        console.log(this.state.phoneno);
        console.log(this.state.city);
        console.log(this.state.pincode);
        console.log(this.state.address);
        console.log(this.state.state);
        var vis = (this.state.visiblility) ? 1 : 0;
        var dloption = (this.state.visiblility) ? 1 : 0;

        // checking net and sending data
        var connectionInfoLocal = '';
        NetInfo.getConnectionInfo().then((connectionInfo) => {
        console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
        if(connectionInfo.type == 'none'){
            console.log("no internet ");
            ToastAndroid.showWithGravityAndOffset(
            'Oops! No Internet Connection',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
            );
            
        }else{
            console.log("yes internet ");
            this.setState({saveButtonDisable:true})
            fetch(Global.API_URL+'profileGR', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization':'Bearer '+KEY,
                },
                body: JSON.stringify({
                    name:this.state.name,
                    city:this.state.city,
                    Pin_Code:this.state.pincode,
                    address:this.state.address,
                    state:this.state.state,
                    id:userID,
                    visiblility:vis,
                    delivery:dloption,
                    dcharge:this.state.DCharge,
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                console.log("resp:",responseJson);
                
                var itemsToSet = responseJson.data; 
                if(responseJson.data == "saved"){
                    this._setData();
                    ToastAndroid.showWithGravityAndOffset(
                        'Sucessfully Saved!',
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50,
                    );
                }
                this.setState({
                    saveButtonDisable:false,
                });
            }).catch((error) => {
                alert("slow network");
                console.log("on error featching:"+error);
                this.setState({
                    saveButtonDisable:false,
                });
            });
        }
        });
        console.log(connectionInfoLocal);
        
    }
    _getData = async () =>{
        var oldProfileData = JSON.parse(await AsyncStorage.getItem('userProfileData'));
        console.log(oldProfileData);
        this.setState({name:oldProfileData.displayName});
        this.setState({address:oldProfileData.address});
        this.setState({city:oldProfileData.city});
        this.setState({phoneno:oldProfileData.contactNO});
        this.setState({pincode:oldProfileData.pincode});
        this.setState({state:oldProfileData.state});
        this.setState({visiblility:(oldProfileData.product_visiblity) ? true : false});
        this.setState({visiblility1:(oldProfileData.isDelivry) ? true : false});
        this.setState({DCharge:oldProfileData.DCharge});
        //this._setData(JSON.stringify(oldProfileData));
    }
    _setData = async() =>{
        var oldProfileData = JSON.parse(await AsyncStorage.getItem('userProfileData'));
        //console.log(oldProfileData);
        oldProfileData.displayName= this.state.name;
        oldProfileData.address = this.state.address;
        oldProfileData.city = this.state.city;
        oldProfileData.contactNO = this.state.phoneno;
        oldProfileData.pincode = this.state.pincode;
        oldProfileData.state = this.state.state;
        oldProfileData.product_visiblity = this.state.visiblility;
        oldProfileData.isDelivry = this.state.visiblility1;
        oldProfileData.DCharge = this.state.DCharge;
        //this._setData(JSON.stringify(oldProfileData));
        await AsyncStorage.setItem('userProfileData', JSON.stringify(oldProfileData));
    }
    render() {
       if(this.state.renderComponentFlag){
        return (
                <Container>
                    <Content>
                        <Card>
                            <CardItem>
                                <Left>
                                    <Text>Rating:</Text>
                                </Left>
                                <Right>
                                     <Rating
                                        type="star"
                                        fractions={1}
                                        startingValue={4.6}
                                        readonly
                                        imageSize={30}
                                    />
                                </Right>
                            </CardItem>
                            <CardItem>
                                <Left>
                                    <Text>Product Visiblity</Text>
                                </Left>
                                <Right>
                                    <Switch
                                        value={this.state.visiblility}
                                        onValueChange={(text) => {this.setState({visiblility:text})} }
                                    >
                                    </Switch>
                                </Right>
                            </CardItem>
                            <CardItem>
                                <Left>
                                    <Text>Home Delivery</Text>
                                </Left>
                                <Right>
                                    <Switch
                                        value={this.state.visiblility1}
                                        onValueChange={(text) => {this.setState({visiblility1:text})} }
                                    >
                                    </Switch>
                                </Right>
                            </CardItem>
                            {(this.state.visiblility1) ?
                                <CardItem>
                                    <Left>
                                        <Text>Delivery Charge</Text>
                                    </Left>
                                    <Right>
                                        <Input bordered
                                            onChangeText = {(text) => { this.setState({DCharge:text});}}
                                            value = {this.state.DCharge.toString()}
                                            placeholder="Free"
                                            keyboardType = 'numeric'
                                        />
                                    </Right>
                                </CardItem>
                            :
                            <Text></Text>
                            }
                        </Card>
                        <ScrollView style={{height:height*(1)}}>
                            <Form>
                                <Item floatingLabel style = {styles.item}>
                                    <Label>Name</Label>
                                    <Input 
                                        onChangeText = {(text) => { this.setState({name:text});}}
                                        value = {this.state.name}
                                    />
                                </Item>
                                <Item floatingLabel style = {styles.item}>
                                    <Label>Phone No</Label>
                                    <Input 
                                        onChangeText = {(text) => { this.setState({phoneno:text});}}
                                        editable={false}
                                        value = {this.state.phoneno}
                                    />
                                </Item>
                                <Item floatingLabel style = {styles.item}>
                                    <Label>City</Label>
                                    <Input 
                                        onChangeText = {(text) => { this.setState({city:text});}}
                                        value = {this.state.city}
                                    />
                                </Item>
                                <Item floatingLabel style = {styles.item}>
                                    <Label>PinCode</Label>
                                    <Input 
                                        onChangeText = {(text) => { this.setState({pincode:text});}}
                                        value = {this.state.pincode}
                                    />
                                </Item>
                                <Item style = {styles.item}>
                                    <Label>Address:</Label>
                                    <Textarea rowSpan={3} bordered style={{width:width*(3/4)}} 
                                        onChangeText = {(text) => { this.setState({address:text});}}
                                        value = {this.state.address}
                                    />
                                </Item>
                                <Item style = {styles.item}>
                                    <Label>State</Label>
                                    <Right>
                                    <Picker
                                        selectedValue={this.state.state}
                                        style={{ height: 50, width: width*(3/4) , backgroundColor:'#eaf1f4' }}
                                        onValueChange={(itemValue, itemIndex) => this.setState({state: itemValue})}>
                                        <Picker.Item label="Andhra Pradesh" value="Andhra Pradesh" />
                                        <Picker.Item label="Arunachal Pradesh" value="Arunachal Pradesh" />
                                        <Picker.Item label="Assam" value="Assam" />
                                        <Picker.Item label="Bihar" value="Bihar" />
                                        <Picker.Item label="Chhattisgarh" value="Chhattisgarh" />
                                        <Picker.Item label="Goa" value="Goa" />
                                        <Picker.Item label="Gujarat" value="Gujarat" />
                                        <Picker.Item label="Haryana" value="Haryana" />
                                        <Picker.Item label="Himachal Pradesh" value="Himachal Pradesh" />
                                        <Picker.Item label="Jammu & Kashmir" value="Jammu & Kashmir" />
                                        <Picker.Item label="Jharkhand" value="Jharkhand" />
                                        <Picker.Item label="Karnataka" value="Karnataka" />
                                        <Picker.Item label="Kerala" value="Kerala" />
                                        <Picker.Item label="Madhya Pradesh" value="Madhya Pradesh" />
                                        <Picker.Item label="Maharashtra" value="Maharashtra" />
                                        <Picker.Item label="Manipur" value="Manipur" />
                                        <Picker.Item label="Meghalaya" value="Meghalaya" />
                                        <Picker.Item label="Mizoram" value="Mizoram" />
                                        <Picker.Item label="Nagaland" value="Nagaland" />
                                        <Picker.Item label="Odisha" value="Odisha" />
                                        <Picker.Item label="Punjab" value="Punjab" />
                                        <Picker.Item label="Rajasthan" value="Rajasthan" />
                                        <Picker.Item label="Sikkim" value="Sikkim" />
                                        <Picker.Item label="Tamil Nadu" value="Tamil Nadu" />
                                        <Picker.Item label="Telangana" value="Telangana" />
                                        <Picker.Item label="Tripura" value="Tripura" />
                                        <Picker.Item label="Uttarakhand" value="Uttarakhand" />
                                        <Picker.Item label="Uttar Pradesh" value="Uttar Pradesh" />
                                        <Picker.Item label="West Bengal" value="West Bengal" />
                                    </Picker>
                                    </Right>
                                </Item>
                                <Button block bordered disabled={this.state.saveButtonDisable} style={{ margin:20}} onPress={() =>{this._handle_submit()}}>
                                    <Text>Save</Text>
                                </Button>  
                            </Form>
                        </ScrollView>
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

/*
    name
    phoneno
    state
    city
    pincode
    address
*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    item:{
       paddingTop: 5,
    }
});