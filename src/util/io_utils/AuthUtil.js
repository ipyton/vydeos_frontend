import axios from "axios";

export default class AuthUtil {

    static getUrlBase() {  
        return "/api"
    }

    static getPaths() {
        return axios({
            url: AuthUtil.getUrlBase() + "/auth/getPaths",
            method: 'get',
            headers: {
                token: localStorage.getItem("token"),
            }
        })
    }


    
}