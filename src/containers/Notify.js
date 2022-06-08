import { timeago } from "../constants"
import {Link,useNavigate} from "react-router-dom"
const Notify=(props)=>{
    const {item}=props
    const navigate=useNavigate()

    return(
        <div onClick={()=>navigate(`/${item.user.username}/video/${item.video.id}?browsermode=1`)} data-e2e="inbox-list-item" class="tiktok-10p993c-DivItemContainer exfus50">
            <Link onClick={(e)=>{
                    e.stopPropagation()}} to={`/${item.user.username}`}>
                <span shape="circle" class="exfus52 tiktok-9zoew1-SpanAvatarContainer-StyledAvatar e1e9er4e0" style={{width: '48px', height: '48px'}}>
                    <img loading="lazy" src={item.user.picture} class="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                </span>
            </Link>
            <div class="tiktok-14aeum4-DivContentContainer exfus56">
                <Link onClick={(e)=>{
                    e.stopPropagation()}} data-e2e="inbox-title" class="tiktok-f83frn-StyledTitleTextLink exfus59" to={`/${item.user.username}`}>{item.user.username}</Link>
                <p  data-e2e="inbox-content" class="tiktok-1fgb9i6-PDescText exfus510">
                    <span class="tiktok-y7srm0-SpanPrimary exfus511">{item.notification_type==1?`Like your ${item.comment==null?'video':'commented'}.`:item.notification_type==2?'started following you.':item.notification_type==4?`mentioned you in a comment: ${item.text_preview}`:`commented: ${item.text_preview}`}</span>&nbsp;{timeago(item.date)} ago 
                </p>
            </div>
            {item.notification_type!=2?
            <Link to={`/${item.user.username}/video/${item.video.id}?browsermode=1}`}>
                <div class="tiktok-x0r98q-DivVideoCover exfus54" style={{backgroundImage: `url(${item.video.video_preview})`}}>
                </div>
            </Link>:''}
        </div>
    )
}
export default Notify