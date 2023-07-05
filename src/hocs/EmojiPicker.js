import React,{useState,useEffect,useRef,useCallback} from 'react'
function EmojiPicker(props) {
    const {showemoji,setaddkey}=props
    const emoji=[  
        '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','😍','😘',
        '😗','😚','😙','😋','😛','😜','😝','🤑','🤗','🤔','🤐','😐','😑','😶','😏',
        '😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤧','😵',
        '🤠','😎','🤓','😕','😟','🙁','😮','😯','😲','😳','😦','😧','😨','😰','😥',
        '😢','😭','😱','😖','😣','😞','😓','😩','😫','😤','😡','😠','😈','👿','💀',
        '💩','🤡','👹','👺','👻','👽','👾','🤖','😺','😸','😹','😻','😼',
        '😽','🙀','😿','😾']
    const buttonemoji=useRef(null)
    const listemoji=useRef(null)
    const [show,setShow]=useState(false)
    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [show])

    const setemoji=(e,item)=>{
        setaddkey(e,item)
        setShow(false)
    }
    const handleClick = (event) => {
        const { target } = event
        if(listemoji.current!=null){
            if(buttonemoji.current!=null){
            if (!buttonemoji.current.contains(target) && !listemoji.current.contains(target)) {
                setShow(false)
            }
            }
        }
        else{
            if(buttonemoji.current!=null){
                if (!buttonemoji.current.contains(target)) {
                    setShow(false)
                }
            }
        }
    }
    return(
        <>
            <div ref={buttonemoji} onClick={()=>setShow(!show)} data-e2e="comment-emoji-icon" class="tiktok-1yq6goo-DivEmojiButton e1npxakq5">
                <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6ZM2 24C2 11.8497 11.8497 2 24 2C36.1503 2 46 11.8497 46 24C46 36.1503 36.1503 46 24 46C11.8497 46 2 36.1503 2 24Z"></path><path fillRule="evenodd" clipRule="evenodd" d="M17 23C18.6569 23 20 21.2091 20 19C20 16.7909 18.6569 15 17 15C15.3431 15 14 16.7909 14 19C14 21.2091 15.3431 23 17 23Z"></path><path fillRule="evenodd" clipRule="evenodd" d="M31 23C32.6569 23 34 21.2091 34 19C34 16.7909 32.6569 15 31 15C29.3431 15 28 16.7909 28 19C28 21.2091 29.3431 23 31 23Z"></path><path fillRule="evenodd" clipRule="evenodd" d="M16 28.3431C16 31.4673 19.5817 36 24 36C28.4183 36 32 31.4673 32 28.3431C32 25.219 16 25.219 16 28.3431Z"></path></svg>
            </div>
            {show?
            <div ref={listemoji} className="tiktok-gyf7xg-DivEmojiPanelContainer e1npxakq9">
            <div className="tiktok-e6h932-DivEmojiSuggestionContainer egzo34x0">
                <ul class="tiktok-1ev9bi9-UlNavContainer egzo34x1">
                    <li data-index="0" class="tiktok-1t3mdo7-LiItem egzo34x4">😊</li>
                </ul>
                <div className="tiktok-wrdy8i-DivPanelContainer egzo34x2">
                    <ul className="tiktok-ro4el0-UlPanelList egzo34x3">
                        {emoji.map((item,index)=>
                            <li key={index} data-index={index} onClick={(e)=>setemoji(e,item)} class="tiktok-84kww3-LiItem egzo34x4">{item}</li>
                        )}
                    </ul>
                </div>
            </div>
            </div>
            :''}
        </>
    )
}
export default EmojiPicker