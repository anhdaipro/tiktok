import axios from 'axios';
import React, {useState, useEffect,memo,useRef} from 'react'
import { connect } from 'react-redux';
import { headers,expiry,updatenotify} from '../actions/auth';
import { useParams,useLocation,useNavigate,useSearchParams,Link } from "react-router-dom";
import Navbar from "./Navbar"
import "../css/chat.css"
import {listThreadlURL,conversationsURL } from '../urls';
import { timevalue,Dayformat,checkDay } from '../constants';
import EmojiPicker from "../hocs/EmojiPicker"
import io from "socket.io-client"
const Message=(props)=>{
    const {show_message,isAuthenticated,user,notify,updatenotify}=props
    const [state, setState] = useState({reason:'',setting:[{name:'Friends',value:1},{name:'No one',value:2}],
    setting_choice:{name:'Friends',value:1},show_type_chat:false,type_chat:1,user_search:null,typing:false,
    show_chat:false,loading_more:false});
    const [show, setShow] = useState(false);
    const [list_messages,setListmessages]=useState([]);
    const [message,setMessage]=useState('')
    const [list_threads,setThreads]=useState([]);
    const [listuser,setListuser]=useState([]);
    const [threadchoice,setThreadchoice]=useState(null)
    const [showemoji,setShowemoji]=useState(false)
    const [loading,setLoading]=useState(false)
    const [params, setSearchParams] = useSearchParams();
    const socket=useRef()   
    const scrollRef=useRef(null);
    const search=Object.fromEntries([...params])
    const reason=[
        'Dangerous organizations and individuals',
        'Illegal activities and regulated goods',
        'Frauds and scams',
        'Violent and graphic content',
        'Animal cruelty',
        'Suicide, self-harm, and dangerous acts','Hate Speech',
        'Harassment or Bullying','Pornography and nudity',
        'Minor safety','Spam','Intellectual property infringement',
        'Other'
        ]
    

   
   
    
    const setemoji=(e,value)=>{
        setMessage(message+value)
    }
    
   ///send socket
   const setshowemoji=(value)=>{
    setShowemoji(value)
}
    //list thread
    useEffect(() => {
        (async()=>{
            try{
            await isAuthenticated
            setShow(true)
            axios.get(`${listThreadlURL}`,headers)
            .then(res=>{
                if (search.thread_id!=null){
                setState({...state,loading:true})
                    setThreadchoice(search.thread_id)
                }
                const list_threads=res.data.threads.map(item=>{
                    if(search.thread_id==item.id){
                        return({...item,choice:true,show_action:false})
                    }
                    return({...item,show_action:false})
                })
                setThreads(list_threads)
                setLoading(true)
            })
        }
        catch{
            console.log('error')
        }
        })()
    },[])

    useEffect(() => {
        if(params.get('thread_id')!=null){ 
            setTimeout(()=>{
            axios.get(`${listThreadlURL}?${params}`,headers)
            .then(res=>{
            const list_messages=res.data.messages.map(item=>{
                return({...item,show_action:false})
            })
            setState({...state,loading:true,show_chat:true})
            setListmessages(list_messages)
            })
        },1000)
    }
    },[])

    

    const showmessage=(e,threadchoice)=>{
        if(!list_threads.some(thread=>thread.choice) || list_threads.find(thread=>thread.choice).id!==threadchoice.id){
            const list_thread=list_threads.map(thread=>{
                if(thread.id==threadchoice.id){
                    return({...thread,count_message_not_seen:0,choice:true})
                }
                return({...thread,choice:false})
            })
            setThreads(list_thread)
            setThreadchoice(threadchoice.id)
            let form=new FormData()
            form.append('thread_id',threadchoice.id)
            form.append('seen',true)
            if(localStorage.token&&expiry>0){
                axios.post(listThreadlURL,form,headers)
                .then(res=>{
                    setState({...state,loading:true,show_chat:true})
                    setListmessages(res.data.messages.reverse())
                })
            }
        }
    }

    const listdate=()=>{
        let list_days_unique=[]
        let list_days=[]
        const list_day=list_messages.map(message=>{
            return(("0" + new Date(message.created).getDate()).slice(-2) + "-" + ("0"+(new Date(message.created).getMonth()+1)).slice(-2) + "-" +
            new Date(message.created).getFullYear())
        })
        for(let j=0;j<list_day.length;j++){
            if(list_days[list_day[j]]) continue;
            list_days[list_day[j]] = true;
            list_days_unique.push(j)
        }
        return list_days_unique
    }
    
    const setchoicethread=()=>{
        axios.post()
    }
    // show actio
    const setshowaction=(e,thread)=>{
        e.stopPropagation()
        const list_convesations=list_threads.map(item=>{
            if(thread.id==item.id){
                return({...item,show_action:!item.show_action})
            }
            return({...item,show_action:false})
        })
        setThreads(list_convesations)
    }

    const setthreadchoice=(e,threadchoice,name,value)=>{
        e.stopPropagation()
        const list_convesations=list_threads.map(thread=>{
            if(threadchoice.id==thread.id){
                return({...thread,[name]:value})
            }
            return({...thread})
        })
        setThreads(list_convesations)
    }
    const setsend=(e)=>{
        if (e.keyCode === 13 && e.target.value!='') {
            let data = {
                message: message,
                send_by: user.id,
                sender:user.username,
                send_to: list_threads.find(thread=>thread.choice).info_thread.find(users=>users.id!==user.id).id,
                thread_id:list_threads.find(thread=>thread.choice).id,
            }
            socket.current.emit("sendData",data)
            let form =new FormData()
            form.append('message',message)
            axios.post(`${conversationsURL}${list_threads.find(thread=>thread.choice).id}`,form,headers)
            .then(res=>{
                setMessage('')
            })
        }
    }


    useEffect(() => { 
        socket.current = io.connect('https://web-production-eaad.up.railway.app/');
        if(user!=null){
            let data={send_by:user.id}
            socket.current.emit("sendData",data)
        }
        socket.current.on('message',(e)=>{
        const data = (e.data)
        if(data.send_to!=undefined){
            if(list_threads.length>0){
                const listthreads=list_threads.map(thread=>{
                    if(thread.id==data.thread_id){
                        return({...thread,message:[{text:data.message,created:new Date().toString()}]})
                    }
                    return({...thread})
                })
                setThreads(listthreads)
            }
            const message_text={sender:data.sender,text:data.message,created:new Date().toString()}
            const list=[...list_messages,message_text]
            if(threadchoice==data.thread_id){
            setListmessages(list)
            }
            
            if(user!=null && data.send_to==user.id && !list_threads.some(thread=>thread.choice)){
                const count_unread=notify.count_notify_unseen+1
                const count_notify_unseen=count_unread>0?count_unread:0
                const data_unread={count_notify_unseen:count_notify_unseen,send_to:data.send_to}
                updatenotify(data_unread,data.notifi_type)
            }
           
            if(scrollRef.current!=null){
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            }
        }
        else{
            if(list_threads.length>0){
                const listthreads=list_threads.map(thread=>{
                return({...thread,info_thread:thread.info_thread.map(users=>{
                    if(users.id==data.send_by){
                        return({...users,online:true})
                        }
                    else{
                    return({...users})
                    }
                })})
            })
            setThreads(listthreads)
            }
        }
    })
      
    return () => {
        socket.current.disconnect();
      };

    },[list_messages,list_threads,user])
    const thread_report=list_threads.find(thread=>thread.show_report)


    return(
        
        <div id="main"> 
            <Navbar/>
            <div className="main-body page-with-header">
                <div className="jsx-2958430982 share-layout messages-layout jsx-3100779177 middle">
                    <div className="share-layout-content messages-layout-content no-padding jsx-3100779177">
                        <div className="share-layout-main messages-layout-main jsx-3100779177">
                            <div className="jsx-2553859180 back-container">
                                <svg width="20" height="20" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4.58579 22.5858L20.8787 6.29289C21.2692 5.90237 21.9024 5.90237 22.2929 6.29289L23.7071 7.70711C24.0976 8.09763 24.0976 8.7308 23.7071 9.12132L10.8284 22H39C39.5523 22 40 22.4477 40 23V25C40 25.5523 39.5523 26 39 26H10.8284L23.7071 38.8787C24.0976 39.2692 24.0976 39.9024 23.7071 40.2929L22.2929 41.7071C21.9024 42.0976 21.2692 42.0976 20.8787 41.7071L4.58579 25.4142C3.80474 24.6332 3.80474 23.3668 4.58579 22.5858Z"></path></svg>
                            </div>
                            <div style={{width:'356px'}} className="jsx-2553859180 left-part">
                                <div className="jsx-622901482 conversation-list-wrapper">
                                    <div className="jsx-622901482 conversation-list-header">
                                        <h3 className="jsx-622901482 conversation-list-title">Messages</h3>
                                        <img onClick={()=>setState({...state,show_setting:true})} src="https://lf16-tiktok-web.ttwstatic.com/obj/tiktok-web/tiktok/web/node/_next/static/images/setting-icon-a9c23d78ffb500df10b32dbcc6aa9b5e.svg" alt="" className="jsx-622901482 conversation-list-setting-icon"/>

                                    </div>
                                    <div className="jsx-622901482 conversation-list-content">
                                        <div className="jsx-597607045 scroll-container side-bar-wrapper">
                                            <div className="jsx-597607045 scroll-wrapper side-scroll-wrapper">
                                                <div className="jsx-622901482">
                                                    {list_threads.map(thread=>
                                                    <div onClick={(e)=>showmessage(e,thread)} className="jsx-3494757477 conversation-list-item-wrapper selected">
                                                        <div className="jsx-3494757477 conversation-list-item-info">
                                                            <div className="jsx-3494757477 info-avatar-wrapper">
                                                                <img src={thread.info_thread.find(users=>users.id!==user.id).picture} alt="" className="jsx-3494757477 info-avatar"/>
                                                                <div className="jsx-3494757477 info-avatar-mask"></div>
                                                            </div>
                                                            <div className="jsx-3494757477 info-text-wrapper">
                                                                <p className="jsx-3494757477 info-nickname">{thread.info_thread.find(users=>users.id!==user.id).name}</p>
                                                                {thread.message.length>0?
                                                                <p className="jsx-3494757477 info-extract-time">
                                                                <span className="jsx-3494757477 info-extract">{thread.message[0].text}</span>
                                                                <span className="jsx-3494757477 info-time">{Dayformat(thread.message[0].created)}</span>
                                                                </p>:''}
                                                            </div>
                                                        </div>
                                                        <img onClick={(e)=>setshowaction(e,thread)} src="https://lf16-tiktok-web.ttwstatic.com/obj/tiktok-web/tiktok/web/node/_next/static/images/more-action-icon-7aa6a63b2bf63cb69ec0aba5635da033.svg" alt="" className="jsx-3494757477 more-action-icon"/>
                                                        <div className={`jsx-3494757477 ${thread.show_action?'show-more-action':''} more-action`}>
                                                            <div className="jsx-3494757477 action-item">
                                                                <div className="jsx-3494757477 action-detail">
                                                                    <img src="https://lf16-tiktok-web.ttwstatic.com/obj/tiktok-web/tiktok/web/node/_next/static/images/mute-action-icon-c037f494b844b21beeeb5758bc35b3a8.svg" alt="" className="jsx-3494757477 action-detail-icon"/>
                                                                    <p className="jsx-3494757477">Mute</p>
                                                                </div>
                                                            </div>
                                                            <div className="jsx-3494757477 action-item">
                                                                <div className="jsx-3494757477 action-detail">
                                                                    <img src="https://lf16-tiktok-web.ttwstatic.com/obj/tiktok-web/tiktok/web/node/_next/static/images/trash-bin-icon-26b568c312ef800c355d8a304e35aa50.svg" alt="" className="jsx-3494757477 action-detail-icon"/>
                                                                    <p className="jsx-3494757477">Delete</p>
                                                                </div>
                                                            </div>
                                                            <div className="jsx-3494757477 action-item">
                                                                <div className="jsx-3494757477 action-detail">
                                                                    <img src="https://lf16-tiktok-web.ttwstatic.com/obj/tiktok-web/tiktok/web/node/_next/static/images/pin-top-icon-6e4d9912c3a3b189da00780ff8c17b7a.svg" alt="" className="jsx-3494757477 action-detail-icon"/>
                                                                    <p className="jsx-3494757477">Pin to top</p>
                                                                </div>
                                                            </div>
                                                            <div onClick={(e)=>setthreadchoice(e,thread,'show_report',true)} className="jsx-3494757477 action-item">
                                                                <div  className="jsx-3494757477 action-detail">
                                                                    <img src="https://lf16-tiktok-web.ttwstatic.com/obj/tiktok-web/tiktok/web/node/_next/static/images/flag-icon-e35a4322f4132a16ac177b0355508c4e.svg" alt="" className="jsx-3494757477 action-detail-icon"/>
                                                                    <p className="jsx-3494757477">Report</p>
                                                                </div>
                                                            </div>
                                                            <div className="jsx-3494757477 action-item">
                                                                <div className="jsx-3494757477 action-detail">
                                                                    <img src="https://lf16-tiktok-web.ttwstatic.com/obj/tiktok-web/tiktok/web/node/_next/static/images/block-icon-404229410a4f9c063ffb7cb19ffc41ce.svg" alt="" className="jsx-3494757477 action-detail-icon"/>
                                                                    <p className="jsx-3494757477">Block</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>)}
                                                </div>
                                            </div>

                                            <div style={{height: '0px', transform: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1) scale(0) translateZ(1px) translateZ(-2px)'}} className="jsx-597607045 scroll-bar">
                                                <div className="jsx-597607045 scroll-bar-thumb"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{zIndex:'auto'}} className="jsx-2553859180 right-part">
                                
                                <div className="jsx-2123414624 conversation-container">
                                {state.show_chat && threadchoice!=null && threadchoice==list_threads.find(thread=>thread.choice).id?<>
                                    <div className="jsx-2123414624 conversation-header">
                                        <Link to={`/${list_threads.find(thread=>thread.choice).info_thread.find(receiver=>receiver.id!=user.id).username}?lang=en`} rel="noopener">
                                            <span className="tiktok-avatar tiktok-avatar-circle" style={{width: '48px', height: '48px'}}>
                                                <img src={list_threads.find(thread=>thread.choice).info_thread.find(receiver=>receiver.id!=user.id).picture}/>
                                            </span>
                                        </Link>
                                        <Link  to={`/${list_threads.find(thread=>thread.choice).info_thread.find(receiver=>receiver.id!=user.id).username}?lang=en`} rel="noopener">
                                            <div className="jsx-2123414624 name-container">
                                                <p className="jsx-2123414624 nickname">{list_threads.find(thread=>thread.choice).info_thread.find(receiver=>receiver.id!=user.id).username}</p>
                                                <p className="jsx-2123414624 unique-id">@{list_threads.find(thread=>thread.choice).info_thread.find(receiver=>receiver.id!=user.id).username}</p>
                                            </div>
                                        </Link>
                                    </div>
                                    <div ref={scrollRef} className="jsx-2123414624 conversation-main">
                                        {list_messages.map((message,i)=><>
                                        {listdate().includes(i)?
                                        <div className="jsx-2123414624 time-container first-time">{checkDay(new Date(message.created))=="Today"?`${("0" + new Date(message.created).getHours()).slice(-2)}:${("0" + new Date(message.created).getMinutes()).slice(-2)}`:checkDay(new Date(message.created))=="Yesterday"?`Yesterday, ${("0" + new Date(message.created).getHours()).slice(-2)}:${("0" + new Date(message.created).getMinutes()).slice(-2)}`:`${("0" + new Date(message.created).getDate()).slice(-2)} Th${("0"+(new Date(message.created).getMonth()+1)).slice(-2)} ${new Date(message.created).getFullYear()}, ${("0" + new Date(message.created).getHours()).slice(-2)}:${("0" + new Date(message.created).getMinutes()).slice(-2)}`}</div>:''}
                                        <div className={`jsx-228382986 conversation-item-wrapper hoverable`}>
                                            <div className={`jsx-228382986 message-container ${user.username==message.sender?'myself':''}`}>
                                                <Link to={`/${message.sender}?lang=en`} rel="noopener">
                                                    <span className="tiktok-avatar tiktok-avatar-circle" style={{flexShrink: 0, width: '32px', height: '32px'}}>
                                                        <img src={list_threads.find(thread=>thread.choice).info_thread.find(users=>users.username==message.sender)!=undefined?list_threads.find(thread=>thread.choice).info_thread.find(user=>user.username==message.sender).picture:''}/>
                                                    </span>
                                                </Link>
                                                <div className="jsx-228382986 text-container">
                                                    <p className="jsx-228382986">{message.text}</p>
                                                </div>
                                                <div className="jsx-228382986 icon-more">
                                                    <svg width="24" height="24" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4 24C4 21.7909 5.79086 20 8 20C10.2091 20 12 21.7909 12 24C12 26.2091 10.2091 28 8 28C5.79086 28 4 26.2091 4 24ZM20 24C20 21.7909 21.7909 20 24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28C21.7909 28 20 26.2091 20 24ZM36 24C36 21.7909 37.7909 20 40 20C42.2091 20 44 21.7909 44 24C44 26.2091 42.2091 28 40 28C37.7909 28 36 26.2091 36 24Z"></path></svg>
                                                </div>
                                            </div>
                                        </div></>)}
                                       
                                    </div>
                                    <div className="jsx-2662929349 conversation-bottom">
                                        <div className="jsx-2662929349 editor-container">
                                            <div className="comment-input-inner-wrapper pc">
                                                <div className="editor">
                                                    <div className="DraftEditor-root">
                                                        
                                                        <div className="DraftEditor-editorContainer">
                                                            <div aria-autoComplete="list" aria-expanded="false" className="notranslate public-DraftEditor-content" style={{outline: 'none', userSelect: 'text', whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}} aria-describedby="placeholder-6pk7q">
                                                                <div data-contents="true">
                                                                    <div className="" data-block="true" data-editor="6pk7q" data-offset-key="dju1r-0-0">
                                                                        <div data-offset-key="dju1r-0-0" className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr">
                                                                            <textarea onKeyUp={(e)=>setsend(e)} onChange={(e)=>setMessage(e.target.value)} value={message} data-testid="post-comment-text-area" className="PUqUI Ypffh" ></textarea>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="emoji-container" >
                                                        <EmojiPicker
                                                       
                                                        setemoji={(e,value)=>setemoji(e,value)}
                                                       
                                                        />
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>:''}
                                </div>
                            </div>
                            {list_threads.some(thread=>thread.show_report) || state.show_setting?
                            <div className="jsx-1285478177 modal show">
                                <div className="jsx-1285478177 modal-wrapper">
                                    <div className="jsx-1285478177 modal-mask" style={{background: 'rgba(0, 0, 0, 0.5)'}}></div>
                                    <div className="jsx-1285478177 modal-content">
                                        {!state.show_setting?
                                        <div className="jsx-4107332755 report-reason-container">
                                            <div className="jsx-4107332755 report-reason-header">
                                                <div className="jsx-4107332755 title">Report</div>
                                                <span onClick={e=>setthreadchoice(e,thread_report,'show_report',false)} className="jsx-4107332755">
                                                    <svg className="close-icon" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.1718 23.9999L10.2931 13.1212C9.90261 12.7307 9.90261 12.0975 10.2931 11.707L11.7074 10.2928C12.0979 9.90228 12.731 9.90228 13.1216 10.2928L24.0002 21.1715L34.8789 10.2928C35.2694 9.90228 35.9026 9.90228 36.2931 10.2928L37.7073 11.707C38.0979 12.0975 38.0979 12.7307 37.7073 13.1212L26.8287 23.9999L37.7073 34.8786C38.0979 35.2691 38.0979 35.9023 37.7073 36.2928L36.2931 37.707C35.9026 38.0975 35.2694 38.0975 34.8789 37.707L24.0002 26.8283L13.1216 37.707C12.731 38.0975 12.0979 38.0975 11.7074 37.707L10.2931 36.2928C9.90261 35.9023 9.90261 35.2691 10.2931 34.8786L21.1718 23.9999Z"></path></svg>
                                                </span>
                                            </div>
                                            <div className="jsx-4107332755 report-reason-content">
                                                <div className="jsx-4107332755">
                                                    <div className="jsx-4107332755 report-reason-why-title">Why are you reporting this account?</div>
                                                    <div className="jsx-4107332755 report-reason-group">
                                                        {reason.map((item,index)=>
                                                        <div key={index} onClick={()=>setState({...state,reason:item})} className={`jsx-4107332755 ${state.reason==item?'report-reason-item-selected':''} report-reason-item`}>{item}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="jsx-4107332755 report-reason-footer">
                                                <div className="jsx-4107332755 report-reason-button-container">
                                                    <button onClick={(e)=>setthreadchoice(e,thread_report,'show_report',false)} type="button" className="tiktok-btn-pc tiktok-btn-pc-medium tiktok-btn-light">Cancel</button>
                                                    <button type="button" className={`tiktok-btn-pc tiktok-btn-pc-medium tiktok-btn-pc-primary ${state.reason!=''?'':'tiktok-btn-pc-disabled'}`}>Next</button>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className="jsx-906605445 message-setting-container">
                                            <div className="jsx-906605445 message-setting-header">
                                                <div className="jsx-906605445 title">Message settings</div>
                                                <span onClick={()=>setState({...state,show_setting:false})} className="jsx-906605445">
                                                    <svg className="close-icon" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.1718 23.9999L10.2931 13.1212C9.90261 12.7307 9.90261 12.0975 10.2931 11.707L11.7074 10.2928C12.0979 9.90228 12.731 9.90228 13.1216 10.2928L24.0002 21.1715L34.8789 10.2928C35.2694 9.90228 35.9026 9.90228 36.2931 10.2928L37.7073 11.707C38.0979 12.0975 38.0979 12.7307 37.7073 13.1212L26.8287 23.9999L37.7073 34.8786C38.0979 35.2691 38.0979 35.9023 37.7073 36.2928L36.2931 37.707C35.9026 38.0975 35.2694 38.0975 34.8789 37.707L24.0002 26.8283L13.1216 37.707C12.731 38.0975 12.0979 38.0975 11.7074 37.707L10.2931 36.2928C9.90261 35.9023 9.90261 35.2691 10.2931 34.8786L21.1718 23.9999Z"></path></svg>
                                                </span>
                                            </div>
                                            <div className="jsx-906605445 message-setting-content">
                                                <div className="jsx-906605445 msg-who">
                                                    <p className="jsx-906605445 message-setting-what">Who can send you direct messages</p>
                                                    <p className="jsx-906605445 message-setting-detail">With any option, you can receive messages from users that you've sent messages to. Friends are your followers that you follow back.</p>
                                                    <div className="tiktok-radio-group-btn__radio-group setting-type-group" style={{display: 'inline-flex', flexDirection: 'column'}}>
                                                        {state.setting.map(item=>
                                                        <label onClick={()=>setState({...state,setting_choice:item})} className={`setting-type tiktok-radio tiktok-radio-medium ${item.value==state.setting_choice.value?'is-checked':''}`} role="radio" aria-checked="true" aria-disabled="false" style={{margin: '12px 0px'}}>
                                                            <div className="tiktok-radio__radio"></div>
                                                            <input className="tiktok-radio__orig-radio" type="radio" aria-hidden="true" value={item.value} checked={item.value==state.setting_choice.value?true:false}/>
                                                            <span className="tiktok-radio__inner">{item.name}</span>
                                                        </label>
                                                        )}
                                                       
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="jsx-906605445 message-setting-footer">
                                                <div className="jsx-906605445 message-setting-button-container">
                                                    <button onClick={()=>setState({...state,show_setting:false})} type="button" className="tiktok-btn-pc tiktok-btn-pc-medium">Cancel</button>
                                                    <button onClick={(e)=>setchoicethread(e)} type="button" className="tiktok-btn-pc tiktok-btn-pc-medium tiktok-btn-pc-primary tiktok-btn-pc-disabled">Save</button>
                                                </div>
                                            </div>
                                        </div>
                                        }

                                    </div>
                                </div>
                            </div>:''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
       
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,notify:state.notify
});
export default connect(mapStateToProps,{updatenotify})(Message);
