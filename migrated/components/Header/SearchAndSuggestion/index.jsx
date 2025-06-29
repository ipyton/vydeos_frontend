import React, { useState, useEffect } from 'react';
import List from "@mui/material/List";
import SuggestionItem from "./SuggestionItem";
import SuggestionCategories from "./SuggestionCategories";
import { useThemeMode } from '../../../contexts/ThemeContext';

export default function SearchAndSuggestion(props) {
    const { searchResult, searchSuggestionOpen, left, setSuggestionOpen, setCategory, categorySelected, setCategorySelected } = props;
    const { mode } = useThemeMode();
    const [leftPosition, setLeftPosition] = useState('50%');

    // Calculate position based on window size with SSR compatibility
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const position = left
                ? `${100 * ((window.innerWidth + 240) / (2 * window.innerWidth))}%`
                : `${100 * ((window.innerWidth + 30) / (2 * window.innerWidth))}%`;
            setLeftPosition(position);
            
            const handleResize = () => {
                const newPosition = left
                    ? `${100 * ((window.innerWidth + 240) / (2 * window.innerWidth))}%`
                    : `${100 * ((window.innerWidth + 30) / (2 * window.innerWidth))}%`;
                setLeftPosition(newPosition);
            };
            
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [left]);

    return (
        <List
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
                left: leftPosition,
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
            <SuggestionCategories
                setCategory={setCategory}
                setCategorySelected={setCategorySelected}
                categorySelected={categorySelected}
            />
            
            {searchResult && searchResult.length > 0 && searchResult.map((item, index) => (
                <SuggestionItem 
                    key={index} 
                    searchResult={item} 
                    setSuggestionOpen={setSuggestionOpen}
                />
            ))}
        </List>
    );
} 