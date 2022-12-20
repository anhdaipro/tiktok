import Navbar from "./Navbar"
import React,{useState,useEffect,useRef,useCallback} from 'react'
import axios from "axios"
import '../css/search.css';
import { headers,expiry } from "../actions/auth";
import { listcommentURL, listuploadvideoURL,videoseachURL,userseachURL } from "../urls";
import { number } from "../constants";
import {useSearchParams} from "react-router-dom"
import Videosearch from "./Videosearch"

const Searchitem=()=>{
    const chocie_search=[{name:'Top',type:undefined},{name:'Accounts',type:'account'},{name:'Videos',type:'video'}]
    const [state,setState]=useState()
    const [listuser,setListuser]=useState([])
    const [listvideo,setListvideo]=useState([])
    const [loading,setLoading]=useState(false)
    const [params, setSearchParams] = useSearchParams();
    const reftab=useRef()
    const [searchitem,setSearchitem]=useState({keyword:new URLSearchParams(document.location.search).get('keyword')})
    const search=Object.fromEntries([...params])
    useEffect(()=>{
        (async ()=>{
            try{
                const [obj1, obj2] = await axios.all([
                    params.get('type')==null||params.get('type')=='account'?axios.get(`${userseachURL}?${params}`,headers()):'',
                    params.get('type')==null||params.get('type')=='video'?axios.get(`${videoseachURL}?${params}`,headers()):'',
                ])
                const list_sugessted=obj1.data.map(item=>{
                    return({...item,suggested:true})
                })
                setListuser(list_sugessted)
                const list_video=obj2.data.map(item=>{
                    return({...item,show_video:false})
                })
                setListvideo(list_video)
                setLoading(true)
            }
            catch{
                setState({...state,error:true})
            }
        })()
    },[params])

    useEffect(() => {
        let active= document.querySelector('.tiktok-yj1tul-DivTab div')
        if(loading){
            reftab.current.style.width=active.offsetWidth+'px'
            reftab.current.style.transform=`translateX(${active.offsetLeft}px)`
        }
    }, [loading,params])
    const setshowvideo=(e,itemchoice,name,value)=>{
        const listvideos=listvideo.map(item=>{
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
        setListvideo(listvideos)
    }
    
    const settype=(e,item)=>{
        const type_order=item.type!=undefined?{...searchitem,type:item.type}:{keyword:searchitem.keyword}
        setSearchitem(type_order)
       
    }
    useEffect(()=>{
        setSearchParams({...params,...searchitem})
    },[searchitem])
    return(
        <>
            <div id="main">
                <Navbar
            
                />
                {loading?<>
                <div className="tiktok-19fglm-DivBodyContainer eg65pf90">
                    <div className="tiktok-r0hg2a-DivSideNavContainer eg65pf91">
                        <div>
                            <div className="tiktok-ixclwa-DivSideNavMask eg65pf92"></div>
                                <div className="tiktok-1ebkqxa-DivSideNavContainer e14l9ebt1">
                                </div> 
                            </div> 
                        </div> 
                    </div> 
                    <div className="tiktok-mldqij-DivMainContainer ezds1l0">
                    <div className="tiktok-lg9f76-DivTabsContainer ezds1l1">
                        <div className="tiktok-1wurba7-DivTabsContainer e15xxsk0">
                            <div className="tiktok-1ikcsgc-DivTabsNavContainer e1ker74c0">
                                <div className="tiktok-383u6u-DivTabsNavList e1ker74c1">
                                    {chocie_search.map(item=>
                                    <div  onClick={(e)=>settype(e,item)} className={`${item.type==search.type?`tiktok-yj1tul-DivTab`:'tiktok-nyjj62-DivTab'} e1ker74c3`}>
                                        <div role="tab" aria-selected="true" id="tabs-0-tab-search_top" aria-controls="tabs-0-panel-search_top">{item.name}</div>
                                    </div>
                                    )}
                                    
                                    
                                </div>
                                <div ref={reftab} className="tiktok-1xvn0zl-DivTabInk e1ker74c2" style={{ width: '26px'}}></div>
                            </div>
                            <div>
                                <div role="tabpanel" aria-labelledby="tabs-0-tab-search_top" aria-hidden="false" tabIndex="0" id="tabs-0-tabpanel-search_top"></div>
                                <div role="tabpanel" aria-labelledby="tabs-0-tab-search_account" aria-hidden="true" tabIndex="-1" style={{display:'none'}} id="tabs-0-tabpanel-search_account"></div>
                                <div role="tabpanel" aria-labelledby="tabs-0-tab-search_video" aria-hidden="true" tabIndex="-1" style={{display:'none'}} id="tabs-0-tabpanel-search_video"></div>
                            </div>
                        </div>
                    </div>
                    <div className="tiktok-1fwlm1o-DivPanelContainer ezds1l2">
                        <div className="tiktok-1qb12g8-DivThreeColumnContainer eiyo6ki2">
                            <div className="tiktok-ifco6m-DivVideoFeed eiyo6ki0">
                                {search.type=='account' || search.type==null?
                                <div className="tiktok-1eqw6mr-DivBlockContainer ezds1l3">
                                    <div className="tiktok-16hsq8f-DivTitleContainer ezds1l4">
                                        <p data-e2e="search-top-user-title" className="tiktok-y1tgyi-PTitle ezds1l6">Accounts</p>
                                        {listuser.length>2?
                                        <p data-e2e="search-top-user-see-more" className="tiktok-ic5235-PSeeMore ezds1l7">See more
                                            <svg className="tiktok-1kz5qfu-StyledChevronLeftOffset ezds1l8" width="10" height="10" viewBox="0 0 48 48" fill="#161823" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4.58579 22.5858L20.8787 6.29289C21.2692 5.90237 21.9024 5.90237 22.2929 6.29289L23.7071 7.70711C24.0976 8.09763 24.0976 8.7308 23.7071 9.12132L8.82843 24L23.7071 38.8787C24.0976 39.2692 24.0976 39.9024 23.7071 40.2929L22.2929 41.7071C21.9024 42.0976 21.2692 42.0976 20.8787 41.7071L4.58579 25.4142C3.80474 24.6332 3.80474 23.3668 4.58579 22.5858Z"></path></svg>
                                        </p>:''}
                                    </div>
                                    {listuser.map(profile=>
                                    <div data-e2e="search-user-container" className="tiktok-133zmie-DivLink e16h36ua0">
                                        <a data-e2e="search-user-avatar" className="tiktok-1bltwtr-StyledAvatarUserLink e16h36ua2" href={`/${profile.user.username}`}>
                                            <div className="tiktok-uha12h-DivContainer e1vl87hj1" style={{width: '60px', height: '60px'}}>
                                                <span shape="circle" className="e1vl87hj2 tiktok-gigx3u-SpanAvatarContainer-StyledAvatar e1e9er4e0" style={{width:'60px', height: '60px'}}>
                                                    <img loading="lazy" src={profile.user.picture} className="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/></span>
                                            </div>
                                        </a>
                                        <a data-e2e="search-user-info-container" className="tiktok-14p1pn2-StyledDivInfoWrapper e16h36ua3" href={`/${profile.user.username}`} style={{textDecoration: 'none'}}>
                                            <p data-e2e="search-user-unique-id" className="tiktok-1v1eqb4-PTitle e16h36ua4">{profile.user.username}</p>
                                            <div className="tiktok-1av3vif-DivSubTitleWrapper e16h36ua5">
                                                <h2 className="tiktok-1n69p9f-H2SubTitle e16h36ua6">{profile.user.name}</h2> · 
                                                <strong>{number(profile.count_followers)} <span>Followers</span></strong>
                                            </div>
                                            <p className="tiktok-1jq7d8a-PDesc e16h36ua7">
                                                <strong>FLOW EM DII</strong>
                                            </p>
                                        </a>
                                    </div>)}
                                    <div className="tiktok-te1uci-DivTitleDivide ezds1l5"></div>
                                </div>:''}
                                {search.type=='video' || search.type==null?<>
                                <div className="tiktok-1eqw6mr-DivBlockContainer ezds1l3">
                                    <div className="tiktok-67r7bb-DivTitleContainer ezds1l4">
                                        <p data-e2e="search-top-video-title" className="tiktok-y1tgyi-PTitle ezds1l6">Videos</p>
                                    </div>
                                </div>
                                {listvideo.map(item=>
                                <Videosearch
                                item={item}
                                setshowvideo={(e,item,name,value)=>setshowvideo(e,item,name,value)}
                                />
                                )}</>:''}
                            </div>
                        </div>
                    </div>
                </div></> :''}
            
            </div>
        </>
    )
}
export default Searchitem