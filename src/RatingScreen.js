import React ,{Component} from 'react';
import { Text,Image,View,StyleSheet,ScrollView,Button ,
    FlatList,
    AsyncStorage,
    TextInput,
    ActivityIndicator
} from 'react-native';

import { CheckBox,Rating } from 'react-native-elements';

import Connection from "./connection";

export default class RecievedDetails extends React.Component{
    constructor(props){
        super(props);
    
        this.state = {
            data1:[],
            isEmpty:'Wait List is Loading.....',
            refreshing:false,
            avgrate:0,
        }
        //console.log('Orderd Product List Called.');
        this.conn = new Connection();
    }    
    
    componentWillMount(){
        this._cacheData();
    }

    //Fatching data from database
    _cacheData = async () =>{
        try{            
            this.setState({refreshing:true});
            let shop_id = await AsyncStorage.getItem('shop_id');
            console.log(" Id : ",shop_id);
            let sql = "SELECT GCT.gro_cart_id,GCT.rating,GCT.feedback,C.cname FROM  gro_cart_tab As GCT "+
            "Inner Join customer_info_tab AS C On C.customer_info_id = GCT.customer_info_id "+
            "where GCT.gro_shop_info_id = "+shop_id+ ";";
            //console.log(sql);
            const value = await this.conn.Query1(sql);

            if(value.flag){
                this.setState({data1:value.data});
                this.avgMthd()
                //console.log(value.data);
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
    
    avgMthd(){

        let array = this.state.data1;
        var total = 0;
        array.map((el)=>{
            total = total + el.rating;
        });

        var length = Object.keys(array).length;

        const rating = total/length;
        console.log("Average",rating);
        console.log("total",total);
        console.log("length",length);
        this.setState({avgrate:rating});

       // return rating;
    }

    render(){
        //Setting data in flat list
        viewData1 = (item) =>{
          console.log("Rating :",item.rating);
          console.log("avg :",this.state.avgrate);
            return(
                <View style={styles.tabIteam} >
                    <View style={{flexDirection:'row' }}>    
                        <View style={{flex:1}}>
                            <Rating
                                type="star"
                                fractions={1}
                                startingValue={item.rating}
                                readonly
                                imageSize={30}
                            />
                            <Text style={{fontSize:14,textAlign:'center'}}>{item.feedback}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={{fontSize:20,textAlign:'center'}}>{item.cname}</Text>
                        </View>
                    </View>
                </View>
            );
        }

        return(
            <View style={{backgroundColor:'#d9d9dd',height:'100%'}}>
                <Text style={{fontSize:20,marginLeft:5,marginTop:5}}>All Rating</Text>
                <View style={styles.Ratting}>
                    <Text style={{flex:1,fontSize:18}}>Average:</Text>
                    <View style={{flex:1}}> 
                       {(this.state.avgrate) ? <Rating
                            type="star"
                            fractions={1}
                            startingValue={this.state.avgrate}
                            readonly
                            imageSize={30}
                        />
                        :
                        <Text></Text>
                       }
                    </View>
                </View>
                <View style={styles.bgView}>
                    <ScrollView
                    >
                        <FlatList 
                            data = {this.state.data1}
                            renderItem={({item}) => viewData1(item)}
                            keyExtractor={item => item.gro_cart_id.toString()}
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
                        <Text></Text>
                    </ScrollView>
                </View>
            </View>
        );
    }   
}

let styles = StyleSheet.create({
    Ratting:{
        flexDirection:'row',
        height:'8%',
        margin:'1%',
        borderColor:'black',
        backgroundColor:'white',
        borderRadius:10,
        padding:5,
        borderWidth:1
    },
    bgView : {
        margin:'1%',
        padding:'1%',
        borderRadius:15,
        borderWidth:1,
        borderColor:'black'
    },
    tabIteam:{
        padding:7,
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
