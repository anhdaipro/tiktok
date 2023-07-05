import Header from "../hocs/Header"
import Formlogin from "./Formlogin"
import React,{useState,useEffect} from 'react'
import {useNavigate,Link} from "react-router-dom"
import { headers,login } from "../actions/auth"
import { connect } from 'react-redux';
import Footer from '../hocs/Footer'
const LoginPhoneorEmail=(props)=>{
    const {login}=props
    const navigate=useNavigate()
    return(
        <div id="app">
            <div className="tiktok-1v6vrxi-DivContainer e2nph0d0">
                <Header/>
                <div id="loginContainer" class="tiktok-1c5u77z-DivBodyContainer e2nph0d1">
                    <div class="tiktok-xabtqf-DivLoginContainer exd0a430">
                        <form>
                            <div class="tiktok-qi6rr-DivTitle e1521l5b1">Log in</div>
                            <Formlogin/>
                        </form>
                    </div>
                    
                    <div onClick={()=>navigate('/login')} class="tiktok-1komt3e-DivBack e1lgic6i0">
                        <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.58579 22.5858L20.8787 6.29289C21.2692 5.90237 21.9024 5.90237 22.2929 6.29289L23.7071 7.70711C24.0976 8.09763 24.0976 8.7308 23.7071 9.12132L8.82843 24L23.7071 38.8787C24.0976 39.2692 24.0976 39.9024 23.7071 40.2929L22.2929 41.7071C21.9024 42.0976 21.2692 42.0976 20.8787 41.7071L4.58579 25.4142C3.80474 24.6332 3.80474 23.3668 4.58579 22.5858Z"></path></svg>
                        Go back
                    </div>
                </div>
                <div class="tiktok-8jkdwh-DivFooterContainer etab5w60">
                    <div class="tiktok-1ukv4ao-DivContainer e1b6crsh0">
                        <div>Don’t have an account?  </div>
                        <a href="/signup" class="tiktok-1f8xcgp-ALink epl6mg0">
                            <span class="tiktok-qon7yp-SpanLinkText e1b6crsh1">Sign up</span>
                        </a>
                    </div>
                    <Footer/>
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated
});
export default connect(mapStateToProps, { login })(LoginPhoneorEmail);
