import Navbar from "./Navbar"
import React,{useState,useEffect,useRef,useCallback} from 'react'
import axios from "axios"
import '../css/home.css';
import { headers,expiry, updatenotify } from "../actions/auth";
import { listuploadvideoURL,listvideofollowingURL,listfollowingcommentURL, listvideorecommendURL } from "../urls";
import { number } from "../constants";
import Video from "./Video"
import Reportvideo from "./Reportvideo"
import {connect} from "react-redux"
import Sinabar from "./Accountsugested";
import Loginhome from "../user/Loginhome";
const origin= window.location.origin
const Listvideo=(props)=>{
    const {loadingdata,listpostdata,statedata,user,isAuthenticated,notify,updatenotify}=props
    const [state,setState]=useState({show_brower:false,show_share:false,full:false,type:0})
    const [requestlogin,setrequestlogin]=useState(false)
    const [listpost,setListpost]=useState([])
    const [loading,setLoading]=useState(false)
    useEffect(()=>{
        setListpost(listpostdata)
        setState(statedata)
        setLoading(loadingdata)
    },[loadingdata,listpostdata,statedata])
    useEffect(()=>{
        window.onscroll=()=>{
            (async ()=>{
                try{
                    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
                    if(clientHeight + scrollTop >= scrollHeight-100 && loading && !state.full){
                        setLoading(false)
                        const url=window.location==origin+'/following'?listfollowingcommentURL:window.location==origin+'/en'?listvideorecommendURL:listuploadvideoURL
                        const res=await axios.get(`${url}?from_item=${listpost.length}`,headers)
                        const listupload=res.data.map(item=>{
                            return({...item,show_info:false,show_comment:false,show_share:false,play:true,muted:true,show_video:false,seconds:Math.floor(item.duration) % 60,minutes:Math.floor(item.duration / 60) % 60})
                        })
                        const listvideoadd=[...listpost,...listupload]
                        
                        setListpost(listvideoadd)
                        if (res.data.length==0){
                            setState({...state,full:true})
                        }
                        setLoading(true)
                    }
                }
                catch{
                    console.log('error')
                }
            })()
        }
        },[loading])
        
    const showlogin=()=>{
        setrequestlogin(true)
    }
    
    
    const setvideochoice=(e,itemchoice,name,value,name_choice,value_choice)=>{
        const listvideo=listpost.map(item=>{
            if(item.id==itemchoice.id){
                if(name_choice!=undefined){
                return({...item,[name]:value,[name_choice]:value_choice})
                }
                
                return({...item,[name]:value})
                
            }
            return({...item})
        })
        setListpost(listvideo)
    }
    const setshowvideo=(e,itemchoice,name,value)=>{
        const listvideo=listpost.map(item=>{
            if(item.id==itemchoice.id){
                if(value==true){
                return({...item,[name]:value,play:true})
                }
                else{
                return({...item,[name]:value,play:false})
                }
            }
            return({...item,[name]:false})
        })
        setListpost(listvideo)
    }
    
    
    return(
        <>
        <div id="main">
            <Navbar
            user={user}
            notify={notify}
            showlogin={()=>showlogin()}
            />
            <div class="tiktok-19fglm-DivBodyContainer eg65pf90">
                <Sinabar
                user={user}
                showlogin={e=>showlogin(e)}
                />
                <div class="tiktok-1id9666-DivMainContainer evzvjqg0">
                    <div>{user!=null && listpost.some(item=>item.notify)?'11111aaaaaaa1':''}</div>
                    {listpost.length>0?
                    <div>
                        {listpost.map(item=>
                        <Video
                            item={item}
                            
                            user={user}
                            updatenotify={(data,notifi_type)=>updatenotify(data,notifi_type)}
                            notify={notify}
                            setshowvideo={(e,item,name,value)=>setshowvideo(e,item,name,value)}
                            setvideochoice={(e,item,name,value,name_choice,value_choice)=>setvideochoice(e,item,name,value,name_choice,value_choice)}
                        />
                        )}
                    </div>:''}
                    
                    <div class="tiktok-ms3iqs-DivFrameContainer efna91q0"></div>
                </div>
                
            </div>
        </div>
        <div id="modal">
            {requestlogin?
            <Loginhome
            setrequestlogin={(value)=>setrequestlogin(value)}
            />:''}
            {listpost.some(item=>item.show_report)?
            <div className="tiktok-py8jux-DivModalContainer e1gjoq3k0">
                <div class="tiktok-1fs75a4-DivModalMask e1gjoq3k1"></div> 
                <Reportvideo
                    video={listpost.find(item=>item.show_report)}
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
export default connect(mapStateToProps,{updatenotify})(Listvideo);