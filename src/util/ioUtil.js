import axios  from "axios"
import Qs from 'qs'

export default function verifyTokens(token) {
    async function post(){
        let response = await axios({
            url:"http://localhost:8080/account/verifyToken", 
            method:'post',
            data:{token:token},
            transformRequest:[function (data) {
              return Qs.stringify(data)
          }],
          headers:{token:token}
        })
        let responseData = response.data
        console.log(response)
        return responseData.code === 1
    }
    return post()
}