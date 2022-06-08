import React,{useState,useEffect,useRef,useCallback} from 'react'
import axios from "axios"
import { headers,expiry, updatenotify } from "../actions/auth";
import { listvideorecommendURL} from "../urls";
import {connect} from "react-redux"
import Listvideo from "./Listvideo"
const Recommend=(props)=>{
    const {isAuthenticated}=props
    const [state,setState]=useState({show_brower:false,show_share:false,full:false,type:0})
    const [listpost,setListpost]=useState([])
    const [loading,setLoading]=useState(false)
    
    useEffect(()=>{
        (async ()=>{
            try{
                await isAuthenticated
                const res = await axios.get(listvideorecommendURL,headers)
                const listupload=res.data.map(item=>{
                    return({...item,show_info:false,show_comment:false,show_share:false,play:true,muted:true,show_video:false,seconds:Math.floor(item.duration) % 60,minutes:Math.floor(item.duration / 60) % 60})
                })
                setListpost(listupload)
                setLoading(true)
                
                if(res.data.length==0){
                    setState({...state,full:true})
                }
                
            }
            catch{
                console.log('error')
            }
        })()
    },[])


    return(
        <Listvideo
            statedata={state}
            loadingdata={loading}
            listpostdata={listpost}
        />
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.isAuthenticated,user:state.user,notify:state.notify
});
export default connect(mapStateToProps)(Recommend);