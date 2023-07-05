import Header from "../hocs/Header"
import Formsignup from "./Formsignup"
import React,{useState,useEffect} from 'react'
import { connect } from 'react-redux';
import {useNavigate,Link} from "react-router-dom"
import Footer from '../hocs/Footer'
import axios from 'axios';
import { headers,login,signup } from "../actions/auth"
const SignupEmailorPhone=()=>{
    const navigate=useNavigate()
    return(
        <div>
            <div className="tiktok-1v6vrxi-DivContainer e2nph0d0">
                <Header/>
                <div id="loginContainer" class="tiktok-1c5u77z-DivBodyContainer e2nph0d1">
                    <div class="tiktok-xabtqf-DivLoginContainer exd0a430">
                        <form>
                            <div class="tiktok-qi6rr-DivTitle e1lzrlvq1">Sign up</div>
                            <Formsignup/>
                        </form>
                    </div>
                </div>
                <div class="tiktok-8jkdwh-DivFooterContainer etab5w60">
                    <div class="tiktok-18owh21-DivAgreement e1sbfgbz0">
                        <p class="tiktok-1d7ored-PText e1sbfgbz1">By continuing, you agree to TikTok’s  
                        <a target="_blank" rel="noopener noreferrer" href="https://www.tiktok.com/legal/terms-of-use?lang=en" class="tiktok-ouphsp-ALink e1sbfgbz2">Terms of Service</a> and confirm that you have read TikTok’s  
                        <a target="_blank" rel="noopener noreferrer" href="https://www.tiktok.com/legal/privacy-policy?lang=en" class="tiktok-ouphsp-ALink e1sbfgbz2">Privacy Policy</a>.</p>
                    </div>
                    <div class="tiktok-1ukv4ao-DivContainer e1b6crsh0">
                        <div>Already have an account?  </div>
                        <a href="/login" class="tiktok-1f8xcgp-ALink epl6mg0">
                            <span class="tiktok-qon7yp-SpanLinkText e1b6crsh1">Log in</span>
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
export default connect(mapStateToProps, { signup })(SignupEmailorPhone);
