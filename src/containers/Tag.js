import React,{useState,useEffect,useRef,useCallback} from 'react'
import axios from "axios"
import { headers,expiry,updatenotify } from "../actions/auth";
import { hashtagURL,videotagURL } from "../urls";
import { number,timeago } from "../constants"
import {debounce} from 'lodash';
import Sinabar from "./Accountsugested";
import "../css/hashtag.css"
import Navbar from "./Navbar"
import Videosearch from "./Videosearch"
import {useNavigate,useParams} from "react-router-dom"
import {connect} from 'react-redux'
import Videouser from "../user/Videouser"
const Hashtag=({user,isAuthenticated,notify})=>{
    const [state,setState]=useState({index:0,choice:'onner'})
    const [loading,setLoading]=useState(false)
    const [hashtag,setHashtag]=useState(null)
    const [listvideo,setListvideo]=useState([])
    const {name}=useParams()
    useEffect(()=>{
        (async ()=>{
            try{
                const [obj1, obj2] = await axios.all([
                    axios.get(`${hashtagURL}/${name}`,headers),
                    axios.get(`${videotagURL}/${name}`,headers)
                ])
                setHashtag(obj1.data)
                setListvideo(obj2.data)
                setLoading(true)
            }
            catch{
                setState({...state,error:true})
            }
        })()
    },[name])
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

    return(
        <div id="main">
            <Navbar
            user={user}
            notify={notify}
            
            />
            <div class="tiktok-19fglm-DivBodyContainer eg65pf90">
                <Sinabar
                user={user}
                
                />
                <div class="tiktok-w4ewjk-DivShareLayoutV2 efojldo0">
                    <div class="tiktok-1hfe8ic-DivShareLayoutContentV2 efojldo1">
                        <div class="tiktok-1g04lal-DivShareLayoutHeader-StyledDivShareLayoutHeaderV2 efojldo2">
                            <div class="tiktok-fcfffm-DivShareInfo e2qg2m52">
                                <div class="tiktok-14povld-DivDefaultImgContainer e2qg2m59">
                                    <svg width="80" height="80" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M18.41 17L18.9739 7.47047C18.9895 7.20626 19.2083 7 19.473 7H20.4682C20.7558 7 20.9841 7.24206 20.9673 7.52919L20.4135 17H28.41L28.9739 7.47047C28.9895 7.20626 29.2083 7 29.473 7H30.4682C30.7558 7 30.9841 7.24206 30.9673 7.52919L30.4135 17H38.5C38.7761 17 39 17.2239 39 17.5V18.5C39 18.7761 38.7761 19 38.5 19H30.2958L29.7664 28H37.5C37.7761 28 38 28.2239 38 28.5V29.5C38 29.7761 37.7761 30 37.5 30H29.6488L29.0276 40.5596C29.0114 40.8353 28.7748 41.0456 28.4991 41.0294L27.5009 40.9706C27.2252 40.9544 27.0149 40.7178 27.0311 40.4422L27.6453 30H19.6488L19.0276 40.5596C19.0114 40.8353 18.7748 41.0456 18.4991 41.0294L17.5009 40.9706C17.2252 40.9544 17.0149 40.7178 17.0311 40.4422L17.6453 30H9.5C9.22386 30 9 29.7761 9 29.5V28.5C9 28.2239 9.22386 28 9.5 28H17.763L18.2924 19H10.5C10.2239 19 10 18.7761 10 18.5V17.5C10 17.2239 10.2239 17 10.5 17H18.41ZM20.2958 19L19.7664 28H27.763L28.2924 19H20.2958Z"></path></svg>\
                                </div>
                                <div class="tiktok-1hdrv89-DivShareTitleContainer e2qg2m53">
                                    <h1 data-e2e="challenge-title" class="tiktok-3w30yl-H1ShareTitle e2qg2m54">#{name}</h1>
                                    <h2 data-e2e="challenge-vvcount" title="views" class="tiktok-1kjpnro-H2ShareSubTitleThin e2qg2m58">
                                        <strong style={{fontWeight: 'normal'}}>29.3M views</strong>
                                    </h2>
                                </div>
                            </div>
                            <div class="tiktok-1rxc7na-DivShareActions e1pq4u0v8">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5546 8.35111L13.3171 8.16468V7.37972V3.50006L21.4998 12.0001L13.3171 20.5001V16.3738V15.3664L12.3098 15.3738C8.838 15.3994 5.4275 17.0466 2.49983 19.5882C2.54612 19.2536 2.67769 18.641 2.94391 17.8329C3.3786 16.5132 4.01326 15.1988 4.88691 13.971C6.71045 11.4083 9.24414 9.16046 12.5546 8.35111Z" stroke="#161823" stroke-width="2"></path></svg>
                            </div>
                            <div data-e2e="challenge-more" class="tiktok-jzplnh-DivMoreActions e1pq4u0v6">
                                <svg width="24" height="24" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4 24C4 21.7909 5.79086 20 8 20C10.2091 20 12 21.7909 12 24C12 26.2091 10.2091 28 8 28C5.79086 28 4 26.2091 4 24ZM20 24C20 21.7909 21.7909 20 24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28C21.7909 28 20 26.2091 20 24ZM36 24C36 21.7909 37.7909 20 40 20C42.2091 20 44 21.7909 44 24C44 26.2091 42.2091 28 40 28C37.7909 28 36 26.2091 36 24Z"></path></svg>
                            </div>
                        </div>
                        <div class="tiktok-1qb12g8-DivThreeColumnContainer eiyo6ki2">
                            {user!=null?
                            <div class="tiktok-yvmafn-DivVideoFeedV2 e3gtgzk0">
                                {listvideo.map(item=>
                                    <Videouser
                                        item={item}
                                        username={user.username}
                                        setvideochoice={(e,item,name,value,name_choice,value_choice)=>setvideochoice(e,item,name,value,name_choice,value_choice)}
                                        setshowvideo={(e,itemchoice,name,value)=>setshowvideo(e,itemchoice,name,value)}
                                    />
                                    
                                )}
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
export default connect(mapStateToProps)(Hashtag);

