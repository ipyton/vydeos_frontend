import List from "@mui/material/List"
import SuggestionItem from "./SuggestionItem"
import SuggestionCatagories from "./SuggestionCategories"
import * as React from 'react';
import { useThemeMode } from '../../../Themes/ThemeContext';

export default function (props) {
    let { searchResult, searchSuggestionOpen, left, setSuggestionOpen, setCategory, categorySelected, setCategorySelected } = props
    //console.log(setSuggestionOpen)
    const { mode } = useThemeMode();


    return <List
    id="category"
    hidden={searchSuggestionOpen}
    sx={{
      marginTop: "1%",
      width: '80%',
      maxWidth: 280,
      maxHeight: 500,
      bgcolor: mode === 'dark' ? '#1e1e1e' : '#fff', // hardcoded bg color
      color: mode === 'dark' ? '#fff' : '#000',      // hardcoded text color
      position: 'absolute',
      left: left
        ? `${100 * ((window.innerWidth + 240) / (2 * window.innerWidth))}%`
        : `${100 * ((window.innerWidth + 30) / (2 * window.innerWidth))}%`,
      top: 40,
      transform: 'translate(-50%, 0)',
      zIndex: 500,
      overflow: "scroll",
      border: '1px solid black',
      borderColor: mode === 'dark' ? '#555' : '#000', // border contrast for dark
    }}
  >
    <SuggestionCatagories
      setCategory={setCategory}
      setCategorySelected={setCategorySelected}
      categorySelected={categorySelected}
    />
  </List>


}