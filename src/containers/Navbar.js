import React,{useState,useEffect,useRef,useCallback} from 'react'
import '../css/header.css';
import { connect } from 'react-redux';
import { expiry, headers, login,logout,updatenotify } from '../actions/auth';
import {debounce} from 'lodash';
import axios from 'axios';
import { searchinputURL,notifycationURL } from '../urls';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Tooltip from "../hocs/Tooltip"
import { checkDay } from '../constants';
import Notify from "./Notify"
const Searchinput=()=>{
    const [state,setState]=useState({text:''})
    const inputref=useRef()
    const [listusser,setListuser]=useState([])
    const [listtag,setlistTag]=useState([])
    const [showResult, setShowResult] = useState(true);
    const navigate=useNavigate()
    const setkeyword=(e)=>{
        let keyword=e.target.value
        setState({...state,text:e.target.value})
        
        fetchinput(keyword)
        
    }

    const fetchinput=useCallback(debounce((keyword)=>{
        ( async ()=>{
            try{
                if(keyword!=''){
                const res =await axios.get(`${searchinputURL}?keyword=${keyword}`,headers)
                setShowResult(true)
                setListuser(res.data.list_user)
                setlistTag(res.data.hashtag)
                }
                else{
                    setListuser([])
                    setlistTag([])
                }
            }
            catch{

            }
        })()
    },1000),[])

    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [])

    const handleClick = (event) => {
        const { target } = event
        if(inputref.current!=null){
            if (!inputref.current.contains(target)) {
                setShowResult(false)
            }
        }
    }
    return(
        <div className="tiktok-thiumz-DivSearchFormContainer eagc08l0">
            <form className="search-input tiktok-ru68kq-FormElement ev30f210" action="/search">
                <input ref={inputref} onFocus={() => setShowResult(true)} onChange={(e)=>setkeyword(e)} type="search" value={state.text} placeholder="Search accounts and videos" name="keyword" autoComplete="off" data-e2e="search-user-input" className="tiktok-InputElement ev30f212"/>
                <span className="tiktok-1l3fo4q-SpanSpliter ev30f215"></span>
                <button type="submit" data-e2e="search-button" className="tiktok-3n0ac4-ButtonSearch ev30f216">
                    <svg width="24" height="24" viewBox="0 0 48 48" fill="rgba(22, 24, 35, 0.34)" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M22 10C15.3726 10 10 15.3726 10 22C10 28.6274 15.3726 34 22 34C28.6274 34 34 28.6274 34 22C34 15.3726 28.6274 10 22 10ZM6 22C6 13.1634 13.1634 6 22 6C30.8366 6 38 13.1634 38 22C38 25.6974 36.7458 29.1019 34.6397 31.8113L43.3809 40.5565C43.7712 40.947 43.7712 41.5801 43.3807 41.9705L41.9665 43.3847C41.5759 43.7753 40.9426 43.7752 40.5521 43.3846L31.8113 34.6397C29.1019 36.7458 25.6974 38 22 38C13.1634 38 6 30.8366 6 22Z"></path></svg>
                </button>
                <div className="tiktok-1dckc0v-DivInputBorder ev30f211"></div>
            </form>
            {listtag.length>0 || listusser.length>0 && showResult?
            <div className="tiktok-vwwmft-Usercotainer e2ipgxl0">
                <div className="tiktok-vwwmft-User-wrapper">
                <ul className="tiktok-list-item">
                    {listtag.map(item=>
                    <li onClick={()=>navigate(`/search?query=${item.tile}`)} className="tiktok-item">
                        <svg width="20" height="20" viewBox="0 0 48 48" fill="rgba(22, 24, 35, 0.75)" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M22 10C15.3726 10 10 15.3726 10 22C10 28.6274 15.3726 34 22 34C28.6274 34 34 28.6274 34 22C34 15.3726 28.6274 10 22 10ZM6 22C6 13.1634 13.1634 6 22 6C30.8366 6 38 13.1634 38 22C38 25.6974 36.7458 29.1019 34.6397 31.8113L43.3809 40.5565C43.7712 40.947 43.7712 41.5801 43.3807 41.9705L41.9665 43.3847C41.5759 43.7753 40.9426 43.7752 40.5521 43.3846L31.8113 34.6397C29.1019 36.7458 25.6974 38 22 38C13.1634 38 6 30.8366 6 22Z"></path></svg>
                        <span className="tiktok-username">{item.title}</span>
                    </li>)}
                </ul>
                <div className="tiktok-list-item">
                    {listusser.map(item=>
                    <div  onClick={()=>navigate(`/${item.username}`)} className="jsx-1498925541 container">
                        <img src={item.picture} className="jsx-1498925541 avatar"/>
                        <div className="jsx-1498925541 user-info">
                            <div className="jsx-1498925541 name">{item.name}</div>
                            <div className="jsx-1498925541 user-id">@{item.username}</div>
                        </div>
                    </div>)}
                </div>
                </div>
            </div>:''}
        </div>
    )
}

const Navbar=(props)=>{
    const {showlogin,isAuthenticated,user,logout,notify,setnotify,updatenotify}=props
    const [state, setState] = useState({show_info:false,show_notification:false,text:''})
    const [listnotify,setListnotify]=useState([])
    useEffect(()=>{
        setState({...state,user:user})
    },[user])
    
    const notifyref=useRef(null)
    const setlogout=(e)=>{
        e.preventDefault();
        logout()
        window.location.href='/'
    }
    console.log(notify)
    useEffect(()=>{
		window.addEventListener("beforeunload", onUnload);
	},[])

    const onUnload=(e)=>{
        if(expiry>0 && localStorage.token){
        axios.post('https://web-production-e83f.up.railway.app/api/v3/user/update/online',JSON.stringify({online:false}),headers)
        .then(res=>{
        })
        }
    }
    
    
    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [])

    const handleClick = (event) => {
        const { target } = event
        if(notifyref.current!=null){
            if (!notifyref.current.contains(target)) {
                setState({...state,show_notification:false})
            }
        }
    }

    const setreadnotify=()=>{
        setState({...state,show_notification:!state.show_notification,show_inbox:false})
        const data={count_notify_unseen:0,send_to:user.id}
        updatenotify(data,1)
        axios.get(notifycationURL,headers)
        .then(res=>{
            setListnotify(res.data)
        })
    }
    
    
    
    return(
        <div style={{right:'0px'}} className="tiktok-12azhi0-DivHeaderContainer e10win0d0">
            <div className="tiktok-notu47-DivHeaderWrapperMain e10win0d1">
                <a data-e2e="tiktok-logo" className="tiktok-1431rw4-StyledLinkLogo e1an6zpe0" href="/?lang=en">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="118px" height="42px" viewBox="0 0 1000 291.379" enableBackground="new 0 0 1000 291.379" xmlSpace="preserve">
                        <g>
                        <path fill="#FF004F" d="M191.102,105.182c18.814,13.442,41.862,21.351,66.755,21.351V78.656c-4.711,0.001-9.41-0.49-14.019-1.466   v37.686c-24.891,0-47.936-7.909-66.755-21.35v97.703c0,48.876-39.642,88.495-88.54,88.495c-18.245,0-35.203-5.513-49.29-14.968   c16.078,16.431,38.5,26.624,63.306,26.624c48.901,0,88.545-39.619,88.545-88.497v-97.701H191.102z M208.396,56.88   c-9.615-10.499-15.928-24.067-17.294-39.067v-6.158h-13.285C181.161,30.72,192.567,47.008,208.396,56.88L208.396,56.88z    M70.181,227.25c-5.372-7.04-8.275-15.652-8.262-24.507c0-22.354,18.132-40.479,40.502-40.479   c4.169-0.001,8.313,0.637,12.286,1.897v-48.947c-4.643-0.636-9.329-0.906-14.013-0.807v38.098c-3.976-1.26-8.122-1.9-12.292-1.896   c-22.37,0-40.501,18.123-40.501,40.48C47.901,206.897,56.964,220.583,70.181,227.25z"/>
                        <path d="M177.083,93.525c18.819,13.441,41.864,21.35,66.755,21.35V77.189c-13.894-2.958-26.194-10.215-35.442-20.309   c-15.83-9.873-27.235-26.161-30.579-45.225h-34.896v191.226c-0.079,22.293-18.18,40.344-40.502,40.344   c-13.154,0-24.84-6.267-32.241-15.975c-13.216-6.667-22.279-20.354-22.279-36.16c0-22.355,18.131-40.48,40.501-40.48   c4.286,0,8.417,0.667,12.292,1.896v-38.098c-48.039,0.992-86.674,40.224-86.674,88.474c0,24.086,9.621,45.921,25.236,61.875   c14.087,9.454,31.045,14.968,49.29,14.968c48.899,0,88.54-39.621,88.54-88.496V93.525L177.083,93.525z"/>
                        <path fill="#00F2EA" d="M243.838,77.189V66.999c-12.529,0.019-24.812-3.488-35.442-10.12   C217.806,67.176,230.197,74.276,243.838,77.189z M177.817,11.655c-0.319-1.822-0.564-3.656-0.734-5.497V0h-48.182v191.228   c-0.077,22.29-18.177,40.341-40.501,40.341c-6.554,0-12.742-1.555-18.222-4.318c7.401,9.707,19.087,15.973,32.241,15.973   c22.32,0,40.424-18.049,40.502-40.342V11.655H177.817z M100.694,114.408V103.56c-4.026-0.55-8.085-0.826-12.149-0.824   C39.642,102.735,0,142.356,0,191.228c0,30.64,15.58,57.643,39.255,73.527c-15.615-15.953-25.236-37.789-25.236-61.874   C14.019,154.632,52.653,115.4,100.694,114.408z"/>
                        <path fill="#FF004F" d="M802.126,239.659c34.989,0,63.354-28.136,63.354-62.84c0-34.703-28.365-62.844-63.354-62.844h-9.545   c34.99,0,63.355,28.14,63.355,62.844s-28.365,62.84-63.355,62.84H802.126z"/>
                        <path fill="#00F2EA" d="M791.716,113.975h-9.544c-34.988,0-63.358,28.14-63.358,62.844s28.37,62.84,63.358,62.84h9.544   c-34.993,0-63.358-28.136-63.358-62.84C728.357,142.116,756.723,113.975,791.716,113.975z"/>
                        <path d="M310.062,85.572v31.853h37.311v121.374h37.326V118.285h30.372l10.414-32.712H310.062z M615.544,85.572v31.853h37.311   v121.374h37.326V118.285h30.371l10.413-32.712H615.544z M432.434,103.648c0-9.981,8.146-18.076,18.21-18.076   c10.073,0,18.228,8.095,18.228,18.076c0,9.982-8.15,18.077-18.228,18.077C440.58,121.72,432.434,113.63,432.434,103.648z    M432.434,134.641h36.438v104.158h-36.438V134.641z M484.496,85.572v153.226h36.452v-39.594l11.283-10.339l35.577,50.793h39.05   l-51.207-74.03l45.997-44.768h-44.258l-36.442,36.153V85.572H484.496z M877.623,85.572v153.226h36.457v-39.594l11.278-10.339   l35.587,50.793H1000l-51.207-74.03l45.995-44.768h-44.256l-36.452,36.153V85.572H877.623z"/>
                        <path d="M792.578,239.659c34.988,0,63.358-28.136,63.358-62.84c0-34.703-28.37-62.844-63.358-62.844h-0.865   c-34.99,0-63.355,28.14-63.355,62.844s28.365,62.84,63.355,62.84H792.578z M761.336,176.819c0-16.881,13.8-30.555,30.817-30.555   c17.005,0,30.804,13.674,30.804,30.555s-13.799,30.563-30.804,30.563C775.136,207.379,761.336,193.7,761.336,176.819z"/>
                        </g>
                    </svg>
                    <strong>TikTok</strong>
                </a>
                <div className="tiktok-1x100u9-DivHeaderCenterContainer e1lv5j0x0">
                    <Searchinput/>
                </div>
                
                <div className="tiktok-ba55d9-DivHeaderRightContainer e13wiwn60">
                    {user==null?<>
                    <div>
                        <a href="/upload?lang=en" data-e2e="upload-icon" className="tiktok-1w1wxiy-StyledLinkText e18d3d941">Upload </a>
                    </div>
                    <button onClick={()=>showlogin()} type="button" data-e2e="top-login-button" className="e13wiwn62 tiktok-1mm63h3-Button-StyledLoginButton ehk74z00">Log in</button>
                   
                    <i data-e2e="see-more-icon" className="tiktok-74g1sb-IMoreIconWrapper e13wiwn63">
                        <svg className="tiktok-lgo5n0-StyledEllipsisVertical e13wiwn64" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 4C26.2091 4 28 5.79086 28 8C28 10.2091 26.2091 12 24 12C21.7909 12 20 10.2091 20 8C20 5.79086 21.7909 4 24 4ZM24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28C21.7909 28 20 26.2091 20 24C20 21.7909 21.7909 20 24 20ZM24 36C26.2091 36 28 37.7909 28 40C28 42.2091 26.2091 44 24 44C21.7909 44 20 42.2091 20 40C20 37.7909 21.7909 36 24 36Z"></path></svg>
                    </i></>:
                    <>
                    <div onMouseEnter={()=>setState({...state,show_upload:true})} onMouseLeave={()=>setState({...state,show_upload:false})} data-e2e="upload-icon" className="tiktok-1r4w1e7-DivUploadContainer e18d3d940">
                        <a href="/upload?lang=vi-VN">
                            <span>
                                <svg className="tiktok-rpdue5-StyledUploadIcon e18d3d943" width="1em" height="1em" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M22.1571 13.8359L21.9247 12.3786C21.4686 9.51917 18.9876 7.3335 16 7.3335C12.6863 7.3335 10 10.0197 9.99996 13.3334L10.0011 15.2304L8.11578 15.3398C6.19293 15.4513 4.66663 17.0482 4.66663 19.0002C4.66663 21.0252 6.30825 22.6668 8.33329 22.6668H15.3333V17.0813L14.1785 18.236C13.9182 18.4964 13.4961 18.4964 13.2357 18.236L12.7643 17.7646C12.504 17.5043 12.504 17.0822 12.7643 16.8218L15.862 13.7242C16.1223 13.4638 16.5444 13.4638 16.8048 13.7242L19.9024 16.8218C20.1628 17.0822 20.1628 17.5043 19.9024 17.7646L19.431 18.236C19.1706 18.4964 18.7485 18.4964 18.4882 18.236L17.3333 17.0811V22.6668H23C25.3932 22.6668 27.3333 20.7267 27.3333 18.3335C27.3333 16.151 25.7179 14.3423 23.6181 14.0437L22.1571 13.8359ZM8.33329 24.6668H15.3333H17.3333H23C26.4978 24.6668 29.3333 21.8313 29.3333 18.3335C29.3333 15.1411 26.9714 12.5005 23.8997 12.0636C23.2913 8.24881 19.9861 5.3335 16 5.3335C11.5817 5.3335 7.99996 8.91522 7.99996 13.3335L7.99996 13.3431C5.0255 13.5157 2.66663 15.9824 2.66663 19.0002C2.66663 22.1298 5.20368 24.6668 8.33329 24.6668Z"></path></svg>
                            </span>
                        </a>
                        {state.show_upload?
                        <div className="tiktok-tooltip black withPadding tiktok-tooltip-placement-bottom  tiktok-tooltip-hidden" style={{right: '-15px', top: '40px'}}>
                            <div className="tiktok-tooltip-content">
                                <div className="tiktok-tooltip-arrow"></div>
                                <div className="tiktok-tooltip-inner" role="tooltip">Upload video</div>
                            </div>
                        </div>:''}
                    </div>
                    <div onMouseEnter={()=>setState({...state,show_message:true})} onMouseLeave={()=>setState({...state,show_message:false})} data-e2e="top-dm-icon" className="tiktok-1ibfxbr-DivMessageIconContainer e1nx07zo0">
                        <a href="/messages?lang=vi-VN">
                            <span>
                                <svg className="tiktok-stut8h-StyledIcon e1nx07zo1" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M2.17877 7.17357C2.50304 6.45894 3.21528 6 4.00003 6H44C44.713 6 45.372 6.37952 45.7299 6.99615C46.0877 7.61278 46.0902 8.37327 45.7365 8.99228L25.7365 43.9923C25.3423 44.6821 24.5772 45.0732 23.7872 44.9886C22.9972 44.9041 22.3321 44.3599 22.0929 43.6023L16.219 25.0017L2.49488 9.31701C1.97811 8.72642 1.85449 7.88819 2.17877 7.17357ZM20.377 24.8856L24.531 38.0397L40.5537 10H8.40757L18.3918 21.4106L30.1002 14.2054C30.5705 13.9159 31.1865 14.0626 31.4759 14.533L32.5241 16.2363C32.8136 16.7066 32.6669 17.3226 32.1966 17.612L20.377 24.8856Z"></path></svg>
                            </span>
                        </a>
                        {state.show_message?
                        <div className="tiktok-tooltip black withPadding tiktok-tooltip-placement-bottom  tiktok-tooltip-hidden" style={{right: '-15px', top: '40px'}}>
                            <div className="tiktok-tooltip-content">
                                <div className="tiktok-tooltip-arrow"></div>
                                <div className="tiktok-tooltip-inner" role="tooltip">Message</div>
                            </div>
                        </div>:''}
                    </div>
                    
                    <div ref={notifyref} data-e2e="inbox-icon" className="tiktok-1b4xcc5-DivHeaderInboxContainer e18kkhh40">
                        <span  onMouseEnter={()=>setState({...state,show_inbox:true})} onMouseLeave={()=>setState({...state,show_inbox:false})} onClick={()=>setreadnotify()}>
                            <svg className="tiktok-1g0p6jv-StyledInboxIcon e18kkhh41" width="32" height="32" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.0362 21.3333H18.5243L15.9983 24.4208L13.4721 21.3333H7.96047L7.99557 8H24.0009L24.0362 21.3333ZM24.3705 23.3333H19.4721L17.2883 26.0026C16.6215 26.8176 15.3753 26.8176 14.7084 26.0026L12.5243 23.3333H7.62626C6.70407 23.3333 5.95717 22.5845 5.9596 21.6623L5.99646 7.66228C5.99887 6.74352 6.74435 6 7.66312 6H24.3333C25.2521 6 25.9975 6.7435 26 7.66224L26.0371 21.6622C26.0396 22.5844 25.2927 23.3333 24.3705 23.3333ZM12.6647 14C12.2965 14 11.998 14.2985 11.998 14.6667V15.3333C11.998 15.7015 12.2965 16 12.6647 16H19.3313C19.6995 16 19.998 15.7015 19.998 15.3333V14.6667C19.998 14.2985 19.6995 14 19.3313 14H12.6647Z"></path></svg>
                        </span>
                        {notify.count_notify_unseen>0 && notify.send_to==user.id?<sup className="jsx-3087598692 ">{notify.count_notify_unseen}</sup>:''}
                        <div className={`${!state.show_notification?'tiktok-1pyd9ev-DivHeaderInboxWrapper':'tiktok-1t1sirr-DivHeaderInboxWrapper'} e18kkhh49`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="rgba(255, 255, 255, 1.0)" viewBox="0 0 24 8" width="24" height="8" className="tiktok-e0rxz1-StyledArrow e18kkhh48"><path d="M0 8c7 0 10-8 12-8s5 8 12 8z"></path></svg>
                            <div data-e2e="inbox-notifications" className="tiktok-vubwh3-DivInboxContainer e32s1fi0">
                                <div className="jsx-585722981 inbox-content-header">
                                    <h4 className="jsx-585722981 inbox-content-notification">Thông báo</h4>
                                    <div data-e2e="inbox-bar" className="jsx-585722981 group-wrap">
                                        <span data-e2e="all" className="jsx-585722981 selected">Tất cả</span>
                                        <span data-e2e="likes" className="jsx-585722981">Thích</span>
                                        <span data-e2e="comments" className="jsx-585722981">Bình luận</span>
                                        <span data-e2e="mentions" className="jsx-585722981">Nhắc đến</span>
                                        <span data-e2e="followers" className="jsx-585722981">Follower</span>
                                    </div>
                                </div>
                                <div data-e2e="inbox-list" className="tiktok-o6y5r-DivInboxContentContainer e11z9zg00">
                                    {listnotify.some(item=>checkDay(item.date)=="Today")?<>
                                    <p className="tiktok-mikffl-PTimeGroupTitle e11z9zg01">Today</p>
                                    {listnotify.filter(item=>checkDay(item.date)=="Today").map(item=>
                                    <Notify
                                    item={item}
                                    />
                                    )}</>:''}
                                    {listnotify.some(item=>checkDay(item.date)!="Today")?<>
                                    <p className="tiktok-mikffl-PTimeGroupTitle e11z9zg01">This Week</p>
                                    {listnotify.filter(item=>checkDay(item.date)!="Today").map(item=>
                                    <Notify
                                    item={item}
                                    />
                                    )}</>:''}
                                </div>
                            </div>
                        </div>
                        {state.show_inbox?
                        <div className="tiktok-tooltip black withPadding tiktok-tooltip-placement-bottom  tiktok-tooltip-hidden" style={{right: '-50%', top: '40px'}}>
                            <div className="tiktok-tooltip-content">
                                <div className="tiktok-tooltip-arrow"></div>
                                <div className="tiktok-tooltip-inner" role="tooltip">Inbox</div>
                            </div>
                        </div>:''}
                            
 
                    </div>
                    <div onMouseEnter={()=>setState({...state,show_info:true})} onMouseLeave={()=>setState({...state,show_info:false})} style={{backgroundImage:`url(${user.picture})`}} data-e2e="profile-icon" className="tiktok-1igqi6u-DivProfileContainer efubjyv0">
                        {state.show_info?
                        <div className="tiktok-vwwmft-DivContainer e2ipgxl0" style={{backgroundColor: 'rgb(255, 255, 255)', right: '-12px'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 8" width="1em" height="1em" verticalPropKey="top" className="tiktok-znnspw-StyledTopArrow e2ipgxl1" style={{right: '15px'}}><path d="M0 8c7 0 10-8 12-8s5 8 12 8z"></path></svg>
                            <ul data-e2e="profile-popup" className="tiktok-1cjb6r6-UlPopupContainer exws2ct0">
                                <li data-e2e="profile-info" className="tiktok-13cl6pj-LiItemWrapper exws2ct1">
                                    <a className="tiktok-2f9ypg-StyledUserLink exws2ct3" href={`/${user.username}`}>
                                        <svg className="css-g0144v" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.0003 7C20.1343 7 17.0003 10.134 17.0003 14C17.0003 17.866 20.1343 21 24.0003 21C27.8663 21 31.0003 17.866 31.0003 14C31.0003 10.134 27.8663 7 24.0003 7ZM13.0003 14C13.0003 7.92487 17.9252 3 24.0003 3C30.0755 3 35.0003 7.92487 35.0003 14C35.0003 20.0751 30.0755 25 24.0003 25C17.9252 25 13.0003 20.0751 13.0003 14ZM24.0003 33C18.0615 33 13.0493 36.9841 11.4972 42.4262C11.3457 42.9573 10.8217 43.3088 10.2804 43.1989L8.32038 42.8011C7.77914 42.6912 7.4266 42.1618 7.5683 41.628C9.49821 34.358 16.1215 29 24.0003 29C31.8792 29 38.5025 34.358 40.4324 41.628C40.5741 42.1618 40.2215 42.6912 39.6803 42.8011L37.7203 43.1989C37.179 43.3088 36.6549 42.9573 36.5035 42.4262C34.9514 36.9841 29.9391 33 24.0003 33Z"></path></svg>
                                        <span>View profile</span>
                                    </a>
                                </li>
                                <li data-e2e="recharge-entrance" className="tiktok-13cl6pj-LiItemWrapper exws2ct1">
                                    <a href="/coin?enter_from=web_main_nav&amp;lang=en" className="tiktok-mzkvlb-StyledLinkItem exws2ct2">
                                        <svg className="css-g0144v" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M10.0002 2.49992C5.85803 2.49992 2.50016 5.85778 2.50016 9.99992C2.50016 14.1421 5.85803 17.4999 10.0002 17.4999C14.1423 17.4999 17.5002 14.1421 17.5002 9.99992C17.5002 5.85778 14.1423 2.49992 10.0002 2.49992ZM0.833496 9.99992C0.833496 4.93731 4.93755 0.833252 10.0002 0.833252C15.0628 0.833252 19.1668 4.93731 19.1668 9.99992C19.1668 15.0625 15.0628 19.1666 10.0002 19.1666C4.93755 19.1666 0.833496 15.0625 0.833496 9.99992Z"></path><path fillRule="evenodd" clipRule="evenodd" d="M12.141 4.99992C12.141 6.27424 13.2115 7.3484 14.5835 7.3484V9.01507C13.6736 9.01507 12.8267 8.72389 12.141 8.22854V11.4961C12.141 13.2238 10.7059 14.5833 8.98723 14.5833C7.26852 14.5833 5.8335 13.2238 5.8335 11.4961C5.8335 9.76845 7.26852 8.40901 8.98723 8.40901V10.0757C8.1429 10.0757 7.50016 10.7343 7.50016 11.4961C7.50016 12.2579 8.1429 12.9166 8.98723 12.9166C9.83156 12.9166 10.4743 12.2579 10.4743 11.4961V4.99992H12.141Z"></path></svg>
                                        <span>Get coins</span>
                                    </a>
                                </li>
                                <li data-e2e="settings-entrance" className="tiktok-13cl6pj-LiItemWrapper exws2ct1">
                                    <a href="/setting?lang=en" className="tiktok-mzkvlb-StyledLinkItem exws2ct2">
                                        <svg className="css-g0144v" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.375 44.2391C21.375 44.6593 21.7157 45 22.1359 45H25.8641C26.2843 45 26.625 44.6593 26.625 44.2391V41.3044C29.4979 40.8723 32.1421 39.7417 34.3792 38.0912L36.4554 40.1674C36.7525 40.4646 37.2343 40.4646 37.5314 40.1674L40.1677 37.5311C40.4648 37.234 40.4648 36.7522 40.1677 36.4551L38.0915 34.3789C39.7419 32.1418 40.8723 29.4978 41.3044 26.625H44.2391C44.6593 26.625 45 26.2843 45 25.8641V22.1359C45 21.7157 44.6593 21.375 44.2391 21.375H41.3044C40.8723 18.5021 39.7418 15.858 38.0913 13.6209L40.1673 11.5449C40.4644 11.2478 40.4644 10.766 40.1673 10.4689L37.531 7.83262C37.2339 7.53548 36.7521 7.53548 36.455 7.83262L34.379 9.90863C32.1419 8.25818 29.4978 7.1277 26.625 6.69556V3.76087C26.625 3.34065 26.2843 3 25.8641 3H22.1359C21.7156 3 21.375 3.34065 21.375 3.76087V6.69556C18.5022 7.1277 15.8582 8.25815 13.6211 9.90854L11.5452 7.83265C11.2481 7.53551 10.7664 7.53551 10.4692 7.83265L7.83294 10.4689C7.5358 10.7661 7.5358 11.2478 7.83294 11.545L9.90878 13.6208C8.25826 15.8579 7.12772 18.5021 6.69556 21.375H3.76087C3.34065 21.375 3 21.7157 3 22.1359V25.8641C3 26.2843 3.34065 26.625 3.76087 26.625H6.69556C7.1277 29.4978 8.25819 32.1419 9.90863 34.379L7.83255 36.4551C7.53541 36.7522 7.53541 37.234 7.83255 37.5311L10.4688 40.1674C10.766 40.4645 11.2477 40.4645 11.5449 40.1674L13.6209 38.0913C15.858 39.7418 18.5021 40.8723 21.375 41.3044V44.2391ZM24 38C31.732 38 38 31.732 38 24C38 16.268 31.732 10 24 10C16.268 10 10 16.268 10 24C10 31.732 16.268 38 24 38Z"></path></svg>
                                        <span>Settings</span>
                                    </a>
                                </li>
                                <li data-e2e="language-select" className="tiktok-13cl6pj-LiItemWrapper exws2ct1">
                                    <div className="tiktok-1l6pm3m-DivSettingItem exws2ct4">
                                        <svg className="css-g0144v" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11 2C7.68629 2 5 4.68629 5 8V40C5 43.3137 7.68629 46 11 46H37C40.3137 46 43 43.3137 43 40V8C43 4.68629 40.3137 2 37 2H11ZM9 8C9 6.89543 9.89543 6 11 6H37C38.1046 6 39 6.89543 39 8V40C39 41.1046 38.1046 42 37 42H11C9.89543 42 9 41.1046 9 40V8ZM26.063 14.1175C25.7306 13.4415 25.0465 13.0096 24.2933 13.0002C23.54 12.9907 22.8453 13.4054 22.4961 14.0729L15.6945 27.0746L12.4672 33.1814C12.2092 33.6697 12.3958 34.2747 12.8841 34.5328L14.6524 35.4672C15.1407 35.7253 15.7457 35.5386 16.0038 35.0503L18.6718 30.0017H29.4421L32.0324 35.0274C32.2854 35.5183 32.8885 35.7112 33.3794 35.4581L35.1572 34.5419C35.6481 34.2888 35.8409 33.6858 35.5879 33.1948L32.4477 27.1022L26.063 14.1175ZM27.4492 26.0017H20.77L24.213 19.4202L27.4492 26.0017Z"></path></svg>
                                        <span>English</span>
                                    </div>
                                </li>
                                <li data-e2e="feedback-entrance" className="tiktok-13cl6pj-LiItemWrapper exws2ct1">
                                    <a href="/feedback?lang=en" className="tiktok-mzkvlb-StyledLinkItem exws2ct2">
                                        <svg className="css-g0144v" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6ZM2 24C2 11.8497 11.8497 2 24 2C36.1503 2 46 11.8497 46 24C46 36.1503 36.1503 46 24 46C11.8497 46 2 36.1503 2 24ZM24.0909 15C22.172 15 20.3433 16.2292 19.2617 18.61C19.0332 19.1128 18.4726 19.4 17.9487 19.2253L16.0513 18.5929C15.5274 18.4182 15.2406 17.8497 15.4542 17.3405C16.9801 13.7031 20.0581 11 24.0909 11C28.459 11 32 14.541 32 18.9091C32 21.2138 30.7884 23.4606 29.2167 25.074C27.8157 26.5121 25.5807 27.702 22.9988 27.9518C22.4491 28.0049 22.0001 27.5523 22.0001 27V25C22.0001 24.4477 22.4504 24.0057 22.9955 23.9167C24.2296 23.7153 25.5034 23.1533 26.3515 22.2828C27.4389 21.1666 28 19.8679 28 18.9091C28 16.7502 26.2498 15 24.0909 15ZM24 36C22.3431 36 21 34.6569 21 33C21 31.3431 22.3431 30 24 30C25.6569 30 27 31.3431 27 33C27 34.6569 25.6569 36 24 36Z"></path></svg>
                                        <span>Feedback and help</span>
                                    </a>
                                </li>
                                <li data-e2e="keyboard-shortcut-entrance" className="tiktok-13cl6pj-LiItemWrapper exws2ct1">
                                    <div className="tiktok-1l6pm3m-DivSettingItem exws2ct4">
                                    <svg className="css-g0144v" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M6 24C6 14.0589 14.0589 6 24 6C33.9411 6 42 14.0589 42 24C42 33.9411 33.9411 42 24 42C14.0589 42 6 33.9411 6 24ZM24 2C11.8497 2 2 11.8497 2 24C2 36.1503 11.8497 46 24 46C36.1503 46 46 36.1503 46 24C46 11.8497 36.1503 2 24 2ZM15 14C14.4477 14 14 14.4477 14 15V17C14 17.5523 14.4477 18 15 18H17C17.5523 18 18 17.5523 18 17V15C18 14.4477 17.5523 14 17 14H15ZM14 31C14 30.4477 14.4477 30 15 30H33C33.5523 30 34 30.4477 34 31V33C34 33.5523 33.5523 34 33 34H15C14.4477 34 14 33.5523 14 33V31ZM15 22C14.4477 22 14 22.4477 14 23V25C14 25.5523 14.4477 26 15 26H17C17.5523 26 18 25.5523 18 25V23C18 22.4477 17.5523 22 17 22H15ZM22 15C22 14.4477 22.4477 14 23 14H25C25.5523 14 26 14.4477 26 15V17C26 17.5523 25.5523 18 25 18H23C22.4477 18 22 17.5523 22 17V15ZM23 22C22.4477 22 22 22.4477 22 23V25C22 25.5523 22.4477 26 23 26H25C25.5523 26 26 25.5523 26 25V23C26 22.4477 25.5523 22 25 22H23ZM30 15C30 14.4477 30.4477 14 31 14H33C33.5523 14 34 14.4477 34 15V17C34 17.5523 33.5523 18 33 18H31C30.4477 18 30 17.5523 30 17V15ZM31 22C30.4477 22 30 22.4477 30 23V25C30 25.5523 30.4477 26 31 26H33C33.5523 26 34 25.5523 34 25V23C34 22.4477 33.5523 22 33 22H31Z"></path></svg>
                                    <span>Keyboard shortcuts</span>
                                    </div>
                                </li>
                                <li onClick={(e)=>setlogout(e)} data-e2e="logout-entrance" className="tiktok-r1vw0e-LiItemWrapper exws2ct1">
                                    <div className="tiktok-mzkvlb-StyledLinkItem exws2ct2">
                                        <svg className="css-g0144v" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.1716 26L7 26C6.44771 26 6 25.5523 6 25L6 23C6 22.4477 6.44771 22 7 22L24.1716 22L20.2929 18.1213C19.9024 17.7308 19.9024 17.0976 20.2929 16.7071L21.7071 15.2929C22.0976 14.9024 22.7308 14.9024 23.1213 15.2929L30.4142 22.5858C31.1953 23.3668 31.1953 24.6332 30.4142 25.4142L23.1213 32.7071C22.7308 33.0976 22.0976 33.0976 21.7071 32.7071L20.2929 31.2929C19.9024 30.9024 19.9024 30.2692 20.2929 29.8787L24.1716 26ZM36 43L27 43C26.4477 43 26 42.5523 26 42L26 40C26 39.4477 26.4477 39 27 39L36 39C37.1046 39 38 38.1046 38 37L38 11C38 9.89543 37.1046 9 36 9L27 9C26.4477 9 26 8.55228 26 8L26 6C26 5.44771 26.4477 5 27 5L36 5C39.3137 5 42 7.68629 42 11L42 37C42 40.3137 39.3137 43 36 43Z"></path></svg>
                                        <span>Log out</span>
                                    </div>
                                </li>
                            </ul>
                        </div>:''}
                    </div>
                    </>}
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,notify:state.notify
});
export default connect(mapStateToProps, { logout,updatenotify })(Navbar);