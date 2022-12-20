import axios from 'axios'
import React,{useState,useEffect} from 'react'
import {reset_password,headers,expiry,reset_password_confirm} from "../actions/auth"
import {useNavigate,Link} from "react-router-dom"
import {connect} from "react-redux"
import {validatEemail,validatePassword,isVietnamesePhoneNumber,onValidUsername} from "../constants"
import {sendOTPemailURL,verifyemailURL,verifyphoneURL,sendOTPphoneURL} from "../urls"
const FormReset=(props)=>{
    const {reset_password,reset_password_confirm}=props
    const [formData, setformData] = useState({
        email: '',
        phone:'',
        reset:true,
        code:'',
        verify_email:false,
        password:'',
        verify_phone:false,
        verify_code:false
    });
    const [reset,setReset]=useState({email:true})
    let navigate = useNavigate();
    const { email,new_password,phone,code,username } = formData;
    const [state,setState]=useState({time:0,error:true,showpass:false,showrepass:false,style:{backgroundImage: `url(&quot;https://cf.shopee.vn/file/5569eb9dc7e09e2dbed5315b8f2ea8ba&quot;)`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center'}})
    
    const setpassword=(e)=>{
        (async () =>{
            try{
                e.preventDefault();
                
                const form={code,email,phone}
                const res=await axios.post(validatEemail(formData.email)?verifyemailURL:verifyphoneURL,JSON.stringify(form),headers())
                if(res.verify){
                    setState({...state,error:false})
                    reset_password_confirm(formData.uidb64,formData.token, formData.password);
                    setTimeout(() => {
                    navigate("/login");
                    }, 1500);
                }
                else{
                    setState({...state,error:true})
                }
            }
            catch{

            }
        })()
        
    }

    const sendcode=(e)=>{
        e.stopPropagation()
        if(isVietnamesePhoneNumber(formData.phone) || validatEemail(formData.email)){
            if(isVietnamesePhoneNumber(formData.phone)){    
                const form={'phone':`+84 ${(formData.phone).slice(-9)}`,reset:true}
                let time=60
                setState({...state,time:time})
                axios.post(sendOTPphoneURL,JSON.stringify(form),headers())
                .then(res=>{
                    setformData({...formData,id:res.data.id})
                        const countDown = setInterval(() => {
                        time--
                        console.log(state)
                        setState({...state,time:time})
                        if (time <= 0) {
                            clearInterval(countDown)
                        time=0
                        setState({...state,time:0})
                        }
                    },1000);
                })
            }
            else{
                axios.post(sendOTPemailURL,JSON.stringify({email,username}),headers())
                .then(res=>{
                    setState({...state,error:res.data.error,show:true,requestsend:res.data.error?false:true})
                    setTimeout(()=>{
                        setState({...state,requestsend:false})
                    },4000)
                })
                
            }
        }
    }

    return(
        <>
            <div class="title-wrapper-3KgEa">
                <div>{reset.email?'Enter email address':'Enter phone number'}</div>
                <Link class="link-2j8GS" onClick={e=>{
                    e.preventDefault()
                    setReset({...reset,email:!reset.email})
                }} to={`/login/${!reset.email?'phone':'email'}/forget-password`}>Reset with {reset.email?'phone number':'email'}</Link>
            </div>
            {reset.email?
            <div className="form-container-3hjAo">
                <div className="input-field-3x_mo input-field-pc-FOzso">
                    <input onChange={(e)=>setformData({...formData,email:e.target.value})} placeholder="Email or Username" type="text" autoComplete="email" name="email" value={formData.email}/>
                </div>
            </div>:
            <div className="input-field-3x_mo input-field-pc-FOzso">
                <div className="container-1lSJp selector-container" style={{borderRadius: '4px 0px 0px 4px'}}>
                    <div className="select-container-2Ubyt">VN +84</div>
                </div>
                <div className="separator-wrapper-CAW8A">
                    <p className="separator-8d23F"></p>
                </div>
                <input onChange={(e)=>setformData({...formData,phone:e.target.value})} placeholder="Phone number" type="text" name="reg_email__" autocomplete="reg_email__" value={formData.phone} style={{borderRadius: '0px 4px 4px 0px'}}/>
            </div>}
            <div className="digit-code-container-GBZyT">
                <div className="input-field-3x_mo input-field-pc-FOzso" style={{borderRadius: '4px 0px 0px 4px', borderRight: 'none'}}>
                    <input onChange={(e)=>setformData({...formData,code:e.target.value})} placeholder="Enter 6-digit code" value={formData.code} style={{borderRadius: '4px 0px 0px 4px'}}/>
                </div>
                <button onClick={(e)=>sendcode(e)} className={`login-button-31D24 line-ErmhG ${formData.email!='' || formData.phone!=''?'':'disable-fEJEn'} highlight-1TvcX`} disabled={formData.email!=''&&formData.username!='' || formData.phone!=''?false:true} type="button" style={{borderRadius: '0px 4px 4px 0px'}}>{state.time>0?`Resend code: ${state.time}`:'Send code'}</button>
            </div>
            <div className="form-container-3WLeZ">
                <div className="input-field-3x_mo input-field-pc-FOzso move-warning-2Xqmt">
                    <p onClick={()=>setState({...state,show_password:!state.show_password})} className={`${state.show_password?'show-password-1WMPY':'hide-password-1sE4v'}`}></p>
                    <input onChange={(e)=>setformData({...formData,password:e.target.value})} placeholder="Password" type={state.show_password?'text':'password'} autoComplete="password" name="password" value={formData.password}/>
                </div>
            </div>
            <button onClick={(e)=>setpassword(e)} class="login-button-31D24 disable-fEJEn highlight-1TvcX" disabled={formData.password!=''} type="submit">Verify</button>
        </>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated
});
export default connect(mapStateToProps, { reset_password,reset_password_confirm })(FormReset);
