import React,{useState,useEffect,useRef,useCallback} from 'react'
import {useNavigate,useParams,Link} from 'react-router-dom'
const Videouser=({item,setshowvideo,setvideochoice,username})=>{
    const videoref=useRef(null)
    const navigate=useNavigate()
    useEffect(()=>{
        console.log(item)
        if(videoref.current!=null && item.show_video){
        if(item.play){
            videoref.current.play()
        }
        else{
            videoref.current.pause()
        }
        }
    },[item])

    const showcomment=(e)=>{
        e.preventDefault()
        setvideochoice(e,item,'show_comment',true)
    }
    const setshowcomment=(e)=>{    
        navigate(`/${username}/video/${item.id}`)  
    }
    return(
        <div key={item.id}  onMouseLeave={(e)=>setshowvideo(e,item,'show_video',false)} onMouseEnter={(e)=>setshowvideo(e,item,'show_video',true)} class="tiktok-x6y88p-DivItemContainerV2 eqfnwek7">
            <div onClick={(e)=>setshowcomment(e)} data-e2e="user-post-item" class="tiktok-x6f6za-DivContainer-StyledDivContainerV2 eogid780">
                <div style={{paddingTop: '132.653%'}}>
                    <div onClick={(e)=>showcomment(e)} class="tiktok-yz6ijl-DivWrapper e1t9ijiy1">
                        <Link to={`/${username}/video/${item.id}`}>
                            <canvas width="75.38461538461539" height="100" class="tiktok-1yvkaiq-CanvasPlaceholder eqfnwek2"></canvas>
                            <div class="tiktok-1wa52dp-DivPlayerContainer eqfnwek4">
                                <div mode="1" class="tiktok-1jxhpnd-DivContainer e1yey0rl0">
                                    <img mode="1" src={item.video_preview} alt="" loading="lazy" class="tiktok-1itcwxg-ImgPoster e1yey0rl1"/>
                                    {item.show_video && !item.show_comment?
                                    <div class="tiktok-1h63bmc-DivBasicPlayerWrapper e1yey0rl2">
                                        <video src={item.video} playsinline="" muted={true} autoplay="" class="tiktok-lkdalv-VideoBasic e1yey0rl4"></video>
                                    </div>:""}
                                </div>
                                <div class="tiktok-11u47i-DivCardFooter eg8is3p0">
                                    <svg class="like-icon tiktok-h342g4-StyledPlay eg8is3p5" width="18" height="18" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M16 10.554V37.4459L38.1463 24L16 10.554ZM12 8.77702C12 6.43812 14.5577 4.99881 16.5569 6.21266L41.6301 21.4356C43.5542 22.6038 43.5542 25.3962 41.6301 26.5644L16.5569 41.7873C14.5577 43.0012 12 41.5619 12 39.223V8.77702Z"></path></svg><strong data-e2e="video-views" class="video-count tiktok-1p23b18-StrongVideoCount eg8is3p2">0</strong><svg class="private tiktok-z95iwi-StyledLock3pt eg8is3p6" width="18" height="18" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 8.5C20.9624 8.5 18.5 10.9624 18.5 14V18.5H29.5V14C29.5 10.9624 27.0376 8.5 24 8.5ZM32.5 18.5V14C32.5 9.30558 28.6944 5.5 24 5.5C19.3056 5.5 15.5 9.30558 15.5 14V18.5H11C9.61929 18.5 8.5 19.6193 8.5 21V40C8.5 41.3807 9.61929 42.5 11 42.5H37C38.3807 42.5 39.5 41.3807 39.5 40V21C39.5 19.6193 38.3807 18.5 37 18.5H32.5ZM11.5 21.5V39.5H36.5V21.5H11.5Z"></path></svg>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div class="tiktok-1okfv2l-DivTagCardDesc-StyledDivTagCardDescV2 ezlvwzp0">
                <Link title="" to={'/'} class="tiktok-1wrhn5c-AMetaCaptionLine euapl1m0">
                    <div class="tiktok-bv5s0e-DivContainer e18aywvs0"></div>
                </Link>
            </div>
        </div>
    )
}
export default Videouser