import List from "@mui/material/List"
import SuggestionItem from "./SuggestionItem"
import SuggestionCatagories from "./SuggestionCategories"
import * as React from 'react';
import { useThemeMode } from '../../../Themes/ThemeContext';

export default function (props) {
    let { searchResult, searchSuggestionOpen, left, setSuggestionOpen, setCategory, categorySelected, setCategorySelected } = props
    const { mode } = useThemeMode();

    return <List
        id="category"
        hidden={searchSuggestionOpen}
        sx={{
            marginTop: "1%",
            width: '80%',
            maxWidth: 280,
            maxHeight: 500,
            // 毛玻璃效果
            backgroundColor: mode === 'dark' 
                ? 'rgba(30, 30, 30, 0.4)' 
                : 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(20px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.8)', // Safari 支持
            color: mode === 'dark' ? '#fff' : '#000',
            position: 'fixed',
            left: left
                ? `${100 * ((window.innerWidth + 240) / (2 * window.innerWidth))}%`
                : `${100 * ((window.innerWidth + 30) / (2 * window.innerWidth))}%`,
            top: 40,
            transform: 'translate(-50%, 0)',
            zIndex: 500,
            overflow: "scroll",
            // 边框也使用半透明效果
            border: '1px solid',
            borderColor: mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'rgba(0, 0, 0, 0.1)',
            borderRadius: '12px', // 添加圆角使效果更自然
            // 添加轻微的阴影增强层次感
            boxShadow: mode === 'dark' 
                ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
            // 隐藏滚动条样式
            '&::-webkit-scrollbar': {
                width: '6px',
            },
            '&::-webkit-scrollbar-track': {
                background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
                background: mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : 'rgba(0, 0, 0, 0.3)',
                borderRadius: '3px',
            },
        }}
    >
        <SuggestionCatagories
            setCategory={setCategory}
            setCategorySelected={setCategorySelected}
            categorySelected={categorySelected}
        />
    </List>
}