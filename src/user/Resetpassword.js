import React, { useState ,useEffect} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { reset_password,reset_password_confirm } from '../actions/auth';
import axios from 'axios';
import {otpURL,verifyotpURL,isVietnamesePhoneNumber,regExp,validatEemail,validatePassword} from "../constants"
import Header from "../hocs/Header"
import Footer from '../hocs/Footer'
import FormReset from "./FormReset"
const ResetPassword = ({match,reset_password,reset_password_confirm}) => {
    const [requestSent, setRequestSent] = useState(false);
    const[show,setShow]=useState(false);
    const [error,setError]=useState({})
    return(
        <div id="app">
            <div className="tiktok-1v6vrxi-DivContainer e2nph0d0">
                <Header/>
                <div id="loginContainer" class="tiktok-1c5u77z-DivBodyContainer e2nph0d1">
                    <div class="tiktok-xabtqf-DivLoginContainer exd0a430">
                        <form>
                            <div class="tiktok-qi6rr-DivTitle e1521l5b1">Reset password</div>
                            <FormReset/>
                        </form>
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

};

export default ResetPassword;