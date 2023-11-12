import Article from "./Article";
import React, {useEffect, useState} from "react";
import { useNavigate ,Navigate} from "react-router-dom";


function Item(props) {
  const [articles, setArticles] = React.useState([]);
  const [count, setCount] = React.useState(99);
  let navigate = useNavigate();
  let token = localStorage.getItem("login")
  if (null === token) {
    return (<Navigate to="/login" replace/>)
  }
  let RequestData = function()  {
    let token = localStorage.getItem("login")
        setArticles([...articles,count])
        setCount(value => value + 1)
}
if (articles.length == 0) {
  RequestData()
}
document.addEventListener("scroll", () => {
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