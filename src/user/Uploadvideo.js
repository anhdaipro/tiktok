import Navbar from "../containers/Navbar"
import React,{useState,useEffect,useRef,useCallback} from 'react'
import { dataURLtoFile } from "../constants"
import {useNavigate} from 'react-router-dom'
import {connect} from 'react-redux'
import axios from "axios";
import "../css/user.css"
import { expiry, headers } from "../actions/auth";
import {videoloadURL } from "../urls";
import Formupload from "./Formupload"
const Uploadvideo=({user,isAuthenticated})=>{
    const [state,setState]=useState({fullscreen:false,change_video:false,muted:true})  
    const navigate=useNavigate()
    const [files,setFile]=useState({file:null,video:null,list_image:[]})
    const inputfile=useRef(null)
    const videoref=useRef(null)
    const baref=useRef(null)
    const [loading,setLoading]=useState(false)
    const [idfile,setIdfile]=useState(null)
    const [time,setTime]=useState({minutes:0,seconds:0})
    const [listimage,setListimage]=useState([])
    const [percent,setPercent]=useState(0)
    useEffect(()=>{
        if(videoref.current!=null){
            if(!state.play){
                videoref.current.pause()
            }
            else{
                videoref.current.play()
            }
        }
    },[files,state])
    useEffect(()=>{
        if(idfile){
            const timer=setTimeout(()=>{
            setTime({seconds:Math.floor(videoref.current.currentTime) % 60,minutes:Math.floor((videoref.current.currentTime) / 60) % 60})
            },1000)
            return ()=>clearTimeout(timer)
        }
    },[time,idfile])

    useEffect(()=>{
        (async ()=>{
            const res = await isAuthenticated
            if (!localStorage.token || expiry()<=0){
                window.location.href="/"
            }
        })()
    },[isAuthenticated])
   
    let fileupload={}
    const file_check=['.avi','.m4v','.mp4','.mpg']
    const check_value=(value)=>{
        if(file_check.some(item=>value.includes(item))){
            const item=file_check.find(item=>value.includes(item))
            return value.replace(item.toString(),'')
        }
    }
    let list_image=[]
    useEffect(()=>{
        if(listimage.length==0 && files){
        list_image.length=0
        let video = document.createElement('video');
        let i = 1;
        video.addEventListener('loadeddata', function() {
            this.currentTime = i;
        });
        video.addEventListener('seeked', function() {
            // now video has seeked and current frames will show
            // at the time as we expect
            generateThumbnail(i);
            // when frame is captured, increase here by 5 seconds
            i += files.duration/8;
            // if we are not past end, seek to next interval
            if (i <= this.duration) {
              // this will trigger another seeked event
              this.currentTime = i;
            }
            else {
              // Done!, next action
                return
            }
        });
        function generateThumbnail(i) {   
            
            let canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            let image = canvas.toDataURL("image/png");
            let file_preview = dataURLtoFile(image,'dbc9a-rg53.png');
            list_image.push({media_preview:image,file_preview:file_preview,time:i})
            setListimage(list_image)
        }
       
        video.preload = 'metadata';
        video.src=files.video
    }
    },[files])
    
    const previewFile=(e)=>{
        [].forEach.call(e.target.files, function(file) {
            var url = (window.URL || window.webkitURL).createObjectURL(file);
            var video = document.createElement('video');
            var timeupdate = function() {  
                if(snapImage()){
                    ( async ()=>{
                        try{
                            let form=new FormData()
                            setLoading(false)
                            var sendDate = (new Date()).getTime();
                            timeprocess()     
                            form.append('file',fileupload.file)
                            form.append('file_preview',fileupload.file_preview,)
                            form.append('duration',Math.round(fileupload.duration))
                            const res=await axios.post(videoloadURL,form,headers())
                            var receiveDate = (new Date()).getTime();
                            var responseTimeMs = (receiveDate - sendDate)/1000
                            setLoading(true)
                            setPercent(100)
                            setIdfile(res.data.id)
                        }
                        catch{

                        }
                    })()
                    
                    video.removeEventListener('timeupdate',timeupdate)
                    
                }
            }
            
            video.addEventListener('loadeddata', e =>{        
                snapImage()   
                });
            let snapImage = function() {
            let canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            let image = canvas.toDataURL("image/png");
            let file_preview = dataURLtoFile(image,'dbc9a-rg53.png');
            let success = image.length > 100000; 
            if (success) {
                setFile({...files,length:video.length,file:file,name:check_value(file.name),file_preview:file_preview,video:url,list_image:[(window.URL || window.webkitURL).createObjectURL(file_preview)],duration:Math.round(video.duration)})
                setState({...state,play:true})
                fileupload={file:file,duration:Math.round(video.duration),file_preview:file_preview,list_image:[(window.URL || window.webkitURL).createObjectURL(file_preview)]}
                URL.revokeObjectURL(url);
                }
                return success;
            };
          
            video.addEventListener('timeupdate', timeupdate);
            video.preload = 'metadata';
            video.src = url;
                // Load video in Safari / IE11
            video.muted = true;
            video.playsInline = true;
            video.play();  
        }) 
    }
          

    const timeprocess=()=>{
        setPercent(0)
        let percents=0
        const timers=setInterval(()=>{
         percents+=10
        setPercent(percents>=100?99:percents)
        },1000) 
        return ()=>clearInterval(timers)  
    }
    const seteditvideo=()=>{
        setState({...state,change_video:false})
        let form =new FormData()
        form.append('id',idfile)
        form.append('duration',Math.round(files.duration))
        axios.post(videoloadURL,form,headers())
        .then(res=>{
            setIdfile(null)
            setFile({...files,file:null,list_image:[],id:null})
        })
    }
    
    const setplayvideo=(e)=>{
        setState({...state,play:!state.play})
        
    }
    const setvolum=()=>{
        setState({...state,muted:!state.muted})  
    }
    const setlistimage=(data)=>{
        setListimage(data)
    }

    const settimevideo=(e)=>{
        e.stopPropagation()
        const rects = baref.current.getBoundingClientRect();
        const x = e.clientX - rects.left;
        const times=(x/rects.width)*files.duration
       
        videoref.current.currentTime=times
    }

    const resetpage=()=>{
        setState({...state,change_video:false,muted:true,show_viewer:false,success:false})
        window.location.href="/upload"
    }
    
    const setstate=(name,value)=>{
        setState({...state,[name]:value})
    }
    return(
        <>
        <div id="main" className="desktop-container"> 
            <Navbar/> 
            <div className="main-body page-with-header">
                <div className="jsx-740312492 layout">
                    <div className="jsx-175208557 layout">
                        <div className="jsx-410242825 container-v2">
                            <span className="css-n23t8l">Tải video lên</span>
                            <div className="jsx-410242825 sub-title-v2">
                                <span className="css-nyj7ur">Đăng video vào tài khoản của bạn</span>
                            </div>
                            <div className="jsx-410242825 contents-v2">
                                <div className="jsx-410242825 uploader">
                                    {files.file==null?
                                    <div onClick={(e)=>inputfile.current.click()} className="jsx-2404389384 upload">
                                        <input ref={inputfile} onChange={(e)=>previewFile(e)} type="file" accept="video/*" className="jsx-2404389384 " style={{display: 'none'}}/>
                                        <div className="jsx-2404389384 upload-card before-upload-stage">
                                            <img src="https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/cloud-icon1.ecf0bf2b.svg" className="jsx-2404389384 cloud-icon"/>
                                            <div className="jsx-2404389384 text-main">
                                                <span className="css-1q42136">Chọn video để tải lên</span>
                                            </div>
                                            <div className="jsx-2404389384 text-sub">
                                                <span className="css-1wbo2p7">Hoặc kéo và thả tập tin</span>
                                            </div>
                                            <div className="jsx-2404389384 text-video-info">
                                                <div className="jsx-2404389384">
                                                    <span className="css-tad11f">MP4 hoặc WebM</span>
                                                </div>
                                                <div className="jsx-2404389384">
                                                    <span className="css-tad11f">Độ phân giải 720x1280 trở lên</span>
                                                </div>
                                                <div className="jsx-2404389384">
                                                    <span className="css-tad11f">Tối đa 10 phút</span>
                                                </div>
                                                <div className="jsx-2404389384">
                                                    <span className="css-tad11f">Ít hơn 2 GB</span>
                                                </div>
                                            </div>
                                            <div className="jsx-2404389384 file-select-button">
                                                <button className="css-14w2a8u">
                                                    <div className="css-1db5cpb">
                                                        <div className="css-1z070dx">Select file</div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    :<>
                                    <div className={`jsx-1545465582 preview-v2 ${state.fullscreen?'player-fullscreen':'player'}`}>
                                        {loading?<>
                                        <video ref={videoref} src={files.video} autoplay='' preload="auto" playsinline="" muted={state.muted?true:false} className={state.fullscreen?'player-fullscreen':'player'} loop></video>
                                        <div className="jsx-4048669318 video-controls-v2">
                                            <div className="jsx-4048669318 video-controls-v2-bottom">
                                                <div className="jsx-4048669318 details">
                                                    <div className="jsx-4048669318 left">
                                                        <span onClick={(e)=>setplayvideo(e)} className="jsx-4048669318 play-btn">
                                                            <img src={`${state.play!=undefined&& state.play?'https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/pause.3f559180.svg':'https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/play.6cac639f.svg'}`} className="jsx-4048669318 icon"/>
                                                        </span>
                                                        <span className="jsx-4048669318 time">{('0'+time.minutes).slice(-2)}:{(`0${Math.round(time.seconds)}`).slice(-2)} /{('0'+Math.floor(files.duration / 60) % 60).slice(-2)}:{(`0${Math.round(Math.floor(files.duration) % 60)}`).slice(-2)}</span>
                                                    </div>
                                                    <div className="jsx-4048669318 right">
                                                        <span onClick={()=>setvolum()} className="jsx-4048669318 volume">
                                                            <img src={state.muted?'https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/mute.75fcd465.svg':'https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/volume.507835e8.svg'} className="jsx-4048669318 icon"/>
                                                        </span>
                                                        <span onClick={()=>setState({...state,fullscreen:!state.fullscreen})} className="jsx-4048669318 maximize">
                                                            <img src="https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/fullscreen.399035a9.svg" className="jsx-4048669318 icon"/>
                                                        </span>
                                                    </div>
                                                </div>
                                               
                                                <div onClick={(e)=>settimevideo(e)} className="jsx-4048669318 prograess-wrap">
                                                    <div ref={baref} class="jsx-4048669318 progress-bar"></div>
                                                    {state.play!=undefined && videoref.current!=null?<>
                                                    <div  class="jsx-4048669318 circle" style={{'left': `${(time.minutes*60+time.seconds)/files.duration*baref.current.offsetWidth}px`}}></div>
                                                    <div class="jsx-4048669318 bar" style={{'width': `${(time.minutes*60+time.seconds)/files.duration*baref.current.offsetWidth}px`}}></div>  </>  
                                                    :''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="jsx-1545465582 title">
                                            <div className="jsx-1545465582 following">Đang Follow</div>
                                            <div className="jsx-1545465582 for-you">Dành cho bạn</div>
                                        </div>
                                        <div className="jsx-1545465582 meta-data">
                                            <div className="jsx-1545465582 username">@Phạm Đại</div>
                                            <div className="jsx-1545465582 caption">{files.name}</div>
                                            <div className="jsx-1545465582 sound-container">
                                                <div className="jsx-1545465582 music-icon">
                                                    <img src="https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/music_icon.7576d62b.svg" className="jsx-1545465582"/>
                                                </div>
                                                <div className="jsx-1545465582 sound">
                                                    <div className="jsx-1545465582 marquee">
                                                        <p className="jsx-1545465582">Âm thanh gốc - Phạm Đại
                                                            <span className="jsx-1545465582">&nbsp;</span>
                                                        </p>
                                                        <p className="jsx-1545465582">Âm thanh gốc - Phạm Đại
                                                            <span className="jsx-1545465582">&nbsp;</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="jsx-1545465582 avatar-container">
                                            <img src={user.picture} className="jsx-1545465582 avatar "/>

                                        </div>
                                        <div className="jsx-1545465582 album-container">
                                            <div className="jsx-1545465582 album"></div>
                                            <img src={user.picture} className="jsx-1545465582 avatar rotate"/>
                                        </div>
                                        <div className="jsx-1545465582 music-bar-icon">
                                            <img src="https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/iconbar_right.8fa90e26.svg" className="jsx-1545465582"/>

                                        </div>
                                        <div className="jsx-1545465582 music-symbols">
                                            <div className="jsx-1545465582 music-symbol1"></div>
                                            <div className="jsx-1545465582 music-symbol2"></div>
                                            <div className="jsx-1545465582 music-symbol3"></div>
                                        </div>
                                        {!state.fullscreen?
                                        <div className="jsx-1545465582 tiktok-app-frame"></div>
                                        :''}</>
                                        :
                                        <div className="jsx-2404389384 upload-card uploading-stage">
                                            <div class="loader" data-pct="14" style={{width: '80px', height: '80px'}}>
                                                
                                
                                            </div>
                                            <div class="jsx-2404389384 uploading-stage-text">Uploading {files.name}</div>
                                            <button onClick={()=>setFile({...files,file:null,list_image:[],id:null})} class="css-1gmhaaw">
                                                <div >
                                                    <div >Cancel</div>
                                                </div>
                                            </button>
                                        </div>
                                        }
                                    </div>
                                    {loading?
                                    <div className="jsx-1545465582 change-video-btn">
                                        <div className="jsx-1545465582 file">
                                            <img src="https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/check_icon.8e166106.svg" className="jsx-1545465582"/>
                                            <div className="jsx-1545465582 file-text">d18efac771ed3d2fa5d80ec0689d237c_bsadImc.mp4</div>
                                        </div>
                                        <div onClick={()=>setState({...state,change_video:true})} className="jsx-1545465582 btn">Thay đổi video</div>
                                    </div>:''}</>
                                    }
                                </div>
                                <Formupload
                                files={files}
                                listimage={listimage}
                                fileid={idfile}
                                setlistimage={data=>setListimage(data)}
                                loading={loading}
                                setstate={(name,value)=>setstate(name,value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="modal">
            {state.change_video || state.success?
            <div className="jsx-461155393 jsx-3220008684 mask-container modal-mask-container">
                <div className="jsx-461155393 jsx-3220008684 modal">
                    <div className="jsx-461155393 jsx-3220008684 modal-title-container">
                        {state.success?
                        <div class="jsx-461155393 jsx-3220008684 modal-title">Your video is being uploaded to TikTok!</div>
                        :<>
                        <div className="jsx-461155393 jsx-3220008684 modal-title">Replace this video?</div>
                       <div className="jsx-461155393 jsx-3220008684 modal-sub-title">Caption and video settings will still be saved.</div>
                       </>}
                    </div>
                    {state.change_video?<>
                    <div onClick={()=>seteditvideo()} className="jsx-461155393 jsx-3220008684 modal-btn emphasis">Replace</div>
                    <div onClick={()=>setState({...state,change_video:false})} className="jsx-461155393 jsx-3220008684 modal-btn">Continue editing</div>
                    </>:<>
                    <div onClick={()=>resetpage()} class="jsx-461155393 jsx-3220008684 modal-btn emphasis">Upload another video</div>
                    <div onClick={()=>navigate(`/${user.username}`)} class="jsx-461155393 jsx-3220008684 modal-btn">View profile</div></>}
                </div>
                <div className="jsx-461155393 jsx-3220008684 mask modal-mask"></div>
            </div>:''}
        </div>
        
        </>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user
});
export default connect(mapStateToProps)(Uploadvideo);
