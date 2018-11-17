import React ,{Component} from 'react';
import { Text,Image,TouchableOpacity,View,StyleSheet,ScrollView,AsyncStorage,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Picker,
    Button
} from 'react-native';

import Connection from '../connection';

export default class Product extends React.Component{
    constructor(props){
        super(props);
        const {navigation} = this.props;
        let value = navigation.getParam('category',0);
        let flag = navigation.getParam('subCategory',0);
        this.state = {
            data:[],
            refreshing:false,
            category:value,
            subCategory:flag,
            isEmpty:'Wait List is Loading.....',
        }
        console.log('Product List Called..');
        this.conn = new Connection();   
    }   

    // Refreash the page on back press from Add Catogory..
    componentWillMount() {
        this.fire();
    }

    // Query data from table 
    fire = async () => {
        try{

            this.setState({refreshing:true});
            const value1 = await AsyncStorage.getItem('shop_id');   
            console.log("Cache Data : " , value1);

            let sql  = "SELECT GM.*,gro_product_list_tab.*, GC.gro_cat_name,GS.subcat_name from gro_map_tab As GM "+
            "INNER JOIN gro_subcat_tab As GS ON GM.gro_subcat_id = GS.gro_subcat_id "+
            "Inner JOIN gro_cat_tab As GC ON GM.gro_cat_id = GC.gro_cat_id "+
            "INNER JOIN gro_product_list_tab ON gro_product_list_tab.gro_product_list_id = GM.gro_produt_list_id "+
            "WHERE GM.gro_subcat_id = (SELECT gro_subcat_id from gro_subcat_tab WHERE gro_subcat_tab.subcat_name = '"+this.state.subCategory+"') AND "+ 
            "GM.gro_map_id Not In ( SELECT GM.gro_map_id from gro_map_tab As GM "+ 
            "INNER JOIN gro_product_shop_tab As GP ON GM.gro_map_id = GP.gro_map_id WHERE "+
            "GP.gro_shop_info_id = "+value1+" );";
            console.log('query Send');
            const value = await this.conn.Query1(sql);
            console.log('query Send212');
            if(value.flag){
                this.setState({data:value.data});
            }
            else{
                console.log('Something Error');
                if(value.data == "List is Empty")
                this.setState({isEmpty:value.data});
            }
            this.setState({refreshing:false})   
        }
        catch(error){
            console.log(error);
        }
    }
    
    
    render(){
        viewData = (item) =>{
            //console.log(item.subcategory_id);
            return(<View style={styles.tabIteam}>
                    <View style={{flexDirection:'column' }}>
                        <View style={{flex:1}}>
                        <Image
                            style={styles.Img}
                            source={{uri: `data:image/jpeg;base64,${item.pic}`}}
                        />
                        </View>    
                        <View style={{flex:1}}>
                        <Text style={{fontSize:18,color:'red',textAlign:'center'}}>{item.gro_product_name}</Text>
                            <Text style={{fontSize:14,textAlign:'center'}}>Price :{item.price}  {item.quantity}{item.unit_name}</Text>
                            <Text style={{fontSize:14,textAlign:'center',color:'green'}}>{item.menu_name}</Text>
                            <View >
                                <Button 
                                    onPress={() => this.props.navigation.navigate('PList',{
                                        data:[item],
                                        add:true,                   
                                    }) }
                                    title="Add"
                                />
                            </View>
                        </View>
                    </View>
                </View>);
        }
           
        return(
            <View style={styles.bgView}>
                <View style={{margin:5}}>
                   <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1,fontSize:16}}>Category    :</Text>
                        <Text style={{flex:1,fontSize:18,color:'green'}}>{this.state.category}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex:1,fontSize:16}}>SubCategory :</Text>
                        <Text style={{flex:1,fontSize:18,color:'green'}}>{this.state.SubCategory}</Text>
                    </View>
                </View>
                <ScrollView
                    refreshControl={<RefreshControl 
                        enabled = {true}
                        refreshing={this.state.refreshing}
                        onRefresh = {() => this.fire()}
                    />}
                >
                <FlatList 
                    data = {this.state.data}
                    renderItem={({item}) => viewData(item)}
                    keyExtractor={item => item.gro_map_id}
                    numColumns={2}
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
            </View>
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
        padding:'1%',
    },
    tabIteam:{
        backgroundColor:'white',
        borderRadius:3,
        width:'49%',
        margin:0.5,
        padding:5,
        elevation: 3,
    },
    Img : {
        flex:1,
        height:100,
        alignItems: 'center',
        marginLeft:'5%',
        marginTop:'5%',
        marginRight:'5%',
        width:'90%',
        borderRadius:50,
        borderWidth:0.3,
    },
}); 
