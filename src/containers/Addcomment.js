import EmojiPicker from "../hocs/EmojiPicker"
import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'
import {actioncommentURL,listfollowingURL,actionvideoURL,listfollowingcommentURL} from "../urls"
import axios from "axios"
import { headers,expiry,updatenotify } from "../actions/auth";
import {debounce} from 'lodash';
import Editor from '@draft-js-plugins/editor';
import { EditorState,convertToRaw,Modifier } from 'draft-js';
import createMentionPlugin, {
  defaultSuggestionsFilter,MentionData,MentionPluginTheme,
} from '@draft-js-plugins/mention';
import {useNavigate} from "react-router-dom"
import io from "socket.io-client"




function Entry(props){
  const {
    mention,
    theme,
    searchValue, 
    isFocused,
    ...parentProps
  } = props;

  return (
    <div {...parentProps} >
        <div key={mention.id} data-e2e="comment-at-list" className="tiktok-d4c6zy-DivItemBackground ewopnkv6">
            <div className="tiktok-1rn2hi8-DivItemContainer ewopnkv5">
                <span shape="circle" className="tiktok-tuohvl-SpanAvatarContainer e1e9er4e0" style={{flex: '0 0 40px', width: '40px', height: '40px'}}>
                    <img loading="lazy" src={mention.picture} className="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                </span>
                <div className="tiktok-4f7266-DivInfoContainer ewopnkv7">
                    <p className="tiktok-15s5y80-PMentionInfoLine ewopnkv8">
                        <span data-e2e="comment-at-nickname" className="tiktok-evv4sm-SpanInfoNickname ewopnkv9">{mention.name}</span>
                            <span className="tiktok-14bueqa-SpanInfoVerify ewopnkv12">
                            <svg className="tiktok-shsbhf-StyledVerifyBadge e1aglo370" width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="#20D5EC"></circle><path fillRule="evenodd" clipRule="evenodd" d="M37.1213 15.8787C38.2929 17.0503 38.2929 18.9497 37.1213 20.1213L23.6213 33.6213C22.4497 34.7929 20.5503 34.7929 19.3787 33.6213L10.8787 25.1213C9.70711 23.9497 9.70711 22.0503 10.8787 20.8787C12.0503 19.7071 13.9497 19.7071 15.1213 20.8787L21.5 27.2574L32.8787 15.8787C34.0503 14.7071 35.9497 14.7071 37.1213 15.8787Z" fill="white"></path></svg>
                        </span>
                    </p>
                    <p className="tiktok-15s5y80-PMentionInfoLine ewopnkv8">
                        <span data-e2e="comment-at-uniqueid" className="tiktok-ny41l3-SpanInfoUniqueId ewopnkv10">{mention.username}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}

export default function Addcomment(props){
    const {item,parent,user,setlistcomment,listcomment,updatenotify,notify,setitem}=props
    const ref = useRef(null);
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );
   
    const [showemoji,setShowemoji]=useState(false)
    const [state,setState]=useState({text:''})
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [listuser,setListuser]=useState([]);

    const socket=useRef()  
    const naviga=useNavigate()
    useEffect(() => { 
        socket.current = io.connect('https://web-production-eaad.up.railway.app/');
        socket.current.on('message',(e)=>{
            const data = (e.data)
            const count_unread=notify.count_notify_unseen+1
            const count_notify_unseen=count_unread
            const data_unread={count_notify_unseen:count_notify_unseen,send_to:data.send_to}
            updatenotify(data_unread,data.notifi_type)     
        })
    },[listcomment])
    
    const { MentionSuggestions, plugins } = useMemo(() => {
        const mentionPlugin = createMentionPlugin({
          entityMutability: 'IMMUTABLE',
          mentionPrefix: '@',
          supportWhitespace: true,
        });
        // eslint-disable-next-line no-shadow
        const { MentionSuggestions } = mentionPlugin;
        // eslint-disable-next-line no-shadow
        const plugins = [mentionPlugin];
        return { plugins, MentionSuggestions };
      }, []);
  
    useEffect(()=>{
        if(ref!=null&&  ref.current!=null){
            setState({...state,text:ref.current.editor.editor.innerText})
        } 
    },[editorState])

    const onChange = useCallback((editorState) => {
        setEditorState(editorState);
        
    }, []);

    const onOpenChange = useCallback(() => {
        setOpen(!open);
    }, [open]);

    const onSearchChange = useCallback(({ value }) => {
        fetchkeyword(value) 
        setSuggestions(defaultSuggestionsFilter(value, suggestions));
    }, []);

    
    const fetchkeyword=useCallback(debounce((value)=>{
        (async ()=>{
            try{
                const res = await axios.get(`${listfollowingURL}?keyword=${value}`,headers)
                setSuggestions(res.data)
            }
            catch{
                console.log('error')
            }
        })()
    },1000),[])

    
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const entityMap = rawContentState.entityMap;
   
    const listtag=Object.values(entityMap).map(entity => {
        return({id:entity.data.mention.id,username:entity.data.mention.username,name:entity.data.mention.name})
    })
    
   
    const setsubmit=(e)=>{
        (async ()=>{
            try{
                e.preventDefault()
                const listtext=document.querySelectorAll('.public-DraftStyleDefault-block>span')
                let text=[]
                let text_preview=''
                for(let i=0;i<listtext.length;i++){
                    if(listtext[i].classList.contains('m6zwb4v')){
                        text.push({"text":listtext[i].innerText.replace('@',''),"type":"tag"})
                        text_preview+='@'+listtext[i].innerText
                    }
                    else{
                        text.push({"text":listtext[i].innerText,"type":"text"})
                        text_preview+=listtext[i].innerText
                    }
                }
                const caption=JSON.stringify(text)
                let form =new FormData()
                form.append('body',caption)
                form.append('action','comment')
                form.append('text_preview',text_preview)
                Object.values(entityMap).map(entity => {
                    form.append('tag',entity.data.mention.id)
                }); 
                if(parent!=null){
                    form.append('parent_id',parent.id)
                }
                let data={send_by:user.id,send_to:item.user.id,action:'comment'}
                socket.current.emit("sendData",data)
               
                const res = await axios.post(`${actionvideoURL}/${item.id}`,form,headers)
                const commentadd={id:res.data.id,body:caption,count_like:0,count_reply: 0,
                date:new Date().toString(),like: false,parent:parent!=null?parent.id:null,user:user,following: false,tags: listtag}
                
                const listcomments=listcomment.map(item=>{
                    if (parent!=null &&item.id==parent.id){
                        return({...item,count_reply:item.count_reply+1,hidden_reply:false})
                    }
                    return({...item})
                })
                const list_comments=[commentadd,...listcomments]
                setempty()
                const itemedit={...item,count_comment:item.count_comment+1}
                setitem(itemedit)
                setState({...state,text:''})
                setlistcomment(list_comments)
                
            }
            catch{
                console.log('error')
            }
        })()
    }


    const setaddkey=(e,text)=>{  
        setEditorState(insertText(text, editorState));
    }
    
    const setempty=()=>{
        setEditorState(EditorState.createEmpty())
    }
    
   const setshowemoji=(data)=>{
       setShowemoji(data)
   }

    const setemoji = (e,text) => {
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
  return (
    
        <div className="tiktok-a5fzmm-DivCommentContainer e1npxakq0">
            
            <div className="tiktok-1vplah5-DivLayoutContainer e1npxakq1">
               
                <div data-e2e="comment-input" className="tiktok-1vwgyq9-DivInputAreaContainer e1npxakq2">
                {state.text.trim()==''?
                <div class="public-DraftEditorPlaceholder-root">

                    <div class="public-DraftEditorPlaceholder-inner" id="placeholder-f3305" style={{whiteSpace: 'pre-wrap'}}>{parent!=null?`Reply ${parent.user.name}...`:'Add comment...'}</div>
                </div>:''}
                    <div  data-e2e="comment-text" className="tiktok-qpucp9-DivInputEditorContainer e1npxakq3">
                        <Editor
                            editorKey={'editor'}
                            editorState={editorState}
                            onChange={onChange}
                            plugins={plugins}
                            ref={ref}
                        />
                    </div>
                    <div onClick={(e)=>setaddkey(e,' @')} data-e2e="comment-at-icon" className="tiktok-1vi8qz3-DivMentionButton e1npxakq4">
                        <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42C28.0553 42 31.7921 40.6614 34.8006 38.401L35.6001 37.8003C36.0416 37.4686 36.6685 37.5576 37.0003 37.9992L38.2016 39.5981C38.5334 40.0397 38.4443 40.6666 38.0028 40.9983L37.2033 41.599C33.5258 44.3619 28.9513 46 24 46C11.8497 46 2 36.1503 2 24C2 11.8497 11.8497 2 24 2C36.1503 2 46 11.8497 46 24V26C46 30.4843 42.1949 34 37.8438 34C35.1966 34 32.8496 32.7142 31.3935 30.733C29.5649 32.7403 26.9303 34 24 34C18.4772 34 14 29.5228 14 24C14 18.4772 18.4772 14 24 14C29.5228 14 34 18.4772 34 24C34 24.5814 33.9502 25.1528 33.8541 25.7096C33.8473 25.8052 33.8438 25.902 33.8438 26C33.8438 28.2091 35.6347 30 37.8438 30C40.1201 30 42 28.1431 42 26V24C42 14.0589 33.9411 6 24 6ZM24 18C20.6863 18 18 20.6863 18 24C18 27.3137 20.6863 30 24 30C26.9395 30 29.3891 27.8841 29.9013 25.0918C29.9659 24.7392 30 24.3744 30 24C30 20.6863 27.3137 18 24 18Z"></path></svg>
                    </div>
                    <EmojiPicker
                        showemoji={showemoji}
                        setaddkey={(e,text)=>setaddkey(e,text)}
                        setshowemoji={data=>setshowemoji(data)}
                    />
                    <MentionSuggestions
                    open={open}
                    onOpenChange={onOpenChange}
                    suggestions={suggestions}
                    onSearchChange={onSearchChange}
                    onAddMention={(obj) => {
                        setListuser([...listuser,obj.username])
                        
                    }}
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
            <div onClick={(e)=>setsubmit(e)} data-e2e="comment-post" className={`tiktok-${state.text.trim()!=''?'1w3780e':'ywie5h'}-DivPostButton e1npxakq6`}>Post</div>
        </div>
    
  );
}