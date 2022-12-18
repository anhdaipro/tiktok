import React,{useState,useEffect,useRef,useCallback} from 'react'
import axios from "axios"
import {useNavigate} from "react-router-dom"
const Player=(props)=>{
    const {item,setvideochoice}=props
    const videoref=useRef(null)
    const [time,setTime]=useState({minutes:0,seconds:0})
    const [volume,setVolume]=useState(0.5)
    const seekbarref=useRef(null)
    const [play,setPlay]=useState(false)
    const [drag,setDrag]=useState({time:false,volume:false})
    const [duration,setDuration]=useState(0)
    const [state,setState]=useState({error:false,view:false,totalTime:0})
    const [muted,setMuted]=useState(true)
    const navigate=useNavigate()
    useEffect(()=>{
        if(muted){
        setVolume(0)
        }
    },[muted])

    useEffect(()=>{
        if(duration){
            if(play){
                videoref.current.play()

            }
            else{
                videoref.current.pause()
            }
        }
    },[duration,videoref,play])
    const settimevideo=(e)=>{
        e.stopPropagation() 
        const rects = progress.current.getBoundingClientRect();
        const {left,width}=rects
        const clientX=e.clientX
        const percent=(clientX-left)/width
        const times=percent*item.duration
        videoref.current.currentTime=times
    }
    const volumeref=useRef()
    const setVolumevideo=(e)=>{
        e.stopPropagation() 
        const rects = seekbarref.current.getBoundingClientRect();
        const volumerects = volumeref.current.getBoundingClientRect();
        const {height,bottom,top}=volumerects
        const clientY=e.clientY
        const value=bottom-clientY
        const percent=value/height>=1?1:value/height<=0?0:value/height
        if(percent>0){
           
            setMuted(false)
        }
        else{
            setMuted(true)
        }
        setVolume(percent)
    }
    
    const progress=useRef()
    
    useEffect(()=>{
        document.addEventListener('mousemove',setprogess)
        return ()=>{
            document.removeEventListener('mousemove',setprogess)
        }
    },[drag.time,progress,drag.volume,seekbarref,state.show_volume])
    
    useEffect(()=>{
        const setdrag=(e)=>{
            setDrag({...drag,time:false,volume:false})
        }
        document.addEventListener('mouseup',setdrag)
        return ()=>{
            document.removeEventListener('mouseup',setdrag)
        }
    },[])
    const setprogess=(e)=>{
        settime(e)
        setvolume(e)
    }
    const settime=(e)=>{
        if(drag.time){
            const rects = progress.current.getBoundingClientRect();
            const clientX=e.clientX
            const left =rects.left
            const width=rects.width
            const min=left
            const max=left+width
            const percent=clientX<min?0:clientX>max?1:(clientX-left)/width
            const times=percent*item.duration
            videoref.current.currentTime=times
        }
    }

    const setvolume=(e)=>{
        if(state.show_volume && drag.volume){
            const rects = seekbarref.current.getBoundingClientRect();
            const volumerects = volumeref.current.getBoundingClientRect();
            const {top,bottom,height}=volumerects
            const clientY=e.clientY
            const min=rects.top
            const max=rects.bottom
            if(clientY>=min && clientY <=max){
                const percent=(bottom-clientY)/height>=1?1:(bottom-clientY)/height<=0?0:(bottom-clientY)/height
                if(percent==0){
                    
                    setMuted(true)
                }
                else{
                    
                    setMuted(false)
                }
                setVolume(percent)
            }
        }
    }
    return(
        <div class="tiktok-5uccoo-DivVideoContainer e1oyh2e27">
            <div  class="tiktok-7tjqm6-DivBlurBackground e1oyh2e8" style={{backgroundImage: `url(&quot;https://p16-sign-va.tiktokcdn.com/tos-useast2a-p-0037-aiso/46934c9b82cd445c954baa7ea6a999af_1652016316~tplv-dmt-logom:tos-useast2a-pv-0037-aiso/210e8379da074de3863841fb7f6b37d4.image?x-expires=1652256000&amp;x-signature=qTVyw4QPMysi9VWk9IUYX9vrx6M%3D&quot;)`}}></div>
            <div class="tiktok-1g216w0-DivVideoWrapper e1oyh2e9">
                <div onClick={(e)=>{
                    e.stopPropagation()
                    setPlay(!play)}} mode="2" class="tiktok-1jxhpnd-DivContainer e1yey0rl0">
                    <img mode="2" src={item.video_preview} alt="Nhạc chế Chuyện Thi Cử 🤣 Có ai thấy nhột khum ta 😆 Chúc các bạn thi thật tốt nha 💪🏻 #thaybeou40" loading="lazy" class="tiktok-j6dmhd-ImgPoster e1yey0rl1"/>
                    {!item.hidden_video?
                    <div  data-e2e="browse-video" class="tiktok-1h63bmc-DivBasicPlayerWrapper e1yey0rl2">
                        <video  
                        onTimeUpdate={()=>{
                            setTime({...time,seconds:videoref.current.currentTime % 60,minutes:Math.floor((videoref.current.currentTime) / 60) % 60
                            })
                        }} 
                        onLoadedData={()=>setDuration(videoref.current.duration)}
                        ref={videoref} 
                        src={item.video} autoplay='' 
                        preload="auto" 
                        muted={muted}
                        playsinline="" 
                        loop class="tiktok-1sm3sg-VideoBasic e1yey0rl4"></video>
                    </div>:''}
                </div>
                <div class="tiktok-hdu6so-DivVideoControlContainer e10mb03c5">
                    <div onClick={(e)=>settimevideo(e)} 
                        onMouseDown={e=>setDrag({...drag,time:true})}
                        ref={progress}
                    class="tiktok-bo5mth-DivSeekBarContainer e10mb03c0">
                        <div  class="tiktok-j48lkt-DivSeekBarProgress e10mb03c2"></div>
                        <div class="tiktok-1ioucls-DivSeekBarCircle e10mb03c4" style={{left: `calc(${(time.minutes*60+time.seconds)/item.duration*100}%)`}}></div>
                        <div class="tiktok-zqr7z4-DivSeekBar e10mb03c3" style={{transform: `scaleX(${(time.minutes*60+time.seconds)/item.duration}) translateY(-50%)`}}></div>
                    </div>
                    <div class="tiktok-o2z5xv-DivSeekBarTimeContainer e10mb03c1">{('0'+time.minutes).slice(-2)}:{('0'+Math.round(time.seconds)).slice(-2)}/{('0'+Math.floor(item.duration / 60) % 60).slice(-2)}:{('0'+Math.floor(item.duration) % 60).slice(-2)}</div>
                </div>
                <div class="tiktok-mzxtw3-DivVideoControlTop e10mb03c7"></div>
                <div class="tiktok-1ap2cv9-DivVideoControlBottom e10mb03c6"></div>
                {item.hidden_video!=undefined&&item.hidden_video?
                <div class="tiktok-13q6cxz-DivMask e1oyh2e2">
                    <div class="tiktok-1xocg1k-DivMaskContainer e1oyh2e3">
                        <div class="tiktok-1gziruu-DivMaskIcon e1oyh2e4">
                            <svg width="40" height="40" viewBox="0 0 16 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M13.9637 0.370662C14.1617 0.168152 14.4882 0.170371 14.6834 0.375552L15.6676 1.40986C15.8531 1.60483 15.851 1.91164 15.6629 2.10407L6.33538 11.644C5.86141 12.1288 5.09629 12.1169 4.6365 11.6177L0.326723 6.93829C0.144403 6.74033 0.151478 6.43358 0.342731 6.24424L1.35546 5.24162C1.55673 5.04237 1.88315 5.0499 2.07502 5.25822L5.5238 9.0028L13.9637 0.370662Z"></path></svg>
                        </div>
                        <div class="tiktok-1u09ewq-DivMaskTitle e1oyh2e5">Cảm ơn bạn đã báo cáo</div>
                        <div class="tiktok-tfag8a-DivMaskDetail e1oyh2e6">Để nâng cao trải nghiệm của bạn, video này đã được ẩn đi. Chúng tôi sẽ hiển thị cho bạn ít video như thế này hơn.</div>
                        <button onClick={(e)=>setvideochoice(e,item,'hidden_video',false,'success_report',false)} class="tiktok-1b20x51-ButtonMask e1oyh2e7">Hiển thị video</button>
                    </div>
                </div>:''}
            </div>
            {play?"":
            <svg  className="tiktok-i8t918-SvgPlayIcon e1oyh2e10" fill="#fff" width="120" height="120" version="1.1" viewBox="0 0 36 36"><path class="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-id-303"></path></svg>}
            <button onClick={(e)=>navigate('/')} data-e2e="browse-close" class="tiktok-bqtu1e-ButtonBasicButtonContainer-StyledCloseIconContainer e1oyh2e12">
                <svg width="18" height="18" viewBox="0 0 9 10" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path d="M1.35299 0.792837L4.49961 3.93944L7.64545 0.792566C7.8407 0.597249 8.15733 0.597223 8.35262 0.792508L8.70669 1.14658C8.90195 1.34184 8.90195 1.65842 8.70669 1.85368L5.56027 5.0001L8.70672 8.14655C8.90198 8.34181 8.90198 8.65839 8.70672 8.85366L8.35316 9.20721C8.1579 9.40247 7.84132 9.40247 7.64606 9.20721L4.49961 6.06076L1.35319 9.20719C1.15793 9.40245 0.841345 9.40245 0.646083 9.20719L0.292629 8.85373C0.0973708 8.65847 0.0973653 8.3419 0.292617 8.14664L3.43895 5.0001L0.292432 1.85357C0.0972034 1.65834 0.0971656 1.34182 0.292347 1.14655L0.645801 0.792924C0.841049 0.597582 1.1577 0.597543 1.35299 0.792837Z"></path></svg>
            </button>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" width="40" height="40" data-e2e="browse-logo" class="tiktok-1ncsqqe-StyledLogo e1oyh2e13"><g fillRule="evenodd" clipPath="url(#logo-icon_svg__a)" clipRule="evenodd"><path fill="#000" d="M0 36c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12V12c0-6.628-5.373-12-12-12H12C5.373 0 0 5.372 0 12v24z"></path><path fill="#25F4EE" d="M30.636 6.288A9.23 9.23 0 0130.35 4h-6.97v26.133c0 3.014-2.056 5.457-5.062 5.457-3.006 0-5.443-2.443-5.443-5.456 0-3.014 2.437-5.457 5.443-5.457.6 0 .797.098 1.337.278v-7.051c-.562-.079-.754-.12-1.337-.12C11.515 17.785 6 23.315 6 30.135c0 6.82 5.515 12.349 12.318 12.349 6.708 0 12.357-5.375 12.51-12.062V17.049c2.528 1.733 5.395 2.746 8.689 2.746V13.19c-4.275 0-7.866-2.933-8.88-6.902z"></path><path fill="#fff" d="M33.12 8.77a9.23 9.23 0 01-.287-2.288h-6.971v26.134c0 3.014-2.055 5.456-5.061 5.456s-5.443-2.442-5.443-5.456a5.45 5.45 0 015.443-5.456c.6 0 .797.097 1.337.277v-7.05c-.562-.08-.754-.12-1.337-.12-6.803 0-12.318 5.529-12.318 12.349S13.998 44.965 20.8 44.965c6.707 0 12.357-5.374 12.51-12.062V19.531c2.528 1.733 5.395 2.747 8.689 2.747v-6.606c-4.275 0-7.866-2.933-8.88-6.901z"></path><path fill="#FE2C55" d="M15.92 35.033a5.446 5.446 0 01-.562-2.416c0-3.014 2.437-5.457 5.443-5.457.523 0 .739.074 1.143.212l.194.066v-7.051l-.21-.03c-.411-.059-.623-.09-1.127-.09-.386 0-.769.018-1.146.053v4.635l-.194-.066c-.404-.138-.62-.212-1.143-.212-3.006 0-5.443 2.443-5.443 5.457a5.46 5.46 0 003.045 4.9zm-4.972 4.997a12.29 12.29 0 009.853 4.935c6.707 0 12.357-5.374 12.51-12.061V19.532c2.528 1.733 5.395 2.746 8.689 2.746v-6.605a9.2 9.2 0 01-2.483-.341v4.463c-3.294 0-6.161-1.013-8.69-2.746v13.372c-.152 6.688-5.802 12.062-12.509 12.062-2.763 0-5.314-.912-7.37-2.453zm23.455-28.401a9.206 9.206 0 01-3.715-5.146h2.145a9.155 9.155 0 001.57 5.146z"></path></g><defs><clipPath id="logo-icon_svg__a"><rect width="48" height="48" fill="#fff" rx="10.5"></rect></clipPath></defs></svg>
            <div class="tiktok-1bhjqk0-DivVoiceControlContainer e1oyh2e26">
                <div ref={seekbarref} onClick={(e)=>setVolumevideo(e)}
                onMouseDown={e=>setDrag({...drag,volume:true})}
                class="tiktok-t8cj5n-DivVolumeControlContainer e1cts53v0">
                    <div ref={volumeref}  class="tiktok-m4h4si-DivVolumeControlProgress e1cts53v1"></div>
                    <div class="tiktok-1wejges-DivVolumeControlCircle e1cts53v3" style={{transform: `translateY(-${(volume)*80}px)`}}></div>
                    <div class="tiktok-18ly8p2-DivVolumeControlBar e1cts53v2" style={{transform: `scaleY(${volume})`}}></div>
                </div>
                <button onClick={(e)=>{
                    e.stopPropagation()
                    setMuted(!muted)
                setVolume(muted?0.5:0)
            }} data-e2e="browse-sound" class="tiktok-z6k360-ButtonVoiceControlNew e1oyh2e25">
                
                    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {muted?
                        <><circle cx="24" cy="24" r="24" fill="000" fill-opacity="1"></circle><path fillRule="evenodd" clipRule="evenodd" d="M21 16.9118C21 15.2513 20.8942 15.0909 20.709 15.0221C20.5238 14.9763 20.3122 14.9992 20.1799 15.1138L15.0741 19.5258H11.4762C11.2116 19.5258 11 19.7092 11 19.9384V28.084C11 28.3132 11.2116 28.4965 11.4762 28.4965H15.0741L20.1799 32.8862C20.3122 33.0008 20.5238 33.0237 20.709 32.9779C20.8942 32.9091 21 32.7487 21 32.5882V16.9118Z" fill="white"></path><path fillRule="evenodd" clipRule="evenodd" d="M35.098 18.9489C34.5998 18.4508 33.7921 18.4508 33.2939 18.949L30.1368 22.1061L26.9797 18.949C26.4815 18.4508 25.6738 18.4508 25.1756 18.9489C24.6775 19.4471 24.6775 20.2548 25.1756 20.753L28.3327 23.9101L25.1757 27.0672C24.6775 27.5654 24.6775 28.3731 25.1757 28.8713C25.6738 29.3694 26.4815 29.3694 26.9797 28.8713L30.1368 25.7142L33.2939 28.8713C33.7921 29.3694 34.5998 29.3694 35.0979 28.8713C35.5961 28.3731 35.5961 27.5654 35.0979 27.0672L31.9409 23.9101L35.098 20.753C35.5962 20.2548 35.5962 19.4471 35.098 18.9489Z" fill="white"></path></>:
                        <>
                        <circle cx="24" cy="24" r="24"></circle><path fillRule="evenodd" clipRule="evenodd" d="M21 16.9118C21 15.2513 20.8942 15.0909 20.709 15.0221C20.5238 14.9763 20.3122 14.9992 20.1799 15.1138L15.0741 19.5258H11.4762C11.2116 19.5258 11 19.7092 11 19.9384V28.084C11 28.3132 11.2116 28.4965 11.4762 28.4965H15.0741L20.1799 32.8862C20.3122 33.0008 20.5238 33.0237 20.709 32.9779C20.8942 32.9091 21 32.7487 21 32.5882V16.9118Z" fill="white"></path><path d="M30.6653 15C32.7348 17.2304 34.0001 20.2174 34.0001 23.5C34.0001 26.7826 32.7348 29.7696 30.6653 32" stroke="white" stroke-width="2.5" stroke-linecap="round"></path><path d="M26.8799 17.8833C28.1994 19.381 28.9999 21.347 28.9999 23.5C28.9999 25.653 28.1994 27.6191 26.8799 29.1168" stroke="white" stroke-width="2.5" stroke-linecap="round"></path></>
                        }
                    </svg>
                </button>
            </div>
            <button data-e2e="arrow-left" class="tiktok-1iiukfq-ButtonBasicButtonContainer-StyledVideoSwitchV2 e11s2kul15">
                <svg width="26" height="26" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M34.4142 22.5858L18.1213 6.29289C17.7308 5.90237 17.0976 5.90237 16.7071 6.29289L15.2929 7.70711C14.9024 8.09763 14.9024 8.7308 15.2929 9.12132L30.1716 24L15.2929 38.8787C14.9024 39.2692 14.9024 39.9024 15.2929 40.2929L16.7071 41.7071C17.0976 42.0976 17.7308 42.0976 18.1213 41.7071L34.4142 25.4142C35.1953 24.6332 35.1953 23.3668 34.4142 22.5858Z"></path></svg>
            </button>
            <button disabled="" data-e2e="arrow-left" class="tiktok-1iiukfq-ButtonBasicButtonContainer-StyledVideoSwitchV2 e1oyh2e15">
                <svg width="26" height="26" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M34.4142 22.5858L18.1213 6.29289C17.7308 5.90237 17.0976 5.90237 16.7071 6.29289L15.2929 7.70711C14.9024 8.09763 14.9024 8.7308 15.2929 9.12132L30.1716 24L15.2929 38.8787C14.9024 39.2692 14.9024 39.9024 15.2929 40.2929L16.7071 41.7071C17.0976 42.0976 17.7308 42.0976 18.1213 41.7071L34.4142 25.4142C35.1953 24.6332 35.1953 23.3668 34.4142 22.5858Z"></path></svg></button><button data-e2e="arrow-right" class="tiktok-2xqv0y-ButtonBasicButtonContainer-StyledVideoSwitchV2 e1oyh2e15"><svg width="26" height="26" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M34.4142 22.5858L18.1213 6.29289C17.7308 5.90237 17.0976 5.90237 16.7071 6.29289L15.2929 7.70711C14.9024 8.09763 14.9024 8.7308 15.2929 9.12132L30.1716 24L15.2929 38.8787C14.9024 39.2692 14.9024 39.9024 15.2929 40.2929L16.7071 41.7071C17.0976 42.0976 17.7308 42.0976 18.1213 41.7071L34.4142 25.4142C35.1953 24.6332 35.1953 23.3668 34.4142 22.5858Z"></path></svg>
            </button>
            <div onClick={(e)=>setvideochoice(e,item,'show_report',true)} data-e2e="browse-report" class="tiktok-1wfi3px-DivReportText e1oyh2e22">
                <svg className="tiktok-1xp708q-SvgIconFlag e1oyh2e23" width="20" height="19" viewBox="0 0 48 48" color="#ffffff" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9 9.31286V27.0626C9.98685 26.7378 11.184 26.4042 12.5108 26.1585C16.1115 25.4917 21.0181 25.4123 25.1625 28.3726C28.0181 30.4123 31.6115 30.4917 34.7608 29.9085C36.306 29.6223 37.6602 29.1908 38.6289 28.8293C38.7603 28.7803 38.8841 28.7328 39 28.6872V10.9374C38.0131 11.2623 36.816 11.5959 35.4892 11.8416C31.8885 12.5084 26.9819 12.5878 22.8375 9.62751C19.9819 7.58781 16.3885 7.5084 13.2392 8.09161C11.694 8.37776 10.3398 8.80927 9.37105 9.17072C9.23971 9.21973 9.11586 9.2673 9 9.31286ZM40.1067 6.21064C40.7264 5.90123 41.4622 5.93453 42.0515 6.29874C42.6411 6.66315 43 7.30688 43 8.00004V30C43 30.7576 42.572 31.4501 41.8944 31.7889L41 30C41.8944 31.7889 41.8931 31.7895 41.8931 31.7895L41.8916 31.7903L41.8878 31.7922L41.8775 31.7973L41.846 31.8127C41.831 31.82 41.8128 31.8288 41.7915 31.839C41.7761 31.8464 41.7589 31.8545 41.7401 31.8634C41.651 31.9055 41.525 31.9637 41.3654 32.0343C41.0466 32.1753 40.5919 32.3663 40.0273 32.577C38.9023 32.9967 37.319 33.5027 35.4892 33.8416C31.8885 34.5084 26.9819 34.5878 22.8375 31.6275C19.9819 29.5878 16.3885 29.5084 13.2392 30.0916C11.694 30.3778 10.3398 30.8093 9.37105 31.1707C9.23971 31.2197 9.11586 31.2673 9 31.3129V44.0001C9 44.5524 8.55228 45.0001 8 45.0001H6C5.44772 45.0001 5 44.5524 5 44.0001V8.00004C5 7.24249 5.42801 6.54996 6.10558 6.21118L7 8.00004C6.10558 6.21118 6.10688 6.21053 6.10688 6.21053L6.10842 6.20976L6.11219 6.20789L6.12249 6.20279L6.15404 6.18734C6.17988 6.17477 6.21529 6.15773 6.25987 6.13667C6.34902 6.09457 6.47498 6.03636 6.63455 5.9658C6.95342 5.8248 7.4081 5.63378 7.9727 5.42311C9.09774 5.00332 10.681 4.49734 12.5108 4.15849C16.1115 3.49171 21.0181 3.4123 25.1625 6.37257C28.0181 8.41227 31.6115 8.49167 34.7608 7.90846C36.306 7.62231 37.6602 7.1908 38.6289 6.82935C39.1112 6.6494 39.4925 6.48886 39.7478 6.37595C39.8754 6.31956 39.9711 6.27523 40.0318 6.24653C40.0622 6.23219 40.0838 6.22177 40.0962 6.21572L40.1056 6.21118L40.1067 6.21064Z"></path></svg>
                Báo cáo
            </div>
        </div> 
    )
}
export default Player