import List from "@mui/material/List"
import SuggestionItem from "./SuggestionItem"
import SuggestionCatagories from "./SuggestionCategories"
export default function (props) {
    let {searchResult, searchSuggestionOpen, left, setSuggestionOpen} = props
    //console.log(setSuggestionOpen)

    let searchResultExample = {title:"Helloworld", introduction:"introduction", pic:"", type:"contact"}
    console.log(searchSuggestionOpen)
    return <List hidden={searchSuggestionOpen} sx={{ marginTop:"1%",width: '100%', maxWidth: 360,maxHeight:500, bgcolor: 'background.paper', position: 'absolute', left: left? (100*((window.innerWidth+240)/(2*window.innerWidth))+'%'):(100*((window.innerWidth +30)/(2*window.innerWidth))+'%'), top:40,transform: 'translate(-50%, 0)',zIndex:500,
    overflow:"scroll"}}>
    <SuggestionCatagories></SuggestionCatagories>
    {
        searchResult.length===0?"input your results here":searchResult.map((item, index) => {
            return (<SuggestionItem searchResult={item} setSuggestionOpen={setSuggestionOpen} ></SuggestionItem>)
        } )
    }
  </List>
    

}