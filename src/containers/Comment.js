import React,{useState,useEffect,useRef,useCallback} from 'react'
import axios from "axios"
import { headers,expiry,updatenotify } from "../actions/auth";
import { actioncommentURL,followinguserURL, actionvideoURL, listcommentreplyURL, commentreplyURL } from "../urls";
import { number,timeago } from "../constants";
import {debounce} from 'lodash';
import "../css/comment.css"
import io from "socket.io-client"
import {Link} from "react-router-dom"
import {connect} from 'react-redux'
const Comment=({comment,setcomment,settag,user,setlistcomment,listcomment,updatenotify,notify})=>{  
    const socket=useRef()  
    useEffect(() => { 
        socket.current = io.connect('https://tiktokserver-r51s.onrender.com/');
        socket.current.on('message',(e)=>{
            const data = (e.data)
            const data_unread={count_notify_unseen:data.like||data.follow?notify.count_notify_unseen+1:notify.count_notify_unseen}
            updatenotify(data_unread,data.notifi_type)  
        })
        return ()=>socket.current.disconnect()
    },[comment])

    const replycomment=(e,commentchoice)=>{
        setcomment(e,commentchoice,'requestreply',true)
        settag(e,commentchoice.user.name)
    }

    const deletecomment=(e,commentchoice)=>{
        const list_comment=listcomment.filter(item=>item.id!=commentchoice.id)
        setlistcomment(list_comment)
        let form=new FormData()
        form.append('action','delete')
        axios.post(`${actioncommentURL}/${commentchoice.id}`,form,headers())
        .then({

        })
    }
    const showreport=(e,commentchoice)=>{
        setcomment(e,commentchoice,'show_report',true)
    }
    const setlikecomment=(e,commentchoice)=>{
        fetchdatalike(commentchoice)
    }

    
    const fetchdatalike=(commentchoice)=>{
        let form=new FormData()
        form.append('like',true)
        axios.post(`${actioncommentURL}/${commentchoice.id}`,form,headers())
        .then( res=>{
            const list_comments=listcomment.map(item=>{
                if(item.id==commentchoice.id){
                    return({...item,like:res.data.like,count_like:res.data.count_like})
                }
                return({...item})
            })
            setlistcomment(list_comments)
            let data={send_by:user.id,send_to:commentchoice.user.id,action:'like_comment',like:res.data.like}
            socket.current.emit("sendData",data)
        })
    }

    const setfollowuser=(e,commentchoice)=>{
        (async ()=>{
            let form=new FormData()
            form.append('id',commentchoice.user.id)
            try{
                const res = await axios.post(followinguserURL,form,headers())
                const list_comment=listcomment.map(item=>{
                    if(item.user.username==commentchoice.user.username){
                        return({...item,following:res.data.follow})
                    }
                    return({...item})
                })
                setlistcomment(list_comment)
                let data={send_by:user.id,send_to:commentchoice.user.id,action:'like_comment',follow:res.data.follow}
                socket.current.emit("sendData",data)
            }
            catch{
                console.log('error')
            }
        })()
    }

    return(
        <div key={comment.id} id="7096317992808170241" className="tiktok-qgh4f0-DivCommentContentContainer ejs0ekz0">
            <Link onMouseEnter={(e)=>setcomment(e,comment,'show_info',true)} onMouseLeave={(e)=>setcomment(e,comment,'show_info',false)} data-e2e="comment-avatar-2" className="tiktok-1kx3d05-StyledUserLinkAvatar ejs0ekz5" to={`/${comment.user.username}?lang=en`} style={{flex: '0 0 24px'}}>
                <span shape="circle" className="tiktok-tuohvl-SpanAvatarContainer e1e9er4e0" style={{width: '40px', height: '40px'}}>
                    <img loading="lazy" src={comment.user.picture} className="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                </span>
            </Link>
            <div  className="tiktok-1mf23fd-DivContentContainer ejs0ekz1">
                <Link onMouseEnter={(e)=>setcomment(e,comment,'show_info',true)} onMouseLeave={(e)=>setcomment(e,comment,'show_info',false)} className="tiktok-1n2c527-StyledUserLinkName ejs0ekz4" to={`/${comment.user.username}?lang=en`}>
                    <span data-e2e="comment-username-2" className="tiktok-ku14zo-SpanUserNameText ejs0ekz3">{comment.user.username}</span>
                </Link>
                <p data-e2e="comment-level-2" className="tiktok-q9aj5z-PCommentText ejs0ekz6">
                    {JSON.parse(comment.body).map(cap=>{
                        if(cap.type=='tag'){
                            return(
                                <Link class="tiktok-1ukssyi-StyledUserLinkContent egb0wes10" to={`/${comment.tags.find(user=>cap.text.includes(user.name)).username}`}>@{cap.text}</Link>
                                )
                            }
                            else{
                                return(
                                    <span>{cap.text}</span>
                                )
                            }
                        }
                    )}
                </p>
                <p className="tiktok-iq73u3-PCommentSubContent ejs0ekz8">
                    <span data-e2e="comment-time-2">{timeago(comment.date)} ago</span>
                    {comment.user.id!=user.id?<span onClick={(e)=>replycomment(e,comment)} data-e2e="comment-reply-2" className="tiktok-1eoro18-SpanReplyButton ejs0ekz9">Reply</span>:''}
                </p>
            </div>
            <div className="tiktok-mnluvt-DivActionContainer e1vq2jmc0">
                <div className="tiktok-5g6iif-DivMoreContainer e1vq2jmc1">
                    <div onMouseLeave={(e)=>setcomment(e,comment,'show_action',false)} onMouseEnter={(e)=>setcomment(e,comment,'show_action',true)} data-e2e="comment-more-icon">
                        <svg className="tiktok-fzlfzu-StyledMoreIcon e1vq2jmc2" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4 24C4 21.7909 5.79086 20 8 20C10.2091 20 12 21.7909 12 24C12 26.2091 10.2091 28 8 28C5.79086 28 4 26.2091 4 24ZM20 24C20 21.7909 21.7909 20 24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28C21.7909 28 20 26.2091 20 24ZM36 24C36 21.7909 37.7909 20 40 20C42.2091 20 44 21.7909 44 24C44 26.2091 42.2091 28 40 28C37.7909 28 36 26.2091 36 24Z"></path></svg>
                    </div>
                    {comment.show_action?
                    <div  onMouseLeave={(e)=>setcomment(e,comment,'show_action',false)} onMouseEnter={(e)=>setcomment(e,comment,'show_action',true)} className="tiktok-vwwmft-DivContainer e2ipgxl0" style={{ƠbackgroundColor: 'rgb(255, 255, 255)', right: '-6px'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 8" width="1em" height="1em" verticalPropKey="top" className="tiktok-znnspw-StyledTopArrow e2ipgxl1" style={{right: '6px'}}><path d="M0 8c7 0 10-8 12-8s5 8 12 8z"></path></svg>
                        <div className="tiktok-1yuq4e0-DivPopupContainer e1vq2jmc3">
                            {user.id!=comment.user.id?
                            <p onClick={(e)=>showreport(e,comment)} data-e2e="comment-report" className="tiktok-1dhx835-PActionItem e1vq2jmc4">
                                <svg width="24" height="24" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9 9.31286V27.0626C9.98685 26.7378 11.184 26.4042 12.5108 26.1585C16.1115 25.4917 21.0181 25.4123 25.1625 28.3726C28.0181 30.4123 31.6115 30.4917 34.7608 29.9085C36.306 29.6223 37.6602 29.1908 38.6289 28.8293C38.7603 28.7803 38.8841 28.7328 39 28.6872V10.9374C38.0131 11.2623 36.816 11.5959 35.4892 11.8416C31.8885 12.5084 26.9819 12.5878 22.8375 9.62751C19.9819 7.58781 16.3885 7.5084 13.2392 8.09161C11.694 8.37776 10.3398 8.80927 9.37105 9.17072C9.23971 9.21973 9.11586 9.2673 9 9.31286ZM40.1067 6.21064C40.7264 5.90123 41.4622 5.93453 42.0515 6.29874C42.6411 6.66315 43 7.30688 43 8.00004V30C43 30.7576 42.572 31.4501 41.8944 31.7889L41 30C41.8944 31.7889 41.8931 31.7895 41.8931 31.7895L41.8916 31.7903L41.8878 31.7922L41.8775 31.7973L41.846 31.8127C41.831 31.82 41.8128 31.8288 41.7915 31.839C41.7761 31.8464 41.7589 31.8545 41.7401 31.8634C41.651 31.9055 41.525 31.9637 41.3654 32.0343C41.0466 32.1753 40.5919 32.3663 40.0273 32.577C38.9023 32.9967 37.319 33.5027 35.4892 33.8416C31.8885 34.5084 26.9819 34.5878 22.8375 31.6275C19.9819 29.5878 16.3885 29.5084 13.2392 30.0916C11.694 30.3778 10.3398 30.8093 9.37105 31.1707C9.23971 31.2197 9.11586 31.2673 9 31.3129V44.0001C9 44.5524 8.55228 45.0001 8 45.0001H6C5.44772 45.0001 5 44.5524 5 44.0001V8.00004C5 7.24249 5.42801 6.54996 6.10558 6.21118L7 8.00004C6.10558 6.21118 6.10688 6.21053 6.10688 6.21053L6.10842 6.20976L6.11219 6.20789L6.12249 6.20279L6.15404 6.18734C6.17988 6.17477 6.21529 6.15773 6.25987 6.13667C6.34902 6.09457 6.47498 6.03636 6.63455 5.9658C6.95342 5.8248 7.4081 5.63378 7.9727 5.42311C9.09774 5.00332 10.681 4.49734 12.5108 4.15849C16.1115 3.49171 21.0181 3.4123 25.1625 6.37257C28.0181 8.41227 31.6115 8.49167 34.7608 7.90846C36.306 7.62231 37.6602 7.1908 38.6289 6.82935C39.1112 6.6494 39.4925 6.48886 39.7478 6.37595C39.8754 6.31956 39.9711 6.27523 40.0318 6.24653C40.0622 6.23219 40.0838 6.22177 40.0962 6.21572L40.1056 6.21118L40.1067 6.21064Z"></path></svg>
                                <span className="tiktok-ipxjgc-SpanActionText e1vq2jmc5">Report</span>
                            </p>:''}
                            {user.username==comment.user.username?
                            <p onClick={(e)=>deletecomment(e,comment)} data-e2e="comment-delete" className="tiktok-1dhx835-PActionItem e1vq2jmc4">
                                <svg width="24" height="24" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M19.5 7.50006V9.50006H28.5V7.50006H19.5ZM32.5 9.50006V6.00006C32.5 4.61935 31.3807 3.50006 30 3.50006H18C16.6193 3.50006 15.5 4.61935 15.5 6.00006V9.50006H7C6.44772 9.50006 6 9.94778 6 10.5001V12.5001C6 13.0523 6.44772 13.5001 7 13.5001H9.5V39.5001C9.5 41.7092 11.2909 43.5001 13.5 43.5001H34.5C36.7091 43.5001 38.5 41.7092 38.5 39.5001V13.5001H41C41.5523 13.5001 42 13.0523 42 12.5001V10.5001C42 9.94778 41.5523 9.50006 41 9.50006H32.5ZM34.5 13.5001H13.5V39.5001H34.5V13.5001ZM18.5 34.0001C17.9477 34.0001 17.5 33.5523 17.5 33.0001V20.0001C17.5 19.4478 17.9477 19.0001 18.5 19.0001H20.5C21.0523 19.0001 21.5 19.4478 21.5 20.0001V33.0001C21.5 33.5523 21.0523 34.0001 20.5 34.0001H18.5ZM27.5 34.0001C26.9477 34.0001 26.5 33.5523 26.5 33.0001V20.0001C26.5 19.4478 26.9477 19.0001 27.5 19.0001H29.5C30.0523 19.0001 30.5 19.4478 30.5 20.0001V33.0001C30.5 33.5523 30.0523 34.0001 29.5 34.0001H27.5Z"></path></svg>
                                <span className="tiktok-ipxjgc-SpanActionText e1vq2jmc5">Delete</span>
                            </p>:''}
                        </div>
                    </div>
                    :''}
                </div>
                <div className="tiktok-t4fbi8-DivLikeWrapper e1kno6bo0">
                    <div onClick={(e)=>setlikecomment(e,comment)} data-e2e="comment-like-icon">
                        {!comment.like?
                        <svg width="20" height="20" viewBox="0 0 48 48" fill='currentColor' xmlns="http://www.w3.org/2000/svg">    
                            <path fillRule="evenodd" clipRule="evenodd" d="M24 9.01703C19.0025 3.74266 11.4674 3.736 6.67302 8.56049C1.77566 13.4886 1.77566 21.4735 6.67302 26.4016L22.5814 42.4098C22.9568 42.7876 23.4674 43 24 43C24.5326 43 25.0432 42.7876 25.4186 42.4098L41.327 26.4016C46.2243 21.4735 46.2243 13.4886 41.327 8.56049C36.5326 3.736 28.9975 3.74266 24 9.01703ZM21.4938 12.2118C17.9849 8.07195 12.7825 8.08727 9.51028 11.3801C6.16324 14.7481 6.16324 20.214 9.51028 23.582L24 38.1627L38.4897 23.582C41.8368 20.214 41.8368 14.7481 38.4897 11.3801C35.2175 8.08727 30.0151 8.07195 26.5062 12.2118L26.455 12.2722L25.4186 13.3151C25.0432 13.6929 24.5326 13.9053 24 13.9053C23.4674 13.9053 22.9568 13.6929 22.5814 13.3151L21.545 12.2722L21.4938 12.2118Z"></path>
                            
                        </svg>:
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(254, 44, 85, 1.0)" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#HeartFill_clip0)"><g filter="url(#HeartFill_filter0_d)"><path fillRule="evenodd" clipRule="evenodd" d="M7.5 2.25C10.5 2.25 12 4.25 12 4.25C12 4.25 13.5 2.25 16.5 2.25C20 2.25 22.5 4.99999 22.5 8.5C22.5 12.5 19.2311 16.0657 16.25 18.75C14.4095 20.4072 13 21.5 12 21.5C11 21.5 9.55051 20.3989 7.75 18.75C4.81949 16.0662 1.5 12.5 1.5 8.5C1.5 4.99999 4 2.25 7.5 2.25Z"></path></g><path fillRule="evenodd" clipRule="evenodd" d="M2.40179 12.1998C3.58902 14.6966 5.7592 16.9269 7.74989 18.75C9.5504 20.3989 10.9999 21.5 11.9999 21.5C12.9999 21.5 14.4094 20.4072 16.2499 18.75C19.231 16.0657 22.4999 12.5 22.4999 8.49997C22.4999 8.41258 22.4983 8.32566 22.4952 8.23923C20.5671 13.6619 13.6787 18.5 11.75 18.5C10.3127 18.5 5.61087 15.8131 2.40179 12.1998Z" fill-opacity="0.03"></path></g><defs><filter id="HeartFill_filter0_d" x="-0.9" y="1.05" width="25.8" height="24.05" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="1.2"></feOffset><feGaussianBlur stdDeviation="1.2"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><clipPath id="HeartFill_clip0"><rect width="24" height="24" fill="white"></rect></clipPath></defs></svg>}
                        
                    </div>
                    <span data-e2e="comment-like-count" className="tiktok-1k32hld-SpanCount e1kno6bo2">{comment.count_like}</span>
                </div>
            </div>
            {comment.show_info?
            <div onMouseEnter={(e)=>setcomment(e,comment,'show_info',true)} onMouseLeave={(e)=>setcomment(e,comment,'show_info',false)} style={{top: '30px'}} className="tiktok-xhmvja-DivProfileOuterContainer er095111">
                <div className="tiktok-g4dx3b-DivPaddingTop er095110"></div>
                <div className="tiktok-vnenbs-DivProfileContainer er095112">
                    <div className="tiktok-1tu3lcg-DivHeadContainer er095113">
                        <Link target="_blank" rel="noopener" data-e2e="user-card-avatar" className="tiktok-h0b8t7-StyledAvatarLink er095116" to={`/${comment.user.username}?lang=en`}>
                            <span shape="circle" className="tiktok-tuohvl-SpanAvatarContainer e1e9er4e0" style={{width: '44px', height: '44px'}}>
                                <img loading="lazy" src={comment.user.picture} className="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                            </span>
                        </Link>
                        <button onClick={(e)=>setfollowuser(e,comment)} type="button" data-e2e="user-card-follow" className={`${!comment.following?'tiktok-230my5-Button':'tiktok-co112j-Button-StyledFollowButton'} ehk74z00`}>{comment.following?'Following':'Follow'}</button>
                    </div>
                    <Link target="_blank" rel="noopener" className="tiktok-gk82i-StyledUserTitle er095114" to={`/${comment.user.username}?lang=en`}>
                        <span data-e2e="user-card-username">{comment.user.username}</span>
                    </Link><br/>
                    <a target="_blank" rel="noopener" data-e2e="user-card-nickname" className="tiktok-px0n0u-StyledUserName er095115" href={`/${comment.user.username}?lang=en`}>𝑫𝒖𝒚 𝑻𝒉𝒂́𝒊 👑</a>
                    <p className="tiktok-1gj7x9t-PUserStat er095117">
                        <span data-e2e="user-card-follower-count" className="tiktok-ceyvsn-SpanUserStatsText er095118">340.7K</span>
                        <span data-e2e="user-card-follower" className="tiktok-1n85168-SpanUserStatsDesc er095119">Followers</span>
                        <span data-e2e="user-card-like-count" className="tiktok-ceyvsn-SpanUserStatsText er095118">12.6M</span>
                        <span data-e2e="user-card-like" className="tiktok-1n85168-SpanUserStatsDesc er095119">Likes</span>
                    </p>
                    <p data-e2e="user-card-user-bio" className="tiktok-1ch7xpw-PSignature er0951110">💌 CONTACT FOR WORK 💌
                        Insta: {comment.user.username}
                        FB: Duy Thái
                    </p>
                </div>
            </div>:''}
        </div>
    )
}
export default Comment