import { useEffect, useState } from "react"
import Item from "./Item"
import Login  from "./Login"
import {Route, Routes, useNavigate, Navigate, redirect, BrowserRouter,} from 'react-router-dom'
import NotFound from "./NotFound"
import React from "react"
import SignUp from "./SignUp"

export default function Contents(props) {

    const [a,setA] = useState(20)
    console.log(a)

    //state = {articles:[{id:1},{id:2},{id:3},], pagesize:5}
    return (
        <div>
            <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}></Route>
                <Route path="/signup" element={<SignUp/>}></Route>
                <Route path="/" element={<Item/>}></Route>
                <Route path="*" element={<NotFound/>} ></Route>
            </Routes>
            </BrowserRouter>
        </div>

    )
    
}