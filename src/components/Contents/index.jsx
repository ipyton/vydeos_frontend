import { useEffect, useState } from "react"
import Item from "./Item"
import Login  from "./Login"
import {Route, Routes, useNavigate, Navigate, redirect,} from 'react-router-dom'
import NotFound from "./NotFound"
import React from "react"

export default function Contents(props) {


    //state = {articles:[{id:1},{id:2},{id:3},], pagesize:5}
    return (
        <div>
            <Routes>
                <Route path="/login" element={<Login/>}></Route>
                <Route path="/" element={<Item/>}></Route>
                <Route path="*" element={<NotFound/>} ></Route>
            </Routes>
        </div>

    )
    
}