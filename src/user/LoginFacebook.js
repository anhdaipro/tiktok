import React,{useState,useEffect} from 'react'
import {useNavigate,Link} from "react-router-dom"
import ReactFacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { connect } from 'react-redux';
import { loginURL } from "../urls"
import axios from 'axios';
import { headers,responseFb,login } from "../actions/auth"
const LoginFacebook=({responseFb})=>{
    const [state,setState] = useState({isLoggedIn: false,userID: "",name: "",
    email: "",picture: ""
    })
    
    return(
        <ReactFacebookLogin
            appId="864145964959803"
            fields="name,email,picture"
            callback={responseFb}
            render={renderProps => (
            <div onClick={renderProps.onClick} class="tiktok-xbg2z9-DivBoxContainer e1cgu1qo0">
                <div class="tiktok-biy4dj-DivIconContainer e1cgu1qo1">
                    <svg width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M45 24.1283C45 12.4595 35.598 3 24 3C12.402 3 3 12.4595 3 24.1283C3 34.6739 10.6794 43.415 20.7188 45V30.2357H15.3867V24.1283H20.7188V19.4735C20.7188 14.1782 23.854 11.2533 28.6508 11.2533C30.9476 11.2533 33.3516 11.6659 33.3516 11.6659V16.8655H30.7036C28.095 16.8655 27.2812 18.4943 27.2812 20.1668V24.1283H33.1055L32.1744 30.2357H27.2812V45C37.3206 43.415 45 34.6739 45 24.1283Z" fill="#1877F2"></path></svg>
                </div>Continue with Facebook
            </div>
            )}
        />  
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated
});
export default connect(mapStateToProps, { login,responseFb })(LoginFacebook);
