import axios from "axios";
import {DOWNLOAD_BASE_URL, API_BASE_URL} from "./URL";


export default class AuthUtil {



    static getPaths() {
        return axios({
            url: API_BASE_URL + "/auth/getNavPaths",
            method: 'get',
            headers: {
                token: localStorage.getItem("token"),
            }
        })
    }


    
}