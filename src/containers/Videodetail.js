import React,{useState,useEffect,useRef,useCallback} from 'react'
import axios from "axios"
import { headers,expiry,updatenotify } from "../actions/auth";
import { listuploadvideoURL,actioncommentURL,listfollowingURL,followinguserURL, actionvideoURL, listcommentreplyURL, commentreplyURL } from "../urls";
import { checkDay, number,timeago } from "../constants";
import {debounce} from 'lodash';
import Sinabar from "./Accountsugested";
import "../css/comment.css"
import "../css/browsermode.css"
import Navbar from "./Navbar"
import {listcommentURL,videodetailURL} from "../urls"
import {useNavigate,useParams,useSearchParams} from "react-router-dom"
import {connect} from 'react-redux'
import Reportvideo from "./Reportvideo"
import Comment from "./Comment"
import BrowserMode from "./BrowserMode"
import Addcomment from "./Addcomment"
import io from "socket.io-client"
import Player from './Player';
const Showcomment=({user,updatenotify,notify,isAuthenticated})=>{
    
    const [loading,setLoading]=useState(false)
    const [tags,setTags]=useState(null)
    const [parent,setParent]=useState(null)
    const [state,setState]=useState({error:false,view:false,totalTime:0})
    const [item,setItem]=useState(null)
    const [listcomment,setListcomment]=useState([])
    const [params, setSearchParams] = useSearchParams();
    const {id}=useParams()
    const socket=useRef()  
    useEffect(() => { 
        socket.current = io.connect('https://servertiktok-production.up.railway.app/');
        socket.current.on("message",({data}) => {
            const count_unread=data.like || data.follow ?notify.count_notify_unseen+1:notify.count_notify_unseen-1
            const count_notify_unseen=count_unread>0?count_unread:0
            const data_unread={count_notify_unseen:count_notify_unseen,send_to:data.send_to}
            updatenotify(data_unread,data.notifi_type)   
          });
          return () => {
            socket.current.disconnect();
          };
    },[notify])

    const setlikevideo=(e)=>{
        fetchdata(e)
    }

    const fetchdata=(e)=>{
        (async ()=>{
            if(localStorage.token&&expiry()>0){
                let form=new FormData()
                form.append('action','like')
                try{
                    const res = await axios.post(`${actionvideoURL}/${item.id}`,form,headers())
                    setvideochoice(e,item,'like',res.data.like,'count_like',res.data.count_like)
                    let data={action:'like_video',send_by:user.id,send_to:item.user.id,id:item.id,like:res.data.like}
                   
                    socket.current.emit("sendData",data)
                }
                catch{
                    console.log('error')
                }
            }
        })()
    }
    useEffect(()=>{
        (async ()=>{
            try{
                if(!localStorage.token){
                    window.location.href="/"
                }
                else{
                    if(user){
                    const [obj1, obj2] = await axios.all([
                        axios.get(`${videodetailURL}/${id}?${params}`,headers()),
                        axios.get(`${listcommentURL}/${id}?${params}`,headers()),
                    ])
                    const videodetail={...obj1.data,show_info:false,show_comment:false,show_share:false,show_video:false,seconds:Math.floor(obj1.data.duration) % 60,minutes:Math.floor(obj1.data.duration / 60) % 60}
                    setItem(videodetail)
                    const list_comment=obj2.data.map(item=>{
                        return({...item,hidden_reply:true,show_info:false,show_report:false,request_report:false,suscess_report:false})
                    })
                    setLoading(true)
                    setListcomment(list_comment) 
                }
            }
            }
            catch{
                console.log('error')
            }
        })()
    },[id,user])

   
    const setfollow= async (e)=>{
        let form=new FormData()
        form.append('id',item.user.id)
        try{
            const res = await axios.post(followinguserURL,form,headers())
            setItem({...item,following:res.data.follow,count_follow:res.data.follow})
            const data={action:'like_video',send_by:user.id,send_to:item.user.id,id:item.id,follow:res.data.follow}
            socket.current.emit("sendData",data)
        }
        catch(e){
            console.log(e)
        }
    }

    const setvideochoice=(e,item,name,value,name_choice,value_choice)=>{
        e.stopPropagation()
        const videodetail=name_choice!=undefined?{...item,[name]:value,[name_choice]:value_choice}:{...item,[name]:value}
        setItem(videodetail)
    }

    
    const setshowinfo=(e,value)=>{
        
        setItem({...item,show_info:value})
    }
    

    const settag=(e,value)=>{
        setTags(value)
    }
    
    const setlistcomment=useCallback((data)=>{
        setListcomment(data)
    },[])
    const setcomment=(e,commentchoice,name,value,name_choice,value_choice)=>{
        const comments=listcomment.map(item=>{
            if(item.id==commentchoice.id){
                if(name_choice!=undefined){
                    return ({...item,[name]:value,[name_choice]:value_choice})
                }
                return ({...item,[name]:value})
            }
            return ({...item})
        })
        setListcomment(comments)
    }

    const sethidenreply=(e,parent)=>{
        e.stopPropagation() 
        setcomment(e,parent,'hidden_reply',true)
    }
    const showreply=(e,parent)=>{
        e.stopPropagation() 
        const list_comment=listcomment.map(item=>{
            if(item.id==parent.id){
                return({...item,hidden_reply:false})
            }
            return({...item})
        })
        addreply(e,parent,list_comment)
    }
    const addreply= async (e,parent,list_comment)=>{
        try{
            const length=listcomment.filter(item=>item.parent==parent.id).length
            if(parent.count_reply>length){
                const res = await axios.get(`${listcommentreplyURL}/${item.id}?parent_id=${parent.id}&from_item=${length}`,headers())
                const  list_comments=[...list_comment,...res.data]
                if(res.data)
                  
                    setlistcomment(list_comments)
                    
                }
            }
        catch(e){
            console.log(e)
        }
    }

    const commentreport=listcomment.find(comment=>comment.show_report)
    const setitem=(value)=>{
        setItem(value)
    }
    const coppylink=()=>{
        navigator.clipboard.writeText(window.location);
        alert('Copied')
    }
   
    return(
        <>
        <div id="main">
            <Navbar
            user={user}
            />
            <div class="tiktok-19fglm-DivBodyContainer eg65pf90">
                <Sinabar
                user={user}
                />
                {params.get('browsermode')!=null?
                <BrowserMode
                    item={item}
                    user={user}
                    loading={loading}
                    setitem={(value)=>setitem(value)}
                    setlistcomment={data=>setlistcomment(data)}
                    comment={parent}
                    notify={notify}
                    listcomment={listcomment}
                    setvideochoice={(e,item,name,value,name_choice,value_choice)=>setvideochoice(e,item,name,value,name_choice,value_choice)}
                    updatenotify={(data,notifi_type)=>updatenotify(data,notifi_type)}
                    setcomment={(e,parent,name,value,name_choice,value_choice)=>setcomment(e,parent,name,value,name_choice,value_choice)}
                    tags={tags}
                    settag={(e,commentchoice)=>settag(e,commentchoice)}
                />
                :
                <div class="tiktok-7t2h2f-DivBrowserModeContainer e1oyh2e0">
                    {item!=null?<>
                    <Player
                        item={item}
                        setvideochoice={(e,item,name,value,name_choice,value_choice)=>setvideochoice(e,item,name,value,name_choice,value_choice)}
                    />
                    
                    <div class="tiktok-3q30id-DivContentContainer e13y27ie0">
                        <div  class="tiktok-7l7okx-DivInfoContainer ec62sd0">
                            <div></div>
                            <a onMouseEnter={(e)=>setshowinfo(e,true)} onMouseLeave={(e)=>setshowinfo(e,false)} data-e2e="browse-user-avatar" class="tiktok-3izs7l ec62sd5" href={`/${item.user.username}`}>
                                <div  class="tiktok-uha12h-DivContainer e1vl87hj1" style={{width: '40px', height: '40px'}}>
                                    <span shape="circle" class="e1vl87hj2 tiktok-gigx3u-SpanAvatarContainer-StyledAvatar e1e9er4e0" style={{width: '40px', height: '40px'}}>
                                        <img loading="lazy" src={item.user.picture} class="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                                    </span>
                                </div>
                            </a>
                            <a onMouseEnter={(e)=>setshowinfo(e,true)} onMouseLeave={(e)=>setshowinfo(e,false)} class="tiktok-bcidt6-StyledLink ec62sd3" href={`/${item.user.username}`}>
                                <span data-e2e="browse-username" class="tiktok-12ahmhf-SpanUniqueId ec62sd1">{item.user.username}
                                    <svg class="tiktok-shsbhf-StyledVerifyBadge e1aglo370" width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="#20D5EC"></circle><path fillRule="evenodd" clipRule="evenodd" d="M37.1213 15.8787C38.2929 17.0503 38.2929 18.9497 37.1213 20.1213L23.6213 33.6213C22.4497 34.7929 20.5503 34.7929 19.3787 33.6213L10.8787 25.1213C9.70711 23.9497 9.70711 22.0503 10.8787 20.8787C12.0503 19.7071 13.9497 19.7071 15.1213 20.8787L21.5 27.2574L32.8787 15.8787C34.0503 14.7071 35.9497 14.7071 37.1213 15.8787Z" fill="white"></path></svg>
                                </span>
                                <br/>
                                <span data-e2e="browser-nickname" class="tiktok-1ky3a5b-SpanOtherInfos ec62sd2">{item.user.name}
                                    <span style={{margin: '0px 4px'}}> · </span>
                                    <span>{timeago(item.posted)} ago</span>
                                </span>
                            </a>
                            
                            <button onClick={(e)=>setfollow(e)} type="button" data-e2e="browse-follow" class={`ec62sd6 ${!item.following?'tiktok-5xuix8-Button-StyledFollowButton':'tiktok-co112j-Button-StyledFollowButton'} ehk74z00`}>{!item.following?'Follow':'Following'}</button>
                            {item.show_info?
                            <div onMouseEnter={(e)=>setshowinfo(e,true)} onMouseLeave={(e)=>setshowinfo(e,false)} class="tiktok-xhmvja-DivProfileOuterContainer er095111" style={{top: '60px', left: '32px'}}>
                                <div class="tiktok-g4dx3b-DivPaddingTop er095110"></div>
                                <div class="tiktok-vnenbs-DivProfileContainer er095112">
                                    <div class="tiktok-1tu3lcg-DivHeadContainer er095113">
                                        <a target="_blank" rel="noopener" data-e2e="user-card-avatar" class="tiktok-h0b8t7-StyledAvatarLink er095116" href={`/${item.user.username}?lang=en`}>
                                            <span shape="circle" class="tiktok-tuohvl-SpanAvatarContainer e1e9er4e0" style={{width: '44px', height: '44px'}}>
                                                <img loading="lazy" src={item.user.picture} class="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                                            </span>
                                        </a>
                                        <button type="button" data-e2e="user-card-follow" class="tiktok-230my5-Button ehk74z00">Follow</button>
                                    </div>
                                    <a target="_blank" rel="noopener" class="tiktok-gk82i-StyledUserTitle er095114" href={`/${item.user.username}?lang=en`}>
                                        <span data-e2e="user-card-username">{item.user.username}</span>
                                    </a><br/>
                                    <a target="_blank" rel="noopener" data-e2e="user-card-nickname" class="tiktok-px0n0u-StyledUserName er095115" href={`/${item.user.username}?lang=en`}>𝑫𝒖𝒚 𝑻𝒉𝒂́𝒊 👑</a>
                                    <p class="tiktok-1gj7x9t-PUserStat er095117">
                                        <span data-e2e="user-card-follower-count" class="tiktok-ceyvsn-SpanUserStatsText er095118">340.7K</span>
                                        <span data-e2e="user-card-follower" class="tiktok-1n85168-SpanUserStatsDesc er095119">Followers</span>
                                        <span data-e2e="user-card-like-count" class="tiktok-ceyvsn-SpanUserStatsText er095118">12.6M</span>
                                        <span data-e2e="user-card-like" class="tiktok-1n85168-SpanUserStatsDesc er095119">Likes</span>
                                    </p>
                                    <p data-e2e="user-card-user-bio" class="tiktok-1ch7xpw-PSignature er0951110">💌 CONTACT FOR WORK 💌
                                        Insta: {item.user.username}
                                        FB: Duy Thái
                                    </p>
                                </div>
                            </div>:''}
                        
                        </div>
                        <div class="tiktok-1h8ubbu-DivMainContent e13y27ie1">
                            <div data-e2e="browse-video-desc" class="tiktok-5dmltr-DivContainer e18aywvs0">
                                {JSON.parse(item.caption).map(cap=>{
                                    if(cap.type=='tag' || cap.type=='hashtag'){
                                        return(
                                            <a className="tiktok-q3q1i1-StyledCommonLink e18aywvs4" href={`/${cap.type=='hashtag'?`tag/${cap.text}`:`${item.tags.find(user=>cap.text.includes(user.name)).username}`}`}>
                                                <strong className="tiktok-f9vo34-StrongText e18aywvs1">{cap.type=='hashtag'?`#${cap.text}`:cap.text}</strong>
                                            </a>
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
                            <h4 data-e2e="browse-music" class="tiktok-1qzn2cb-H4Link eofn35l0">
                                <a href="/music/Nhạc-Chế-Chuyện-Thi-Cử-7095356063516101403">
                                    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="tiktok-wzk98w-SvgIcon eofn35l1"><use xlinkHref="#svg-music-note"></use></svg>
                                    Nhạc Chế Chuyện Thi Cử - {item.user.name}
                                </a>
                            </h4>
                            <div class="tiktok-iwpir3-DivContainer e1i8l1790">
                                <div class="tiktok-ccy4er-DivFlexCenterRow-StyledWrapper e1i8l1792">
                                    <div class="tiktok-1d39a26-DivFlexCenterRow e1i8l1791">
                                        <button type="button" class="tiktok-zhw1g9-ButtonActionItem ee8s79f0">
                                            <span onClick={(e)=>setlikevideo(e)} data-e2e="browse-like-icon" class="tiktok-fc8cgc-SpanIconWrapper ee8s79f1">
                                                <svg color={!item.like?'#262626':'#ed4956'} fill={!item.like?'#262626':'#ed4956'} height="24" role="img" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                                            </span>
                                            {item.count_like>0?<strong data-e2e="like-count" className="tiktok-1y2yo26-StrongText ee8s79f2">{number(item.count_like)}</strong>:''}
                                        </button>
                                        <button type="button" disabled="" class="tiktok-zhw1g9-ButtonActionItem ee8s79f0">
                                            <span data-e2e="browse-comment-icon" class="tiktok-fc8cgc-SpanIconWrapper ee8s79f1">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#BubbleEllipsisRightFill_clip0)"><g opacity="1" filter="url(#BubbleEllipsisRightFill_filter0_d)"><path fillRule="evenodd" clipRule="evenodd" d="M16.0393 14.7137C17.75 13 18.75 11.215 18.75 9.13662C18.75 4.91897 14.8887 1.49997 10.125 1.49997C5.36129 1.49997 1.5 4.91897 1.5 9.13675C1.5 13.3545 5.48622 16.25 10.25 16.25V17.6487C10.25 18.0919 10.7095 18.3771 11.0992 18.1659C12.3166 17.5062 14.5725 16.183 16.0393 14.7137ZM5.93527 8.10679C6.61608 8.10679 7.16797 8.65471 7.16797 9.32962C7.16797 10.0059 6.61608 10.5538 5.93527 10.5538C5.2556 10.5538 4.70368 10.0059 4.70368 9.32962C4.70368 8.65471 5.2556 8.10679 5.93527 8.10679ZM11.3572 9.32962C11.3572 8.65471 10.8055 8.10679 10.125 8.10679C9.44459 8.10679 8.89289 8.65471 8.89289 9.32962C8.89292 10.0059 9.44462 10.5538 10.125 10.5538C10.8055 10.5538 11.3572 10.0059 11.3572 9.32962ZM14.3146 8.10679C14.9953 8.10679 15.5464 8.65471 15.5464 9.32962C15.5464 10.0059 14.9953 10.5538 14.3146 10.5538C13.6339 10.5538 13.082 10.0059 13.0821 9.32962C13.0821 8.65471 13.6339 8.10679 14.3146 8.10679Z"></path></g><path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M10.25 16.2499C10.25 16.2499 15.0278 15.8807 17.025 13.3234C15.0278 16.1364 13.0307 17.6708 11.2831 18.1822C9.53561 18.6937 10.25 16.2499 10.25 16.2499Z" fill="url(#BubbleEllipsisRightFill_paint0_linear)"></path></g><defs><filter id="BubbleEllipsisRightFill_filter0_d" x="0.5" y="1.49997" width="19.25" height="18.737" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="1"></feOffset><feGaussianBlur stdDeviation="0.5"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><linearGradient id="BubbleEllipsisRightFill_paint0_linear" x1="8.50426" y1="15.6957" x2="9.29499" y2="18.1805" gradientUnits="userSpaceOnUse"><stop></stop><stop offset="1" stopOpacity="0.01"></stop></linearGradient><clipPath id="BubbleEllipsisRightFill_clip0"><rect width="20" height="20" fill="white"></rect></clipPath></defs></svg>
                                            </span>
                                            {item.count_comment>0?<strong data-e2e="comment-count" className="tiktok-1y2yo26-StrongText ee8s79f2">{number(item.count_comment)}</strong>:""}
                                        </button>
                                    </div>
                                    <div data-e2e="browse-share-group" class="tiktok-1d39a26-DivFlexCenterRow e1i8l1791">
                                        <a mode="0" href="#" data-e2e="video-share-embed" class="tiktok-ti40bm-AShareLink e14n7zw10">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#161823" fill-opacity="0.75"></path><path fillRule="evenodd" clipRule="evenodd" d="M12.313 7.96568C12.3665 7.65966 12.658 7.45498 12.964 7.50851C13.27 7.56203 13.4747 7.8535 13.4211 8.15951L12.0506 15.9952C11.997 16.3012 11.7056 16.5059 11.3996 16.4523C11.0936 16.3988 10.8889 16.1073 10.9424 15.8013L12.313 7.96568ZM16.2402 8.77448C15.96 8.48453 15.5058 8.48453 15.2256 8.77448C14.9454 9.06443 14.9454 9.53454 15.2256 9.82449L17.454 12.1307L15.2262 14.4364C14.946 14.7263 14.946 15.1964 15.2262 15.4864C15.5063 15.7763 15.9606 15.7763 16.2407 15.4864L19.4551 12.1598C19.4704 12.1439 19.4704 12.1182 19.4551 12.1023L19.2233 11.8623L19.2201 11.8586L19.2158 11.854L16.2402 8.77448ZM8.88972 15.4867C8.59977 15.7766 8.12966 15.7766 7.83971 15.4867L5.4207 13.0677L4.76017 12.4071L4.51191 12.1589C4.49603 12.143 4.49603 12.1173 4.51191 12.1014L7.83853 8.77477C8.12848 8.48482 8.59859 8.48482 8.88854 8.77477C9.17849 9.06472 9.17849 9.53482 8.88854 9.82478L6.58318 12.1301L8.88972 14.4367C9.17967 14.7266 9.17967 15.1967 8.88972 15.4867Z" fill="white"></path></svg>
                                        </a>
                                        <a mode="0" href="#" data-e2e="video-share-message" class="tiktok-ti40bm-AShareLink e14n7zw10">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#FE2C55"></path><path fillRule="evenodd" clipRule="evenodd" d="M18.7913 7.1875C18.6796 6.99413 18.4733 6.875 18.25 6.875H5.75001C5.50258 6.875 5.27845 7.02097 5.17839 7.24727C5.07834 7.47356 5.1212 7.73758 5.28771 7.9206L8.55021 11.5065C8.72305 11.6965 8.9945 11.7614 9.23456 11.6702L13.7656 9.94799C13.8184 9.92795 13.8423 9.93624 13.8527 9.94039C13.871 9.94765 13.8971 9.96649 13.9177 10.0013C13.9382 10.0361 13.9421 10.0681 13.9396 10.0876C13.9382 10.0987 13.9339 10.1237 13.8909 10.1602L10.1707 13.3155C9.97902 13.4782 9.90339 13.7398 9.97878 13.9796L11.4038 18.5124C11.4781 18.749 11.6853 18.9192 11.9317 18.9463C12.1781 18.9734 12.4173 18.8522 12.5413 18.6375L18.7913 7.81251C18.9029 7.61913 18.9029 7.38088 18.7913 7.1875Z" fill="white"></path></svg>
                                        </a>
                                        <a mode="0" href="https://www.facebook.com/sharer/sharer.php?app_id=113869198637480&amp;display=popup&amp;sdk=joey&amp;u=https%3A%2F%2Fwww.tiktok.com%2F%40thaybeou40%2Fvideo%2F7095356024646798619%3Fis_from_webapp%3D1%26sender_device%3Dpc%26web_id%3D7064813692630386177" target="_blank" rel="noopener noreferrer" data-e2e="video-share-facebook" class="tiktok-ti40bm-AShareLink e14n7zw10">
                                            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 47C36.7025 47 47 36.7025 47 24C47 11.2975 36.7025 1 24 1C11.2975 1 1 11.2975 1 24C1 36.7025 11.2975 47 24 47Z" fill="white"></path><path d="M24 1C11.2964 1 1 11.2964 1 24C1 35.4775 9.40298 44.9804 20.3846 46.7205L20.3936 30.6629H14.5151V24.009H20.3936C20.3936 24.009 20.3665 20.2223 20.3936 18.5363C20.4206 16.8503 20.7542 15.2274 21.6288 13.7487C22.9722 11.4586 25.0639 10.3407 27.6335 10.0251C29.7432 9.76362 31.826 10.0521 33.9087 10.3407C34.0529 10.3587 34.125 10.3767 34.2693 10.4038C34.2693 10.4038 34.2783 10.6472 34.2693 10.8005C34.2603 12.4053 34.2693 16.0839 34.2693 16.0839C33.2685 16.0659 31.6096 15.9667 30.5096 16.138C28.6884 16.4175 27.6425 17.5806 27.6064 19.4108C27.5704 20.8354 27.5884 24.009 27.5884 24.009H33.9988L32.962 30.6629H27.5974V46.7205C38.597 44.9984 47.009 35.4775 47.009 24C47 11.2964 36.7036 1 24 1Z" fill="#0075FA"></path></svg>
                                        </a>
                                        <a mode="0" href="https://wa.me/?text=https%3A%2F%2Fwww.tiktok.com%2F%40thaybeou40%2Fvideo%2F7095356024646798619%3Fis_from_webapp%3D1%26sender_device%3Dpc%26web_id%3D7064813692630386177" target="_blank" rel="noopener noreferrer" data-e2e="video-share-whatsapp" class="tiktok-ti40bm-AShareLink e14n7zw10">
                                            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 47C36.7025 47 47 36.7025 47 24C47 11.2975 36.7025 1 24 1C11.2975 1 1 11.2975 1 24C1 36.7025 11.2975 47 24 47Z" fill="#25D366"></path><path fillRule="evenodd" clipRule="evenodd" d="M30.9028 25.6129C30.5802 25.4515 28.9944 24.6713 28.6988 24.5635C28.4031 24.4559 28.1881 24.4021 27.9731 24.7249C27.758 25.0478 27.1399 25.7744 26.9517 25.9897C26.7636 26.2049 26.5754 26.2319 26.2529 26.0704C25.9303 25.909 24.891 25.5684 23.659 24.4694C22.7002 23.6141 22.0528 22.5579 21.8647 22.235C21.6765 21.9121 21.8446 21.7375 22.0061 21.5767C22.1512 21.4321 22.3287 21.2 22.4899 21.0116C22.6512 20.8233 22.705 20.6887 22.8125 20.4735C22.92 20.2582 22.8663 20.0699 22.7855 19.9085C22.7049 19.747 22.0599 18.1593 21.7911 17.5134C21.5293 16.8845 21.2634 16.9697 21.0654 16.9598C20.8774 16.9504 20.6622 16.9484 20.4472 16.9484C20.2322 16.9484 19.8827 17.0291 19.587 17.352C19.2914 17.6749 18.4581 18.4553 18.4581 20.0428C18.4581 21.6306 19.6139 23.1643 19.7752 23.3795C19.9365 23.5949 22.0496 26.8528 25.2853 28.2499C26.0548 28.5823 26.6557 28.7807 27.1241 28.9293C27.8968 29.1749 28.5999 29.1402 29.1557 29.0572C29.7754 28.9646 31.064 28.277 31.3328 27.5235C31.6016 26.7699 31.6016 26.1242 31.521 25.9897C31.4404 25.8551 31.2253 25.7744 30.9028 25.6129ZM25.0178 33.6472H25.0134C23.0881 33.6465 21.1998 33.1292 19.5524 32.1517L19.1606 31.9191L15.0998 32.9844L16.1837 29.0251L15.9286 28.6191C14.8546 26.9109 14.2873 24.9365 14.2881 22.9091C14.2905 16.9934 19.1037 12.1805 25.022 12.1805C27.8879 12.1815 30.5817 13.299 32.6076 15.3271C34.6333 17.3551 35.7482 20.0509 35.7471 22.9178C35.7447 28.8339 30.9315 33.6472 25.0178 33.6472ZM34.1489 13.7858C31.7117 11.3458 28.4706 10.0014 25.0173 10C17.902 10 12.111 15.7906 12.1082 22.908C12.1073 25.1832 12.7017 27.4039 13.8313 29.3617L12 36.0509L18.8432 34.2559C20.7287 35.2843 22.8516 35.8264 25.0121 35.827H25.0174H25.0174C32.132 35.827 37.9234 30.0359 37.9263 22.9184C37.9276 19.4691 36.5861 16.2258 34.1489 13.7858Z" fill="white"></path></svg>
                                        </a>
                                        <a mode="0" href="https://twitter.com/intent/tweet?refer_source=https%3A%2F%2Fwww.tiktok.com%2F%40thaybeou40%2Fvideo%2F7095356024646798619%3Fis_from_webapp%3D1%26sender_device%3Dpc%26web_id%3D7064813692630386177&amp;text=https%3A%2F%2Fwww.tiktok.com%2F%40thaybeou40%2Fvideo%2F7095356024646798619%3Fis_from_webapp%3D1%26sender_device%3Dpc%26web_id%3D7064813692630386177" target="_blank" rel="noopener noreferrer" data-e2e="video-share-twitter" class="tiktok-ti40bm-AShareLink e14n7zw10">
                                            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.0002 47.001C36.7028 47.001 47.0002 36.7035 47.0002 24.001C47.0002 11.2984 36.7028 1.00098 24.0002 1.00098C11.2977 1.00098 1.00024 11.2984 1.00024 24.001C1.00024 36.7035 11.2977 47.001 24.0002 47.001Z" fill="#1DA1F2"></path><path fillRule="evenodd" clipRule="evenodd" d="M38.2029 13.5327C37.3894 14.0824 35.5215 14.8813 34.6003 14.8813V14.8829C33.5484 13.7237 32.0675 13 30.4252 13C27.2353 13 24.6488 15.7287 24.6488 19.0925C24.6488 19.5598 24.7001 20.0157 24.795 20.4529H24.794C20.4671 20.3331 15.7348 18.0452 12.886 14.1294C11.1344 17.3277 12.6501 20.8848 14.6378 22.1809C13.9574 22.235 12.7049 22.0982 12.1153 21.4913C12.0758 23.6142 13.0434 26.4269 16.5714 27.4473C15.8919 27.8329 14.6892 27.7223 14.1662 27.6402C14.3497 29.4322 16.7285 31.775 19.3297 31.775C18.4026 32.9063 14.9144 34.9582 11 34.3054C13.6584 36.0118 16.7568 37 20.0362 37C29.3556 37 36.5929 29.0322 36.2034 19.2027C36.2019 19.1919 36.2019 19.1811 36.2009 19.1693C36.2019 19.144 36.2034 19.1187 36.2034 19.0925C36.2034 19.0619 36.2009 19.0331 36.2 19.0035C37.0484 18.3914 38.1868 17.3087 39 15.8836C38.5284 16.1577 37.1134 16.7064 35.7968 16.8426C36.6418 16.3615 37.8937 14.7858 38.2029 13.5327Z" fill="white"></path></svg>
                                        </a>
                                        <button class="tiktok-1xq5mk6-ButtonShare e1i8l1797">
                                            <svg width="16" height="16" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M26.4588 3.90871C25.3403 2.86068 23.4902 3.64074 23.4902 5.16041V13.0502C20.4499 14.1752 11.3194 18.1407 6.6047 26.6176C-1.49677 42.1311 3.82522 43.478 5.77105 39.7411C13.2467 29.1857 20.8146 30.4298 23.4902 31.3209V38.2274C23.4902 39.7114 25.2658 40.5055 26.4023 39.5298L43.3681 24.9655C44.9268 23.6274 44.9791 21.2608 43.4811 19.8573L26.4588 3.90871Z"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="tiktok-vryw7w-DivCopyLinkContainer e1i8l1793">
                                <p data-e2e="browse-video-link" class="tiktok-q3e59-PCopyLinkText e1i8l1794">{window.location.href}</p>
                                <button onClick={()=>coppylink()} data-e2e="browse-copy" class="tiktok-iyi993-ButtonCopyLink e1i8l1796">Sao chép liên kết</button>
                            </div>
                            
                        </div>
                        <div class="tiktok-46wese-DivCommentListContainer e1y4uan10">
                            {listcomment.filter(item=>item.parent==null).map(parent=>
                            <div key={parent.id} class="tiktok-16r0vzi-DivCommentItemContainer e192jtdb0">
                                <Comment 
                                    user={user}
                                    key={parent.id}
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
                                        key={children.id}
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
                        <div className="tiktok-1xjmtjf-DivBottomCommentContainer e13y27ie4">
                            <Addcomment
                            item={item}
                            setitem={(value)=>setitem(value)}
                            parent={null}
                            user={user}
                            notify={notify}
                            tags={tags}
                            updatenotify={(data,notifi_type)=>updatenotify(data,notifi_type)}
                            listcomment={listcomment}
                            setlistcomment={(data)=>setlistcomment(data)}
                            />
                        </div>
                    </div>
                    </>:''}
                </div>}
            </div>
        </div>
        <div id="modal">
            {item!=null && item.show_report || commentreport!=undefined?
            <div className="tiktok-py8jux-DivModalContainer e1gjoq3k0">
                <div class="tiktok-1fs75a4-DivModalMask e1gjoq3k1"></div> 
                <Reportvideo
                    video={item.show_report?item:commentreport}
                    type={item.show_report?'video':'comment'}
                    setcomment={(e,commentreport,name,value,name_choice,value_choice)=>setcomment(e,commentreport,name,value,name_choice,value_choice)}
                    setvideochoice={(e,item,name,value,name_choice,value_choice)=>setvideochoice(e,item,name,value,name_choice,value_choice)}
                />
                
            </div>:''}
        </div>
        </>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,notify:state.notify
});
export default connect(mapStateToProps,{updatenotify})(Showcomment);
