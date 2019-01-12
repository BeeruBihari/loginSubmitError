import React ,{Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator} from 'react-navigation';
import { SearchBar} from 'react-native-elements'; // 0.17.0
import { Text,Image,TouchableOpacity,View,StyleSheet,ScrollView,AsyncStorage,
    FlatList,
    TextInput,
    RefreshControl,
    Picker,
    Button,
    ToastAndroid
} from 'react-native';

import Global from '../../common/constants/Global'; 
import Connection from '../connection';

// Showing Product Catogory 
export default class Product extends React.Component{
    constructor(props){
        super(props);

        const {navigation} = this.props;
        let value = navigation.getParam('data',0);
        let flag = navigation.getParam('add',0);
        console.log(value);
        this.state = {
            unitList:[],
            unitSt:[],
            pl_id:value[0].gro_map_id,
            SubCategory:value[0].subcat_name,
            category:value[0].gro_cat_name,
            price:(value[0].price) ?value[0].price :value[0].gro_price,
            offer:value[0].gro_offer,
            pic1:value[0].pic,
            name:value[0].gro_product_name,
            add:flag,
            quantity:value[0].quantity,
            unit:value[0].unit_name,
            unit_id :value[0].unit_id,
        }
        console.log('Product List Called..');
        this.conn = new Connection();
    }

    componentWillMount(){
        this.getUnit();
    }

    getUnitId(){
        const filter1 = this.state.unitSt.filter((value)=>{
            const itemData = `${value.unit_name.toUpperCase()}`;
            const textData = this.state.unit.toUpperCase();
            return itemData.indexOf(textData) > -1;
        })
        console.log(filter1[0].unit_id);
        return filter1[0].unit_id;
    }

    AddNewItem = async () => {
        try{
            var unitId = this.getUnitId();
            ToastAndroid.show("Wait in Process...", ToastAndroid.BOTTOM);
            const value1 = await AsyncStorage.getItem('shop_id');
            let sql = "INSERT INTO gro_product_shop_tab (gro_map_id,gro_shop_info_id,gro_price,offer,quantity,unit_id) "+
            "VALUES ('"+this.state.pl_id+"','"+value1+"','"+this.state.price+"','"+this.state.offer+"','"+this.state.quantity+"','"+unitId+"');";
            //const value = await this.conn.Query1(sql);
            ToastAndroid.show('Added Succcessfully..', ToastAndroid.BOTTOM);                
        }
        catch(error){
            console.log(error);
        }
    }
    
    UpdateItem = async () => {
        try{
             var unitId = this.getUnitId();
            ToastAndroid.show("Wait in Process...", ToastAndroid.BOTTOM);
            const value1 = await AsyncStorage.getItem('shop_id');
            let sql = "UPDATE gro_product_shop_tab SET gro_price='"+this.state.price+"',offer='"+this.state.offer+"',unit_id='"+unitId+"',quantity='"+this.state.quantity+"' WHERE gro_map_id='"+this.state.pl_id+"' AND gro_shop_info_id='"+value1+"';";
            const value = await this.conn.Query1(sql);   
            ToastAndroid.show('Updated Succcessfully..', ToastAndroid.BOTTOM);
        }
        catch(error){
            console.log(error);
        }
    }

    removeItem = async () => {
        try{
            ToastAndroid.show("Wait in Process...", ToastAndroid.BOTTOM);
            const value1 = await AsyncStorage.getItem('shop_id');
            let sql = "DELETE FROM gro_product_shop_tab WHERE gro_map_id='"+this.state.pl_id+"' AND gro_shop_info_id='"+value1+"';";
            const value = await this.conn.Query1(sql);
            ToastAndroid.show('Deleted Succcessfully..', ToastAndroid.BOTTOM); 
        }
        catch(error){
            console.log(error);
        }
    }

    getUnit = async() => {
        try{
            let sql = "select * from unit_tab;";
            const value = await this.conn.Query1(sql);
            //console.log('query Send212');
            if(value.flag){
                
                let unitItem = [];
                for(let temp of value.data) {
                    //console.log(temp.unit_name);
                   unitItem.push(<Picker.Item label={temp.unit_name} value={temp.unit_name} />);
                }
                //console.log(unitItem);
               this.setState({unitList:unitItem});
               this.setState({unitSt:value.data});
            }
            else{
                ToastAndroid.show('Error In fatching Unit', ToastAndroid.BOTTOM);
            } 
        }
        catch(error){
            ToastAndroid.show('Error In fatching Unit', ToastAndroid.BOTTOM);
        }
    }
    render(){ 
        ViewItem = (item) =>{
            //console.log(item);
            this.setState({unit:item.unit});
            return(
            <View style={styles.container}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1}}>Category    :</Text>
                        <Text style={{flex:1}}>{item.category_name}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1}}>SubCategory :</Text>
                        <Text style={{flex:1}}>{item.subcategory_name}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <Image
                                style={styles.Img}
                                source={require('../order/link2.jpg')}
                            />
                        </View>    
                        <View style={{flex:1}}>
                            <Image
                                style={styles.Img}
                                source={{uri: `${item.pic_1}`}}
                            />
                        </View>    
                        <View style={{flex:1}}>
                            <Image
                                style={styles.Img}
                                source={{uri: `${item.pic_1}`}}
                            />
                        </View>    
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1}}>Name :</Text>
                        <Text style={{flex:1}}>{item.p_name}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1}}>Unit :</Text>
                        <View style={{flex:1}}>
                            <Picker
                                selectedValue={this.state.unit}
                                onValueChange={(itemValue, itemIndex) => this.setState({unit:itemValue})}
                            >
                                <Picker.Item label="Kg" value="Kg" />
                                <Picker.Item label="Litre" value="Litre" />
                                <Picker.Item label="Packet(5kg)" value="Packet(5kg)" />
                                <Picker.Item label="Packet(10kg)" value="Packet(10kg)" />
                                <Picker.Item label="g" value="g" />
                            </Picker>
                        </View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1}}>Price :</Text>
                        <Text style={{flex:1}}>{item.price}</Text>
                    </View>
                    <View >
                        <Button 
                            onPress={() => {}}
                            title="Add"
                        />
                    </View>
                </View>
            );
        }
        return(
            <ScrollView style={styles.bgView}>
            <View style={{flexDirection:'row'}}>
                <Text style={{flex:1,fontSize:16}}>Category    :</Text>
                <Text style={{flex:1,fontSize:18,color:'green'}}>{this.state.category}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <Text style={{flex:1,fontSize:16}}>SubCategory :</Text>
                <Text style={{flex:1,fontSize:18,color:'green'}}>{this.state.SubCategory}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <Image
                        style={styles.Img}
                        source={{uri:Global.PIC_URL+this.state.pic1}}
                />    
                <Image
                        style={styles.Img}
                        source={{uri:Global.PIC_URL+this.state.pic1}}
                />    
                <Image
                        style={styles.Img}
                        source={{uri:Global.PIC_URL+this.state.pic1}}
                />    
            </View>
            <View style={{flexDirection:'row'}}>
                <Text style={{flex:1,fontSize:16}}>Name :</Text>
                <Text style={{flex:1,fontSize:18,color:'green'}}>{this.state.name}</Text>
            </View>
            
            <View style={{flexDirection:'row'}}>
                <Text style={{flex:1,fontSize:16}}>Price(%) :</Text>
                <TextInput
                    style={{flex:1}} 
                    underlineColorAndroid='transparent'  
                    placeholder={"Enter Price"}
                    onChangeText = {(text) => { this.setState({price:text});}}
                    value = {this.state.price}
                    keyboardType='numeric'
                    keyboardAppearance='light'
                />
            </View>

            <View style={{flexDirection:'row'}}>
                <Text style={{flex:1,fontSize:16}}>Offer :</Text>
                <TextInput
                    style={{flex:1}} 
                    underlineColorAndroid='transparent'  
                    placeholder={"Enter Offer"}
                    onChangeText = {(text) => { this.setState({offer:text});}}
                    value = {this.state.offer}
                    keyboardType='numeric'
                    keyboardAppearance='light'
                />
            </View>
            <View style={{flexDirection:'row'}}>
                <Text style={{flex:1,fontSize:16}}>Quantity :</Text>
                <TextInput
                    style={{flex:1}} 
                    underlineColorAndroid='transparent'  
                    placeholder={"Enter quantity"}
                    onChangeText = {(text) => { this.setState({offer:text});}}
                    value = {this.state.quantity}
                    keyboardType='numeric'
                    keyboardAppearance='light'
                />
            </View>
            <View style={{flexDirection:'row'}}>
                <Text style={{flex:1,fontSize:16}}>Unit :</Text>
                <View style={{flex:1}}>
                    <Picker
                        selectedValue={this.state.unit}
                        onValueChange={(itemValue, itemIndex) => this.setState({unit:itemValue})}
                    >
                        {this.state.unitList}
                    </Picker>
                </View>
            </View>
            <View >
                {this.state.add ? 
                    <Button 
                        onPress={() => {this.AddNewItem()}}
                        title="Add"
                    />
                    :
                    <View style={{flexDirection:'row',margin:10}}>
                        <View style={{flex:1,margin:2}}>
                            <Button
                                color="green" 
                                onPress={() => {this.UpdateItem()}}
                                title="Update"
                            />      
                        </View>
                        <View style={{flex:1,margin:2}}>
                            <Button
                                color="red" 
                                onPress={() => {this.removeItem()}}
                                title="Remove"
                            />      
                        </View>
                    </View>
                   }
            </View>
        </ScrollView>
        );  
    }   
}

let styles = StyleSheet.create({
    item: {
        textAlign:'center',
        fontSize: 14,
    },
    bgView : {
        backgroundColor:'#ebeeef',
        height:'100%',
        width:'100%',
        padding:'2%',
    },
    Img : {
        flex:1,
        height:100,
        alignItems: 'center',
        marginLeft:'5%',
        marginTop:'5%',
        marginRight:'5%',
        width:'90%',
        borderRadius:15,
        borderWidth:0.3,
    },
    container: {
        flex: 1,
        height:'100%',
        justifyContent: 'center'
    },
}); 
