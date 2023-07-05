import { Navigate, useNavigate } from "react-router"
import { Dayformat, number, timevalue } from "../constants"

const Videobrowser=({item})=>{
    const navigate=useNavigate()
    return(
        <div onClick={()=>navigate(`/${item.user.username}/video/${item.id}?browsermode=1`)} key={item.id} class="tiktok-qdj233-DivItemContainer e1t22qao1">
            <div class="tiktok-5ben2v-DivCoverContainer e1t22qao2">
                <img src={item.video_preview} class="tiktok-ht0ltr-ImgCover e1t22qao3"/>
                <div class="tiktok-i5lz20-DivDuration e1t22qao4">{('0'+item.minutes).slice(-2)}:{('0'+item.seconds).slice(-2)}</div>
            </div>
            <div class="tiktok-1opk22i-DivInfoContent e1t22qao5">
                <div class="tiktok-pcu3qt-DivTitle e1t22qao6">
                    {JSON.parse(item.caption).map(cap=>
                        cap.type=='hashtag'?`#${cap.text}`:cap.type=='tag'?`@${cap.text}`:cap.text
                    )}
                </div>
                <div class="tiktok-1ukkf3c-DivAuthor e1t22qao7">
                    {item.user.username}
                    <span style={{margin: '0px 4px'}}> · </span>
                    <div class="tiktok-1fai8zo-DivDate e1t22qao9">{Dayformat(item.posted)}</div>
                </div>
                <div class="tiktok-qtcipo-DivOtherInfo e1t22qao8">
                    <svg class="tiktok-1490buc-StyledHeart e1t22qao10" width="16" height="16" viewBox="0 0 48 48" fill="rgba(22, 24, 35, 0.75)" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 9.01703C19.0025 3.74266 11.4674 3.736 6.67302 8.56049C1.77566 13.4886 1.77566 21.4735 6.67302 26.4016L22.5814 42.4098C22.9568 42.7876 23.4674 43 24 43C24.5326 43 25.0432 42.7876 25.4186 42.4098L41.327 26.4016C46.2243 21.4735 46.2243 13.4886 41.327 8.56049C36.5326 3.736 28.9975 3.74266 24 9.01703ZM21.4938 12.2118C17.9849 8.07195 12.7825 8.08727 9.51028 11.3801C6.16324 14.7481 6.16324 20.214 9.51028 23.582L24 38.1627L38.4897 23.582C41.8368 20.214 41.8368 14.7481 38.4897 11.3801C35.2175 8.08727 30.0151 8.07195 26.5062 12.2118L26.455 12.2722L25.4186 13.3151C25.0432 13.6929 24.5326 13.9053 24 13.9053C23.4674 13.9053 22.9568 13.6929 22.5814 13.3151L21.545 12.2722L21.4938 12.2118Z"></path></svg>
                    {number(item.count_like)}
                </div>
            </div>
        </div>
    )
}
export default Videobrowser