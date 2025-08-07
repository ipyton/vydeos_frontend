import React, { useState } from 'react'
import SignUp from "./SignUp";
import Forget from "./Forget";
import Login from "./Login";
import Box from '@mui/material/Box';
import NotFound from "../Errors/NotFoundError";
import AuthLayout from './AuthLayout';
import { Route, Routes, useNavigate, Navigate, redirect, BrowserRouter, } from 'react-router-dom'
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import LandingPage from '../LandingPage';
import PrivacyPolicy from '../LandingPage/PrivacyPolicy';
import TermsOfService from '../LandingPage/TermsOfService';
import AboutUs from '../LandingPage/AboutUs';
import { ThemeContextProvider } from '../../Themes/ThemeContext';

function Copyright(props) {
    return (
        <Typography variant="body2" color="white" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
        </Typography>
    );
}

export default function (props) {
    return (
        <ThemeContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />}></Route>
                    <Route path="/privacy-policy" element={<PrivacyPolicy />}></Route>
                    <Route path="/terms-of-service" element={<TermsOfService />}></Route>
                    <Route path="/about-us" element={<AboutUs />}></Route>
                    <Route element={<AuthLayout />}>
                        <Route path="forget" element={<Forget />}></Route>
                        <Route path="login" element={<Login login={props.loginState} setLogin={props.setLoginState} />}></Route>
                        <Route path="signup" element={<SignUp loginState={props.loginState} setLoginState={props.setLoginState} setBarState={props.setBarState} />}></Route>
                        <Route path="*" element={<Login login={props.loginState} setLogin={props.setLoginState} />}></Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeContextProvider>
    )
}