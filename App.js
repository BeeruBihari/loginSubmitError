import React from 'react';
import { AsyncStorage } from "react-native";
import Main from './common/navigation/AppNavigator';
export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      login_status:true,
    }  
  }

  _retrieveData1 = async () => {
    //console.log('method Called.')
    try {
      const value = await AsyncStorage.getItem('key_login_status_market_r');
      if (value !== null) {
          if(value == 'true'){
            this.setState({
                login_status: true
            });
            //console.log('Already Loginned');
          }
          //console.log('Already Loginned1');
      }
     } catch (error) {
        this.setState({
            login_status: false
        });
        //console.log('Error in Login');
     }
     //console.log('Already Loginnedfs');
  }

  render () {
     //this._retrieveData1();
     //console.log(this.state.login_status);
    if(this.state.login_status){
      return(<Main />);
    }
    else
      return(<Text>Text</Text>)
  }
}
