import axios  from "axios"
import Qs from 'qs'

export default function verifyTokens(token) {
    let result = false
    axios({
        url:"http://localhost:8080/account/verifyToken", 
        method:'post',
        data:{token:token},
        transformRequest:[function (data) {
          return Qs.stringify(data)
      }],
    }).then(function(response) {
        let responseData = response.data
        console.log(responseData)
        result = (responseData.code === 1)

    }).catch((error)=>{
        console.log(error)
    })
    console.log(result)
    console.log("vwoiubfiwuebf")
    return result
}