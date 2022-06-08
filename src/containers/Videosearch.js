import React,{useState,useEffect,useRef,useCallback} from 'react'
import {Link} from "react-router-dom"
const Videosearch=(props)=>{
    const {item,setshowvideo}=props
    const videoref=useRef(null)
    const [time,setTime]=useState(0)
    const canvas=useRef()
    useEffect(()=>{
        if(videoref.current!=null){
            if(item.play){
                videoref.current.play()
            }
            else{
                videoref.current.pause()
            }
        }
    },[item.play])
    
    return(
        <div onMouseLeave={(e)=>setshowvideo(e,item,'show_video',false)} onMouseEnter={(e)=>setshowvideo(e,item,'show_video',true)} className="tiktok-1soki6-DivItemContainerForSearch eqfnwek9">
        <div data-e2e="search_top-item" className="tiktok-bbkab3-DivContainer e1t9ijiy0">
            <div style={{paddingTop: '133.188%'}}>
                <div className="tiktok-yz6ijl-DivWrapper e1t9ijiy1">
                    <Link to={`/${item.user.username}/video/${item.id}`}>
                        <canvas width="75.08196721311475" height="100" className="tiktok-1yvkaiq-CanvasPlaceholder eqfnwek2"></canvas>
                        <div className="tiktok-1wa52dp-DivPlayerContainer eqfnwek4">
                            <div mode="1" className="tiktok-1jxhpnd-DivContainer e1yey0rl0">
                                <img mode="1" src={item.video_preview}/>
                                <div className="tiktok-1h63bmc-DivBasicPlayerWrapper e1yey0rl2">
                                    <video ref={videoref} src={item.video} playsinline="" muted={true} autoplay="" className="tiktok-lkdalv-VideoBasic e1yey0rl4"></video>
                                </div>
                            </div>
                            <div className="tiktok-11u47i-DivCardFooter eg8is3p0">
                                <div className="tiktok-1txpkn6-DivTimeTag eqfnwek14">4-19</div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
        <div data-e2e="search-card-desc" className="tiktok-qpoknz-DivVideoSearchCardDesc e4iws0m0">
            <div className="tiktok-10h7h3r-DivCardBottomInfo e4iws0m2">
                <div data-e2e="search-card-video-caption" className="tiktok-f22ew5-DivMetaCaptionLine e4iws0m1">
                    <div className="tiktok-1ejylhp-DivContainer e18aywvs0">
                        {JSON.parse(item.caption).map(cap=>{
                            if(cap.type=='tag' || cap.type=='hashtag'){
                                return(
                                    <Link className="tiktok-q3q1i1-StyledCommonLink e18aywvs4" to={`/${cap.type=='hashtag'?`tag/${cap.text}`:`${item.tags.find(user=>cap.text.includes(user.name)).username}`}`}>
                                        <strong className="tiktok-f9vo34-StrongText e18aywvs1">{cap.type=='hashtag'?`#${cap.text}`:`${cap.text}`}</strong>
                                    </Link>
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
                </div>
                <div className="tiktok-1opxf0u-DivPlayLine e4iws0m3">
                    <Link data-e2e="search-card-user-link" to={`/${item.user.username}`}>
                        <div className="tiktok-dq7zy8-DivUserInfo e4iws0m5">
                            <span shape="circle" className="tiktok-tuohvl-SpanAvatarContainer e1e9er4e0" style={{flexShrink: 0, width: '24px', height: '24px'}}>
                                <img loading="lazy" src={item.user.picture} className="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                            </span> 
                            <p data-e2e="search-card-user-unique-id" className="tiktok-2zn17v-PUniqueId e4iws0m6">{item.user.username}</p>
                        </div>
                    </Link>
                    <div data-e2e="search-card-like-container" className="tiktok-1lbowdj-DivPlayIcon e4iws0m4">
                        <svg className="like-icon tiktok-b82ygf-StyledPlay e4iws0m9" width="16" height="16" viewBox="0 0 48 48" fill="rgba(22, 24, 35, 0.75)" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M16 10.554V37.4459L38.1463 24L16 10.554ZM12 8.77702C12 6.43812 14.5577 4.99881 16.5569 6.21266L41.6301 21.4356C43.5542 22.6038 43.5542 25.3962 41.6301 26.5644L16.5569 41.7873C14.5577 43.0012 12 41.5619 12 39.223V8.77702Z"></path></svg>
                        <strong className="tiktok-ws4x78-StrongVideoCount e4iws0m10">161.6K</strong>
                    </div>
                </div>
            </div>
        </div>
      </div> 
    )
}
export default Videosearch