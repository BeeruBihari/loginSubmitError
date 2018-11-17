import {AsyncStorage} from "react-native";
export default {
    API_URL:"http://gomarket.ourgts.com/public/api/",
    USER_TOKEN: AsyncStorage.getItem('userToken'),
};
  