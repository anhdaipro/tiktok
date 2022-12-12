import Commentbrowser from "./Commentbrowser"
import Videobrowser from "./Videobrowser"
import Comment from "./Comment"
import Addcomment from "./Addcomment"
import { number } from "../constants";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share";

import {actionvideoURL,istrecomendbrowserURL, listrecomendbrowserURL} from "../urls"
import { headers,expiry } from "../actions/auth";
import React,{useState,useEffect,useRef,useCallback} from 'react'
import axios from "axios"
import io from "socket.io-client"
import {useNavigate,Link} from "react-router-dom"
const BrowserMode=(props)=>{
    const {user,item,listcomment,setlistcomment,notify,setitem,settag,setvideochoice,
    updatenotify,setcomment,showreply,addreply,sethidenreply,tags,loading}=props
    const [state,setState]=useState({width:document.documentElement.clientWidth})
    const videoref=useRef(null)
    const [time,setTime]=useState({minutes:0,seconds:0})
    const [volume,setVolume]=useState(0.5)
    const seekbarref=useRef(null)
    const [drag,setDrag]=useState({time:false,volume:false})
    const socket=useRef()  
    const naviga=useNavigate()
    const [listrecommend,setListrecommned]=useState([])
    useEffect(() => { 
        socket.current = io.connect('https://web-production-eaad.up.railway.app/');
        socket.current.on("message",e => {
            const data=e.data
            const count_unread=data.like || data.follow ?notify.count_notify_unseen+1:notify.count_notify_unseen-1
            const count_notify_unseen=count_unread>0?count_unread:0
            const data_unread={count_notify_unseen:count_notify_unseen,send_to:data.send_to}
            updatenotify(data_unread,data.notifi_type)   
          });
          return () => {
            socket.current.disconnect();
          };
    },[notify])
    useEffect(()=>{
        window.onresize=(e)=>{
            setState({...state,width:document.documentElement.clientWidth})
        }
    })
    useEffect(()=>{
        (async ()=>{
            const res =await axios.get(listrecomendbrowserURL,headers)
         
            const listrecommneds=res.data.map(item=>{
                return({...item,seconds:Math.floor(item.duration) % 60,minutes:Math.floor(item.duration / 60) % 60})
            })
            console.log(listrecommneds)
            setListrecommned(listrecommneds)
        })()
    },[])
    useEffect(()=>{
        if(item!=null && item.muted){
        setVolume(0)
        }
    },[item])

    useEffect(()=>{
        if(loading){   
            const timer=setTimeout(()=>{
            videoref.current.volume=volume
            setTime(current=>{
                return{...current,seconds:videoref.current.currentTime % 60,minutes:Math.floor((videoref.current.currentTime) / 60) % 60}
            })
        },100)
        return ()=>clearTimeout(timer)
        }
    },[time,item,loading])

    useEffect(()=>{
        if(videoref.current!=null){
            if(item.play){
                videoref.current.play()
            }
            else{
                videoref.current.pause()
            }
        }
    },[item])

    const settimevideo=(e)=>{
        e.stopPropagation() 
        const rects = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rects.left;
        const times=(x/rects.width)*item.duration
        videoref.current.currentTime=times
    }
    
    const setVolumevideo=(e)=>{
        e.stopPropagation() 
        const rects = seekbarref.current.getBoundingClientRect();
        const y = e.clientY - rects.top;
        const value=(1-y/rects.height)>0 && (1-y/rects.height)<=1?(1-y/rects.height):(1-y/rects.height)>=1?1:0
        if((1-y/rects.height)>0){
            setvideochoice(e,item,'muted',false)
        }
        else{
            setvideochoice(e,item,'muted',false)
        }
        setVolume(value)
    }

    const setlikevideo=(e)=>{
        
        fetchdata(e)
    }

    const fetchdata=(e)=>{
        (async ()=>{
            if(localStorage.token!='null'&&expiry>0){
                let form=new FormData()
                form.append('action','like')
                try{
                    const res = await axios.post(`${actionvideoURL}/${item.id}`,form,headers)
                    setvideochoice(e,item,'like',res.data.like,'count_like',res.data.count_like)
                    const data={action:'like_video',send_by:user.id,send_to:item.user.id,id:item.id,like:res.data.like}
                    socket.current.emit("sendData",data)
                }
                catch{
                    console.log('error')
                }
            }
        })()
    }
    return(
        <div className="tiktok-2vzllv-DivMainContainer elnrzms0">
            <div className="tiktok-19j62s8-DivVideoDetailContainer ege8lhx0">
                <div class="tiktok-1tu8qcb-DivBackHead ege8lhx2">
                    <div onClick={()=>naviga('/')} class="tiktok-20o26w-DivHeadContent ege8lhx3">
                        <svg class="tiktok-1h6rn3a-StyledChevronLeftOffset ege8lhx4" width="32" height="32" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4.58579 22.5858L20.8787 6.29289C21.2692 5.90237 21.9024 5.90237 22.2929 6.29289L23.7071 7.70711C24.0976 8.09763 24.0976 8.7308 23.7071 9.12132L8.82843 24L23.7071 38.8787C24.0976 39.2692 24.0976 39.9024 23.7071 40.2929L22.2929 41.7071C21.9024 42.0976 21.2692 42.0976 20.8787 41.7071L4.58579 25.4142C3.80474 24.6332 3.80474 23.3668 4.58579 22.5858Z"></path></svg>
                        <span class="tiktok-7xdqn-SpanBackTitle ege8lhx5">Back to For You</span>
                    </div>
                </div>
                <div className="tiktok-12kupwv-DivContentContainer ege8lhx6">
                    
                    <div className="tiktok-1senhbu-DivLeftContainer ege8lhx7">
                        {item!=null?<>
                        <div class="tiktok-1sb4dwc-DivPlayerContainer eqrezik3">
                            <div onClick={(e)=>setvideochoice(e,item,'play',!item.play)} class="tiktok-1kvcswo-DivVideoContainer eqrezik6">
                                <div class="tiktok-heva70-DivBlurBackgroundWrapper eqrezik0">
                                    <div style={{backgroundImage:`url(https://p16-sign-sg.tiktokcdn.com/obj/tos-alisg-p-0037/56e36b96a2284e94b6878fdd7eef74d0?x-expires=1653580800&amp;x-signature=FU7fYbiiFSV4rBFYCtawUzSHNUc%3D)`}} class="tiktok-1nmqpes-DivBlurBackground eqrezik1"></div>
                                </div>
                                <div  class="tiktok-xq54tb-DivVideoWrapper eqrezik5">
                                    <div mode="4" class="tiktok-yf3ohr-DivContainer e1yey0rl0">
                                        <img mode="4" src={item.video_preview} alt="" loading="lazy" class="tiktok-j6dmhd-ImgPoster e1yey0rl1"/>
                                        {!item.hidden_video?
                                        <div class="tiktok-1h63bmc-DivBasicPlayerWrapper e1yey0rl2">
                                            <video src={item.video} ref={videoref} src={item.video} autoplay='' preload="auto" muted={item.muted?true:false} playsinline="" loop class="tiktok-1sm3sg-VideoBasic e1yey0rl4"></video>
                                        </div>:''}
                                    </div>
                                </div>
                                <div class="tiktok-qigcch-DivVideoControlContainer e123m2eu6">
                                    <div class="tiktok-1irdaz-DivControlButtonWrapper e123m2eu7">
                                         <div class="tiktok-q1bwae-DivPlayIconContainer e123m2eu10 item-center">
                                             {item.play?
                                            <svg width="12" height="12" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path d="M8 6C8 5.44771 8.44772 5 9 5H17C17.5523 5 18 5.44772 18 6V42C18 42.5523 17.5523 43 17 43H9C8.44772 43 8 42.5523 8 42V6Z"></path><path d="M30 6C30 5.44771 30.4477 5 31 5H39C39.5523 5 40 5.44772 40 6V42C40 42.5523 39.5523 43 39 43H31C30.4477 43 30 42.5523 30 42V6Z"></path></svg>
                                            :
                                            <svg fill="#fff" width="24" height="24" version="1.1" viewBox="0 0 36 36"><path class="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-id-303"></path></svg>  
                                            }
                                        </div>
                                        <div class="tiktok-1g3unbt-DivSeekBarTimeContainer e123m2eu1">{('0'+time.minutes).slice(-2)}:{('0'+time.seconds).slice(-2)}/{('0'+item.minutes).slice(-2)}:{('0'+item.seconds).slice(-2)}</div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" class="tiktok-1b4seza-StyledExpand e123m2eu11"><g fill="white" fillRule="evenodd" clipPath="url(#expand_svg__clip0_9489_175555)" clipRule="evenodd"><path d="M10.88 3.88a.5.5 0 01.5-.5h8.37a1 1 0 011 1v8.37a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5V5.38h-7.37a.5.5 0 01-.5-.5v-1zM13.37 20a.5.5 0 01-.5.5H4.5a1 1 0 01-1-1v-8.37a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v7.37h7.37a.5.5 0 01.5.5v1z"></path></g><defs><clipPath id="expand_svg__clip0_9489_175555"><path fill="white" d="M0 0h24v24H0z"></path></clipPath></defs></svg>
                                    <div class="tiktok-1qsif0u-DivVoiceControlContainer e123m2eu8">
                                        <div class="tiktok-1d06bgw-DivVolumeControlContainer el1e52j0">
                                            <div class="tiktok-8a33y5-DivVolumeControlProgress el1e52j1"></div>
                                            <div class="tiktok-1jpjbgu-DivVolumeControlCircle el1e52j3" style={{transform: 'translateY(-34.85px)'}}></div>
                                            <div class="tiktok-zfypl8-DivVolumeControlBar el1e52j2" style={{transform: 'scaleY(0.5125)'}}></div>
                                        </div>
                                        <div onClick={(e)=>{setvideochoice(e,item,'muted',!item.muted)
                                        setVolume(item.muted?0.5:0)
                                    }} class="tiktok-1pr675h-DivMuteIconContainer e123m2eu9">
                                            <svg width="24" height="24" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                                                {!item.muted?
                                                <path fillRule="evenodd" clipRule="evenodd" d="M20.3359 8.37236C22.3296 7.04325 25 8.47242 25 10.8685V37.1315C25 39.5276 22.3296 40.9567 20.3359 39.6276L10.3944 33H6C4.34314 33 3 31.6568 3 30V18C3 16.3431 4.34315 15 6 15H10.3944L20.3359 8.37236ZM21 12.737L12.1094 18.6641C11.7809 18.8831 11.3948 19 11 19H7V29H11C11.3948 29 11.7809 29.1169 12.1094 29.3359L21 35.263V12.737ZM32.9998 24C32.9998 21.5583 32.0293 19.3445 30.4479 17.7211C30.0625 17.3255 29.9964 16.6989 30.3472 16.2724L31.6177 14.7277C31.9685 14.3011 32.6017 14.2371 33.0001 14.6195C35.4628 16.9832 36.9998 20.3128 36.9998 24C36.9998 27.6872 35.4628 31.0168 33.0001 33.3805C32.6017 33.7629 31.9685 33.6989 31.6177 33.2724L30.3472 31.7277C29.9964 31.3011 30.0625 30.6745 30.4479 30.2789C32.0293 28.6556 32.9998 26.4418 32.9998 24ZM37.0144 11.05C36.6563 11.4705 36.7094 12.0995 37.1069 12.4829C40.1263 15.3951 42.0002 19.4778 42.0002 23.9999C42.0002 28.522 40.1263 32.6047 37.1069 35.5169C36.7094 35.9003 36.6563 36.5293 37.0144 36.9498L38.3109 38.4727C38.6689 38.8932 39.302 38.9456 39.7041 38.5671C43.5774 34.9219 46.0002 29.7429 46.0002 23.9999C46.0002 18.2569 43.5774 13.078 39.7041 9.43271C39.302 9.05421 38.6689 9.10664 38.3109 9.52716L37.0144 11.05Z"></path>
                                                :
                                                <path fillRule="evenodd" clipRule="evenodd" d="M25 10.8685C25 8.47242 22.3296 7.04325 20.3359 8.37236L10.3944 15H6C4.34315 15 3 16.3431 3 18V30C3 31.6568 4.34314 33 6 33H10.3944L20.3359 39.6276C22.3296 40.9567 25 39.5276 25 37.1315V10.8685ZM29.2929 18.1213L35.1716 24L29.2929 29.8787C28.9024 30.2692 28.9024 30.9024 29.2929 31.2929L30.7071 32.7071C31.0976 33.0976 31.7308 33.0976 32.1213 32.7071L38 26.8284L43.8787 32.7071C44.2692 33.0976 44.9024 33.0976 45.2929 32.7071L46.7071 31.2929C47.0976 30.9024 47.0976 30.2692 46.7071 29.8787L40.8284 24L46.7071 18.1213C47.0976 17.7308 47.0976 17.0976 46.7071 16.7071L45.2929 15.2929C44.9024 14.9024 44.2692 14.9024 43.8787 15.2929L38 21.1716L32.1213 15.2929C31.7308 14.9024 31.0976 14.9024 30.7071 15.2929L29.2929 16.7071C28.9024 17.0976 28.9024 17.7308 29.2929 18.1213Z"></path>
                                                }
                                            </svg>
                                        </div>
                                    </div>
                                    {!item.play?<svg class="tiktok-i8t918-SvgPlayIcon e1oyh2e10" fill="#fff" width="120" height="120" version="1.1" viewBox="0 0 36 36"><path class="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-id-303"></path></svg>:''}
                                    <div onClick={(e)=>settimevideo(e)}
                                        onMouseUp={e=>setDrag({...drag,time:false})}
                                        onMouseDown={e=>setDrag({...drag,time:true})}
                                        onMouseMove={e=>{
                                        e.preventDefault()
                                        if(!drag.time){
                                            return
                                        }
                                        settimevideo(e)
                                        }}    class="tiktok-65ogze-DivSeekBarContainer e123m2eu0">
                                        <div class="tiktok-14kubmr-DivSeekBarProgress e123m2eu2"></div>
                                        <div style={{left: `calc(${(time.minutes*60+time.seconds)/item.duration*100}%)`}} class="tiktok-1n0974s-DivSeekBarCircleWrapper e123m2eu4">
                                            <div class="tiktok-1okt9xk-DivSeekBarCircle e123m2eu5"></div>
                                        </div>
                                        <div style={{width: `${(time.minutes*60+time.seconds)/item.duration*100}%`}} class="tiktok-1is0vli-DivSeekBar e123m2eu3"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="tiktok-r4nwrj-DivVideoInfoContainer eqrezik2">
                                <div data-e2e="browse-video-desc" class="tiktok-5dmltr-DivContainer e1h0bjw60">
                                    {JSON.parse(item.caption).map(cap=>{
                                        if(cap.type=='tag' || cap.type=='hashtag'){
                                            return(
                                                <Link className="tiktok-q3q1i1-StyledCommonLink e18aywvs4" to={`/${cap.type=='hashtag'?`tag/${cap.text}`:`${item.tags.find(user=>cap.text.includes(user.name)).username}`}`}>
                                                    <strong className="tiktok-f9vo34-StrongText e18aywvs1">{cap.type=='hashtag'?`#${cap.text}`:cap.text}</strong>
                                                </Link>
                                            )
                                        }
                                        else{
                                            return(
                                                <span className="tiktok-j2a19r-SpanText e7nizj40">{cap.text}</span>
                                            )
                                        }
                                    }
                                    )}
                                </div>
                                <h4 data-e2e="browse-music" class="tiktok-19xrqft-H4Link e11ku0eu0">
                                    <a href="/music/Thương-Em-6920984187893828358">
                                        <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="tiktok-wzk98w-SvgIcon e11ku0eu1"><use xlinkHref="#svg-music-note"></use></svg>
                                        Thương Em - CHILL
                                    </a>
                                </h4>
                            </div>
                            <div class="tiktok-ln2tr4-DivActionItemContainer ean6quk0">
                                <button type="button" class="tiktok-1xylq9u-ButtonActionItem edu4zum0">
                                    <span onClick={(e)=>setlikevideo(e)} data-e2e="like-icon" class="tiktok-xfxewx-SpanIconWrapper edu4zum1">
                                        <div>
                                        <svg color={!item.like?'#262626':'#ed4956'} fill={!item.like?'#262626':'#ed4956'} height="24" role="img" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                                        </div>
                                    </span>
                                    <strong data-e2e="like-count" class="tiktok-1yviec0-StrongText edu4zum2">{number(item.count_like)}</strong>
                                </button>
                                <button type="button" class="tiktok-1xylq9u-ButtonActionItem edu4zum0">
                                    <span data-e2e="comment-icon" class="tiktok-xfxewx-SpanIconWrapper edu4zum1"><svg width="24" height="24" viewBox="0 0 20 20" fill="#161823" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#BubbleEllipsisRightFill_clip0)"><g opacity="1" filter="url(#BubbleEllipsisRightFill_filter0_d)"><path fillRule="evenodd" clipRule="evenodd" d="M16.0393 14.7137C17.75 13 18.75 11.215 18.75 9.13662C18.75 4.91897 14.8887 1.49997 10.125 1.49997C5.36129 1.49997 1.5 4.91897 1.5 9.13675C1.5 13.3545 5.48622 16.25 10.25 16.25V17.6487C10.25 18.0919 10.7095 18.3771 11.0992 18.1659C12.3166 17.5062 14.5725 16.183 16.0393 14.7137ZM5.93527 8.10679C6.61608 8.10679 7.16797 8.65471 7.16797 9.32962C7.16797 10.0059 6.61608 10.5538 5.93527 10.5538C5.2556 10.5538 4.70368 10.0059 4.70368 9.32962C4.70368 8.65471 5.2556 8.10679 5.93527 8.10679ZM11.3572 9.32962C11.3572 8.65471 10.8055 8.10679 10.125 8.10679C9.44459 8.10679 8.89289 8.65471 8.89289 9.32962C8.89292 10.0059 9.44462 10.5538 10.125 10.5538C10.8055 10.5538 11.3572 10.0059 11.3572 9.32962ZM14.3146 8.10679C14.9953 8.10679 15.5464 8.65471 15.5464 9.32962C15.5464 10.0059 14.9953 10.5538 14.3146 10.5538C13.6339 10.5538 13.082 10.0059 13.0821 9.32962C13.0821 8.65471 13.6339 8.10679 14.3146 8.10679Z"></path></g><path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M10.25 16.2499C10.25 16.2499 15.0278 15.8807 17.025 13.3234C15.0278 16.1364 13.0307 17.6708 11.2831 18.1822C9.53561 18.6937 10.25 16.2499 10.25 16.2499Z" fill="url(#BubbleEllipsisRightFill_paint0_linear)"></path></g><defs><filter id="BubbleEllipsisRightFill_filter0_d" x="0.5" y="1.49997" width="19.25" height="18.737" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="1"></feOffset><feGaussianBlur stdDeviation="0.5"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><linearGradient id="BubbleEllipsisRightFill_paint0_linear" x1="8.50426" y1="15.6957" x2="9.29499" y2="18.1805" gradientUnits="userSpaceOnUse"><stop></stop><stop offset="1" stopOpacity="0.01"></stop></linearGradient><clipPath id="BubbleEllipsisRightFill_clip0"><rect width="20" height="20" fill="white"></rect></clipPath></defs></svg>
                                    </span>
                                    <strong data-e2e="comment-count" class="tiktok-1yviec0-StrongText edu4zum2">{number(item.count_comment)}</strong>
                                </button>
                                <button type="button" class="tiktok-1xylq9u-ButtonActionItem edu4zum0">
                                    <span data-e2e="share-icon" class="tiktok-xfxewx-SpanIconWrapper edu4zum1">
                                        <svg width="24" height="24" viewBox="0 0 20 20" fill="#161823" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#PCShare_clip0)"><g opacity="1" filter="url(#PCShare_filter0_d)"><path fillRule="evenodd" clipRule="evenodd" d="M10.9376 3.17495C10.9376 2.58272 11.6469 2.27873 12.0758 2.68715L18.6021 8.90241C19.1764 9.44937 19.1564 10.3717 18.5588 10.8931L12.0541 16.5689C11.6184 16.9491 10.9376 16.6397 10.9376 16.0614V13.4894C10.9376 13.4894 3.95344 12.2312 1.7131 16.3434C1.50423 16.7268 0.690072 16.8609 0.855563 14.948C1.54761 11.4273 2.96196 5.93084 10.9376 5.93084V3.17495Z"></path></g><path opacity="0.03" fillRule="evenodd" clipRule="evenodd" d="M15.7538 6.21161L17.0486 8.80136C17.2777 9.25947 17.1677 9.81453 16.7812 10.1506L10.9824 15.193C10.9824 15.193 10.7017 16.5964 11.5437 16.5964C12.3857 16.5964 19.1218 10.4217 19.1218 10.4217C19.1218 10.4217 19.4025 9.57964 18.5605 8.73763C17.7185 7.89563 15.7538 6.21161 15.7538 6.21161Z"></path><path opacity="0.09" fillRule="evenodd" clipRule="evenodd" d="M10.9374 6.22983V13.5272C10.9374 13.5272 4.25359 12.5854 2.16026 15.7726C0.146021 18.8394 0.331011 12.3091 3.36331 9.05711C6.39561 5.8051 10.9374 6.22983 10.9374 6.22983Z" fill="url(#PCShare_paint0_radial)"></path></g><defs><filter id="PCShare_filter0_d" x="-0.166473" y="2.5" width="20.1867" height="16.2363" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="1"></feOffset><feGaussianBlur stdDeviation="0.5"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><radialGradient id="PCShare_paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.1827 18.2553) rotate(-113.046) scale(8.93256 8.78076)"><stop></stop><stop offset="0.995496" stopOpacity="0.01"></stop><stop offset="1" stopOpacity="0.01"></stop></radialGradient><clipPath id="PCShare_clip0"><rect width="20" height="20" fill="white"></rect></clipPath></defs></svg>
                                    </span>
                                    <strong data-e2e="share-count" class="tiktok-1yviec0-StrongText edu4zum2">{number(item.count_share)>0?number(item.count_share):'Share'}</strong>
                                </button>
                                <button type="button" style={{position: 'absolute',top: '4px',transform: 'rotate(-90deg)',opacity: 0.9,right: '0px'}} class="tiktok-1pqxj4k-ButtonActionItem edu4zum0">
                                    <span data-e2e="more-entrance-icon" class="tiktok-13fauys-SpanIconWrapper edu4zum1">
                                        <svg width="32" height="32" viewBox="0 0 48 48" fill="#161823" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4 24C4 21.7909 5.79086 20 8 20C10.2091 20 12 21.7909 12 24C12 26.2091 10.2091 28 8 28C5.79086 28 4 26.2091 4 24ZM20 24C20 21.7909 21.7909 20 24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28C21.7909 28 20 26.2091 20 24ZM36 24C36 21.7909 37.7909 20 40 20C42.2091 20 44 21.7909 44 24C44 26.2091 42.2091 28 40 28C37.7909 28 36 26.2091 36 24Z"></path></svg>
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div class="tiktok-1q63yfb-DivAuthorContainer ege8lhx8">
                            <div class="tiktok-3axsrf-DivInfoContainer e17fzhrb0">
                                <Link data-e2e="browse-user-avatar" class="tiktok-19x2iw0 e17fzhrb5" to={`${item.user.username}`}>
                                    <div class="tiktok-uha12h-DivContainer e1vl87hj1" style={{width:'40px',height:'40px'}}>
                                    <span shape="circle" style={{width:'40px',height:'40px'}} class="e1vl87hj2 tiktok-gigx3u-SpanAvatarContainer-StyledAvatar e1e9er4e0">
                                        <img loading="lazy" src="https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/8f440eca43229ff38ac47ecf480ec4bd.jpeg?x-expires=1653732000&amp;x-signature=b%2BnQwc5ci4001bT5OTg%2FP0CD%2Bhk%3D" class="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                                    </span>
                                    </div>
                                </Link>
                                <Link class="tiktok-1b6v967-StyledLink e17fzhrb3" to={`${item.user.username}`}>
                                    <span data-e2e="browse-username" class="tiktok-1r8gltq-SpanUniqueId e17fzhrb1">13tyu68ubjv</span>
                                        <br/>
                                    <span data-e2e="browser-nickname" class="tiktok-lh6ok5-SpanOtherInfos e17fzhrb2">
                                        Jiro<span style={{margin:'0 4px'}}> · </span>
                                        <span>2021-2-15</span>
                                    </span>
                                </Link>
                                <div data-e2e="video-setting" class="tiktok-1dcgmzm-DivActionContainer e1g3z12v0">
                                    <svg class="tiktok-1xafdg4-StyledEllipsisHorizontal e1g3z12v1" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4 24C4 21.7909 5.79086 20 8 20C10.2091 20 12 21.7909 12 24C12 26.2091 10.2091 28 8 28C5.79086 28 4 26.2091 4 24ZM20 24C20 21.7909 21.7909 20 24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28C21.7909 28 20 26.2091 20 24ZM36 24C36 21.7909 37.7909 20 40 20C42.2091 20 44 21.7909 44 24C44 26.2091 42.2091 28 40 28C37.7909 28 36 26.2091 36 24Z"></path></svg>
                                </div>
                            </div>
                        </div></>:''}
                        {state.width<=771 && listrecommend.length>0?
                        <div className="tiktok-1qcpd73-DivListContainer e1t22qao0">
                            {listrecommend.map(video=>
                            <Videobrowser
                            item={video}
                            />
                            )}
                            <div>
                                <button type="button" class="e1t22qao11 tiktok-1i8og22-Button-StyledMoreBtn ehk74z00">More videos</button>
                            </div>
                        </div>:''}
                        {item!=null?
                        <div className="tiktok-x4xlc7-DivCommentContainer e1a7v7ak0">
                            <p class="tiktok-1gseipw-PCommentTitle e1a7v7ak1">{number(item.count_comment)} comment{item.count_comment>1?'s':''}</p>
                            <div class="tiktok-1bg47i4-DivCommentBarContainer e1a7v7ak2">
                                <span shape="circle" style={{width:'40px',height:'40px'}} class="tiktok-tuohvl-SpanAvatarContainer e1e9er4e0">
                                    <img loading="lazy" src="https://p16-sign-sg.tiktokcdn.com/aweme/720x720/tos-alisg-avt-0068/8f440eca43229ff38ac47ecf480ec4bd.jpeg?x-expires=1653732000&amp;x-signature=UD1uykH%2BaO%2Bzr5z7q5U56YzP%2BAc%3D" class="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                                </span>
                                <div class="tiktok-cr515f-DivCommentInputWrapper e1a7v7ak4">
                                    <Addcomment
                                        item={item}
                                        parent={null}
                                        user={user}
                                        setitem={value=>setitem(value)}
                                        notify={notify}
                                        updatenotify={(data,notifi_type)=>updatenotify(data,notifi_type)}
                                        listcomment={listcomment}
                                        setlistcomment={(data)=>setlistcomment(data)}
                                    />
                                </div>
                            </div>
                            <div className="tiktok-1ko6l9n-DivCommentListContainer eru5d900">
                                {listcomment.filter(item=>item.parent==null).map(parent=>
                                <div key={parent.id} class="tiktok-16r0vzi-DivCommentItemContainer e192jtdb0">
                                    <Comment 
                                        user={user}
                                        setlistcomment={data=>setlistcomment(data)}
                                        comment={parent}
                                        notify={notify}
                                        listcomment={listcomment}
                                        updatenotify={(data,notifi_type)=>updatenotify(data,notifi_type)}
                                        setcomment={(e,parent,name,value,name_choice,value_choice)=>setcomment(e,parent,name,value,name_choice,value_choice)}
                                        tags={tags}
                                        settag={(e,commentchoice)=>settag(e,commentchoice)}
                                    />
                                    {parent.count_reply>0 || parent.requestreply?
                                    <div class="tiktok-zn6r1p-DivReplyContainer e192jtdb1">
                                        {parent.hidden_reply && parent.count_reply>0?
                                        <div onClick={(e)=>showreply(e,parent)} class="tiktok-1for4nf-DivReplyActionContainer e192jtdb2">
                                            <p data-e2e="view-more-1" class="tiktok-1oxhn3k-PReplyActionText e192jtdb4">View more replies ({parent.count_reply})
                                                <svg class="tiktok-1w2nwdz-StyledChevronDownFill e192jtdb3" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.8788 33.1213L7.58586 18.8284C7.19534 18.4379 7.19534 17.8047 7.58586 17.4142L10.4143 14.5858C10.8048 14.1953 11.438 14.1953 11.8285 14.5858L24.0001 26.7574L36.1716 14.5858C36.5622 14.1953 37.1953 14.1953 37.5859 14.5858L40.4143 17.4142C40.8048 17.8047 40.8048 18.4379 40.4143 18.8284L26.1214 33.1213C24.9498 34.2929 23.0503 34.2929 21.8788 33.1213Z"></path></svg>
                                            </p>
                                        </div>:
                                        <>
                                        {listcomment.filter(item=>item.parent==parent.id).map(children=>
                                            <Comment 
                                            comment={children}
                                            user={user}
                                            notify={notify}
                                            listcomment={listcomment}
                                            updatenotify={(data,notifi_type)=>updatenotify(data,notifi_type)}
                                            setlistcomment={data=>setlistcomment(data)}
                                            setcomment={(e,children,name,value,name_choice,value_choice)=>setcomment(e,children,name,value,name_choice,value_choice)}
                                            tags={tags}
                                            settag={(e,commentchoice)=>settag(e,commentchoice)}
                                            />
                                        )}
                                        {listcomment.filter(item=>item.parent==parent.id).length==parent.count_reply?'':
                                        <div class="tiktok-1gc1iuy-DivReplyActionContainer e192jtdb2">
                                            <p onClick={(e)=>addreply(e,parent,listcomment)} data-e2e="view-more-2" class="tiktok-1oxhn3k-PReplyActionText e192jtdb4">View more
                                                <svg class="tiktok-1w2nwdz-StyledChevronDownFill e192jtdb3" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.8788 33.1213L7.58586 18.8284C7.19534 18.4379 7.19534 17.8047 7.58586 17.4142L10.4143 14.5858C10.8048 14.1953 11.438 14.1953 11.8285 14.5858L24.0001 26.7574L36.1716 14.5858C36.5622 14.1953 37.1953 14.1953 37.5859 14.5858L40.4143 17.4142C40.8048 17.8047 40.8048 18.4379 40.4143 18.8284L26.1214 33.1213C24.9498 34.2929 23.0503 34.2929 21.8788 33.1213Z"></path></svg>
                                            </p>
                                            <p onClick={e=>sethidenreply(e,parent)} data-e2e="comment-hide" class="tiktok-1oxhn3k-PReplyActionText e192jtdb4">Hide
                                                <svg class="tiktok-4iqu2x-StyledChevronDownFill e192jtdb3" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.8788 33.1213L7.58586 18.8284C7.19534 18.4379 7.19534 17.8047 7.58586 17.4142L10.4143 14.5858C10.8048 14.1953 11.438 14.1953 11.8285 14.5858L24.0001 26.7574L36.1716 14.5858C36.5622 14.1953 37.1953 14.1953 37.5859 14.5858L40.4143 17.4142C40.8048 17.8047 40.8048 18.4379 40.4143 18.8284L26.1214 33.1213C24.9498 34.2929 23.0503 34.2929 21.8788 33.1213Z"></path></svg>
                                            </p>
                                        </div>}
                                                                    
                                        </>}
                                        {user.id!==parent.user.id? 
                                            <div className="tiktok-1xjmtjf-DivBottomCommentContainer e13y27ie4">                            
                                                <Addcomment
                                                    item={item}
                                                    parent={parent}
                                                    setitem={(value)=>setitem(value)}
                                                    user={user}
                                                    notify={notify}
                                                    updatenotify={(data,notifi_type)=>updatenotify(data,notifi_type)}
                                                    listcomment={listcomment}
                                                    setlistcomment={(data)=>setlistcomment(data)}
                                                />
                                            </div>
                                        :''}
                                    </div>:''}
                                </div>
                                )}
                            </div>
                        </div>:''}
                    </div>
                    {state.width>771 && listrecommend.length>0?
                    <div className="tiktok-1czmy9n-DivVideoList ege8lhx9">
                        <p class="tiktok-y79q0i-PVideoListTitle ege8lhx10">Recommended videos</p>
                        <div className="tiktok-mv13qo-DivListContainer e1t22qao0">
                            {listrecommend.map(video=>
                                <Videobrowser
                                item={video}
                                />
                            )}
                        </div>
                    </div>:''}
                </div>
            </div>
        </div>
    )
}
export default BrowserMode