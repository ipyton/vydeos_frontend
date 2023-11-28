import Article from "./Article";
import React, {useEffect, useState} from "react";
import { useNavigate ,Navigate} from "react-router-dom";
import verifyTokens from "../../../util/ioUtil";


function Item(props) {
  console.log(localStorage.getItem("token"))
  const [articles, setArticles] = React.useState([1,2,3,4,5]);
  const [count, setCount] = React.useState(99);
  const {loginState, setLoginState} = props.status
  let init = () => {
    document.addEventListener("scroll", () => {
      console.log(
        "scroll"
      )
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      // 页面高度
      var documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      // 滚动条位置
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if ((windowHeight + scrollTop + 2) >= documentHeight) {
        console.log('页面滚动到达底部');
        RequestData()
      }
    });
  }
  useEffect(() =>{init()},[]);
  let RequestData = function()  {
    console.log("loading")
  }
  if (loginState !== true && localStorage.getItem("token") !== null) {

    verifyTokens(localStorage.getItem("token")).then(response => {
      console.log(response)
      if (true === response) {
        setLoginState(true)
      }
      else {
        console.log("clean")
        localStorage.removeItem("token")
        setLoginState(false)
      }
    }
  )}

  if(loginState !== true && localStorage.getItem("token") === null ) {
    return <Navigate to="/login" replace/>
  }
 

if (articles.length === 0) {
  RequestData()
}


  // React.useEffect(() => {
  //   console.log("is doing");
  //     return () => {
  //       console.log("trigger when loading")
  //     }
  //   })
  return (
    articles&&articles.map(x=>{
      return <Article key={x}></Article>
    })    
  )
}
export default Item