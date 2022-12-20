import React,{useState,useEffect,useRef,useCallback} from 'react'
import axios from "axios"
import { headers,expiry,setrequestlogin} from "../actions/auth";
import {useNavigate} from "react-router-dom"
import { listuploadvideoURL,followinguserURL, actionvideoURL, listcommentURL } from "../urls";
import { number } from "../constants";
import io from "socket.io-client"
import {useSelector,useDispatch} from "react-redux"
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share";

const Video=(props)=>{
    const {item,setvideochoice,setshowvideo,updatenotify,notify}=props
    const videoref=useRef(null)
    const user=useSelector(state=>state.user)
    const requestlogin=useSelector(state=>state.requestlogin)
    const seekbarref=useRef(null)
    const [time,setTime]=useState({seconds:0,minutes:0})
    const [volume,setVolume]=useState(0.5)
    const [state,setState]=useState({show_volume:false})
    const [drag,setDrag]=useState({time:false,volume:false})
    const [duration,setDuration]=useState(0)
    const canvas=useRef()
    const socket=useRef()  
    const navigate=useNavigate()
    const dispatch = useDispatch()
    const timeoutRef = useRef(null);
    
    useEffect(() => { 
        socket.current = io.connect('https://servertiktok-production.up.railway.app/');
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
        if(item.muted){
            setVolume(0)
        }
    },[item.muted])

    const setfollow= async (e)=>{  
        let form=new FormData()
        form.append('id',item.user.id)
        try{
            if(user){
                const res = await axios.post(followinguserURL,form,headers())
                setvideochoice(e,item,'following',res.data.follow)
                const data={action:'like_video',send_by:user.id,send_to:item.user.id,id:item.id,follow:res.data.follow}
                if(user.id!=item.user.id){
                    socket.current.emit("sendData",data)
                }
            }
            else{
                dispatch(setrequestlogin(true))
            }
        }
        catch(e){
            console.log(e)
        }
    }

    const setlikevideo= async (e)=>{
        let form=new FormData()
        form.append('action','like')
        try{
            if(user){
                const res = await axios.post(`${actionvideoURL}/${item.id}`,form,headers())
                setvideochoice(e,item,'like',res.data.like,'count_like',res.data.count_like)
                const data={action:'like_video',send_by:user.id,send_to:item.user.id,id:item.id,like:res.data.like}
                socket.current.emit("sendData",data)
            }
            else{
                dispatch(setrequestlogin(true))
            }
        }
        catch{
            console.log('error')
        }
    }

    const setsharevideo=()=>{
        if(user){
            return 
        }
        else{
            dispatch(requestlogin(true))
        }
    }

    const setshowcomment=(e)=>{  
        if(user){  
            navigate(`/${item.user.username}/video/${item.id}`)  
        }
        else{
            dispatch(setrequestlogin(true))
        }
    }
    useEffect(()=>{
        if(item.show_video && duration){
            if(videoref.current){
                videoref.current.volume=volume    
                
            }
        }
    },[item.show_video,videoref,duration])

    

    useEffect(()=>{
        if(videoref.current){
            if(item.play){
                videoref.current.play()
            }
            else{
                videoref.current.pause()
            }
        }
    },[item.play])


    const settimevideo=(e)=>{
        e.stopPropagation() 
        const rects = progress.current.getBoundingClientRect();
        const {left,width}=rects
        const clientX=e.clientX
        const percent=(clientX-left)/width
        const times=percent*item.duration
        videoref.current.currentTime=times
    }
    const volumeref=useRef()
    const setVolumevideo=(e)=>{
        e.stopPropagation() 
        const rects = seekbarref.current.getBoundingClientRect();
        const volumerects = volumeref.current.getBoundingClientRect();
        const {height,bottom,top}=volumerects
        const clientY=e.clientY
        const value=bottom-clientY
        const percent=value/height>=1?1:value/height<=0?0:value/height
        if(percent>0){
            setvideochoice(e,item,'muted',false)
        }
        else{
            setvideochoice(e,item,'muted',true)
        }
        setVolume(percent)
    }
    const setplayvideo=(e)=>{
        e.stopPropagation() 
        if(videoref.current.paused){
            setvideochoice(e,item,'play',true)
            videoref.current.play()
        }
        else{
            setvideochoice(e,item,'play',false)
            videoref.current.pause()
        }
    }
    const setmutedvideo=(e)=>{
        e.stopPropagation() 
        setVolume(item.muted?0.5:0)
        setvideochoice(e,item,'muted',!item.muted)
    }
    
    const progress=useRef()
    
    useEffect(()=>{
        document.addEventListener('mousemove',setprogess)
        return ()=>{
            document.removeEventListener('mousemove',setprogess)
        }
    },[drag.time,progress,drag.volume,seekbarref,state.show_volume])
    const setdrag=(e)=>{
        e.stopPropagation()
        setDrag({...drag,time:false,volume:false})
    }
    useEffect(()=>{
        document.addEventListener('mouseup',setdrag)
        return ()=>{
            document.removeEventListener('mouseup',setdrag)
        }
    },[])
    const setprogess=(e)=>{
        settime(e)
        setvolume(e)
    }
    const settime=(e)=>{
        if(drag.time){
            const rects = progress.current.getBoundingClientRect();
            const clientX=e.clientX
            const left =rects.left
            const width=rects.width
            const min=left
            const max=left+width
            const percent=clientX<min?0:clientX>max?1:(clientX-left)/width
            const times=percent*item.duration
            videoref.current.currentTime=times
        }
    }

    const setvolume=(e)=>{
        if(state.show_volume && drag.volume){
        const rects = seekbarref.current.getBoundingClientRect();
        const volumerects = volumeref.current.getBoundingClientRect();
        const {top,bottom,height}=volumerects
        const clientY=e.clientY
        const min=rects.top
        const max=rects.bottom
        if(clientY>=min && clientY <=max){
            const percent=(bottom-clientY)/height>=1?1:(bottom-clientY)/height<=0?0:(bottom-clientY)/height
            if(percent==0){
                setvideochoice(e,item,'muted',true)
            }
            else{
                setvideochoice(e,item,'muted',false)
            }
            setVolume(percent)
        }
    }
    }

    return(
        <div onMouseLeave={(e)=>setshowvideo(e,item,'show_video',false)} onMouseEnter={(e)=>setshowvideo(e,item,'show_video',true)} data-e2e="recommend-list-item-container" className="tiktok-1p48f7x-DivItemContainer ecck2zc0">
            <a className="avatar-anchor tiktok-8wecda ecck2zc4" data-e2e="video-author-avatar" href={item.user.username}>
                <div className="tiktok-uha12h-DivContainer e1vl87hj1" style={{width:'56px',height:'56px'}}>
                    <span shape="circle" style={{width:'56px',height:'56px'}} className="e1vl87hj2 tiktok-gigx3u-SpanAvatarContainer-StyledAvatar e1e9er4e0">
                        <img loading="lazy" src={item.user.picture} className="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                        
                    </span>
                </div>
            </a>
            <div className="tiktok-10gdph9-DivContentContainer ecck2zc1">
                <div className="tiktok-1hhj6ie-DivTextInfoContainer ecck2zc7">
                    <div className="tiktok-1mnwhn0-DivAuthorContainer ecck2zc6">
                        <a className="avatar-anchor tiktok-8wecda ecck2zc4" href={item.user.username}>
                            <div className="tiktok-uha12h-DivContainer e1vl87hj1" style={{width:'40px',height:'40px'}}>
                                <span shape="circle" style={{width:'40px',height:'40px'}} className="e1vl87hj2 tiktok-gigx3u-SpanAvatarContainer-StyledAvatar e1e9er4e0">
                                    <img loading="lazy" src="https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/98cb5a941c6ae617e9f0ce13a76178bc.jpeg?x-expires=1652403600&amp;x-signature=rLRzvRHbdhgSyMQyJxyGoEz5oj0%3D" className="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                                </span>
                            </div>
                        </a>
                        <a className="tiktok-1wozk2e-StyledAuthorAnchor e1aily491" href={item.user.username}>
                            <h3 data-e2e="video-author-uniqueid" className="tiktok-debnpy-H3AuthorTitle e1aily490">{item.user.username}
                                <svg className="tiktok-shsbhf-StyledVerifyBadge e1aglo370" width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="#20D5EC"></circle><path fillRule="evenodd" clipRule="evenodd" d="M37.1213 15.8787C38.2929 17.0503 38.2929 18.9497 37.1213 20.1213L23.6213 33.6213C22.4497 34.7929 20.5503 34.7929 19.3787 33.6213L10.8787 25.1213C9.70711 23.9497 9.70711 22.0503 10.8787 20.8787C12.0503 19.7071 13.9497 19.7071 15.1213 20.8787L21.5 27.2574L32.8787 15.8787C34.0503 14.7071 35.9497 14.7071 37.1213 15.8787Z" fill="white"></path></svg>
                            </h3>
                            <h4 data-e2e="video-author-nickname" className="tiktok-7uj1aq-H4AuthorName e1aily492">{item.user.name}</h4>
                        </a>
                    </div>
                    <button onClick={(e)=>setfollow(e)} type="button" data-e2e="feed-follow" className={`eqy70r40 ${!item.following?'tiktok-jcprrh-Button-StyledFollowButton':'tiktok-wy7mh8-Button-StyledFollowButton'} ehk74z00`}>{item.following?"Following":"Follow"}</button>
                    <div data-e2e="video-desc" className="tiktok-1ejylhp-DivContainer e18aywvs0">
                        {JSON.parse(item.caption).map(cap=>{
                            if(cap.type=='tag' || cap.type=='hashtag'){
                                return(
                                    <a className="tiktok-q3q1i1-StyledCommonLink e18aywvs4" href={`/${cap.type=='hashtag'?`tag/${cap.text}`:`${item.tags.find(user=>cap.text.includes(user.name)).username}`}`}>
                                        <strong className="tiktok-f9vo34-StrongText e18aywvs1">{cap.type=='hashtag'?`#${cap.text}`:`@${cap.text}`}</strong>
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
                    <h4 data-e2e="video-music" className="tiktok-9y3z7x-H4Link eofn35l0">
                        <a href="/music/original-sound-バヤシ🥑Bayashi-7073778045185837826">
                            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="tiktok-812w79-SvgIcon eofn35l1"><use xlinkHref="#svg-music-note"></use>
                            </svg>original sound  - {item.user.name}
                        </a>
                    </h4>
                </div>
                <div className="tiktok-kd7foj-DivVideoWrapper e71rlrn16">
                    <div data-e2e="feed-video" className="tiktok-1lh5noh-DivVideoCardContainer e71rlrn7">
                        <canvas ref={canvas} width="56.25" height="100" className="tiktok-196h150-CanvasVideoCardPlaceholder e71rlrn0"></canvas>
                        <div className="tiktok-1rgp3yx-DivVideoPlayerContainer e71rlrn15">
                            <div mode="0" className="tiktok-yf3ohr-DivContainer e1yey0rl0">
                                <img mode="0" src={item.video_preview} alt="🌸 Subscribe to YouTube → Bayashi TV #tiktokfood #roastbeef #sandwich #asmr" loading="lazy" className="tiktok-1itcwxg-ImgPoster e1yey0rl1"/>
                                {item.show_video && !item.show_comment && !item.hidden_video?
                                <div className="tiktok-1h63bmc-DivBasicPlayerWrapper e1yey0rl2">
                                    <video 
                                    onPlay={(e)=>setvideochoice(e,item,'play',true)}
                                    onPause={e=>setvideochoice(e,item,'play',false)}
                                    onTimeUpdate={()=>{
                                        
                                        setTime({...time,seconds:videoref.current.currentTime % 60,minutes:Math.floor((videoref.current.currentTime) / 60) % 60
                                        })
                                    }} onLoadedData={()=>setDuration(videoref.current.duration)} onClick={(e)=>setshowcomment(e)} ref={videoref} src={item.video} autoplay=''  play={true} preload="auto" muted={item.muted && volume<=0?true:false} playsinline="" loop className="tiktok-lkdalv-VideoBasic e1yey0rl4"></video>
                                </div>:''}
                            </div>
                            <div onClick={(e)=>setplayvideo(e)} data-e2e="video-play" className="tiktok-mlcjt3-DivPlayIconContainer-StyledDivPlayIconContainer e71rlrn9">
                                <svg fill={'#fff'} width="32" height="32" version="1.1" viewBox="0 0 36 36" >
                                    {item.play?
                                    <path  className="ytp-svg-fill" d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z" id="ytp-id-305"></path>
                                    :<path className="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-id-303"></path>
                                }</svg>
                            </div>
                            <div onMouseEnter={()=>setState({...state,show_volume:true})} onMouseLeave={()=>setState({...state,show_volume:false})} className="tiktok-q09c19-DivVoiceControlContainer e71rlrn12">
                                {state.show_volume && (
                                <div ref={seekbarref}
                                    onClick={(e)=>setVolumevideo(e)}
                                    onMouseDown={e=>setDrag({...drag,volume:true})}
                                 className="tiktok-6ksj57-DivVolumeControlContainer e18vm3210">
                                    <div ref={volumeref} className="tiktok-1nww5qr-DivVolumeControlProgress e18vm3211"></div>
                                    <div className="tiktok-1j0s7u0-DivVolumeControlCircle e18vm3213" style={{transform: `translateY(-${(volume)*42}px)`}}></div>
                                    <div  className="tiktok-1pqw0yi-DivVolumeControlBar e18vm3212" style={{transform: `scaleY(${volume})`}}></div>
                                </div>)}
                                <div onClick={(e)=>setmutedvideo(e)} data-e2e="video-sound" className="tiktok-105iyqb-DivMuteIconContainer e71rlrn11">
                                    <svg width="24" height="24" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                                    {item.muted?
                                    <path fillRule="evenodd" clipRule="evenodd" d="M25 10.8685C25 8.47242 22.3296 7.04325 20.3359 8.37236L10.3944 15H6C4.34315 15 3 16.3431 3 18V30C3 31.6568 4.34314 33 6 33H10.3944L20.3359 39.6276C22.3296 40.9567 25 39.5276 25 37.1315V10.8685ZM29.2929 18.1213L35.1716 24L29.2929 29.8787C28.9024 30.2692 28.9024 30.9024 29.2929 31.2929L30.7071 32.7071C31.0976 33.0976 31.7308 33.0976 32.1213 32.7071L38 26.8284L43.8787 32.7071C44.2692 33.0976 44.9024 33.0976 45.2929 32.7071L46.7071 31.2929C47.0976 30.9024 47.0976 30.2692 46.7071 29.8787L40.8284 24L46.7071 18.1213C47.0976 17.7308 47.0976 17.0976 46.7071 16.7071L45.2929 15.2929C44.9024 14.9024 44.2692 14.9024 43.8787 15.2929L38 21.1716L32.1213 15.2929C31.7308 14.9024 31.0976 14.9024 30.7071 15.2929L29.2929 16.7071C28.9024 17.0976 28.9024 17.7308 29.2929 18.1213Z"></path>:
                                    <path fillRule="evenodd" clipRule="evenodd" d="M20.3359 8.37236C22.3296 7.04325 25 8.47242 25 10.8685V37.1315C25 39.5276 22.3296 40.9567 20.3359 39.6276L10.3944 33H6C4.34314 33 3 31.6568 3 30V18C3 16.3431 4.34315 15 6 15H10.3944L20.3359 8.37236ZM21 12.737L12.1094 18.6641C11.7809 18.8831 11.3948 19 11 19H7V29H11C11.3948 29 11.7809 29.1169 12.1094 29.3359L21 35.263V12.737ZM32.9998 24C32.9998 21.5583 32.0293 19.3445 30.4479 17.7211C30.0625 17.3255 29.9964 16.6989 30.3472 16.2724L31.6177 14.7277C31.9685 14.3011 32.6017 14.2371 33.0001 14.6195C35.4628 16.9832 36.9998 20.3128 36.9998 24C36.9998 27.6872 35.4628 31.0168 33.0001 33.3805C32.6017 33.7629 31.9685 33.6989 31.6177 33.2724L30.3472 31.7277C29.9964 31.3011 30.0625 30.6745 30.4479 30.2789C32.0293 28.6556 32.9998 26.4418 32.9998 24ZM37.0144 11.05C36.6563 11.4705 36.7094 12.0995 37.1069 12.4829C40.1263 15.3951 42.0002 19.4778 42.0002 23.9999C42.0002 28.522 40.1263 32.6047 37.1069 35.5169C36.7094 35.9003 36.6563 36.5293 37.0144 36.9498L38.3109 38.4727C38.6689 38.8932 39.302 38.9456 39.7041 38.5671C43.5774 34.9219 46.0002 29.7429 46.0002 23.9999C46.0002 18.2569 43.5774 13.078 39.7041 9.43271C39.302 9.05421 38.6689 9.10664 38.3109 9.52716L37.0144 11.05Z"></path>}
                                    </svg>
                                </div>
                            </div>
                            <div className="tiktok-nlv8yo-DivVideoControlContainer ek83qou6">
                                <div  ref={progress}
                                    onClick={(e)=>settimevideo(e)}
                                    onMouseDown={e=>setDrag({...drag,time:true})}
                                        className="tiktok-1gmtcd3-DivSeekBarContainer ek83qou1">
                                    <div className="tiktok-ckj05b-DivSeekBarProgress ek83qou3"></div>
                                    <div className="tiktok-ifi2lf-DivSeekBarCircle ek83qou5" style={{left: `calc(${(time.minutes*60+time.seconds)/item.duration*100}%)`}}></div>
                                    <div className="tiktok-122kkp0-DivSeekBar ek83qou4" style={{transform: `scaleX(${(time.minutes*60+time.seconds)/item.duration}) translateY(-50%)`}}></div>
                                </div>
                                <div className="tiktok-1atuw3p-DivSeekBarTimeContainer ek83qou2">{('0'+time.minutes).slice(-2)}:{('0'+Math.floor(time.seconds)).slice(-2)}/{('0'+item.minutes).slice(-2)}:{('0'+item.seconds).slice(-2)}</div>
                            </div>
                            <div className="tiktok-fxqf0v-DivVideoControlBottom ek83qou0"></div>
                            <div onClick={(e)=>setvideochoice(e,item,'show_report',true)} data-e2e="video-report" className="tiktok-czl35e-PReportText item-center e71rlrn13">
                                <svg className="tiktok-1xp708q-SvgIconFlag e1oyh2e23" width="16" height="15" viewBox="0 0 48 48" color="#ffffff" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9 9.31286V27.0626C9.98685 26.7378 11.184 26.4042 12.5108 26.1585C16.1115 25.4917 21.0181 25.4123 25.1625 28.3726C28.0181 30.4123 31.6115 30.4917 34.7608 29.9085C36.306 29.6223 37.6602 29.1908 38.6289 28.8293C38.7603 28.7803 38.8841 28.7328 39 28.6872V10.9374C38.0131 11.2623 36.816 11.5959 35.4892 11.8416C31.8885 12.5084 26.9819 12.5878 22.8375 9.62751C19.9819 7.58781 16.3885 7.5084 13.2392 8.09161C11.694 8.37776 10.3398 8.80927 9.37105 9.17072C9.23971 9.21973 9.11586 9.2673 9 9.31286ZM40.1067 6.21064C40.7264 5.90123 41.4622 5.93453 42.0515 6.29874C42.6411 6.66315 43 7.30688 43 8.00004V30C43 30.7576 42.572 31.4501 41.8944 31.7889L41 30C41.8944 31.7889 41.8931 31.7895 41.8931 31.7895L41.8916 31.7903L41.8878 31.7922L41.8775 31.7973L41.846 31.8127C41.831 31.82 41.8128 31.8288 41.7915 31.839C41.7761 31.8464 41.7589 31.8545 41.7401 31.8634C41.651 31.9055 41.525 31.9637 41.3654 32.0343C41.0466 32.1753 40.5919 32.3663 40.0273 32.577C38.9023 32.9967 37.319 33.5027 35.4892 33.8416C31.8885 34.5084 26.9819 34.5878 22.8375 31.6275C19.9819 29.5878 16.3885 29.5084 13.2392 30.0916C11.694 30.3778 10.3398 30.8093 9.37105 31.1707C9.23971 31.2197 9.11586 31.2673 9 31.3129V44.0001C9 44.5524 8.55228 45.0001 8 45.0001H6C5.44772 45.0001 5 44.5524 5 44.0001V8.00004C5 7.24249 5.42801 6.54996 6.10558 6.21118L7 8.00004C6.10558 6.21118 6.10688 6.21053 6.10688 6.21053L6.10842 6.20976L6.11219 6.20789L6.12249 6.20279L6.15404 6.18734C6.17988 6.17477 6.21529 6.15773 6.25987 6.13667C6.34902 6.09457 6.47498 6.03636 6.63455 5.9658C6.95342 5.8248 7.4081 5.63378 7.9727 5.42311C9.09774 5.00332 10.681 4.49734 12.5108 4.15849C16.1115 3.49171 21.0181 3.4123 25.1625 6.37257C28.0181 8.41227 31.6115 8.49167 34.7608 7.90846C36.306 7.62231 37.6602 7.1908 38.6289 6.82935C39.1112 6.6494 39.4925 6.48886 39.7478 6.37595C39.8754 6.31956 39.9711 6.27523 40.0318 6.24653C40.0622 6.23219 40.0838 6.22177 40.0962 6.21572L40.1056 6.21118L40.1067 6.21064Z"></path></svg>
                                Report
                            </div>
                            {item.hidden_video!=undefined&&item.hidden_video?
                            <div className="tiktok-1hvil8h-DivMask e71rlrn1">
                                <div className="tiktok-1xocg1k-DivMaskContainer e71rlrn2">
                                    <div className="tiktok-1enzgpu-DivMaskIcon e71rlrn3">
                                        <svg width="28" height="28" viewBox="0 0 16 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M13.9637 0.370662C14.1617 0.168152 14.4882 0.170371 14.6834 0.375552L15.6676 1.40986C15.8531 1.60483 15.851 1.91164 15.6629 2.10407L6.33538 11.644C5.86141 12.1288 5.09629 12.1169 4.6365 11.6177L0.326723 6.93829C0.144403 6.74033 0.151478 6.43358 0.342731 6.24424L1.35546 5.24162C1.55673 5.04237 1.88315 5.0499 2.07502 5.25822L5.5238 9.0028L13.9637 0.370662Z"></path></svg>
                                    </div>
                                    <div className="tiktok-1lqjh50-DivMaskTitle e71rlrn4">Thanks for reporting</div>
                                    <div className="tiktok-14c7g23-DivMaskDetail e71rlrn5">To improve your experience, this video has been hidden. We’ll show you fewer videos like this.</div>
                                    <button onClick={(e)=>setvideochoice(e,item,'hidden_video',false,'success_report',false)} className="tiktok-nsc3oe-ButtonMask e71rlrn6">Show Video</button>
                                </div>
                            </div>:''}
                        </div>
                    </div>
                    
                    <div className="tiktok-wc6k4c-DivActionItemContainer ear7a600">
                        <button type="button" className="tiktok-1xiuanb-ButtonActionItem ee8s79f0">
                            <span onClick={(e)=>setlikevideo(e)} data-e2e="like-icon" className="tiktok-i3zdyr-SpanIconWrapper ee8s79f1">
                                <svg color={!item.like?'#262626':'#ed4956'} fill={!item.like?'#262626':'#ed4956'} height="24" role="img" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                            </span>
                            {item.count_like>0?<strong data-e2e="like-count" className="tiktok-1y2yo26-StrongText ee8s79f2">{number(item.count_like)}</strong>:''}
                        </button>
                        <button onClick={(e)=>setshowcomment(e)} type="button" className="tiktok-1xiuanb-ButtonActionItem ee8s79f0">
                            <span data-e2e="comment-icon" className="tiktok-i3zdyr-SpanIconWrapper ee8s79f1">
                                <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#BubbleEllipsisRightFill_clip0)"><g opacity="1" filter="url(#BubbleEllipsisRightFill_filter0_d)"><path fillRule="evenodd" clipRule="evenodd" d="M16.0393 14.7137C17.75 13 18.75 11.215 18.75 9.13662C18.75 4.91897 14.8887 1.49997 10.125 1.49997C5.36129 1.49997 1.5 4.91897 1.5 9.13675C1.5 13.3545 5.48622 16.25 10.25 16.25V17.6487C10.25 18.0919 10.7095 18.3771 11.0992 18.1659C12.3166 17.5062 14.5725 16.183 16.0393 14.7137ZM5.93527 8.10679C6.61608 8.10679 7.16797 8.65471 7.16797 9.32962C7.16797 10.0059 6.61608 10.5538 5.93527 10.5538C5.2556 10.5538 4.70368 10.0059 4.70368 9.32962C4.70368 8.65471 5.2556 8.10679 5.93527 8.10679ZM11.3572 9.32962C11.3572 8.65471 10.8055 8.10679 10.125 8.10679C9.44459 8.10679 8.89289 8.65471 8.89289 9.32962C8.89292 10.0059 9.44462 10.5538 10.125 10.5538C10.8055 10.5538 11.3572 10.0059 11.3572 9.32962ZM14.3146 8.10679C14.9953 8.10679 15.5464 8.65471 15.5464 9.32962C15.5464 10.0059 14.9953 10.5538 14.3146 10.5538C13.6339 10.5538 13.082 10.0059 13.0821 9.32962C13.0821 8.65471 13.6339 8.10679 14.3146 8.10679Z"></path></g><path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M10.25 16.2499C10.25 16.2499 15.0278 15.8807 17.025 13.3234C15.0278 16.1364 13.0307 17.6708 11.2831 18.1822C9.53561 18.6937 10.25 16.2499 10.25 16.2499Z" fill="url(#BubbleEllipsisRightFill_paint0_linear)"></path></g><defs><filter id="BubbleEllipsisRightFill_filter0_d" x="0.5" y="1.49997" width="19.25" height="18.737" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="1"></feOffset><feGaussianBlur stdDeviation="0.5"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><linearGradient id="BubbleEllipsisRightFill_paint0_linear" x1="8.50426" y1="15.6957" x2="9.29499" y2="18.1805" gradientUnits="userSpaceOnUse"><stop></stop><stop offset="1" stopOpacity="0.01"></stop></linearGradient><clipPath id="BubbleEllipsisRightFill_clip0"><rect width="20" height="20" fill="white"></rect></clipPath></defs></svg>
                            </span>
                            {item.count_comment>0?<strong data-e2e="comment-count" className="tiktok-1y2yo26-StrongText ee8s79f2">{number(item.count_comment)}</strong>:""}
                        </button>
                        <button onMouseLeave={(e)=>setvideochoice(e,item,'show_share',false)} onMouseEnter={(e)=>setvideochoice(e,item,'show_share',true)} type="button" className="tiktok-1xiuanb-ButtonActionItem ee8s79f0">
                            <span data-e2e="share-icon" className="tiktok-i3zdyr-SpanIconWrapper ee8s79f1">
                            <svg width="24" height="24" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M26.4588 3.90871C25.3403 2.86068 23.4902 3.64074 23.4902 5.16041V13.0502C20.4499 14.1752 11.3194 18.1407 6.6047 26.6176C-1.49677 42.1311 3.82522 43.478 5.77105 39.7411C13.2467 29.1857 20.8146 30.4298 23.4902 31.3209V38.2274C23.4902 39.7114 25.2658 40.5055 26.4023 39.5298L43.3681 24.9655C44.9268 23.6274 44.9791 21.2608 43.4811 19.8573L26.4588 3.90871Z"></path></svg>
                            </span>
                            {item.count_share>0?<strong data-e2e="share-count" className="tiktok-1y2yo26-StrongText ee8s79f2">{number(item.count_share)}</strong>:''}
                            {item.show_share?
                            <div className="tiktok-1gg6dzy-DivContainer e2ipgxl0" style={{backgroundColor: 'rgb(255, 255, 255)', paddingRight: '4px', left: '-25px'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 8" width="1em" height="1em" verticalPropKey="bottom" className="tiktok-vww5vx-StyledTopArrow e2ipgxl1" style={{left: '36px'}}><path d="M0 8c7 0 10-8 12-8s5 8 12 8z"></path></svg>
                                <div data-e2e="feed-share-group" className="tiktok-2hiaaj-DivShareWrapper ear7a606">
                                    <a mode="1" href="#" data-e2e="video-share-embed" className="tiktok-hpwqep-AShareLink e14n7zw10">
                                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#161823" fill-opacity="0.75"></path><path fillRule="evenodd" clipRule="evenodd" d="M12.313 7.96568C12.3665 7.65966 12.658 7.45498 12.964 7.50851C13.27 7.56203 13.4747 7.8535 13.4211 8.15951L12.0506 15.9952C11.997 16.3012 11.7056 16.5059 11.3996 16.4523C11.0936 16.3988 10.8889 16.1073 10.9424 15.8013L12.313 7.96568ZM16.2402 8.77448C15.96 8.48453 15.5058 8.48453 15.2256 8.77448C14.9454 9.06443 14.9454 9.53454 15.2256 9.82449L17.454 12.1307L15.2262 14.4364C14.946 14.7263 14.946 15.1964 15.2262 15.4864C15.5063 15.7763 15.9606 15.7763 16.2407 15.4864L19.4551 12.1598C19.4704 12.1439 19.4704 12.1182 19.4551 12.1023L19.2233 11.8623L19.2201 11.8586L19.2158 11.854L16.2402 8.77448ZM8.88972 15.4867C8.59977 15.7766 8.12966 15.7766 7.83971 15.4867L5.4207 13.0677L4.76017 12.4071L4.51191 12.1589C4.49603 12.143 4.49603 12.1173 4.51191 12.1014L7.83853 8.77477C8.12848 8.48482 8.59859 8.48482 8.88854 8.77477C9.17849 9.06472 9.17849 9.53482 8.88854 9.82478L6.58318 12.1301L8.88972 14.4367C9.17967 14.7266 9.17967 15.1967 8.88972 15.4867Z" fill="white"></path></svg>
                                        <span className="tiktok-1qov91f-SpanShareText e14n7zw12">Embed</span>
                                    </a>
                                    <button  mode="1"  data-e2e="video-share-message" className="tiktok-hpwqep-AShareLink e14n7zw10">
                                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#FE2C55"></path><path fillRule="evenodd" clipRule="evenodd" d="M18.7913 7.1875C18.6796 6.99413 18.4733 6.875 18.25 6.875H5.75001C5.50258 6.875 5.27845 7.02097 5.17839 7.24727C5.07834 7.47356 5.1212 7.73758 5.28771 7.9206L8.55021 11.5065C8.72305 11.6965 8.9945 11.7614 9.23456 11.6702L13.7656 9.94799C13.8184 9.92795 13.8423 9.93624 13.8527 9.94039C13.871 9.94765 13.8971 9.96649 13.9177 10.0013C13.9382 10.0361 13.9421 10.0681 13.9396 10.0876C13.9382 10.0987 13.9339 10.1237 13.8909 10.1602L10.1707 13.3155C9.97902 13.4782 9.90339 13.7398 9.97878 13.9796L11.4038 18.5124C11.4781 18.749 11.6853 18.9192 11.9317 18.9463C12.1781 18.9734 12.4173 18.8522 12.5413 18.6375L18.7913 7.81251C18.9029 7.61913 18.9029 7.38088 18.7913 7.1875Z" fill="white"></path></svg>
                                        <span className="tiktok-1qov91f-SpanShareText e14n7zw12">Send to friends</span>
                                    </button>
                                    <FacebookShareButton
                                        url={`/${item.user.username}/video/${item.id}`}
                                        className="tiktok-hpwqep-AShareLink"
                                        onShareWindowClose={()=>setsharevideo()}
                                        children={ <>  
                                            <svg width="26" height="26" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 47C36.7025 47 47 36.7025 47 24C47 11.2975 36.7025 1 24 1C11.2975 1 1 11.2975 1 24C1 36.7025 11.2975 47 24 47Z" fill="white"></path><path d="M24 1C11.2964 1 1 11.2964 1 24C1 35.4775 9.40298 44.9804 20.3846 46.7205L20.3936 30.6629H14.5151V24.009H20.3936C20.3936 24.009 20.3665 20.2223 20.3936 18.5363C20.4206 16.8503 20.7542 15.2274 21.6288 13.7487C22.9722 11.4586 25.0639 10.3407 27.6335 10.0251C29.7432 9.76362 31.826 10.0521 33.9087 10.3407C34.0529 10.3587 34.125 10.3767 34.2693 10.4038C34.2693 10.4038 34.2783 10.6472 34.2693 10.8005C34.2603 12.4053 34.2693 16.0839 34.2693 16.0839C33.2685 16.0659 31.6096 15.9667 30.5096 16.138C28.6884 16.4175 27.6425 17.5806 27.6064 19.4108C27.5704 20.8354 27.5884 24.009 27.5884 24.009H33.9988L32.962 30.6629H27.5974V46.7205C38.597 44.9984 47.009 35.4775 47.009 24C47 11.2964 36.7036 1 24 1Z" fill="#0075FA"></path></svg>
                                            <span className="tiktok-1qov91f-SpanShareText e14n7zw12">Share to Facebook</span>
                                        </>}
                                        
                                            
                                    />
                                    <PinterestShareButton
                                        url={`/${item.user.username}/video/${item.id}`}
                                        className="tiktok-hpwqep-AShareLink"
                                        aria-label="Share on Pinterest"
                                        children={<>
                                        <svg width="26" height="26" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.0173 3C12.4102 3 3 12.3947 3 23.9827C3 32.8766 8.53541 40.4753 16.3542 43.5321C16.1639 41.8742 16.0082 39.3183 16.4234 37.5049C16.8039 35.8643 18.8797 27.074 18.8797 27.074C18.8797 27.074 18.257 25.8133 18.257 23.9655C18.257 21.0469 19.9522 18.8709 22.0626 18.8709C23.8616 18.8709 24.7265 20.2179 24.7265 21.824C24.7265 23.6201 23.5848 26.3141 22.9794 28.8183C22.4777 30.9079 24.0345 32.6176 26.093 32.6176C29.8294 32.6176 32.7009 28.6801 32.7009 23.0156C32.7009 17.9901 29.0856 14.4844 23.9135 14.4844C17.9283 14.4844 14.4168 18.9572 14.4168 23.5855C14.4168 25.3816 15.1087 27.3158 15.9736 28.3692C16.1466 28.5765 16.1639 28.7664 16.112 28.9737C15.9563 29.6299 15.5931 31.0633 15.5239 31.3569C15.4374 31.7368 15.2125 31.8232 14.8146 31.6332C12.1853 30.4071 10.542 26.5905 10.542 23.4992C10.542 16.8849 15.3509 10.8059 24.4324 10.8059C31.7149 10.8059 37.3887 15.9868 37.3887 22.9293C37.3887 30.1653 32.822 35.9852 26.4909 35.9852C24.3632 35.9852 22.3566 34.8799 21.682 33.5674C21.682 33.5674 20.6268 37.574 20.3673 38.5584C19.9003 40.389 18.6202 42.6686 17.7553 44.0674C19.7273 44.6719 21.8031 45 23.9827 45C35.5897 45 44.9999 35.6053 44.9999 24.0173C45.0345 12.3947 35.6243 3 24.0173 3Z" fill="#E60019"></path></svg>
                                        <span className="tiktok-1qov91f-SpanShareText e14n7zw12">Share to Pinterest</span></>}
                                    />
                                        
                                    <TwitterShareButton
                                        url={`/${item.user.username}/video/${item.id}`}
                                        className="tiktok-hpwqep-AShareLink" 
                                        aria-label="Share on Twitter"
                                        children={<><svg width="26" height="26" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.0002 47.001C36.7028 47.001 47.0002 36.7035 47.0002 24.001C47.0002 11.2984 36.7028 1.00098 24.0002 1.00098C11.2977 1.00098 1.00024 11.2984 1.00024 24.001C1.00024 36.7035 11.2977 47.001 24.0002 47.001Z" fill="#1DA1F2"></path><path fillRule="evenodd" clipRule="evenodd" d="M38.2029 13.5327C37.3894 14.0824 35.5215 14.8813 34.6003 14.8813V14.8829C33.5484 13.7237 32.0675 13 30.4252 13C27.2353 13 24.6488 15.7287 24.6488 19.0925C24.6488 19.5598 24.7001 20.0157 24.795 20.4529H24.794C20.4671 20.3331 15.7348 18.0452 12.886 14.1294C11.1344 17.3277 12.6501 20.8848 14.6378 22.1809C13.9574 22.235 12.7049 22.0982 12.1153 21.4913C12.0758 23.6142 13.0434 26.4269 16.5714 27.4473C15.8919 27.8329 14.6892 27.7223 14.1662 27.6402C14.3497 29.4322 16.7285 31.775 19.3297 31.775C18.4026 32.9063 14.9144 34.9582 11 34.3054C13.6584 36.0118 16.7568 37 20.0362 37C29.3556 37 36.5929 29.0322 36.2034 19.2027C36.2019 19.1919 36.2019 19.1811 36.2009 19.1693C36.2019 19.144 36.2034 19.1187 36.2034 19.0925C36.2034 19.0619 36.2009 19.0331 36.2 19.0035C37.0484 18.3914 38.1868 17.3087 39 15.8836C38.5284 16.1577 37.1134 16.7064 35.7968 16.8426C36.6418 16.3615 37.8937 14.7858 38.2029 13.5327Z" fill="white"></path></svg><span className="tiktok-1qov91f-SpanShareText e14n7zw12">Share to Twitter</span>
                                        </>}
                                    />
                                    
                                    <LinkedinShareButton
                                        url={`/${item.user.username}/video/${item.id}`}
                                    />
                                    <TelegramShareButton
                                    url={`/${item.user.username}/video/${item.id}`}
                                    
                                    />
                                    <RedditShareButton
                                    url={`/${item.user.username}/video/${item.id}`}
                                    
                                    />
                                    <EmailShareButton
                                    url={`/${item.user.username}/video/${item.id}`}
                                        subject="Title of the shared page"
                                        body="Email, will be prepended to the url."
                                        separator="Separates body from the url"
                                    />
                                    <a className="tiktok-1itvk93-AShareArrow e14n7zw11">
                                        <svg width="24" height="24" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.8788 33.1213L7.58586 18.8284C7.19534 18.4379 7.19534 17.8047 7.58586 17.4142L10.4143 14.5858C10.8048 14.1953 11.438 14.1953 11.8285 14.5858L24.0001 26.7574L36.1716 14.5858C36.5622 14.1953 37.1953 14.1953 37.5859 14.5858L40.4143 17.4142C40.8048 17.8047 40.8048 18.4379 40.4143 18.8284L26.1214 33.1213C24.9498 34.2929 23.0503 34.2929 21.8788 33.1213Z"></path></svg>
                                    </a>
                                </div>
                            </div>:''}
                        </button>
                    </div>
                </div>
            </div>
        </div> 
    )
}
export default Video