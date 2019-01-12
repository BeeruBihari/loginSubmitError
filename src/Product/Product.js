import React ,{Component} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator} from 'react-navigation';
import { Text,Image,TouchableOpacity,View,StyleSheet,ScrollView,AsyncStorage,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Picker,
    Button
} from 'react-native';
import Icon1  from 'react-native-vector-icons/FontAwesome'
import PList from './PDetails';
import AddProC from './AddNewList';
import Connection from '../connection';
import Global from '../../common/constants/Global'; 
// Showing Product Catogory 

class MenuButton extends React.Component{
	render(){
		return(
			<View style={{backgroundColor:"#2874f0"}}>
				<TouchableOpacity onPress={() => { this.props.obj.toggleDrawer() } }>
					<Icon name="menu" style={{color: 'white', padding: 10, marginLeft:5, fontSize: 35}}/>
				</TouchableOpacity>
			</View>
		);
	}
}

class Product extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name:'temp',
            data1:[],
            data:[],
            TempData:[],
            categoryList:[],
            categoryList1:[],
            SubcategoryList:[],
            flag:0,
            addable:false,
            refreshing:false,
            category:"Select Category",
            subCategory:"Select Subcategory",
            isEmpty:'Wait List is Loading.....',
        }
        console.log('Product List Called..');
        this.conn = new Connection();   
    }   

    // Refreash the page on back press from Add Catogory..
    componentWillMount() {
        this.fire();
        this.category();
    }

    // Query data from table 
    fire = async () => {
        try{

            this.setState({refreshing:true});
            const value1 = await AsyncStorage.getItem('shop_id');   
            console.log("Cache Data : " , value1);

            let sql  = "SELECT GM.*,gmt.menu_name,GP.offer,unit_tab.unit_name,GPL.gro_product_name,GPL.pic,GC.gro_cat_name,GS.subcat_name from gro_map_tab As GM "+
            "INNER JOIN gro_subcat_tab As GS ON GM.gro_subcat_id = GS.gro_subcat_id "+
            "Inner JOIN gro_cat_tab As GC ON GM.gro_cat_id = GC.gro_cat_id "+
            "Inner Join unit_tab on unit_tab.unit_id = GM.unit_id "+
            "Inner Join gro_menufacture_tab AS gmt on gmt.menu_id = GM.menu_id "+
            "INNER JOIN gro_product_list_tab AS GPL ON GPL.gro_product_list_id = GM.gro_produt_list_id "+
            "INNER JOIN gro_product_shop_tab As GP ON GM.gro_map_id = GP.gro_map_id WHERE GP.gro_shop_info_id ="+value1;
            
            const value = await this.conn.Query1(sql);
            
            if(value.flag){
                this.setState({data:value.data});
                this.setState({data1:value.data});
            }
            else{
                console.log('Something Error');
                this.setState({isEmpty:value.data});
            }
            this.setState({refreshing:false})   
        }
        catch(error){
            console.log(error);
        }
    }
    
    category = async () => {
        try{
            const value1 = await AsyncStorage.getItem('shop_id');   
            console.log("Cache Data : " , value1);

            let sql = "SELECT GM.gro_map_id, GM.gro_subcat_id,GM.gro_cat_id, GC.gro_cat_name,GS.subcat_name from gro_map_tab As GM "+
            "INNER JOIN gro_subcat_tab As GS ON GM.gro_subcat_id = GS.gro_subcat_id "+
            "Inner JOIN gro_cat_tab As GC ON GM.gro_cat_id = GC.gro_cat_id";

            const value = await this.conn.Query1(sql);
            if(value.flag){
                this.setState({categoryList1:value.data});
                //this.setState({data1:value.data});
                this.setState({addable:true});
            }
            else{
                alert('Something Error');   
            }   
        }
        catch(error){
            console.log(error);
        }
    }

    AddNew = async () => {
        if(this.state.category != "Select Category"){
            if(this.state.subCategory != "Select Subcategory"){
                this.props.navigation.navigate('AddNPC',{
                    category:this.state.category,
                    subCategory:this.state.subCategory
                })
            }
            else{
                alert("Select Subcategory");
            }
        }
        else{
            alert("Select Category.");
        }
    }
    
    render(){
        //Setting data in flat list
        filterCategory = async(itemValue) =>{
            
            this.setState({category:itemValue});
            
            if(itemValue != "Select Category"){
                console.log("Category Method.....",itemValue);
                const CNewList  = this.state.data.filter(item => {      
                    const itemData = `${item.gro_cat_name.toUpperCase()}`;
                    const textData = itemValue.toUpperCase();
                    return itemData.indexOf(textData) > -1;    
                }); 
                console.log( "selected Data :",Object.keys(CNewList).length);
                if(!Object.keys(CNewList).length){
                    await this.setState({data1:CNewList});
                    this.setState({isEmpty:'List is Empty'});       
                }
                else{
                    await this.setState({data1:CNewList}); 
                }
                 this.setState({TempData:CNewList});
                 
                 
                const CNewList1  = this.state.categoryList1.filter(item => {      
                    const itemData = `${item.gro_cat_name.toUpperCase()}`;
                    const textData = itemValue.toUpperCase();
                    return itemData.indexOf(textData) > -1;    
                }); 
                console.log( "selected Data :",Object.keys(CNewList1).length);
                 this.setState({SubcategoryList:CNewList1});
            }
            else
            {
                if(this.state.isEmpty != 'List is Empty'){
                    this.setState({data1:this.state.data});
                }
                console.log('Data Showing.');
            }
        }
    
        ChangeUpdate = async(data) =>{
            //console.log('Sub Category....... ',data);
            await this.setState({subCategory:data});
            if(data != "Select Subcategory"){
                 const CNewList1  = await this.state.TempData.filter(item => {      
                    const itemData = `${item.subcat_name.toUpperCase()}`;
                        const textData = data.toUpperCase();
                        return itemData.indexOf(textData) > -1;    
                });
                console.log( "selected Data in Subcategory :",Object.keys(CNewList1).length);
                if(Object.keys(CNewList1).length){
                    await this.setState({data1:CNewList1});       
                }
                else{
                    this.setState({isEmpty:'List is Empty'});
                    await this.setState({data1:CNewList1});
                }
            }
            else{
                //console.log(this.state.TempData);
                console.log('Error');
                if(this.state.isEmpty != 'List is Empty'){
                    await this.setState({data1:this.state.TempData});
                }
            }        
        }

        viewData = (item) =>{
            console.log(item.offer);
            return(
                <TouchableOpacity
                    style={styles.tabIteam}
                    onPress={() => this.props.navigation.navigate('PList',{
                        data:[item],
                        add:false,                   
                    }) }
                >
                    <View style={{flexDirection:'column' }}>
                        <View style={{flex:1}}>
                        
                            <Image
                                style={styles.Img}
                                source={{uri:Global.PIC_URL+item.pic}}
                            />
                        </View>    
                        <View style={{flex:1}}>
                            <Text style={{fontSize:20}}>{item.gro_product_name}</Text>
                            <Text style={{fontSize:16}}><Icon1 name="rupee" style={{color:'black',fontSize:15}}/> {item.price}  {item.quantity}{item.unit_name}   <Text style={{color:'green'}}>{item.offer}% off</Text></Text>
                            <Text style={{fontSize:18}}>{item.menu_name}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                );
        }
        
        let categoryItem = [];
        let SubcategoryItem = [];
    
        const CList = []; 
        for(let value of this.state.categoryList1){
            //console.log(value.category_name);
            CList.push(value.gro_cat_name);
        }  
        let temp = Array.from(new Set(CList));
        
        for(let value of temp){
            //console.log(value);
            categoryItem.push(<Picker.Item label={value} value={value} />);
        }
        // console.log(temp);
        // console.log('Category Sated.');
        // console.log('-----------------------------------------------');            
        
        
        const SCList = this.state.SubcategoryList.filter(item => {      
            const itemData = `${item.gro_cat_name.toUpperCase()}`;
                const textData = this.state.category.toUpperCase();
                return itemData.indexOf(textData) > -1;    
        });
        
        const SCF = [];
        for(let value of SCList){
            console.log('Sub:',value.subcat_name);
            SCF.push(value.subcat_name);
        }

        const FinalList = Array.from(new Set(SCF));

        for(let value of FinalList){
            SubcategoryItem.push(<Picker.Item label={value} value={value} />);
        }
        // console.log(FinalList);
        // console.log('SubCategory Sated.');
        // console.log('-----------------------------------------------');
           
        return(
            <View style={styles.bgView}>
                <View style={{margin:5}}>
                   <View>
                        <Picker
                            selectedValue={this.state.category}
                            onValueChange={(itemValue, itemIndex) => filterCategory(itemValue)}
                        >
                            <Picker.Item label="Select Category" value="Select Category" />
                            {categoryItem}
                        </Picker>
                   </View>
                   <View>
                        <Picker
                            selectedValue={this.state.subCategory}
                            onValueChange={(itemValue, itemIndex) => ChangeUpdate(itemValue)}
                        >
                            <Picker.Item label="Select Subcategory" value="Select Subcategory" />
                            {SubcategoryItem}               
                        </Picker>
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
                    data = {this.state.data1}
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
                <TouchableOpacity activeOpacity={0.5} onPress={this.AddNew} style={styles.TouchableOpacityStyle} >
 
                <Image source={require('../assets/Floating_Button.png')} 
                
                style={styles.FloatingButtonStyle} />
            
                </TouchableOpacity>
            </View>
        );  
    }   
}

export default RootStack = createStackNavigator(
    {
        product:{
            screen:Product,
            navigationOptions: ({ navigation }) =>({
                headerTitle:'Product ',
                headerLeft: <MenuButton obj={navigation}  />,
            }),
        },
        PList:{
            screen:PList,
            navigationOptions: ({ navigation }) =>({
                headerTitle:'Update Product',
            }),
        },
        AddNPC:{
            screen:AddProC,
            navigationOptions: ({ navigation }) =>({
                headerTitle:'Add New Product',
            }),
        },
    },
    {
        initialRouteName: 'product',
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#003f17',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },  
    }
);


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
        margin:1,
        padding:5,
        elevation: 3,
    },
    Img : {
        flex:1,
        height:120,
        alignItems: 'center',
        marginLeft:'5%',
        marginTop:'5%',
        marginRight:'5%',
        width:'90%',
        borderWidth:0.3,
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    TouchableOpacityStyle:{
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
    },
     
    FloatingButtonStyle: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
    }
}); 
