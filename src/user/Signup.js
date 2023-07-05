import Header from "../hocs/Header"
import React,{useState,useEffect} from 'react'
import {useNavigate,Link} from "react-router-dom"
import LoginGoogle from "./LoginGoogle"
import LoginFacebook from "./LoginFacebook"
const Signup=()=>{
    const navigate=useNavigate()
    return(
        <div className="tiktok-1v6vrxi-DivContainer e2nph0d0">
            <div className="tiktok-1v6vrxi-DivContainer e2nph0d0">
                <Header/>
                <div id="loginContainer" class="tiktok-1c5u77z-DivBodyContainer e2nph0d1">
                    <div class="tiktok-xabtqf-DivLoginContainer exd0a430"><div>
                        <div class="tiktok-qi6rr-DivTitle exd0a432">Sign up for TikTok</div>
                            <div class="tiktok-100tbyn-DivDescriptionContainer exd0a431">Create a profile, follow other accounts, make your own videos, and more.</div>
                            <Link to="/signup/phone-or-email" class="tiktok-1bi32tb-ALink epl6mg0">
                                <div class="tiktok-xbg2z9-DivBoxContainer e1cgu1qo0">
                                    <div class="tiktok-biy4dj-DivIconContainer e1cgu1qo1">
                                        <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.0003 7C20.1343 7 17.0003 10.134 17.0003 14C17.0003 17.866 20.1343 21 24.0003 21C27.8663 21 31.0003 17.866 31.0003 14C31.0003 10.134 27.8663 7 24.0003 7ZM13.0003 14C13.0003 7.92487 17.9252 3 24.0003 3C30.0755 3 35.0003 7.92487 35.0003 14C35.0003 20.0751 30.0755 25 24.0003 25C17.9252 25 13.0003 20.0751 13.0003 14ZM24.0003 33C18.0615 33 13.0493 36.9841 11.4972 42.4262C11.3457 42.9573 10.8217 43.3088 10.2804 43.1989L8.32038 42.8011C7.77914 42.6912 7.4266 42.1618 7.5683 41.628C9.49821 34.358 16.1215 29 24.0003 29C31.8792 29 38.5025 34.358 40.4324 41.628C40.5741 42.1618 40.2215 42.6912 39.6803 42.8011L37.7203 43.1989C37.179 43.3088 36.6549 42.9573 36.5035 42.4262C34.9514 36.9841 29.9391 33 24.0003 33Z"></path></svg>
                                    </div>Use phone or email
                                </div>
                            </Link>
                            <LoginGoogle/>
                            <LoginFacebook/>
                            <div class="tiktok-ylugj8-DivShowMore exattu0"> 
                                <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M22.5858 32.4142L8.29289 18.1213C7.90237 17.7308 7.90237 17.0976 8.29289 16.7071L9.70711 15.2929C10.0976 14.9024 10.7308 14.9024 11.1213 15.2929L24 28.1716L36.8787 15.2929C37.2692 14.9024 37.9024 14.9024 38.2929 15.2929L39.7071 16.7071C40.0976 17.0976 40.0976 17.7308 39.7071 18.1213L25.4142 32.4142C24.6332 33.1953 23.3668 33.1953 22.5858 32.4142Z"></path></svg>
                            </div>
                        </div>
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
                    
                </div>
            </div>
        </div>
    )
}
export default Signup