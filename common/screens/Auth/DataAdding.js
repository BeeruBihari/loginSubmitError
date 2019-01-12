import React, { Component } from "react";
import {
    StyleSheet,
    WebView ,
    View,
    ScrollView,
    FlatList,
    ActivityIndicator,
    AsyncStorage
} from "react-native";
import { Container, Spinner, Button, Text,Content, ListItem, Left, Right,Switch,Header,Body,Title} from 'native-base';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import Global from "../../constants/Global";

export default class HomeScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            Category:[],
            temp:'',
            isEmpty:'Wait List is Loading.....',
        }
    }
    componentDidMount = () => {
        this.fatchCategory();
        setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
    }
    //Get Category List
    fatchCategory = async() => {
        console.log("Method Called");
        fetch(Global.API_URL+'Retailer/getCatrgory', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        }).then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson.data);
            
            this.setState({Category:responseJson.data});
            this.setState({isEmpty:'temp'});
            }).catch((error) => {
                alert("Internal Server Error 500");
                console.log("on error featching:"+error);
        });
    }
    submitData = async () =>{
        
        var user_id = await AsyncStorage.getItem('shop_id');
        console.log("User_id :",user_id);
        fetch(Global.API_URL+'Retailer/AddCategory', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                'data':this.state.Category,
                'id':user_id,
            })
        }).then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            if(responseJson.error != undefined){
                alert("Internal Server error 5004");
            }

            if(responseJson.data == "Success"){
                this.props.navigation.navigate('Home');
            }

            }).catch((error) => {
                alert("Internal Server Error 500");
        });
    }
    UpdateStatus = async (item) =>{
        const temp = [];

        for(let data of this.state.Category) {
          
            if(data.gro_subcat_id == item.gro_subcat_id)
            {
                data.Status = 1;
            }
            temp.push(data);
        }
        this.setState({Category:temp});
    }
    render() {
        const {renderCoponentFlag} = this.state;

        var temp = 0;
        
        viewData =(item) =>{
            if(temp == item.gro_cat_id){
                temp = item.gro_cat_id;
                return(
                    <ListItem>
                        <Left>
                            <Text>{item.subcat_name}</Text>
                        </Left>
                        <Right>
                            <Switch
                                value={(item.Status) ? true : false }
                                onValueChange={(text) => {this.UpdateStatus(item)}}
                            >
                            </Switch>
                        </Right>
                    </ListItem>
                );
            }
            else{
                temp = item.gro_cat_id;
                return(
                    <View>
                        <ListItem itemDivider>
                            <Text>{item.gro_cat_name}</Text>
                        </ListItem>
                        <ListItem>
                            <Left>
                                <Text>{item.subcat_name}</Text>
                            </Left>
                            <Right>
                                <Switch
                                    value={(item.Status) ? true : false }
                                    onValueChange={(text) => {this.UpdateStatus(item)}}
                                >
                                </Switch>
                            </Right>
                        </ListItem>
                    </View>
                )
            } 
        }

        
        if(renderCoponentFlag){
            return(<Container>
                    <Header>
                        <Left/>
                        <Body>
                            <Title>Add Product Category</Title>
                        </Body>
                    </Header>               
                <Content>
                    <ScrollView>
                        <FlatList 
                            data = {this.state.Category}
                            renderItem={({item}) => viewData(item) }
                            keyExtractor={item => item.gro_subcat_id.toString()}
                            ListEmptyComponent={()=>{
                                if(this.state.isEmpty =='Wait List is Loading.....')
                                    return(<View style={{justifyContent:'center'}}>
                                            <ActivityIndicator size="large" color="#0000ff" />
                                            <Text>{this.state.isEmpty}</Text>
                                        </View>);
                                else
                                    return(<View style={{justifyContent:'center'}}>
                                                <Text>{this.state.isEmpty}</Text>
                                            </View>)}}
                        >
                        </FlatList>
                        <Button rounded bordered info 
                            style={{alignSelf:'center',margin:5,paddingHorizontal:20}} 
                            onPress={()=>{this.submitData()}}>
                            <Text>Submit</Text>
                        </Button>
                    </ScrollView>
                </Content>
            </Container>);
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