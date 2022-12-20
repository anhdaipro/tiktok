import axios from 'axios'
import React,{useState,useEffect} from 'react'
import {login, headers,loginotp,expiry} from "../actions/auth"
import {connect} from "react-redux"
import {Link,Navigate,useNavigate} from "react-router-dom"
import {verifyphoneURL,sendOTPphoneURL} from "../urls"
import {validatEemail,validatePassword,isVietnamesePhoneNumber,onValidUsername} from "../constants"

const Formlogin=(props)=>{
    const {login,isAuthenticated,loginotp}=props
    const [formlogin,setFormlogin]=useState({code:'',username:'',name:'',email:'',password:'',phone:''})
    const [state,setState]=useState({show_login:false,loginemail:false,loginphonewithcode:true,requestreset:false,time:0})
    const {email,code,password,phone}=formlogin
    const [show,setShow]=useState(false)
    const navigate=useNavigate()
    const setlogin=(e)=>{
        e.preventDefault();
        (async ()=>{
            try{
            login(email,password) 
            setTimeout(function(){
                {if(isAuthenticated!=null){
                    if(isAuthenticated){
                    setState({...state,error:true})
                    }
                    else{
                        setState({...state,error:false})
                    }
                }
            }
            },1000)
        }
        catch{
        }
        })()  
    }

    const setsentcode=(e)=>{
        e.preventDefault();
        setShow(true)
        let time=60
        setState({...state,time:time})
        axios.post(sendOTPphoneURL,JSON.stringify({'phone':`+84 ${(formlogin.phone).slice(-9)}`,login:true}))
        .then(res=>{
            setFormlogin({...formlogin,id:res.data.id})
            const countDown = setInterval(() => {
                time--
                console.log(state)
                setState({...state,time:time})
                if (time <= 0) {
                    clearInterval(countDown)
                    time=0
                    setState({...state,time:0})
                }
            }, 1000);
        })
    }

    const onSubmit = e => {
        e.preventDefault();
        (async () => {
            try {
                const res = await axios.post(verifyphoneURL,JSON.stringify({id:formlogin.id,code:formlogin.code,'phone':`+84 ${(formlogin.phone).slice(-9)}`}),headers())
                setFormlogin({...formlogin,...res.data})
                if(res.data.user_id!=undefined){
                    loginotp(res.data.user_id)
                }
                    
            } catch (error) {
                setState({...state,error:true})
            }
        })();
    };
    useEffect (()=>{
        if(isAuthenticated){
            setState({...state,error:false})
            window.location.href='/'
        } 
    },[isAuthenticated])
    return(
        <>  
            {state.error?
            <div className="_7Ao-BQ disryx umTGIP">
                <div className="o5DLud">
                    <svg viewBox="0 0 16 16" className="_2-4Lck"><path fill="none" stroke="#FF424F" d="M8 15A7 7 0 108 1a7 7 0 000 14z" clip-rule="evenodd"></path><rect stroke="none" width="7" height="1.5" x="6.061" y="5" fill="#FF424F" rx=".75" transform="rotate(45 6.06 5)"></rect><rect stroke="none" width="7" height="1.5" fill="#FF424F" rx=".75" transform="scale(-1 1) rotate(45 -11.01 -9.51)"></rect></svg>
                </div>
                <div>
                    <div className="_3mi2mp">Tên tài khoản của bạn hoặc Mật khẩu không đúng, vui lòng thử lại</div>
                </div>
            </div>:''}
            <div className="title-wrapper-3KgEa" style={{marginBottom: '-4px'}}>
            <div>{!state.loginemail?'Phone':'Email or Username'}</div>
            <a onClick={()=>setState({...state,loginemail:!state.loginemail})} className="link-2j8GS" >Log in with {!state.loginemail?'email or username':'phone'}</a>
            </div>
            {!state.loginemail?<>
            <div className="input-field-3x_mo input-field-pc-FOzso">
            <div className="container-1lSJp selector-container" style={{borderRadius: '4px 0px 0px 4px'}}>
                <div className="select-container-2Ubyt">VN +84</div>
            </div>
            <div className="separator-wrapper-CAW8A">
                <p className="separator-8d23F"></p>
            </div>
            <input onChange={e=>setFormlogin({...formlogin,phone:e.target.value})} placeholder="Phone number" autoComplete="reg_email__" name="reg_email__" value={formlogin.phone} style={{borderRadius: '0px 4px 4px 0px'}}/>
            <div className="after-3ZNth"></div>
            </div>
            <div className="digit-code-container-GBZyT">
            <div className="input-field-3x_mo input-field-pc-FOzso" style={{borderRadius: '4px 0px 0px 4px', borderRight: 'none'}}>
                <input onChange={(e)=>setFormlogin({...formlogin,code:e.target.value})} placeholder="Enter 6-digit code" value={formlogin.code} style={{borderRadius: '4px 0px 0px 4px'}}/>
                <div className="after-3ZNth"></div>
            </div>
            <button onClick={(e)=>setsentcode(e)} className="login-button-31D24 line-ErmhG highlight-1TvcX" type="button" style={{borderRadius: '0px 4px 4px 0px'}}>{state.time>0?`Resend code: ${state.time}`:'Send code'}</button>
            </div>
            </>
            :<>
            <div className="form-container-3hjAo">
            <div className="input-field-3x_mo input-field-pc-FOzso">
                <input onChange={(e)=>setFormlogin({...formlogin,email:e.target.value})} placeholder="Email or Username" type="text" autoComplete="email" name="email" value={formlogin.email}/>
            </div>
            </div>
            <div className="form-container-3WLeZ">
            <div className="input-field-3x_mo input-field-pc-FOzso move-warning-2Xqmt">
                <p onClick={()=>setState({...state,show_password:!state.show_password})} className={`${state.show_password?'show-password-1WMPY':'hide-password-1sE4v'}`}></p>
                <input onChange={(e)=>setFormlogin({...formlogin,password:e.target.value})} placeholder="Password" type={state.show_password?'text':'password'} autoComplete="password" name="password" value={formlogin.password}/>
            </div>
            </div></>}
            {state.loginphonewithcode || state.loginemail?
            <buttom onClick={()=>!state.loginemail?setState({...state,loginphonewithcode:false}):navigate('/login/forget-password')} className="small-1UkQD grey-rBkrL link-2j8GS"  style={{marginTop: '12px'}}>{state.loginemail?'Forgot password?':'Log in with password'}</buttom>
            :
            <div>
            <Link to="/login/forget-password" className="small-1UkQD grey-rBkrL link-2j8GS"  style={{marginTop: '12px'}}>Forgot password?</Link>
            <div className="separator-1vmQ9"></div>
            <a onClick={()=>setState({...state,loginphonewithcode:true})} className="small-1UkQD grey-rBkrL link-2j8GS"  style={{marginTop: '12px'}}>Log in with code</a>
            </div>}
            <button onClick={(e)=>isVietnamesePhoneNumber(formlogin.phone)?onSubmit(e):setlogin(e)} className={`login-button-31D24 ${(formlogin.email.trim()!=''&&formlogin.password.trim()!='') || formlogin.code.length==6?'':'disable-fEJEn'} highlight-1TvcX`} type="submit">Log in</button>
        </>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated
});
export default connect(mapStateToProps, { login,loginotp })(Formlogin);
