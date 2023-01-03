
import React, { useEffect, useRef, useState,useCallback } from "react"
import axios from "axios"
import "../css/live.css"
import RecordRTC, { MediaStreamRecorder } from "recordrtc";
import {Link,useNavigate,useParams} from 'react-router-dom'
import Navbar from "../containers/Navbar"
import Sinabar from "../containers/Accountsugested"; 
import Chat from "./Chat";
import {connect} from 'react-redux'
import {sendcoinURL,api,followinguserURL} from "../urls"
import {listgift,dataURLtoFile} from "../constants"
import { headers } from "../actions/auth";
import io from "socket.io-client"
import Peer from "simple-peer";
import StreamList from "./StreamList"



const Livestream=(props) =>{
	const socket = io('https://anhdai12345.herokuapp.com/');
	const {user,isAuthenticated}=props
	const [ state, setState ] = useState({ message: "",translateX:0,src:null })
	const [messages, setMessages] = useState([])
	const {name} =useParams()
	const [loading,setLoading]=useState(false)
	const [streams,setStreams]=useState([])
	const [showvideo,setShowvideo]=useState(true)
	const giftcontent=useRef()
	const giftchild=useRef()
	let [gifts,setListgif]=useState([])
	const [mylive,setMylive]=useState(null)
	const [topgivecoin,setTopgivecoin]=useState([])
	const [thread,setThread]=useState({views:0,stread_id:name,url:null})
	const [disable,setDisable]=useState({left:true,right:false})
	const [peers, setPeers] = useState([]);
	const refVideo = useRef();
	const refCanvas = useRef();
	const userVideo=useRef()
  	const [me, setMe] = useState('');
	const [join,setJoin]=useState(null)
    const  messagesEndRef=useRef()
	const setmessages=(data)=>{
		setMessages(data)
	}
	const setmessage=(e,message,name,value)=>{
		const listmessages=messages.map(item=>{
			if(item.id!=undefined && message.id==item.id){
				return({...item,[name]:value})
			}
			return({...item,[name]:false})
		})
		setMessages(listmessages)
	}
	
	const settopgivecoin=(data)=>{
		setTopgivecoin(data)
	}
	const setlistgif=(data)=>{
		setListgif(data)
	}

	useEffect(()=>{
		(async ()=>{
			try{
				await isAuthenticated
				const [obj1,obj2,obj3]=await axios.all([
					axios.get(`${api}/v2/${name}/live`,headers()),
					axios.get(`${api}/v2/${name}/live/messages`,headers()),
					axios.get(`${api}/v2/${name}/live/give/coin`,headers())
				])
				setThread({...thread,views:obj1.data.count_views})
				setMessages(obj2.data)
				setMylive(obj1.data)
				setLoading(true)
				setTopgivecoin(obj3.data)
			}
			catch{
			}
		})()
	},[name])

	const constraints = {
		video: { facingMode: "user" }
		// Uncomment to enable audio
		// audio: true,
	};
	
	const setthread=(data)=>{
		setThread(data)
	}
	
	const topgift = topgivecoin.sort((a, b) => b.coins - a.coins);
	const peerConnections = {};
	const config = {
	iceServers: [
		{
		urls: ["stun:stun.l.google.com:19302"]
		}
	]
	};
	const sendcoin=(e,item)=>{
		(async ()=>{
			try{
				
				let form =new FormData()
				form.append('coin',item.coin)
				form.append('send_by',user.id)
				form.append('id',mylive.id)
				form.append('send_to',mylive.user.id)
				const res = await axios.post(sendcoinURL,form,headers())
				const data={stream_id:name,user:user,gift:item}
				socket.emit("sendData", data)
			}
			catch{

			}
		})()
	}
	
	const showfollow=(e)=>{
		setMylive({...mylive,show_follow:true})
	}
	const setfollow=(e,value)=>{  
			(async ()=>{
				try{
				
				let form=new FormData()
				form.append('id',mylive.user.id)
				const res =await axios.post(followinguserURL,form,headers())
				const data={stream_id:name,user:user,following:value}
				if(value){
				socket.emit("sendData", data)
				}
				setMylive({...mylive,show_follow:false,following:value})  
			}
			catch{
			}
		})()	
    }
	const setleftgift=()=>{
		const tran=state.translateX+giftchild.current.offsetWidth*6
		setDisable({...disable,left:state.translateX+(giftchild.current.offsetWidth*6)==0?true:false,right:false})
		setState({...state,translateX:state.translateX+giftchild.current.offsetWidth*6})
	}
	const setrightgift=()=>{
		const tran=state.translateX-(giftchild.current.offsetWidth*6)
		setDisable({...disable,right:tran==-(giftchild.current.offsetWidth)*(listgift.length-6)?true:false,left:false})
		setState({...state,translateX:state.translateX-giftchild.current.offsetWidth*6})
	}

	const startstream=() => {
		(async ()=>{
			await isAuthenticated
			const currentStream =await navigator.mediaDevices.getUserMedia(constraints)
			
			refVideo.current.srcObject = currentStream;
			socket.emit("watcher");
            // emit canvas as data url every 100 milliseconds
		})()
	  }
	
	useEffect(
		() => {
			
			  socket.on("answer", (name, description) => {
				peerConnections[name].setRemoteDescription(description);
				
			  });
			  
			  socket.on("candidate", (name, candidate) => {
				peerConnections[name].addIceCandidate(new RTCIceCandidate(candidate));
			});
			socket.on("broadcaster", () => {
				socket.emit("watcher");
				
			});

			socket.on("watch", name => {
				const peerConnection = new RTCPeerConnection(config);
			
				peerConnections[name] = peerConnection;
				let stream = refVideo.current.srcObject;
				
				
				peerConnection.onicecandidate = event => {
				  if (event.candidate) {
					socket.emit("candidate", name, event.candidate);
				  }
				};
			  
				peerConnection
				  .createOffer()
				  .then(sdp => peerConnection.setLocalDescription(sdp))
				  .then(() => {
					socket.emit("offer", name, peerConnection.localDescription);
				});
			});
			socket.on("offer", (name, description) => {
				
				const peerConnection = new RTCPeerConnection(config);
				peerConnection
				  .setRemoteDescription(description)
				  .then(() => peerConnection.createAnswer())
				  .then(sdp => peerConnection.setLocalDescription(sdp))
				  .then(() => {
					socket.emit("answer", name, peerConnection.localDescription);
				  });
				peerConnection.ontrack = event => {
				  refVideo.current.srcObject = event.streams[0];
				};
				peerConnection.onicecandidate = event => {
				  if (event.candidate) {
					socket.emit("candidate", name, event.candidate);
				  }
				};
			});

			socket.on("message", (e) => {	
				const data=e.data
                if(name==data.stream_id){
                    if(data.action==undefined && data.join==undefined){
                        const listmessages=[ ...messages, data]
                        setmessages(listmessages)
                    }
                    if(data.join!=undefined){
                        setJoin(data)
                        const threadchoice={...thread,views:data.views!=undefined?data.views:thread.views}
                        setthread(threadchoice)
                    }
                    if(data.gift!=undefined){
                        setlistgif([...gifts,data])
                        let topgift=topgivecoin.some(give=>give.giver.id==data.user.id)?
                        topgivecoin.map(item=>{
                            if(item.giver.id==data.user.id){
                            return({...item,coins:item.coins+data.gift.coin})
                            }
                            return({...item})
                        }):[...topgivecoin,{giver:data.user,coins:data.gift.coin}]
                        setState({...state,src:data.src})
                        settopgivecoin(topgift)
                    }
                }
                messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
			})
           
            
			return () => {
                socket.disconnect();
              };
		},
		[ messages,mylive,gifts,topgivecoin ]
	)

	useEffect(()=>{
		if(gifts.length>0){
		const timer=setTimeout(()=>{
		
			const list_gift =gifts.filter((item,i)=>i>0)
			setListgif(list_gift)
		},2000)
		return () =>clearTimeout(timer)
		}
	},[gifts])
	const list_gift_coins=gifts.slice(-3)
	
	return (
		<div id="main">
			<Navbar/>
			<div className="tiktok-1fxlgrb-DivBodyContainer etwpsg30">
				<Sinabar
				user={user}
                
				/>
				<div className="tiktok-l1npsx-DivLiveContentContainer etwpsg32">
					{loading?
					<div className="tiktok-17ypp9g-DivLiveContainer e14c6d570">
						<div className="tiktok-1se8o6v-DivLiveContent e14c6d571">
							<div className="tiktok-3kx2z7-DivLiveMainContent e14c6d572">
								<div class="tiktok-lm0twc-DivLiveRoomBanner e10bhxlw0">
									<div class="tiktok-1s7wqxh-DivUserHoverProfileContainer e19m376d0">
										<div class="tiktok-h3dty0-DivUserProfile e1571njr0">
											<Link to={`/${mylive.user.username}`} target="_blank" rel="noreferrer noopener" data-e2e="user-profile-avatar-link">
												<img src={mylive.user.picture} class="tiktok-k9sb3-StyledProfileAvatar e1571njr2" style={{display: 'block'}}/>
											</Link>
											<div class="tiktok-12vfrd0-DivProfileInfo e1571njr1">
												<Link to={`/${mylive.user.username}`} target="_blank" rel="noreferrer noopener" style={{display: 'block', textDecoration: 'none'}}>
													<div class="tiktok-1rtnwg1-DivBroadcastTitle e1571njr3">
														<h2 data-e2e="user-profile-uid" class="tiktok-ukqwme-H2UniqueId e1571njr4">{mylive.user.username}</h2>
														<h1 data-e2e="user-profile-nickname" class="tiktok-1srrq8u-H1Nickname e1571njr5">{mylive.user.name}</h1>
													</div>
												</Link>
												<div class="tiktok-vfxonb-DivExtraContainer e1571njr7">
													<div data-e2e="user-profile-live-title" class="tiktok-lor5wq-DivBroadcastText e1571njr6">2 mnguoiii</div>
													<div class="tiktok-1h1fbs8-DivPeopleContainer e1108d8t0">
														<svg class="tiktok-1w8jbd4-StyledTwoPerson e1108d8t1" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M16.5 9C13.0453 9 10.2347 11.8104 10.2347 15.2895C10.2347 18.7686 13.0453 21.5789 16.5 21.5789C19.9548 21.5789 22.7654 18.7686 22.7654 15.2895C22.7654 11.8104 19.9548 9 16.5 9ZM6.23468 15.2895C6.23468 9.61226 10.8251 5 16.5 5C22.1749 5 26.7654 9.61226 26.7654 15.2895C26.7654 20.9667 22.1749 25.5789 16.5 25.5789C10.8251 25.5789 6.23468 20.9667 6.23468 15.2895ZM35.5 16C33.4258 16 31.6837 17.7217 31.6837 19.9211C31.6837 22.1204 33.4258 23.8421 35.5 23.8421C37.5742 23.8421 39.3164 22.1204 39.3164 19.9211C39.3164 17.7217 37.5742 16 35.5 16ZM27.6837 19.9211C27.6837 15.5802 31.1497 12 35.5 12C39.8504 12 43.3164 15.5802 43.3164 19.9211C43.3164 24.2619 39.8504 27.8421 35.5 27.8421C31.1497 27.8421 27.6837 24.2619 27.6837 19.9211ZM16.5 32.9474C11.1565 32.9474 6.63553 36.522 5.20008 41.4261C5.04493 41.9561 4.52145 42.3079 3.98014 42.1984L2.01989 41.8016C1.47858 41.6921 1.12554 41.1628 1.26924 40.6295C3.08188 33.903 9.20882 28.9474 16.5 28.9474C23.7912 28.9474 29.9182 33.903 31.7308 40.6295C31.8745 41.1628 31.5215 41.6921 30.9801 41.8016L29.0199 42.1984C28.4786 42.3079 27.9551 41.9561 27.8 41.4261C26.3645 36.522 21.8436 32.9474 16.5 32.9474ZM34.5 35.1053C33.4444 35.1053 32.5679 35.2479 31.8346 35.4841C31.3089 35.6534 30.7069 35.4655 30.4554 34.9738L29.5446 33.1932C29.2931 32.7016 29.4865 32.0943 30.0008 31.893C31.3208 31.3762 32.8181 31.1053 34.5 31.1053C38.1911 31.1053 40.9031 32.4146 42.7838 34.5371C44.3511 36.3059 45.2273 38.5107 45.7455 40.6327C45.8765 41.1692 45.5223 41.6964 44.9807 41.8044L43.0193 42.1955C42.4777 42.3036 41.9545 41.951 41.8182 41.4158C41.3885 39.7287 40.7439 38.2663 39.79 37.1899C38.7278 35.9911 37.1389 35.1053 34.5 35.1053Z"></path></svg>
														<div data-e2e="live-people-count" class="tiktok-1p1g5jf-DivPeopleCounter e1108d8t2">{thread.views}</div>
													</div>
												</div>
											</div>
										</div>
										<div class="tiktok-1bi57sv-DivCardContainer e19m376d1">
											<div data-e2e="user-profile-card" class="tiktok-860ve2-DivProfileContainer e1fbe6io0">
												<div class="tiktok-1tu3lcg-DivHeadContainer e1fbe6io1">
													<Link data-e2e="user-card-avatar-link" to="/@_chubedann" target="_blank" rel="noreferrer noopener">
														<img src="https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/8571f976bd53d55900e15ca717db9cf4~c5_100x100.jpeg?x-expires=1653616800&amp;x-signature=D%2FpzUfkqbZvQg9eEKAsFIGy9UZo%3D" class="tiktok-16dxw1b-StyledProfileAvatar e1fbe6io2" style={{display: 'block'}}/>
													</Link>
													<div class="tiktok-rxg9cy-DivHeadActions e1fbe6io11">
														<div data-e2e="live-room-follow" style={{position: 'relative', zIndex: 2}}>
															{!mylive.following?
															<button type="button" class="e6frb9d0 tiktok-10xeras-Button-StyledFollowButton ehk74z00">
																<span style={{padding: '7px 16px'}}>Follow</span>
															</button>:
															<i class="tiktok-y2o5gk-IActionButton e6frb9d1">
																<svg width="20" height="20" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M13.0001 13C13.0001 9.68629 15.6864 7 19.0001 7C22.3139 7 25.0001 9.68629 25.0001 13C25.0001 16.3137 22.3139 19 19.0001 19C15.6864 19 13.0001 16.3137 13.0001 13ZM19.0001 3C13.4773 3 9.00015 7.47715 9.00015 13C9.00015 18.5228 13.4773 23 19.0001 23C24.523 23 29.0001 18.5228 29.0001 13C29.0001 7.47715 24.523 3 19.0001 3ZM5.19435 40.9681C6.70152 35.5144 10.0886 32.2352 13.9162 30.738C17.7125 29.2531 22.0358 29.4832 25.6064 31.2486C26.1015 31.4934 26.7131 31.338 26.9931 30.8619L28.0072 29.1381C28.2872 28.662 28.1294 28.0465 27.6384 27.7937C23.0156 25.4139 17.4034 25.0789 12.4591 27.0129C7.37426 29.0018 3.09339 33.3505 1.2883 40.0887C1.14539 40.6222 1.48573 41.1592 2.02454 41.2805L3.97575 41.7195C4.51457 41.8408 5.04724 41.5004 5.19435 40.9681ZM44.7074 30.1212C45.0979 29.7307 45.0979 29.0975 44.7074 28.707L43.2932 27.2928C42.9026 26.9023 42.2695 26.9023 41.8789 27.2928L30.0003 39.1715L25.1216 34.2928C24.7311 33.9023 24.0979 33.9023 23.7074 34.2928L22.2932 35.707C21.9026 36.0975 21.9026 36.7307 22.2932 37.1212L28.586 43.4141C29.3671 44.1952 30.6334 44.1952 31.4145 43.4141L44.7074 30.1212Z"></path></svg>
															</i>}
														</div>
													</div>
												</div>
												<Link to="/@_chubedann" target="_blank" rel="noreferrer noopener" style={{display: 'block', textDecoration: 'none'}}>
													<div class="tiktok-13vugi3-DivBroadcastTitle e1fbe6io3">
														<h2 data-e2e="user-card-uid" class="tiktok-ukqwme-H2UniqueId e1fbe6io4">_chubedann</h2>
													</div>
													<h3 data-e2e="user-card-nickname" class="tiktok-1lcid4v-H3Nickname e1fbe6io5">Xuân Huy</h3>
												</Link>
												<div class="tiktok-1nw1o62-DivUserStat e1fbe6io6">
													<h2 class="tiktok-emfx9y-H2UserStatsText e1fbe6io7">16.6K</h2>
													<h2 class="tiktok-1womi7z-H2UserStatsDesc e1fbe6io8">Followers</h2>
													<h2 class="tiktok-emfx9y-H2UserStatsText e1fbe6io7">153K</h2>
													<h2 class="tiktok-1womi7z-H2UserStatsDesc e1fbe6io8">Likes</h2>
												</div>
											</div>
										</div>
									</div>
									<div class="tiktok-1sjtqu8-DivActionContainer e10bhxlw1">
										<i data-e2e="share-icon" class="tiktok-ml379w-IActionButton ex1fqd93">
											<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#PCShare_clip0)"><g opacity="1" filter="url(#PCShare_filter0_d)"><path fillRule="evenodd" clipRule="evenodd" d="M10.9376 3.17495C10.9376 2.58272 11.6469 2.27873 12.0758 2.68715L18.6021 8.90241C19.1764 9.44937 19.1564 10.3717 18.5588 10.8931L12.0541 16.5689C11.6184 16.9491 10.9376 16.6397 10.9376 16.0614V13.4894C10.9376 13.4894 3.95344 12.2312 1.7131 16.3434C1.50423 16.7268 0.690072 16.8609 0.855563 14.948C1.54761 11.4273 2.96196 5.93084 10.9376 5.93084V3.17495Z"></path></g><path opacity="0.03" fillRule="evenodd" clipRule="evenodd" d="M15.7538 6.21161L17.0486 8.80136C17.2777 9.25947 17.1677 9.81453 16.7812 10.1506L10.9824 15.193C10.9824 15.193 10.7017 16.5964 11.5437 16.5964C12.3857 16.5964 19.1218 10.4217 19.1218 10.4217C19.1218 10.4217 19.4025 9.57964 18.5605 8.73763C17.7185 7.89563 15.7538 6.21161 15.7538 6.21161Z"></path><path opacity="0.09" fillRule="evenodd" clipRule="evenodd" d="M10.9374 6.22983V13.5272C10.9374 13.5272 4.25359 12.5854 2.16026 15.7726C0.146021 18.8394 0.331011 12.3091 3.36331 9.05711C6.39561 5.8051 10.9374 6.22983 10.9374 6.22983Z" fill="url(#PCShare_paint0_radial)"></path></g><defs><filter id="PCShare_filter0_d" x="-0.166473" y="2.5" width="20.1867" height="16.2363" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="1"></feOffset><feGaussianBlur stdDeviation="0.5"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><radialGradient id="PCShare_paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.1827 18.2553) rotate(-113.046) scale(8.93256 8.78076)"><stop></stop><stop offset="0.995496" stopOpacity="0.01"></stop><stop offset="1" stopOpacity="0.01"></stop></radialGradient><clipPath id="PCShare_clip0"><rect width="20" height="20" fill="white"></rect></clipPath></defs></svg>
										</i>
										<i onMouseLeave={()=>setMylive({...mylive,show_action:false})} onMouseEnter={()=>setMylive({...mylive,show_action:true})} data-e2e="report-icon" class="tiktok-ml379w-IActionButton e10bhxlw2">
											<svg width="24" height="24" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4 24C4 21.7909 5.79086 20 8 20C10.2091 20 12 21.7909 12 24C12 26.2091 10.2091 28 8 28C5.79086 28 4 26.2091 4 24ZM20 24C20 21.7909 21.7909 20 24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28C21.7909 28 20 26.2091 20 24ZM36 24C36 21.7909 37.7909 20 40 20C42.2091 20 44 21.7909 44 24C44 26.2091 42.2091 28 40 28C37.7909 28 36 26.2091 36 24Z"></path></svg>
											{mylive.show_action?
											<div class="tiktok-i4r23e-DivContainer eth61t00" style={{padding: '8px 0px', zIndex: 99, right: '-2px'}}>
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 8" width="1em" height="1em" verticalPropKey="top" class="tiktok-7nv6e9-StyledTopArrow eth61t01" style={{right: '6px'}}><path d="M0 8c7 0 10-8 12-8s5 8 12 8z"></path></svg>
												<a data-e2e="report-button" class="tiktok-1i4rtt3-AShareLink ex1fqd90">
													<svg class="tiktok-qxlwh0-StyledFlag e10bhxlw5" width="26" height="26" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9 9.31286V27.0626C9.98685 26.7378 11.184 26.4042 12.5108 26.1585C16.1115 25.4917 21.0181 25.4123 25.1625 28.3726C28.0181 30.4123 31.6115 30.4917 34.7608 29.9085C36.306 29.6223 37.6602 29.1908 38.6289 28.8293C38.7603 28.7803 38.8841 28.7328 39 28.6872V10.9374C38.0131 11.2623 36.816 11.5959 35.4892 11.8416C31.8885 12.5084 26.9819 12.5878 22.8375 9.62751C19.9819 7.58781 16.3885 7.5084 13.2392 8.09161C11.694 8.37776 10.3398 8.80927 9.37105 9.17072C9.23971 9.21973 9.11586 9.2673 9 9.31286ZM40.1067 6.21064C40.7264 5.90123 41.4622 5.93453 42.0515 6.29874C42.6411 6.66315 43 7.30688 43 8.00004V30C43 30.7576 42.572 31.4501 41.8944 31.7889L41 30C41.8944 31.7889 41.8931 31.7895 41.8931 31.7895L41.8916 31.7903L41.8878 31.7922L41.8775 31.7973L41.846 31.8127C41.831 31.82 41.8128 31.8288 41.7915 31.839C41.7761 31.8464 41.7589 31.8545 41.7401 31.8634C41.651 31.9055 41.525 31.9637 41.3654 32.0343C41.0466 32.1753 40.5919 32.3663 40.0273 32.577C38.9023 32.9967 37.319 33.5027 35.4892 33.8416C31.8885 34.5084 26.9819 34.5878 22.8375 31.6275C19.9819 29.5878 16.3885 29.5084 13.2392 30.0916C11.694 30.3778 10.3398 30.8093 9.37105 31.1707C9.23971 31.2197 9.11586 31.2673 9 31.3129V44.0001C9 44.5524 8.55228 45.0001 8 45.0001H6C5.44772 45.0001 5 44.5524 5 44.0001V8.00004C5 7.24249 5.42801 6.54996 6.10558 6.21118L7 8.00004C6.10558 6.21118 6.10688 6.21053 6.10688 6.21053L6.10842 6.20976L6.11219 6.20789L6.12249 6.20279L6.15404 6.18734C6.17988 6.17477 6.21529 6.15773 6.25987 6.13667C6.34902 6.09457 6.47498 6.03636 6.63455 5.9658C6.95342 5.8248 7.4081 5.63378 7.9727 5.42311C9.09774 5.00332 10.681 4.49734 12.5108 4.15849C16.1115 3.49171 21.0181 3.4123 25.1625 6.37257C28.0181 8.41227 31.6115 8.49167 34.7608 7.90846C36.306 7.62231 37.6602 7.1908 38.6289 6.82935C39.1112 6.6494 39.4925 6.48886 39.7478 6.37595C39.8754 6.31956 39.9711 6.27523 40.0318 6.24653C40.0622 6.23219 40.0838 6.22177 40.0962 6.21572L40.1056 6.21118L40.1067 6.21064Z"></path></svg>
													<span class="tiktok-zztmrh-SpanShareText ex1fqd92">Report</span>
												</a>
												<a data-e2e="rank-button" class="tiktok-1i4rtt3-AShareLink ex1fqd90">
													<svg class="tiktok-27x1sl-StyledBubble e10bhxlw6" width="26" height="26" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M6.91717 11.5979C6.83233 11.5979 6.74952 11.6238 6.6798 11.6722L3.66019 13.7653C3.52203 13.861 3.33317 13.7622 3.33317 13.5941V4.64961C3.33317 4.41949 3.51972 4.23294 3.74984 4.23294H13.7498C13.98 4.23294 14.1665 4.41949 14.1665 4.64961V11.1813C14.1665 11.4114 13.98 11.5979 13.7498 11.5979H6.91717ZM14.1665 13.3309H7.2915L2.63819 16.5564C2.22285 16.8443 1.6665 16.5348 1.6665 16.0157V4.23294C1.6665 3.27586 2.4127 2.5 3.33317 2.5H14.1665C15.087 2.5 15.8332 3.27586 15.8332 4.23294V7.87476H17.2915C18.212 7.87476 18.9582 8.61559 18.9582 9.52945V17.2955C18.9582 17.7373 18.5063 18.0376 18.0949 17.8691L15.0356 16.1999H9.37484C8.45436 16.1999 7.70817 15.4591 7.70817 14.5452V13.3333H9.37484V14.1285C9.37484 14.3587 9.56139 14.5452 9.7915 14.5452L15.2461 14.5452C15.3243 14.5452 15.4009 14.5672 15.4671 14.6087L17.164 15.6705C17.2195 15.7053 17.2915 15.6654 17.2915 15.5999V9.94612C17.2915 9.716 17.105 9.52945 16.8748 9.52945H15.8332V11.5979C15.8332 12.555 15.087 13.3309 14.1665 13.3309Z"></path></svg>
													<span class="tiktok-zztmrh-SpanShareText ex1fqd92">Ranking settings</span>
												</a>
											</div>:''}
										</i>
										<div data-e2e="live-room-follow" style={{position: 'relative', zIndex: 2}}>
											{!mylive.following?
												<button onClick={(e)=>setfollow(e,true)} type="button" class="e6frb9d0 tiktok-10xeras-Button-StyledFollowButton ehk74z00">
													<span style={{padding: '7px 16px'}}>Follow</span>
												</button>:
												<i onClick={()=>showfollow()} class="tiktok-y2o5gk-IActionButton e6frb9d1">
													<svg width="20" height="20" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M13.0001 13C13.0001 9.68629 15.6864 7 19.0001 7C22.3139 7 25.0001 9.68629 25.0001 13C25.0001 16.3137 22.3139 19 19.0001 19C15.6864 19 13.0001 16.3137 13.0001 13ZM19.0001 3C13.4773 3 9.00015 7.47715 9.00015 13C9.00015 18.5228 13.4773 23 19.0001 23C24.523 23 29.0001 18.5228 29.0001 13C29.0001 7.47715 24.523 3 19.0001 3ZM5.19435 40.9681C6.70152 35.5144 10.0886 32.2352 13.9162 30.738C17.7125 29.2531 22.0358 29.4832 25.6064 31.2486C26.1015 31.4934 26.7131 31.338 26.9931 30.8619L28.0072 29.1381C28.2872 28.662 28.1294 28.0465 27.6384 27.7937C23.0156 25.4139 17.4034 25.0789 12.4591 27.0129C7.37426 29.0018 3.09339 33.3505 1.2883 40.0887C1.14539 40.6222 1.48573 41.1592 2.02454 41.2805L3.97575 41.7195C4.51457 41.8408 5.04724 41.5004 5.19435 40.9681ZM44.7074 30.1212C45.0979 29.7307 45.0979 29.0975 44.7074 28.707L43.2932 27.2928C42.9026 26.9023 42.2695 26.9023 41.8789 27.2928L30.0003 39.1715L25.1216 34.2928C24.7311 33.9023 24.0979 33.9023 23.7074 34.2928L22.2932 35.707C21.9026 36.0975 21.9026 36.7307 22.2932 37.1212L28.586 43.4141C29.3671 44.1952 30.6334 44.1952 31.4145 43.4141L44.7074 30.1212Z"></path></svg>
												</i>
											}
											{mylive.show_follow?
											<div class="css-16j7yay css-16j7yay-placement-bottomRight " style={{right: '-40px', top: '48px'}}>
												<div class="css-16j7yay-content">
													<div class="css-16j7yay-arrow"></div>
													<div class="css-16j7yay-inner" role="tooltip" style={{boxShadow: 'rgba(0, 0, 0, 0.12) 0px 2px 12px'}}>
														<div class="tiktok-dpc1yn-DivPopupContainer e6frb9d2">
															<p data-e2e="unfollow-title" class="tiktok-j2ij69-PText e6frb9d3">Unfollow {mylive.user.unselectable}?</p>
															<button onClick={()=>setMylive({...mylive,show_follow:false})} type="button" data-e2e="unfollow-goback" class="tiktok-1rizl25-Button ehk74z00" style={{width: '100%', marginBottom: '8px'}}>Go back</button>
															<button onClick={(e)=>setfollow(e,false)} type="button" data-e2e="unfollow-confirm" class="tiktok-1rizl25-Button ehk74z00" style={{width: '100%'}}>Unfollow</button>
														</div>
													</div>
												</div>
											</div>:''}
										</div>
										<i data-e2e="open-chat-button" class="tiktok-6byecg-IChatButton e10bhxlw4">
											<svg width="16" height="16" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M33.4132 39.1714L21.2417 26.9999L44.9991 26.9999C45.5514 26.9999 45.9991 26.5522 45.9991 25.9999V21.9999C45.9991 21.4476 45.5514 20.9999 44.9991 20.9999L21.2416 20.9999L33.4132 8.82825C33.8038 8.43773 33.8038 7.80456 33.4132 7.41404L30.5848 4.58562C30.1943 4.19509 29.5611 4.19509 29.1706 4.58562L11.8777 21.8785C10.7061 23.0501 10.7061 24.9496 11.8777 26.1211L29.1706 43.414C29.5611 43.8046 30.1943 43.8046 30.5848 43.414L33.4132 40.5856C33.8038 40.1951 33.8038 39.5619 33.4132 39.1714ZM6.99902 7.99978C6.99902 7.44749 6.55131 6.99978 5.99902 6.99978L1.99902 6.99978C1.44674 6.99978 0.999023 7.4475 0.999023 7.99978V39.9998C0.999023 40.5521 1.44674 40.9998 1.99902 40.9998H5.99902C6.55131 40.9998 6.99902 40.5521 6.99902 39.9998L6.99902 7.99978Z"></path></svg>
										</i>
									</div>
								</div>
								<div className="tiktok-14vlgvk-DivLiveContainer eoemvct0">
									<div class="tiktok-xltwnm-DivLivePlayerContainer e19tq4ft0" data-e2e="live-player" data-testid="live-player" role="video-container" style={{width: '100%', height: '100%'}}>
										
										<video class="" ref={refVideo} autoplay="" playsinline="true" x5-playsinline="true" webkit-playsinline="true" tabIndex="2" mediatype="video" src={state.src}></video>
										<xg-controls class="xgplayer-controls control_autohide" unselectable="on" onselectstart="return false" data-index="0">
										<xg-inner-controls class="xg-inner-controls xg-pos">
										<xg-left-grid class="xg-left-grid">
										</xg-left-grid>
										<xg-center-grid class="xg-center-grid">

										</xg-center-grid>
										<xg-right-grid class="xg-right-grid">
										</xg-right-grid>
										</xg-inner-controls>
										</xg-controls>
										
										<div data-e2e="live-player-fullscreen-top" data-testid="live-player-fullscreen-top" role="fullscreen-banner" class="tiktok-1uhmqok-DivLivePlayerHeader e19tq4ft3"></div>
										<div class="tiktok-x69pqf-StyledGiftTray eoemvct1" style={{position: 'relative'}}>
											{gifts.map((item,index)=>
											<div class="tiktok-extaee-DivSendGift e1rbz3bw0 tiktok-1k4dcd6 tiktok-14qt7ec" style={{position: 'absolute', top: `${index*56}px`}}>
												<div  class="tiktok-guvsz8-DivSendGiftBar item-center e1rbz3bw1">
													<div class="tiktok-1xfcxxd-DivSendGiftAvatar e1rbz3bw2">
														<img width="40" height='40' src={item.user.picture} style={{display: 'block', width: '40px', borderRadius: '50%'}}/>
													</div>
													<div class="tiktok-jweytv-DivSendGiftBarContent e1rbz3bw3">
													<div class="tiktok-1e2buzz-DivTitleGift e1rbz3bw9">{item.user.name}</div>
													<div class="tiktok-nom0kn-DivDescriptionGift e1rbz3bw10">Sent {item.gift.name}</div>
													</div>
													<div class="tiktok-r0qtcd-DivGiftBarIcon e1rbz3bw6">
														<img width="40" src={item.gift.image} style={{display: 'block', width: '40px'}}/>
													</div>
												</div>
												<div class="tiktok-1cqffhs-DivSendGiftCount item-center e1rbz3bw7">
													<span style={{fontSize: '24px'}}>x</span>
													<span class="tiktok-arje3t-SpanBullet e1rbz3bw11">{item.gift.coin}</span>
												</div>
											</div>
											)}	
										</div>
										
										<div class="tiktok-5gqkmn-DivBgContainer ezkd7x70" style={{position: 'absolute', top: '0px'}}>
											<div class="tiktok-1apwby8-DivLivePlayerImage ezkd7x71" style={{zIndex: 0}}>
												<div class="tiktok-1fxkm4b-DivLivePlayerImageContainer ezkd7x72">
													<img src="https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/8571f976bd53d55900e15ca717db9cf4~c5_720x720.webp?x-expires=1653616800&amp;x-signature=aipkh4LQagdsRJyoVKR0JUvSz8M%3D" class="tiktok-urm72h-ImgLivePlayerImage ezkd7x73"/>
												</div>
											</div>
											<div class="tiktok-y2fd0r-DivLivePlayerCurtain ezkd7x74" style={{zIndex: 0}}></div>
										</div>
										<div class="tiktok-110v49-DivLivePlayerFooter e19tq4ft4">
											<div data-e2e="control-bar-id" data-testid="control-bar-id" class="tiktok-10mxhjf-DivControlsContainer e1f853ml0">
												<div class="tiktok-f0jib0-DivInnerController-StyledLeftControlsGroup e1f853ml2">
													<div data-e2e="play-icon" data-testid="control-container" class="tiktok-1hlx3io-DivControlContainer e10xci3l1">
														<div data-e2e="control-tip" data-testid="control-tip" class="tiktok-17yn1j0-DivControlTip e10xci3l0">Pause</div>
														<div data-e2e="control-icon" data-testid="control-icon" class="tiktok-dhcein-DivControlIcon e10xci3l2">
															<svg width="18" height="18" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 6C8 5.44771 8.44772 5 9 5H17C17.5523 5 18 5.44772 18 6V42C18 42.5523 17.5523 43 17 43H9C8.44772 43 8 42.5523 8 42V6Z"></path><path d="M30 6C30 5.44771 30.4477 5 31 5H39C39.5523 5 40 5.44772 40 6V42C40 42.5523 39.5523 43 39 43H31C30.4477 43 30 42.5523 30 42V6Z"></path></svg>
														</div>
													</div>
												</div>
												<div class="tiktok-iqc0z2-DivInnerController-StyledRightControlsGroup e1f853ml4">
													<div data-e2e="volume-icon" data-testid="control-container" class="tiktok-1hlx3io-DivControlContainer e10xci3l1">
														<div data-e2e="volume-slider" data-testid="volume-slider" class="tiktok-1koofve-DivVolumeSlider e6f71pj0" style={{display: `none`}}>
															<div data-e2e="volume-bar-id" data-testid="volume-bar-id" class="tiktok-47p9us-DivVolumeBar e6f71pj1">
																<div class="tiktok-ihw2s6-DivDragBar e6f71pj2"></div>
																	<div class="tiktok-vqpkke-DivDot e6f71pj3"></div>
																</div>
															</div>
																<div data-e2e="volume-icon-id" data-testid="volume-icon-id" class="tiktok-dhcein-DivControlIcon e10xci3l2">
																		<span data-testid="volume-larger-id" style={{width: '18px', height: '18px'}}>
																			<svg width="18" height="18" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M20.3359 8.37236C22.3296 7.04325 25 8.47242 25 10.8685V37.1315C25 39.5276 22.3296 40.9567 20.3359 39.6276L10.3944 33H6C4.34314 33 3 31.6568 3 30V18C3 16.3431 4.34315 15 6 15H10.3944L20.3359 8.37236ZM21 12.737L12.1094 18.6641C11.7809 18.8831 11.3948 19 11 19H7V29H11C11.3948 29 11.7809 29.1169 12.1094 29.3359L21 35.263V12.737ZM32.9998 24C32.9998 21.5583 32.0293 19.3445 30.4479 17.7211C30.0625 17.3255 29.9964 16.6989 30.3472 16.2724L31.6177 14.7277C31.9685 14.3011 32.6017 14.2371 33.0001 14.6195C35.4628 16.9832 36.9998 20.3128 36.9998 24C36.9998 27.6872 35.4628 31.0168 33.0001 33.3805C32.6017 33.7629 31.9685 33.6989 31.6177 33.2724L30.3472 31.7277C29.9964 31.3011 30.0625 30.6745 30.4479 30.2789C32.0293 28.6556 32.9998 26.4418 32.9998 24ZM37.0144 11.05C36.6563 11.4705 36.7094 12.0995 37.1069 12.4829C40.1263 15.3951 42.0002 19.4778 42.0002 23.9999C42.0002 28.522 40.1263 32.6047 37.1069 35.5169C36.7094 35.9003 36.6563 36.5293 37.0144 36.9498L38.3109 38.4727C38.6689 38.8932 39.302 38.9456 39.7041 38.5671C43.5774 34.9219 46.0002 29.7429 46.0002 23.9999C46.0002 18.2569 43.5774 13.078 39.7041 9.43271C39.302 9.05421 38.6689 9.10664 38.3109 9.52716L37.0144 11.05Z"></path></svg>
																		</span>
																	</div>
																</div>
																<div data-e2e="fullscreen-icon" data-testid="control-container" class="tiktok-1hlx3io-DivControlContainer e10xci3l1"><div data-e2e="control-tip" data-testid="control-tip" class="tiktok-17yn1j0-DivControlTip e10xci3l0">Full screen</div><div data-e2e="control-icon" data-testid="control-icon" class="tiktok-dhcein-DivControlIcon e10xci3l2">
																	<svg width="15" height="15" viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M0 13V4C0 1.79086 1.79086 0 4 0H13C13.5523 0 14 0.447715 14 1V3C14 3.55228 13.5523 4 13 4H5C4.44772 4 4 4.44772 4 5V13C4 13.5523 3.55228 14 3 14H1C0.447715 14 0 13.5523 0 13ZM36 13V4C36 1.79086 34.2091 0 32 0H23C22.4477 0 22 0.447715 22 1V3C22 3.55228 22.4477 4 23 4H31C31.5523 4 32 4.44772 32 5V13C32 13.5523 32.4477 14 33 14H35C35.5523 14 36 13.5523 36 13ZM36 32V23C36 22.4477 35.5523 22 35 22H33C32.4477 22 32 22.4477 32 23V31C32 31.5523 31.5523 32 31 32H23C22.4477 32 22 32.4477 22 33V35C22 35.5523 22.4477 36 23 36H32C34.2091 36 36 34.2091 36 32ZM0 23V32C0 34.2091 1.79086 36 4 36H13C13.5523 36 14 35.5523 14 35V33C14 32.4477 13.5523 32 13 32H5C4.44772 32 4 31.5523 4 31V23C4 22.4477 3.55228 22 3 22H1C0.447715 22 0 22.4477 0 23Z" fill-opacity="0.9"></path></svg>
																</div>
															</div>
															<div data-e2e="pip-icon" data-testid="control-container" class="tiktok-1hlx3io-DivControlContainer e10xci3l1">
																<div data-e2e="control-tip" data-testid="control-tip" class="tiktok-17yn1j0-DivControlTip e10xci3l0">Picture-in-picture</div>
																<div data-e2e="control-icon" data-testid="control-icon" class="tiktok-dhcein-DivControlIcon e10xci3l2">
																	<svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M3.33333 14.9998L10.5 14.9998V12.8338C10.5 12.3736 10.8731 12.0005 11.3333 12.0005H16.25L16.25 4.99984C16.25 4.76972 16.0635 4.58317 15.8333 4.58317L6.25 4.58317C6.01988 4.58317 5.83333 4.39662 5.83333 4.1665V3.33317C5.83333 3.10305 6.01988 2.9165 6.25 2.9165L15.8333 2.91651C16.9839 2.91651 17.9167 3.84925 17.9167 4.99984L17.9167 12.0005C18.3769 12.0005 18.75 12.3736 18.75 12.8338V17.4998C18.75 17.9601 18.3769 18.3332 17.9167 18.3332H11.3333C10.8731 18.3332 10.5 17.9601 10.5 17.4998V16.6665L3.33333 16.6665C2.18274 16.6665 1.25 15.7338 1.25 14.5832V7.91651C1.25 7.68639 1.43655 7.49984 1.66667 7.49984L2.5 7.49984C2.73012 7.49984 2.91667 7.68639 2.91667 7.91651L2.91667 14.5832C2.91667 14.8133 3.10322 14.9998 3.33333 14.9998ZM9.11621 11.1994C9.33195 11.1994 9.50939 11.0354 9.53073 10.8253C9.53215 10.8113 9.53288 10.7971 9.53288 10.7827V9.53272V6.61605C9.53288 6.38593 9.34633 6.19938 9.11621 6.19938H8.28288C8.05276 6.19938 7.86621 6.38593 7.86621 6.61605L7.86621 8.3543L3.55647 4.04456C3.39375 3.88184 3.12994 3.88184 2.96722 4.04456L2.37796 4.63381C2.21524 4.79653 2.21524 5.06035 2.37796 5.22307L6.68761 9.53272H4.94954C4.71943 9.53272 4.53288 9.71926 4.53288 9.94938L4.53288 10.7827C4.53288 11.0128 4.71943 11.1994 4.94954 11.1994H7.86621H9.11621Z"></path></svg>
																</div>
															</div>
															<div data-e2e="rotate-icon" data-testid="control-container" class="tiktok-1hlx3io-DivControlContainer e10xci3l1"><div data-e2e="control-tip" data-testid="control-tip" class="tiktok-17yn1j0-DivControlTip e10xci3l0">Orientation</div><div data-e2e="control-icon" data-testid="control-icon" class="tiktok-dhcein-DivControlIcon e10xci3l2"><svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12.7941 2.55055L12.0113 3.33333H14.9995C17.3007 3.33333 19.1661 5.19881 19.1661 7.5V12.0833C19.1661 12.3135 18.9796 12.5 18.7495 12.5H17.9161C17.686 12.5 17.4995 12.3135 17.4995 12.0833V7.5C17.4995 6.11929 16.3802 5 14.9995 5H9.49651C8.9397 5 8.66084 4.32679 9.05457 3.93306L11.6156 1.37204C11.7783 1.20932 12.0421 1.20932 12.2048 1.37204L12.7941 1.96129C12.9568 2.12401 12.9568 2.38783 12.7941 2.55055ZM3.15241 6.24994C2.3315 6.24994 1.66602 6.91542 1.66602 7.73633V16.0135C1.66602 16.8345 2.3315 17.4999 3.15241 17.4999H14.763C15.5839 17.4999 16.2493 16.8345 16.2493 16.0135V7.73633C16.2493 6.91542 15.5839 6.24994 14.763 6.24994H3.15241ZM3.33268 15.8333V7.9166H14.5827V15.8333H3.33268Z"></path></svg>
														</div>
													</div>
													<div data-e2e="theater-icon" data-testid="control-container" class="tiktok-1hlx3io-DivControlContainer e10xci3l1">
														<div data-e2e="control-tip" data-testid="control-tip" class="tiktok-17yn1j0-DivControlTip e10xci3l0">Theater mode</div>
														<div data-e2e="control-icon" data-testid="control-icon" class="tiktok-dhcein-DivControlIcon e10xci3l2">
															<svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M1.66667 3.33332C1.66667 2.41285 2.41286 1.66666 3.33334 1.66666H16.6667C17.5872 1.66666 18.3333 2.41286 18.3333 3.33332V14.0691C18.3333 14.4248 18.1076 14.7412 17.7714 14.857C17.4351 14.9728 17.0624 14.8625 16.8434 14.5823L13.1102 9.80579C12.096 10.302 11.0573 10.5618 10 10.5618C8.9427 10.5618 7.90402 10.302 6.88977 9.80579L3.15659 14.5823C2.93758 14.8625 2.56488 14.9728 2.22863 14.857C1.89237 14.7412 1.66667 14.4248 1.66667 14.0691V3.33332ZM16.6667 3.33332L3.33334 3.33332V11.6496L6.01009 8.22483C6.26834 7.89441 6.7319 7.80737 7.09241 8.02162C8.09603 8.61807 9.06172 8.89516 10 8.89516C10.9383 8.89516 11.904 8.61807 12.9076 8.02162C13.2681 7.80737 13.7317 7.89441 13.9899 8.22483L16.6667 11.6496L16.6667 3.33332Z" fill="white"></path><path fillRule="evenodd" clipRule="evenodd" d="M1.66667 17.0833C1.66667 16.8532 1.85322 16.6667 2.08334 16.6667H17.9167C18.1468 16.6667 18.3333 16.8532 18.3333 17.0833V17.9167C18.3333 18.1468 18.1468 18.3333 17.9167 18.3333H2.08334C1.85322 18.3333 1.66667 18.1468 1.66667 17.9167V17.0833Z" fill="white"></path></svg>
														</div>
													</div>
												</div>
												<div class="tiktok-1mrgobz-DivMuteButton e1vkemu40" style={{display: 'none', width: '0px'}}>Click to unmute</div>
											</div>
										</div>
										<xg-bar class="xg-top-bar" data-index="-1"></xg-bar>
										<xg-bar class="xg-left-bar" data-index="-1"></xg-bar>
										<xg-bar class="xg-right-bar" data-index="-1"></xg-bar>
									</div>
								</div>
								<div className="tiktok-1degn1u-DivGiftRelatedContainer ewfljic0">
									<div className="tiktok-1rmnb0m-DivGiftListContainer ewfljic8">
										<div className="tiktok-1hftkbs-DivGiftWrapper e1wrljui0">
											<div onClick={(e)=>setleftgift(e)} class="tiktok-44y5gb-DivGiftArrow e1wrljui1" style={{visibility: `${disable.left?'hidden':'visible'}`}}>
												<svg width="20" height="20" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{transform: 'rotateY(180deg)'}}><path fillRule="evenodd" clipRule="evenodd" d="M34.4142 22.5858L18.1213 6.29289C17.7308 5.90237 17.0976 5.90237 16.7071 6.29289L15.2929 7.70711C14.9024 8.09763 14.9024 8.7308 15.2929 9.12132L30.1716 24L15.2929 38.8787C14.9024 39.2692 14.9024 39.9024 15.2929 40.2929L16.7071 41.7071C17.0976 42.0976 17.7308 42.0976 18.1213 41.7071L34.4142 25.4142C35.1953 24.6332 35.1953 23.3668 34.4142 22.5858Z"></path></svg>
											</div>
											<div style={{padding:'0 5px'}} className="tiktok-zinzs6-DivGiftContainer e1wrljui2">
												<div className="tiktok-s5ksva-DivGiftWrapHidden e1wrljui3">
													<div ref={giftcontent} className="tiktok-ma2550-DivGiftWrap e1wrljui4" style={{transform:`translateX(${state.translateX}px)`, direction: 'ltr'}}>
														{listgift.map((item,index)=>
														<div ref={giftchild} key={index} data-e2e="gift-item" class="tiktok-19qvrw-DivGiftItem e1wrljui5">
															<img className="tiktok-dhzs53-StyledBasicImage e1wrljui6" src={item.image} style={{display: 'block'}}/>
															<div class="tiktok-1e0ghre-DivGiftDes e1wrljui7">
																<div class="tiktok-1izylzy-DivGiftName e1wrljui8">{item.name}</div>
																<div class="tiktok-1po6rnj-DivGiftCoins e1wrljui9">{item.coin} Coin</div>
															</div>
															<button onClick={(e)=>sendcoin(e,item)} type="button" class="e1wrljui10 tiktok-r2wzaa-Button-StyledGiftSend ehk74z00">Send</button>
														</div>
														)}
													</div>
												</div>
											</div>
											<div onClick={(e)=>setrightgift(e)} class="tiktok-44y5gb-DivGiftArrow e1wrljui1" style={{visibility: `${disable.right?'hidden':'visible'}`}}>
												<svg width="20" height="20" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M34.4142 22.5858L18.1213 6.29289C17.7308 5.90237 17.0976 5.90237 16.7071 6.29289L15.2929 7.70711C14.9024 8.09763 14.9024 8.7308 15.2929 9.12132L30.1716 24L15.2929 38.8787C14.9024 39.2692 14.9024 39.9024 15.2929 40.2929L16.7071 41.7071C17.0976 42.0976 17.7308 42.0976 18.1213 41.7071L34.4142 25.4142C35.1953 24.6332 35.1953 23.3668 34.4142 22.5858Z"></path></svg>
											</div>
										</div>
									</div>
									<div class="tiktok-1054hz8-DivCoinContainer ehpngjr0">
										<div>Coin Balance:</div>
										<div class="tiktok-x14zv4-DivCoinNum ehpngjr1">0</div>
										<svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '28px'}}><circle cx="24" cy="24" r="22" fill="#FFEC9B"></circle><circle cx="24" cy="24" r="17" fill="#FACE15"></circle><path fill-rule="evenodd" clip-rule="evenodd" d="M40.9347 25.5C40.9779 25.0058 41 24.5055 41 24C41 14.6112 33.3888 7 24 7C14.6112 7 7 14.6112 7 24C7 24.5055 7.02206 25.0058 7.06527 25.5C7.82466 16.8137 15.1166 10 24 10C32.8834 10 40.1753 16.8137 40.9347 25.5Z" fill="#FABC15"></path><path d="M33 19C30.2041 19 27.9375 16.7614 27.9375 14H24.5625V27.6111C24.5625 29.2986 23.1774 30.6667 21.4688 30.6667C19.7601 30.6667 18.375 29.2986 18.375 27.6111C18.375 25.9236 19.7601 24.5556 21.4688 24.5556C21.722 24.5556 21.9659 24.5853 22.1981 24.6406C22.2365 24.6497 22.2747 24.6596 22.3125 24.6701V21.2763C22.0358 21.2406 21.7541 21.2222 21.4688 21.2222C17.8962 21.2222 15 24.0826 15 27.6111C15 31.1396 17.8962 34 21.4688 34C25.0413 34 27.9375 31.1396 27.9375 27.6111V20.6673C29.3477 21.7134 31.1005 22.3333 33 22.3333V19Z" fill="#FEF5CD"></path></svg>
										<button type="button" class="tiktok-230my5-Button ehk74z00" style={{lineHeight: '16px'}}>Get Coins</button>
									</div>
								</div>
							</div>
							<StreamList
							name={name}
							/>
						</div>
						<Chat
							messages={messages}	
							setmessages={data=>setmessages(data)}
							setmessage={(e,item,name,value)=>setmessage(e,item,name,value)}
							thread={thread}
							mylive={mylive}
							gifts={gifts}
							join={join}
							socket={socket}
							setlistgif={data=>setlistgif(data)}
							topgivecoin={topgift}
							messagesEndRef={messagesEndRef}
							setthread={data=>setthread(data)}
							settopgivecoin={data=>settopgivecoin(data)}
							
						/>
					</div>:''}
				</div>
			</div>
		</div>
	)
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,notify:state.notify
});
export default connect(mapStateToProps)(Livestream);
