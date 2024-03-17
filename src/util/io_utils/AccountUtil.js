import axios  from "axios"
import Qs from 'qs'
import EncryptionUtil from "./EncryptionUtil"



export default class AccountUtil {

    static getUrlBase() {
        return "http://localhost:8000"
    }



    static login(data, setLogin) {
        axios({
            url:AccountUtil.getUrlBase() + "/account/login", 
            method:'post',
            data:{email: data.get('email'),password: EncryptionUtil.encryption(data.get('password')),remember:data.get("remember")},
            transformRequest:[function (data) {
              // 对 data 进行任意转换处理
              return Qs.stringify(data)
          }],
        }).catch(error => {
          if ("Network Error" ===  error.message) {
            //props.setBarState({...props.barState, message:"please login first1233333" + error, open:true})
            // setNetworkErr(true)
            console.log("error")
          }
        }).then(function(response) {
            if (response === undefined) {
                console.log("errror")
            }
            console.log(response)
            let responseData = response.data
            if (responseData.code === -1) {
              //props.setBarState({...props.barState, message:responseData.message, open:true})
            }
            else if(responseData.code === 1) {
              localStorage.setItem("token", responseData.message)
              localStorage.setItem("email", data.get("email"))
              setLogin(true)
            }
            else {
              //props.setBarState({...props.barState, message:responseData.message, open:true})
            }
            //setNetworkErr(false)
          })
    } 

    static requestUserInfo() {

    }



    static registerStep1(data, activeStep ,setStep, setBanner, setTransactionNumber) {
        async function post(){
            let response = await axios({
                url: AccountUtil.getUrlBase() + "/account/register", 
                method:'post',
                data:{userEmail: data.get('email'),password: EncryptionUtil.encryption(data.get('password')),userName:data.get("nickname"),promotion:data.get("selected")},
                transformRequest:[function (data) {
                  // transform data -> json
                  return Qs.stringify(data)
              }],
            }).catch((err)=>{
              console.log("Connection error")
            }).then(
              (response)=>{
                console.log(response);
                if(response.data.code === 1)
                {
                  setStep(activeStep + 1)
                  console.log("Success")
                  setTransactionNumber(response.transactionNumber)
                }
                else {
                    console.log("Please check your input")
                }
              }
            )
        }
        return post()
    }

    static registerValidate() {

    }

    static registerOptionalData() {

    }

    static forget() {
        
    }

}