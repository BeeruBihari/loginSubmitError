//import { log } from "util";
import {
  AsyncStorage,

} from "react-native";
import {ToastAndroid} from 'react-native';
import Global from '../common/constants/Global'; 
export default class Connection {
    constructor(){
        this.state={
        } 
    }
   Query1=async (query) =>{
      ToastAndroid.show('Wait in Process... !', ToastAndroid.SHORT);
        let value ={flag:false,
                    data:[]
                  };     
      const userToken = await AsyncStorage.getItem('userToken');
      //console.log('User Token Global ', Global.USER_TOKEN);
      console.log("Retrive query :",query);
      await  fetch(Global.API_URL+'run_query', {
        method: 'POST',
        headers: {
            'Accept':'application/json',
            'Authorization':'Bearer '+userToken,
        },
        body: JSON.stringify({
            query: query,
        }) 
        }).then((response) => response.json())
            .then((responseJson) => {
              value.flag=true;
              value.data = responseJson.data;
              console.log(responseJson);

              if(Object.keys(value.data).length == 0){
                value.flag = false;
                value.data = 'List is Empty';
              }
          }).catch((error) => {   
             console.log( error.message);
                value.flag=false;
                value.data = "Network request failed" ==error.message?  alert("Check internet connection"):error;
            }); 
            ToastAndroid.show('Process Complete.. !', ToastAndroid.SHORT);
          return value;
  }

    //fire class 
    //fire command for query in database for current selected shop
  Query =async (query) =>{
    ToastAndroid.show('Wait in Process... !', ToastAndroid.SHORT);
      let value ={flag:false,
                  data:[]
                };      
   // let query = "SELECT shop_info_table.*,customer_info_table.* FROM `shop_info_table` INNER JOIN customer_info_table ON shop_info_table.user_id = customer_info_table.user_id WHERE shop_info_table.shop_info_id = "+shopID;
    console.log("Retrive query :",query);
    await  fetch('http://localhost/LaravelMarketG/public/api/register', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          query: query,
      }) 
      }).then((response) => response.json())
          .then((responseJson) => {
            
            value.flag=true;
            value.data = responseJson;
          if(value.data.toString() === "NO"){
            value.flag=false;
            value.data ="There are some error retry.."; 
          }
          else if(Object.keys(value.data).length == 0){
            value.flag = false;
            value.data = 'List is Empty';
          }
         // console.log("On shop  value :", value);
        }).catch((error) => {         
            //  alert("updated slow network");
           console.log( error.message);
          // log.error({error:err})
              value.flag=false;
              value.data = "Network request failed" ==error.message?  alert("Check internet connection"):error;
          }); 
          ToastAndroid.show('Process Complete.. !', ToastAndroid.SHORT);
        return value;
   }

   //Error alert message
   logFn =(error,msg)=>{
    console.log( error);
    ToastAndroid.show(msg, ToastAndroid.LONG);
   }
}