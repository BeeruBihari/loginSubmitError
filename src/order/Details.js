import React ,{Component} from 'react';
import { Text,Image,View,StyleSheet,ScrollView,Button ,
    FlatList,
    AsyncStorage,
    TextInput,
    ActivityIndicator
} from 'react-native';

import { CheckBox,Rating } from 'react-native-elements';

import Connection from "../connection";

export default class RecievedDetails extends React.Component{
    constructor(props){
        super(props);
        const {navigation} = this.props;
        let value = navigation.getParam('id',0);
        let name = navigation.getParam('name',0);
        let date = navigation.getParam('date',0);
        let phone = navigation.getParam('phone',0);
        let total = navigation.getParam('total',0);
        let paid = navigation.getParam('paid',0);
        let status = navigation.getParam('status',0);
        let rating = navigation.getParam('rating',0);
        let feedback = navigation.getParam('feedback',0);

        this.state = {
            id:value,
            name:name,
            date:date,
            phone:phone,
            total:total,
            paid:paid,
            status:status,
            data1:[],
            isEmpty:'Wait List is Loading.....',
            refreshing:false,
            BtnStatus:'Packing..',
            ratingValue:rating,
            feedback:feedback
        }
        console.log('Orderd Product List Called.');
        this.conn = new Connection();
    }    
    static navigationOptions = {
        headerTitle: 'Orderd product',      
    };
    
    componentWillMount(){
        this._cacheData();
    }
    //Fatching data from database
    _cacheData = async () =>{
        try{            
            this.setState({refreshing:true});
            console.log(" Id : ",this.state.id);
            let sql = "SELECT unit_tab.unit_name,GR.gro_quantity,GR.real_price,GR.offer_price, M.menu_name,GP.gro_product_name,GP.pic "+
                    ", GR.order_status,GR.gro_order_id from gro_map_tab As GM "+
                    "INNER JOIN unit_tab On unit_tab.unit_id = GM.unit_id "+
                    "INNER JOIN gro_menufacture_tab As M ON M.menu_id = GM.menu_id "+
                    "INNER JOIN gro_product_list_tab As GP ON GP.gro_product_list_id = GM.gro_produt_list_id "+
                    "INNER JOIN gro_order_tab As GR On GR.gro_map_id = GM.gro_map_id "+
                    "WHERE GR.gro_cart_id = "+this.state.id+";";
            //console.log(sql);
            const value = await this.conn.Query1(sql);

            if(value.flag){
                this.setState({data1:value.data});
            }
            else{
                this.setState({isEmpty:value.data});
            }
            this.setState({refreshing:false});
        }
        catch(error){
            console.log(error);
        }
    }
    
    //Set Statud]s As delivered.
    approved = async(id,status) => {
        try{
            let sql = "";
            if(status == "0"){
                sql = "UPDATE gro_order_tab SET order_status = '1' WHERE gro_order_id='"+id+"'";
            }
            else
            {
                sql = "UPDATE gro_order_tab SET order_status = '0' WHERE gro_order_id='"+id+"'";
            }
            const value = this.conn.Query1(sql);
            //console.log(value);

            this._cacheData();

        }
        catch(error){
            console.log(error);
        }
    }

    done = async() => {        
        try{    
            let sql = "";

            for(let value of this.state.data1)
            {
                if(value.order_status == "1")
                    console.log(value.order_id);
                else{
                    console.log(value.order_id);
                    sql = sql + "UPDATE gro_order_tab SET order_status = '1' WHERE gro_order_id='"+value.order_id+"'; ";
                }
            }

            sql = sql + "UPDATE gro_cart_tab SET status = '1' WHERE gro_cart_id='"+this.state.id+"'";

            const value = await this.conn.Query1(sql);
            this.setState({BtnStatus:'Packed.'})
            //console.log(sql);
        }
        catch(error){
            console.log(error);
        }
    }

    render(){
        //Setting data in flat list
        viewData1 = (item) =>{
        //    console.log("status : "+ item.order_status + " result :"+ (item.order_status=='1') ? true : false);
            return(
                <View style={styles.tabIteam} >
                    <View style={{flexDirection:'row' }}>
                        <View style={{flex:1}}>
                            <Image
                                style={styles.Img}
                                source={require('./link2.jpg')}
                            />
                        </View>    
                        <View style={{flex:1}}>
                            <Text style={{fontSize:18,color:'red',textAlign:'center'}}>{item.gro_product_name}</Text>
                            <Text style={{fontSize:14,textAlign:'center'}}>Unit:{item.gro_quantity} ({item.gro_price}/{item.unit_name}) </Text>
                            <Text style={{fontSize:14,textAlign:'center'}}>{item.menu_name}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <CheckBox
                                center
                                size = {20}
                                checked={(item.order_status == '0') ? false : true}
                                onPress = {() => this.approved(item.order_id,item.order_status)}   
                            />
                        </View>
                    </View>
                </View>
            );
        }

        return(
            <View style={{backgroundColor:'#d9d9dd'}}>
                <View style={{margin:5}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1}}>Order Id: {this.state.id}</Text>
                        <Text style={{flex:1,textAlign:'right'}}>Date: {this.state.date}</Text>
                    </View>
                    <Text > Name: {this.state.name}</Text>
                    <Text > Phone No.: {this.state.phone}</Text>
                    {(this.state.status == "0") ? <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1}}>Order Status:</Text>
                        <View style={{flex:1}}>
                            <Button
                                color='green'
                                disabled = {(this.state.BtnStatus == "Packing..")? false:true}
                                title={this.state.BtnStatus}
                                onPress={() => {this.done()}}
                            >
                            </Button>
                        </View>
                    </View> :
                    <Text></Text>}
                </View>
                <ScrollView
                    height='66%'
                >
                    <FlatList 
                        data = {this.state.data1}
                        renderItem={({item}) => viewData1(item)}
                        keyExtractor={item => item.order_id}
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
                </ScrollView>
                <View style={{margin:5}}>
                    <View style={{flexDirection:'row',borderBottomColor:'black',borderBottomWidth:1}}>
                        <Text style={{flex:2}}>Total: </Text>
                        <Text style={{flex:1,borderLeftColor:'black',borderLeftWidth:1}}>{this.state.total} /-</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:2}}>Paid: </Text>
                        <TextInput 
                            style={{flex:1,borderLeftColor:'black',borderLeftWidth:1}}
                            value={this.state.paid}
                            keyboardType='numeric'
                            underlineColorAndroid='transparent'
                            onChangeText={() => {}}
                        >
                        </TextInput>
                    </View>
                    
                    <View style={{borderWidth:1,borderColor:'white',backgroundColor:'white',borderRadius:15,marginTop:2}}>
                        <Text> Feedback : {this.state.feedback} </Text>
                        {(this.state.status != "0") ? <View style={{flexDirection:'row'}}>
                            <Text style={{flex:1}}>Rating :</Text>
                            <View style={{flex:1}}>
                            <Rating
                                type="star"
                                fractions={1}
                                startingValue={this.state.ratingValue}
                                readonly
                                imageSize={30}
                                ratingBackgroundColor="#ebeeef"
                            />
                            </View>
                        </View> :
                        <Text></Text>}
                    </View>
                </View>
            </View>
        );
    }   
}


let styles = StyleSheet.create({
    bgView : {
        backgroundColor:'#ebeeef',
        height:'100%',
        width:'100%',
        padding:'1%',
    },
    tabIteam:{
        backgroundColor:'white',
        borderRadius:5,
        margin:2,
        elevation: 3,
    },
    Img : {
        flex:1,
        height:'90%',
        margin:'5%',
        width:'90%',
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }
}); 
