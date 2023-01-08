import Navbar from "../containers/Navbar"
import React,{useState,useEffect,useRef,useCallback} from 'react'
import { useParams,useLocation,useNavigate,useSearchParams } from "react-router-dom";
import "../css/profile.css"
import { videouserURL,followinguserURL,listThreadlURL } from "../urls";
import { headers,updateprofile,checkAuthenticated,updatenotify, expiry, setrequestlogin } from "../actions/auth";
import axios from "axios"
import Videouser from "./Videouser"
import {connect} from "react-redux"
import Showcoment from "../containers/Videodetail"
import io from "socket.io-client"
const Profile=(props)=>{
    const {user,updateprofile,isAuthenticated,checkAuthenticated,updatenotify,notify}=props
    const {userprofile}=useParams()
    const dispatch = useDispatch()
    const [requestedit,setRequestedit]=useState(false)
    const [state,setState]=useState({index:0,choice:'onner'})
    const [loading,setLoading]=useState(false)
    const [listvideo,setListvideo]=useState([])
    const [profile,setProfile]=useState({})
    const inputfile= useRef(null)
    const navige=useNavigate()
    useEffect(()=>{
        (async ()=>{
            try{  
           
                const [obj1, obj2] = await axios.all([
                    axios.get(`https://web-production-5dc9.up.railway.app/api/v3/${userprofile}/video?choice=${state.choice}`,headers()),
                    axios.get(`https://web-production-5dc9.up.railway.app/api/v3/${userprofile}/profile`,headers()),
                ])
                const list_videos=obj1.data.listvideo.map(item=>{
                    return({...item,show_video:false,play:false})
                })
                setListvideo(list_videos)
                const userinfo=obj2.data.user
                setProfile({exists:obj2.data.exists,
                    following:obj2.data.following,
                    profile_info:obj2.data.profile_info,
                    thread:obj2.data.thread,...userinfo})
                setLoading(true)
            }
            catch{
                setState({...state,error:true})
            }
        })()
    },[])

    
    const item=listvideo.find(item=>item.show_comment)
    const setshowvideo=(e,itemchoice,name,value)=>{
        const list_videos=listvideo.map(item=>{
            if(item.id==itemchoice.id){
                if(value==true){
                return({...item,[name]:value,play:true})
                }
                else{
                return({...item,[name]:value,play:false})
                }
            }
            return({...item})
        })
        setListvideo(list_videos)
    }
    const setvideochoice=(e,itemchoice,name,value,name_choice,value_choice)=>{
        const list_videos=listvideo.map(item=>{
            if(item.id==itemchoice.id){
                if(name_choice!=undefined){
                return({...item,[name]:value,[name_choice]:value_choice})
                }
                return({...item,[name]:value})
            }
            return({...item})
        })
        setListvideo(list_videos)
    }
    const setedit=()=>{
        setRequestedit(true)   
    }
    
    const saveprofile=(e)=>{
        updateprofile(profile.username,profile.name,profile.file,profile.profile_info,profile.picture)
        setRequestedit(false)
    }
    const previewFile=(e)=>{
        [].forEach.call(e.target.files, function(file) {
            if ((/image\/.*/.test(file.type))){
                setProfile({...profile,file:file,picture:(window.URL || window.webkitURL).createObjectURL(file)})
            }
        })
    }

    const addthread=(e)=>{
        if(expiry()>0 && localStorage.token){
            if(profile.exists){
                navige(`/messages?thread_id=${profile.thread}`)
            }
            else{
                create_thread()
            }
        }
        else{
            dispatch(setrequestlogin(true))
        }
        
    }
    const create_thread=()=>{  
        let form=new FormData()
        form.append('participants',user.id)
        form.append('participants',profile.id)
        axios.post(listThreadlURL,form,headers())
        .then(res=>{
            navige(`/messages?thread_id=${res.data.threadchoice.id}`)
        })
    }

    const setchoicevideo=useCallback((index,value)=>{
        if(index!=state.index){
        (async ()=>{
            try{
                setState({...state,index:index,choice:value})
                const res=await axios.get(`https://web-production-5dc9.up.railway.app/api/v3/${userprofile}/video?choice=${value}`,headers())
                const list_videos=res.data.listvideo.map(item=>{
                    return({...item,show_video:false,play:false})
                })
                setListvideo(list_videos)
            }
            catch{
                console.log('error')
            }
        })()
    }
    },[state.index])

    const socket=useRef()  
    
    useEffect(() => { 
        socket.current = io.connect('https://servertiktok-production.up.railway.app/');
        socket.current.on("message",e => {
            const data=e.data
            const count_unread=data.follow?notify.count_notify_unseen+1:notify.count_notify_unseen-1
            const count_notify_unseen=count_unread>0?count_unread:0
            const data_unread={count_notify_unseen:count_notify_unseen,send_to:data.send_to}
            updatenotify(data_unread,data.notifi_type)  
          });
          return () => {
            socket.current.disconnect();
        };
    },[profile])

    const setfollow=(e)=>{  
        if(expiry()>0 && localStorage.token){
            fetchdata()
        }
        else{
            dispatch(setrequestlogin(true))
        }
        
    }
    const fetchdata=()=>{
        (async ()=>{
            let form=new FormData()
            form.append('id',profile.id)
            try{
                const res = await axios.post(followinguserURL,form,headers())
                setProfile({...profile,following:res.data.follow})
                let data={send_by:user.id,send_to:profile.id,action:'follow_user',follow:res.data.follow}
            
                socket.current.emit("sendData",data)
            }
            catch{
                console.log('error')
            }
        })()
    }

    return(
        <>
        <div id="main">
            <Navbar/>
            <div className="tiktok-ywuvyb-DivBodyContainer eg65pf90">
                <div className="tiktok-r0hg2a-DivSideNavContainer eg65pf91">
                </div>
                <div className="tiktok-w4ewjk-DivShareLayoutV2 efojldo0">
                    {loading?
                    <div className="tiktok-1hfe8ic-DivShareLayoutContentV2 efojldo1">
                        <div className="tiktok-1g04lal-DivShareLayoutHeader-StyledDivShareLayoutHeaderV2 efojldo2">
                            <div class="tiktok-1gk89rh-DivShareInfo e2qg2m52">
                                <div class="tiktok-uha12h-DivContainer e1vl87hj1" data-e2e="user-avatar" style={{width: '116px', height: '116px'}}>
                                    <span shape="circle" class="e1vl87hj2 tiktok-gigx3u-SpanAvatarContainer-StyledAvatar e1e9er4e0" style={{width: '116px', height: '116px'}}>
                                        <img loading="lazy" src={profile.picture} class="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                                    </span>
                                </div>
                                <div class="tiktok-1hdrv89-DivShareTitleContainer e2qg2m53">
                                    <h2 data-e2e="user-title" class="tiktok-b7g450-H2ShareTitle e2qg2m55">{profile.username}</h2>
                                    <h1 data-e2e="user-subtitle" class="tiktok-qpyus6-H1ShareSubTitle e2qg2m56">{profile.name}</h1>
                                    <div className="tiktok-otme0h-DivShareFollowContainer e1jsfwoz0">
                                    <div class={`${!profile.following?'tiktok-ad9zby-DivEditContainer':'tiktok-1djryq8-DivMessageContainer'} egd57ds0`}>
                                        <button onClick={(e)=>user && user.username==profile.username?setedit(e):profile.following?addthread(e):setfollow(e)} type="button" className={`egd57ds1 ${user && user.username==profile.username?'tiktok-57188y-Button-StyledEditButton':profile.following?'tiktok-1ybns2k-Button-StyledMessageButton':'tiktok-12hrm60-Button-StyledFollowButton'} ehk74z00`}>
                                            {user && user.username!=profile.username?'':
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" width="1em" height="1em" class="tiktok-2r6r7f-StyledEditIcon egd57ds2">
                                                <path fill="black" fillRule="evenodd" d="M15.393 2.226a.842.842 0 00-1.17.02L8.142 8.33a.842.842 0 00-.247.595v2.34c0 .464.377.841.842.841h2.183a.842.842 0 00.596-.246l6.237-6.238a.843.843 0 00-.02-1.211l-2.34-2.184zM9.58 9.273l5.26-5.26 1.107 1.033-5.374 5.375h-.993V9.273zM9.58 2c.232 0 .42.189.42.421v.842a.421.421 0 01-.42.421H4.526a.842.842 0 00-.842.842v10.948c0 .465.377.842.842.842h10.947a.842.842 0 00.842-.842V10.42c0-.232.189-.421.421-.421h.842c.233 0 .422.188.422.421v5.053A2.526 2.526 0 0115.473 18H4.526A2.526 2.526 0 012 15.474V4.526A2.526 2.526 0 014.526 2H9.58z" clipRule="evenodd"></path>
                                            </svg>}
                                            <span>{user && user.username==profile.username?'Edit profile':profile.following?'Message':'Follow'}</span>
                                        </button>
                                        {profile.following?
                                        <div onClick={(e)=>setfollow(e)} class="tiktok-ugux24-DivFollowIconContainer e1jsfwoz6">
                                            <svg width="20" height="20" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M13.0001 13C13.0001 9.68629 15.6864 7 19.0001 7C22.3139 7 25.0001 9.68629 25.0001 13C25.0001 16.3137 22.3139 19 19.0001 19C15.6864 19 13.0001 16.3137 13.0001 13ZM19.0001 3C13.4773 3 9.00015 7.47715 9.00015 13C9.00015 18.5228 13.4773 23 19.0001 23C24.523 23 29.0001 18.5228 29.0001 13C29.0001 7.47715 24.523 3 19.0001 3ZM5.19435 40.9681C6.70152 35.5144 10.0886 32.2352 13.9162 30.738C17.7125 29.2531 22.0358 29.4832 25.6064 31.2486C26.1015 31.4934 26.7131 31.338 26.9931 30.8619L28.0072 29.1381C28.2872 28.662 28.1294 28.0465 27.6384 27.7937C23.0156 25.4139 17.4034 25.0789 12.4591 27.0129C7.37426 29.0018 3.09339 33.3505 1.2883 40.0887C1.14539 40.6222 1.48573 41.1592 2.02454 41.2805L3.97575 41.7195C4.51457 41.8408 5.04724 41.5004 5.19435 40.9681ZM44.7074 30.1212C45.0979 29.7307 45.0979 29.0975 44.7074 28.707L43.2932 27.2928C42.9026 26.9023 42.2695 26.9023 41.8789 27.2928L30.0003 39.1715L25.1216 34.2928C24.7311 33.9023 24.0979 33.9023 23.7074 34.2928L22.2932 35.707C21.9026 36.0975 21.9026 36.7307 22.2932 37.1212L28.586 43.4141C29.3671 44.1952 30.6334 44.1952 31.4145 43.4141L44.7074 30.1212Z"></path></svg>
                                        </div>:''}
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <h2 class="tiktok-7k173h-H2CountInfos e1ciy9o0">
                                <div class="tiktok-xeexlu-DivNumber e1ciy9o1">
                                    <strong title="Following" data-e2e="following-count">46</strong><span data-e2e="following" class="tiktok-5sdvo-SpanUnit e1ciy9o2">Following</span></div><div class="tiktok-xeexlu-DivNumber e1ciy9o1"><strong title="Followers" data-e2e="followers-count">10</strong><span data-e2e="followers" class="tiktok-5sdvo-SpanUnit e1ciy9o2">Followers</span></div><div class="tiktok-xeexlu-DivNumber e1ciy9o1"><strong title="Likes" data-e2e="likes-count">2</strong>
                                    <span data-e2e="likes" class="tiktok-5sdvo-SpanUnit e1ciy9o2">Likes</span>
                                </div>
                            </h2>
                            <h2 data-e2e="user-bio" class="tiktok-b1wpe9-H2ShareDesc e1ciy9o3">No bio yet.</h2>
                            <div class="tiktok-1rxc7na-DivShareActions e1pq4u0v8"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5546 8.35111L13.3171 8.16468V7.37972V3.50006L21.4998 12.0001L13.3171 20.5001V16.3738V15.3664L12.3098 15.3738C8.838 15.3994 5.4275 17.0466 2.49983 19.5882C2.54612 19.2536 2.67769 18.641 2.94391 17.8329C3.3786 16.5132 4.01326 15.1988 4.88691 13.971C6.71045 11.4083 9.24414 9.16046 12.5546 8.35111Z" stroke="#161823" stroke-width="2"></path></svg></div>
                            <div data-e2e="user-more" class="tiktok-jzplnh-DivMoreActions e1pq4u0v6"></div>
                        </div>

                        <div data-e2e="user-more" class="tiktok-xuns3v-DivShareLayoutMain e1pq4u0v4">
                            <div class="tiktok-1k5e4nr-DivVideoFeedTab-StyledDivVideoFeedTabV2 ek8y1s60">
                                <p onClick={()=>setchoicevideo(0,'onner')} data-e2e="videos-tab" class="tiktok-tr4p7q-PPost ewfzvtw1">
                                    <span>Videos</span>
                                </p>
                                <p onClick={()=>setchoicevideo(1,'liked')} data-e2e="liked-tab" class="tiktok-1qocf9t-PLike ewfzvtw2">
                                    <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{transform: 'translateY(2px)'}}><path fillRule="evenodd" clipRule="evenodd" d="M24 3C17.9249 3 13 7.92487 13 14V21H8C6.89543 21 6 21.8954 6 23V41C6 42.1046 6.89543 43 8 43H40C41.1046 43 42 42.1046 42 41V23C42 21.8954 41.1046 21 40 21H35V14C35 7.92487 30.0751 3 24 3ZM31 21V14C31 10.134 27.866 7 24 7C20.134 7 17 10.134 17 14V21H31Z"></path></svg>
                                    <span class="tiktok-1w1pypo-SpanLiked ewfzvtw3">Liked</span>
                                </p>
                                <div class="tiktok-lqjilr-DivBottomLine ewfzvtw4" style={{transform: `translateX(${state.index*230}px)`}}></div>
                            </div>
                            <div data-e2e="user-more" class="tiktok-1qb12g8-DivThreeColumnContainer eiyo6ki2">
                                
                                <div data-e2e="user-liked-item-list" class="tiktok-yvmafn-DivVideoFeedV2 e3gtgzk0">
                                    {listvideo.map(item=>
                                        <Videouser
                                        item={item}
                                        username={userprofile}
                                        setvideochoice={(e,item,name,value,name_choice,value_choice)=>setvideochoice(e,item,name,value,name_choice,value_choice)}
                                        setshowvideo={(e,itemchoice,name,value)=>setshowvideo(e,itemchoice,name,value)}
                                        />
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                    :''}
                </div>
                
            </div>
        </div>
        <div id="modal">
            {requestedit?
            <div className="tiktok-py8jux-DivModalContainer e1gjoq3k0" style={{zIndex: '1001', position: 'fixed'}}>
                <div className="tiktok-1fs75a4-DivModalMask e1gjoq3k1">
                    <div className="tiktok-1bg0j8b-DivContentContainer e1gjoq3k2">
                        <div className="tiktok-o2w5fl-DivModalContainer eal9hht0">
                            <div class="tiktok-1clbxbp-DivHeaderContainer eal9hht1">Edit profile
                                <div onClick={(e)=>setRequestedit(false)} class="tiktok-15o2b2v-DivCloseContainer eal9hht2">
                                    <svg width="24" height="24" viewBox="0 0 48 48" fill="rgba(22, 24, 35, 0.75)" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.1718 23.9999L10.2931 13.1212C9.90261 12.7307 9.90261 12.0975 10.2931 11.707L11.7074 10.2928C12.0979 9.90228 12.731 9.90228 13.1216 10.2928L24.0002 21.1715L34.8789 10.2928C35.2694 9.90228 35.9026 9.90228 36.2931 10.2928L37.7073 11.707C38.0979 12.0975 38.0979 12.7307 37.7073 13.1212L26.8287 23.9999L37.7073 34.8786C38.0979 35.2691 38.0979 35.9023 37.7073 36.2928L36.2931 37.707C35.9026 38.0975 35.2694 38.0975 34.8789 37.707L24.0002 26.8283L13.1216 37.707C12.731 38.0975 12.0979 38.0975 11.7074 37.707L10.2931 36.2928C9.90261 35.9023 9.90261 35.2691 10.2931 34.8786L21.1718 23.9999Z"></path></svg>
                                </div>
                            </div>
                            <div className="tiktok-gr0dyb-DivContentContainer eal9hht5">
                                <div class="tiktok-1xze5cu-DivItemContainer-StyledItemContainerWithLine eal9hht7">
                                    <div class="tiktok-loxuc3-DivLabel eal9hht8">Profile photo</div>
                                    <div onClick={(e)=>inputfile.current.click()} class="tiktok-1vo5gtq-DivAvatarContent eal9hht9">
                                        <div class="eal9hht18 tiktok-1t7819m-DivContainer-StyledAvatar e1vl87hj1" style={{width: '96px', height: '96px'}}>
                                            <span shape="circle" class="e1vl87hj2 tiktok-gigx3u-SpanAvatarContainer-StyledAvatar e1e9er4e0" style={{width: '96px', height: '96px'}}>
                                                <img loading="lazy" src={profile.picture} class="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                                            </span>
                                        </div>
                                        <div class="tiktok-5ecvpu-DivAvatarEditIcon eal9hht17">
                                            <svg width="16" height="16" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M26.5858 5.08579C27.3479 4.32371 28.5767 4.30253 29.3646 5.03789L36.8646 12.0379C37.2612 12.408 37.4904 12.9232 37.4997 13.4655C37.5091 14.0078 37.2977 14.5307 36.9142 14.9142L16.9142 34.9142C16.5391 35.2893 16.0304 35.5 15.5 35.5H8.5C7.39543 35.5 6.5 34.6046 6.5 33.5V26C6.5 25.4696 6.71071 24.9609 7.08579 24.5858L26.5858 5.08579ZM28.0479 9.2805L10.5 26.8284V31.5H14.6716L32.622 13.5496L28.0479 9.2805Z"></path><path d="M7 41C7 40.4477 7.44772 40 8 40H41C41.5523 40 42 40.4477 42 41V43C42 43.5523 41.5523 44 41 44H8C7.44772 44 7 43.5523 7 43V41Z"></path></svg>
                                            <input ref={inputfile} onChange={(e)=>previewFile(e)} type="file" accept=".jpg,.jpeg,.png,.tiff,.heic,.webp" class="tiktok-4jv9vo-InputUpload eal9hht19"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="tiktok-1xze5cu-DivItemContainer-StyledItemContainerWithLine eal9hht7">
                                    <div class="tiktok-loxuc3-DivLabel eal9hht8">Username</div>
                                    <div class="tiktok-gzzkuf-DivEditAreaContainer eal9hht10">
                                        <input onChange={(e)=>setProfile({...profile,username:e.target.value})} placeholder="Username" class="tiktok-1wz852f-InputText eal9hht11" value={profile.username}/>
                                        <p class="tiktok-1xra2d-PProfileSite eal9hht14">www.tiktok.com/@13tyu68ubjv</p>
                                        <p class="tiktok-wvo4gh-PProfileSite-StyledUserNameTip eal9hht15">Usernames can only contain letters, numbers, underscores, and periods. Changing your username will also change your profile link.</p>
                                    </div>
                                </div>
                                <div class="tiktok-1xze5cu-DivItemContainer-StyledItemContainerWithLine eal9hht7">
                                    <div class="tiktok-loxuc3-DivLabel eal9hht8">Name</div>
                                    <div class="tiktok-gzzkuf-DivEditAreaContainer eal9hht10">
                                        <input onChange={(e)=>setProfile({...profile,name:e.target.value})} placeholder="Name" class="tiktok-1wz852f-InputText eal9hht11" value={profile.name}/>
                                    </div>
                                </div>
                                <div class="tiktok-1557cp-DivItemContainer eal9hht6">
                                    <div class="tiktok-loxuc3-DivLabel eal9hht8">Bio</div>
                                    <div class="tiktok-gzzkuf-DivEditAreaContainer eal9hht10">
                                        <textarea onChange={(e)=>setProfile({...profile,profile_info:e.target.value})} value={profile.profile_info} placeholder="Bio" class="tiktok-15t68g9-InputText-StyledInputTextArea eal9hht13"></textarea>
                                        <div class="tiktok-12d1pns-DivTextCount eal9hht16"><span>{profile.profile_info!=""?profile.profile_info.length:0}/</span>80</div>
                                    </div>
                                </div>
                            </div>
                            <div class="tiktok-1oa6jqn-DivFooterContainer eal9hht3">
                                <button onClick={()=>setRequestedit(false)} type="button" class="eal9hht4 tiktok-1oqrmap-Button-StyledBtn ehk74z00">Cancel</button>
                                <button onClick={(e)=>saveprofile(e)} type="button" disabled="" class="eal9hht4 tiktok-280vti-Button-StyledBtn ehk74z00">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>:''}
        </div>
        </>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,notify:state.notify
});
export default connect(mapStateToProps,{updateprofile,updatenotify})(Profile);
