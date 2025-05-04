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

    static deletePath(path, roleId) {
        return axios({
            url: API_BASE_URL + "/auth/deletePath" ,
            method: 'post',
            data: {roleId: roleId, allowedPaths: [path]},
            headers: {
                token: localStorage.getItem("token"),
            }
        })

    }

    static getAllPathsByRoleId(roleId) {
        return axios({
            url: API_BASE_URL + "/auth/getPathsByRoleId?roleId=" + roleId,
            method: 'get',
            headers: {
                token: localStorage.getItem("token"),
            }
        })
    }


    
}