import React, {useState,useEffect,useRef} from 'react'
import {Link,useNavigate,useParams} from 'react-router-dom'
import {connect} from 'react-redux'
import axios from 'axios'
import { listcategoriesURL,api,actionMessageURL } from '../urls'
import { headers } from '../actions/auth'
import io from "socket.io-client"
import EmojiPicker from "../hocs/EmojiPicker"
const Chat = (props) => {
    const {user,notify,setmessages,gifts,setlistgif,messages,settopgivecoin,socket,
        messagesEndRef,join,setmessage,
        thread,setthread,mylive,topgivecoin}=props
    const [loading, setLoading] = useState(false)
    const [state,setState]=useState({message:''})
    const {name} =useParams()
   
   
    const [showemoji,setShowemoji]=useState(false)
   
    
	
    console.log(topgivecoin)
    console.log(messages)
    useEffect(
		() => {
			if(user!=null){
			let form=new FormData()
			form.append('action','enter')
			axios.post(`${api}/v2/${name}/live`,form,headers)
			.then(res=>{
				const data={stream_id:name,user:user,views:res.data.views,join:true}
				socket.emit("sendData", data)
			})
		}
	},[ user ])
		
	useEffect(()=>{
		window.addEventListener("beforeunload", onUnload);
	},[])

    const onUnload=(e)=>{
        alert('grrr')
        let form=new FormData()
        form.append('action','leave')
        axios.post(`${api}/v2/${name}/live`,form,headers)
        .then(res=>{
            const data={stream_id:name,user:user,views:res.data.views,join:false}
            socket.emit("sendData", data)
        })
    }
	const onMessageSubmit = (e) => {
        (async ()=>{
            try{
                
                e.preventDefault()
                let form=new FormData()
                form.append('message',state.message)
                const res =await axios.post(`${api}/v2/${name}/live/messages`,form,headers)
                const data={stream_id:name,user:user,message:state.message,id:res.data.id,show_action:false}
                socket.emit("sendData", data)
                setState({ ...state,message: ""})
            }
            catch{

            }
        })()
	}
    const setaddkey=(e,value)=>{
        setState({...state,message:state.message+value})
    }
    
   ///send socket
   const setshowemoji=(value)=>{
    setShowemoji(value)
    }
    
    const reportmessage=(e,message)=>{
        (async ()=>{
            try{
                let form =new FormData()
                form.append('reason','resson')
                const res =await axios.post(`${actionMessageURL}/${message.id}`,form,headers)
                setmessage(e,message,'show_action',false)
            }
            catch{

            }
        })()
    }
    const deletemessage=(e,message)=>{
        (async ()=>{
            try{
                const res =await axios.post(`${actionMessageURL}/${message.id}`,{},headers)
                const list_message=messages.filter(item=>item.id!=message.id)
                setmessages(list_message)
            }
            catch{
            }
        })()
    }
    return (
        <div className="tiktok-rgjkd1-DivChatRoom e14c6d573">
            <div className="tiktok-13usuj4-DivChatRoomContainer ex6o5342">
                <div className="tiktok-n39qfc-DivChatRoomHeader ex6o5343">
                    <div data-e2e="chat-close-button" className="tiktok-1dnj95g-DivChatRoomHeaderIconContainer ex6o53410">
                        <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12.001 26.9998H35.7584L23.5867 39.1714C23.1962 39.5619 23.1962 40.1951 23.5867 40.5856L26.4151 43.414C26.8057 43.8046 27.4388 43.8046 27.8294 43.414L45.1223 26.1212C46.2938 24.9496 46.2938 23.0501 45.1223 21.8785L27.8294 4.58562C27.4388 4.19509 26.8057 4.19509 26.4151 4.58562L23.5867 7.41404C23.1962 7.80457 23.1962 8.43773 23.5867 8.82826L35.7582 20.9998H12.001C11.4487 20.9998 11.001 21.4475 11.001 21.9998V25.9998C11.001 26.552 11.4487 26.9998 12.001 26.9998ZM8.00098 7.99976C8.00098 7.44747 7.55326 6.99976 7.00098 6.99976L3.00098 6.99976C2.44869 6.99976 2.00098 7.44747 2.00098 7.99976V39.9998C2.00098 40.552 2.44869 40.9998 3.00098 40.9998H7.00098C7.55326 40.9998 8.00098 40.552 8.00098 39.9998L8.00098 7.99976Z"></path></svg>
                        
                    </div>
                    <div className="tiktok-yiy2y4-DivChatTitle ex6o5341">LIVE chat</div>
                </div>
                <div className="tiktok-rykcaj-DivChatRoomBody ex6o5344">  
                    {topgivecoin.length>0?
                    <div className="tiktok-xxjv3m-DivTopViewersContainer e147i2y90">
                        <div className="tiktok-14yzrfu-DivBubbleVisibleContainer e147i2y91">
                            <div data-e2e="top-givers" className="tiktok-1nexxoz-DivTopGivers e8wpgj80">
                                <div data-e2e="top-givers-header" className="tiktok-12r1n97-DivTopGiversHeader e8wpgj81">
                                    <span className="tiktok-1v52uvu-SpanTopGiversTitle e8wpgj82">Top viewers</span>
                                    <span className="tiktok-t91z16-SpanChevronRightContainer e8wpgj83">
                                        <svg className="tiktok-1bd8h0k-StyledChevronRight e8wpgj84" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M34.4142 22.5858L18.1213 6.29289C17.7308 5.90237 17.0976 5.90237 16.7071 6.29289L15.2929 7.70711C14.9024 8.09763 14.9024 8.7308 15.2929 9.12132L30.1716 24L15.2929 38.8787C14.9024 39.2692 14.9024 39.9024 15.2929 40.2929L16.7071 41.7071C17.0976 42.0976 17.7308 42.0976 18.1213 41.7071L34.4142 25.4142C35.1953 24.6332 35.1953 23.3668 34.4142 22.5858Z"></path></svg>
                                    </span>
                                </div>
                                <div className="tiktok-ru2fv9-DivTopGiversContainer e8wpgj85">
                                    <div className="tiktok-gazhzv-DivFirstGiverBox e8wpgj86">
                                        <div className="tiktok-d9auq1-DivUserCardClickWrapperProps e1s7ldwo0">
                                            <div data-e2e="top-giver" className="tiktok-1fr4v3k-DivTopGiverContainer e8wpgj88">
                                                <div className="tiktok-1oqul19-DivTopGiverIndex e8wpgj818">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 35 45" width="1em" height="1em" className="tiktok-1caiegc-StyledOneIcon e8wpgj819"><path fill="url(#one_svg__paint0_linear_862_7115)" d="M4.354 6.538c9.077-.452 11.346-3.58 11.943-5.086h9.255v42.953h-9.42v-31.65c-3.584 1.413-7.3 1.978-11.778 1.978V6.538z"></path><mask id="one_svg__a" width="22" height="44" x="4" y="1" maskUnits="userSpaceOnUse" style={{maskType: 'alpha'}}><path fill="url(#one_svg__paint1_linear_862_7115)" d="M4.354 6.193c9.077-.475 11.346-3.156 11.943-4.741h9.255v43.033h-9.42V12.608c-3.584 1.487-7.3 2.206-11.778 2.206v-8.62z"></path></mask><g mask="url(#one_svg__a)"><path fill="url(#one_svg__paint2_linear_862_7115)" d="M15.524 30.278L25.197 9.71l9.543 38.452-16.907 2.084-2.309-19.967z"></path><path fill="url(#one_svg__paint3_linear_862_7115)" d="M21.044 10.121c-1.902 1.346-4.162 2.15-5.053 2.523-1.09 3.083-3.27 9.698-3.27 10.37 0 .673 8.521-.28 12.782-.84l1.19-16.818c-1.784 1.682-3.746 3.42-5.649 4.765z" opacity="0.7"></path></g><defs><linearGradient id="one_svg__paint0_linear_862_7115" x1="14.953" x2="33.92" y1="-1.338" y2="57.793" gradientUnits="userSpaceOnUse"><stop stopColor="#FCF4D6"></stop><stop offset="0.469" stopColor="#F2CC83"></stop><stop offset="1" stopColor="#EEB865"></stop></linearGradient><linearGradient id="one_svg__paint1_linear_862_7115" x1="19.619" x2="-4.285" y1="71.984" y2="23.662" gradientUnits="userSpaceOnUse"><stop stopColor="#FF88C1"></stop><stop offset="1" stopColor="white"></stop></linearGradient><linearGradient id="one_svg__paint2_linear_862_7115" x1="20.649" x2="27.028" y1="20.112" y2="38.381" gradientUnits="userSpaceOnUse"><stop stopColor="#FBE0AE"></stop><stop offset="1" stopColor="#F6DBA8" stopOpacity="0"></stop></linearGradient><linearGradient id="one_svg__paint3_linear_862_7115" x1="16.288" x2="19.865" y1="12.364" y2="14.865" gradientUnits="userSpaceOnUse"><stop stopColor="#DFA874"></stop><stop offset="1" stopColor="#F4D7A2" stopOpacity="0"></stop></linearGradient></defs></svg>
                                                </div>
                                                <div className="tiktok-8lmm4f-DivTopGiverInfo e8wpgj89">
                                                    <img src={topgivecoin[0].giver.picture} className="tiktok-ok2yb0-StyledTopGiverAvatar e8wpgj810" style={{display: 'block'}}/>
                                                    <div className="tiktok-1j8gptq-DivProfileInfo e8wpgj812">
                                                        <h3 className="tiktok-dwme18-H3UniqueId e8wpgj813">{topgivecoin[0].giver.name}</h3>
                                                        <div className="tiktok-167v8sd-DivCoinContainer e8wpgj814">
                                                            <span className="tiktok-qzuo1u-SpanCoinIconContainer e8wpgj815">
                                                                <svg className="tiktok-1iepht-StyledCoinIcon e8wpgj816" width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="#FFEC9B"></circle><circle cx="24" cy="24" r="17" fill="#FACE15"></circle><path fillRule="evenodd" clipRule="evenodd" d="M40.9347 25.5C40.9779 25.0058 41 24.5055 41 24C41 14.6112 33.3888 7 24 7C14.6112 7 7 14.6112 7 24C7 24.5055 7.02206 25.0058 7.06527 25.5C7.82466 16.8137 15.1166 10 24 10C32.8834 10 40.1753 16.8137 40.9347 25.5Z" fill="#FABC15"></path><path d="M33 19C30.2041 19 27.9375 16.7614 27.9375 14H24.5625V27.6111C24.5625 29.2986 23.1774 30.6667 21.4688 30.6667C19.7601 30.6667 18.375 29.2986 18.375 27.6111C18.375 25.9236 19.7601 24.5556 21.4688 24.5556C21.722 24.5556 21.9659 24.5853 22.1981 24.6406C22.2365 24.6497 22.2747 24.6596 22.3125 24.6701V21.2763C22.0358 21.2406 21.7541 21.2222 21.4688 21.2222C17.8962 21.2222 15 24.0826 15 27.6111C15 31.1396 17.8962 34 21.4688 34C25.0413 34 27.9375 31.1396 27.9375 27.6111V20.6673C29.3477 21.7134 31.1005 22.3333 33 22.3333V19Z" fill="#FEF5CD"></path></svg>
                                                            </span>
                                                            <span className="tiktok-r16tl-SpanCoinNum e8wpgj817">{topgivecoin[0].coins}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {topgivecoin.length>1?
                                    <div className="tiktok-f3jw42-DivRestGiversBox e8wpgj87">
                                        {topgivecoin.filter((item,index)=>index>0).map(item=>
                                        <div data-e2e="top-giver" className="tiktok-1fr4v3k-DivTopGiverContainer e8wpgj88">
                                            <div className="tiktok-d9auq1-DivUserCardClickWrapperProps e1s7ldwo0">
                                                <div className="tiktok-1fr4v3k-DivTopGiverContainer e8wpgj88">
                                                    <div className="tiktok-1t05gm5-DivTopGiverIndex e8wpgj818">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 26" width="1em" height="1em" className="tiktok-oh8qpl-StyledTwoIcon e8wpgj820"><path fill="url(#two_svg__paint0_linear_862_7123)" d="M.56 9.91h4.763c0-.653.058-1.307.175-1.96.14-.678.362-1.285.665-1.822.304-.56.7-1.003 1.191-1.33.514-.35 1.132-.526 1.856-.526 1.074 0 1.95.339 2.627 1.016.7.654 1.05 1.576 1.05 2.766 0 .748-.175 1.413-.525 1.997a6.25 6.25 0 01-1.26 1.575c-.491.467-1.04.9-1.647 1.296a36.55 36.55 0 00-1.716 1.12 129.71 129.71 0 00-3.011 2.137c-.934.7-1.751 1.47-2.452 2.311a9.94 9.94 0 00-1.68 2.802C.197 22.342 0 23.58 0 25.004h18V20.73H6.409a11.096 11.096 0 012.1-2.206c.794-.63 1.612-1.214 2.452-1.75.84-.561 1.67-1.121 2.486-1.682.84-.56 1.588-1.179 2.242-1.856a8.628 8.628 0 001.576-2.381c.396-.887.595-1.95.595-3.187 0-1.19-.233-2.264-.7-3.222a6.96 6.96 0 00-1.822-2.416A8.218 8.218 0 0012.643.525 9.605 9.605 0 009.455 0c-1.47 0-2.778.257-3.922.77a7.4 7.4 0 00-2.801 2.102c-.748.887-1.308 1.937-1.681 3.151C.677 7.214.514 8.51.56 9.911z"></path><mask id="two_svg__a" width="18" height="26" x="0" y="0" maskUnits="userSpaceOnUse" style={{maskType: 'alpha'}}><path fill="url(#two_svg__paint1_linear_862_7123)" d="M.56 9.91h4.763c0-.653.058-1.307.175-1.96.14-.678.362-1.285.665-1.822.304-.56.7-1.003 1.191-1.33.514-.35 1.132-.526 1.856-.526 1.074 0 1.95.339 2.627 1.016.7.654 1.05 1.576 1.05 2.766 0 .748-.175 1.413-.525 1.997a6.25 6.25 0 01-1.26 1.575c-.491.467-1.04.9-1.647 1.296a36.55 36.55 0 00-1.716 1.12 129.71 129.71 0 00-3.011 2.137c-.934.7-1.751 1.47-2.452 2.311a9.94 9.94 0 00-1.68 2.802C.197 22.342 0 23.58 0 25.004h18V20.73H6.409a11.096 11.096 0 012.1-2.206c.794-.63 1.612-1.214 2.452-1.75.84-.561 1.67-1.121 2.486-1.682.84-.56 1.588-1.179 2.242-1.856a8.628 8.628 0 001.576-2.381c.396-.887.595-1.95.595-3.187 0-1.19-.233-2.264-.7-3.222a6.96 6.96 0 00-1.822-2.416A8.218 8.218 0 0012.643.525 9.605 9.605 0 009.455 0c-1.47 0-2.778.257-3.922.77a7.4 7.4 0 00-2.801 2.102c-.748.887-1.308 1.937-1.681 3.151C.677 7.214.514 8.51.56 9.911z"></path></mask><g mask="url(#two_svg__a)"><path fill="url(#two_svg__paint2_linear_862_7123)" d="M-6.74 19.355l19.235-9.464-5.84 10.27-1.447 10.862L-6.74 19.355z" opacity="0.7"></path><path fill="url(#two_svg__paint3_linear_862_7123)" d="M4.94 23.16c0-.736 1.597-2.64 2.211-3.317l4.977.185c-2.396 1.351-7.189 3.87-7.189 3.133z"></path></g><defs><linearGradient id="two_svg__paint0_linear_862_7123" x1="2.912" x2="10.469" y1="1.596" y2="25.004" gradientUnits="userSpaceOnUse"><stop stopColor="#EDF3F4"></stop><stop offset="1" stopColor="#C6CED6"></stop></linearGradient><linearGradient id="two_svg__paint1_linear_862_7123" x1="2.912" x2="10.469" y1="1.596" y2="25.004" gradientUnits="userSpaceOnUse"><stop stopColor="#ECEFF1"></stop><stop offset="1" stopColor="#BDC5CC"></stop></linearGradient><linearGradient id="two_svg__paint2_linear_862_7123" x1="11.086" x2="7.058" y1="11.904" y2="18.55" gradientUnits="userSpaceOnUse"><stop stopColor="#F6F9FB"></stop><stop offset="1" stopColor="#CAD5DF"></stop></linearGradient><linearGradient id="two_svg__paint3_linear_862_7123" x1="6.414" x2="7.151" y1="20.581" y2="22.239" gradientUnits="userSpaceOnUse"><stop stopColor="#B6C7D7"></stop><stop offset="1" stopColor="#9EB8CE" stopOpacity="0"></stop></linearGradient></defs></svg>
                                                    </div>
                                                    <div className="tiktok-rwrisd-DivTopGiverInfo e8wpgj89">
                                                        <img src={item.giver.picture} className="tiktok-1mf5oas-StyledTopGiverAvatar e8wpgj810" style={{display: 'block'}}/>
                                                        <div className="tiktok-d1121y-DivProfileInfo e8wpgj812">
                                                        <h3 className="tiktok-dwme18-H3UniqueId e8wpgj813">{item.giver.name}</h3>
                                                            <div className="tiktok-167v8sd-DivCoinContainer e8wpgj814">
                                                                <span className="tiktok-qzuo1u-SpanCoinIconContainer e8wpgj815">
                                                                    <svg className="tiktok-1iepht-StyledCoinIcon e8wpgj816" width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="#FFEC9B"></circle><circle cx="24" cy="24" r="17" fill="#FACE15"></circle><path fillRule="evenodd" clipRule="evenodd" d="M40.9347 25.5C40.9779 25.0058 41 24.5055 41 24C41 14.6112 33.3888 7 24 7C14.6112 7 7 14.6112 7 24C7 24.5055 7.02206 25.0058 7.06527 25.5C7.82466 16.8137 15.1166 10 24 10C32.8834 10 40.1753 16.8137 40.9347 25.5Z" fill="#FABC15"></path><path d="M33 19C30.2041 19 27.9375 16.7614 27.9375 14H24.5625V27.6111C24.5625 29.2986 23.1774 30.6667 21.4688 30.6667C19.7601 30.6667 18.375 29.2986 18.375 27.6111C18.375 25.9236 19.7601 24.5556 21.4688 24.5556C21.722 24.5556 21.9659 24.5853 22.1981 24.6406C22.2365 24.6497 22.2747 24.6596 22.3125 24.6701V21.2763C22.0358 21.2406 21.7541 21.2222 21.4688 21.2222C17.8962 21.2222 15 24.0826 15 27.6111C15 31.1396 17.8962 34 21.4688 34C25.0413 34 27.9375 31.1396 27.9375 27.6111V20.6673C29.3477 21.7134 31.1005 22.3333 33 22.3333V19Z" fill="#FEF5CD"></path></svg>
                                                                </span>
                                                                <span className="tiktok-r16tl-SpanCoinNum e8wpgj817">{item.coins}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        )}
                                    </div>:''}
                                </div>
                            </div>
                        </div>
                        <div className="tiktok-1h0brph-DivListVisibleContainer e147i2y92">
                            <div className="tiktok-19ft7em-DivTopViewersListContainer eux3x8p0">
                                <div className="tiktok-1d7xc7x-DivTopViewersListHeader eux3x8p1">
                                    <div data-e2e="top-viewers-list-close" className="tiktok-1gzczx1-DivTopViewersHeaderIconContainer eux3x8p3">
                                        <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.1718 23.9999L10.2931 13.1212C9.90261 12.7307 9.90261 12.0975 10.2931 11.707L11.7074 10.2928C12.0979 9.90228 12.731 9.90228 13.1216 10.2928L24.0002 21.1715L34.8789 10.2928C35.2694 9.90228 35.9026 9.90228 36.2931 10.2928L37.7073 11.707C38.0979 12.0975 38.0979 12.7307 37.7073 13.1212L26.8287 23.9999L37.7073 34.8786C38.0979 35.2691 38.0979 35.9023 37.7073 36.2928L36.2931 37.707C35.9026 38.0975 35.2694 38.0975 34.8789 37.707L24.0002 26.8283L13.1216 37.707C12.731 38.0975 12.0979 38.0975 11.7074 37.707L10.2931 36.2928C9.90261 35.9023 9.90261 35.2691 10.2931 34.8786L21.1718 23.9999Z"></path></svg></div><div className="tiktok-18v948p-DivTopViewersTitle eux3x8p2">Top viewers</div><div data-e2e="top-viewers-faq-icon" className="tiktok-1gzczx1-DivTopViewersHeaderIconContainer eux3x8p3"><svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6ZM2 24C2 11.8497 11.8497 2 24 2C36.1503 2 46 11.8497 46 24C46 36.1503 36.1503 46 24 46C11.8497 46 2 36.1503 2 24ZM24.0909 15C22.172 15 20.3433 16.2292 19.2617 18.61C19.0332 19.1128 18.4726 19.4 17.9487 19.2253L16.0513 18.5929C15.5274 18.4182 15.2406 17.8497 15.4542 17.3405C16.9801 13.7031 20.0581 11 24.0909 11C28.459 11 32 14.541 32 18.9091C32 21.2138 30.7884 23.4606 29.2167 25.074C27.8157 26.5121 25.5807 27.702 22.9988 27.9518C22.4491 28.0049 22.0001 27.5523 22.0001 27V25C22.0001 24.4477 22.4504 24.0057 22.9955 23.9167C24.2296 23.7153 25.5034 23.1533 26.3515 22.2828C27.4389 21.1666 28 19.8679 28 18.9091C28 16.7502 26.2498 15 24.0909 15ZM24 36C22.3431 36 21 34.6569 21 33C21 31.3431 22.3431 30 24 30C25.6569 30 27 31.3431 27 33C27 34.6569 25.6569 36 24 36Z"></path></svg>
                                    </div>
                                </div>
                                <div className="tiktok-wiievf-DivTopViewersListContent eux3x8p4">
                                    <div className="tiktok-1hrypw1-DivTopViewersContentHeader eux3x8p5">
                                        <div className="tiktok-5hhs26-DivContentTitle eux3x8p6">Name</div>
                                        <div className="tiktok-1fv3ziv-DivCoinContainer eux3x8p7">
                                            <span className="tiktok-1qk1dq4-SpanCoinIconContainer eux3x8p8">
                                                <svg className="tiktok-6gl0x9-StyledCoinIcon eux3x8p9" width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="#FFEC9B"></circle><circle cx="24" cy="24" r="17" fill="#FACE15"></circle><path fillRule="evenodd" clipRule="evenodd" d="M40.9347 25.5C40.9779 25.0058 41 24.5055 41 24C41 14.6112 33.3888 7 24 7C14.6112 7 7 14.6112 7 24C7 24.5055 7.02206 25.0058 7.06527 25.5C7.82466 16.8137 15.1166 10 24 10C32.8834 10 40.1753 16.8137 40.9347 25.5Z" fill="#FABC15"></path><path d="M33 19C30.2041 19 27.9375 16.7614 27.9375 14H24.5625V27.6111C24.5625 29.2986 23.1774 30.6667 21.4688 30.6667C19.7601 30.6667 18.375 29.2986 18.375 27.6111C18.375 25.9236 19.7601 24.5556 21.4688 24.5556C21.722 24.5556 21.9659 24.5853 22.1981 24.6406C22.2365 24.6497 22.2747 24.6596 22.3125 24.6701V21.2763C22.0358 21.2406 21.7541 21.2222 21.4688 21.2222C17.8962 21.2222 15 24.0826 15 27.6111C15 31.1396 17.8962 34 21.4688 34C25.0413 34 27.9375 31.1396 27.9375 27.6111V20.6673C29.3477 21.7134 31.1005 22.3333 33 22.3333V19Z" fill="#FEF5CD"></path></svg>
                                            </span>
                                            <span className="tiktok-kjeax2-SpanCoinText eux3x8p10">Coins</span>
                                        </div>
                                    </div>
                                    {/*/ map */}
                                    <div className="tiktok-d9auq1-DivUserCardClickWrapperProps e1s7ldwo0">
                                        <div data-e2e="top-viewer" className="tiktok-1xhjiwf-DivTopViewerContainer ewxytx20">
                                            <div className="tiktok-12je05y-DivTopViewerInfo ewxytx21">
                                                <div className="tiktok-e3p2jm-DivTopViewerIndex ewxytx22">1</div>
                                                <img src="https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/44855874505721d040aff50f633be380~c5_100x100.webp?x-expires=1653530400&amp;x-signature=UjvdPGxA8outCovf1jQyeW6oklA%3D" className="tiktok-fnexa2-StyledTopViewerAvatar ewxytx23" style={{display: 'block'}}/>
                                                <div className="tiktok-jqkn5i-DivProfileInfo ewxytx24">
                                                    <div className="tiktok-dq9gru-DivUniqueId ewxytx25">yêu KDL nhất ❤️🍌🐉</div>
                                                </div>
                                            </div>
                                            <div className="tiktok-jpidw3-DivCoinNumDisplay ewxytx26">4</div>
                                        </div>
                                    </div>
                                    {/*/ map */}
                                </div>
                                <div data-e2e="viewer-bar" className="tiktok-1vj12en-DivViewerBarContainer eux3x8p16">
                                    <div data-e2e="top-viewer" className="tiktok-1xhjiwf-DivTopViewerContainer ewxytx20">
                                        <div className="tiktok-12je05y-DivTopViewerInfo ewxytx21">
                                            <div className="tiktok-1ymexcy-DivTopViewerIndex ewxytx22">-</div>
                                            <div className="ewxytx23 tiktok-1ogy7yg-DivBaseComponent-StyledAvatar-StyledTopViewerAvatar e12rwi322" style={{position: 'relative', top: '0px'}}></div>
                                            <div className="tiktok-jqkn5i-DivProfileInfo ewxytx24">
                                                <div className="tiktok-dq9gru-DivUniqueId ewxytx25">Jiro</div>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" data-e2e="top-viewers-send" className="eux3x8p18 tiktok-62h3p2-Button-StyledGiftButton ehk74z00">Send Gifts</button>
                                    <div className="tiktok-1f5wuo4-DivViewerBarTextContainer eux3x8p20">
                                        <span className="tiktok-1h8v539-SpanIconContainer eux3x8p22">
                                            <svg width="11" height="10" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#HeartFill_clip0)"><g filter="url(#HeartFill_filter0_d)"><path fillRule="evenodd" clipRule="evenodd" d="M7.5 2.25C10.5 2.25 12 4.25 12 4.25C12 4.25 13.5 2.25 16.5 2.25C20 2.25 22.5 4.99999 22.5 8.5C22.5 12.5 19.2311 16.0657 16.25 18.75C14.4095 20.4072 13 21.5 12 21.5C11 21.5 9.55051 20.3989 7.75 18.75C4.81949 16.0662 1.5 12.5 1.5 8.5C1.5 4.99999 4 2.25 7.5 2.25Z"></path></g><path fillRule="evenodd" clipRule="evenodd" d="M2.40179 12.1998C3.58902 14.6966 5.7592 16.9269 7.74989 18.75C9.5504 20.3989 10.9999 21.5 11.9999 21.5C12.9999 21.5 14.4094 20.4072 16.2499 18.75C19.231 16.0657 22.4999 12.5 22.4999 8.49997C22.4999 8.41258 22.4983 8.32566 22.4952 8.23923C20.5671 13.6619 13.6787 18.5 11.75 18.5C10.3127 18.5 5.61087 15.8131 2.40179 12.1998Z" fill-opacity="0.03"></path></g><defs><filter id="HeartFill_filter0_d" x="-0.9" y="1.05" width="25.8" height="24.05" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="1.2"></feOffset><feGaussianBlur stdDeviation="1.2"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><clipPath id="HeartFill_clip0"><rect width="24" height="24" fill="white"></rect></clipPath></defs></svg>
                                        </span>
                                        <span data-e2e="top-viewers-send-tip" className="tiktok-1mqholz-SpanViewerBarText eux3x8p21">Send Gifts to support and help Xuân Huy</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>:''}
                    <div ref={messagesEndRef} className="tiktok-1c9cfuz-DivChatMessageList ex6o5345">
                        <div className="tiktok-1ukzimp-DivChatRoomMessage-StyledRoomMessageItem e14mqvp60">
                            <div className="tiktok-6rwu5g-DivBadgeWrap ex6o5346">
                                <div className="tiktok-1lprfzr-DivMessageIconWrapper ex6o5347">
                                    <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M42 13.875C36.4081 13.875 31.875 9.34188 31.875 3.75H25.125V31.3125C25.125 34.7298 22.3548 37.5 18.9375 37.5C15.5202 37.5 12.75 34.7298 12.75 31.3125C12.75 27.8952 15.5202 25.125 18.9375 25.125C19.4439 25.125 19.9318 25.1851 20.3962 25.2971C20.4731 25.3157 20.5493 25.3356 20.625 25.357V18.4844C20.0716 18.4122 19.5082 18.375 18.9375 18.375C11.7923 18.375 6 24.1673 6 31.3125C6 38.4577 11.7923 44.25 18.9375 44.25C26.0827 44.25 31.875 38.4577 31.875 31.3125V17.2512C34.6954 19.3697 38.2011 20.625 42 20.625V13.875Z"></path></svg>
                                </div>
                            </div>
                            <span className="tiktok-sda35-SpanChatRoomComment ex6o5349">Welcome to TikTok LIVE! Have fun interacting with others in real-time and remember to follow our Community Guidelines.</span>
                        </div>
                        {user!=null?
                        <div data-e2e="enter-message" className="tiktok-8bn125-DivChatRoomMessage-StyledEnterMessageContainer e1wamq2l0">
                            <div className="tiktok-1h7qlzl-DivEnterMessageItem e1wamq2l1">
                                <div className="tiktok-6rwu5g-DivBadgeWrap ex6o5346">
                                    <div className="tiktok-1lprfzr-DivMessageIconWrapper ex6o5347">
                                        <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.1716 26L7 26C6.44771 26 6 25.5523 6 25L6 23C6 22.4477 6.44771 22 7 22L24.1716 22L20.2929 18.1213C19.9024 17.7308 19.9024 17.0976 20.2929 16.7071L21.7071 15.2929C22.0976 14.9024 22.7308 14.9024 23.1213 15.2929L30.4142 22.5858C31.1953 23.3668 31.1953 24.6332 30.4142 25.4142L23.1213 32.7071C22.7308 33.0976 22.0976 33.0976 21.7071 32.7071L20.2929 31.2929C19.9024 30.9024 19.9024 30.2692 20.2929 29.8787L24.1716 26ZM36 43L27 43C26.4477 43 26 42.5523 26 42L26 40C26 39.4477 26.4477 39 27 39L36 39C37.1046 39 38 38.1046 38 37L38 11C38 9.89543 37.1046 9 36 9L27 9C26.4477 9 26 8.55228 26 8L26 6C26 5.44771 26.4477 5 27 5L36 5C39.3137 5 42 7.68629 42 11L42 37C42 40.3137 39.3137 43 36 43Z"></path></svg>
                                    </div>
                                </div>
                                <span className="tiktok-1xlvi2n-SpanEnterMessageContent e1wamq2l2">
                                    <div className="tiktok-d9auq1-DivUserCardClickWrapperProps e1s7ldwo0">
                                        <span data-e2e="enter-viewer-name" className="tiktok-1jbvqr0-SpanNickName ex6o5348">{user.username}</span>
                                    </div>joined
                                </span>
                            </div>
                        </div>:''}
                        {messages.map(message=>{
                            if(message.gift!=undefined){
                                return(
                                    <div className="tiktok-a24hmf-DivChatRoomMessage">
                                            <div className="tiktok-d9auq1-DivUserCardClickWrapperProps e1s7ldwo0">
                                                <div className="tiktok-6rwu5g-DivBadgeWrap ex6o5346">
                                                    <img src={message.user.picture} style={{display: 'block'}}/>
                                                </div>
                                            </div>
                                            <div className="tiktok-rpgkhd">
                                                <div className="tiktok-d9auq1-DivUserCardClickWrapperProps e1s7ldwo0">
                                                    <span className="tiktok-1jbvqr0-SpanNickName ex6o5348">{message.user.username}</span>
                                                </div>
                                                <span className="tiktok-1r7t292">
                                                    <span>sent</span>
                                                    <span>
                                                        <img src={message.gift.image}/>
                                                    </span>
                                                    <span>x{message.gift.coin}</span>
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }
                            else if(message.following !=undefined && message.following){
                                return(
                                    <div data-e2e="social-message" class="tiktok-1yqmv63-DivChatRoomMessage-StyledSocialMessageItem ejgm6zf0">
                                            <div class="tiktok-6rwu5g-DivBadgeWrap ex6o5346">
                                                <div class="tiktok-1lprfzr-DivMessageIconWrapper ex6o5347">
                                                    <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M13.0001 13C13.0001 9.68629 15.6864 7 19.0001 7C22.3139 7 25.0001 9.68629 25.0001 13C25.0001 16.3137 22.3139 19 19.0001 19C15.6864 19 13.0001 16.3137 13.0001 13ZM19.0001 3C13.4773 3 9.00015 7.47715 9.00015 13C9.00015 18.5228 13.4773 23 19.0001 23C24.523 23 29.0001 18.5228 29.0001 13C29.0001 7.47715 24.523 3 19.0001 3ZM5.19435 40.9681C6.70152 35.5144 10.0886 32.2352 13.9162 30.738C17.7125 29.2531 22.0358 29.4832 25.6064 31.2486C26.1015 31.4934 26.7131 31.338 26.9931 30.8619L28.0072 29.1381C28.2872 28.662 28.1294 28.0465 27.6384 27.7937C23.0156 25.4139 17.4034 25.0789 12.4591 27.0129C7.37426 29.0018 3.09339 33.3505 1.2883 40.0887C1.14539 40.6222 1.48573 41.1592 2.02454 41.2805L3.97575 41.7195C4.51457 41.8408 5.04724 41.5004 5.19435 40.9681ZM44.7074 30.1212C45.0979 29.7307 45.0979 29.0975 44.7074 28.707L43.2932 27.2928C42.9026 26.9023 42.2695 26.9023 41.8789 27.2928L30.0003 39.1715L25.1216 34.2928C24.7311 33.9023 24.0979 33.9023 23.7074 34.2928L22.2932 35.707C21.9026 36.0975 21.9026 36.7307 22.2932 37.1212L28.586 43.4141C29.3671 44.1952 30.6334 44.1952 31.4145 43.4141L44.7074 30.1212Z"></path></svg>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="tiktok-d9auq1-DivUserCardClickWrapperProps e1s7ldwo0">
                                                    <span class="tiktok-1jbvqr0-SpanNickName ex6o5348">{message.user.username}</span>
                                                </div>
                                                <span data-e2e="social-message-text" class="tiktok-sda35-SpanChatRoomComment ex6o5349">followed the host</span>
                                            </div>
                                    </div>
                                )
                            }
                            else{
                                return(
                                <div className="tiktok-1t802xs-DivChatRoomMessage-StyledChatMessageItem e11g2s300">
                                    <div className="tiktok-d9auq1-DivUserCardClickWrapperProps e1s7ldwo0">
                                        <div className="tiktok-6rwu5g-DivBadgeWrap ex6o5346">
                                            <img src={message.user.picture} style={{display: 'block'}}/>
                                        </div>
                                    </div>
                                    <div className="tiktok-dxptw3-DivChatMessageContent e11g2s301">
                                        <div className="tiktok-d9auq1-DivUserCardClickWrapperProps e1s7ldwo0">
                                            <span data-e2e="message-owner-name" className="tiktok-1jbvqr0-SpanNickName ex6o5348">{message.user.name}</span>
                                        </div>
                                        <span className="tiktok-7b0tfj-SpanChatRoomComment e11g2s307">{message.message}</span>
                                    </div> 
                                    <div onClick={(e)=>setmessage(e,message,'show_action',!message.show_action)} className="tiktok-8dqif4-DivChatMessageMoreIconWrapper e11g2s303">
                                        <span data-e2e="more-action-button" className="tiktok-1igm5hy-SpanChatMessageMore e11g2s302">
                                            <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4 24C4 21.7909 5.79086 20 8 20C10.2091 20 12 21.7909 12 24C12 26.2091 10.2091 28 8 28C5.79086 28 4 26.2091 4 24ZM20 24C20 21.7909 21.7909 20 24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28C21.7909 28 20 26.2091 20 24ZM36 24C36 21.7909 37.7909 20 40 20C42.2091 20 44 21.7909 44 24C44 26.2091 42.2091 28 40 28C37.7909 28 36 26.2091 36 24Z"></path></svg>
                                        </span>
                                        {message.show_action?
                                        <div className="tiktok-vwwmft-DivContainer e2ipgxl0" style={{ƠbackgroundColor: 'rgb(255, 255, 255)', right: '-6px'}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 8" width="1em" height="1em" verticalPropKey="top" className="tiktok-znnspw-StyledTopArrow e2ipgxl1" style={{right: '6px'}}><path d="M0 8c7 0 10-8 12-8s5 8 12 8z"></path></svg>
                                            <div className="tiktok-1yuq4e0-DivPopupContainer e1vq2jmc3">
                                                {user.id!=message.user.id?
                                                <p onClick={(e)=>reportmessage(e,message)} data-e2e="message-report" className="tiktok-1dhx835-PActionItem e1vq2jmc4">
                                                    <svg width="24" height="24" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9 9.31286V27.0626C9.98685 26.7378 11.184 26.4042 12.5108 26.1585C16.1115 25.4917 21.0181 25.4123 25.1625 28.3726C28.0181 30.4123 31.6115 30.4917 34.7608 29.9085C36.306 29.6223 37.6602 29.1908 38.6289 28.8293C38.7603 28.7803 38.8841 28.7328 39 28.6872V10.9374C38.0131 11.2623 36.816 11.5959 35.4892 11.8416C31.8885 12.5084 26.9819 12.5878 22.8375 9.62751C19.9819 7.58781 16.3885 7.5084 13.2392 8.09161C11.694 8.37776 10.3398 8.80927 9.37105 9.17072C9.23971 9.21973 9.11586 9.2673 9 9.31286ZM40.1067 6.21064C40.7264 5.90123 41.4622 5.93453 42.0515 6.29874C42.6411 6.66315 43 7.30688 43 8.00004V30C43 30.7576 42.572 31.4501 41.8944 31.7889L41 30C41.8944 31.7889 41.8931 31.7895 41.8931 31.7895L41.8916 31.7903L41.8878 31.7922L41.8775 31.7973L41.846 31.8127C41.831 31.82 41.8128 31.8288 41.7915 31.839C41.7761 31.8464 41.7589 31.8545 41.7401 31.8634C41.651 31.9055 41.525 31.9637 41.3654 32.0343C41.0466 32.1753 40.5919 32.3663 40.0273 32.577C38.9023 32.9967 37.319 33.5027 35.4892 33.8416C31.8885 34.5084 26.9819 34.5878 22.8375 31.6275C19.9819 29.5878 16.3885 29.5084 13.2392 30.0916C11.694 30.3778 10.3398 30.8093 9.37105 31.1707C9.23971 31.2197 9.11586 31.2673 9 31.3129V44.0001C9 44.5524 8.55228 45.0001 8 45.0001H6C5.44772 45.0001 5 44.5524 5 44.0001V8.00004C5 7.24249 5.42801 6.54996 6.10558 6.21118L7 8.00004C6.10558 6.21118 6.10688 6.21053 6.10688 6.21053L6.10842 6.20976L6.11219 6.20789L6.12249 6.20279L6.15404 6.18734C6.17988 6.17477 6.21529 6.15773 6.25987 6.13667C6.34902 6.09457 6.47498 6.03636 6.63455 5.9658C6.95342 5.8248 7.4081 5.63378 7.9727 5.42311C9.09774 5.00332 10.681 4.49734 12.5108 4.15849C16.1115 3.49171 21.0181 3.4123 25.1625 6.37257C28.0181 8.41227 31.6115 8.49167 34.7608 7.90846C36.306 7.62231 37.6602 7.1908 38.6289 6.82935C39.1112 6.6494 39.4925 6.48886 39.7478 6.37595C39.8754 6.31956 39.9711 6.27523 40.0318 6.24653C40.0622 6.23219 40.0838 6.22177 40.0962 6.21572L40.1056 6.21118L40.1067 6.21064Z"></path></svg>
                                                    <span className="tiktok-ipxjgc-SpanActionText e1vq2jmc5">Report</span>
                                                </p>:''}
                                                {user.username==message.user.username?
                                                <p onClick={(e)=>deletemessage(e,message)} data-e2e="message-delete" className="tiktok-1dhx835-PActionItem e1vq2jmc4">
                                                    <svg width="24" height="24" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M19.5 7.50006V9.50006H28.5V7.50006H19.5ZM32.5 9.50006V6.00006C32.5 4.61935 31.3807 3.50006 30 3.50006H18C16.6193 3.50006 15.5 4.61935 15.5 6.00006V9.50006H7C6.44772 9.50006 6 9.94778 6 10.5001V12.5001C6 13.0523 6.44772 13.5001 7 13.5001H9.5V39.5001C9.5 41.7092 11.2909 43.5001 13.5 43.5001H34.5C36.7091 43.5001 38.5 41.7092 38.5 39.5001V13.5001H41C41.5523 13.5001 42 13.0523 42 12.5001V10.5001C42 9.94778 41.5523 9.50006 41 9.50006H32.5ZM34.5 13.5001H13.5V39.5001H34.5V13.5001ZM18.5 34.0001C17.9477 34.0001 17.5 33.5523 17.5 33.0001V20.0001C17.5 19.4478 17.9477 19.0001 18.5 19.0001H20.5C21.0523 19.0001 21.5 19.4478 21.5 20.0001V33.0001C21.5 33.5523 21.0523 34.0001 20.5 34.0001H18.5ZM27.5 34.0001C26.9477 34.0001 26.5 33.5523 26.5 33.0001V20.0001C26.5 19.4478 26.9477 19.0001 27.5 19.0001H29.5C30.0523 19.0001 30.5 19.4478 30.5 20.0001V33.0001C30.5 33.5523 30.0523 34.0001 29.5 34.0001H27.5Z"></path></svg>
                                                    <span className="tiktok-ipxjgc-SpanActionText e1vq2jmc5">Delete</span>
                                                </p>:''}
                                            </div>
                                        </div>:''}
                                       
                                    </div>              
                                </div>
                                )
                            }
                        })}
                        
                        {join!=null && join.user.id!=user.id?
                        <div data-e2e="enter-message" className="tiktok-8bn125-DivChatRoomMessage-StyledEnterMessageContainer e1wamq2l0">
                            <div className="tiktok-1h7qlzl-DivEnterMessageItem e1wamq2l1">
                                <div className="tiktok-6rwu5g-DivBadgeWrap ex6o5346">
                                    <div className="tiktok-1lprfzr-DivMessageIconWrapper ex6o5347">
                                        <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.1716 26L7 26C6.44771 26 6 25.5523 6 25L6 23C6 22.4477 6.44771 22 7 22L24.1716 22L20.2929 18.1213C19.9024 17.7308 19.9024 17.0976 20.2929 16.7071L21.7071 15.2929C22.0976 14.9024 22.7308 14.9024 23.1213 15.2929L30.4142 22.5858C31.1953 23.3668 31.1953 24.6332 30.4142 25.4142L23.1213 32.7071C22.7308 33.0976 22.0976 33.0976 21.7071 32.7071L20.2929 31.2929C19.9024 30.9024 19.9024 30.2692 20.2929 29.8787L24.1716 26ZM36 43L27 43C26.4477 43 26 42.5523 26 42L26 40C26 39.4477 26.4477 39 27 39L36 39C37.1046 39 38 38.1046 38 37L38 11C38 9.89543 37.1046 9 36 9L27 9C26.4477 9 26 8.55228 26 8L26 6C26 5.44771 26.4477 5 27 5L36 5C39.3137 5 42 7.68629 42 11L42 37C42 40.3137 39.3137 43 36 43Z"></path></svg>
                                    </div>
                                </div>
                                <span className="tiktok-1xlvi2n-SpanEnterMessageContent e1wamq2l2">
                                    <div className="tiktok-d9auq1-DivUserCardClickWrapperProps e1s7ldwo0">
                                        <span data-e2e="enter-viewer-name" className="tiktok-1jbvqr0-SpanNickName ex6o5348">{join.user.username}</span>
                                    </div>joined
                                </span>
                            </div>
                        </div>:''}
                    </div>
                </div>
                <div className="tiktok-13gsddh-DivWrapper e7euxl40">
                    <div className="tiktok-1j2zdys-DivCloseWrapper e7euxl41">
                        <svg className="tiktok-1fd6gfm-StyledXMark e7euxl42" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.1718 23.9999L10.2931 13.1212C9.90261 12.7307 9.90261 12.0975 10.2931 11.707L11.7074 10.2928C12.0979 9.90228 12.731 9.90228 13.1216 10.2928L24.0002 21.1715L34.8789 10.2928C35.2694 9.90228 35.9026 9.90228 36.2931 10.2928L37.7073 11.707C38.0979 12.0975 38.0979 12.7307 37.7073 13.1212L26.8287 23.9999L37.7073 34.8786C38.0979 35.2691 38.0979 35.9023 37.7073 36.2928L36.2931 37.707C35.9026 38.0975 35.2694 38.0975 34.8789 37.707L24.0002 26.8283L13.1216 37.707C12.731 38.0975 12.0979 38.0975 11.7074 37.707L10.2931 36.2928C9.90261 35.9023 9.90261 35.2691 10.2931 34.8786L21.1718 23.9999Z"></path></svg>
                    </div>
                    <div className="tiktok-1n0hyld-DivUserWrapper e7euxl43">
                        <div className="tiktok-v255ev-DivUserBadgeWrapper e7euxl45">
                            <span className="tiktok-4tyueh-SpanUserName e7euxl46"></span>
                            <span className="tiktok-d9yhyi-SpanUserBadgeDesc e7euxl47">0-month badge</span>
                        </div>
                    </div>
                    <div className="tiktok-1r2lv2t-DivBadgeDesc e7euxl48">Get a badge when you subscribe. Upgrade your badge when you reach subscription milestones.</div>
                    <div className="tiktok-wegw0r-DivProgressWrapper e7euxl49"></div>
                    <button type="button" disabled="" className="e7euxl410 tiktok-1tyz3qs-Button-StyledButton ehk74z00">Subscribe</button>
                </div>
                <div className="tiktok-7svj0w-DivCommentContainer e1ciaho83">
                    <div className="tiktok-19dw2t5-DivLayoutContainer e1ciaho84">
                        <div data-e2e="comment-input" className="tiktok-1cyflof-DivInputAreaContainer e1ciaho85">
                            <div data-e2e="comment-text" className="tiktok-18ztcg2-DivInputEditorContainer e1ciaho86">
                                <textarea onChange={(e)=>setState({...state,message:e.target.value})} value={state.message} maxLength="150" placeholder="Add comment..." className="tiktok-1e359ru-TextareaEditor e1ciaho81"></textarea>
                            </div>
                            <EmojiPicker
                            showemoji={showemoji}
                            setaddkey={(e,value)=>setaddkey(e,value)}
                            setshowemoji={data=>setshowemoji(data)}
                            />
                        </div>
                    </div>
                    <div onClick={(e)=>onMessageSubmit(e)} data-e2e="comment-post" className={`tiktok-${state.message.trim()==''?'1lusqmb':'1vgtakc'}-DivPostButton e1ciaho88`}>
                        <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M45.7321 7.00001C45.3748 6.3812 44.7146 6 44 6H4.00004C3.20826 6 2.49103 6.4671 2.17085 7.19125C1.85068 7.9154 1.98785 8.76026 2.52068 9.34592L12.9607 20.8209C13.5137 21.4288 14.3824 21.6365 15.1506 21.3445L29.65 15.8336C29.8188 15.7694 29.8953 15.796 29.9287 15.8092C29.9872 15.8325 30.0709 15.8928 30.1366 16.0041C30.2023 16.1154 30.2147 16.2179 30.2068 16.2802C30.2023 16.3159 30.1885 16.3958 30.0509 16.5125L18.1464 26.6098C17.5329 27.1301 17.2908 27.9674 17.5321 28.7348L22.0921 43.2398C22.33 43.9967 22.9928 44.5413 23.7815 44.628C24.5701 44.7147 25.3354 44.3271 25.7321 43.64L45.7321 9.00002C46.0894 8.38122 46.0894 7.61882 45.7321 7.00001Z"></path></svg>
                    </div>
                </div>
               
            </div>
        </div>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,notify:state.notify
});
export default connect(mapStateToProps)(Chat);
