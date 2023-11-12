import Article from "./Article";
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
export default function Item(props) {
  const {Articles, setArticles} = useState([1,2,3]);
  const {Count, setCount} = useState(0);
  console.log(Count)
  let navigate = useNavigate();

  document.addEventListener("scroll", () => {
    let bottom = document.documentElement.clientHeight + window.scrollY >=
    (document.documentElement.scrollHeight || document.documentElement.clientHeight);
    if (bottom) console.log("to the end!!!")
})

  let RequestData = function()  {
      let token = localStorage.getItem("login")
      if (null == token) {
        navigate("/login")
      }
      else {
          
      }
  }
  React.useEffect(() => {
      RequestData()
      return () => {
        console.log("卸载时触发")
      }
    })
    console.log(Count)
  return (
    Articles&&Articles.map(x=>{
      return <Article key={x}></Article>
    })    
  )
}