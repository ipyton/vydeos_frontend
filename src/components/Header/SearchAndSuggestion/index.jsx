import List from "@mui/material/List"
import SuggestionItem from "./SuggestionItem"
import SuggestionCatagories from "./SuggestionCategories"
import * as React from 'react';


export default function (props) {
    let { searchResult, searchSuggestionOpen, left, setSuggestionOpen, setCategory, categorySelected, setCategorySelected } = props
    //console.log(setSuggestionOpen)


    return <List id="category"  hidden={searchSuggestionOpen} sx={{
        marginTop: "1%", width: '80%', maxWidth: 280, maxHeight: 500, bgcolor: 'background.paper', position: 'absolute', left: left ? (100 * ((window.innerWidth + 240) / (2 * window.innerWidth)) + '%') : (100 * ((window.innerWidth + 30) / (2 * window.innerWidth)) + '%'), top: 40, transform: 'translate(-50%, 0)', zIndex: 500,
        overflow: "scroll", border: '1px solid black'  // 这里增加黑色边框

    }}>

        <SuggestionCatagories setCategory={setCategory} setCategorySelected={setCategorySelected} categorySelected={categorySelected}></SuggestionCatagories>
        {/* {
            searchResult.length === 0 ? "input your results here" : searchResult.map((item, index) => {
                return (<SuggestionItem  searchResult={item} setSuggestionOpen={setSuggestionOpen} ></SuggestionItem>)
            })
        } */}
    </List>


}