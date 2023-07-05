import React, { useEffect} from 'react'
import {connect} from 'react-redux'
import { Link,useNavigate } from 'react-router-dom'

const StreamList = (props) => {
    const {item,name}=props
    return (
        <div className="tiktok-xz1ru-DivLiveRecommendedList e170l7ga0">
            <h2 data-e2e="live-recommended-list-title" class="tiktok-3kppgm-H2LiveRecommendedListTitle e170l7ga1">Recommended LIVE videos</h2>
            <div className="tiktok-1ti8nnb-DivLiveRecommendedContainer e170l7ga2">
                {/*/mapvideo*/}
                <div class="tiktok-swtkxg-DivLiveRecommendedCard e170l7ga3">
                    <div class="tiktok-14t4uf5-DivLiveCard e1k6s0zg0">
                        <div data-e2e="hot-live-recommended-card" class="tiktok-e0l6rb-DivCoverContainer e1k6s0zg4">
                            <div class="tiktok-1wogj7e-DivHoverCover e1k6s0zg1">
                                <svg class="tiktok-7we4mq-StyledPlayIcon e1k6s0zg3" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 8.77702C12 6.43812 14.5577 4.99881 16.5569 6.21266L41.6301 21.4356C43.5542 22.6038 43.5542 25.3962 41.6301 26.5644L16.5569 41.7873C14.5577 43.0012 12 41.5619 12 39.223V8.77702Z"></path></svg>
                            </div>
                            <div class="tiktok-bwk4a2-DivLiveCover erlcwop0">
                                <div class="tiktok-ssrxyb-DivCoverBackground erlcwop4">
                                    <img src="https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/4eb79bd179df3757bad8a4349d34f611~c5_720x720.webp?x-expires=1653616800&amp;x-signature=lDs1rycMEnaN4yOZh5ndoLdlxZs%3D" class="tiktok-1hcd8xk-StyledCoverBackgroundImage erlcwop1" style={{display: 'block'}}/>
                                </div>
                                <div class="tiktok-dwlgn1-DivLiveCurtain erlcwop5"></div>
                                <div class="tiktok-3uvkab-DivCoverForeground erlcwop2">
                                    <img src="https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/4eb79bd179df3757bad8a4349d34f611~c5_720x720.webp?x-expires=1653616800&amp;x-signature=lDs1rycMEnaN4yOZh5ndoLdlxZs%3D" class="tiktok-q9h2ie-StyledCoverForegroundImage erlcwop3" style={{display: 'block'}}/>
                                </div>
                            </div>
                            <Link title="may mắn ❤️" to={`/${name}/live`} class="tiktok-i8e8cp-ASEO e13bgxly0"></Link>
                            <div data-e2e="audience-info-tag" class="tiktok-1ji4zh5-DivAudienceTag e1k6s0zg10">
                                <div class="tiktok-l1zllu-DivAudienceTag ecrx3ko0">104 viewers</div>
                            </div>
                            <div class="tiktok-1mexyaw-DivCoverLiveTag e1k6s0zg9">
                                <div data-e2e="live-tag" class="tiktok-1xc692-DivLiveTag exh5ca40">LIVE</div>
                            </div>
                            
                        </div>
                        <div class="tiktok-hb6ys4-DivLiveInfo e1k6s0zg11">
                            <img src="https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/4eb79bd179df3757bad8a4349d34f611~c5_100x100.webp?x-expires=1653616800&amp;x-signature=ytjuE0gBK0ovDH0FQS0USqH9O7g%3D" class="tiktok-172x7q1-StyledAuthorAvatar e1k6s0zg12" style={{display: 'block'}}/>
                            <div class="tiktok-1z0g1ex-DivExtraInfo e1k6s0zg13">
                                <div data-e2e="live-card-title" data-testid="live-card-title" class="tiktok-1pakd6d-DivLiveTitle e1k6s0zg14">may mắn ❤️</div>
                                <div data-e2e="live-card-author-name" data-testid="live-card-author-name" class="tiktok-ibv60y-DivLiveAuthorName e1k6s0zg15">Nguyễn Thuỳ Liiên</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*/mapvideo*/}
            </div>
        </div>   
    )
}


export default StreamList