import { responsiveFontSizes } from "@mui/material"
import Qs from 'qs'
import { apiClient, downloadClient } from "./ApiClient";

export default class PictureUtil {

    static async uploadArticlePics(data) {
        try {
            let response = await apiClient.post("/article/upload_pic", 
                Qs.stringify({ pics: data }), 
                {
                    headers: {
                        'userEmail': '1838169994@qq.com',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            let responseData = response.data;
            return responseData.code === 0;
        } catch (error) {
            console.error('Upload article pics error:', error);
            return false;
        }
    }

    static downloadArticlePics(articleID, from, to) {
        async function download() {
            try {
                let response = await downloadClient.post("/article/get_pic", 
                    { from: from, to: to, articleID: articleID }, 
                    {
                        headers: {
                            'userEmail': '1838169994@qq.com'
                        },
                        responseType: 'arraybuffer'
                    }
                );
                let responseData = response.data;
                return responseData.code === 0;
            } catch (error) {
                console.error('Download article pics error:', error);
                return false;
            }
        }
        return download();
    }

    static getAvatar() {
        async function download() {
            try {
                let response = await apiClient.post("/account/getAvatar", {}, {
                    headers: {
                        'userEmail': '1838169994@qq.com'
                    },
                    responseType: "arraybuffer"
                });
                
                const blob = new Blob([response.data], { type: "image/jpg" });
                const imageUrl = URL.createObjectURL(blob);
                return imageUrl;
            } catch (error) {
                console.error('Get avatar error:', error);
                return null;
            }
        }
        return download();
    }
}