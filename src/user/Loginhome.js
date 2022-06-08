
import React,{useState,useEffect} from 'react'
import Formsignup from "./Formsignup"
import {signup,login,facebookLogin,googleLogin,reset_password} from "../actions/auth"
import { connect } from 'react-redux';
import Formlogin from './Formlogin'
import LoginGoogle from "./LoginGoogle"
import LoginFacebook from "./LoginFacebook"
const Loginhome=({setrequestlogin,user,isAuthenticated,login})=>{
    const [requestsignup,setRequestsingnup]=useState(false)
    const [state,setState]=useState({show_brower:false,loginemail:false,show_login:false,show_password:false,resetsencode:false,time:0})
    const [singnup,setSignup]=useState({show_signup:false})
    const [requestSent, setRequestSent] = useState(false);
    const loginchoice=()=>{
        setState({...state,loginemail:false,show_login:true,loginphonewithcode:true,requestreset:false})
    }
    
    const setclose=()=>{
        setrequestlogin(false)
        if(!requestsignup){
        setState({...state,show_login:false,loginemail:false,loginphonewithcode:true,requestreset:false})
        }
        else{
            setSignup({...singnup,show_signup:false,loginemail:false,loginphonewithcode:true})
        }
    }
    
    
    const signupchoice=()=>{
        setSignup({...singnup,show_signup:true,loginemail:false,loginphonewithcode:true})
    }
    
    return(
        <div className='tiktok-py8jux-DivModalContainer e1gjoq3k0'>
                <div className="tiktok-1fs75a4-DivModalMask e1gjoq3k1"></div>
                <div className="tiktok-1bg0j8b-DivContentContainer e1gjoq3k2">
                    <div className="tiktok-9zul1d-DivFrameContainer eaxh4gs0">
                        <button onClick={()=>setclose()} className="tiktok-deqhom-ButtonCloseWrapper eaxh4gs1">
                            <svg className="tiktok-ppm7qc-StyledXMark eaxh4gs2" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.1718 23.9999L10.2931 13.1212C9.90261 12.7307 9.90261 12.0975 10.2931 11.707L11.7074 10.2928C12.0979 9.90228 12.731 9.90228 13.1216 10.2928L24.0002 21.1715L34.8789 10.2928C35.2694 9.90228 35.9026 9.90228 36.2931 10.2928L37.7073 11.707C38.0979 12.0975 38.0979 12.7307 37.7073 13.1212L26.8287 23.9999L37.7073 34.8786C38.0979 35.2691 38.0979 35.9023 37.7073 36.2928L36.2931 37.707C35.9026 38.0975 35.2694 38.0975 34.8789 37.707L24.0002 26.8283L13.1216 37.707C12.731 38.0975 12.0979 38.0975 11.7074 37.707L10.2931 36.2928C9.90261 35.9023 9.90261 35.2691 10.2931 34.8786L21.1718 23.9999Z"></path></svg>
                        </button>
                        <div className="tiktok-app-container-12zKy">
                            <header className="tiktok-web-header-13pzv no-title-2H3Hq is-modal-3Rj9l">
                                {state.show_login || singnup.show_signup || reset_password?<>
                                <div className="login-title-1Zd0- pc-title-1JpDs">{requestsignup?'Signup':'Log in'}</div>
                                <div onClick={()=>requestsignup?setSignup({...singnup,show_signup:false}):setState({...state,show_login:false})} className="back-modal-3gZXj"></div></>
                                :''}
                            </header>
                            <div className="tiktok-web-body-33PDi tiktok-web-body-modal-2N5Wt" style={{marginTop: '0px'}}>
                                {!state.show_login && !singnup.show_signup?
                                <div className="tiktok-web-login-2P7wd">
                                    <div className="login-container-4HZX- modal-container-fsYki" style={{maxHeight: 'calc((100vh - 70px) - 60px)'}}>
                                        <div className="login-title-container-MsJ7l">
                                            <div className="login-title-1FcQm">{requestsignup?'Sign up for TikTok':'Log in to TikTok'}</div>
                                        </div>
                                        <div className="social-container-NE2xk">
                                            <div className="channel-item-wrapper-2gBWB">
                                                <div className="channel-icon-wrapper-2eYxZ">
                                                    <div className="channel-icon-33qGs" style={{backgroundImage: `url(&quot;//lf16-tiktok-web.ttwstatic.com/obj/tiktok-web/tiktok/webapp_login/svgs/QR_Code.22d6d5db.svg&quot;)`, borderRadius: '0px'}}></div>
                                                </div>
                                                <div className="channel-name-2qzLW">Use QR code</div>
                                            </div>
                                            <div onClick={(e)=>!requestsignup?loginchoice(e):signupchoice(e)} className="channel-item-wrapper-2gBWB">
                                                <div className="channel-icon-wrapper-2eYxZ">
                                                    <div className="channel-icon-33qGs" style={{backgroundImage: `url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAANlBMVEVHcEwAAAAJChIMDBkWGCIOEBcOEBcJCg8QEhwNDxQUFiAAAAAAAAAVFyMDBAYQEhsWGCMAAAD5xs1FAAAAEHRSTlMA7zAQ33+jXkIgxt/B72+Q9PCfEQAAASBJREFUSMftVMsSgyAM5CUEENT//9k2aEesQNLeOtM9EciSLCwI8cd30GDNugbrmPnwzN5hWJRprTB9mM9guD0NhFC2DIEgYP9G7WNfAkYB/4oUXQLbsGe4XMMGwnVLIHvCHuorfItJgiAJpta8q06khul6aGFIyLilfkXlIsZ+0gn3PBga6yXPsJKB07WkmUJxUAohlUGgX4+pzRo8470tZ/6iWU/O29JOssB/1grA//K35LONctvkHDJHB8xbhZn6mdQlHRGHVbLc7sgD5x19ZKXxh81HuWmcP0N95yOGwzX5ptKVJpvSfcR8dTsGZMiWCUt11Tg4nG/8Zr7bbG7vhAViWxwe1nKbjT1tz8tHFbdZ2S3QWXNRdn0zWvtFPAAmbxZPKTUEzQAAAABJRU5ErkJggg==&quot;)`, borderRadius: '50%'}}></div>
                                                </div>
                                                <div className="channel-name-2qzLW">Use phone / email / username</div>
                                            </div>
                                            <LoginFacebook/>
                                            <LoginGoogle/>
                                        </div>
                                    </div>
                                    <div className="footer-wrapper-xil5O"></div>
                                </div>
                                :
                                <form>
                                    {/* form signup */}
                                    {requestsignup?
                                    <Formsignup/>
                                    :
                                   
                                    <Formlogin/>
                                    
                                    }
                                </form>}
                            </div>
                            <div className="footer-bottom-wrapper-1a-rL">
                                {requestsignup?
                                <div className="footer-signup-agreement-1mszd">
                                    <div className="sub-title-ENYux">
                                        <div>By continuing, you agree to TikTok’s  
                                            <a target="_blank" rel="noopener noreferrer" href="https://www.tiktok.com/legal/terms-of-use?lang=en"> Terms of Service</a> 
                                                and confirm that you have read TikTok’s  
                                            <a target="_blank" rel="noopener noreferrer" href="https://www.tiktok.com/legal/privacy-policy?lang=en"> Privacy Policy</a>.
                                        </div>
                                    </div>
                                </div>:''}
                                <div className="toggle-2SAdO is-modal-1F8S3">
                                    <div className="to-login-1_lof">{requestsignup?'Don’t':'Already'} have an account? 
                                        <a onClick={e=>{
                                        e.preventDefault()
                                        setRequestsingnup(!requestsignup)
                                        setSignup({...singnup,show_signup:false})
                                        setState({...state,show_login:false})
                                        }} className="big-2_yje link-2j8GS" href={`/${requestsignup?'login':'signup'}?enter_from=homepage_hot`}>{requestsignup?'Log in':'Sign up'}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated
});
export default connect(mapStateToProps, { login,signup,facebookLogin,googleLogin,reset_password })(Loginhome);
