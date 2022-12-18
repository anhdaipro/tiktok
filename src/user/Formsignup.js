import axios from 'axios'
import React,{useState,useEffect} from 'react'
import {signup,reset_password,headers,expiry} from "../actions/auth"
import {connect} from "react-redux"
import {useNavigate} from "react-router-dom"
import {validatEemail,validatePassword,isVietnamesePhoneNumber,onValidUsername,generateString} from "../constants"
import {sendOTPphoneURL,registerURL,checkuserURL, verifyemailURL,verifyphoneURL} from "../urls"
const Formsignup=(props)=>{
    const {signup,isAuthenticated}=props
    const [singnup,setSignup]=useState({show_signup:false})
    const [formData,setformData]=useState({day:null,month:null,year:null,username:null,name:'',email:'',
    code:'',password:'',phone:null})
    const navigate=useNavigate()
    const[show,setShow]=useState({day:false,month:false,year:false})
    const [state,setState]=useState({show_password:false,time:0})
    const year_now=new Date().getFullYear()
    const list_year=Array(year_now).fill().map((_, i) => i).filter(item=>item>year_now-100)
    useEffect(()=>{
        document.addEventListener('click',handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    },[])
    const handleClick=(event)=>{
        let parent=event.target.closest('.container-1lSJp.selector-container')
        if (!parent) {
            setShow({...show,day:false,month:false,year:false})
        }
    }
    const setdate=(e,name,value)=>{
        setformData({...formData,[name]:value})
        if(new Date(value,formData.month,formData.date)=="Invalid Date"){  
            setState({...state,valid_date:true}) 
        }
        else{
            setState({...state,valid_date:false}) 
        }
        setShow({...show,[name]:false}) 
    }

    function dateIsValid(dateStr) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
      
        if (dateStr.match(regex) === null) {
          return false;
        }
      
        const date = new Date(dateStr);
      
        const timestamp = date.getTime();
      
        if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
          return false;
        }
      
        return date.toISOString().startsWith(dateStr);
    }
    const sendcode=(e)=>{
        e.stopPropagation()
        if(isVietnamesePhoneNumber(formData.phone) || validatEemail(formData.email)){
            if(isVietnamesePhoneNumber(formData.phone)){    
                let time=60
                setState({...state,time:time})
                axios.post(sendOTPphoneURL,JSON.stringify({phone:`+84 ${(formData.phone).slice(-9)}`}),headers)
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
                axios.post(checkuserURL,JSON.stringify({username:formData.username,email:formData.email}),headers)
                .then(res=>{
                    setState({...state,error:res.data.error,show:true,requestsend:res.data.error?false:true})
                    setTimeout(()=>{
                        setState({...state,requestsend:false})
                    },4000)
                })
                
            }
        }
    }
    const {username,email,password}=formData
    const submitform=(e)=>{
        (async ()=>{
            try{
                e.preventDefault()
                
                const form=isVietnamesePhoneNumber(formData.phone)?{'code':formData.code,'phone':`+84 ${(formData.phone).slice(-9)}`}:{'code':formData.code,'email':formData.email}
                const res =await axios.post(isVietnamesePhoneNumber(formData.phone)?verifyphoneURL:verifyemailURL,JSON.stringify(form),headers)
                if(res.data.verify){
                    const username=formData.username
                    let profile=isVietnamesePhoneNumber(formData.phone)?{phone:formData.phone ,date_of_birth:formData.year+'-'+('0'+formData.month).slice(-2)+'-'+('0'+formData.day).slice(-2)}:{date_of_birth:formData.year+'-'+('0'+formData.month).slice(-2)+'-'+('0'+formData.day).slice(-2)}
                    signup(username?username:generateString(12),email,password,profile)
                    navigate('/login')
                }
                setState({...state,verify:res.data.verify})
                    setTimeout(()=>{
                        setState({...state,verify:undefined})
                    },3000)
                }
                catch{
                    setState({...state,verify:false})
                }
        })()
    }
    
    return(
        <>
            {state.requestsend?<div>Mã xác minh đã được gửi đến {isVietnamesePhoneNumber(formData.phone)?'':'địa chỉ email'} <span class="_25142T">{isVietnamesePhoneNumber(formData.phone)?`+84 ${(formData.phone).slice(-9)}`:formData.email}</span>.</div>:''}
            {state.error?
            <div class="_7Ao-BQ _2CyKyE umTGIP">
                <div class="o5DLud">
                    <svg viewBox="0 0 16 16" class="_2-4Lck"><path fill="none" stroke="#FF424F" d="M8 15A7 7 0 108 1a7 7 0 000 14z" clip-rule="evenodd"></path><rect stroke="none" width="7" height="1.5" x="6.061" y="5" fill="#FF424F" rx=".75" transform="rotate(45 6.06 5)"></rect><rect stroke="none" width="7" height="1.5" fill="#FF424F" rx=".75" transform="scale(-1 1) rotate(45 -11.01 -9.51)"></rect></svg>
                </div>
                <div>
                    <div class="_3mi2mp">Tên tài khoản của bạn hoặc Mật khẩu đã được sử dụng</div>
                </div>
            </div>:''}
            {state.verify!=undefined && !state.verify?
            <div class="_7Ao-BQ _2CyKyE umTGIP">
                <div class="o5DLud">
                    <svg viewBox="0 0 16 16" class="_2-4Lck"><path fill="none" stroke="#FF424F" d="M8 15A7 7 0 108 1a7 7 0 000 14z" clip-rule="evenodd"></path><rect stroke="none" width="7" height="1.5" x="6.061" y="5" fill="#FF424F" rx=".75" transform="rotate(45 6.06 5)"></rect><rect stroke="none" width="7" height="1.5" fill="#FF424F" rx=".75" transform="scale(-1 1) rotate(45 -11.01 -9.51)"></rect></svg>
                </div>
                <div>
                    <div class="_3mi2mp">The authentication code is not correct</div>
                </div>
            </div>:''}
            <div className="title-wrapper-3KgEa">
                <div>When’s your birthday?</div>
            </div>
            <div className="date-selector-pc-oyWlO">
                <div className="container-1lSJp selector-container">
                    <div onClick={()=>setShow({...show,month:!show.month,day:false,year:false})} className={`select-container-2Ubyt ${formData.month!=null?'':'not-selected-1Tb33'}`}>{formData.month!=null?('0'+formData.month).slice(-2):'Month'}</div>
                    {show.month?
                    <ul className="list-container-2f5zg" style={{width: '100%'}}> 
                        {Array(12).fill().map((_, i)=>
                            <li onClick={(e)=>setdate(e,'month',i+1)} className="list-item-MOAq4">
                                <span>{('0'+(i+1)).slice(-2)}</span>
                            </li>
                        )}
                    </ul>:''}
                </div>
                <div className="container-1lSJp selector-container">
                    <div onClick={()=>setShow({...show,day:!show.day,month:false,year:false})} className={`select-container-2Ubyt ${formData.day!=null?'':'not-selected-1Tb33'}`}>{formData.day!=null?('0'+formData.day).slice(-2):'Day'}</div>
                    {show.day?
                    <ul className="list-container-2f5zg" style={{width: '100%'}}> 
                        {Array(31).fill().map((_, i)=>
                            <li onClick={(e)=>setdate(e,'day',i+1)}  className="list-item-MOAq4">
                                <span>{('0'+(i+1)).slice(-2)}</span>
                            </li>
                        )}
                    </ul>:''}
                </div>
                <div className="container-1lSJp selector-container">
                    <div onClick={()=>setShow({...show,year:!show.year,day:false,month:false})} className={`select-container-2Ubyt ${formData.year!=null?'':'not-selected-1Tb33'}`}>{formData.year!=null?formData.year:'Year'}</div>
                    {show.year?
                    <ul className="list-container-2f5zg" style={{width: '100%'}}> 
                        {list_year.reverse().map(i=>
                            <li onClick={(e)=>setdate(e,'year',i)} className="list-item-MOAq4">
                                <span>{i}</span>
                            </li>
                        )}
                    </ul>:''}
                </div>
                </div>
                {formData.day!=null && formData.month!=null && formData.year!=null&& !dateIsValid(formData.year+'-'+('0'+formData.month).slice(-2)+'-'+('0'+formData.day).slice(-2))?<div className="_1iNZU3">
                <div className="_3qXkYh">Ngày không hợp lệ, vui lòng chỉnh ngày chính xác</div>
                </div>:''}
                <div style={{paddingBottom: '40px'}}>
                <div className="title-wrapper-3KgEa" style={{marginBottom: '-4px'}}>
                    <div>{singnup.loginemail?'Email':'Phone'}</div>
                    <a onClick={e=>{
                        e.preventDefault()
                        setSignup({...singnup,loginemail:!singnup.loginemail})
                    }} className="link-2j8GS" href="/signup/phone-or-email/email">Sign up with {singnup.loginemail?'phone':'email'}</a>
                </div>
                {!singnup.loginemail?
                <div className="input-field-3x_mo input-field-pc-FOzso">
                    <div className="container-1lSJp selector-container" style={{borderRadius: '4px 0px 0px 4px'}}>
                        <div className="select-container-2Ubyt">VN +84</div>
                    </div>
                    <div className="separator-wrapper-CAW8A">
                        <p className="separator-8d23F"></p>
                    </div>
                    <input onChange={(e)=>setformData({...formData,phone:e.target.value})} placeholder="Phone number" type="text" name="reg_email__" autocomplete="reg_email__" value={formData.phone} style={{borderRadius: '0px 4px 4px 0px'}}/>
                </div>:
                <>
                <div className="form-container-3hjAo">
                    <div className="input-field-3x_mo input-field-pc-FOzso">
                        <input onChange={(e)=>setformData({...formData,email:e.target.value})} placeholder="Email" type="text" autoComplete="email" name="email" value={formData.email}/>
                    </div>
                </div>
                <div className="form-container-3WLeZ">
                    <div className="input-field-3x_mo input-field-pc-FOzso move-warning-2Xqmt"> 
                        <input onChange={(e)=>setformData({...formData,username:e.target.value})} placeholder="Username" type='text' name="username" value={formData.username}/>
                    </div>
                </div>
                {formData.username !=null && !onValidUsername(formData.username)?
                <div className="_3qXkYh">Only letters, numbers, underscores, or periods are allowed</div>
                :''}
                </>}
                <div className="form-container-3WLeZ">
                    <div className="input-field-3x_mo input-field-pc-FOzso move-warning-2Xqmt">
                        <p onClick={()=>setState({...state,show_password:!state.show_password})} className={`${state.show_password?'show-password-1WMPY':'hide-password-1sE4v'}`}></p>
                        <input onChange={(e)=>setformData({...formData,password:e.target.value})} placeholder="Password" type={state.show_password?'text':'password'} autoComplete="password" name="password" value={formData.password}/>
                    </div>
                </div>
                <div className="digit-code-container-GBZyT">
                    <div className="input-field-3x_mo input-field-pc-FOzso" style={{borderRadius: '4px 0px 0px 4px', borderRight: 'none'}}>
                        <input onChange={(e)=>setformData({...formData,code:e.target.value})} placeholder="Enter 6-digit code" value={formData.code} style={{borderRadius: '4px 0px 0px 4px'}}/>
                    </div>
                    <button onClick={(e)=>sendcode(e)} className={`login-button-31D24 line-ErmhG ${dateIsValid(formData.year+'-'+('0'+formData.month).slice(-2)+'-'+('0'+formData.day).slice(-2))&& (formData.email!=''&&formData.username!='') || formData.phone!=''?'':'disable-fEJEn'} highlight-1TvcX`} disabled={dateIsValid(formData.year+'-'+('0'+formData.month).slice(-2)+'-'+('0'+formData.day).slice(-2))&& (formData.email!=''&&formData.username!='') || formData.phone!='' && state.time==0?false:true} type="button" style={{borderRadius: '0px 4px 4px 0px'}}>{state.time>0?`Resend code: ${state.time}`:'Send code'}</button>
                </div>
                
                <button  onClick={e=>submitform(e)} className={`login-button-31D24 ${formData.code.trim().length==6?'':'disable-fEJEn'} highlight-1TvcX`} disabled={formData.code.trim().length==6?false:true} type="submit">Register</button>
            </div>
        </>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated
});
export default connect(mapStateToProps, {signup,reset_password })(Formsignup);
