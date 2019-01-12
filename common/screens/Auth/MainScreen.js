import React, { Component } from "react";
import {
    StyleSheet,
    ImageBackground ,
    View,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    TouchableOpacity,
    Linking,
    NetInfo,
    AsyncStorage,
    ToastAndroid,
} from "react-native";
import { Container, Spinner, Button,Text, Item,Input,CheckBox,Content, ListItem,Switch} from 'native-base';
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions } from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
//import { Card } from 'react-native-elements'

import Global from '../../constants/Global';
import { Permissions, Notifications } from 'expo';
import { List } from "react-native-elements";

const {height,width} = Dimensions.get('window');
export default class MainScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
            loginModelVisible:false,
            signUpModelVisible:false,
            forgotModelVisible:false,
            submitButtonDisable:false,
            forgot_submitButtonDisable:false,
            email_or_phone:"",
            password:"",

            reg_name:'',
            reg_email:'',
            reg_phone:'',
            reg_password:'',
            reg_confirm:'',
            reg_submitButtonDisable:false,

            reg_name_valid_color:'white',
            reg_email_valid_color:'white',
            reg_phone_valid_color:'white',
            reg_password_valid_color:'white',
            reg_confirm_valid_color:'white',

            reg_name_valid_icon:'check-circle',
            reg_email_valid_icon:'check-circle',
            reg_phone_valid_icon:'check-circle',
            reg_password_valid_icon:'check-circle',
            reg_confirm_valid_icon:'check-circle',

            avilEmail:true,
            avilPhone:true,

            // forgot passwrod
            forgot_email:'',
            forgot_email_edit:true,
            forgot_email_valid_icon:'check-circle',
            forgot_email_valid_color:'white',
            forgot_avilEmail:true,
            OTPEntered:'',
            OTPreal:'0',
            forgot_OTP_edit:true,

            forgot_password_valid_icon:'check-circle',
            forgot_confirm_valid_icon:'check-circle',
            forgot_password_valid_color:'white',
            forgot_confirm_valid_color:'white',
            forgot_sendOTPButtonDisable:false,
            askOTP:false,
            token1:''

        }
    }
    componentDidMount() {
         //this.generateToken();
        setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
    }
    _openLoginModel = () =>{
        this.setState({
            loginModelVisible:true,
            signUpModelVisible:false,
        })
    }
    _openSignUpModel = () =>{
        this.setState({
            loginModelVisible:false,
            signUpModelVisible:true,
        })
    }

    // Generate Token.
    generateToken = async() => {    
        try{
            //const PUSH_ENDPOINT = 'https://3day.000webhostapp.com/run_query.php';
          
            const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        
            let finalStatus = existingStatus;
          
            // only ask if permissions have not already been determined, because
            // iOS won't necessarily prompt the user a second time.
            if (existingStatus !== 'granted') {
              // Android remote notification permissions are granted during the app
              // install, so this will only ask on iOS
              const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
              finalStatus = status;
            }
          
            // Stop here if the user did not grant permissions 
            if (finalStatus !== 'granted') {
              return;
            }
          
            // Get the token that uniquely identifies this device
           let token = await Notifications.getExpoPushTokenAsync();
           console.log("En token value ",token1);
           this.setState({token1:token})
           console.log('Token Seted')
        }
        catch(error){
            console.log(error);
            console.log('Error in token Generation.');
        }
    }

    
    // handle login 
    _retrieveData = async () => {
        try {
          //await AsyncStorage.setItem('key_login_status_market_g', 'false');

            const value = await AsyncStorage.getItem('key_login_status_market_g');
            if (value !== null) {
                if(value == 'true'){
                    this.setState({
                        login_status: true
                    });
                }
                
            }
        } catch (error) {
            this.setState({
                login_status: false
            });
         }
      }
    _storeData = async (user_email,user_phone,user_name,user_state,user_city,user_landmark,user_address) => {
        try {
          await AsyncStorage.setItem('key_login_status_market_g', 'true');
          await AsyncStorage.setItem('user_email',user_email );
          await AsyncStorage.setItem('user_phone',user_phone );
          await AsyncStorage.setItem('user_name',user_name );
          await AsyncStorage.setItem('user_state',user_state);
          await AsyncStorage.setItem('user_city',user_city );
          await AsyncStorage.setItem('user_landmark',user_landmark );
          await AsyncStorage.setItem('user_address',user_address );


          let email = await AsyncStorage.getItem('user_email');
          let phone = await AsyncStorage.getItem('user_phone');
          let name = await AsyncStorage.getItem('user_name');
          let state = await AsyncStorage.getItem('user_state');
          let city = await AsyncStorage.getItem('user_city');
          let landmark = await AsyncStorage.getItem('user_landmark');
          let address = await AsyncStorage.getItem('user_address');
          console.log("in llogin retriving data ",email,phone,name,state,city,landmark,address);
            console.log("saved in login");
        }catch (error) {
            console.log("Eroor in saving");
        }
    }
    submitLogin = () =>{


        if(this.state.email_or_phone.trim().length == 0 || this.state.password.length == 0 ){
            alert("Enter Email and Password first")
            return;
        }
        
        // now sending request to login
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
            this.setState({submitButtonDisable:true});
            var username = this.state.email_or_phone.toLowerCase();
            var password = this.state.password;
            console.log(username+":"+password);
            fetch(Global.API_URL+'loginGR', {
                method: 'POST',
                headers: {
                    Authorization: 'application/json'
                },
                body: JSON.stringify({
                    email:username,
                    password:password,
                    user_type:'shop',
                    noti_token:this.state.token1,
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if(responseJson.error != undefined){
                    if(responseJson.error== "Unauthorised"){
                        this.setState({submitButtonDisable:false});
                        alert("Invalid Email or password");
                        return;
                    }
                    alert("Internal Server error 5004");
                    
                    this.setState({submitButtonDisable:false});
                    return;
                }
                var itemsToSet = responseJson.success.token; 
                var profileData = responseJson.profileData;
                var userID = responseJson.userID;
                console.log("userid",userID);
                console.log(profileData);
                if(responseJson.status == 'valid'){
                    if(itemsToSet.length != 0 ){
                        this._signInAsync(itemsToSet,JSON.stringify(profileData),userID,"Login");
                        return;
                    }    
                }else{
                    this.setState({submitButtonDisable:false});
                    alert("Invalid Email or Password");
                }
                
                    console.log("resp:",itemsToSet);
                }).catch((error) => {
                    alert("Internal Server Error 500");
                    console.log("on error featching:"+error);
                    this.setState({submitButtonDisable:false});
            });
        }
        });
        console.log(connectionInfoLocal);
    }
    _signInAsync = async (token,profileData,userID,type) => {
        userID = userID + "";//converting to string
        console.log("setting token");
        await AsyncStorage.setItem('userToken_shop', token);
        console.log("setting user data");
        await AsyncStorage.setItem('shop_id', userID);

        await AsyncStorage.setItem('userProfileData', profileData);
        console.log("sending to home");
        if(type == "Login"){
            this.props.navigation.navigate('Home');
        }
        else{
            this.props.navigation.navigate('Data');
        }
        console.log("seneing to app");
    };
    saveNotificationToken = () => {
        console.log("noti");
    }
    

    // handle regiter 
    submitRegister = async () =>{
        if(
            this.state.reg_name_valid_color != 'green' ||
            this.state.reg_phone_valid_color != 'green' ||
            this.state.reg_email_valid_color != 'green' ||
            this.state.reg_password_valid_color != 'green' ||
            this.state.reg_confirm_valid_color != 'green' ||
            this.state.avilEmail != true ||
            this.state.avilPhone != true
        ){
            console.log(this.state.reg_name_valid_color,this.state.reg_phone_valid_color,this.state.reg_email_valid_color,
                this.state.reg_password_valid_color,this.state.reg_confirm_valid_color ,this.state.avilEmail,this.state.avilPhone )
            alert("All fields must be filled correctly.");
            return;
        }
        if(
            this.state.reg_name.trim().length == 0 || 
            this.state.reg_email.trim().length == 0 || 
            this.state.reg_password.trim().length == 0 || 
            this.state.reg_confirm.trim().length == 0 || 
            this.state.reg_phone.trim().length == 0  
        ){
            alert("All Fields are required")
            return;
        }
        if(!this.validateEmail(this.state.reg_email.trim())){
            alert("Invalid Email! Try again!!!");
            return;
        }
        if(this.state.reg_password != this.state.reg_confirm){
            alert("Confirm password dont matched with previous one!!");
            return;
        }


        // now sending request to login
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
            this.setState({reg_submitButtonDisable:true});
            var name = this.state.reg_name;
            var email = this.state.reg_email.toLowerCase();
            var password = this.state.reg_password;
            var c_password = this.state.reg_confirm;
            var phone = this.state.reg_phone;
            console.log(name,":",email,":",password,":",c_password,":",phone);
            fetch(Global.API_URL+'registerGR', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    'name':name,
                    'email':email,
                    'password':password,
                    'c_password':c_password,
                    'phone':phone,
                    'user_type':'shop',
                     noti_token:Date()+"",

                })
            }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if(responseJson.error != undefined){
                    alert("Internal Server error 5004");
                    this.setState({reg_submitButtonDisable:false});
                    return;
                }
                var itemsToSet = responseJson.success.token; 
                var profileData = responseJson.profileData;
                var userID = responseJson.userID;
                if(responseJson.reg_done == 'yes'){
                    console.log("now calling to signin and sending to home");
                    this._signInAsync(itemsToSet,JSON.stringify(profileData),userID,"Register");
                    this.setState({reg_submitButtonDisable:false});
                    return;
                }else{
                    alert("Invalid Email or Password");
                    this.setState({reg_submitButtonDisable:false});
                }
                }).catch((error) => {
                    alert("Internal Server Error 500");
                    console.log("on error featching:"+error);
                    this.setState({reg_submitButtonDisable:false});
            });
        }
        });
        console.log(connectionInfoLocal);
    }
    validateEmail = (email) => {
        var re =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    validateName = (name)=>{
        return !/[^a-zA-Z ]/.test(name);
    }
    validatephone = (phone) =>{
        return /^[0-9]+$/.test(phone);
    }
    
    REGcheckName =(text)=>{
        // valdating name

        if(text.trim().length != 0){
            if(this.validateName(text) && text.length > 2){
                this.setState({
                    reg_name_valid_color:'green',
                    reg_name_valid_icon:'check-circle'
                });
                console.log("valid name");
            }else{
                this.setState({
                    reg_name_valid_color:'red',
                    reg_name_valid_icon:'close-circle'
                });
            }
        }
    }
    REGcheckEmail = (text) =>{
        // valdating email
        if(text.trim().length != 0 ){
            if(this.validateEmail(text) && text.length > 5){
                this.setState({
                    reg_email_valid_color:'green',
                    reg_email_valid_icon:'check-circle'
                });
                console.log("valid email");
            }else{
                this.setState({
                    reg_email_valid_color:'red',
                    reg_email_valid_icon:'close-circle'
                });
            }
        }
    }
    REGcheckPhone = (text) =>{
        //validation phone
        if(text.trim().length != 0){
            if(this.validatephone(text) && text.length == 10){
                this.setState({
                    reg_phone_valid_color:'green',
                    reg_phone_valid_icon:'check-circle'
                });
                console.log("valid phone");
            }else{
                this.setState({
                    reg_phone_valid_color:'red',
                    reg_phone_valid_icon:'close-circle'
                });
            }
        }
    }
    REGcheckPassword = (text) =>{
        //validating password
        if(text.trim().length != 0){
            if(text.length >= 4){
                this.setState({
                    reg_password_valid_color:'green',
                    reg_password_valid_icon:'check-circle'
                });
                console.log("valid password");
            }else{
                this.setState({
                    reg_password_valid_color:'red',
                    reg_password_valid_icon:'close-circle'
                });
            }
        }
    }
    REGcheckConfirm = (text) =>{
        if(this.state.reg_password == text){
            this.setState({
                reg_confirm_valid_icon:'check-circle',
                reg_confirm_valid_color:'green',
            })
        }else{
            this.setState({
                reg_confirm_valid_icon:'close-circle',
                reg_confirm_valid_color:'red',
            })
        }
    }
    checkAvilEmail = (text) =>{
        // now sending request to login
        console.log("Checking for avil email");

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
                fetch(Global.API_URL+'AvilEmail', {
                    method: 'POST',
                    headers: {},
                    body: JSON.stringify({
                        email:text,
                        check:'email',
                    })
                }).then((response) => response.json())
                .then((responseJson) => {
                    var itemsToSet = responseJson.data ;
                    console.log("resp:",itemsToSet);
                    if(itemsToSet.status == true){
                        this.setState({
                            avilEmail:true,
                        })
                    }else{
                        this.setState({
                            avilEmail:false,
                        })
                    }

                }).catch((error) => {
                        alert("Internal Server Error 500");
                        console.log("on error featching:"+error);
                });
            }
        });
    }
    checkAvilPhone = () =>{
        console.log("Checking for avil phone");
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
                fetch(Global.API_URL+'AvilPhone', {
                    method: 'POST',
                    headers: {},
                    body: JSON.stringify({
                        phone:this.state.reg_phone,
                        check:'phone',
                    })
                }).then((response) => response.json())
                .then((responseJson) => {
                    var itemsToSet = responseJson.data ;
                    console.log("resp:",itemsToSet);
                    if(itemsToSet.status == true){
                        this.setState({
                            avilPhone:true,
                        })
                    }else{
                        this.setState({
                            avilPhone:false,
                        })
                    }

                }).catch((error) => {
                        alert("Internal Server Error 500");
                        console.log("on error featching:"+error);
                });
            }
        });
    }
    // forgot password attat
    forgotPasswordStart = ()=>{
        this.setState({
            loginModelVisible:false,
            signUpModelVisible:false,
            forgotModelVisible:true,

             // forgot passwrod
             forgot_email:'',
             forgot_email_edit:true,
             forgot_email_valid_icon:'check-circle',
             forgot_email_valid_color:'white',
             forgot_avilEmail:true,
             OTPEntered:'',
             OTPreal:'0',
             forgot_OTP_edit:true,
 
             forgot_password_valid_icon:'check-circle',
             forgot_confirm_valid_icon:'check-circle',
             forgot_password_valid_color:'white',
             forgot_confirm_valid_color:'white',
             forgot_sendOTPButtonDisable:false,
             askOTP:false,
        })
    }
    lastOTPSendSecCount = 0;
    OTP = 0 ;
    sendOTPForgot = () =>{
        if(this.state.reg_email_valid_color == 'red' || this.state.forgot_avilEmail ){
            alert("Invalid Email ");
            return;
        }
        this.setState({
            forgot_email_edit:false,
            forgot_sendOTPButtonDisable:true,
        });
        var NOWSec = Math.floor(Date.now() / 1000);
        // console.log(NOWSec - this.lastOTPSendSecCount);
        if(NOWSec - this.lastOTPSendSecCount >= 60*5 ){
            this.OTP = Math.floor(Math.random() * (+999999 - +100000)) + +100000;
            this.setState({
                OTPreal:this.OTP,
            })
            this.lastOTPSendSecCount = NOWSec;

        }
        if(this.state.forgot_password_valid_color == 'red' || this.state.forgot_confirm_valid_color == 'red'){
            alert("Invalid Password");
            return;
        }
        // now sending request to login
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
                this.setState({forgot_sendOTPButtonDisable:true});
                var name = this.state.reg_name;
                var email = this.state.reg_email.toLowerCase();
                var password = this.state.reg_password;
                var c_password = this.state.reg_confirm;
                var phone = this.state.reg_phone;
                console.log(name,":",email,":",password,":",c_password,":",phone);
                fetch(Global.API_URL+'send_OTP_S', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        'email':email,
                        'OTP':this.state.OTPreal,
                        'user_type':'worker',
                        noti_token:Date()+"",
    
                    })
                }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    if(responseJson.error != undefined){
                        alert("Internal Server error 5004");
                        this.setState({forgot_sendOTPButtonDisable:false});
                        return;
                    }
                    if(responseJson.data.sendOTP == 'yes'){
                        this.setState({askOTP:true});
                        ToastAndroid.showWithGravityAndOffset(
                            'OTP Sent! check your Email Folder Too..',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50,
                            ); 
                            
                        return;
                    }else{
                        alert("Somthing wrong! password Not Changed!!");
                        this.setState({forgot_sendOTPButtonDisable:false});
                    }
                    }).catch((error) => {
                        alert("Internal Server Error 500");
                        console.log("on error featching:"+error);
                        this.setState({forgot_sendOTPButtonDisable:false});
                });
            }
         });
        console.log(this.OTP);
        ToastAndroid.showWithGravityAndOffset(
            'OTP For Testing'+this.OTP,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
            );   
        
    }

    // forgot pass
    forgotcheckEmail = (text) =>{
        // valdating email
        if(text.trim().length != 0 ){
            if(this.validateEmail(text) && text.length > 5){
                this.setState({
                    forgot_email_valid_color:'green',
                    forgot_email_valid_icon:'check-circle'
                });
                console.log("valid email");
            }else{
                this.setState({
                    forgot_email_valid_color:'red',
                    forgot_email_valid_icon:'close-circle'
                });
            }
        }
    }

    forgotcheckAvilEmail = (text) =>{
        // now sending request to login
        console.log("Checking for avil email");

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
                fetch(Global.API_URL+'AvilEmail', {
                    method: 'POST',
                    headers: {},
                    body: JSON.stringify({
                        email:text,
                        check:'email',
                    })
                }).then((response) => response.json())
                .then((responseJson) => {
                    var itemsToSet = responseJson.data ;
                    console.log("respforgot_avilEmail:",itemsToSet);
                    if(itemsToSet.status == true){
                        this.setState({
                            forgot_avilEmail:true,
                        })
                    }else{
                        this.setState({
                            forgot_avilEmail:false,
                        })
                    }

                }).catch((error) => {
                        alert("Internal Server Error 500");
                        console.log("on error featching:"+error);
                });
            }
        });
    }
    forgotcheckPassword = (text) =>{
        //validating password
        if(text.trim().length != 0){
            if(text.length >= 4){
                this.setState({
                    forgot_password_valid_color:'green',
                    forgot_password_valid_icon:'check-circle'
                });
                console.log("valid password");
            }else{
                this.setState({
                    forgot_password_valid_color:'red',
                    forgot_password_valid_icon:'close-circle'
                });
            }
        }
    }
    forgotcheckConfirm = (text) =>{
        if(this.state.forgot_password == text){
            this.setState({
                forgot_confirm_valid_icon:'check-circle',
                forgot_confirm_valid_color:'green',
            })
        }else{
            this.setState({
                forgot_confirm_valid_icon:'close-circle',
                forgot_confirm_valid_color:'red',
            })
        }
    }
    submitChangePassword = () =>{
        if(this.state.forgot_password_valid_color == 'red' || this.state.forgot_confirm_valid_color == 'red'){
            alert("Invalid Password");
            return;
        }
        // now sending request to login
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
                this.setState({forgot_submitButtonDisable:true});
                var name = this.state.reg_name;
                var email = this.state.reg_email.toLowerCase();
                var password = this.state.reg_password;
                var c_password = this.state.reg_confirm;
                var phone = this.state.reg_phone;
                console.log(name,":",email,":",password,":",c_password,":",phone);
                fetch(Global.API_URL+'change_password_S', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        'email':email,
                        'password':password,
                        'c_password':c_password,
                        'user_type':'worker',
                        noti_token:Date()+"",
    
                    })
                }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    if(responseJson.error != undefined){
                        alert("Internal Server error 5004");
                        this.setState({forgot_submitButtonDisable:false});
                        return;
                    }
                    if(responseJson.data.changed == 'yes'){
                        this.setState({forgotModelVisible:false});
                        ToastAndroid.showWithGravityAndOffset(
                            'Password changed sucessfully',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50,
                            ); 
                        return;
                    }else{
                        alert("Somthing wrong! password Not Changed!!");
                        this.setState({forgot_submitButtonDisable:false});
                    }
                    }).catch((error) => {
                        alert("Internal Server Error 500");
                        console.log("on error featching:"+error);
                        this.setState({forgot_submitButtonDisable:false});
                });
            }
         });
        

    }
    render() {
        const {renderCoponentFlag} = this.state;
        if(renderCoponentFlag){
            return(
                <Container>
                        <ImageBackground source={{ uri: "https://i.imgur.com/STZpybm.jpg", cache: 'force-cache', }} style={{width: '100%', height: '100%'}}>
                            <Text> </Text>
                            <View style={{alignSelf:'center',top:height*(0.01)}}>
                                <Image source={ require('../../../Image/logo.png') } />
                            </View>
                            <View style={{alignSelf:'center',top:height*(0.01)}}>
                                <Text style={{color:"#fff", fontSize:30,fontWeight:'800',alignSelf:'center'}}>Let's Connect With US</Text>
                                <Text style={{color:"#fff", fontSize:30,fontWeight:'800',alignSelf:'center'}}>Get your job on call</Text>
                            </View>
                            <View style={{alignSelf:'center',top:height*(0.03)}}>
                                <Text style={{color:"#fff", fontWeight:'800',alignSelf:'center'}}>Register with us by filling some basic</Text>
                                <Text style={{color:"#fff", fontWeight:'800',alignSelf:'center'}}>Details and get your work request inapp</Text>
                                <Text style={{color:"#fff", fontWeight:'800',alignSelf:'center'}}>Do the exiting work with this app </Text>
                                <Text style={{color:"#fff", fontWeight:'800',alignSelf:'center'}}>and earn free money</Text>
                            </View>
                            <View style={{alignSelf:'center',top:height*(0.07)}}>
                                <Button rounded bordered info style={{alignSelf:'center',margin:5,paddingHorizontal:20}} onPress={()=>{this._openLoginModel()}}>
                                    <Text>Login</Text>
                                </Button>
                                <Button rounded bordered light style={{alignSelf:'center',margin:5,paddingHorizontal:15}} onPress={()=>{this._openSignUpModel()}}>
                                    <Text>Sign Up</Text>
                                </Button>
                            </View>
                            
                            {/* loginModel */}
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={this.state.loginModelVisible}
                                onRequestClose={() => {
                                    this.setState({
                                        loginModelVisible:false
                                    })
                                }}>
                                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',borderRadius:0.2,borderColor:'#fff'}}>
                                    <View style={{ width: width*(0.95), height: 300,backgroundColor:"#ffffff",borderRadius:15,borderColor:'#fff'}}>
                                        <TouchableOpacity onPress={()=>{this.setState({loginModelVisible:false})}}>
                                            <Icon name="close-circle-outline" style={{alignSelf:'flex-end',fontSize:30}}/>
                                        </TouchableOpacity>
                                        <Text style={{fontSize:30,alignSelf:'center'}}>Sign In</Text>
                                        <View style={{ width: width*(0.85), alignSelf:'center',marginVertical:5}}>
                                            <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                                <Input 
                                                    placeholder='Email' 
                                                    onChangeText={(text) => this.setState({email_or_phone:text})}
                                                    textContentType='username'
                                                />
                                            </Item>
                                            <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                                <Input 
                                                    placeholder='Password'
                                                    onChangeText={(text) => this.setState({password:text})} 
                                                    secureTextEntry={true}
                                                    textContentType='password'
                                                 />
                                            </Item>
                                            <TouchableOpacity style={{marginVertical:5}} onPress={this.forgotPasswordStart}>
                                                <Text style={{alignSelf:'flex-end'}}>Forgot Password?</Text>
                                            </TouchableOpacity>                  
                                            <Button rounded success block 
                                                onPress={this.submitLogin}
                                                disabled = {this.state.submitButtonDisable}
                                            >
                                                <Text>Login</Text>
                                            </Button>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            {/* Login modal end */}

                            {/* Sign UP Model */}
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={this.state.signUpModelVisible}
                                onRequestClose={() => {
                                    this.setState({
                                        signUpModelVisible:false
                                    })
                                }}>
                                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{ width: width*(0.95), height: 500,backgroundColor:"#ffffff",borderRadius:15,borderColor:'#fff'}}>
                                        <TouchableOpacity onPress={()=>{this.setState({signUpModelVisible:false})}}>
                                            <Icon name="close-circle-outline" style={{alignSelf:'flex-end',fontSize:30}}/>
                                        </TouchableOpacity>
                                        <Text style={{fontSize:30,alignSelf:'center'}}>Sign Up</Text>
                                        <View style={{ width: width*(0.85), alignSelf:'center',marginVertical:5}}>
                                            <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                                <Input 
                                                    placeholder='Full Name' 
                                                    onChangeText={(text) => {
                                                        this.REGcheckName(text);
                                                        this.setState({reg_name:text})
                                                    }}
                                                    textContentType='name'
                                                    returnKeyType='next'
                                                />
                                                <Icon name={this.state.reg_name_valid_icon} style={{color:this.state.reg_name_valid_color,fontSize:25}}/>
                                            </Item>
                                            { this.state.reg_name_valid_color == 'red' && 
                                                <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Name Must be a Alphabate.</Text>
                                            }
                                            <Item  regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                                <Input 
                                                    placeholder='Email' 
                                                    onChangeText={(text) => {
                                                        this.REGcheckEmail(text);
                                                        this.setState({reg_email:text})
                                                        this.checkAvilEmail(text);
                                                    }}
                                                    textContentType='emailAddress'
                                                    returnKeyType='next'
                                                    keyboardType='email-address'

                                                />
                                                <Icon name={this.state.reg_email_valid_icon} style={{color:this.state.reg_email_valid_color,fontSize:25}}/>
                                            </Item>
                                            { this.state.reg_email_valid_color == 'red' && 
                                                <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Not a Valid Email Format.</Text>
                                            }
                                            { this.state.avilEmail == false && 
                                                <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*This email is already registered with us.</Text>
                                            }
                                            <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                                <Input 
                                                    placeholder='Phone NO'
                                                    onChangeText={(text) => {
                                                        this.REGcheckPhone(text);    
                                                        this.setState({reg_phone:text})
                                                        this.checkAvilPhone()
                                                    }}
                                                    textContentType='telephoneNumber'
                                                    returnKeyType='next'
                                                    keyboardType='numeric'   


                                                />
                                                <Icon name={this.state.reg_phone_valid_icon} style={{color:this.state.reg_phone_valid_color,fontSize:25}}/>
                                            </Item>
                                            { this.state.reg_phone_valid_color == 'red' && 
                                                <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Phone no must be 10 Digit long.</Text>
                                            }
                                            { this.state.avilPhone == false && 
                                                <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*This moible no is already registered with us.</Text>
                                            }
                                            <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                                <Input 
                                                    placeholder='Password'
                                                    onChangeText={(text) => {
                                                        this.REGcheckPassword(text);
                                                        this.setState({reg_password:text})
                                                    }}
                                                    textContentType='password' 
                                                    returnKeyType='next'
                                                    secureTextEntry={true}
                                                />
                                                <Icon name={this.state.reg_password_valid_icon} style={{color:this.state.reg_password_valid_color,fontSize:25}}/>
                                            </Item>  
                                            { this.state.reg_password_valid_color == 'red' && 
                                                <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Password Must be at least 4 character Long.</Text>
                                            }  
                                            <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                                <Input 
                                                    placeholder='Confirm password'
                                                    onChangeText={(text) => {
                                                        this.REGcheckConfirm(text);
                                                        this.setState({reg_confirm:text})
                                                    }}
                                                    textContentType='password' 
                                                    returnKeyType='go'
                                                    onSubmitEditing={this.submitRegister}
                                                    secureTextEntry={true}
                                                />
                                                <Icon name={this.state.reg_confirm_valid_icon} style={{color:this.state.reg_confirm_valid_color,fontSize:25}}/>
                                            </Item>
                                            { this.state.reg_confirm_valid_color == 'red' && 
                                                <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Confirm password Don't Matched.</Text>
                                            }                 
                                            <Button rounded success block style={{marginVertical:4}} 
                                                onPress={this.submitRegister}
                                                disabled={this.state.reg_submitButtonDisable}
                                            >
                                                <Text>Sign Up</Text>
                                            </Button>
                                            <View style={{marginVertical:6}}>
                                                <Text style={{fontSize:14,alignSelf:'center',color:'#6f6f6f'}}>Clicking Sign Up means that you are agree to the</Text>
                                                <View style={{flexDirection:'row',alignSelf:'center'}}>
                                                    <TouchableOpacity onPress={()=>{Linking.openURL("https://google.com")}}><Text style={{fontSize:14,color:'#2da2d6'}}>Terms & Conditions</Text></TouchableOpacity>
                                                    <Text style={{fontSize:14,color:'#6f6f6f'}}> and </Text>
                                                    <TouchableOpacity onPress={()=>{Linking.openURL("https://google.com")}}><Text style={{fontSize:14,color:'#2da2d6'}}>Privacy Policy.</Text></TouchableOpacity>                                            
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            {/* signUpModel modal end */}

                            
                            {/* forgot passwod Model */}
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={this.state.forgotModelVisible}
                                onRequestClose={() => {
                                    this.setState({
                                        forgotModelVisible:false
                                    })
                                }}>
                                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{ width: width*(0.95), height: 500,backgroundColor:"#ffffff",borderRadius:15,borderColor:'#fff'}}>
                                        <TouchableOpacity onPress={()=>{this.setState({forgotModelVisible:false})}}>
                                            <Icon name="close-circle-outline" style={{alignSelf:'flex-end',fontSize:30}}/>
                                        </TouchableOpacity>
                                        <Text style={{fontSize:30,alignSelf:'center'}}>Fogot Password</Text>
                                        <View style={{ width: width*(0.85), alignSelf:'center',marginVertical:5}}>
                                        
                                            <Item  regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                                <Input 
                                                    placeholder='Email' 
                                                    onChangeText={(text) => {
                                                        this.forgotcheckEmail(text);
                                                        this.setState({forgot_email:text})
                                                        this.forgotcheckAvilEmail(text);
                                                    }}
                                                    textContentType='emailAddress'
                                                    returnKeyType='next'
                                                    keyboardType='email-address'
                                                    editable = {this.state.forgot_email_edit}

                                                />
                                                <Icon name={this.state.forgot_email_valid_icon} style={{color:this.state.forgot_email_valid_color,fontSize:25}}/>
                                            </Item>
                                            { this.state.forgot_email_valid_color == 'red' && 
                                                <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Not a Valid Email Format.</Text>
                                            }
                                            { this.state.forgot_avilEmail && this.state.forgot_email != '' && 
                                                <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Unable to Find Your Account.</Text>
                                            }
                                            { this.state.forgot_email_edit && 
                                                <Button rounded success block style={{marginVertical:4}} 
                                                        onPress={this.sendOTPForgot}
                                                        disabled={this.state.forgot_sendOTPButtonDisable }
                                                >
                                                        <Text>Send OTP</Text>
                                                </Button>
                                            }  
                                            { this.state.askOTP && 
                                                <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                                    <Input 
                                                        placeholder='Enter 6 Digit OTP'
                                                        onChangeText={(text) => {
                                                            this.setState({OTPEntered:text})
                                                            if(text.length == 6 && text != this.state.OTPreal){
                                                                ToastAndroid.showWithGravityAndOffset(
                                                                    'Invalid OTP',
                                                                    ToastAndroid.SHORT,
                                                                    ToastAndroid.TOP,
                                                                    25,
                                                                    50,
                                                                    );    
                                                            }
                                                        }}
                                                        textContentType='password' 
                                                        returnKeyType='next'
                                                        secureTextEntry={true}
                                                        editable = {this.state.forgot_OTP_edit}
                                                    />
                                                </Item>
                                            }
                                            {/* continue password buton after correct OTP */}
                                            { this.state.OTPEntered == this.state.OTPreal && 
                                                <Button rounded success block style={{marginVertical:4}} onPress={()=>{this.setState({forgot_OTP_edit:false,OTPEntered:'0'})}}>
                                                        <Text>Continue</Text>
                                                </Button>
                                            }  
                                            {/* change password box apper */}
                                            { this.state.forgot_OTP_edit == false && 
                                                <View>
                                                    <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                                        <Input 
                                                            placeholder='Password'
                                                            onChangeText={(text) => {
                                                                this.forgotcheckPassword(text);
                                                                this.setState({forgot_password:text})
                                                            }}
                                                            textContentType='password' 
                                                            returnKeyType='next'
                                                            secureTextEntry={true}
                                                        />
                                                        <Icon name={this.state.forgot_password_valid_icon} style={{color:this.state.forgot_password_valid_color,fontSize:25}}/>
                                                    </Item>  
                                                    { this.state.forgot_password_valid_color == 'red' && 
                                                        <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Password Must be at least 4 character Long.</Text>
                                                    }  
                                                    <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                                        <Input 
                                                            placeholder='Confirm password'
                                                            onChangeText={(text) => {
                                                                this.forgotcheckConfirm(text);
                                                                this.setState({forgot_confirm:text})
                                                            }}
                                                            textContentType='password' 
                                                            returnKeyType='go'
                                                            onSubmitEditing={this.submitChangePassword}
                                                            secureTextEntry={true}
                                                        />
                                                        <Icon name={this.state.forgot_confirm_valid_icon} style={{color:this.state.forgot_confirm_valid_color,fontSize:25}}/>
                                                    </Item>
                                                    { this.state.forgot_confirm_valid_color == 'red' && 
                                                         <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Confirm password Don't Matched.</Text>
                                                    }     
                                                    {
                                                        this.state.forgot_confirm == this.state.forgot_password && this.state.forgot_confirm_valid_color == 'green'  &&
                                                        <Button rounded success block style={{marginVertical:4}} 
                                                            onPress={this.submitChangePassword}
                                                            disabled={this.state.forgot_submitButtonDisable}>
                                                                <Text>Change Password</Text>
                                                        </Button>
                                                    }            
                                                    
                                                        
                                                </View>
                                                    
                                            }  
                                                            
                                            
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            {/* forgot password end */}
                        </ImageBackground>
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