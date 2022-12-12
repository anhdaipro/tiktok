import React,{useState,useEffect,useRef,useCallback} from 'react'
import axios from "axios"
import { listfollowingURL,listhagtagURL,listmusicURL,suggestedaccountURL,listfollowingcommentURL,followinguserURL } from '../urls'
import { expiry,headers } from '../actions/auth'
import { number } from '../constants'
import {Link,NavLink} from "react-router-dom"
const Sinabar=(props)=>{
    const {user,showlogin}=props
    const [state,setState]=useState({show_all_suggested:false,show_all_following:false})
    const [listuser,setListuser]=useState([])
    const [listhagtag,setListhashtag]=useState([])
    const [listmusic,setListmusic]=useState([])
    const list_sugessted=listuser.filter(item=>item.suggested)
    const list_followers=listuser.filter(item=>!item.suggested)
    useEffect(()=>{
        (async ()=>{
            try{
                const [obj1, obj2,obj3,obj4] = await axios.all([
                    axios.get(suggestedaccountURL,headers),
                    axios.get(listhagtagURL,headers),
                    axios.get(listmusicURL,headers),
                    localStorage.token!='null' && expiry>0?axios.get(listfollowingcommentURL,headers):''
                ])
                const list_sugessted=obj1.data.map(item=>{
                    return({...item,suggested:true})
                })
                const list_followers=localStorage.token!='null' && expiry>0?obj4.data.map(item=>{
                    return({...item,suggested:false})
                }):[]
                console.log(list_sugessted)
                setListuser([...listuser,...list_sugessted,...list_followers])
                setListhashtag(obj2.data)
                setListmusic(obj3.data)
            }
            catch{
                setState({...state,error:true})
            }
        })()
    },[])

    

    const addusersuggest=(e)=>{
        (async ()=>{
            try{
                e.stopPropagation()
                const res= await axios.get(`${listfollowingcommentURL}?from_item=${list_sugessted.length}`,headers)
                const list_sugessted=res.data.map(item=>{
                    return({...item,suggested:true})
                })
                setListuser([...listuser,...list_sugessted])
                setState({...state,show_all_suggested:true,show_info:false})
            }
            catch{
                setState({...state,error:true})
            }
        })()
    }
    const adduserfollowing=(e)=>{
        (async ()=>{
            try{
                const res= await axios.get(`${suggestedaccountURL}?from_item=${list_followers.length}`,headers)
                const list_followers=res.data.map(item=>{
                    return({...item,suggested:false})
                })
                setListuser([...listuser,...list_followers])
                setState({...state,show_all_following:true,show_info:false})
            }
            catch{
                setState({...state,error:true})
            }
        })()
    }
    const user_choice=listuser.find(item=>item.show_info)
    const setuser=(e,index,name,value)=>{
        const list_user=listuser.map((item,i)=>{
        if(listuser.indexOf(item)==index){
            return({...item,[name]:value})
        }
        return({...item,[name]:false})
        })
        setListuser(list_user)
        const rects = e.currentTarget.getBoundingClientRect();
        console.log(rects)
        setState({...state,index:value?index:state.index,top:rects.top+rects.height,left:rects.left})
    }
    const setkeepuser=(e,index,name,value)=>{
        const list_user=listuser.map((item,i)=>{
        if(listuser.indexOf(item)==index){
            return({...item,[name]:value})
        }
        return({...item,[name]:false})
        })
        setListuser(list_user)
    }
    const setfollowuser=(e,user_choice)=>{
        (async ()=>{
            let form=new FormData()
            form.append('id',user_choice.user.id)
            try{
                const res = await axios.post(followinguserURL,form,headers)
                const list_users=listuser.map(item=>{
                    if(item.user.username==user_choice.user.username){
                        return({...item,following:res.data.following})
                    }
                    return({...item})
                })
                setListuser(list_users)
            }
            catch{
                console.log('error')
            }
        })()
    }
    
    
    return(
        <div className="tiktok-r0hg2a-DivSideNavContainer eg65pf91">
            <div>
                <div className="tiktok-ixclwa-DivSideNavMask eg65pf92"></div>
                <div className="tiktok-1ebkqxa-DivSideNavContainer e14l9ebt1">   
                    <div className="e14l9ebt0 tiktok-1cx1pch-DivScrollContainer-StyledScroll e1b4u1n1">
                        <div className="tiktok-1a4urrd-DivWrapper e14l9ebt2">
                            <div className="tiktok-1inll25-DivMainNavContainer e14l9ebt8">
                                <div>
                                    <NavLink data-e2e="nav-foryou" style={{border:'none'}} className="tiktok-chxswy-StyledTmpLink e14l9ebt5" to="/en">
                                        {({isActive}) => (
                                        <>
                                            <svg width="32" height="32" viewBox="0 0 48 48" fill={isActive?'rgba(254, 44, 85, 1.0)':'rgba(22, 24, 35, 1.0)'} xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.9505 7.84001C24.3975 7.38666 23.6014 7.38666 23.0485 7.84003L6.94846 21.04C6.45839 21.4418 6.2737 22.1083 6.48706 22.705C6.70041 23.3017 7.26576 23.7 7.89949 23.7H10.2311L11.4232 36.7278C11.5409 38.0149 12.6203 39 13.9128 39H21.5C22.0523 39 22.5 38.5523 22.5 38V28.3153C22.5 27.763 22.9477 27.3153 23.5 27.3153H24.5C25.0523 27.3153 25.5 27.763 25.5 28.3153V38C25.5 38.5523 25.9477 39 26.5 39H34.0874C35.3798 39 36.4592 38.0149 36.577 36.7278L37.7691 23.7H40.1001C40.7338 23.7 41.2992 23.3017 41.5125 22.705C41.7259 22.1082 41.5412 21.4418 41.0511 21.04L24.9505 7.84001Z"></path></svg>
                                            <h2 className={`${isActive?'tiktok-1g27b7n-H2MainNavText':"tiktok-1tfqc6a-H2MainNavText"} e14l9ebt7`}>For You</h2>
                                        </>)}
                                        
                                    </NavLink>
                                </div>
                                <div>
                                    <NavLink data-e2e="nav-following" style={{border:'none'}} className="tiktok-chxswy-StyledTmpLink e14l9ebt5" to="/following">
                                        {({isActive}) =>(
                                            <>
                                                <svg width="32" height="32" viewBox="0 0 48 48" fill={isActive?'rgba(254, 44, 85, 1.0)':'rgba(22, 24, 35, 1.0)'} xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M18 12.5C15.5897 12.5 13.5849 14.5018 13.5849 17.0345C13.5849 19.5672 15.5897 21.569 18 21.569C20.4103 21.569 22.4151 19.5672 22.4151 17.0345C22.4151 14.5018 20.4103 12.5 18 12.5ZM10.5849 17.0345C10.5849 12.9017 13.8766 9.5 18 9.5C22.1234 9.5 25.4151 12.9017 25.4151 17.0345C25.4151 21.1673 22.1234 24.569 18 24.569C13.8766 24.569 10.5849 21.1673 10.5849 17.0345ZM18 29.8793C14.0801 29.8793 10.7403 32.5616 9.69697 36.2673C9.5473 36.7989 9.03833 37.1708 8.49337 37.0811L7.50662 36.9189C6.96166 36.8292 6.58837 36.3131 6.72325 35.7776C8.00732 30.6788 12.5509 26.8793 18 26.8793C23.449 26.8793 27.9927 30.6788 29.2767 35.7776C29.4116 36.3131 29.0383 36.8292 28.4934 36.9189L27.5066 37.0811C26.9617 37.1708 26.4527 36.7989 26.303 36.2673C25.2597 32.5616 21.9199 29.8793 18 29.8793Z"></path><path fillRule="evenodd" clipRule="evenodd" d="M33 31.5371C32.2445 31.5371 31.5198 31.668 30.8447 31.9093C30.3246 32.0951 29.7189 31.9243 29.4549 31.4392L28.9769 30.5608C28.713 30.0757 28.8907 29.463 29.4009 29.2516C30.513 28.791 31.7285 28.5371 33 28.5371C37.4554 28.5371 41.1594 31.6303 42.2706 35.7812C42.4135 36.3147 42.0386 36.8308 41.4935 36.9196L40.5065 37.0804C39.9614 37.1692 39.4546 36.7956 39.2894 36.2686C38.4217 33.5 35.91 31.5371 33 31.5371Z"></path><path fillRule="evenodd" clipRule="evenodd" d="M33 18.5C31.6193 18.5 30.5 19.6193 30.5 21C30.5 22.3807 31.6193 23.5 33 23.5C34.3807 23.5 35.5 22.3807 35.5 21C35.5 19.6193 34.3807 18.5 33 18.5ZM27.5 21C27.5 17.9624 29.9624 15.5 33 15.5C36.0376 15.5 38.5 17.9624 38.5 21C38.5 24.0376 36.0376 26.5 33 26.5C29.9624 26.5 27.5 24.0376 27.5 21Z"></path></svg>
                                                <h2 className={`${isActive?'tiktok-1g27b7n-H2MainNavText':"tiktok-1tfqc6a-H2MainNavText"} e14l9ebt7`}>Following</h2>
                                            </>
                                        )}
                                       
                                    </NavLink>
                                </div>
                                <div>
                                    <NavLink to="/live" data-e2e="nav-live" style={{border:'none'}} className="tiktok-chxswy-StyledTmpLink e14l9ebt5">
                                        {({isActive})=>(
                                            <>
                                                <svg width="32" height="32" viewBox="0 0 32 32" fill={isActive?'rgba(254, 44, 85, 1.0)':'rgba(22, 24, 35, 1.0)'} xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M7.78511 10.3334C6.95518 10.3334 6.33301 10.9792 6.33301 11.7143V20.2858C6.33301 21.0209 6.95518 21.6667 7.78511 21.6667H18.5744C19.4043 21.6667 20.0265 21.0209 20.0265 20.2858V17.5602C20.0265 17.1826 20.2392 16.8372 20.5763 16.6672C20.9135 16.4973 21.3177 16.5317 21.6212 16.7563L25.6663 19.7488V12.2513L21.6212 15.2439C21.3177 15.4684 20.9135 15.5029 20.5763 15.3329C20.2392 15.1629 20.0265 14.8175 20.0265 14.4399V11.7143C20.0265 10.9792 19.4043 10.3334 18.5744 10.3334H7.78511ZM25.6855 12.2371C25.6831 12.2388 25.6839 12.2383 25.6839 12.2383L25.6855 12.2371ZM25.6716 12.2177C25.673 12.2212 25.6746 12.2243 25.6763 12.2269C25.6798 12.2324 25.6834 12.2355 25.6855 12.2371L25.6874 12.2383C25.6874 12.2383 25.6865 12.238 25.6839 12.2383M4.33301 11.7143C4.33301 9.81952 5.90653 8.33337 7.78511 8.33337H18.5744C20.453 8.33337 22.0265 9.81953 22.0265 11.7143V12.4562L24.4963 10.629C25.0929 10.1877 25.8879 10.1155 26.5542 10.4359C27.224 10.758 27.6663 11.4325 27.6663 12.1905V19.8096C27.6663 20.5676 27.224 21.2421 26.5542 21.5642C25.888 21.8846 25.0929 21.8124 24.4963 21.371L22.0265 19.5439V20.2858C22.0265 22.1806 20.453 23.6667 18.5744 23.6667H7.78511C5.90653 23.6667 4.33301 22.1806 4.33301 20.2858V11.7143Z"></path><path d="M15 15.134C15.6667 15.5189 15.6667 16.4811 15 16.866L12 18.5981C11.3333 18.983 10.5 18.5019 10.5 17.7321L10.5 14.2679C10.5 13.4981 11.3333 13.017 12 13.4019L15 15.134Z"></path></svg>
                                                <h2 className={`${isActive?'tiktok-1g27b7n-H2MainNavText':"tiktok-1tfqc6a-H2MainNavText"} e14l9ebt7`}>LIVE</h2>
                                            </>
                                        )}
                                        
                                    </NavLink>
                                </div>
                            </div>
                            {user!=null?'':
                            <div className="tiktok-ms3iqs-DivFrameContainer efna91q0">
                                <p data-e2e="nav-login-tip" className="tiktok-105v97b-PLoginHint efna91q1">Log in to follow creators, like videos, and view comments.</p>
                                <button onClick={(e)=>showlogin(e)} type="button" data-e2e="nav-login-button" className="efna91q2 tiktok-7i6i4k-Button-StyledLogin ehk74z00">Log in</button>
                            </div>}
                            <div className="tiktok-1liq5tk-DivUserContainer e4a681b0">
                                <p data-e2e="suggest-accounts" className="tiktok-kkg08c-PTitle e4a681b1">Suggested accounts</p>
                                {listuser.map((item,index)=>{
                                    if(item.suggested){
                                        return(
                                <div onMouseEnter={(e)=>setuser(e,index,'show_info',true)} onMouseLeave={(e)=>setuser(e,index,'show_info',false)} key={index} className="tiktok-kwqs83-DivUserLinkContainer e797se20">
                                    <Link data-e2e="suggest-user-avatar" to={`/${item.user.username}`}>
                                        <div className="e797se22 tiktok-n1lhfn-DivContainer-StyledUserAvatar e1vl87hj1" style={{width: '32px', height: '32px'}}>
                                            <span shape="circle" className="e1vl87hj2 tiktok-gigx3u-SpanAvatarContainer-StyledAvatar e1e9er4e0" style={{width: '32px', height: '32px'}}>
                                                <img loading="lazy" src={item.user.picture} className="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                                            </span>
                                        </div>
                                    </Link>
                                    <Link className="tiktok-1g0yu4c-StyledUserContentLink e797se24" to={`/${item.user.username}`}>
                                        <div className="tiktok-yt7cul-DivUserTitleWrapper e797se26">
                                            <h4 data-e2e="suggest-user-title" className="tiktok-arsb3q-H4UserTitle e797se27">{item.user.username}</h4>
                                            <div data-e2e="suggest-user-bluev">
                                                <svg className="tiktok-shsbhf-StyledVerifyBadge e1aglo370" width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="#20D5EC"></circle><path fillRule="evenodd" clipRule="evenodd" d="M37.1213 15.8787C38.2929 17.0503 38.2929 18.9497 37.1213 20.1213L23.6213 33.6213C22.4497 34.7929 20.5503 34.7929 19.3787 33.6213L10.8787 25.1213C9.70711 23.9497 9.70711 22.0503 10.8787 20.8787C12.0503 19.7071 13.9497 19.7071 15.1213 20.8787L21.5 27.2574L32.8787 15.8787C34.0503 14.7071 35.9497 14.7071 37.1213 15.8787Z" fill="white"></path></svg>
                                            </div>
                                        </div>
                                        <p data-e2e="suggest-user-desc" className="tiktok-1f4lmy9-PUserDesc e797se29">{item.user.name}</p>
                                    </Link>
                                </div>)}}
                                )}
                                {state.show_all_suggested || list_sugessted.length<5?'':
                                <div onClick={(e)=>addusersuggest(e)} data-e2e="see-all" className="tiktok-1n9adg1-DivShowMoreTextContainer e4a681b2">
                                    <p data-e2e="suggest-see-all" className="tiktok-1ezua2b-PShowMoreText e4a681b3">See all</p>
                                </div>}
                            </div>
                            {user!=null?
                            <div className="tiktok-1liq5tk-DivUserContainer e4a681b0">
                                <p data-e2e="suggest-accounts" className="tiktok-kkg08c-PTitle e4a681b1">Các tài khoản đang follow</p>
                                {listuser.map((item,index)=>{
                                    if(!item.suggested){
                                    return(
                                    <div key={index} className="tiktok-kwqs83-DivUserLinkContainer e797se20"> 
                                        <Link data-e2e="following-user-avatar" to={`/${item.user.username}`}>
                                            <div className="e797se22 tiktok-n1lhfn-DivContainer-StyledUserAvatar e1vl87hj1" style={{width: '32px', height: '32px'}}>
                                                <span shape="circle" className="e1vl87hj2 tiktok-gigx3u-SpanAvatarContainer-StyledAvatar e1e9er4e0" style={{width: '32px', height: '32px'}}>
                                                <img loading="lazy" src={item.user.picture} className="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                                                </span>
                                            </div>
                                        </Link>
                                        <Link className="tiktok-1g0yu4c-StyledUserContentLink e797se24" to={`/${item.user.username}`}>
                                            <div className="tiktok-yt7cul-DivUserTitleWrapper e797se26">
                                                <h4 data-e2e="following-user-title" className="tiktok-arsb3q-H4UserTitle e797se27">{item.user.username}</h4>
                                            </div>
                                            <p data-e2e="following-user-desc" className="tiktok-1f4lmy9-PUserDesc e797se29">{item.user.name}</p>
                                        </Link>
                                    </div>
                                )}})}
                                {state.show_all_following || list_followers.length<5?'':
                                <div data-e2e="see-all" className="tiktok-1n9adg1-DivShowMoreTextContainer e4a681b2">
                                    <p onClick={(e)=>adduserfollowing(e)} data-e2e="following-see-all" className="tiktok-1ezua2b-PShowMoreText e4a681b3">See all</p>
                                </div>}
                            </div>
                            :''}
                            <div className="tiktok-5gba95-DivDiscoverContainer eikhr9j2">
                                <p data-e2e="nav-discover-title" className="tiktok-m6qd4i-PDiscoverTitle eikhr9j3">Discover</p>
                                <div className="tiktok-1ca819s-DivDiscoverListContainer eikhr9j4">
                                    {listhagtag.map(item=>
                                    <Link data-e2e="nav-discover-href" className="tiktok-1rw2y63-StyledTmpLink eikhr9j6" key={item.id} to={`/tag/${item.name.replace('#','')}?lang=en`}>
                                        <div className="tiktok-1qlwqct-DivDiscoverItemContainer eikhr9j7">
                                            <svg className="tiktok-1hy6k9f-StyledNumber eikhr9j9" width="16" height="16" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M16.4263 15L16.9566 3.95205C16.9822 3.41902 17.4218 2.99999 17.9554 2.99999H19.9494C20.5202 2.99999 20.9752 3.47701 20.9483 4.04718L20.4308 15H28.4263L28.9566 3.95205C28.9822 3.41902 29.4218 2.99999 29.9554 2.99999H31.9494C32.5202 2.99999 32.9752 3.47701 32.9483 4.04718L32.4308 15H43C43.5523 15 44 15.4477 44 16V18C44 18.5523 43.5523 19 43 19H32.2404L31.8118 28H42C42.5523 28 43 28.4477 43 29V31C43 31.5523 42.5523 32 42 32H31.6213L31.0434 44.0479C31.0178 44.581 30.5782 45 30.0446 45H28.0507C27.4798 45 27.0248 44.523 27.0518 43.9528L27.6168 32H19.6213L19.0434 44.0479C19.0178 44.581 18.5782 45 18.0446 45H16.0507C15.4798 45 15.0248 44.523 15.0518 43.9528L15.6168 32H5C4.44772 32 4 31.5523 4 31V29C4 28.4477 4.44772 28 5 28H15.8073L16.2358 19H6C5.44772 19 5 18.5523 5 18V16C5 15.4477 5.44772 15 6 15H16.4263ZM20.2404 19L19.8118 28H27.8073L28.2358 19H20.2404Z"></path></svg>
                                            <p className="tiktok-1sw5kok-PText eikhr9j12">{item.name.replace('#','')}</p>
                                        </div>
                                    </Link>)}
                                </div>
                            </div>
                            <div className="tiktok-1clhv1s-DivPlaceholder e14l9ebt6"></div>
                            <div className="tiktok-1oisxeb-DivFooterContainer el3hfgg0">
                                <div className="tiktok-1lepjzi-DivLinkContainer el3hfgg1">
                                    <a href="https://www.tiktok.com/about?lang=en" data-e2e="page-link" target="_blank" className="tiktok-4fb5qk-StyledNavLink el3hfgg3">About</a>
                                    <a href="https://newsroom.tiktok.com/" data-e2e="page-link" target="_blank" className="tiktok-4fb5qk-StyledNavLink el3hfgg3">Newsroom</a>
                                    <a href="https://www.tiktok.com/about/contact?lang=en" data-e2e="page-link" target="_blank" className="tiktok-4fb5qk-StyledNavLink el3hfgg3">Contact</a>
                                    <a href="https://careers.tiktok.com" data-e2e="page-link" target="_blank" className="tiktok-4fb5qk-StyledNavLink el3hfgg3">Careers</a>
                                    <a href="https://www.bytedance.com/" data-e2e="page-link" target="_blank" className="tiktok-4fb5qk-StyledNavLink el3hfgg3">ByteDance</a>
                                </div>
                                <div className="tiktok-1lepjzi-DivLinkContainer el3hfgg1">
                                    <a href="https://www.tiktok.com/forgood" data-e2e="program-link" target="_blank" className="tiktok-4fb5qk-StyledNavLink el3hfgg3">TikTok for Good</a>
                                    <a href="https://www.tiktok.com/business/?attr_medium=tt_official_site_guidance&amp;attr_source=tt_official_site&amp;refer=tiktok_web" data-e2e="program-link" target="_blank" className="tiktok-4fb5qk-StyledNavLink el3hfgg3">Advertise</a>
                                    <a href="https://developers.tiktok.com/?refer=tiktok_web" data-e2e="program-link" target="_blank" className="tiktok-4fb5qk-StyledNavLink el3hfgg3">Developers</a><a href="https://www.tiktok.com/transparency?lang=en" data-e2e="program-link" target="_blank" className="tiktok-4fb5qk-StyledNavLink el3hfgg3">Transparency</a>
                                    <a href="https://www.tiktok.com/tiktok-rewards/en" data-e2e="program-link" target="_blank" className="tiktok-4fb5qk-StyledNavLink el3hfgg3">TikTok Rewards</a></div><div className="tiktok-1lepjzi-DivLinkContainer el3hfgg1"><a href="https://support.tiktok.com/en" data-e2e="legal-link" target="_blank" className="tiktok-4fb5qk-StyledNavLink el3hfgg3">Help</a>
                                    <a href="https://www.tiktok.com/safety?lang=en" data-e2e="legal-link" target="_blank" className="tiktok-4fb5qk-StyledNavLink el3hfgg3">Safety</a>
                                    <a href="https://www.tiktok.com/legal/terms-of-service?lang=en" data-e2e="legal-link" target="_blank" className="tiktok-4fb5qk-StyledNavLink el3hfgg3">Terms</a>
                                    <a href="https://www.tiktok.com/legal/privacy-policy-row?lang=en" data-e2e="legal-link" target="_blank" className="tiktok-4fb5qk-StyledNavLink el3hfgg3">Privacy</a>
                                    <a href="https://www.tiktok.com/creators/creator-portal/en-us/" data-e2e="legal-link" target="_blank" className="tiktok-4fb5qk-StyledNavLink el3hfgg3">Creator Portal</a>
                                    <a href="https://www.tiktok.com/community-guidelines?lang=en" data-e2e="legal-link" target="_blank" className="tiktok-4fb5qk-StyledNavLink el3hfgg3">Community Guidelines</a>
                                </div>
                                <span data-e2e="copyright" className="tiktok-ztf279-SpanCopyright el3hfgg2">© 2022 TikTok</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {listuser.some(item=>item.show_info)?
                    <div  onMouseLeave={(e)=>setkeepuser(e,state.index,'show_info',false)} onMouseEnter={(e)=>setkeepuser(e,state.index,'show_info',true)} style={{left:`${state.left}px`,top:`${state.top}px`}}  className="tiktok-xhmvja-DivProfileOuterContainer er095111">
                        <div className="tiktok-g4dx3b-DivPaddingTop er095110"></div>
                        <div className="tiktok-vnenbs-DivProfileContainer er095112">
                            <div className="tiktok-1tu3lcg-DivHeadContainer er095113">
                                <a target="_blank" rel="noopener" data-e2e="user-card-avatar" className="tiktok-h0b8t7-StyledAvatarLink er095116" href={`/${user_choice.user.username}?lang=en`}>
                                    <span shape="circle" className="tiktok-tuohvl-SpanAvatarContainer e1e9er4e0" style={{width: '44px', height: '44px'}}>
                                        <img loading="lazy" src={user_choice.user.picture} className="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                                    </span>
                                </a>
                                <button onClick={(e)=>setfollowuser(e,user_choice)} type="button" data-e2e="user-card-follow" className="tiktok-230my5-Button ehk74z00">{user_choice.following?'Following':'Follow'}</button>
                            </div>
                            <a target="_blank" rel="noopener" className="tiktok-gk82i-StyledUserTitle er095114" href={`/${user_choice.user.username}?lang=en`}>
                                <span data-e2e="user-card-username">{user_choice.user.username}</span>
                            </a><br/>
                            <a target="_blank" rel="noopener" data-e2e="user-card-nickname" className="tiktok-px0n0u-StyledUserName er095115" href={`/${user_choice.user.username}?lang=en`}>{user_choice.user.name} 👑</a>
                            <p className="tiktok-1gj7x9t-PUserStat er095117">
                                <span data-e2e="user-card-follower-count" className="tiktok-ceyvsn-SpanUserStatsText er095118">{number(user_choice.count_followers)}</span>
                                <span data-e2e="user-card-follower" className="tiktok-1n85168-SpanUserStatsDesc er095119">Followers</span>
                                <span data-e2e="user-card-like-count" className="tiktok-ceyvsn-SpanUserStatsText er095118">{number(user_choice.count_likers)}</span>
                                <span data-e2e="user-card-like" className="tiktok-1n85168-SpanUserStatsDesc er095119">Likes</span>
                            </p>
                            <p data-e2e="user-card-user-bio" className="tiktok-1ch7xpw-PSignature er0951110">💌 CONTACT FOR WORK 💌
                                Insta: {user_choice.user.username}
                                FB: Duy Thái
                            </p>
                        </div>
                    </div>:''}
        </div> 
    )
}
export default Sinabar