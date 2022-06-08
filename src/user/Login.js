import Header from "../hocs/Header"
import Formlogin from "./Formlogin"
import React,{useState,useEffect} from 'react'
import {useNavigate,Link} from "react-router-dom"
import { connect } from 'react-redux';
import LoginGoogle from "./LoginGoogle"
import LoginFacebook from "./LoginFacebook"
const Login=()=>{
    const navigate=useNavigate()
    const [state,setState]=useState({login_email_phone:false})
    return(
        <div id="app">
            <div className="tiktok-1v6vrxi-DivContainer e2nph0d0">
                <Header/>
                <div id="loginContainer" class="tiktok-1c5u77z-DivBodyContainer e2nph0d1">
                    <div class="tiktok-xabtqf-DivLoginContainer exd0a430">
                        {!state.login_email_phone?
                        <div>
                            <div class="tiktok-qi6rr-DivTitle exd0a432">Log in to TikTok</div>
                            <div class="tiktok-100tbyn-DivDescriptionContainer exd0a431">Manage your account, check notifications, comment on videos, and more.</div>
                            <a href="/login/qrcode" class="tiktok-1bi32tb-ALink epl6mg0">
                                <div class="tiktok-xbg2z9-DivBoxContainer e1cgu1qo0">
                                    <div class="tiktok-biy4dj-DivIconContainer e1cgu1qo1">
                                        <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M8 6C6.89543 6 6 6.89543 6 8V21C6 22.1046 6.89543 23 8 23H21C22.1046 23 23 22.1046 23 21V8C23 6.89543 22.1046 6 21 6H8ZM10 19V10H19V19H10ZM28 6C26.8954 6 26 6.89543 26 8V21C26 22.1046 26.8954 23 28 23H41C42.1046 23 43 22.1046 43 21V8C43 6.89543 42.1046 6 41 6H28ZM30 19V10H39V19H30ZM8 26C6.89543 26 6 26.8954 6 28V41C6 42.1046 6.89543 43 8 43H21C22.1046 43 23 42.1046 23 41V28C23 26.8954 22.1046 26 21 26H8ZM10 39V30H19V39H10ZM26 42C26 42.5523 26.4477 43 27 43H29C29.5523 43 30 42.5523 30 42V27C30 26.4477 29.5523 26 29 26H27C26.4477 26 26 26.4477 26 27V42ZM32.5 42C32.5 42.5523 32.9477 43 33.5 43H35.5C36.0523 43 36.5 42.5523 36.5 42V27C36.5 26.4477 36.0523 26 35.5 26H33.5C32.9477 26 32.5 26.4477 32.5 27V42ZM40 43C39.4477 43 39 42.5523 39 42V27C39 26.4477 39.4477 26 40 26H42C42.5523 26 43 26.4477 43 27V42C43 42.5523 42.5523 43 42 43H40Z"></path></svg>
                                    </div>Use QR code
                                </div>
                            </a>
                            <Link to="/login/phone-or-email" class="tiktok-1bi32tb-ALink epl6mg0">
                                <div class="tiktok-xbg2z9-DivBoxContainer e1cgu1qo0">
                                    <div class="tiktok-biy4dj-DivIconContainer e1cgu1qo1">
                                        <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.0003 7C20.1343 7 17.0003 10.134 17.0003 14C17.0003 17.866 20.1343 21 24.0003 21C27.8663 21 31.0003 17.866 31.0003 14C31.0003 10.134 27.8663 7 24.0003 7ZM13.0003 14C13.0003 7.92487 17.9252 3 24.0003 3C30.0755 3 35.0003 7.92487 35.0003 14C35.0003 20.0751 30.0755 25 24.0003 25C17.9252 25 13.0003 20.0751 13.0003 14ZM24.0003 33C18.0615 33 13.0493 36.9841 11.4972 42.4262C11.3457 42.9573 10.8217 43.3088 10.2804 43.1989L8.32038 42.8011C7.77914 42.6912 7.4266 42.1618 7.5683 41.628C9.49821 34.358 16.1215 29 24.0003 29C31.8792 29 38.5025 34.358 40.4324 41.628C40.5741 42.1618 40.2215 42.6912 39.6803 42.8011L37.7203 43.1989C37.179 43.3088 36.6549 42.9573 36.5035 42.4262C34.9514 36.9841 29.9391 33 24.0003 33Z"></path></svg>
                                    </div>Use phone / email / username
                                </div>
                            </Link>
                            <LoginFacebook/>
                            <LoginGoogle/>
                        </div>:
                        <form>
                            <div class="tiktok-qi6rr-DivTitle e1521l5b1">Log in</div>
                            <Formlogin/>
                        </form>}
                    </div>
                    {state.login_email_phone?
                    <div onClick={()=>setState({...state,login_email_phone:false})} class="tiktok-1komt3e-DivBack e1lgic6i0">
                        <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.58579 22.5858L20.8787 6.29289C21.2692 5.90237 21.9024 5.90237 22.2929 6.29289L23.7071 7.70711C24.0976 8.09763 24.0976 8.7308 23.7071 9.12132L8.82843 24L23.7071 38.8787C24.0976 39.2692 24.0976 39.9024 23.7071 40.2929L22.2929 41.7071C21.9024 42.0976 21.2692 42.0976 20.8787 41.7071L4.58579 25.4142C3.80474 24.6332 3.80474 23.3668 4.58579 22.5858Z"></path></svg>
                        Go back
                    </div>:''}
                </div>
                <div class="tiktok-8jkdwh-DivFooterContainer etab5w60">
                    <div class="tiktok-1ukv4ao-DivContainer e1b6crsh0">
                        <div>Don’t have an account?  </div>
                        <a href="/signup" class="tiktok-1f8xcgp-ALink epl6mg0">
                            <span class="tiktok-qon7yp-SpanLinkText e1b6crsh1">Sign up</span>
                        </a>
                    </div>
                    <div class="tiktok-857ltq-DivBottomContainer etab5w61">
                        <div class="tiktok-12qkzgl-DivContainer e9zvghz0">
                            <p class="tiktok-uqz62q-PSelectContainer e9zvghz1">
                                <span>English</span>
                            </p>
                            <select class="tiktok-vm0biq-SelectFormContainer e9zvghz2">
                                        <option value="ar">العربية</option>
                                        <option value="bn-IN">বাঙ্গালি (ভারত)</option>
                                        <option value="ceb-PH">Cebuano (Pilipinas)</option>
                                        <option value="cs-CZ">Čeština (Česká republika)</option>
                                        <option value="de-DE">Deutsch</option>
                                        <option value="el-GR">Ελληνικά (Ελλάδα)</option>
                                        <option selected="" value="en">English</option>
                                        <option value="es">Español</option>
                                        <option value="fi-FI">Suomi (Suomi)</option>
                                        <option value="fil-PH">Filipino (Pilipinas)</option>
                                        <option value="fr">Français</option>
                                        <option value="he-IL">עברית (ישראל)</option>
                                        <option value="hi-IN">हिंदी</option>
                                        <option value="hu-HU">Magyar (Magyarország)</option>
                                        <option value="id-ID">Bahasa Indonesia (Indonesia)</option>
                                        <option value="it-IT">Italiano (Italia)</option>
                                        <option value="ja-JP">日本語（日本）</option>
                                        <option value="jv-ID">Basa Jawa (Indonesia)</option>
                                        <option value="km-KH">ខ្មែរ (កម្ពុជា)</option>
                                        <option value="ko-KR">한국어 (대한민국)</option>
                                        <option value="ms-MY">Bahasa Melayu (Malaysia)</option>
                                        <option value="my-MM">မြန်မာ (မြန်မာ)</option>
                                        <option value="nl-NL">Nederlands (Nederland)</option>
                                        <option value="pl-PL">Polski (Polska)</option>
                                        <option value="pt-BR">Português (Brasil)</option>
                                        <option value="ro-RO">Română (Romania)</option>
                                        <option value="ru-RU">Русский (Россия)</option>
                                        <option value="sv-SE">Svenska (Sverige)</option>
                                        <option value="th-TH">ไทย (ไทย)</option>
                                        <option value="tr-TR">Türkçe (Türkiye)</option>
                                        <option value="uk-UA">Українська (Україна)</option>
                                        <option value="ur">اردو</option>
                                        <option value="vi-VN">Tiếng Việt (Việt Nam)</option>
                                        <option value="zh-Hans">简体中文</option>
                                        <option value="zh-Hant-TW">繁體中文</option>
                            </select>
                        </div>
                        <div class="tiktok-tljvws-DivCopyright etab5w62">© 2022 TikTok</div>
                    </div>
                </div>
            </div>
        </div>
               
        
    )
}
export default Login