import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import axios from "axios";
import { expiry, headers } from "../actions/auth";
import {debounce} from 'lodash';
import createHashtagPlugin from '@draft-js-plugins/hashtag';
import { EditorState,convertToRaw,Modifier } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import {useNavigate} from "react-router-dom"
import Entry from "./Entry"
import createMentionPlugin, {
  defaultSuggestionsFilter,MentionData,MentionPluginTheme,
} from '@draft-js-plugins/mention';
  import { listcommentURL,listhagtagURL,listfollowingURL, actionvideoURL, uploadvideoURL } from "../urls";
const mentionPlugin = createMentionPlugin({ mentionTrigger: '@',mentionPrefix: '@',
supportWhitespace: true });
const mentionPlugin2 = createMentionPlugin({ mentionTrigger: '#',
supportWhitespace: true });
const hashtagPlugin = createHashtagPlugin();
const plugins = [mentionPlugin,hashtagPlugin,mentionPlugin2];
const MentionSuggestions = mentionPlugin.MentionSuggestions;
const MentionSuggestions2 =mentionPlugin2.MentionSuggestions;  
const Formupload=(props)=>{
    const {files,setstate,fileid,loading,listimage,setlistimage}=props
    const [state,setState]=useState({text:'',show_viewer:false,viewer:[{name:'Public',value:'1'},{name:'Friends',value:'2'},{name:'Private',value:'3'}]})
    const [formData,setFormData]=useState({stitch:true,comment:true,duet:true,copyright:false,viewer:'1'})
    const [showResult, setShowResult] = useState(true);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [hashtag,setHashtag]=useState([]);
    const ref = useRef(null);
    const editor=useRef(null)
    
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );
    
    useEffect(()=>{
      if(ref!=null&&ref.current!=null){
          setState({...state,text:ref.current.editor.editor.innerText})
         
        } 
      },[editorState])
  
      const onChange = useCallback((editorState) => {
        setEditorState(editorState);
        console.log(editorState)
      },[]);
  
      const onOpenChange2 = useCallback(() => {
        setOpen2(!open2);
        setOpen(false);
      }, [open2,open]);
      const onOpenChange = useCallback(() => {
        setOpen(!open);
        setOpen2(false);
      }, [open,open2]);
      
      const onSearchChange = useCallback(({ trigger,value }) => {
        fetchkeyword(trigger,value) 
        
        setSuggestions(defaultSuggestionsFilter(value, suggestions,trigger));
    }, []);
    console.log('anhd')
    const dragItem = useRef(null)
	const dragOverItem = useRef(null)
	//const handle drag sorting
	const handleSort = () => {
		//duplicate items
		let _fruitItems = listimage.map(item=>{
            return({...item,choice:false})
        })
		//remove and save the dragged item content
		const draggedItemContent = _fruitItems.splice(dragItem.current, 1)[0]
        console.log(draggedItemContent)
		//switch the position
		_fruitItems.splice(dragOverItem.current, 0, draggedItemContent)
		//reset the position ref
		dragItem.current = null
		dragOverItem.current = null
        
		//update the actual array
		setlistimage(_fruitItems)
	}

	//handle name change
	

	//handle new item addition
	

    
    const fetchkeyword=useCallback(debounce((trigger,value)=>{
      (async ()=>{
        try{ 
            const res = await axios.get(`${trigger=="@"?listfollowingURL:listhagtagURL}?keyword=${value}`,headers)
            if(trigger=="@"){
            setSuggestions(res.data)
            }
            else{
              setHashtag(res.data)
            }
          }
          catch{
            console.log('error')
          }
      })()
    },1000),[])
   
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const entityMap = rawContentState.entityMap;
    console.log(entityMap)
    const submit=(e)=>{    
                e.stopPropagation()
                const listtext=document.querySelectorAll('.public-DraftStyleDefault-block>span')
                let text=[]
                for(let i=0;i<listtext.length;i++){
                    if(listtext[i].classList.contains('m6zwb4v')){
                        text.push({"text":listtext[i].innerText.replace('@',''),"type":"tag"})
                    }
                    else if(listtext[i].classList.contains('hngfxw3')){
                        text.push({"text":listtext[i].innerText.replace('#',''),"type":"hashtag"})
                    }
                    else{
                        text.push({"text":listtext[i].innerText,"type":"text"})
                    }
                }
                const caption=JSON.stringify(text)
                
                let  form=new FormData()
                Object.keys(formData).map(item=>{
                    form.append(item,formData[item])
                })
                form.append('video_id',fileid)
                form.append('caption',caption)
                Object.values(entityMap).map(entity => {
                    if(entity.data.mention!=undefined && entity.data.mention.username!=undefined){
                        form.append('tag',entity.data.mention.id)
                    }
                })
                
                rawContentState.blocks[0].text.split(' ').map(item=>{
                    if(item.includes('#')){
                        form.append('hashtag',item)
                    }
                })
                axios.post(uploadvideoURL,form,headers)
                .then(res=>{
                setstate('success',true)
            })
    }
    const sendTextToEditor = (text) => {
        setEditorState(insertText(text, editorState));
      };
    
      const insertText = (text, editorValue) => {
        const currentContent = editorValue.getCurrentContent();
        const currentSelection = editorValue.getSelection();
    
        const newContent = Modifier.replaceText(
          currentContent,
          currentSelection,
          text
        );
    
        const newEditorState = EditorState.push(
          editorValue,
          newContent,
          "insert-characters"
        );
        return EditorState.forceSelection(
        newEditorState,
        newContent.getSelectionAfter()
        );
    };

    const setviewer=(e,item)=>{
        e.stopPropagation() 
        setFormData({...formData,viewer:item.value})
        setState({...state,show_viewer:false})
    }
    return(
        <div className="jsx-2580397738 form-v2">
            <div className="jsx-2580397738 caption-wrap-v2">
                <div className="jsx-1717967343 container">
                    <div className={`jsx-1717967343 ${state.text.includes('@') && showResult?'hide-display':''}`}>
                        <div className="jsx-1717967343 text-container">
                            <span className="css-wpwnoe">Chú thích</span>
                            <span className="jsx-1717967343 require-font">
                                <span className="jsx-1717967343 ">{rawContentState.blocks[0].text.length} </span>/ 150
                            </span>
                        </div>
                        <div className="jsx-1717967343 margin-t-4">
                            <div tabIndex="0" className="jsx-1043401508 jsx-723559856 jsx-1657608162 jsx-3887553297 container-v2">
                                <div className="jsx-1043401508 jsx-723559856 jsx-1657608162 jsx-3887553297 editor">      
                                    <Editor
                                    editorState={editorState}
                                    plugins={plugins}
                                    onChange={onChange}
                                    ref={editor}
                                    />
                                </div>
                                <div onClick={()=>sendTextToEditor('@')} className="jsx-1043401508 jsx-723559856 jsx-1657608162 jsx-3887553297 icon-style at">
                                    <img src="https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/at.062a03e9.svg" className="jsx-1043401508 jsx-723559856 jsx-1657608162 jsx-3887553297"/>
                                </div>
                                <div onClick={()=>sendTextToEditor('#')} className="jsx-1043401508 jsx-723559856 jsx-1657608162 jsx-3887553297 icon-style hash">
                                    <img src="https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/hashtag.234f1b9c.svg" className="jsx-1043401508 jsx-723559856 jsx-1657608162 jsx-3887553297"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`jsx-1717967343 container-at`}>
                        <div className="jsx-1717967343 margin-t-4">
                            <div className="jsx-2745951964">     
                                <MentionSuggestions
                                    open={open}
                                    onOpenChange={onOpenChange}
                                    suggestions={suggestions}
                                    onSearchChange={onSearchChange}
                                    entryComponent={Entry}
                                    popoverContainer={({ children }) => 
                                    <div className="tiktok-2qnxeb-DivMentionSuggestionContainer e1npxakq7">
                                        <div className="tiktok-16el7uh-DivContainer ewopnkv0">
                                            <div className="tiktok-16el7uh-DivContainer ewopnkv0">
                                            {children}
                                            </div>
                                        </div>
                                    </div>}
                                />
                                        
                                <MentionSuggestions2
                                    open={open2}
                                    onOpenChange={onOpenChange2}
                                    suggestions={hashtag}
                                    onSearchChange={onSearchChange}
                                    entryComponent={Entry}
                                    popoverContainer={({ children }) => 
                                    <div className="tiktok-2qnxeb-DivMentionSuggestionContainer e1npxakq7">
                                        <div className="tiktok-16el7uh-DivContainer ewopnkv0">
                                            <div className="tiktok-16el7uh-DivContainer ewopnkv0">
                                                {children}
                                            </div>
                                        </div>
                                    </div>}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="jsx-2580397738 margin-t-24 margin-b-4">
                <span className="css-1rssc4n">Ảnh bìa</span>
                <div className="jsx-662133185 jsx-1690480325 container-v2">
                    <div className="jsx-662133185 jsx-1690480325 bg-container-v2 empty">
                        {listimage.length==0 || !loading?
                        <div className="jsx-662133185 jsx-1690480325 candidate-v2 empty"></div>
                        :<>
                        {listimage.map((item,index)=>
                        <img 
                        onDragStart={(e) => {
                            dragItem.current = index
                            const listdata=listimage.map((file,i)=>{
                                if(i==index){
                                    return({...file,choice:true})
                                }

                                return({...file,choice:false})
                            })
                            setlistimage(listdata)
                        }}
						onDragEnter={(e) => (dragOverItem.current = index)}
						onDragEnd={()=>handleSort()}
						onDragOver={(e) => e.preventDefault()}
                        draggable
                         src={item.media_preview} className={`jsx-662133185 ${item.choice?'active':''} jsx-1690480325 candidate-v2 bg`}/>
                        )}
                        </>}
                    </div>
                    
                    {listimage.length==0 || !loading?
                    <div className="jsx-662133185 jsx-1690480325 chosen-v2 empty" style={{transform: 'translate3d(4px, 1px, 0px) scaleX(1.1) scaleY(1.1)'}}>
                        <div className="jsx-662133185 jsx-1690480325"></div>
                    </div>
                    :
                    <div className="jsx-662133185 jsx-1690480325 chosen-v2" style={{transform: 'translate3d(4px, 1px, 0px) scaleX(1.1) scaleY(1.1)'}}>
                        <div className="jsx-662133185 jsx-1690480325">
                            <video src="blob:https://www.tiktok.com/252902b2-23b3-4ab1-b009-cbbe40d29b34" preload="auto" playsinline="" draggable="false" className="candidate-v2 candidate-video-v2"></video>
                        </div>
                    </div>}
                </div>
            </div>
            <div className="jsx-1504123287 margin-t-24">
                <div className="jsx-1504123287 title-v2">
                    <span className="css-1rssc4n">Ai có thể xem video này</span>
                </div>
                <div onClick={()=>setState({...state,show_viewer:!state.show_viewer})} className="tiktok-select" style={{width: '300px', height: '36px'}}>
                    <div className="tiktok-select-selector" style={{width: '300px', height: '36px', border: '1px solid rgba(22, 24, 35, 0.12)', background: 'rgb(255, 255, 255)'}}>
                        <div className="tiktok-select-selector-left" style={{maxWidth: '90%'}}>
                            <div className="tiktok-select-selector-prefix-icon" style={{flexShrink: 0}}></div>
                            <span className="tiktok-select-selector-text tiktok-select-selector-text-checked" style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{state.viewer.find(item=>item.value==formData.viewer).name}</span>
                        </div>
                        <div style={{transform: `rotate(${state.show_viewer?180:0}deg)`, transition: 'all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1) 0s', display:'flex', justifyContent: 'center', alignItems: 'center', transformOrigin: 'center center', flexShrink: 0}} className="tiktok-select-selector-postfix-icon">
                            <svg width="14" height="14" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M25.5187 35.2284C24.7205 36.1596 23.2798 36.1596 22.4816 35.2284L8.83008 19.3016C7.71807 18.0042 8.63988 16 10.3486 16H37.6517C39.3604 16 40.2822 18.0042 39.1702 19.3016L25.5187 35.2284Z"></path></svg>
                        </div>
                    </div>
                    {state.show_viewer?
                    <div className="tiktok-select-dropdown" style={{direction: 'ltr', width: '300px'}}>
                        {state.viewer.map(item=>
                        <span onClick={(e)=>setviewer(e,item)} className={`tiktok-select-dropdown-item ${formData.viewer==item.value?'is-selected':''}`}>{item.name}</span>
                        )}
                            
                    </div>:''}
                </div>
                
                <div className="jsx-1504123287 title-v2  margin-t-24">
                        <span className="css-1rssc4n">Cho phép người dùng:</span>
                </div>
                <div className="jsx-1504123287 checkbox-container">
                    <div className="jsx-1504123287 checkbox">
                        <div className="css-ypesld">
                            <label for="tux_0xm2ek7scxbn" data-tux-checkbox-label="true" className="css-14gj7xv">
                                <span className="css-cnt6wy">Bình luận</span>
                            </label>
                            <div onClick={()=>setFormData({...formData,comment:!formData.comment})} data-tux-checkbox-input-wrapper="true" className="css-4pkwts">
                                <input id="tux_0xm2ek7scxbn" type="checkbox" data-tux-checkbox-input="true" className="css-1pzrh5a" checked=""/>
                                <div className={`${formData.comment?'css-mbgljv':'css-3wpmrz'}`}>
                                    <svg width="12" height="9.600000000000001" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.88632 5.95189L8.77465 0.915431C8.96697 0.717276 9.28352 0.712552 9.48168 0.904878L9.67738 1.09483C9.87553 1.28715 9.88026 1.6037 9.68793 1.80185L4.34296 7.3088C4.093 7.56633 3.67963 7.56633 3.42967 7.3088L0.948335 4.75227C0.756009 4.55411 0.760734 4.23757 0.958888 4.04524L1.15459 3.85529C1.35275 3.66297 1.66929 3.66769 1.86162 3.86584L3.88632 5.95189Z" fill="currentColor"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="jsx-1504123287 checkbox">
                        <div className="css-ypesld">
                            <label for="tux_fa6xib9ctoj" data-tux-checkbox-label="true" className="css-14gj7xv">
                                <span className="css-cnt6wy">Duet</span>
                            </label>
                            <div onClick={()=>setFormData({...formData,duet:!formData.duet})} data-tux-checkbox-input-wrapper="true" className="css-4pkwts">
                                <input id="tux_fa6xib9ctoj" type="checkbox" data-tux-checkbox-input="true" className="css-1pzrh5a" checked=""/>
                                <div className={`${formData.duet?'css-mbgljv':'css-3wpmrz'}`}>
                                    <svg width="12" height="9.600000000000001" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.88632 5.95189L8.77465 0.915431C8.96697 0.717276 9.28352 0.712552 9.48168 0.904878L9.67738 1.09483C9.87553 1.28715 9.88026 1.6037 9.68793 1.80185L4.34296 7.3088C4.093 7.56633 3.67963 7.56633 3.42967 7.3088L0.948335 4.75227C0.756009 4.55411 0.760734 4.23757 0.958888 4.04524L1.15459 3.85529C1.35275 3.66297 1.66929 3.66769 1.86162 3.86584L3.88632 5.95189Z" fill="currentColor"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="jsx-1504123287 checkbox">
                        <div className="css-ypesld">
                            <label for="tux_v81cs0rtv4t" data-tux-checkbox-label="true" className="css-14gj7xv">
                                <span className="css-cnt6wy">Stitch</span>
                            </label>
                            <div onClick={()=>setFormData({...formData,stitch:!formData.stitch})} data-tux-checkbox-input-wrapper="true" className="css-4pkwts">
                                <input id="tux_v81cs0rtv4t" type="checkbox" data-tux-checkbox-input="true" className="css-1pzrh5a" checked=""/>
                                <div className={`${formData.stitch?'css-mbgljv':'css-3wpmrz'}`}>
                                    <svg width="12" height="9.600000000000001" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.88632 5.95189L8.77465 0.915431C8.96697 0.717276 9.28352 0.712552 9.48168 0.904878L9.67738 1.09483C9.87553 1.28715 9.88026 1.6037 9.68793 1.80185L4.34296 7.3088C4.093 7.56633 3.67963 7.56633 3.42967 7.3088L0.948335 4.75227C0.756009 4.55411 0.760734 4.23757 0.958888 4.04524L1.15459 3.85529C1.35275 3.66297 1.66929 3.66769 1.86162 3.86584L3.88632 5.95189Z" fill="currentColor"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="jsx-1504123287 hint">
                    <span className="css-tad11f"></span>
                </div>
            </div>
            <div className="jsx-1876141926"></div>
            <div className="jsx-824446345 switch-wrap">
                <div className="jsx-824446345 switch-text">
                    <span className="css-1rssc4n">Chạy quy trình kiểm tra bản quyền</span>
                </div>
                <div onClick={()=>setFormData({...formData,copyright:!formData.copyright})} className={`tiktok-switch ${formData.copyright?'is-checked':''}`} role="switch" aria-checked={formData.copyright?true:false} aria-disabled="false">
                    <div className="tiktok-switch__switch-wrapper" style={{width: '44px', height: '24px'}}>
                        <span className="tiktok-switch__switch-inner" style={{width: '20px', height: '20px', left: `${formData.copyright?'calc(100% - 2px)':'2px'}`}}></span>
                    </div>
                </div>
            </div>
            <div className="jsx-824446345 copyright">
                <span className="css-1gv9ukn">Chúng tôi sẽ kiểm tra xem video của bạn có sử dụng âm thanh vi phạm bản quyền hay không. Nếu chúng tôi phát hiện có vi phạm, bạn có thể chỉnh sửa video trước khi đăng.</span>
                <span className="jsx-824446345 learn-more">
                    <span className="css-1iab0r1">Tìm hiểu thêm</span>
                </span>
            </div>
            <div className="jsx-2580397738 button-row">
                <div className="jsx-2580397738 btn-cancel">
                    <button className="css-txoc9t">
                        <div className="css-1db5cpb">
                            <div className="css-1z070dx">Hủy bỏ</div>
                        </div>
                    </button>
                </div>
                <div className="jsx-2580397738 btn-post">
                    <button onClick={(e)=>submit(e)} disabled={files.file!=null && loading?false:true} className="css-n99h88">
                        <div className="css-1db5cpb">
                            <div className="css-1z070dx">Đăng</div>
                        </div>
                    </button>
                </div>
            </div>
        </div> 
    )
}
export default Formupload