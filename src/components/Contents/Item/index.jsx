import Article from "./Article";
import React, {useEffect, useState} from "react";
import { useNavigate ,Navigate} from "react-router-dom";
import verifyTokens from "../../../utils";


function Item(props) {
  console.log(localStorage.getItem("token"))
  const [articles, setArticles] = React.useState([1,2,3,4,5]);
  const [count, setCount] = React.useState(99);
  const {loginState, setLoginState} = props.status
  if (loginState !== true && localStorage.getItem("token") !== null) {

    if (verifyTokens(localStorage.getItem("token"))){
      setLoginState(true)
    }
    else {
      console.log("clean")
      localStorage.removeItem("token")
      setLoginState(false)
    }
  }

  if(loginState !== true && localStorage.getItem("token") === null ) {
    return <Navigate to="/login" replace/>
  }
 

  let RequestData = function()  {
    let token = localStorage.getItem("token")
    setArticles([...articles,count])
    setCount(value => value + 1)
    console.log("requestData")
}
if (articles.length === 0) {
  RequestData()
}
document.addEventListener("scroll", () => {
  console.log(
    "scroll"
  )
  let bottom = document.documentElement.clientHeight + window.scrollY >=
  (document.documentElement.scrollHeight || document.documentElement.clientHeight);
  if (bottom) RequestData();
});


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